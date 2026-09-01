# labs/ — maquettes et essais

Bac à sable pour tester des mises en page avant de les porter dans une verticale.
Rien ici n'est une page officielle : chaque maquette porte `noindex, nofollow`
et n'apparaît dans aucune navigation du site.

| Maquette | Source | Page |
|---|---|---|
| `tarifs-tss/` | [Figma `KV9B5sh1jj2364IfZOSFyz`, nœud `1:508`](https://www.figma.com/design/KV9B5sh1jj2364IfZOSFyz/Sans-titre?node-id=1-508) | [Voir](https://lab.harmony.ch/labs/tarifs-tss/) |

## tarifs-tss

Implémentation de la maquette Figma de la page tarifs de The Sport Society.
Le fichier Figma est un import de `thesportsociety.fr/tarifs` réalisé avec
html.to.design. Pas de design system Harmony ici : palette, typographie, menu et
logo viennent de la maquette.

### Jetons

| Rôle | Valeur | Nœud |
|---|---|---|
| Bordeaux — nav, bouton Réserver, badge engagement, pied de page, bandeau app | `#801624` | `1:483`, `1:501`, `1:63`, `1:400` |
| Terracotta — bandeau d'annonces | `#aa6440` | `1:503` |
| Encre — texte, contour des cartes, badge remise | `#1c0f0a` | `1:44`, `1:43`, `1:65` |
| Noir bouton — « Ajouter au panier » | `#09090b` | `1:60` |
| Gris — prix barré | `#9f9fa9` | `1:59` |
| Gris — prix par séance | `#3f3f46` | `1:45` |
| Crème — texte sur bordeaux | `#fffcf6` | `1:502`, `1:413` |
| Crème 2 — bandeau app | `#fefadd` | `1:380`, `1:382` |
| Sable — fond du hero | `#ba957a` | `1:5` |
| Gris de contour — onglets | `#d1d5dc` | `1:161` |

**Typographie** : Inter (400, 700, italique) et DM Serif Text italique pour le
logo, « Journal », le titre du hero et celui du bandeau app.

### Gabarit

Conteneur de 1280 px centré (maquette 1920 − 2 × 320). En-tête fixe de 108 px,
bandeau d'annonces de 32 px, hero de 396 px. Écart de 120 px entre le hero et la
première section, 96 px entre sections, 120 px avant le bandeau app.

Cartes du rail « Offres saisonnières » : 268 px. Toutes les autres : 280 px, en
colonnes fixes alignées à gauche, gouttière de 32 px.

### Écart de rendu mesuré

Vérifié à 1920 px contre les coordonnées Figma : en-tête, hero, titres de
section, filets de 80 px, positions et hauteurs de cartes (473,13 / 449,13 /
417,44), largeur des onglets (170,5) et rythme du pied de page tombent juste.

Il reste 4 px de dérive à partir de la section Abonnements : le titre sur deux
lignes de la carte « 1 cours acheté = 1 cours offert » mesure 59 px dans
l'import Figma contre 64 px pour deux lignes à 32 px d'interligne. C'est un
artefact de mesure de html.to.design, pas une intention de design.

### Assets

Non téléchargeables depuis la session : `figma.com` est bloqué par le proxy
réseau. Chaque emplacement rend un aplat aux dimensions exactes du nœud, donc
déposer les fichiers ne déplacera rien. Voir
[`tarifs-tss/assets/README.md`](tarifs-tss/assets/README.md) pour la liste des
fichiers, leurs nœuds et leurs dimensions.

### Données absentes de la maquette

- **Engagement 12 mois** : la maquette n'expose que les tarifs à 3 mois. Ceux à
  12 mois sont une projection à −20 % (`p12` dans `ABOS`).
- **Carnets « Cours sur tapis »** : onglet non rendu dans la maquette, montants à
  confirmer.
- Les montants des cartes cadeaux (**30 €, 50 €, 100 €**) et les libellés
  viennent bien de la maquette (nœuds `1:324`, `1:343`, `1:362`).
