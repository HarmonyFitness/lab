# Questions ouvertes

Questions relevées pendant la construction des wireframes. Règle : ne pas trancher,
poser un placeholder visible dans la maquette et continuer.

Statut : `ouverte` · `tranchée` (avec la réponse) · `sans objet`

---

## Relevées au cadrage (étape 1)

### Q1 · Promesses Essential et Premium
**Statut :** ouverte
**Source :** B.3 > Catégories de clubs > tableau, colonne « Promesse »
Les deux cellules disent « À compléter ». La promesse alimente le module
« Catégories de clubs », affiché sur /clubs (ancre #categories), /tarifs et
l'accueil, et le panneau qui s'ouvre au clic sur un badge catégorie.
**Placeholder :** « [Promesse Essential] », « [Promesse Premium] ».

### Q2 · Nombre de séances de coaching incluses
**Statut :** ouverte
**Source :** B.3 > Catégories de clubs > règles d'affichage (« nombre à compléter »)
et B.3 > Page Coaching personnel > bloc 2 (« [X] séances »).
Apparaît sur la carte formule de /tarifs (ce qui est inclus) et sur
/sport/coaching-personnel.
**Placeholder :** « [X] séances ».

### Q3 · Nom de l'application de suivi
**Statut :** ouverte
**Source :** B.3 > Page Coaching personnel > bloc 4 (« Nom et fonctionnalités à
compléter ») et B.3 > Titres de la branche Sport (sous-titre « un suivi dans
l'application [nom] »).
**Placeholder :** « [nom de l'application] ».

### Q4 · Coaching personnel et formule GYM
**Statut :** ouverte
**Source :** B.3 > Page Coaching personnel > bloc 7 (« et la formule GYM
(séances non incluses, à confirmer) »).
Impacte la carte formule GYM sur /tarifs : la ligne « séances de coaching »
est-elle absente, ou présente avec une mention ?

### Q5 · Valeurs du sélecteur d'engagement
**Statut :** ouverte
**Source :** B.3 > Page Tarifs > trame, bloc 4 (« sélecteur d'engagement »).
B.3 impose le sélecteur mais ne liste jamais les engagements possibles. La
section 7.3 parle d'« engagements ou durée » sans valeurs. L'ancienne maquette
du lab utilisait « sans engagement » et « 12 mois (−10 %) », mais ce n'est pas
une source de vérité.
**Placeholder :** deux engagements « Sans engagement » et « 12 mois », marqués
comme hypothèse dans le sélecteur d'état.

### Q6 · Volume des pages Cours collectifs
**Statut :** tranchée pour les wireframes
**Source :** B.3 > Cours collectifs : périmètre et pages retenues > « À réconcilier ».
B.3 signale lui-même la contradiction entre la logique de juillet (9 fiches +
3 hubs) et le document de septembre (une trentaine de pages).
**Réponse :** CLAUDE.md > Périmètre tranche pour les maquettes : on construit les
gabarits (hub, hub de catégorie, fiche), pas le volume de pages. Le choix reste
ouvert côté cahier des charges.

### Q7 · Les 6 objectifs de cours
**Statut :** ouverte
**Source :** B.3 > Trame de la page club > bloc 5 (« liste compacte rangée par les
6 objectifs ») et B.3 > Trame de la page club > bloc 4 (filtre « objectif »).
Les 6 objectifs ne sont listés nulle part dans B.3 ni en section 7.
**Placeholder :** « [Objectif 1] » à « [Objectif 6] ».

### Q8 · Nombre de cours par semaine dans un club GYM
**Statut :** ouverte
**Source :** B.3 > Clubs > ligne « Clubs (hub) » (la carte club affiche « nombre de
cours par semaine ») croisé avec B.3 > Catégories de clubs (GYM : « Pas de cours
collectifs »).
Que montre la carte de Genève · Pâquis : rien, un zéro, ou le nombre de séances
de Small Group Training ?
**Placeholder :** la ligne est masquée sur la carte GYM, à confirmer.

### Q9 · Dossier du gabarit de fiche cours dans le lab
**Statut :** ouverte
**Source :** B.3 > Arborescence (`/cours/[cours]`, à la racine du site, pas sous
`/sport`) et CLAUDE.md > Technique (pages à gabarit : un seul fichier, le
paramètre dans l'URL).
Le motif de CLAUDE.md donne `clubs/club/?club=meyrin`. Transposé, la fiche cours
donnerait `cours/cours/?cours=yoga`, qui se lit mal.
**Proposition :** `cours/fiche/?cours=yoga` pour représenter `/cours/yoga`.

### Q10 · Page Séance d'essai
**Statut :** ouverte
**Source :** CLAUDE.md > Périmètre (la page n'y figure pas) contre B.3 > Tarifs et
offres et Annexe A > A.2 (le composant choix du club sert aussi à /seance-essai).
Le composant est construit, la page ne l'est pas. À confirmer.

### Q11 · Prix
**Statut :** ouverte par nature
**Source :** B.3 ne contient aucun prix réel, section 7 non plus.
Tous les prix sont en « CHF XX.– », sauf les deux offres Black Friday fournies
directement (Premium 7 mois CHF 777.–, Essential 7 mois et 7 semaines CHF 777.–).

### Q12 · Adresses, horaires et coordonnées des 10 clubs
**Statut :** ouverte par nature
**Source :** B.3 > Convention de nommage des clubs donne les noms, les catégories
et les slugs, pas les adresses.
**Placeholder :** « [adresse] », « [horaires] », « [téléphone] ».

### Q13 · Carnets d'entrées
**Statut :** ouverte
**Source :** B.3 > Page Tarifs > trame, bloc 5 (« filtres GYM / Essential /
Premium sans club »).
B.3 laisse entendre au moins un carnet par catégorie, sans le dire. Trois
carnets sont maquettés, un par catégorie, prix et nombre d'entrées en
placeholder.

### Q14 · Page d'accueil
**Statut :** tranchée pour les wireframes
**Source :** B.3 > Accueil contre CLAUDE.md > Périmètre.
**Réponse :** l'accueil du site n'est pas maquetté. `fitness/index.html` sert de
sommaire du lab, pas de maquette de la page d'accueil.
