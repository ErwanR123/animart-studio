import type React from "react";
import { Img, staticFile } from "remotion";
import haussmann from "./rigs/haussmann.json";
import napoleon from "./rigs/napoleon.json";
import casseur from "./rigs/casseur.json";
import rat from "./rigs/rat.json";

// Paper puppets (scripts/rig-cut.py): a figure cut from an archive photo into pieces of paper, each pinned at its
// joint and moved one drawing at a time (the shot's 12-a-second clock), like cut-out animation under a rostrum
// camera. The rest pose is the photo itself; an act gives every joint an angle per drawing. Arms are solved to where
// the hands must be (two-bone IK), so both hands stay on the tool's handle through the whole swing. Two kinds: a
// digger (legs, torso, head, two arms of two pieces: Napoléon III, Haussmann on the same frock coat), a stone-breaker
// (a body, his arms and hammer in one piece pinned at the shoulder: Courbet's) and a rat (body, head, a front and a
// hind leg, a drawn tail).

type Pt = [number, number];
type Part = {
  x: number;
  y: number;
  w: number;
  h: number;
  joint: number[];
  end?: number[];
};
type RigData = {
  width: number;
  height: number;
  parts: Record<string, Part>;
  marks?: Record<string, number[]>;
};
const RIGS = {
  napoleon: { dir: "art/rigs/napoleon", data: napoleon as RigData },
  haussmann: { dir: "art/rigs/haussmann", data: haussmann as RigData },
  rat: { dir: "art/rigs/rat", data: rat as RigData },
  casseur: { dir: "art/rigs/casseur", data: casseur as RigData },
};

// `rig` names the puppet. A stone-breaker raises his hammer and brings it down once a second, like a digger; a digger swings a pickaxe once a second from `delay` s after landing (raised slowly, held,
// struck in one drawing, rebound, chips of stone); a rat scurries, crossing `travel` [dx, dy] shot px in `travel[2]` s.
// `flip` mirrors it (facing the other way).
export type RigLayer = {
  rig: keyof typeof RIGS;
  delay?: number;
  flip?: boolean;
  travel?: [number, number, number];
};
export const isRig = (l: object): l is RigLayer => "rig" in l;

const PICK = {
  src: "art/rigs/pioche.png",
  w: 760,
  h: 520,
  butt: [40, 260] as Pt,
  head: 600,
  tip: 235,
  scale: 1.05,
};
const BACK_GRIP = 140; // px along the handle from the front hand to the back one
const BUTT = 30; // the back hand's distance from the end of the handle

// One swing, keyed on drawings (12 = 1 s): torso and head lean (deg, round the hip and the neck), the body sinks on
// its knees (`drop` px), the front hand's place on the torso (rest px) and the handle's angle (deg, 0 = pointing
// right, 90 = down; unwrapped, so the pick swings back over the shoulder and down the same side).
type Pose = {
  torso: number;
  head: number;
  drop: number;
  hand: Pt;
  handle: number;
};
const SWING: [number, Pose][] = [
  [0, { torso: 0, head: 0, drop: 0, hand: [70, 820], handle: 100 }],
  [3, { torso: 5, head: -4, drop: -6, hand: [-60, 640], handle: 175 }],
  [6, { torso: 10, head: -8, drop: -10, hand: [-40, 300], handle: 245 }],
  [7, { torso: 11, head: -9, drop: -12, hand: [-45, 285], handle: 252 }],
  [9, { torso: -16, head: 8, drop: 34, hand: [40, 900], handle: 122 }],
  [10, { torso: -13, head: 6, drop: 26, hand: [50, 870], handle: 114 }],
  [12, { torso: 0, head: 0, drop: 0, hand: [70, 820], handle: 100 }],
];
const IMPACT = 9; // the drawing where the pick hits
// The stone-breaker's arm (deg round the shoulder, keyed on drawings): raised slowly from the heap, held, struck down
// onto the stones in one drawing, a small rebound (the piece carries his back too: a wider swing would twist it).
const HAMMER: [number, number][] = [
  [0, 15],
  [4, -10],
  [6, -24],
  [7, -27],
  [8, 32],
  [9, 26],
  [10, 29],
  [12, 15],
];
const HAMMER_HIT = 8;
// When a digger's blows land (s, episode clock), for their sound: it starts swinging at `from`, until `until`.
export const rigHits = (l: RigLayer, from: number, until: number) =>
  l.rig === "rat"
    ? []
    : Array.from(
        { length: 12 },
        (_, n) =>
          from +
          (l.delay ?? 0) +
          (l.rig === "casseur" ? HAMMER_HIT : IMPACT) / 12 +
          n,
      ).filter((x) => x < until);

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const pose = (d: number): Pose => {
  const i = SWING.findIndex(([k]) => k > d);
  const [d0, p0] = SWING[i - 1];
  const [d1, p1] = SWING[i];
  const k = (d - d0) / (d1 - d0);
  return {
    torso: lerp(p0.torso, p1.torso, k),
    head: lerp(p0.head, p1.head, k),
    drop: lerp(p0.drop, p1.drop, k),
    hand: [lerp(p0.hand[0], p1.hand[0], k), lerp(p0.hand[1], p1.hand[1], k)],
    handle: lerp(p0.handle, p1.handle, k),
  };
};

