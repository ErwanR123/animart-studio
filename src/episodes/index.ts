import type { createGuideEpisode } from "../guide/engine";
import { guideAthens } from "./GuideAthens";
import { guideHomecoming } from "./GuideHomecoming";
import { guideAlexander } from "./GuideAlexander";
import { guideScream } from "./GuideScream";
// new-episode: import

// Every episode, keyed by its composition id (scripts/new-episode.mjs adds a line to both lists).
export const episodes: Record<string, ReturnType<typeof createGuideEpisode>> = {
  GuideAthens: guideAthens,
  GuideHomecoming: guideHomecoming,
  GuideAlexander: guideAlexander,
  GuideScream: guideScream,
  // new-episode: entry
};
