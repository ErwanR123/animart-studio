import type React from "react";
import { usePalette } from "./decor";

// Drawn scenery for collage shots, in flat cut paper (the Vox register): a Haussmann facade built floor by floor, a
// bucket emptied out of a window, flies, a barricade, a building site's ground and scaffolding, fire. Everything moves on the shot's 12-a-second clock (`e` arrives
// already stepped).

// The facade's floors, bottom to top, and their heights at 1000 px wide: shops, the low entresol, the noble 2nd floor
// with its long balcony, the 3rd and 4th, the 5th with its balcony, the zinc mansard roof with its maids' rooms.
export type Floor = "rdc" | "1" | "2" | "3" | "4" | "5" | "toit";
export const FLOOR_H: Record<Floor, number> = {
  rdc: 180,
  1: 100,
  2: 165,
  3: 135,
  4: 130,
  5: 120,
  toit: 170,
};

export type SceneryLayer =
  // One floor of a Haussmann building, `w` wide (stack them with FLOOR_H; each can `lift` like a piece).
  | { facade: Floor }
  // An arm with a wooden bucket leans out of a window and empties it: the slops fall `pour` px to the street and
  // splash into a spreading puddle (the arm comes out on landing, tips at 0.3 s, pours for a second).
  | { pour: number }
  // `flies` flies buzzing over a spot `w` px across.
  | { flies: number }
  // A barricade, `w` wide: heaped paving stones, an overturned cart, a barrel, beams, a red flag in the wind.
  | { barricade: true }
  // A strip of trodden earth `w` wide with loose stones: the ground a building site stands on.
  | { ground: true }
  // Wooden scaffolding `w` wide and `scaffold` px tall: poles, planks at every level, a ladder.
  | { scaffold: number }
  // `flames` tongues of fire in cut paper `w` wide (each one to two times its width tall), flaring and flickering (two
  // drawings), rising from their foot.
  | { flames: number };
export const isScenery = (l: object): l is SceneryLayer =>
  ["facade", "pour", "flies", "barricade", "ground", "scaffold", "flames"].some(
    (k) => k in l,
  );

const STONE = "#E8DCC2";
const JOINT = "#CDBE9F";
const LEDGE = "#D3C3A2";
const SHADOW = "#9C8B6C";
const GLASS = "#2F3B47";
const FRAME = "#F4ECDC";
const IRON = "#1F1F1F";
const ZINC = "#7F8C99";
const BAYS = [0, 1, 2, 3, 4, 5].map((i) => (i + 0.5) * (1000 / 6));

const rnd = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const Window: React.FC<{ cx: number; y: number; w: number; h: number }> = ({
  cx,
  y,
  w,
  h,
}) => (
  <g>
    <rect
      x={cx - w / 2}
      y={y}
      width={w}
      height={h}
      fill={GLASS}
      stroke={FRAME}
      strokeWidth={6}
    />
    <line x1={cx} y1={y} x2={cx} y2={y + h} stroke={FRAME} strokeWidth={4} />
    <line
      x1={cx - w / 2}
      y1={y + h * 0.3}
      x2={cx + w / 2}
      y2={y + h * 0.3}
      stroke={FRAME}
      strokeWidth={4}
    />
  </g>
);

// A wrought-iron railing from x1 to x2 between y and y + h.
const Railing: React.FC<{ x1: number; x2: number; y: number; h: number }> = ({
  x1,
  x2,
  y,
  h,
}) => (
  <g>
    <rect
      x={x1 - 6}
      y={y + h}
      width={x2 - x1 + 12}
      height={9}
      fill={LEDGE}
      stroke={SHADOW}
      strokeWidth={2}
    />
    <line x1={x1} y1={y} x2={x2} y2={y} stroke={IRON} strokeWidth={5} />
    <line
      x1={x1}
      y1={y + h - 3}
      x2={x2}
      y2={y + h - 3}
      stroke={IRON}
      strokeWidth={3}
    />
    {Array.from({ length: Math.floor((x2 - x1) / 9) + 1 }, (_, k) => (
      <line
        key={k}
        x1={x1 + k * 9}
        y1={y}
        x2={x1 + k * 9}
        y2={y + h}
        stroke={IRON}
        strokeWidth={2}
      />
    ))}
  </g>
);