const deg = (r: number) => (r * 180) / Math.PI;
const ang = (a: number[], b: number[]) => Math.atan2(b[1] - a[1], b[0] - a[0]);
const dist = (a: number[], b: number[]) => Math.hypot(b[0] - a[0], b[1] - a[1]);

// Two-bone IK: the upper arm's turn round the shoulder and the forearm's round the elbow (relative to the upper arm),
// in deg from the rest pose, to bring the hand to `t`. Of the two ways to bend, the elbow goes out to the side `out`
// (-1 left, 1 right), away from the body, so a raised arm never folds across the face.
const reach = (
  upper: Part,
  fore: Part,
  t: Pt,
  out: 1 | -1,
): [number, number] => {
  const s = upper.joint,
    el = fore.joint,
    wr = fore.end ?? fore.joint;
  const l1 = dist(s, el),
    l2 = dist(el, wr);
  const d = Math.min(l1 + l2 - 1, Math.max(Math.abs(l1 - l2) + 1, dist(s, t)));
  const a = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d));
  const ups = [ang(s, t) + a, ang(s, t) - a];
  const up = Math.cos(ups[0]) * out > Math.cos(ups[1]) * out ? ups[0] : ups[1];
  const e: Pt = [s[0] + l1 * Math.cos(up), s[1] + l1 * Math.sin(up)];
  const upRot = deg(up - ang(s, el));
  return [upRot, deg(ang(e, t) - ang(el, wr)) - upRot];
};

const piece = (dir: string, name: string, p: Part) => (
  <Img
    key={name}
    src={staticFile(`${dir}/${name}.png`)}
    style={{
      position: "absolute",
      left: p.x,
      top: p.y,
      width: p.w,
      height: p.h,
      maxWidth: "none",
    }}
  />
);
const pin = (
  origin: number[],
  rot: number,
  children: React.ReactNode,
  key?: string,
) => (
  <div
    key={key}
    style={{
      position: "absolute",
      inset: 0,
      transformOrigin: `${origin[0]}px ${origin[1]}px`,
      transform: `rotate(${rot}deg)`,
    }}
  >
    {children}
  </div>
);

// Chips of stone thrown up by a blow, one position per drawing (a parabola), gone after half a second.
const CHIPS = [
  [-22, -40, 44],
  [-10, -52, 30],
  [12, -46, 38],
  [26, -32, 28],
  [-32, -26, 24],
  [6, -60, 22],
  [34, -50, 34],
  [-18, -64, 20],
  [20, -20, 26],
];
const Chips: React.FC<{ at: Pt; age: number }> = ({ at, age }) => (
  <>
    {CHIPS.map(([vx, vy, size], i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: at[0] + vx * age * 1.6 - size / 2,
          top: at[1] + (vy * age + 7 * age * age) * 1.6 - size / 2,
          width: size * 1.6,
          height: size * 1.3,
          background: i % 3 ? "#CFC6B4" : "#8C8475",
          clipPath: "polygon(10% 0, 90% 15%, 100% 70%, 55% 100%, 0 80%)",
          transform: `rotate(${i * 47 + age * 40}deg)`,
        }}
      />
    ))}
  </>
);

