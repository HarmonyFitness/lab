# Harmony Lab — site multi-verticales

Pages publiques sous **https://lab.harmony.ch/** — un repo pour toutes les verticales du groupe Harmony.

| Verticale | Pages |
|---|---|
| **Fitness** (`fitness/`) | _wireframes en cours de reconstruction_ |
| MAA (`maa/`) | _à venir_ |
| Aqua (`aqua/`) | _à venir_ |
| Famille (`famille/`) | _à venir_ |
| **Labs** (`labs/`) | [Tarifs (implémentation Figma, The Sport Society)](https://lab.harmony.ch/labs/tarifs-tss/) |

`labs/` regroupe des maquettes hors sitemap (`noindex`), voir [labs/README.md](labs/README.md).

L'arborescence des pages Fitness suit la sitemap officielle (voir Annexe B — Notion) : `/offres/`, `/clubs/`, `/sport/`, `/bien-etre/`, `/aide`.

## Stack
- HTML/CSS/JS self-contained (un fichier par page)
- React 18 + Babel chargés via CDN
- Police d'affichage Eliptik Harmony embarquée dans `<verticale>/fonts/`
- Carte interactive via Leaflet + OpenStreetMap (page Fitness/Abonnements)

## Déploiement
Auto via GitHub Actions à chaque push sur `main`. Le repo entier est uploadé à la racine `/sites/lab.harmony.ch/`. Voir `.github/workflows/deploy.yml`.

## Accès
Le lab est destiné à passer derrière un identifiant et un mot de passe, avec des accès limités possibles à une partie des pages (par exemple les pages de cours seules). Les fichiers de configuration sont prêts dans [`acces/`](acces/README.md), pas encore actifs : il manque le chemin absolu du site sur le serveur. Le dossier `acces/` n'est pas déployé.

## Développement local
```bash
python3 -m http.server 8000
# puis http://localhost:8000/fitness/
```
