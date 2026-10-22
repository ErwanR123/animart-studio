import type React from "react";
import { Img, staticFile } from "remotion";

// A room built in CSS 3D from its four frescoes (e.g. the Stanza della Segnatura): the camera can stand close to a
// wall, turn round the room from its centre (a wide lens shows each fresco whole) and pull back into a fresco.
// World units are CSS px (1 cm ≈ 4 px). x right, y down, z towards the viewer at rest; the camera looks along -z
// when yaw = 0 (the front wall), +x at 90°, +z at 180° (the back wall). Pitch < 0 looks down.

export type RoomWall = { src: string; width: number; height: number; label: string }; // label: shown by the caller
// `focal`: perspective distance in px (small = wide angle).
export type Cam = { tx: number; ty: number; tz: number; yaw: number; pitch: number; dist: number; focal: number };

const X = 3520; // front/back wall width
const D = 2720; // side wall width (room depth)
const FLOOR = 1200;
const TOP = -1700;
const FRESCO_W = 3080;
const FRESCO_BOTTOM = 560;

// Wall i: 0 front (z = -D/2, faces +z), 1 right (x = +X/2), 2 back (z = +D/2), 3 left (x = -X/2). All face inwards.
const WALLS = [
  { w: X, x: 0, z: -D / 2, rot: 0 },
  { w: D, x: X / 2, z: 0, rot: -90 },
  { w: X, x: 0, z: D / 2, rot: 180 },
  { w: D, x: -X / 2, z: 0, rot: 90 },
];
const yawOf = (i: number) => (360 - WALLS[i].rot) % 360;

// The fresco's rectangle on its wall, in wall-local px (origin top-left of the wall).
const frescoRect = (i: number, wall: RoomWall) => {
  const w = i % 2 === 0 ? FRESCO_W : WALLS[i].w; // side walls: whole-wall photos (window included)
  const h = w / (wall.width / wall.height);
  const bottom = i % 2 === 0 ? FRESCO_BOTTOM : TOP + 200 + h;
  return { left: (WALLS[i].w - w) / 2, top: bottom - h - TOP, w, h };
};

// World point of (fx, fy) on wall i's fresco.
export const wallPoint = (i: number, wall: RoomWall, fx: number, fy: number) => {
  const r = frescoRect(i, wall);
  const u = r.left + fx * r.w - WALLS[i].w / 2; // along the wall, left to right as seen from inside
  const y = TOP + r.top + fy * r.h;
  const a = (WALLS[i].rot * Math.PI) / 180;
  return { x: WALLS[i].x + u * Math.cos(a), y, z: WALLS[i].z - u * Math.sin(a) };
};

// Camera framing a fresco point straight on, `width` world px of wall across the screen, the point at screen (sx, sy).
export const facing = (i: number, wall: RoomWall, fx: number, fy: number, width: number, sx = 540, sy = 960, focal = 1500): Cam => {
  const p = wallPoint(i, wall, fx, fy);
  const dist = (focal * width) / 1080;
  const s = focal / dist;
  const a = (WALLS[i].rot * Math.PI) / 180;
  // Shift the look-at point so the fresco point lands at (sx, sy) instead of the screen centre.
  const du = (540 - sx) / s;
  const dy = (960 - sy) / s;
  return { tx: p.x + du * Math.cos(a), ty: p.y + dy, tz: p.z - du * Math.sin(a), yaw: yawOf(i), pitch: 0, dist, focal };
};

// From the middle of the room, a wide lens on wall i: its fresco `screenW` px wide, centred on screen.
export const fromCentre = (i: number, wall: RoomWall, screenW = 1000): Cam => {
  const p = wallPoint(i, wall, 0.5, 0.5);
  const dist = i % 2 === 0 ? D / 2 : X / 2;
  return { tx: p.x, ty: p.y, tz: p.z, yaw: yawOf(i), pitch: 0, dist, focal: (screenW * dist) / frescoRect(i, wall).w };
};

