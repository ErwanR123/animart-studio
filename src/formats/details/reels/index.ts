// Every « Détails » reel: add its JSON here to get a composition.
import type { DetailsReel } from "../types";
import radeau from "./radeau.json";
import sacre from "./sacre.json";

export const reels: DetailsReel[] = [sacre as DetailsReel, radeau as DetailsReel];
