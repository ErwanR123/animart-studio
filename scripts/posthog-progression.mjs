// The « Animart · Progression jour par jour » dashboard in PostHog: creates or updates it and its tiles from the
// queries in strategie/posthog/*.sql (edit a query there, then re-run this). Needs POSTHOG_PERSONAL_API_KEY.
//   node --env-file=.env scripts/posthog-progression.mjs
import { readFileSync } from "fs";
const KEY = process.env.POSTHOG_PERSONAL_API_KEY;
if (!KEY) throw new Error("POSTHOG_PERSONAL_API_KEY missing");
const B = "https://eu.posthog.com/api/projects/351733";
const H = { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };
const api = async (path, body, method = body ? "POST" : "GET") => {
  const r = await fetch(B + path, { method, headers: H, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json();
  if (!r.ok) throw new Error(`${method} ${path} ${r.status}: ${JSON.stringify(j).slice(0, 300)}`);
  return j;
};
const sql = f => readFileSync(new URL(`../strategie/posthog/${f}`, import.meta.url), "utf8").split("\n").filter(l => !l.startsWith("--")).join("\n");

const NAME = "Animart · Progression jour par jour";
const dashboards = await api("/dashboards/?limit=200");
let dash = dashboards.results.find(d => d.name === NAME && !d.deleted);
if (!dash) dash = await api("/dashboards/", { name: NAME, description: "Chaque jour : ce qu'on a posté, ce que chaque post a rapporté (vues, likes, partages, enregistrements), les abonnés gagnés, le site et la waitlist. Relevés horaires : scripts/stats-snapshot.mjs. Requêtes : strategie/posthog/." });

const TILES = [
  { name: "Chaque jour en une ligne", file: "jour.sql", display: "ActionsTable",
    description: "Une ligne par jour : posts publiés, ce qu'Instagram a compté sur tout le compte (vues, comptes touchés, interactions, clics sur le lien de bio), abonnés gagnés / perdus, visiteurs du site et inscrits. Instagram détaille un jour le lendemain." },
  { name: "Abonnés, jour par jour", file: "abonnes.sql", display: "ActionsLineGraph", x: "jour", y: ["instagram", "youtube"],
    description: "Instagram et YouTube. Relevés horaires depuis le 17/11 ; avant, Instagram est reconstruit avec les abonnements de chaque jour." },
  { name: "Ce que chaque post a gagné chaque jour", file: "posts-jour.sql", display: "ActionsTable",
    description: "Nouvelles vues, likes, commentaires, partages et enregistrements de chaque post, jour par jour (relevés horaires, depuis le 17/11). C'est ici qu'on voit quel post a porté la journée, même un vieux post qui repart." },
  { name: "Les formats comparés", file: "formats.sql", display: "ActionsTable",
    description: "Par format (Le Guide, Détails, L'Agenda…) : vues moyennes, % de la vidéo regardé, et pour 1 000 vues les partages, enregistrements et abonnés. Le format d'une vidéo vient de strategie/videos.json." },
  { name: "La qualité de chaque vidéo", file: "qualite.sql", display: "ActionsTable",
    description: "Chaque vidéo Instagram : % regardé (temps moyen / durée), likes, partages, enregistrements et abonnés pour 1 000 vues. Comparer à vues égales : c'est ce que l'algorithme récompense." },
  { name: "La vie de chaque post (J0 → J7)", file: "vie.sql", display: "ActionsTable",
    description: "Vues cumulées de chaque post le jour de sa publication puis à J1, J2, J3 et J7 (relevés horaires, depuis le 16/11)." },
  { name: "Instagram · abonnés gagnés par vidéo", file: "abonnes-par-video.sql", display: "ActionsTable",
    description: "Instagram ne donne pas les abonnés par Reel : chaque vidéo reçoit les abonnements des jours entre sa publication et la suivante." },
];
const tiles = (await api(`/dashboards/${dash.id}/`)).tiles || [];
const existing = { results: tiles.filter(x => x.insight).map(x => x.insight) };
for (const t of TILES) {
  const source = { kind: "HogQLQuery", query: sql(t.file) };
  const query = { kind: "DataVisualizationNode", source, display: t.display,
    ...(t.x ? { chartSettings: { xAxis: { column: t.x }, yAxis: t.y.map(column => ({ column })) } } : {}) };
  const found = existing.results.find(i => i.name === t.name);
  if (found) await api(`/insights/${found.id}/`, { query, description: t.description }, "PATCH");
  else await api("/insights/", { name: t.name, description: t.description, query, saved: true, dashboards: [dash.id] });
  console.log(found ? "updated" : "created", t.name);
}
console.log(`https://eu.posthog.com/project/351733/dashboard/${dash.id}`);