// A rat's scurry: 4 drawings a stride (3 strides a second). Leg swings (deg) for the near pair, the far pair (darker,
// behind the body) half a stride later; the body bobs, the head sniffs, the tail waves.
const STRIDE = [
  [28, -22, 0],
  [6, 0, -7],
  [-24, 26, 0],
  [6, 0, -7],
]; // hind, front, bob px
const TAIL = "#57463A";
const Rat: React.FC<{ dir: string; data: RigData; d: number }> = ({
  dir,
  data,
  d,
}) => {
  const P = data.parts;
  const [h, f, bob] = STRIDE[d % 4];
  const [hf, ff] = STRIDE[(d + 2) % 4];
  const root = data.marks?.tail ?? [0, 0];
  const pts = Array.from({ length: 25 }, (_, i) => {
    const u = i / 24;
    return [
      root[0] - u * 470,
      root[1] + bob + u * 70 + Math.sin(u * 5 - d * 1.6) * 60 * u,
    ] as Pt;
  });
  // The tail as a tapering ribbon: each side offset along the normals.
  const side = (sg: number) =>
    pts.map((q, i) => {
      const a = ang(pts[Math.max(0, i - 1)], pts[Math.min(24, i + 1)]);
      const w = (13 - i * 0.42) * sg;
      return `${(q[0] - Math.sin(a) * w).toFixed(1)},${(q[1] + Math.cos(a) * w).toFixed(1)}`;
    });
  const tail = `M${side(1).join(" L")} L${side(-1).reverse().join(" L")} Z`;
  const far = { filter: "brightness(0.6)" };
  return (
    <>
      <svg
        width={data.width}
        height={data.height}
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      >
        <path
          d={tail}
          fill={TAIL}
          stroke="#F6F2E9"
          strokeWidth={10}
          strokeLinejoin="round"
          paintOrder="stroke"
        />
      </svg>
      <div style={far}>
        {pin(P.hind.joint, hf, piece(dir, "hind", P.hind))}
        {pin(P.front.joint, ff, piece(dir, "front", P.front))}
      </div>
      {pin(P.hind.joint, h, piece(dir, "hind", P.hind))}
      {pin(P.front.joint, f, piece(dir, "front", P.front))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${bob}px) rotate(${d % 2 ? -1.5 : 1}deg)`,
          transformOrigin: `${P.body.joint[0]}px ${P.body.joint[1]}px`,
        }}
      >
        {piece(dir, "body", P.body)}
        {pin(P.head.joint, [0, -6, 3, -3][d % 4], piece(dir, "head", P.head))}
      </div>
    </>
  );
};

export const Rig: React.FC<{
  l: RigLayer & { w?: number };
  e: number;
  start: number;
  style: React.CSSProperties;
}> = ({ l, e, start, style }) => {
  const { dir, data } = RIGS[l.rig];
  const k = (l.w ?? data.width) / data.width;
  const frame = (children: React.ReactNode, move = "") => (
    <div
      style={{
        ...style,
        width: data.width * k,
        height: data.height * k,
        transform: `${style.transform ?? ""} ${move}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: data.width,
          height: data.height,
          transformOrigin: "0 0",
          transform: `scale(${k})${l.flip ? ` translateX(${data.width}px) scaleX(-1)` : ""}`,
        }}
      >
        {children}
      </div>
    </div>
  );
  if (l.rig === "rat") {
    const [tx, ty, secs] = l.travel ?? [0, 0, 1];
    const u = Math.min(1, e / secs);
    return frame(
      <Rat dir={dir} data={data} d={u < 1 ? Math.floor(e * 12) : 1} />,
      `translate(${tx * u}px, ${ty * u}px)`,
    );
  }
  if (l.rig === "casseur")
    return (
      <Breaker
        dir={dir}
        data={data}
        t={e - start - (l.delay ?? 0)}
        frame={frame}
      />
    );
  return (
    <Digger
      dir={dir}
      data={data}
      t={e - start - (l.delay ?? 0)}
      frame={frame}
    />
  );
};

