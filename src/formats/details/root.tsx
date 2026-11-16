// Entry point of the « Détails » format (kept apart from src/Root.tsx while the Guide's work there is uncommitted):
//   npx remotion studio src/formats/details/root.tsx
//   npx remotion render src/formats/details/root.tsx DetailsSacre out/details-sacre.mp4
import React from "react";
import { Composition, registerRoot } from "remotion";
import { FPS, H, W, createDetailsReel } from "./engine";
import { reels } from "./reels";

// Built once at load, not on each render (a component made in render would remount every frame).
const built = reels.map(r => ({ id: r.id, ...createDetailsReel(r) }));

const Root: React.FC = () => (
  <>
    {built.map(b => <Composition key={b.id} id={b.id} component={b.Component} durationInFrames={b.durationInFrames} fps={FPS} width={W} height={H} />)}
  </>
);

registerRoot(Root);
