// A snapshot of every post's numbers and every account's followers, sent to PostHog as events. Instagram and
// YouTube only give running totals; two snapshots a day apart give what each post (and the account) gained that day,
// which the « Progression jour par jour » dashboard reads. Run every hour by launchd (scripts/stats-launchd.sh).
//   node --env-file=.env scripts/stats-snapshot.mjs [--dry]
// Reads the platforms' tables PostHog already syncs (warehouse sources Instagram and YoutubeData), so it needs no
// platform token: POSTHOG_PERSONAL_API_KEY to read, the public project key to write.
const KEY = process.env.POSTHOG_PERSONAL_API_KEY;
if (!KEY) throw new Error("POSTHOG_PERSONAL_API_KEY missing (studio .env)");
const PROJECT = 351733;
const PROJECT_KEY = "phc_vSM86QQ6XgHFus5sAZMAdw9LvctyMyW9CquY7NqnjpAn"; // public, also in the website's code
const DRY = process.argv.includes("--dry");

async function hogql(query) {
  const r = await fetch(`https://eu.posthog.com/api/projects/${PROJECT}/query/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`HogQL ${r.status}: ${JSON.stringify(j).slice(0, 300)}`);
  return j.results.map(row => Object.fromEntries(j.columns.map((c, i) => [c, row[i]])));
}

const num = v => (v === null || v === undefined || v === "" ? null : Number(v));

const igPosts = await hogql(`
  select toString(m.id) as id, toString(any(m.timestamp)) as posted, substringUTF8(replaceAll(any(m.caption), '\\n', ' '), 1, 80) as title,
    any(m.media_product_type) as kind, any(m.permalink) as url,
    sumIf(toFloat(i.value), i.metric = 'views') as views, sumIf(toFloat(i.value), i.metric = 'reach') as reach,
    sumIf(toFloat(i.value), i.metric = 'likes') as likes, sumIf(toFloat(i.value), i.metric = 'comments') as comments,
    sumIf(toFloat(i.value), i.metric = 'shares') as shares, sumIf(toFloat(i.value), i.metric = 'saved') as saves,
    sumIf(toFloat(i.value), i.metric = 'ig_reels_avg_watch_time') / 1000 as avg_watch_s
  from instagram_media m left join instagram_media_insights i on i.media_id = m.id group by id`);
const ytPosts = await hogql(`
  select toString(id) as id, JSONExtractString(toString(snippet), 'publishedAt') as posted,
    substringUTF8(JSONExtractString(toString(snippet), 'title'), 1, 80) as title,
    JSONExtractString(toString(statistics), 'viewCount') as views, JSONExtractString(toString(statistics), 'likeCount') as likes,
    JSONExtractString(toString(statistics), 'commentCount') as comments
  from youtubedata_videos`);
const igAccount = await hogql(`select followers_count, follows_count, media_count from instagram_account`);
const ytChannel = await hogql(`select JSONExtractString(toString(statistics), 'subscriberCount') as subs,
  JSONExtractString(toString(statistics), 'viewCount') as views, JSONExtractString(toString(statistics), 'videoCount') as videos from youtubedata_channels`);

const now = new Date().toISOString();
const ev = (event, properties) => ({ event, distinct_id: "animart-stats", timestamp: now, properties: { ...properties, $process_person_profile: false } });
const batch = [
  ...igPosts.map(p => ev("stats_post", { platform: "instagram", post_id: p.id, posted: p.posted, title: p.title, kind: p.kind, url: p.url,
    views: num(p.views), reach: num(p.reach), likes: num(p.likes), comments: num(p.comments), shares: num(p.shares), saves: num(p.saves),
    avg_watch_s: num(p.avg_watch_s) })),
  ...ytPosts.map(p => ev("stats_post", { platform: "youtube", post_id: p.id, posted: p.posted, title: p.title,
    url: `https://youtube.com/shorts/${p.id}`, views: num(p.views), likes: num(p.likes), comments: num(p.comments) })),
  ...igAccount.map(a => ev("stats_account", { platform: "instagram", followers: num(a.followers_count), following: num(a.follows_count), posts: num(a.media_count) })),
  ...ytChannel.map(c => ev("stats_account", { platform: "youtube", followers: num(c.subs), views: num(c.views), posts: num(c.videos) })),
];

if (DRY) {
  console.log(`${batch.length} events`, JSON.stringify(batch.filter(e => e.event === "stats_account").map(e => e.properties)));
} else {
  const r = await fetch("https://eu.i.posthog.com/batch/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ api_key: PROJECT_KEY, batch }) });
  console.log(now, `sent ${batch.length} events`, r.status);
  if (!r.ok) process.exit(1);
}
