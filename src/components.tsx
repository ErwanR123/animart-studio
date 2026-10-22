import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

// Animated paper/film grain: the noise seed changes every 2 frames.
export const Grain: React.FC<{ opacity?: number; blend?: "multiply" | "screen" }> = ({
  opacity = 0.09,
  blend = "multiply",
}) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 50;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: blend, opacity }}>
      <svg width="100%" height="100%">
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};
