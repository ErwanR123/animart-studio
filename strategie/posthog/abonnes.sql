-- Abonnés Instagram et YouTube, jour par jour. Les jours relevés : le dernier relevé horaire du jour (stats_account,
-- depuis le 17/11). Avant : Instagram reconstruit à rebours depuis le relevé du dernier jour qu'Instagram a détaillé,
-- avec les abonnements / désabonnements de chaque jour (sans relevé ce jour-là : depuis le chiffre actuel).
select jour, instagram, youtube from (
select d.jour as jour, coalesce(snap_ig.f, a.ancre - d.net_apres) as instagram, snap_yt.f as youtube
from (
  select jour, coalesce(sum(net) over (order by jour desc rows between unbounded preceding and 1 preceding), 0) as net_apres
  from (select toDate(parseDateTimeBestEffort(toString(date))) as jour,
          sumIf(toFloat(value), breakdown_value = 'FOLLOWER') - sumIf(toFloat(value), breakdown_value = 'NON_FOLLOWER') as net
        from instagram_account_insights_breakdowns where metric = 'follows_and_unfollows' group by jour)
) d
cross join (
  select coalesce(
    (select argMax(toFloat(properties.followers), timestamp) from events where event = 'stats_account' and properties.platform = 'instagram'
       and toDate(timestamp) = (select max(toDate(parseDateTimeBestEffort(toString(date)))) from instagram_account_insights_breakdowns where metric = 'follows_and_unfollows')),
    (select toFloat(any(followers_count)) from instagram_account)) as ancre
) a
left join (select toDate(timestamp) as jour, argMax(toFloat(properties.followers), timestamp) as f from events
           where event = 'stats_account' and properties.platform = 'instagram' group by jour) snap_ig on snap_ig.jour = d.jour
left join (select toDate(timestamp) as jour, argMax(toFloat(properties.followers), timestamp) as f from events
           where event = 'stats_account' and properties.platform = 'youtube' group by jour) snap_yt on snap_yt.jour = d.jour
where d.jour >= today() - 60
union all
select toDate(timestamp) as jour, argMaxIf(toFloat(properties.followers), timestamp, properties.platform = 'instagram') as instagram,
  argMaxIf(toFloat(properties.followers), timestamp, properties.platform = 'youtube') as youtube
from events where event = 'stats_account' and toDate(timestamp) > (select max(toDate(parseDateTimeBestEffort(toString(date)))) from instagram_account_insights_breakdowns where metric = 'follows_and_unfollows')
group by jour
) order by jour
