-- Les formats comparés (Instagram) : moyenne par vidéo, et pour 1 000 vues sur l'ensemble du format.
select v.format as format, count() as videos, round(avg(ig.vues)) as vues_moyennes,
  round(avgIf(100 * ig.temps_moyen / v.duree_s, v.duree_s > 0)) as pct_regarde_moyen,
  round(1000 * sum(ig.partages) / greatest(sum(ig.vues), 1), 1) as partages_1000,
  round(1000 * sum(ig.enregistrements) / greatest(sum(ig.vues), 1), 1) as enregistrements_1000,
  round(1000 * sum(coalesce(ab.abonnes, 0)) / greatest(sum(ig.vues), 1), 1) as abonnes_1000
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
group by format order by vues_moyennes desc
