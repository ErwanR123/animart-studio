import type { Shot } from "../guide/shots";
import { makeReel } from "./reel";

// Paper puppets on their own (src/guide/rigs.tsx), to judge the acting before an episode uses them.
//   npx remotion render GuidePuppets out/puppets.mp4 --gl=angle
const scenes: (Shot & { caption: string })[] = [
  {
    word: "",
    cam: { from: [0, 0, 1], to: [0, 0, 1.03] },
    caption: "Napoléon III et Haussmann à la pioche",
    layers: [
      { bg: "art/paris-rain/demolition.png", dim: 0.2 },
      { rig: "napoleon", x: 170, y: 330, w: 330, enter: "none" },
      {
        rig: "haussmann",
        x: 560,
        y: 300,
        w: 350,
        flip: true,
        delay: 0.45,
        enter: "none",
      },
    ],
  },
  {
    word: "",
    cam: { from: [0, 0, 1.02], to: [0, 0, 1.02] },
    caption: "Le rat traverse la ruelle",
    layers: [
      { bg: "art/paris-rain/ruelle-haut-moulin.jpg" },
      {
        rig: "rat",
        x: 1100,
        y: 1020,
        w: 320,
        flip: true,
        travel: [-1500, 0, 3.4],
        enter: "none",
      },
    ],
  },
];
export const { Reel: GuidePuppets, frames: PUPPET_FRAMES } = makeReel(
  scenes,
  4,
);
