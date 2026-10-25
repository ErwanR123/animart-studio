# /// script
# requires-python = ">=3.10"
# ///
"""Find and fetch the images an episode needs: museum scans and period archives (Wikimedia Commons), European
libraries and museums (Europeana: French press, prints, posters), pages of old books, journals and newspapers
(Internet Archive), and paintings at full museum resolution (Google Arts & Culture, IIIF viewers, via dezoomify-rs).
Downloads land in out/sources/ (git-ignored); prepare the pieces with scripts/image-collage.py and record each one in
public/art/SOURCES.md.

  uv run scripts/image-find.py search "Krakatoa 1883 engraving" "Edvard Munch photograph"   # Commons file names
  uv run scripts/image-find.py info "Edvard Munch - The Scream - Google Art Project.jpg"     # size, licence, date, url
  uv run scripts/image-find.py get "Edvard Munch - The Scream - Google Art Project.jpg"      # download (the largest standard thumbnail, ≤ 3840 px)
  uv run scripts/image-find.py inside science31884amer "red sunsets"                          # pages of an IA scan with those words
  uv run scripts/image-find.py page science31884amer 12                                       # that page as an image
  uv run scripts/image-find.py category "1890 Le Petit Journal" "Le Petit Parisien supplément littéraire illustré"   # files in a Commons category
  uv run scripts/image-find.py europeana "Krakatoa" "Exposition universelle 1889 affiche"     # title, year, provider, image url
  uv run scripts/image-find.py url "https://…/image.jpg" [name.jpg]                           # download any direct link
  uv run scripts/image-find.py hires "https://artsandculture.google.com/asset/…"              # the largest tiles, stitched

Gallica blocks scripted access (Cloudflare 403): reach its press through Europeana or Commons, or save by hand.

Commons asks for a User-Agent and a pause between calls (it answers 429 otherwise): both are built in.
"""
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

UA = {"User-Agent": "AnimartVideoStudio/1.0 (painting shorts; research)"}
OUT = Path("out/sources")


def fetch(url: str) -> bytes:
    for attempt in range(6):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code != 429 or attempt == 5:
                raise
            time.sleep(5 * 2**attempt)  # Commons rate limit: back off 5, 10, 20… s and retry
    raise AssertionError("unreachable")


