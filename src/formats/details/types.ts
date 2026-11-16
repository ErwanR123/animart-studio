// « Détails » format: one painting, N details the camera travels to, the app ad laid over one detail.
// A reel is one JSON file in reels/ (content only); engine.tsx turns it into a composition.

export type Detail = {
  /** The detail's centre on the painting, as fractions of its width and height. */
  cx: number;
  cy: number;
  /** Share of the painting's width on screen when the camera sits on it (0.1 = a tight close-up). */
  wf: number;
  /** Big line: the surprise, ≤ 10 words. */
  title: string;
  /** Small line under it: why, ≤ 25 words. */
  text: string;
};

export type DetailsReel = {
  /** Composition id, "Details<Name>". */
  id: string;
  status?: string;
  /** Path under public/. */
  image: string;
  imageSize: [number, number];
  imageSource: string;
  work: { title: string; artist: string; date: string; museum?: string; room?: string };
  /** First shot's line, over the whole painting. */
  hook: string;
  details: Detail[];
  ad: {
    /** The ad rises during this detail (1-based), after its text was read. */
    afterDetail: number;
    /** The work's colours in the app (WorkGround + accent). */
    palette: { ground: string; deep: string; accent: string };
    /** Counter shown in the app's top bar, e.g. "5/24". */
    found: string;
    /** Number shown on the « Anecdotes » tab. */
    anecdotes: number;
    /** The presentation's script, said line by line in the app screen (keep it free of the details still to come). */
    script: string[];
  };
  /** End screen; defaults in engine.tsx. */
  end?: { lines?: string[]; follow?: string; sub?: string };
  post: { caption: string; hashtags: string[]; youtubeTitle?: string; youtubeTags?: string[] };
  /** Where each fact comes from (checked before posting). */
  sources: string[];
};
