import type { createGuideEpisode } from "../guide/engine";
import { guideAthens } from "./GuideAthens";
import { guideHomecoming } from "./GuideHomecoming";
import { guideAlexander } from "./GuideAlexander";
import { guideScream } from "./GuideScream";
import { guideParisRain } from "./GuideParisRain";
// new-episode: import

// Every episode, keyed by its composition id (scripts/episode-new.mjs adds a line to both lists).
export const episodes: Record<string, ReturnType<typeof createGuideEpisode>> = {
  GuideAthens: guideAthens,
  GuideHomecoming: guideHomecoming,
  GuideAlexander: guideAlexander,
  GuideScream: guideScream,
  GuideParisRain: guideParisRain,
  // new-episode: entry
};
