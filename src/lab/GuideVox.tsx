import { Paris } from "../guide/maps/paris";
import type { Shot } from "../guide/shots";
import { makeReel } from "./reel";

// The Vox paper register, as real scenes on the Paris story (not a catalogue): what the reference reel and the 120
// measured Vox thumbnails do (refs/vox-style-video/style/collage-motion/14-vox-collage.md). One flat colour field per
// shot, the subject as a dense cluster in the middle, a name on torn graph paper, cut-out letters, small stencils and
// evidence ephemera round it, people that act like paper puppets (talk, walk, turn), plain cuts and slides between
// shots, one camera move per shot, varied from shot to shot.
//   npx remotion render GuideVox out/vox.mp4 --gl=angle
const ART = "art/paris-rain";
const KIT = "art/kit";
const CRUMPLED = "art/paper/crumpled.jpg";

const scenes: (Shot & { caption: string })[] = [
  {
    word: "", cam: { from: [0, 0, 1], to: [0, 0, 1.06] }, caption: "Le personnage en amas : photo + caricature, le monument au trait derrière, son nom sur papier millimétré",
    layers: [
      { field: "#E8DEC4", dots: "none" },
      { halftone: "ink", x: 160, y: 120, w: 760, enter: "none" },
      { src: `${ART}/opera-ink.png`, x: 90, y: 60, w: 900, z: 0.2, enter: "none" },
      { src: `${ART}/haussmann-demolisseur.png`, x: -30, y: 330, w: 430, rot: -10, z: 0.4 },
      { src: `${ART}/napoleon.png`, x: 690, y: 360, w: 360, rot: 9, z: 0.45 },
      { src: `${ART}/haussmann.png`, x: 250, y: 250, w: 580, z: 0.6, neck: 0.52, talk: [0.6, 3.4] },
      { postage: `${ART}/stamp-napoleon.png`, x: 80, y: 760, w: 170, rot: -8, z: 0.7 },
      { name: ["Haussmann", "préfet de la Seine"], x: 300, y: 820, size: 92, rot: -2, z: 0.9 },
    ],
  },
  {
    word: "", in: "slide", cam: { from: [-30, 0, 1.04], to: [30, 0, 1.04] }, caption: "Le tableau d'enquête : chiffres géants, fil rouge entre les croix, cachet, cases, bande de chiffres",
    layers: [
      { field: "#CFC3AE", dots: "tl" },
      { ghost: "1853", x: -30, y: 40, size: 420 },
      { motif: "stripes", color: "red", x: 40, y: 230, w: 200, h: 170, rot: -6 },
      { src: `${ART}/haussmann.png`, fill: `${ART}/map-1868.png`, x: 230, y: 200, w: 620, enter: "none" },
      { thread: [[140, 330], [330, 190], [560, 360], [770, 250], [920, 460]], color: "red", draw: 1.4 },
      { postmark: "22 juin 1853", sub: "Préfecture", x: 760, y: 120, w: 230, rot: 12 },
      { tag: "1853", x: 80, y: 860, size: 90, rot: -4 },
      { ticks: 4, crossed: [1, 3], x: 640, y: 920 },
      { strip: "75 01 · 75 02 · 75 03 · 75 04", x: 990, y: 520 },
      { motif: "cross", color: "red", x: 820, y: 760, w: 170, h: 110, rot: 8 },
    ],
  },
  {
    word: "", in: "cut", cam: { from: [0, 20, 1.08], to: [0, 0, 1] }, caption: "Lettres découpées une à une · photo surlignée · chutes de papier au pochoir",
    layers: [
      { field: "#C11314", dots: "br" },
      { src: `${ART}/demolition.png`, x: 40, y: 470, w: 1000, rot: -2, enter: "none" },
      { letters: "TOUT RASER", x: 70, y: 150, w: 940, size: 132 },
      { stencil: "zigzag", color: "#F5EC0C", x: 830, y: 380, w: 170, rot: -12 },
      { stencil: "triangle", color: "cream", x: 60, y: 900, w: 110, rot: 14 },
      { stencil: "dot", color: "ink", x: 930, y: 950, w: 70 },
    ],
  },
  {
    word: "", in: "whip", cam: { from: [0, 0, 1], to: [0, 0, 1.05] }, caption: "Les personnages bougent : le chiffonnier traverse à pas de papier, l'homme à la charrette fait demi-tour",
    layers: [
      { field: "#2B6A99", dots: "bl", disc: [540, 560, 380, "#3D7FB3"] },
      { src: `${ART}/opera-ink.png`, x: 100, y: 150, w: 880, z: 0.15, enter: "none" },
      { src: `${ART}/charrette.png`, x: 640, y: 330, w: 440, z: 0.5, turn: 1.6 },
      { src: `${ART}/chiffonnier.png`, x: -260, y: 320, w: 360, z: 0.7, walk: [470, 0, 7], enter: "none" },
      { name: ["Chiffonniers", "chassés du centre"], x: 250, y: 960, size: 72, rot: 2, z: 0.9 },
      { stencil: "half", color: "#F5EC0C", x: 70, y: 150, w: 120, rot: -20 },
    ],
  },
  {
    word: "", in: "slide", cam: { from: [0, 0, 1.06], to: [0, 0, 1] }, caption: "Deux personnages se répondent : l'un parle, puis l'autre (têtes qui bougent)",
    layers: [
      { field: "#F5EC0C", dots: "tr" },
      { stencil: "dot", color: "#E2602E", x: -60, y: 200, w: 560 },
      { stencil: "dot", color: "#2B6A99", x: 560, y: 260, w: 560 },
      { src: `${ART}/napoleon.png`, x: 40, y: 260, w: 460, neck: 0.55, talk: [0.4, 2.2], z: 0.6 },
      { src: `${ART}/haussmann.png`, x: 540, y: 300, w: 500, neck: 0.52, talk: [2.4, 4.4], z: 0.6 },
      { tape: "Aérez Paris !", x: 60, y: 820, size: 54, rot: -3, z: 0.9 },
      { tape: "Je rase tout.", x: 560, y: 900, size: 54, rot: 2, z: 0.9 },
    ],
  },
  {
    word: "", in: "push", cam: { from: [20, 0, 1], to: [-20, 0, 1.05] }, caption: "Le monument au trait sur aplat · polaroid scotché « avant » · étiquette de nom",
    layers: [
      { field: "#D9A441", dots: "br" },
      { src: `${ART}/opera-ink.png`, x: 20, y: 160, w: 1040, enter: "none" },
      { polaroid: `${ART}/rue-aumaire.png`, caption: "avant", x: 70, y: 600, w: 360, rot: -7 },
      { washi: "cream", x: 150, y: 590, w: 180, rot: -14 },
      { name: ["Opéra Garnier", "1875"], x: 400, y: 790, size: 64, rot: 3 },
      { stencil: "star", color: "#C11314", x: 900, y: 640, w: 120 },
    ],
  },
  {
    word: "", in: "zoom", into: [250, 800], cam: { from: [0, 0, 1], to: [0, 0, 1.08] }, caption: "Zoom dans la photo · le vrai texte, surligné au mot dit, le reste s'efface",
    layers: [
      { field: "cream", dots: "none", paper: CRUMPLED },
      { doc: "Article premier. Les rues de Paris continueront d'être soumises au régime de la grande voirie.\n\nArt. 2. Dans tout projet d'expropriation pour l'élargissement, le redressement ou la formation des rues de Paris, l'administration aura la faculté de comprendre la totalité des immeubles atteints, lorsqu'elle jugera que les parties restantes ne sont pas d'une étendue ou d'une forme qui permette d'y élever des constructions salubres.", face: "book", head: "Décret du 26 mars 1852", mark: "la totalité des immeubles atteints", cue: "totalité", size: 46, x: 50, y: 70, w: 980, rot: -1.2, enter: "none" },
    ],
  },
  {
    word: "", in: "blur", cam: { from: [0, 0, 1.04], to: [0, 0, 1] }, caption: "Flou de caméra · la vraie carte : les boulevards se tracent, les épingles tombent",
    layers: [
      { field: "ochre", dots: "none", paper: CRUMPLED },
      { map: Paris, routes: ["Rue de Rivoli", "Boulevard de Sébastopol", "Boulevard de Strasbourg", "Boulevard Saint-Michel", "Boulevard Saint-Germain", "Avenue de l'Opéra", "Boulevard Haussmann"], pins: ["Place de Dublin"], labels: [["Seine", 330, 228]], draw: 0.35, x: 30, y: 270, w: 1020, enter: "none" },
      { name: ["Les percées", "1853 – 1870"], x: 300, y: 860, size: 80, rot: -2 },
    ],
  },
  {
    word: "", in: "slide", cam: { from: [0, 0, 1], to: [0, 0, 1.05] }, caption: "Premier plan : les gens montent de derrière une bande de papier déchiré · vrai papier froissé",
    layers: [
      { field: "#2B6A99", dots: "none", paper: CRUMPLED },
      { src: `${KIT}/monument-arc-ink.png`, x: 140, y: 120, w: 800, z: 0.15, enter: "none" },
      { src: `${KIT}/people-parapluies.png`, x: 120, y: 380, w: 300, z: 0.6, enter: "rise" },
      { src: `${KIT}/people-paniers.png`, x: 560, y: 480, w: 420, z: 0.6, enter: "rise" },
      { fore: "bottom", y: 900, color: "cream", z: 0.9 },
      { name: ["Petits métiers", "Paris, vers 1900"], x: 300, y: 930, size: 64, rot: 2, z: 0.95 },
    ],
  },
];

const reel = makeReel(scenes, 5, 0.2);
export const GuideVox = reel.Reel;
export const VOX_FRAMES = reel.frames;
