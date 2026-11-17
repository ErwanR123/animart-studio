-- La vie de chaque post : ses vues cumulées le jour de sa publication (J0), puis J1, J2, J3 et J7, d'après les relevés
-- horaires (posts publiés depuis le 16/11). Un post qui meurt en un jour ou qui repart se voit ici.
select plateforme, post, publie_le,
  maxIf(v, j = 0) as j0, maxIf(v, j = 1) as j1, maxIf(v, j = 2) as j2, maxIf(v, j = 3) as j3, maxIf(v, j = 7) as j7
from (
  select toString(properties.platform) as plateforme, toString(properties.post_id) as id, any(toString(properties.title)) as post,
    toDate(parseDateTimeBestEffort(any(toString(properties.posted)))) as publie_le, toDate(timestamp) as jour,
    dateDiff('day', publie_le, jour) as j, max(toFloat(properties.views)) as v
  from events where event = 'stats_post' group by plateforme, id, jour
)
where publie_le >= toDate('2026-11-16')
group by plateforme, post, publie_le order by publie_le desc
