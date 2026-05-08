# Harmony Fitness — site

Pages publiques pour la verticale Fitness, déployées sous https://lab.harmony.ch/fitness/

| Page | URL | Source |
|---|---|---|
| Abonnements | https://lab.harmony.ch/fitness/abonnements/ | `abonnements/index.html` |
| Séance d'essai | https://lab.harmony.ch/fitness/seance-essai/ | `seance-essai/index.html` |

## Stack
- HTML/CSS/JS self-contained (un fichier par page)
- React 18 + Babel chargés via CDN
- Police d'affichage Eliptik Harmony embarquée dans `fonts/`
- Carte interactive via Leaflet + OpenStreetMap (page abonnements)

## Déploiement
Auto via GitHub Actions à chaque push sur `main`. Le repo entier est uploadé à la racine `/sites/lab.harmony.ch/fitness/`. Voir `.github/workflows/deploy.yml`.

## Développement local
```bash
python3 -m http.server 8000
# puis http://localhost:8000/abonnements/ ou /seance-essai/
```
