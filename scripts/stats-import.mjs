// Imports the CSV exports dropped in ~/Desktop/marketing_animart/stats/ into PostHog, then moves each file to
// stats/importes/. Made for TikTok Studio (Analytics → download data: overview / content / followers), which has
// no PostHog source; any CSV with a date column and number columns works the same way.
//   node scripts/stats-import.mjs [--dry]
// Each row of a dated file → one `stats_day` event (platform, date, every number column); each row of a content file
// (a title or link column, no date per row) → one `stats_post` snapshot, like scripts/stats-snapshot.mjs. Events get
// a uuid made from their content, so dropping the same file twice counts once.
import { createHash } from "crypto";
import { readdirSync, readFileSync, renameSync, statSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const DIR = process.env.STATS_DROP || join(homedir(), "Desktop/marketing_animart/stats");
const PROJECT_KEY = "phc_vSM86QQ6XgHFus5sAZMAdw9LvctyMyW9CquY7NqnjpAn"; // public, also in the website's code
const DRY = process.argv.includes("--dry");

// A small CSV reader: commas or semicolons, quoted fields.
function parse(text) {
  text = text.replace(/^﻿/, "");
  const sep = (text.split("\n")[0].match(/;/g) || []).length > (text.split("\n")[0].match(/,/g) || []).length ? ";" : ",";
  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true;
    else if (c === sep) { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.some(x => x.trim()));
}

const slug = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
// Column names, English or French, to the names the dashboards use.
const ALIASES = {
  date: ["date", "jour", "day"],
  views: ["video_views", "views", "vues", "vues_de_videos", "total_views", "nombre_de_vues", "vues_des_videos"],
  profile_views: ["profile_views", "vues_du_profil", "visites_du_profil"],
  likes: ["likes", "total_likes", "j_aime", "mentions_j_aime"],
  comments: ["comments", "total_comments", "commentaires"],
  shares: ["shares", "total_shares", "partages"],
  followers: ["followers", "abonnes", "total_followers"],
  new_followers: ["difference_in_followers_from_previous_day", "new_followers", "nouveaux_abonnes", "follower_growth"],
  title: ["video_title", "title", "titre", "titre_de_la_video", "description"],
  url: ["video_link", "link", "lien", "lien_de_la_video", "url"],
  posted: ["post_time", "posted", "date_de_publication", "publie_le"],
};
const canon = h => { const s = slug(h); for (const [k, v] of Object.entries(ALIASES)) if (v.includes(s)) return k; return s; };
const toNum = v => { const s = String(v).replace(/\s| /g, "").replace(",", "."); const n = Number(s.replace(/[kK]$/, "")) * (/[kK]$/.test(s) ? 1000 : 1); return Number.isFinite(n) ? n : null; };
const toDate = v => {
  const s = String(v).trim();
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/); if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/); if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`; // dd/mm/yyyy
  const d = new Date(s + (/\d{4}/.test(s) ? "" : ` ${new Date().getFullYear()}`)); // "November 16" → this year
  // The local calendar day (toISOString would shift a local midnight to the day before in UTC).
  return isNaN(d) ? null : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const uuid = s => { const h = createHash("sha1").update(s).digest("hex"); return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`; };

const files = readdirSync(DIR).filter(f => /\.csv$/i.test(f));
if (!files.length) { console.log(`nothing to import in ${DIR}`); process.exit(0); }
const batch = [];
for (const f of files) {
  const rows = parse(readFileSync(join(DIR, f), "utf8"));
  const head = rows[0].map(canon);
  const platform = /youtube|yt/i.test(f) ? "youtube" : /insta|ig/i.test(f) ? "instagram" : "tiktok";
  const now = new Date(statSync(join(DIR, f)).mtime).toISOString();
  let n = 0;
  for (const r of rows.slice(1)) {
    const o = Object.fromEntries(head.map((h, i) => [h, r[i]]));
    const nums = Object.fromEntries(head.filter(h => !["date", "title", "url", "posted"].includes(h)).map(h => [h, toNum(o[h])]).filter(([, v]) => v !== null));
    if (head.includes("date") && toDate(o.date)) {
      const date = toDate(o.date);
      batch.push({ event: "stats_day", distinct_id: "animart-stats", timestamp: `${date}T12:00:00Z`, uuid: uuid(`${platform}|day|${date}|${JSON.stringify(nums)}`),
        properties: { platform, date, ...nums, file: f, $process_person_profile: false } });
      n++;
    } else if (head.includes("title") || head.includes("url")) {
      const id = o.url || o.title;
      batch.push({ event: "stats_post", distinct_id: "animart-stats", timestamp: now, uuid: uuid(`${platform}|post|${id}|${now}`),
        properties: { platform, post_id: id, title: (o.title || "").slice(0, 80), url: o.url, posted: o.posted ? toDate(o.posted) : null, ...nums, file: f, $process_person_profile: false } });
      n++;
    }
  }
  console.log(`${f}: ${n} rows → ${platform} (columns: ${head.join(", ")})`);
}
if (DRY) { console.log(JSON.stringify(batch.slice(0, 3), null, 1)); process.exit(0); }
const r = await fetch("https://eu.i.posthog.com/batch/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ api_key: PROJECT_KEY, batch }) });
console.log(`sent ${batch.length} events`, r.status);
if (!r.ok) process.exit(1);
for (const f of files) renameSync(join(DIR, f), join(DIR, "importes", `${new Date().toISOString().slice(0, 10)}-${f}`));
