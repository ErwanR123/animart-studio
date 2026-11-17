-- Abonnés gagnés par vidéo (Instagram) : chaque vidéo reçoit les abonnements des jours entre sa publication et la suivante.
select p.d as date, p.post as video, p.vues as vues,
  sumIf(f.gagnes, f.d >= p.d and f.d < p.suivant) as abonnes_gagnes,
  sumIf(f.perdus, f.d >= p.d and f.d < p.suivant) as desabonnements,
  round(1000 * sumIf(f.gagnes, f.d >= p.d and f.d < p.suivant) / greatest(p.vues, 1), 1) as abonnes_pour_1000_vues,
  dateDiff('day', p.d, least(p.suivant, today() + 1)) as jours_comptes
from (
  select id, d, post, vues,
    leadInFrame(d, 1, today() + 1) over (order by d, id rows between current row and unbounded following) as suivant
  from (
    select toString(m.id) as id, toDate(parseDateTimeBestEffort(toString(m.timestamp))) as d,
      substringUTF8(replaceAll(m.caption, '\n', ' '), 1, 60) as post, sumIf(toFloat(i.value), i.metric = 'views') as vues
    from instagram_media m left join instagram_media_insights i on i.media_id = m.id
    group by id, d, post)
) p
cross join (
  select toDate(parseDateTimeBestEffort(toString(date))) as d, sumIf(toFloat(value), breakdown_value = 'FOLLOWER') as gagnes, sumIf(toFloat(value), breakdown_value = 'NON_FOLLOWER') as perdus
  from instagram_account_insights_breakdowns where metric = 'follows_and_unfollows' group by d
) f
group by date, video, vues, p.suivant
order by date desc