const Breaker: React.FC<{
  dir: string;
  data: RigData;
  t: number;
  frame: (c: React.ReactNode) => React.ReactNode;
}> = ({ dir, data, t, frame }) => {
  const P = data.parts;
  const d = t < 0 ? 0 : Math.floor(t * 12) % 12;
  const i = HAMMER.findIndex(([k]) => k > d);
  const [d0, a0] = HAMMER[i - 1];
  const [d1, a1] = HAMMER[i];
  const a = lerp(a0, a1, (d - d0) / (d1 - d0));
  // The hammer's head at the blow, round the shoulder: the heap of stones lies under it, the chips fly from there.
  const [sx, sy] = P.arm.joint;
  const [hx, hy] = data.marks?.head ?? P.arm.joint;
  const r = (HAMMER.find(([k]) => k === HAMMER_HIT)![1] * Math.PI) / 180;
  const head: Pt = [
    sx + (hx - sx) * Math.cos(r) - (hy - sy) * Math.sin(r),
    sy + (hx - sx) * Math.sin(r) + (hy - sy) * Math.cos(r) + 60,
  ];
  const age = t * 12 >= HAMMER_HIT ? (d - HAMMER_HIT + 12) % 12 : 99;
  const blows =
    t * 12 >= HAMMER_HIT ? Math.floor((t * 12 - HAMMER_HIT) / 12) + 1 : 0;
  return frame(
    <>
      {piece(dir, "body", P.body)}
      <Heap at={head} foot={data.height - 20} blows={blows} />
      {pin(P.arm.joint, a, piece(dir, "arm", P.arm))}
      {age < 4 ? <Dust at={head} age={age} /> : null}
      {age < 6 ? <Chips at={head} age={age} /> : null}
    </>,
  );
};

