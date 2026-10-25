# /// script
# requires-python = ">=3.11"
# ///
"""A flat map for the collage shots from OpenStreetMap (Overpass, free, no key): a boundary to fill as land, rivers,
named streets to draw on as routes, named places to pin. Writes src/guide/maps/<name>.ts: SVG paths in a viewBox
1000 units wide, simplified, ready for the `map` layer (src/guide/voxkit.tsx).

  uv run scripts/map-osm.py paris --bbox 48.815,2.224,48.902,2.470 --boundary 7444 --river "La Seine" \
      --way "Boulevard de Sébastopol" --way "Rue de Rivoli" --point "Opéra Garnier"
"""

import argparse
import json
import math
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

OVERPASS = "https://overpass-api.de/api/interpreter"
OUT = Path(__file__).resolve().parent.parent / "src" / "guide" / "maps"


def query(q: str) -> list[dict]:
    data = urllib.parse.urlencode({"data": q}).encode()
    req = urllib.request.Request(OVERPASS, data=data, headers={"User-Agent": "animart-studio map-osm"})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                return json.load(r)["elements"]
        except urllib.error.HTTPError as err:
            if err.code not in (429, 502, 503, 504) or attempt == 3:
                raise
            time.sleep(10 * (attempt + 1))  # the public server is busy: wait and ask again
    return []


def stitch(lines: list[list[tuple[float, float]]]) -> list[list[tuple[float, float]]]:
    """Join way geometries end to end into as few lines as possible (a relation's outer ring, a street in pieces)."""
    lines = [list(l) for l in lines if len(l) > 1]
    out = []
    while lines:
        cur = lines.pop(0)
        grown = True
        while grown:
            grown = False
            for i, l in enumerate(lines):
                if l[0] == cur[-1]:
                    cur += l[1:]
                elif l[-1] == cur[-1]:
                    cur += l[::-1][1:]
                elif l[-1] == cur[0]:
                    cur = l[:-1] + cur
                elif l[0] == cur[0]:
                    cur = l[::-1][:-1] + cur
                else:
                    continue
                lines.pop(i)
                grown = True
                break
        out.append(cur)
    return out


def centreline(pts: list[tuple[float, float]], step: float = 6) -> list[tuple[float, float]]:
    """One stroke for a street mapped in many pieces and two carriageways: the points ordered along the street's main
    axis and averaged every `step` units (good for the straight boulevards and the gentle arcs of a city plan)."""
    mx = sum(x for x, _ in pts) / len(pts)
    my = sum(y for _, y in pts) / len(pts)
    sxx = sum((x - mx) ** 2 for x, _ in pts)
    syy = sum((y - my) ** 2 for _, y in pts)
    sxy = sum((x - mx) * (y - my) for x, y in pts)
    a = 0.5 * math.atan2(2 * sxy, sxx - syy)
    ux, uy = math.cos(a), math.sin(a)
    bins: dict[int, list[tuple[float, float]]] = {}
    for x, y in pts:
        bins.setdefault(int(((x - mx) * ux + (y - my) * uy) // step), []).append((x, y))
    return [(round(sum(x for x, _ in b) / len(b), 1), round(sum(y for _, y in b) / len(b), 1)) for _, b in sorted(bins.items())]


def simplify(pts: list[tuple[float, float]], tol: float) -> list[tuple[float, float]]:
    """Douglas-Peucker in viewBox units."""
    if len(pts) < 3:
        return pts
    (x0, y0), (x1, y1) = pts[0], pts[-1]
    dx, dy = x1 - x0, y1 - y0
    norm = math.hypot(dx, dy) or 1e-9
    far, idx = 0.0, 0
    for i, (x, y) in enumerate(pts[1:-1], 1):
        d = abs(dy * x - dx * y + x1 * y0 - y1 * x0) / norm
        if d > far:
            far, idx = d, i
    if far <= tol:
        return [pts[0], pts[-1]]
    return simplify(pts[: idx + 1], tol)[:-1] + simplify(pts[idx:], tol)


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("name")
    p.add_argument("--bbox", required=True, help="south,west,north,east")
    p.add_argument("--boundary", type=int, help="OSM relation id of the land to fill")
    p.add_argument("--river", action="append", default=[])
    p.add_argument("--way", action="append", default=[], help="a named street (drawn on as a route)")
    p.add_argument("--point", action="append", default=[], help="a named place (node or building) to pin")
    p.add_argument("--tol", type=float, default=0.8)
    a = p.parse_args()

    s, w, n, e = (float(v) for v in a.bbox.split(","))
    k = math.cos(math.radians((s + n) / 2))
    scale = 1000 / ((e - w) * k)
    height = (n - s) * scale

    def xy(lat: float, lon: float) -> tuple[float, float]:
        return (round((lon - w) * k * scale, 1), round((n - lat) * scale, 1))

    def path(lines: list[list[tuple[float, float]]], close: bool = False) -> str:
        parts = []
        for line in lines:
            # A closed ring would collapse (its ends are the same point): simplify its two halves.
            h = len(line) // 2
            pts = simplify(line[: h + 1], a.tol)[:-1] + simplify(line[h:], a.tol) if close else simplify(line, a.tol)
            parts.append("M" + " L".join(f"{x} {y}" for x, y in pts) + (" Z" if close else ""))
        return " ".join(parts)

    bb = f"({s},{w},{n},{e})"
    data: dict = {"width": 1000, "height": round(height, 1), "rivers": {}, "ways": {}, "points": {}}

    if a.boundary:
        rel = query(f"[out:json][timeout:120];relation({a.boundary});out geom;")[0]
        outer = [[xy(g["lat"], g["lon"]) for g in m["geometry"]] for m in rel["members"] if m["type"] == "way" and m.get("role") == "outer"]
        data["land"] = path(stitch(outer), close=True)
    for name in a.river:
        els = query(f'[out:json][timeout:120];way["waterway"="river"]["name"="{name}"]{bb};out geom;')
        data["rivers"][name] = path(stitch([[xy(g["lat"], g["lon"]) for g in el["geometry"]] for el in els]))
    for name in a.way:
        els = query(f'[out:json][timeout:120];way["highway"]["name"="{name}"]{bb};out geom;')
        data["ways"][name] = path([centreline([xy(g["lat"], g["lon"]) for el in els for g in el["geometry"]])])
        print(f"{name}: {len(els)} ways")
    for name in a.point:
        els = query(f'[out:json][timeout:120];nwr["name"="{name}"]{bb};out center;')
        if not els:
            print(f"!! {name}: not found")
            continue
        el = els[0]
        lat, lon = (el["lat"], el["lon"]) if "lat" in el else (el["center"]["lat"], el["center"]["lon"])
        data["points"][name] = list(xy(lat, lon))

    OUT.mkdir(parents=True, exist_ok=True)
    const = "".join(part.capitalize() for part in a.name.replace("-", " ").split())
    target = OUT / f"{a.name}.ts"
    target.write_text(
        f"// Generated by scripts/map-osm.py from OpenStreetMap (© OpenStreetMap contributors). Do not edit by hand.\n"
        f"// {' '.join(['uv run scripts/map-osm.py', a.name, '--bbox', a.bbox])} …\n"
        f'import type {{ MapData }} from "../voxkit";\n\n'
        f"export const {const}: MapData = {json.dumps(data, ensure_ascii=False, indent=2)};\n"
    )
    print(target, f"({target.stat().st_size // 1024} kB)")


if __name__ == "__main__":
    main()
