-- Chaque jour en une ligne : ce qui a été posté, ce qu'Instagram a donné (compte entier), les abonnés, le site.
select j.jour as jour, coalesce(p.posts, '') as posts_publies,
  j.vues as vues_ig, j.comptes_touches as comptes_touches, j.likes as likes, j.commentaires as commentaires,
  j.partages as partages, j.enregistrements as enregistrements,
  coalesce(fo.gagnes, 0) as abonnes_gagnes, coalesce(fo.perdus, 0) as desabonnements,
  j.clics_lien_bio as clics_lien_bio, coalesce(s.visiteurs, 0) as visiteurs_site, coalesce(s.inscrits, 0) as inscrits_waitlist
from (
  select toDate(parseDateTimeBestEffort(toString(date))) as jour,
    sumIf(toFloat(value), metric = 'views') as vues, sumIf(toFloat(value), metric = 'reach') as comptes_touches,
    sumIf(toFloat(value), metric = 'likes') as likes, sumIf(toFloat(value), metric = 'comments') as commentaires,
    sumIf(toFloat(value), metric = 'shares') as partages, sumIf(toFloat(value), metric = 'saves') as enregistrements,
    sumIf(toFloat(value), metric = 'profile_links_taps') as clics_lien_bio
  from instagram_account_insights group by jour) j
left join (
  select toDate(parseDateTimeBestEffort(toString(timestamp))) as jour,
    arrayStringConcat(groupArray(substringUTF8(replaceAll(caption, '\n', ' '), 1, 45)), ' · ') as posts
  from instagram_media group by jour) p on p.jour = j.jour
left join (
  select toDate(parseDateTimeBestEffort(toString(date))) as jour,
    sumIf(toFloat(value), breakdown_value = 'FOLLOWER') as gagnes, sumIf(toFloat(value), breakdown_value = 'NON_FOLLOWER') as perdus
  from instagram_account_insights_breakdowns where metric = 'follows_and_unfollows' group by jour) fo on fo.jour = j.jour
left join (
  select toDate(timestamp) as jour, uniqIf(distinct_id, event = '$pageview') as visiteurs, countIf(event = 'waitlist_signup') as inscrits
  from events where timestamp > now() - interval 90 day and event in ('$pageview', 'waitlist_signup')
    and coalesce(properties.utm_source, '') not ilike 'test%'
  group by jour) s on s.jour = j.jour
where j.jour >= today() - 45
order by jour desc
