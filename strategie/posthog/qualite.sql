-- La qualité de chaque vidéo sur Instagram : % regardé (temps moyen / durée), et pour 1 000 vues les likes, partages,
-- enregistrements et abonnés (abonnés attribués comme dans « abonnés gagnés par vidéo »). Fiche : strategie/videos.json.
select v.titre as video, v.format as format, ig.date as date, ig.vues as vues,
  round(ig.temps_moyen, 1) as temps_moyen_s, if(v.duree_s > 0, round(100 * ig.temps_moyen / v.duree_s), null) as pct_regarde,
  round(1000 * ig.partages / greatest(ig.vues, 1), 1) as partages_1000, round(1000 * ig.enregistrements / greatest(ig.vues, 1), 1) as enregistrements_1000,
  round(1000 * ig.likes / greatest(ig.vues, 1), 1) as likes_1000, coalesce(ab.abonnes, 0) as abonnes, round(1000 * coalesce(ab.abonnes, 0) / greatest(ig.vues, 1), 1) as abonnes_1000
from videos v
join (select toString(m.id) as id, toDate(parseDateTimeBestEffort(toString(any(m.timestamp)))) as date,
    sumIf(toFloat(i.value), i.metric = 'views') as vues, sumIf(toFloat(i.value), i.metric = 'likes') as likes,
    sumIf(toFloat(i.value), i.metric = 'shares') as partages, sumIf(toFloat(i.value), i.metric = 'saved') as enregistrements,
    sumIf(toFloat(i.value), i.metric = 'ig_reels_avg_watch_time') / 1000 as temps_moyen
  from instagram_media m join instagram_media_insights i on i.media_id = m.id group by id) ig on ig.id = v.ig_id
left join (select p.id as id, sumIf(f.gagnes, f.d >= p.d and f.d < p.suivant) as abonnes
  from (select id, d, leadInFrame(d, 1, today() + 1) over (order by d, id rows between current row and unbounded following) as suivant
        from (select toString(id) as id, toDate(parseDateTimeBestEffort(toString(timestamp))) as d from instagram_media)) p
  cross join (select toDate(parseDateTimeBestEffort(toString(date))) as d, sumIf(toFloat(value), breakdown_value = 'FOLLOWER') as gagnes
              from instagram_account_insights_breakdowns where metric = 'follows_and_unfollows' group by d) f
  group by p.id) ab on ab.id = v.ig_id
order by date desc