const Ledge: React.FC<{ y: number }> = ({ y }) => (
  <g>
    <rect x={0} y={y} width={1000} height={12} fill={LEDGE} />
    <line
      x1={0}
      y1={y + 12}
      x2={1000}
      y2={y + 12}
      stroke={SHADOW}
      strokeWidth={3}
    />
  </g>
);

const FloorArt: React.FC<{ f: Floor; c: (name: string) => string }> = ({
  f,
  c,
}) => {
  const h = FLOOR_H[f];
  if (f === "toit")
    return (
      <g>
        {[180, 560, 860].map((x) => (
          <g key={x}>
            <rect
              x={x}
              y={0}
              width={60}
              height={60}
              fill="#B66A4E"
              stroke="#7A3F2C"
              strokeWidth={3}
            />
            {[0, 1, 2].map((k) => (
              <rect
                key={k}
                x={x + 6 + k * 18}
                y={-14}
                width={12}
                height={16}
                fill="#9A5640"
              />
            ))}
          </g>
        ))}
        <polygon points={`0,${h} 50,40 950,40 1000,${h}`} fill={ZINC} />
        {Array.from({ length: 40 }, (_, k) => (
          <line
            key={k}
            x1={25 + k * 24}
            y1={44}
            x2={25 + k * 24 + (k * 24 - 475) * 0.05}
            y2={h}
            stroke="#6C7884"
            strokeWidth={2}
          />
        ))}
        <line
          x1={50}
          y1={40}
          x2={950}
          y2={40}
          stroke="#5D6873"
          strokeWidth={5}
        />
        {BAYS.map((cx) => (
          <g key={cx}>
            <path
              d={`M ${cx - 48} ${h} L ${cx - 48} 78 Q ${cx} 44 ${cx + 48} 78 L ${cx + 48} ${h} Z`}
              fill={STONE}
              stroke={SHADOW}
              strokeWidth={3}
            />
            <Window cx={cx} y={88} w={56} h={64} />
          </g>
        ))}
      </g>
    );
  return (
    <g>
      <rect x={0} y={0} width={1000} height={h} fill={STONE} />
      {(f === "rdc" || f === "1") &&
        Array.from({ length: Math.floor(h / 24) }, (_, k) => (
          <line
            key={k}
            x1={0}
            y1={(k + 1) * 24}
            x2={1000}
            y2={(k + 1) * 24}
            stroke={JOINT}
            strokeWidth={2}
          />
        ))}
      {f === "rdc" ? (
        <g>
          {[0, 4].map((b) => (
            <g key={b}>
              <rect
                x={BAYS[b] - 70}
                y={16}
                width={BAYS[b + 1] - BAYS[b] + 140}
                height={34}
                fill="#5B2A2A"
              />
              <text
                x={(BAYS[b] + BAYS[b + 1]) / 2}
                y={42}
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontWeight={700}
                fontSize={26}
                fill={FRAME}
                letterSpacing={4}
              >
                {b ? "CAFÉ" : "BOULANGERIE"}
              </text>
              <rect
                x={BAYS[b] - 66}
                y={58}
                width={BAYS[b + 1] - BAYS[b] + 132}
                height={h - 58}
                fill="#3A3530"
                stroke={FRAME}
                strokeWidth={5}
              />
              {[1, 2, 3].map((k) => (
                <line
                  key={k}
                  x1={BAYS[b] - 66 + (k * (BAYS[b + 1] - BAYS[b] + 132)) / 4}
                  y1={58}
                  x2={BAYS[b] - 66 + (k * (BAYS[b + 1] - BAYS[b] + 132)) / 4}
                  y2={h}
                  stroke={FRAME}
                  strokeWidth={3}
                />
              ))}
            </g>
          ))}
          {/* The carriage door in the middle, arched. */}
          <path
            d={`M 420 ${h} L 420 70 Q 500 10 580 70 L 580 ${h} Z`}
            fill="#4A3526"
            stroke={FRAME}
            strokeWidth={5}
          />
          <line
            x1={500}
            y1={40}
            x2={500}
            y2={h}
            stroke="#2E2018"
            strokeWidth={4}
          />
        </g>
      ) : f === "1" ? (
        BAYS.map((cx) => <Window key={cx} cx={cx} y={22} w={80} h={56} />)
      ) : f === "2" ? (
        <g>
          {BAYS.map((cx, i) => (
            <g key={cx}>
              {i % 2 ? (
                <path
                  d={`M ${cx - 50} 26 Q ${cx} 2 ${cx + 50} 26 Z`}
                  fill={LEDGE}
                  stroke={SHADOW}
                  strokeWidth={3}
                />
              ) : (
                <polygon
                  points={`${cx - 52},26 ${cx},4 ${cx + 52},26`}
                  fill={LEDGE}
                  stroke={SHADOW}
                  strokeWidth={3}
                />
              )}
              <Window cx={cx} y={32} w={74} h={112} />
            </g>
          ))}
          <Railing x1={20} x2={980} y={112} h={36} />
        </g>
      ) : f === "3" ? (
        BAYS.map((cx) => (
          <g key={cx}>
            <rect
              x={cx - 48}
              y={10}
              width={96}
              height={10}
              fill={LEDGE}
              stroke={SHADOW}
              strokeWidth={2}
            />
            <Window cx={cx} y={24} w={70} h={96} />
            <Railing x1={cx - 42} x2={cx + 42} y={92} h={24} />
          </g>
        ))
      ) : f === "4" ? (
        BAYS.map((cx) => (
          <g key={cx}>
            <rect x={cx - 44} y={12} width={88} height={8} fill={LEDGE} />
            <Window cx={cx} y={22} w={68} h={92} />
          </g>
        ))
      ) : (
        <g>
          {BAYS.map((cx) => (
            <Window key={cx} cx={cx} y={14} w={64} h={82} />
          ))}
          <Railing x1={20} x2={980} y={70} h={32} />
        </g>
      )}
      {f !== "rdc" ? <Ledge y={h - 12} /> : null}
      <rect
        x={0}
        y={0}
        width={1000}
        height={h}
        fill="none"
        stroke={c("ink")}
        strokeOpacity={0.25}
        strokeWidth={3}
      />
    </g>
  );
};

