(select toString(m.id) as id, toDate(parseDateTimeBestEffort(toString(any(m.timestamp)))) as date,
    sumIf(toFloat(i.value), i.metric = 'views') as vues, sumIf(toFloat(i.value), i.metric = 'likes') as likes,
    sumIf(toFloat(i.value), i.metric = 'shares') as partages, sumIf(toFloat(i.value), i.metric = 'saved') as enregistrements,
    sumIf(toFloat(i.value), i.metric = 'ig_reels_avg_watch_time') / 1000 as temps_moyen
  from instagram_media m join instagram_media_insights i on i.media_id = m.id group by id)
