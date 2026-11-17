// Every « Détails » reel: add its JSON here to get a composition.
import type { DetailsReel } from "../types";
import radeau from "./radeau.json";
import sacre from "./sacre.json";
import cana from "./cana.json";
import tricheur from "./tricheur.json";

export const reels: DetailsReel[] = [sacre as DetailsReel, radeau as DetailsReel, cana as DetailsReel, tricheur as DetailsReel];
