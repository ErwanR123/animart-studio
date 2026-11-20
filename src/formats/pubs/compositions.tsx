// The « Pubs » ads as compositions, mounted by src/Root.tsx.
import React from "react";
import { Composition } from "remotion";
import { FPS, H, PubGrille, SECONDS, W } from "./PubGrille";

export const PubsCompositions: React.FC = () => (
  <Composition id="PubGrille" component={PubGrille} durationInFrames={SECONDS * FPS} fps={FPS} width={W} height={H} />
);
