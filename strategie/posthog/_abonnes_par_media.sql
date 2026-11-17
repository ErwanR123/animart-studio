(select p.id as id, sumIf(f.gagnes, f.d >= p.d and f.d < p.suivant) as abonnes
  from (select id, d, leadInFrame(d, 1, today() + 1) over (order by d, id rows between current row and unbounded following) as suivant
        from (select toString(id) as id, toDate(parseDateTimeBestEffort(toString(timestamp))) as d from instagram_media)) p
  cross join (select toDate(parseDateTimeBestEffort(toString(date))) as d, sumIf(toFloat(value), breakdown_value = 'FOLLOWER') as gagnes
              from instagram_account_insights_breakdowns where metric = 'follows_and_unfollows' group by d) f
  group by p.id)
