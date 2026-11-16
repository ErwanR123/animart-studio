---
name: bilan
description: Weekly review of Animart's content: read each post's numbers (Metricool, PostHog), fill strategie/journal.md, say what brings waitlist signups and propose next week's posts. Use for "bilan", "stats", "qu'est-ce qui marche", "combien d'inscrits", or every Monday.
---

# /bilan: what worked this week

Needs the Metricool and PostHog MCP servers (`.mcp.json`; keys in `.env`, see `strategie/README.md`). If one is
not connected, say which and go on with the other.

1. **The posts**: the journal's lines from the last 14 days without numbers.
2. **Platforms** (Metricool MCP): for each post, views, average watch time or retention, shares, saves, follows
   gained, at 48 h and 7 days, per platform.
3. **Site and waitlist** (PostHog MCP): visits and `waitlist_signup` events this week, by `utm_source` and
   `utm_campaign`. A signup without a campaign is credited to the platform's posts of the previous 48 h.
4. **Fill** `strategie/journal.md` (numbers only, no comment that the numbers don't support).
5. **Tell the user** in 5 lines: signups this week (and vs last week), the best post and why it likely worked,
   the worst, one change to try, the 5 posts proposed for next week (as in `/contenu` step 1).
6. A lesson that changes how we work goes under « Ce qu'on a appris » in the journal, dated.
