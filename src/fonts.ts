import { loadFont as loadFell } from "@remotion/google-fonts/IMFellEnglish";
import { loadFont as loadFellSC } from "@remotion/google-fonts/IMFellEnglishSC";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadElite } from "@remotion/google-fonts/SpecialElite";
import { loadFont as loadFranklin } from "@remotion/google-fonts/LibreFranklin";

// The Guide's type (bible/art-direction.md): an old printed-book serif for titles and labels, the app's
// handwriting (Caveat) for everything the Guide says or writes.
export const fell = loadFell("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
loadFell("italic", { weights: ["400"], subsets: ["latin"] });
export const fellSC = loadFellSC("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
export const hand = loadCaveat("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;
// Collage shots (src/guide/shots.tsx): a black display serif for tape labels, a condensed poster face for big numbers.
export const display = loadPlayfair("normal", { weights: ["900"], subsets: ["latin"] }).fontFamily;
export const poster = loadAnton("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
// Typewritten documents in collages (a typed report, a telegram).
export const typewriter = loadElite("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
// The Vox paper kit (src/guide/voxkit.tsx): heavy grotesque for cut-out letters, name labels and number tags.
export const sans = loadFranklin("normal", { weights: ["400", "800", "900"], subsets: ["latin"] }).fontFamily;