def commons(**params) -> dict:
    params.update(action="query", format="json")
    return json.loads(fetch("https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)))


def info(name: str) -> dict:
    page = next(iter(commons(titles=f"File:{name}", prop="imageinfo", iiprop="url|size|extmetadata")["query"]["pages"].values()))
    if "imageinfo" in page:
        # Commons throttles downloads of originals (429) and serves thumbnails only at standard widths: take the
        # largest one under the original's width.
        width = page["imageinfo"][0]["width"]
        thumb = max((w for w in (3840, 1920, 1280, 960, 500) if w < width), default=None)
        if thumb:
            time.sleep(0.6)
            page = next(iter(commons(titles=f"File:{name}", prop="imageinfo", iiprop="url|size|extmetadata", iiurlwidth=thumb)["query"]["pages"].values()))
    if "imageinfo" not in page:
        raise SystemExit(f"not on Commons: {name}")
    ii = page["imageinfo"][0]
    meta = ii["extmetadata"]
    return {
        "size": f"{ii['width']}×{ii['height']}",
        "licence": meta.get("LicenseShortName", {}).get("value", ""),
        "date": meta.get("DateTimeOriginal", {}).get("value", "")[:60],
        "author": meta.get("Artist", {}).get("value", "")[:100],
        "url": ii["url"].split("?")[0],
        "download": thumb_url(ii),
    }


def thumb_url(ii: dict) -> str:
    """The thumbnail asked for, built by hand when Commons answers with the throttled original ("unscaled")."""
    t = ii.get("thumburl", "")
    if not t or "unscaled" in t:
        if "thumbwidth" not in ii:
            return ii["url"].split("?")[0]
        base, name = ii["url"].split("?")[0].split("/commons/", 1)
        return f"{base}/commons/thumb/{name}/{ii['thumbwidth']}px-{name.rsplit('/', 1)[1]}"
    return t.split("?")[0]


mode, *args = sys.argv[1:] or ["-h"]
if mode == "search":
    for q in args:
        print(f"## {q}")
        for r in commons(list="search", srsearch=q, srnamespace=6, srlimit=12)["query"]["search"]:
            print("  " + r["title"].removeprefix("File:"))
        time.sleep(0.6)
elif mode == "info":
    for name in args:
        print(name, json.dumps(info(name), ensure_ascii=False, indent=1))
        time.sleep(0.6)
elif mode == "get":
    OUT.mkdir(parents=True, exist_ok=True)
    for name in args:
        meta = info(name)
        url = meta["download"]
        dest = OUT / urllib.parse.unquote(meta["url"].rsplit("/", 1)[1])
        if dest.exists():
            print(f"have {dest}")
            continue
        dest.write_bytes(fetch(url))
        print(f"wrote {dest}")
        time.sleep(3)
elif mode == "inside":
    item, query = args
    meta = json.loads(fetch(f"https://archive.org/metadata/{item}"))
    doc = next(f["name"][: -len("_djvu.xml")] for f in meta["files"] if f["name"].endswith("_djvu.xml"))
    q = urllib.parse.urlencode({"item_id": item, "doc": doc, "path": meta["dir"], "q": query})
    for hit in json.loads(fetch(f"https://{meta['server']}/fulltext/inside.php?{q}")).get("matches", [])[:20]:
        print(f"page n{hit['par'][0]['page']}: " + hit["text"][:150].replace("\n", " ").replace("<IA_FTS_MATCH>", "[").replace("</IA_FTS_MATCH>", "]"))
elif mode == "page":
    item, n = args
    OUT.mkdir(parents=True, exist_ok=True)
    dest = OUT / f"{item}-n{n}.jpg"
    dest.write_bytes(fetch(f"https://archive.org/download/{item}/page/n{n}_w1600.jpg"))
    print(f"wrote {dest}")
elif mode == "category":
    for cat in args:
        print(f"## {cat}")
        r = commons(list="categorymembers", cmtitle=f"Category:{cat}", cmtype="file|subcat", cmlimit=50)
        for m in r["query"]["categorymembers"]:
            print("  " + m["title"].removeprefix("File:"))
        time.sleep(0.6)
elif mode == "europeana":
    # The public demo key is enough for searches; get a free personal key if it starts refusing (rate limit).
    for q in args:
        print(f"## {q}")
        p = urllib.parse.urlencode({"wskey": "api2demo", "query": q, "rows": 15, "qf": "TYPE:IMAGE", "media": "true"})
        for it in json.loads(fetch("https://api.europeana.eu/record/v2/search.json?" + p)).get("items", []):
            title = (it.get("title") or ["?"])[0][:90]
            year = (it.get("year") or [""])[0]
            print(f"  {title} · {year} · {(it.get('dataProvider') or [''])[0]} · {(it.get('rights') or [''])[0].rsplit('/', 3)[-3]}")
            print(f"    {(it.get('edmIsShownBy') or it.get('edmIsShownAt') or [''])[0]}")
elif mode == "url":
    OUT.mkdir(parents=True, exist_ok=True)
    link, *name = args
    dest = OUT / (name[0] if name else urllib.parse.unquote(link.split("?")[0].rsplit("/", 1)[1]))
    dest.write_bytes(fetch(link))
    print(f"wrote {dest}")
elif mode == "hires":
    import subprocess

    OUT.mkdir(parents=True, exist_ok=True)
    link, *name = args
    dest = OUT / (name[0] if name else f"hires-{int(time.time())}.jpg")
    subprocess.run(["dezoomify-rs", "--largest", link, str(dest)], check=True)  # brew install dezoomify-rs
    print(f"wrote {dest}")
else:
    print(__doc__)
