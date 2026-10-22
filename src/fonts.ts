import { loadFont as loadFell } from "@remotion/google-fonts/IMFellEnglish";
import { loadFont as loadFellSC } from "@remotion/google-fonts/IMFellEnglishSC";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";

// The Guide's type (bible/art-direction.md): an old printed-book serif for titles and labels, the app's
// handwriting (Caveat) for everything the Guide says or writes.
export const fell = loadFell("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
loadFell("italic", { weights: ["400"], subsets: ["latin"] });
export const fellSC = loadFellSC("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
export const hand = loadCaveat("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;
