# Assets de la page

Les fichiers ci-dessous sont référencés par `../index.html` (objet `A` en haut du
script). Tant qu'un fichier est absent, la page affiche un aplat aux **mêmes
dimensions**, donc la mise en page ne bouge pas quand vous le déposez.

Ils n'ont pas pu être téléchargés depuis cette session : le domaine `figma.com`
est bloqué par le proxy réseau de l'environnement. Deux façons de les obtenir :

- exporter chaque nœud depuis Figma (`Export` dans le panneau de droite) ;
- ou autoriser `figma.com` dans la politique réseau de l'environnement, puis
  redemander la récupération.

## Fichiers attendus

| Fichier | Nœud Figma | Format | Dimensions |
|---|---|---|---|
| `logo-header.svg` | `1:461` | SVG | 132,24 × 60 |
| `logo-footer.svg` | `1:402` | SVG | 156,96 × 163 |
| `icon-cart.svg` | `1:492` | SVG | 20 × 20 |
| `icon-account.svg` | `1:497` | SVG | 20 × 20 |
| `icon-instagram.svg` | `1:426` | SVG | 32 × 32 |
| `icon-facebook.svg` | `1:430` | SVG | 32 × 32 |
| `badge-app-store.svg` | `1:385` | SVG | 150 × 55,26 |
| `badge-google-play.svg` | `1:389` | SVG | 150 × 55,26 |
| `hero.png` | `1:6` | PNG | 1920 × 396 |
| `app-band.png` | `1:379` | PNG | 1920 × 500 |

## Images de carte

Chaque carte a sa propre photo dans la maquette. Elles ne sont pas encore
câblées : ajoutez le chemin dans le champ `img` de l'entrée correspondante
(`PACK_RENTREE`, `ABOS`, `DECOUVERTE`, `CARNETS`, `CADEAUX`) et déposez le
fichier ici.

| Carte | Nœud Figma | Dimensions |
|---|---|---|
| Pack rentrée | `1:37` | 246 × 129,14 |
| 4 / 8 / 12 cours par mois (rail) | `1:62`, `1:86`, `1:110` | 246 × 129,14 |
| 1 cours acheté = 1 cours offert | `1:136` | 258 × 135,44 |
| Semaine Exclusive | `1:155` | 258 × 135,44 |
| 4 / 8 / 12 cours par mois | `1:184`, `1:208`, `1:232` | 258 × 135,44 |
| Carnets 5 / 10 / 20 / 1 cours | `1:261`, `1:280`, `1:299`, `1:318` | 258 × 135,44 |
| Cartes cadeaux | `1:339`, `1:358`, `1:377` | 258 × 135,44 |

## Icône des accordéons

Le « + » des lignes Détails et Validité (nœud `1:49`, 14 × 14) est dessiné en CSS
(`.acc-sign`) plutôt qu'importé : c'est une croix à deux barres qui s'anime en
tiret à l'ouverture, ce qu'un SVG statique ne permet pas.