// The bucket's tilt per drawing after landing: leans out, tips, holds while it empties.
const TIP = [0, 0, 0, -20, -55, -95, -110, -112];
const SLOPS = "#6B5A2E";

const Pour: React.FC<{ len: number; e: number }> = ({ len, e }) => {
  const d = Math.floor(e * 12);
  const tip = TIP[Math.min(TIP.length - 1, d)];
  const out = Math.min(1, e / 0.25); // the arm slides out of the window
  const flow = e - 0.5; // the slops leave the bucket at 0.5 s and stop at 1.5 s
  const top = flow > 1 ? (flow - 1) * 2400 : 0; // the tail of the stream falling after the last drop
  const bottom = Math.min(len, Math.max(0, flow) * 2600);
  const lipX = 40,
    lipY = 70;
  const sway = (y: number) => Math.sin(y / 60 + d * 1.7) * 6;
  const stream =
    flow > 0 && top < len
      ? Array.from(
          { length: 21 },
          (_, k) => top + ((bottom - top) * k) / 20,
        ).map(
          (y, k) =>
            [lipX + sway(y) - y * 0.04, lipY + y, 10 + k * 0.9] as const,
        )
      : [];
  const ribbon = stream.length
    ? `M ${stream.map(([x, y, w]) => `${(x - w).toFixed(1)} ${y.toFixed(1)}`).join(" L ")} L ${[
        ...stream,
      ]
        .reverse()
        .map(([x, y, w]) => `${(x + w).toFixed(1)} ${y.toFixed(1)}`)
        .join(" L ")} Z`
    : "";
  const splash = bottom >= len ? Math.max(0, flow - len / 2600) : -1;
  const groundX = lipX - len * 0.04;
  return (
    <svg
      width={260}
      height={len + 120}
      viewBox={`-120 -10 260 ${len + 120}`}
      style={{
        position: "absolute",
        left: -120,
        top: -10,
        overflow: "visible",
      }}
    >
      {splash >= 0 ? (
        <g>
          <ellipse
            cx={groundX}
            cy={lipY + len + 8}
            rx={Math.min(150, 30 + splash * 220)}
            ry={Math.min(26, 6 + splash * 40)}
            fill={SLOPS}
            opacity={0.75}
          />
          {splash < 0.6
            ? [-60, -34, -12, 14, 38, 62].map((dx, k) => (
                <circle
                  key={k}
                  cx={groundX + dx * (1 + splash * 3)}
                  cy={
                    lipY +
                    len -
                    40 * Math.sin(Math.min(1, splash * 3) * Math.PI) -
                    k * 3
                  }
                  r={7 - k * 0.6}
                  fill={SLOPS}
                />
              ))
            : null}
        </g>
      ) : null}
      {ribbon ? (
        <path d={ribbon} fill={SLOPS} stroke="#4A3E1E" strokeWidth={2} />
      ) : null}
      <g transform={`translate(${(1 - out) * 90} 0)`}>
        {/* The arm in a rolled sleeve, coming out of the window on the right. */}
        <path
          d="M 140 30 L 70 44 L 72 74 L 140 66 Z"
          fill="#8E7B62"
          stroke={FRAME}
          strokeWidth={4}
        />
        <circle
          cx={70}
          cy={58}
          r={16}
          fill="#E2B48C"
          stroke={FRAME}
          strokeWidth={3}
        />
        <g transform={`rotate(${tip} 60 58)`}>
          {/* A wooden bucket, its iron bands, the dirty water inside. */}
          <path
            d="M 10 30 L 90 30 L 80 104 L 20 104 Z"
            fill="#9C6B3E"
            stroke={FRAME}
            strokeWidth={5}
          />
          <ellipse cx={50} cy={32} rx={40} ry={8} fill={SLOPS} />
          {[50, 82].map((y) => (
            <line
              key={y}
              x1={14 + (y - 30) * 0.13}
              y1={y}
              x2={86 - (y - 30) * 0.13}
              y2={y}
              stroke="#3A3A3A"
              strokeWidth={5}
            />
          ))}
          <path
            d="M 10 30 Q 50 -20 90 30"
            fill="none"
            stroke="#3A3A3A"
            strokeWidth={4}
          />
        </g>
      </g>
    </svg>
  );
};

