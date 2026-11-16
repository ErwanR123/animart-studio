// The « Détails » reels as compositions, mounted by src/Root.tsx.
import React from "react";
import { Composition } from "remotion";
import { FPS, H, W, createDetailsReel } from "./engine";
import { reels } from "./reels";

// Built once at load, not on each render (a component made in render would remount every frame).
const built = reels.map(r => ({ id: r.id, ...createDetailsReel(r) }));

export const DetailsCompositions: React.FC = () => (
  <>
    {built.map(b => <Composition key={b.id} id={b.id} component={b.Component} durationInFrames={b.durationInFrames} fps={FPS} width={W} height={H} />)}
  </>
);
