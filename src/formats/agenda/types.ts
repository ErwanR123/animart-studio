import type { ExploreItem } from "./explore";

// One « Agenda » reel: the visuals for each segment of its voice script (src/episodes/<voice>.script.json).
export type AgendaImage = {
  src: string; // under public/
  pos?: string; // CSS object-position
  at?: string; // start on this word of the segment (its first letters); otherwise images share the segment evenly
};

export type AgendaSegment = {
  images: AgendaImage[];
  label?: { title: string; info: string }; // the exhibition's box; consecutive segments with the same title share it
  phone?: boolean; // the app's Explore tab on a phone over the (darkened) image: the call to action
};

export type AgendaReel = {
  id: string; // the composition id
  voice: string; // public/voice/<voice>.mp3 + .json
  segments: Record<string, AgendaSegment>;
  display?: Record<string, string>; // caption text shown differently from the script ("trois cents" -> "300")
  explore?: ExploreItem[]; // the exhibitions listed on the phone
  credits: string[]; // photo credits for the post's caption (CC licences)
};

export type VoiceJson = {
  segments: { id: string; start: number; end: number }[];
  words: { text: string; start: number; end: number; segment: string }[];
};
