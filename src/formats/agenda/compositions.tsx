// The « Agenda » reels as compositions, mounted by src/Root.tsx.
import React from "react";
import { Composition } from "remotion";
import { FPS, H, W, createAgendaReel } from "./engine";
import { agenda1120 } from "./reels/agenda1120";
import voice1120 from "../../../public/voice/Agenda1120.json";

// Built once at load, not on each render.
const built = [{ id: agenda1120.id, ...createAgendaReel(agenda1120, voice1120) }];

export const AgendaCompositions: React.FC = () => (
  <>
    {built.map(b => <Composition key={b.id} id={b.id} component={b.Component} durationInFrames={b.durationInFrames} fps={FPS} width={W} height={H} />)}
  </>
);
