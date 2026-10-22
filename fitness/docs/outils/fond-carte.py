"""Fond de la carte des clubs : lac Léman, cantons de Genève et de Vaud,
frontière suisse, en chemins SVG prêts à coller dans components.js.

Source : paquet npm swiss-maps (Interactive Things, BSD-3), géodonnées
OFS GEOSTAT, usage non commercial, attribution « OFS, GEOSTAT ». Le lab
n'appelle aucune carte en ligne : le fond est généré une fois, ici, et
embarqué.

Usage :
    npm pack swiss-maps && tar -xzf swiss-maps-*.tgz
    python3 fond-carte.py package/2026/ch-combined.json > fond.txt

La projection est une équirectangulaire corrigée de cos(latitude) au
centre de la zone : à cette échelle (50 km), l'écart avec une vraie
projection ne se voit pas. Les constantes PROJ sont reprises telles
quelles dans components.js, qui place les clubs avec la même formule.
"""
import json
import math
import sys

# Zone : de Veyrier au sud à Denges au nord-est, avec de la marge.
LON0, LON1 = 5.95, 6.65
LAT0, LAT1 = 46.12, 46.58
K = math.cos(math.radians((LAT0 + LAT1) / 2))
LARGEUR = 1000.0
ECHELLE = LARGEUR / ((LON1 - LON0) * K)
HAUTEUR = round((LAT1 - LAT0) * ECHELLE, 1)

LEMAN = 9757          # identifiant OFS du lac Léman
GENEVE, VAUD = 25, 22  # numéros OFS des cantons


def proj(lon, lat):
    return ((lon - LON0) * K * ECHELLE, (LAT1 - lat) * ECHELLE)


def arcs_decodes(topo):
    sx, sy = topo['transform']['scale']
    tx, ty = topo['transform']['translate']
    out = []
    for arc in topo['arcs']:
        x = y = 0
        pts = []
        for dx, dy in arc:
            x += dx
            y += dy
            pts.append(proj(x * sx + tx, y * sy + ty))
        out.append(pts)
    return out


def anneau(indices, arcs):
    pts = []
    for i in indices:
        a = arcs[i] if i >= 0 else list(reversed(arcs[~i]))
        pts.extend(a if not pts else a[1:])
    return pts


def polygones(geom, arcs):
    if geom['type'] == 'Polygon':
        return [[anneau(r, arcs) for r in geom['arcs']]]
    if geom['type'] == 'MultiPolygon':
        return [[anneau(r, arcs) for r in p] for p in geom['arcs']]
    return []


def decoupe(pts, marge=600):
    """Sutherland-Hodgman sur le rectangle de la zone, avec une large
    marge : le cadre de la carte n'a pas toujours les proportions du plan,
    et le dessin doit remplir ce qui déborde au lieu de s'arrêter net."""
    bords = [
        (lambda p: p[0] >= -marge, lambda a, b: inter_x(a, b, -marge)),
        (lambda p: p[0] <= LARGEUR + marge, lambda a, b: inter_x(a, b, LARGEUR + marge)),
        (lambda p: p[1] >= -marge, lambda a, b: inter_y(a, b, -marge)),
        (lambda p: p[1] <= HAUTEUR + marge, lambda a, b: inter_y(a, b, HAUTEUR + marge)),
    ]
    for dedans, coupe in bords:
        if not pts:
            return pts
        res = []
        prec = pts[-1]
        for p in pts:
            if dedans(p):
                if not dedans(prec):
                    res.append(coupe(prec, p))
                res.append(p)
            elif dedans(prec):
                res.append(coupe(prec, p))
            prec = p
        pts = res
    return pts


def inter_x(a, b, x):
    t = (x - a[0]) / (b[0] - a[0])
    return (x, a[1] + t * (b[1] - a[1]))


def inter_y(a, b, y):
    t = (y - a[1]) / (b[1] - a[1])
    return (a[0] + t * (b[0] - a[0]), y)


def simplifie(pts, tol=1.2):
    """Douglas-Peucker, itératif. Un anneau fermé (premier point = dernier)
    est coupé en deux moitiés, sinon le segment de départ est de longueur
    nulle et tout le reste semble à distance nulle."""
    if len(pts) < 3:
        return pts
    if pts[0] == pts[-1] and len(pts) > 4:
        m = len(pts) // 2
        return simplifie(pts[:m + 1], tol)[:-1] + simplifie(pts[m:], tol)
    garde = [False] * len(pts)
    garde[0] = garde[-1] = True
    pile = [(0, len(pts) - 1)]
    while pile:
        i, j = pile.pop()
        ax, ay = pts[i]
        bx, by = pts[j]
        dx, dy = bx - ax, by - ay
        n = math.hypot(dx, dy) or 1e-9
        dmax, kmax = 0, None
        for k in range(i + 1, j):
            px, py = pts[k]
            d = abs(dy * px - dx * py + bx * ay - by * ax) / n
            if d > dmax:
                dmax, kmax = d, k
        if kmax is not None and dmax > tol:
            garde[kmax] = True
            pile += [(i, kmax), (kmax, j)]
    return [p for p, g in zip(pts, garde) if g]


def chemin(polys):
    morceaux = []
    for poly in polys:
        for r in poly:
            r = simplifie(decoupe(r))
            if len(r) < 3:
                continue
            morceaux.append('M' + 'L'.join('%d %d' % (round(x), round(y)) for x, y in r) + 'Z')
    return ''.join(morceaux)


def main(fichier):
    topo = json.load(open(fichier))
    arcs = arcs_decodes(topo)
    obj = topo['objects']

    def geom(nom, ident):
        return next(g for g in obj[nom]['geometries'] if str(g.get('id')) == str(ident))

    suisse = chemin(polygones(geom('country', 'CH'), arcs))
    geneve = chemin(polygones(geom('cantons', GENEVE), arcs))
    vaud = chemin(polygones(geom('cantons', VAUD), arcs))
    leman = chemin(polygones(geom('lakes', LEMAN), arcs))
    print(json.dumps({
        'proj': {'lon0': LON0, 'lat1': LAT1, 'k': round(K, 6), 'echelle': round(ECHELLE, 3),
                 'largeur': LARGEUR, 'hauteur': HAUTEUR},
        'suisse': suisse, 'geneve': geneve, 'vaud': vaud, 'leman': leman,
    }, ensure_ascii=False))


if __name__ == '__main__':
    main(sys.argv[1])
