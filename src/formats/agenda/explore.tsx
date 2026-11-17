// The app's Explore tab as the Agenda's ending shows it, rebuilt from the Animart app's code (repo Animart:
// src/features/explore/screens/ExploreList.tsx, ui/museum.tsx PlaceCard + FilterChips, theme/theme.ts, i18n/fr.ts)
// at the device's 390×844 pt. The type chip switches from Musées to Expos, then the list scrolls through the week's
// exhibitions. When the app's screen changes, change it here from the code, never from memory.
import React from "react";
import { Easing, Img, interpolate, staticFile } from "remotion";
import { inter } from "../details/fonts";

const C = { ink: "#111111", surface: "#F2F0EB", text2: "#6B6862", text3: "#8C8880", like: "#E0334B", green: "#1F8A4C" };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type ExploreItem = { title: string; place: string; until: string; status: string; img: string; pos?: string; likes: string };

const Pin = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={C.text3} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const Chevron: React.FC<{ color: string; size?: number }> = ({ color, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
);
const Heart: React.FC<{ fill: string; size: number; stroke?: string }> = ({ fill, size, stroke }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke ?? fill} strokeWidth={2}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
);

const Chip: React.FC<{ label: string; active?: boolean; chevron?: boolean }> = ({ label, active, chevron }) => (
  <div style={{ height: 40, padding: "0 16px", borderRadius: 20, background: active ? C.ink : C.surface, color: active ? "#fff" : C.ink, display: "flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 600, whiteSpace: "nowrap", flex: "none" }}>
    {label}
    {chevron && <Chevron color="#fff" />}
  </div>
);

const Card: React.FC<{ e: ExploreItem }> = ({ e }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
    <div style={{ position: "relative", height: 200, borderRadius: 18, overflow: "hidden" }}>
      <Img src={staticFile(e.img)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: e.pos ?? "center" }} />
      <div style={{ position: "absolute", left: 10, top: 10, height: 30, padding: "0 12px", borderRadius: 15, background: "#fff", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: C.green }}>
        <span style={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
          {[6, 9, 12].map((h, i) => <span key={i} style={{ width: 3, height: h, borderRadius: 1, background: i === 0 ? C.green : "#D9D6CF" }} />)}
        </span>
        Calme
      </div>
      <div style={{ position: "absolute", right: 10, top: 10, width: 34, height: 34, borderRadius: 17, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Heart fill="none" stroke={C.ink} size={16} />
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, fontSize: 22, fontWeight: 700, letterSpacing: -0.4, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 500, color: C.text2 }}><Heart fill={C.like} size={12} />{e.likes}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500, color: C.green }}>
        <span style={{ width: 7, height: 7, borderRadius: 4, background: C.green }} />{e.status}
      </div>
      <div style={{ fontSize: 13, color: C.text2 }}>{e.until}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: C.text3 }}><Pin />{e.place}</div>
    </div>
  </div>
);

const TabIcon: React.FC<{ d: string[]; on?: boolean }> = ({ d, on }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={on ? C.ink : "#8C8880"} strokeWidth={on ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      {d.map((x, i) => <path key={i} d={x} />)}
    </svg>
    <span style={{ width: 5, height: 5, borderRadius: 3, background: on ? C.ink : "transparent" }} />
  </div>
);

/** The Explore list, f frames after the phone appears: the type chip is tapped at TAP, then the list scrolls. */
export const ExploreScreen: React.FC<{ items: ExploreItem[]; f: number; dur: number }> = ({ items, f, dur }) => {
  const TAP = 14;
  const expos = f >= TAP + 4;
  const press = interpolate(f, [TAP, TAP + 3, TAP + 7], [1, 0.92, 1], clamp);
  const ring = interpolate(f, [TAP - 2, TAP + 2, TAP + 10], [0, 1, 0], clamp);
  const scroll = interpolate(f, [TAP + 14, dur - 6], [0, items.length * 330 - 520], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <div style={{ position: "relative", width: 390, height: 844, background: "#fff", overflow: "hidden", fontFamily: inter, color: C.ink }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateY(${-scroll}px)` }}>
        <div style={{ padding: "58px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1.2 }}>Paris</span>
                <Chevron color={C.ink} size={20} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: C.text3 }}><Pin />12 rue de Rivoli, 75004 Paris</div>
            </div>
            <div style={{ marginTop: 8, height: 36, padding: "0 14px", borderRadius: 18, background: C.surface, display: "flex", alignItems: "center", fontSize: 13, fontWeight: 500 }}>9° · Nuageux</div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <div style={{ flex: 1, height: 48, borderRadius: 24, background: C.surface, display: "flex", alignItems: "center", padding: "0 16px", gap: 10, fontSize: 16, color: C.text3 }}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.text2} strokeWidth={2} strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              Musées, œuvres, amis
            </div>
            <div style={{ width: 48, height: 48, borderRadius: 24, background: C.surface }} />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14, overflow: "hidden" }}>
            <div style={{ position: "relative", transform: `scale(${press})` }}>
              <Chip label={expos ? "Expos" : "Musées"} active chevron />
              <div style={{ position: "absolute", left: "50%", top: "50%", width: 60, height: 60, marginLeft: -30, marginTop: -30, borderRadius: 30, background: "rgba(0,0,0,0.18)", opacity: ring, transform: `scale(${0.6 + ring * 0.6})` }} />
            </div>
            <Chip label="Ouvert maintenant" />
            <Chip label="Calme seulement" />
          </div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "24px 0 14px" }}>
            <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5 }}>{expos ? "Les expos du moment" : "Près de toi"}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: C.text2 }}>{expos ? `${items.length} expos` : "24 musées"}</span>
          </div>
          {(expos ? items : items.slice(0, 2)).map((e, i) => <Card key={i} e={expos ? e : { ...e, title: e.place.split(",")[0], until: "Collections permanentes" }} />)}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 84, background: "#fff", borderTop: "1px solid #EEE", display: "flex", justifyContent: "space-around", paddingTop: 12 }}>
        <TabIcon on d={["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z", "m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"]} />
        <TabIcon d={["M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z", "M12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"]} />
        <TabIcon d={["M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"]} />
        <TabIcon d={["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"]} />
      </div>
    </div>
  );
};

/** The phone: the 390×844 screen scaled into a frame, sliding up from below at the start. */
export const ExplorePhone: React.FC<{ items: ExploreItem[]; f: number; dur: number; width: number }> = ({ items, f, dur, width }) => {
  const rise = interpolate(f, [0, 12], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const inner = width - 20;
  return (
    <div style={{ position: "relative", width, height: (inner * 844) / 390 + 20, borderRadius: width * 0.13, overflow: "hidden", border: "10px solid #000", boxShadow: "0 40px 90px rgba(0,0,0,0.75)", transform: `translateY(${rise * 120}%)`, background: "#fff" }}>
      <div style={{ width: 390, height: 844, transform: `scale(${inner / 390})`, transformOrigin: "top left" }}>
        <ExploreScreen items={items} f={f} dur={dur} />
      </div>
    </div>
  );
};