// The heap a stone-breaker works at, piled from the ground (`foot`, rig px) up to its top block under the hammer at
// `at`: the first blow cracks the block, the second splits it in two; every blow adds gravel round the block.
const GREYS = ["#A79D88", "#C9BFA9", "#958B77", "#BDB39D"];
const Heap: React.FC<{ at: Pt; foot: number; blows: number }> = ({
  at,
  foot,
  blows,
}) => {
  const split = blows >= 2 ? 1 : 0;
  const crack = blows ? "M 0 -55 L -8 -30 L 6 -10 L -4 15 L 8 40" : "";
  const rows = Math.ceil((foot - at[1] - 40) / 60);
  const stones = Array.from({ length: rows }, (_, r) => {
    const y = 100 + r * 60;
    const half = 70 + Math.sqrt(y / (foot - at[1])) * 170;
    const n = Math.round(half / 40);
    return Array.from({ length: n }, (_, k) => [
      -half + ((k + 0.5) * 2 * half) / n + ((r * 37 + k * 23) % 40) - 20,
      y + ((r * 11 + k * 31) % 24) - 12,
      55 + ((r * 13 + k * 29) % 50),
    ]);
  }).flat();
  return (
    <svg
      width={1}
      height={1}
      style={{
        position: "absolute",
        left: at[0],
        top: at[1],
        overflow: "visible",
      }}
    >
      {stones.map(([x, y, sz], i) => (
        <polygon
          key={i}
          points={`${x - sz / 2},${y} ${x - sz * 0.4},${y - sz * 0.55} ${x + sz * 0.1},${y - sz * 0.7} ${x + sz / 2},${y - sz * 0.45} ${x + sz * 0.45},${y}`}
          fill={GREYS[(i * 7) % 4]}
          transform={`rotate(${((i * 47) % 50) - 25} ${x} ${y - sz / 3})`}
          stroke="#F6F2E9"
          strokeWidth={7}
          strokeLinejoin="round"
        />
      ))}
      {Array.from({ length: Math.min(blows, 6) * 4 }, (_, i) => (
        <circle
          key={i}
          cx={-120 + ((i * 53) % 240)}
          cy={78 - ((i * 17) % 18)}
          r={6 + (i % 3) * 3}
          fill={i % 2 ? "#8C8475" : "#CFC6B4"}
        />
      ))}
      {[-1, 1].map((side) => (
        <g
          key={side}
          transform={`translate(${side * 14 * split} ${4 * split}) rotate(${side * 9 * split})`}
        >
          <polygon
            points={
              side < 0
                ? "-95,60 -85,-45 0,-60 6,-10 -4,15 8,60"
                : "0,-60 80,-50 95,60 8,60 -4,15 6,-10"
            }
            fill="#D8CFBB"
            stroke="#F6F2E9"
            strokeWidth={8}
            strokeLinejoin="round"
          />
        </g>
      ))}
      {split ? null : (
        <path
          d={crack}
          stroke="#3A342B"
          strokeWidth={6}
          fill="none"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
};

// A puff of stone dust from a blow, swelling and fading over four drawings.
const Dust: React.FC<{ at: Pt; age: number }> = ({ at, age }) => (
  <>
    {[-50, 0, 50].map((dx, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: at[0] + dx * (1 + age * 0.5) - (40 + age * 22),
          top: at[1] - 30 - age * 12 - (40 + age * 22),
          width: 2 * (40 + age * 22),
          height: 2 * (40 + age * 22),
          borderRadius: "50%",
          background: "#E8E0CE",
          opacity: 0.5 - age * 0.11,
        }}
      />
    ))}
  </>
);

const Digger: React.FC<{
  dir: string;
  data: RigData;
  t: number;
  frame: (c: React.ReactNode) => React.ReactNode;
}> = ({ dir, data, t, frame }) => {
  const P = data.parts;
  const d = t < 0 ? 0 : Math.floor(t * 12) % 12;
  const p = pose(d);
  const dx = Math.cos((p.handle * Math.PI) / 180),
    dy = Math.sin((p.handle * Math.PI) / 180);
  const back: Pt = [p.hand[0] - BACK_GRIP * dx, p.hand[1] - BACK_GRIP * dy];
  const butt: Pt = [back[0] - BUTT * dx, back[1] - BUTT * dy];
  const [fu, ff] = reach(P.upper, P.fore, p.hand, -1);
  const [bu, bf] = reach(P.backUpper, P.backFore, back, 1);
  // Where the lower point of the pick lands, on the rig's canvas: the chips of stone fly from there after each blow.
  const hip = P.torso.joint;
  const rot = (q: Pt, a: number): Pt => {
    const r = (a * Math.PI) / 180,
      x = q[0] - hip[0],
      y = q[1] - hip[1];
    return [
      hip[0] + x * Math.cos(r) - y * Math.sin(r),
      hip[1] + x * Math.sin(r) + y * Math.cos(r) + p.drop,
    ];
  };
  const along = (PICK.head - 60) * PICK.scale,
    across = PICK.tip * PICK.scale;
  const tips: Pt[] = [1, -1].map((sg) =>
    rot(
      [
        butt[0] + along * dx - sg * across * dy,
        butt[1] + along * dy + sg * across * dx,
      ],
      p.torso,
    ),
  );
  const age = t * 12 >= IMPACT ? (d - IMPACT + 12) % 12 : 99;
  return frame(
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: `0 ${P.legs.y + P.legs.h}px`,
          transform: `scaleY(${1 - p.drop / P.legs.h})`,
        }}
      >
        {piece(dir, "legs", P.legs)}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${p.drop}px)`,
        }}
      >
        {pin(P.torso.joint, p.torso, [
          pin(
            P.backUpper.joint,
            bu,
            [
              piece(dir, "backUpper", P.backUpper),
              pin(
                P.backFore.joint,
                bf,
                piece(dir, "backFore", P.backFore),
                "bf",
              ),
            ],
            "bu",
          ),
          piece(dir, "torso", P.torso),
          pin(P.head.joint, p.head, piece(dir, "head", P.head), "head"),
          <Img
            key="pick"
            src={staticFile(PICK.src)}
            style={{
              position: "absolute",
              left: butt[0] - PICK.butt[0] * PICK.scale,
              top: butt[1] - PICK.butt[1] * PICK.scale,
              width: PICK.w * PICK.scale,
              maxWidth: "none",
              transformOrigin: `${PICK.butt[0] * PICK.scale}px ${PICK.butt[1] * PICK.scale}px`,
              transform: `rotate(${p.handle}deg)`,
            }}
          />,
          pin(
            P.upper.joint,
            fu,
            [
              piece(dir, "upper", P.upper),
              pin(P.fore.joint, ff, piece(dir, "fore", P.fore), "ff"),
            ],
            "fu",
          ),
        ])}
      </div>
      {age < 6 ? (
        <Chips at={tips[0][1] > tips[1][1] ? tips[0] : tips[1]} age={age} />
      ) : null}
    </>,
  );
};
