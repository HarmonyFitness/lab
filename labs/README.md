# labs/ — maquettes et essais

Bac à sable pour tester des mises en page avant de les porter dans une verticale.
Rien ici n'est une page officielle : chaque maquette porte `noindex, nofollow`
et n'apparaît dans aucune navigation du site.

| Maquette | Modèle | Page |
|---|---|---|
| `tarifs-tss/` | [thesportsociety.fr/tarifs](https://www.thesportsociety.fr/tarifs) | [Voir](https://lab.harmony.ch/labs/tarifs-tss/) |

## tarifs-tss

Reprend la structure de la page tarifs de The Sport Society (studio à Bordeaux),
rendue avec la charte Harmony : police Eliptik Harmony, palette bleue, barre
groupe et topbar du repo.

**Sections, dans l'ordre du modèle**

1. Bandeau d'annonces défilant
2. Hero pleine largeur, titre « Consultez *nos tarifs* »
3. Offres saisonnières — Pack rentrée + 3 abonnements, avec étiquettes verticales
4. Offres découverte — 2 cartes
5. Abonnements — sélecteur d'engagement 3 / 12 mois
6. Carnets de cours — sélecteur Tous les cours / Cours sur tapis
7. Cartes cadeaux
8. Bandeau application mobile
9. Pied de page

**Écarts assumés par rapport au modèle**

- **Photos** remplacées par des aplats dégradés de la palette Harmony.
- **Devise** : montants du modèle, affichés en CHF pour rester cohérent avec le
  reste du repo. Basculez la constante `CUR` sur `"€"` pour revenir au modèle.
- **Engagement 12 mois** : le modèle n'expose que les tarifs à 3 mois. Ceux à
  12 mois sont une projection à −20 % (`p12` dans `ABOS`).
- **Carnets « Cours sur tapis »** : onglet non capturé sur le modèle, montants à
  confirmer.
- **Cartes cadeaux** : la section existe sur le modèle mais son contenu n'était
  pas chargé à la capture. Trois montants ont été posés.
- **Marque** : logo, nom de l'application et pied de page sont ceux d'Harmony,
  puisque la coque vient du design system du repo.

Toutes ces valeurs sont regroupées en haut du bloc `<script type="text/babel">`.
