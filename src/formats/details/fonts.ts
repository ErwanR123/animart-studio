// The app's font (Inter), used for every text of the « Détails » format.
import { loadFont } from "@remotion/google-fonts/Inter";

export const inter = loadFont("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] }).fontFamily;
