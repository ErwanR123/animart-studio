-- Ce que chaque post a gagné chaque jour (Instagram et YouTube), d'après les relevés horaires (stats_post, depuis le 17/11).
select jour, plateforme, post, nouvelles_vues, nouveaux_likes, nouveaux_commentaires, nouveaux_partages, nouveaux_enregistrements
from (
  select jour, plat as plateforme, titre as post,
    multiIf(pv >= 0, v - pv, toDate(parseDateTimeBestEffort(posted)) = jour, v, null) as nouvelles_vues,
    multiIf(pl >= 0, l - pl, toDate(parseDateTimeBestEffort(posted)) = jour, l, null) as nouveaux_likes,
    multiIf(pc >= 0, c - pc, toDate(parseDateTimeBestEffort(posted)) = jour, c, null) as nouveaux_commentaires,
    multiIf(psh >= 0, sh - psh, toDate(parseDateTimeBestEffort(posted)) = jour, sh, null) as nouveaux_partages,
    multiIf(psv >= 0, sv - psv, toDate(parseDateTimeBestEffort(posted)) = jour, sv, null) as nouveaux_enregistrements
  from (
    select jour, plat, id, titre, posted, v, l, c, sh, sv,
      lagInFrame(v, 1, -1) over w as pv, lagInFrame(l, 1, -1) over w as pl, lagInFrame(c, 1, -1) over w as pc,
      lagInFrame(sh, 1, -1) over w as psh, lagInFrame(sv, 1, -1) over w as psv
    from (
      select toDate(timestamp) as jour, toString(properties.platform) as plat, toString(properties.post_id) as id,
        any(toString(properties.title)) as titre, any(toString(properties.posted)) as posted,
        max(toFloat(properties.views)) as v, max(coalesce(toFloat(properties.likes), 0)) as l, max(coalesce(toFloat(properties.comments), 0)) as c,
        max(coalesce(toFloat(properties.shares), 0)) as sh, max(coalesce(toFloat(properties.saves), 0)) as sv
      from events where event = 'stats_post' and timestamp > now() - interval 60 day
      group by jour, plat, id)
    window w as (partition by plat, id order by jour rows between unbounded preceding and current row))
)
where nouvelles_vues > 0 or nouveaux_likes > 0 or nouveaux_partages > 0 or nouveaux_enregistrements > 0
order by jour desc, nouvelles_vues desc
