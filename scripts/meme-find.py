# /// script
# requires-python = ">=3.10,<3.13"
# dependencies = []
# ///
"""Find recent funny / viral French videos on YouTube (Snap compilations, memes, reactions, shorts) for the meme bank.
Uses yt-dlp on YouTube's own search with its upload-date filter, so only recent uploads come back, sorted by views.

  uv run scripts/meme-find.py "pires snap" "meme français" --period month
  uv run scripts/meme-find.py "réaction choqué" --period week --short --min-views 5000
  uv run scripts/meme-find.py "https://www.youtube.com/@SomeChannel/shorts" --channel   # a channel's latest shorts

--period: week | month | year (default month). --short: videos under 4 minutes only (shorts and single clips,
easier to cut than 15-minute compilations). Prints: views, duration, channel, title, url.
TikTok has no scrapable search: paste single TikTok links straight into meme-scan.py / meme-cut.py (yt-dlp reads them).
"""
import argparse
import json
import subprocess
import urllib.parse

# YouTube's "sp" search filters: upload date (+ "under 4 minutes" when --short).
SP = {
    ("week", False): "EgIIAw%3D%3D",
    ("month", False): "EgIIBA%3D%3D",
    ("year", False): "EgIIBQ%3D%3D",
    ("week", True): "EgQIAxgB",
    ("month", True): "EgQIBBgB",
    ("year", True): "EgQIBRgB",
}


def entries(url: str, n: int) -> list[dict]:
    out = subprocess.run(["yt-dlp", "--flat-playlist", "-I", f"1:{n}", "-j", url], capture_output=True, text=True)
    rows = []
    for line in out.stdout.splitlines():
        try:
            rows.append(json.loads(line))
        except json.JSONDecodeError:
            pass
    return rows


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("queries", nargs="+")
    ap.add_argument("--period", choices=["week", "month", "year"], default="month")
    ap.add_argument("--short", action="store_true")
    ap.add_argument("--min-views", type=int, default=1000)
    ap.add_argument("-n", type=int, default=25, help="results read per query")
    ap.add_argument("--channel", action="store_true", help="the queries are channel / playlist urls")
    args = ap.parse_args()
    seen = set()
    for q in args.queries:
        url = q if args.channel else (
            "https://www.youtube.com/results?search_query=" + urllib.parse.quote_plus(q) + "&sp=" + SP[(args.period, args.short)] + "&hl=fr&gl=FR"
        )
        rows = [r for r in entries(url, args.n) if r.get("id") not in seen and (r.get("view_count") or 0) >= args.min_views]
        rows.sort(key=lambda r: -(r.get("view_count") or 0))
        print(f"## {q}")
        for r in rows:
            seen.add(r["id"])
            d = int(r.get("duration") or 0)
            print(f"  {r.get('view_count') or 0:>9,}  {d // 60:>2}:{d % 60:02}  {(r.get('channel') or '')[:22]:<22}  "
                  f"{(r.get('title') or '')[:70]:<70}  https://youtu.be/{r['id']}")


main()
