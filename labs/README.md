# labs/ — maquettes et essais

Bac à sable pour tester des mises en page avant de les porter dans une verticale.
Rien ici n'est une page officielle : chaque maquette porte `noindex, nofollow`
et n'apparaît dans aucune navigation du site.

| Maquette | Modèle | Page |
|---|---|---|
| `tarifs-tss/` | [thesportsociety.fr/tarifs](https://www.thesportsociety.fr/tarifs) | [Voir](https://lab.harmony.ch/labs/tarifs-tss/) |

## tarifs-tss

Clone de la page tarifs de The Sport Society (studio à Bordeaux), reconstruit
d'après une capture PDF de la page. Le design system Harmony n'est pas utilisé
ici : palette, typographie, menu et logo sont ceux du modèle.

**Palette relevée sur le modèle**

| Rôle | Valeur |
|---|---|
| Bordeaux (logo, nav, boutons) | `#801624` |
| Texte principal | `#1c0f0a` |
| Texte secondaire | `#3f3f47` |
| Prix barré, texte discret | `#9f9fa9` |
| Bandeau d'annonces | `#ababab` |

**Typographie** : Libre Franklin (reprise libre de Franklin Gothic, la police du
modèle) pour le sans-serif, DM Serif Text pour les italiques (logo, « Journal »,
titre du hero, titre du bandeau app).

**Sections, dans l'ordre du modèle**

1. En-tête fixe : logo, menu, panier, compte, bouton Réserver
2. Bandeau d'annonces défilant
3. Hero 421 px, titre « Consultez *nos tarifs* »
4. Offres saisonnières — Pack rentrée + 3 abonnements, étiquettes verticales
5. Offres découverte — 2 cartes
6. Abonnements — onglets d'engagement 3 / 12 mois
7. Carnets de cours — onglets Tous les cours / Cours sur tapis
8. Cartes cadeaux
9. Bandeau application mobile
10. Pied de page

**Écarts par rapport au modèle**

- **Photos** remplacées par des aplats dégradés dans les tons du modèle
  (terracotta, beige, bleu-gris). Les couleurs du hero viennent de l'image
  d'aperçu encodée dans le HTML du site.
- **Fonds des boutons** : l'export PDF n'imprime pas les couleurs de fond.
  « Réserver » et « Ajouter au panier » sont rendus en bordeaux plein avec texte
  blanc, d'après les classes `bg-primary` relevées dans le HTML du site.
- **Engagement 12 mois** : le modèle n'expose que les tarifs à 3 mois. Ceux à
  12 mois sont une projection à −20 % (`p12` dans `ABOS`).
- **Carnets « Cours sur tapis »** : onglet non chargé sur la capture, montants à
  confirmer.
- **Cartes cadeaux** : section présente sur le modèle, contenu non chargé à la
  capture. Trois montants ont été posés.

Toutes ces valeurs sont regroupées en haut du bloc `<script type="text/babel">`.