// Flies: each traces its own small loop, jumping position every drawing.
const Flies: React.FC<{ n: number; w: number; e: number }> = ({ n, w, e }) => {
  const d = Math.floor(e * 12);
  return (
    <svg
      width={w}
      height={w / 2}
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
    >
      {Array.from({ length: n }, (_, k) => {
        const a = d * (0.9 + rnd(k) * 0.8) + k * 2.1;
        const x =
          w / 2 +
          Math.cos(a) * w * (0.2 + rnd(k + 3) * 0.28) +
          (rnd(d * 7 + k) - 0.5) * 18;
        const y =
          w / 4 + Math.sin(a * 1.3) * w * 0.14 + (rnd(d * 5 + k) - 0.5) * 14;
        return (
          <g key={k} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
            <ellipse
              cx={-5}
              cy={-6}
              rx={7}
              ry={4}
              fill="#FFFFFF"
              opacity={0.55}
              transform={`rotate(${d % 2 ? -30 : -60} -5 -6)`}
            />
            <ellipse
              cx={5}
              cy={-6}
              rx={7}
              ry={4}
              fill="#FFFFFF"
              opacity={0.55}
              transform={`rotate(${d % 2 ? 30 : 60} 5 -6)`}
            />
            <ellipse cx={0} cy={0} rx={6} ry={4.5} fill="#151515" />
          </g>
        );
      })}
    </svg>
  );
};

