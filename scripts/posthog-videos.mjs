// Pushes strategie/videos.json (the same video on each platform) to PostHog: the view `videos`, and the insight
// « Vues par vidéo, toutes plateformes » on the dashboard « Animart · Réseaux ». Run after editing the file:
//   node --env-file=.env scripts/posthog-videos.mjs
import { readFileSync } from 'node:fs'

const KEY = process.env.POSTHOG_PERSONAL_API_KEY
if (!KEY) throw new Error('POSTHOG_PERSONAL_API_KEY missing in .env')
const P = 'https://eu.posthog.com/api/projects/351733'
const DASHBOARD = 1122748 // Animart · Réseaux
const api = async (path, body, method = body ? 'POST' : 'GET') => {
  const r = await fetch(P + path, { method, headers: { Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) })
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(`${method} ${path} → ${r.status} ${JSON.stringify(j).slice(0, 400)}`)
  return j
}

const { videos } = JSON.parse(readFileSync(new URL('../strategie/videos.json', import.meta.url), 'utf8'))
const s = v => `'${String(v ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
const rows = videos.map(v => `(${[v.id, v.title, v.format, v.ig, v.yt].map(s).join(', ')}, ${Number(v.tt_views ?? 0)}, ${Number(v.duration_s ?? 0)})`)
const VIEW = `select tupleElement(t, 1) as video, tupleElement(t, 2) as titre, tupleElement(t, 3) as format,
  tupleElement(t, 4) as ig_id, tupleElement(t, 5) as yt_id, tupleElement(t, 6) as tiktok_vues, tupleElement(t, 7) as duree_s
from (select arrayJoin([${rows.join(', ')}]) as t)`

// The view: one row per video, its id on each platform.
const views = (await api('/warehouse_saved_queries/?limit=200')).results
const existing = views.find(v => v.name === 'videos')
// PostHog refuses an edit that does not name the version it replaces (« modified by someone else »).
if (existing) {
  const { latest_history_id } = await api(`/warehouse_saved_queries/${existing.id}/`)
  await api(`/warehouse_saved_queries/${existing.id}/`, { query: { kind: 'HogQLQuery', query: VIEW }, edited_history_id: latest_history_id }, 'PATCH')
}
else await api('/warehouse_saved_queries/', { name: 'videos', query: { kind: 'HogQLQuery', query: VIEW } })
console.log(`view videos: ${videos.length} videos`)

// The insight: each video's views on every platform, and the total.
const BY_VIDEO = `select v.titre as video, v.format as format,
  least(coalesce(ig.date, toDate('2100-01-01')), coalesce(yt.date, toDate('2100-01-01'))) as premier_post,
  coalesce(ig.vues, 0) as instagram, coalesce(yt.vues, 0) as youtube, v.tiktok_vues as tiktok,
  coalesce(ig.vues, 0) + coalesce(yt.vues, 0) + v.tiktok_vues as total,
  coalesce(ig.partages, 0) as partages_ig, coalesce(ig.enregistrements, 0) as enregistrements_ig
from videos v
left join (select toString(m.id) as id, toDate(parseDateTimeBestEffort(toString(any(m.timestamp)))) as date,
    sumIf(toFloat(i.value), i.metric = 'views') as vues, sumIf(toFloat(i.value), i.metric = 'shares') as partages,
    sumIf(toFloat(i.value), i.metric = 'saved') as enregistrements
  from instagram_media m join instagram_media_insights i on i.media_id = m.id group by id) ig on ig.id = v.ig_id
left join (select toString(id) as id, toDate(parseDateTimeBestEffort(JSONExtractString(toString(snippet), 'publishedAt'))) as date,
    toFloat(JSONExtractString(toString(statistics), 'viewCount')) as vues from youtubedata_videos) yt on yt.id = v.yt_id
order by total desc`
const NAME = 'Vues par vidéo, toutes plateformes'
const query = { kind: 'DataVisualizationNode', source: { kind: 'HogQLQuery', query: BY_VIDEO }, display: 'ActionsTable' }
const insights = (await api('/insights/?limit=300&saved=true')).results
const ins = insights.find(i => i.name === NAME)
if (ins) await api(`/insights/${ins.id}/`, { query }, 'PATCH')
else await api('/insights/', { name: NAME, description: 'Chaque vidéo, ses vues sur Instagram, YouTube et TikTok (TikTok : relevé Metricool à chaque bilan), et le total. Fiche : strategie/videos.json.', query, dashboards: [DASHBOARD], saved: true })
const check = await api('/query/', { query: { kind: 'HogQLQuery', query: BY_VIDEO } })
console.log(`insight « ${NAME} »: ${check.results.length} rows`)
for (const r of check.results.slice(0, 5)) console.log('  ', r.slice(0, 7).join(' | '))