// Blend of two cameras (yaw in degrees, unwrapped by the caller; distances and focals blend geometrically).
export const mixCam = (a: Cam, b: Cam, p: number): Cam => {
  const geo = (x: number, y: number) => Math.exp(Math.log(x) + (Math.log(y) - Math.log(x)) * p);
  return {
    tx: a.tx + (b.tx - a.tx) * p,
    ty: a.ty + (b.ty - a.ty) * p,
    tz: a.tz + (b.tz - a.tz) * p,
    yaw: a.yaw + (b.yaw - a.yaw) * p,
    pitch: a.pitch + (b.pitch - a.pitch) * p,
    dist: geo(a.dist, b.dist),
    focal: geo(a.focal, b.focal),
  };
};

// `solo`: only the front wall. For a camera straight on it, far from it: the other walls and the floor reach behind
// the camera there, and Chrome projects those parts as black slabs across the screen.
export const Room: React.FC<{ cam: Cam; walls: RoomWall[]; lit: number[]; blur?: number; solo?: boolean }> = ({ cam, walls, lit, blur = 0, solo = false }) => {
  const th = (cam.pitch * Math.PI) / 180;
  const ps = (cam.yaw * Math.PI) / 180;
  const v = { x: Math.cos(th) * Math.sin(ps), y: -Math.sin(th), z: -Math.cos(th) * Math.cos(ps) };
  const c = { x: cam.tx - cam.dist * v.x, y: cam.ty - cam.dist * v.y, z: cam.tz - cam.dist * v.z };
  const face: React.CSSProperties = { position: "absolute", left: 0, top: 0, backfaceVisibility: "hidden", transformStyle: "preserve-3d" };
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
      <div style={{ position: "absolute", inset: 0, perspective: cam.focal, perspectiveOrigin: "540px 960px" }}>
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 960,
            transformStyle: "preserve-3d",
            transform: `translateZ(${cam.focal}px) rotateX(${cam.pitch}deg) rotateY(${cam.yaw}deg) translate3d(${-c.x}px, ${-c.y}px, ${-c.z}px)`,
          }}
        >
          {/* Floor: the stanza's marble pavement, simplified to a dark chequer. */}
          {solo ? null : <div
            style={{
              ...face,
              backfaceVisibility: "visible",
              width: X,
              height: D,
              transform: `translate3d(${-X / 2}px, ${FLOOR - D / 2}px, 0) rotateX(90deg)`,
              background: "repeating-conic-gradient(#2B231A 0 25%, #3B3125 0 50%) 0 0 / 340px 340px",
            }}
          />}
          {/* Ceiling: a dark vault with a gilded frame, so the wide lens never looks into a void. */}
          {solo ? null : <div
            style={{
              ...face,
              backfaceVisibility: "visible",
              width: X,
              height: D,
              transform: `translate3d(${-X / 2}px, ${TOP - D / 2}px, 0) rotateX(90deg)`,
              background: "radial-gradient(ellipse at 50% 50%, #3A3020 0%, #241D13 60%, #17120C 100%)",
              boxShadow: "inset 0 0 0 60px #2A2116, inset 0 0 0 80px #8A6A2E",
            }}
          />}
          {(solo ? walls.slice(0, 1) : walls).map((wall, i) => {
            const g = WALLS[i];
            const r = frescoRect(i, wall);
            const l = lit[i] ?? 0;
            return (
              <div
                key={wall.src}
                style={{
                  ...face,
                  width: g.w,
                  height: FLOOR - TOP,
                  transform: `translate3d(${g.x - g.w / 2}px, ${TOP}px, ${g.z}px) rotateY(${g.rot}deg)`,
                  transformOrigin: `${g.w / 2}px 0`,
                  background: "linear-gradient(180deg, #5A4A33 0%, #4A3C2A 70%, #2E261B 100%)",
                  filter: `brightness(${0.45 + 0.6 * l})`,
                }}
              >
                <Img
                  src={staticFile(wall.src)}
                  style={{
                    position: "absolute",
                    left: r.left,
                    top: r.top,
                    width: r.w,
                    height: r.h,
                    maxWidth: "none",
                    borderRadius: i % 2 === 0 ? `50% 50% 0 0 / ${(r.w / 2 / r.h) * 100 * 0.62}% ${(r.w / 2 / r.h) * 100 * 0.62}% 0 0` : `50% 50% 0 0 / 30% 30% 0 0`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