// A barricade in cut paper, 300 × 170: paving stones heaped high, an overturned cart with its wheel up, a barrel,
// beams sticking out, a red flag flapping on a pole (two drawings).
export const Barricade: React.FC<{ e?: number }> = ({ e = 0 }) => {
  const c = usePalette();
  const flap = Math.floor(e * 6) % 2;
  const stones: [number, number, number][] = [];
  for (let row = 0; row < 6; row++) {
    const n = 11 - row * 1.5;
    for (let k = 0; k < n; k++)
      stones.push([
        30 + row * 20 + k * ((240 - row * 40) / n) + rnd(row * 13 + k) * 6,
        150 - row * 19,
        row * 17 + k,
      ]);
  }
  return (
    <svg
      viewBox="0 0 300 175"
      style={{ display: "block", width: "100%", overflow: "visible" }}
    >
      <line
        x1={200}
        y1={60}
        x2={200}
        y2={-40}
        stroke={c("ink")}
        strokeWidth={5}
      />
      <path
        d={
          flap
            ? "M 200 -38 Q 225 -46 252 -36 Q 232 -24 252 -12 Q 226 -18 200 -12 Z"
            : "M 200 -38 Q 228 -30 254 -40 Q 236 -26 250 -10 Q 224 -4 200 -12 Z"
        }
        fill={c("accent")}
        stroke={c("ink")}
        strokeWidth={2}
      />
      {/* The overturned cart: its box on its side, a wheel in the air. */}
      <rect
        x={6}
        y={78}
        width={92}
        height={78}
        fill="#8A6A44"
        stroke={c("ink")}
        strokeWidth={4}
        transform="rotate(-12 52 117)"
      />
      {[0, 1, 2].map((k) => (
        <line
          key={k}
          x1={14}
          y1={98 + k * 20}
          x2={94}
          y2={86 + k * 20}
          stroke="#5E4A30"
          strokeWidth={3}
        />
      ))}
      <circle
        cx={46}
        cy={64}
        r={34}
        fill="none"
        stroke={c("ink")}
        strokeWidth={7}
      />
      {[0, 36, 72, 108, 144].map((a) => (
        <line
          key={a}
          x1={46 - 32 * Math.cos((a * Math.PI) / 180)}
          y1={64 - 32 * Math.sin((a * Math.PI) / 180)}
          x2={46 + 32 * Math.cos((a * Math.PI) / 180)}
          y2={64 + 32 * Math.sin((a * Math.PI) / 180)}
          stroke={c("ink")}
          strokeWidth={4}
        />
      ))}
      {/* Beams across the heap, a barrel on the right. */}
      <rect
        x={90}
        y={52}
        width={170}
        height={13}
        fill="#A07A4C"
        stroke={c("ink")}
        strokeWidth={3}
        transform="rotate(-18 175 58)"
      />
      <rect
        x={120}
        y={84}
        width={170}
        height={12}
        fill="#A07A4C"
        stroke={c("ink")}
        strokeWidth={3}
        transform="rotate(10 205 90)"
      />
      {stones.map(([x, y, s], k) => (
        <rect
          key={k}
          x={x}
          y={y}
          width={24}
          height={18}
          rx={4}
          fill={s % 4 === 0 ? "#B9AE98" : s % 4 === 1 ? "#D9CFBC" : c("paper")}
          stroke={c("ink")}
          strokeWidth={3}
          transform={`rotate(${(rnd(s) - 0.5) * 24} ${x + 12} ${y + 9})`}
        />
      ))}
      <g transform="translate(246 104)">
        <rect
          x={0}
          y={0}
          width={48}
          height={64}
          rx={14}
          fill="#7A5634"
          stroke={c("ink")}
          strokeWidth={4}
        />
        <line x1={2} y1={18} x2={46} y2={18} stroke="#2E2E2E" strokeWidth={4} />
        <line x1={2} y1={46} x2={46} y2={46} stroke="#2E2E2E" strokeWidth={4} />
      </g>
    </svg>
  );
};

// Trodden earth, 1000 × 120 drawn, torn along its top edge, with loose stones and paving.
const Ground: React.FC = () => (
  <svg
    viewBox="0 0 1000 120"
    width="100%"
    style={{ display: "block", overflow: "visible" }}
  >
    <path
      d={`M 0 18 ${Array.from({ length: 21 }, (_, i) => `L ${i * 50} ${12 + rnd(i) * 14}`).join(" ")} L 1000 120 L 0 120 Z`}
      fill="#8A7A5E"
      stroke="#F6F2E9"
      strokeWidth={5}
    />
    {Array.from({ length: 26 }, (_, i) => (
      <ellipse
        key={i}
        cx={20 + rnd(i + 40) * 960}
        cy={40 + rnd(i + 80) * 70}
        rx={8 + rnd(i + 9) * 16}
        ry={5 + rnd(i + 3) * 7}
        fill={i % 3 ? "#A99A7C" : "#6E604A"}
      />
    ))}
  </svg>
);

