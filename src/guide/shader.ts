import { createEffect } from "remotion";

// One WebGL2 pass over an image of the painting, computed in painting space: a liquid flow (the paint drifting like
// Munch's lines). With a stacked source (the painting over its depth map, scripts/image-depth.py) the near planes stay still,
// so the paint waves round a figure who does not move. The only shader effect kept: shockwaves, the 3D camera and the
// zoom blur read as "IA" and were removed (bible/art-direction.md).
// Every input is a parameter: the frame is a pure function of them.

export type PaintFxParams = {
  box: [number, number, number, number]; // this image in painting fractions (x, y, w, h)
  ar: number; // painting width / height
  flow: number; // painting widths
  time: number; // seconds (drives the flow)
  stacked: boolean; // the source is the painting (top half) over its depth map (bottom half)
};

type State = { gl: WebGL2RenderingContext; program: WebGLProgram; vao: WebGLVertexArrayObject; vbo: WebGLBuffer; texture: WebGLTexture };

const VS = `#version 300 es
layout(location = 0) in vec2 aPos;
layout(location = 1) in vec2 aUv;
out vec2 vUv;
void main() { vUv = aUv; gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FS = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uSource;
uniform vec4 uBox;
uniform float uAr;
uniform float uFlow;
uniform float uTime;
uniform float uStacked;

// The texture is bottom-up, painting space is y-down. A stacked source keeps the paint in its top half.
vec4 sampleAt(vec2 p) {
  vec2 uv = (p - uBox.xy) / uBox.zw;
  if (uStacked > 0.5) uv = clamp(uv, 0.0, 1.0); // the flow may look past the edge: stretch it, never a hole
  else if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return vec4(0.0);
  return texture(uSource, vec2(uv.x, 1.0 - (uStacked > 0.5 ? uv.y * 0.5 : uv.y)));
}
float depthAt(vec2 p) {
  vec2 uv = clamp((p - uBox.xy) / uBox.zw, 0.0, 1.0);
  return texture(uSource, vec2(uv.x, 1.0 - (0.5 + uv.y * 0.5))).r;
}

void main() {
  vec2 img = vec2(vUv.x, 1.0 - vUv.y);
  vec2 p = uBox.xy + img * uBox.zw; // painting fractions, y down
  float near = uStacked > 0.5 ? smoothstep(0.62, 0.85, depthAt(p)) : 0.0;
  vec2 q = vec2(p.x * uAr, p.y);   // isotropic (painting heights)
  vec2 offset = vec2(0.0);
  if (uFlow > 0.0 && near < 1.0) {
    // Two drifting octaves, mostly along the bands (the sky and the fjord flow sideways).
    offset = uFlow * uAr * vec2(
      sin(q.y * 21.0 + uTime * 1.7) + 0.5 * sin(q.y * 47.0 - uTime * 2.3 + q.x * 9.0),
      0.6 * sin(q.x * 17.0 + uTime * 1.3 + q.y * 5.0) + 0.3 * sin(q.x * 39.0 - uTime * 1.9)) * (1.0 - near);
  }
  fragColor = sampleAt(p + vec2(offset.x / uAr, offset.y));
}`;

const compile = (gl: WebGL2RenderingContext, type: number, src: string) => {
  const sh = gl.createShader(type);
  if (!sh) throw new Error("paintFx: createShader failed");
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(`paintFx shader: ${gl.getShaderInfoLog(sh)}`);
  return sh;
};

export const paintFx = createEffect<PaintFxParams, State>({
  type: "ai.animart.paintFx",
  label: "paintFx()",
  documentationLink: null,
  backend: "webgl2",
  calculateKey: (p) => JSON.stringify(p),
  setup: (target) => {
    const gl = target.getContext("webgl2", { premultipliedAlpha: true, alpha: true, preserveDrawingBuffer: true });
    if (!gl) throw new Error("paintFx: WebGL2 unavailable (render with --gl=angle)");
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    const program = gl.createProgram();
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VS));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(`paintFx link: ${gl.getProgramInfoLog(program)}`);
    const vao = gl.createVertexArray();
    const vbo = gl.createBuffer();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, 1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return { gl, program, vao, vbo, texture };
  },
  apply: ({ source, width, height, params, state, flipSourceY }) => {
    const { gl, program, vao, texture } = state;
    gl.viewport(0, 0, width, height);
    // As in Remotion's own blur: the upload flips when asked, so the texture is always bottom-up like the canvas.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipSourceY);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source as TexImageSource);
    gl.useProgram(program);
    const u = (name: string) => gl.getUniformLocation(program, name);
    gl.uniform1i(u("uSource"), 0);
    gl.uniform4f(u("uBox"), ...params.box);
    gl.uniform1f(u("uAr"), params.ar);
    gl.uniform1f(u("uFlow"), params.flow);
    gl.uniform1f(u("uTime"), params.time);
    gl.uniform1f(u("uStacked"), params.stacked ? 1 : 0);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  },
  cleanup: ({ gl, program, vao, vbo, texture }) => {
    gl.deleteTexture(texture);
    gl.deleteBuffer(vbo);
    gl.deleteVertexArray(vao);
    gl.deleteProgram(program);
  },
  schema: {},
  validateParams: () => undefined,
});
