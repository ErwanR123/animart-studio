---
name: bilan
description: Weekly review of Animart's content: read each post's numbers (Metricool, PostHog), fill strategie/journal.md, say what brings waitlist signups and propose next week's posts. Use for "bilan", "stats", "qu'est-ce qui marche", "combien d'inscrits", or every Monday.
---

# /bilan: what worked this week

Platform numbers come from a **screenshot of the Metricool dashboard** the user gives (free plan: no API). Ask
for it if it is missing. Site and waitlist numbers come from PostHog: the MCP server (`.mcp.json`), or its REST API with
`node --env-file=.env` (`POSTHOG_PERSONAL_API_KEY`, project 351733, EU), dashboard « Animart · Waitlist » (id 1122659). If Metricool's
paid plan is ever taken, add its MCP server (`uvx --env-file .env mcp-metricool`) and read the numbers directly.

1. **The posts**: the journal's lines from the last 14 days without numbers.
2. **Platforms** (the screenshot): for each post, views, average watch time or retention, shares, saves, follows
   gained, at 48 h and 7 days, per platform.
3. **Site and waitlist** (PostHog MCP): visits and `waitlist_signup` events this week, by `utm_source` and
   `utm_campaign`. A signup without a campaign is credited to the platform's posts of the previous 48 h.
4. **Fill** `strategie/journal.md` (numbers only, no comment that the numbers don't support).
5. **Tell the user** in 5 lines: signups this week (and vs last week), the best post and why it likely worked,
   the worst, one change to try, the 5 posts proposed for next week (as in `/contenu` step 1).
6. A lesson that changes how we work goes under « Ce qu'on a appris » in the journal, dated.