// Scaffolding in raw wood, `w` × `h`: four poles, a plank and a ledger every `h` / 5, cross braces, a ladder.
const WOOD = "#9B7447";
const Scaffold: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const poles = [0.02, 0.35, 0.65, 0.98].map((f) => f * w);
  const levels = [1, 2, 3, 4, 5].map((k) => h - (k * h) / 5.3);
  return (
    <svg
      width={w}
      height={h}
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
    >
      <g stroke="#F6F2E9" strokeWidth={13} strokeLinecap="round">
        {poles.map((x) => (
          <line key={x} x1={x} y1={-20} x2={x} y2={h} />
        ))}
      </g>
      {poles.map((x) => (
        <line
          key={x}
          x1={x}
          y1={-20}
          x2={x}
          y2={h}
          stroke={WOOD}
          strokeWidth={8}
          strokeLinecap="round"
        />
      ))}
      {levels.map((y, k) => (
        <g key={y}>
          <line
            x1={poles[k % 2]}
            y1={y + 40}
            x2={poles[(k % 2) + 1]}
            y2={y + (h / 5.3) * 0.9}
            stroke={WOOD}
            strokeWidth={4}
            opacity={0.8}
          />
          <rect
            x={-14}
            y={y - 6}
            width={w + 28}
            height={12}
            fill="#B98E5C"
            stroke="#F6F2E9"
            strokeWidth={3}
          />
        </g>
      ))}
      <g transform={`translate(${w * 0.8} 0)`} stroke={WOOD} strokeWidth={5}>
        <line x1={0} y1={levels[2]} x2={0} y2={h} />
        <line x1={34} y1={levels[2]} x2={34} y2={h} />
        {Array.from({ length: 9 }, (_, i) => {
          const y = h - ((h - levels[2]) * (i + 0.5)) / 9;
          return <line key={i} x1={0} y1={y} x2={34} y2={y} strokeWidth={4} />;
        })}
      </g>
    </svg>
  );
};

// Fire in cut paper: red tongues behind orange behind yellow, each leaping on its own beat (two drawings).
const Flames: React.FC<{ n: number; w: number; e: number }> = ({ n, w, e }) => {
  const d = Math.floor(e * 12);
  const grow = Math.min(1, e / 0.35);
  const tongue = (x: number, h: number, half: number) =>
    `M ${x - half} 0 Q ${x - half * 0.9} ${-h * 0.5} ${x + half * 0.2} ${-h} Q ${x + half * 0.3} ${-h * 0.45} ${x + half} 0 Z`;
  return (
    <svg
      width={w}
      height={1}
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
    >
      {(["#C0392B", "#E67E22", "#F4D03F"] as const).map((fill, layer) =>
        Array.from({ length: n }, (_, k) => {
          const x = ((k + 0.5) / n) * w + (layer - 1) * 6;
          const jump = (d + k * 3 + layer) % 2 ? 1 : 0.82;
          const h =
            (w / n) *
            (1 + rnd(k + layer * 13) * 1.2) *
            (1 - layer * 0.28) *
            jump *
            grow;
          return (
            <path
              key={`${layer}-${k}`}
              d={tongue(x, h, (w / n) * (0.75 - layer * 0.18))}
              fill={fill}
            />
          );
        }),
      )}
    </svg>
  );
};

export const Scenery: React.FC<{
  l: SceneryLayer & { w?: number };
  e: number;
  piece: React.CSSProperties;
}> = ({ l, e, piece }) => {
  const c = usePalette();
  const w = l.w ?? 300;
  if ("facade" in l) {
    const h = FLOOR_H[l.facade];
    return (
      <svg
        width={w}
        height={(h * w) / 1000}
        viewBox={`0 0 1000 ${h}`}
        style={{ ...piece, overflow: "visible" }}
      >
        <FloorArt f={l.facade} c={c} />
      </svg>
    );
  }
  if ("pour" in l)
    return (
      <div style={{ ...piece, width: 0, height: 0 }}>
        <Pour len={l.pour} e={e} />
      </div>
    );
  if ("flies" in l)
    return (
      <div style={{ ...piece, width: w, height: w / 2 }}>
        <Flies n={l.flies} w={w} e={e} />
      </div>
    );
  if ("ground" in l)
    return (
      <div style={{ ...piece, width: w }}>
        <Ground />
      </div>
    );
  if ("scaffold" in l)
    return (
      <div style={{ ...piece, width: w, height: l.scaffold }}>
        <Scaffold w={w} h={l.scaffold} />
      </div>
    );
  if ("flames" in l)
    return (
      <div style={{ ...piece, width: w, height: 0 }}>
        <Flames n={l.flames} w={w} e={e} />
      </div>
    );
  return (
    <div style={{ ...piece, width: w }}>
      <Barricade e={e} />
    </div>
  );
};
