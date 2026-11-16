import type { createGuideEpisode } from "../guide/engine";
import { guideAthens } from "./GuideAthens";
import { guideHomecoming } from "./GuideHomecoming";
import { guideAlexander } from "./GuideAlexander";
import { guideScream } from "./GuideScream";
import { guideParisRain } from "./GuideParisRain";
import { guideAmbassadors } from "./GuideAmbassadors";
import { guideMonaLisa } from "./GuideMonaLisa";
import { guideMeegeren } from "./GuideMeegeren";
import { guideExposNov } from "./GuideExposNov";
import { guideBanksy } from "./GuideBanksy";
import { guideCaravaggio } from "./GuideCaravaggio";
import { guideMondrian } from "./GuideMondrian";
import { guideBanana } from "./GuideBanana";
import { guideRonin } from "./GuideRonin";
import { guideMummyBrown } from "./GuideMummyBrown";
import { guideLouisHeart } from "./GuideLouisHeart";
import { guideWoundedMan } from "./GuideWoundedMan";
import { guideLamb } from "./GuideLamb";
import { guideRhino } from "./GuideRhino";
import { guideGlasses } from "./GuideGlasses";
import { guideSalvator } from "./GuideSalvator";
// new-episode: import

// Every episode, keyed by its composition id (scripts/episode-new.mjs adds a line to both lists).
export const episodes: Record<string, ReturnType<typeof createGuideEpisode>> = {
  GuideAthens: guideAthens,
  GuideHomecoming: guideHomecoming,
  GuideAlexander: guideAlexander,
  GuideScream: guideScream,
  GuideParisRain: guideParisRain,
  GuideAmbassadors: guideAmbassadors,
  GuideMonaLisa: guideMonaLisa,
  GuideMeegeren: guideMeegeren,
  GuideExposNov: guideExposNov,
  GuideBanksy: guideBanksy,
  GuideCaravaggio: guideCaravaggio,
  GuideMondrian: guideMondrian,
  GuideBanana: guideBanana,
  GuideRonin: guideRonin,
  GuideMummyBrown: guideMummyBrown,
  GuideLouisHeart: guideLouisHeart,
  GuideWoundedMan: guideWoundedMan,
  GuideLamb: guideLamb,
  GuideRhino: guideRhino,
  GuideGlasses: guideGlasses,
  GuideSalvator: guideSalvator,
  // new-episode: entry
};
