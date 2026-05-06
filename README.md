# Harmony Pricing

Page d'abonnements pour Harmony Fitness — déployée sur https://lab.harmony.ch/abonnements/

## Stack
- HTML/CSS/JS dans un seul fichier (`index.html`)
- React 18 + Babel chargés via CDN
- Police d'affichage Eliptik Harmony embarquée dans `fonts/`
- Carte interactive via Leaflet + OpenStreetMap

## Déploiement
Auto via GitHub Actions à chaque push sur `main`. Voir `.github/workflows/deploy.yml`.

## Développement local
```bash
python3 -m http.server 8000
# puis http://localhost:8000/
```
