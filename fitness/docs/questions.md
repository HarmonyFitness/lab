# Questions ouvertes

Questions relevées pendant la construction des wireframes. Règle : ne pas trancher,
poser un placeholder visible dans la maquette et continuer.

Statut : `ouverte` · `tranchée` (avec la réponse) · `à valider` (texte proposé,
en attente de Harmony) · `sans objet`

Dernière mise à jour : réponses de Hugo au cadrage (étape 1).

---

## Relevées au cadrage (étape 1)

### Q1 · Promesses Essential et Premium
**Statut :** à valider par Harmony
**Source :** B.3 > Catégories de clubs > tableau, colonne « Promesse »
Les deux cellules disent « À compléter ». La promesse alimente le module
« Catégories de clubs », affiché sur /clubs (ancre #categories), /tarifs et
l'accueil, et le panneau qui s'ouvre au clic sur un badge catégorie.
**Réponse (Hugo, étape 1) :** textes proposés, à valider par Harmony.
- Essential : « Un club complet pour s'entraîner : plateau fitness et cours
  collectifs en salle. »
- Premium : « Tout pour s'entraîner, piscine comprise : plateau fitness, cours
  collectifs et cours aquatiques. »
GYM garde la promesse de B.3, qui est déjà rédigée.
**Dans les maquettes :** texte affiché tel quel, accompagné du marqueur « à
valider par Harmony ». Pas de placeholder entre crochets : le texte existe.

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
**Statut :** tranchée
**Source :** B.3 > Page Coaching personnel > bloc 7 (« et la formule GYM
(séances non incluses, à confirmer) »).
Impacte la carte formule GYM sur /tarifs : la ligne « séances de coaching »
est-elle absente, ou présente avec une mention ?
**Réponse (Hugo, étape 1) :** pas de séances de coaching incluses en GYM.
Les 3 cartes formule affichent les mêmes lignes d'inclusion, dans le même
ordre, avec « Non inclus » quand la formule ne couvre pas la ligne. Une ligne
n'est jamais retirée d'une carte : les trois cartes restent comparables ligne
à ligne.

### Q5 · Valeurs du sélecteur d'engagement
**Statut :** tranchée
**Source :** B.3 > Page Tarifs > trame, bloc 4 (« sélecteur d'engagement »).
B.3 impose le sélecteur mais ne liste jamais les engagements possibles. La
section 7.3 parle d'« engagements ou durée » sans valeurs.
**Réponse (Hugo, étape 1) :** deux engagements, « Sans engagement » et
« 12 mois ».
**Contrainte de forme (Hugo, étape 1) :** le sélecteur doit accepter 2 ou 3
valeurs sans changer la forme de la carte formule. Le nombre d'engagements se
lit dans les données, il n'est jamais écrit en dur dans la mise en page.
**Reste à confirmer, non bloquant :**
- Lequel des deux est présélectionné à l'ouverture de la page. Retenu par
  défaut dans les maquettes : « Sans engagement », le premier de la liste.
- B.3 ne prévoit aucune pastille de remise sur l'engagement. Le prix barré et
  la pastille sont réservés à une remise de l'offre du moment sur un produit
  existant (B.3 > Page Tarifs > trame, bloc 3). Les maquettes affichent donc
  deux prix, sans pourcentage. Les montants restent en « CHF XX.– » (Q11).

### Q6 · Volume des pages Cours collectifs
**Statut :** tranchée pour les wireframes
**Source :** B.3 > Cours collectifs : périmètre et pages retenues > « À réconcilier ».
B.3 signale lui-même la contradiction entre la logique de juillet (9 fiches +
3 hubs) et le document de septembre (une trentaine de pages).
**Réponse :** CLAUDE.md > Périmètre tranche pour les maquettes : on construit les
gabarits (hub, hub de catégorie, fiche), pas le volume de pages. Le choix reste
ouvert côté cahier des charges.

### Q7 · Les 6 objectifs de cours
**Statut :** tranchée pour les maquettes
**Source :** B.3 > Trame de la page club > bloc 5 (« liste compacte rangée par les
6 objectifs ») et B.3 > Trame de la page club > bloc 4 (filtre « objectif »).
Les 6 objectifs ne sont listés nulle part dans B.3 ni en section 7.
**Réponse (Hugo, étape 1) :** objectifs provisoires, dans cet ordre.
1. Se renforcer et sculpter
2. Se dépenser
3. Se dépasser
4. Bouger mieux et soulager son dos
5. Se détendre
6. Danser

Filtres retenus, en plus du jour : intensité (doux, modéré, intense) et format
(salle, aqua, petit groupe).
**Source à venir :** `docs/cdc/cours-collectifs.md`, ajouté par Hugo. Ce fichier
fera foi sur les objectifs, les intensités et les formats dès qu'il sera là.

### Q8 · Nombre de cours par semaine dans un club GYM
**Statut :** tranchée
**Source :** B.3 > Clubs > ligne « Clubs (hub) » (la carte club affiche « nombre de
cours par semaine ») croisé avec B.3 > Catégories de clubs (GYM : « Pas de cours
collectifs »).
Que montre la carte de Genève · Pâquis : rien, un zéro, ou le nombre de séances
de Small Group Training ?
**Réponse (Hugo, étape 1) :** sur la carte d'un club GYM, le nombre de cours est
remplacé par « Pas de cours collectifs · Small Group Training en Extra ». La
ligne n'est pas masquée : elle informe.

### Q9 · Dossier du gabarit de fiche cours dans le lab
**Statut :** tranchée
**Source :** B.3 > Arborescence (`/cours/[cours]`, à la racine du site, pas sous
`/sport`) et CLAUDE.md > Technique (pages à gabarit : un seul fichier, le
paramètre dans l'URL).
Le motif de CLAUDE.md donne `clubs/club/?club=meyrin`. Transposé, la fiche cours
donnerait `cours/cours/?cours=yoga`, qui se lit mal.
**Réponse (Hugo, étape 1) :** `cours/fiche/?cours=yoga` représente `/cours/yoga`.
Reporté dans CLAUDE.md > Technique.

### Q10 · Page Séance d'essai
**Statut :** tranchée
**Source :** CLAUDE.md > Périmètre (la page n'y figurait pas) contre B.3 > Tarifs
et offres et Annexe A > A.2 (le composant choix du club sert aussi à
/seance-essai).
**Réponse (Hugo, étape 1) :** la page entre dans le périmètre. Trame de
B.3 > Tarifs et offres > ligne « Séance d'essai » : formulaire de demande de
rappel (date indicative J+1 à J+14, club, motif, dispatch par club),
réassurance, choix du club avec le libellé « Club où faire votre essai »,
témoignages. Accès par le bouton du header, hors menu.
**Conséquence :** un composant de plus à construire, le formulaire de demande
de rappel. Reporté dans CLAUDE.md > Périmètre.

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
**Statut :** ouverte (confirmée ouverte par Hugo à l'étape 1)
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

---

## Relevées en construisant les composants (étape 2)

### Q15 · Liste fermée des équipements
**Statut :** ouverte
**Source :** B.3 > Fiche club dans le CMS (« Équipements (liste fermée, cases à
cocher) ») et section 7.3 (« équipements (liste fermée) »).
Les deux documents imposent une liste fermée sans jamais la donner. Elle sert
aux icônes de la page club, aux filtres de /clubs et au tableau de
/bien-etre/espaces. B.3 justifie la fermeture : « sinon un manager écrit
"Sauna", un autre "sauna finlandais", et les filtres ne marchent plus ».
**Provisoire dans les maquettes :** 11 entrées reconstituées depuis les
mentions de B.3 (zones du plateau, espaces wellness, FAQ locale), toutes
marquées `aValider` dans `data/data.js` : Plateau musculation, Zone cardio,
Espace fonctionnel, Cross training, Salle de cours, Piscine, Sauna, Hammam,
Jacuzzi, Jets massants, Parking.

### Q16 · Clubs où le service linge et les séances de coaching sont proposés
**Statut :** ouverte
**Source :** aucune. Les extras ont été fournis sans leur liste de clubs.
Hyrox est posé (Pâquis et Meyrin). Pour les deux autres, la répartition est
une hypothèse, marquée `clubsAValider` dans `data/data.js` : service linge
dans les 3 clubs Premium, séances de coaching en plus dans les 9 clubs hors
GYM. Elle a été choisie pour que les maquettes montrent des cas contrastés,
pas parce qu'elle est juste.

## Relevées en construisant la page Tarifs (étape 3)

### Q17 · Icônes des formats de cours dans la liste de clubs
**Statut :** ouverte
**Source :** B.3 > Page Tarifs > trame > 2 : la ligne de club sur ordinateur
porte « nom + catégorie + adresse + icônes des formats de cours ».
Les trois premiers sont faits. Les icônes ne le sont pas : B.3 ne dit pas quels
formats méritent une icône ni à quoi elles ressemblent, et une icône sans
libellé irait contre la règle « jamais la couleur ou la forme seule ». À
préciser avec le designer.

### Q18 · Redondance entre la barre collante et le bloc club replié
**Statut :** ouverte
**Source :** B.3 > Page Tarifs > Règles (barre collante : « Club référent :
[club] · Modifier ») et B.3 > Page Tarifs > trame > 2 (bloc replié : « Club
référent : [club] · Tarif [x] · Modifier »).
Les deux sont respectés à la lettre, et de ce fait la même information et le
même lien « Modifier » apparaissent deux fois à quelques centimètres l'un de
l'autre. À arbitrer par le designer : garder les deux, ou alléger la barre
collante une fois le bloc visible à l'écran.

## Relevées en construisant les Clubs (étape 4)

### Q19 · H1 et title du hub /clubs
**Statut :** à valider par Harmony
**Source :** B.3 donne les H1, sous-titres et titles de la branche Sport dans un
tableau dédié, et ceux de la page club dans « SEO des pages clubs » (H1
« Harmony [club] », title « Salle de sport à [commune] … | Harmony [club] »).
Rien n'est donné pour le hub /clubs.
**Proposé dans les maquettes, à valider :**
- H1 : « Nos clubs »
- Sous-titre : « Dix clubs à Genève et dans le canton de Vaud. Trouvez le vôtre
  et voyez avec quelle formule y aller. »
- Title : « Nos clubs de fitness à Genève et Vaud | Harmony »

Les titres de section de la liste viennent bien de B.3 : « Nos clubs à Genève »
et « Nos clubs dans le canton de Vaud ».

### Q20 · Plage horaire élargie des clubs GYM
**Statut :** ouverte
**Source :** B.3 > Catégories de clubs (« Plateau fitness complet, horaires
élargis ») et B.3 > Variante GYM (« Le hero met en avant les horaires
élargis »).
La plage n'est donnée nulle part, alors que c'est l'argument central du hero
d'un club GYM.
**Placeholder :** « Horaires élargis : [plage horaire GYM]. »

## Relevées en construisant la branche Sport (étape 5)

### Q21 · H1 et title des hubs de catégorie et des fiches cours
**Statut :** à valider par Harmony
**Source :** B.3 > Titres de la branche Sport donne les H1, sous-titres et titles
des 5 pages principales de la branche. Rien n'est donné pour les 3 hubs de
catégorie ni pour les 9 fiches cours, qui sont pourtant les pages SEO les plus
nombreuses de la branche.
**Proposé dans les maquettes, à valider :**
- Hub de catégorie : H1 = nom de la catégorie (« Cardio & renforcement »),
  title = « [Catégorie] à Genève et Vaud | Harmony »
- Fiche cours : H1 = nom du cours (« Yoga »), title = « [Cours] à Genève et
  Vaud | Harmony »

B.3 dit que ces titles sont à valider avec la Search Console et les termes de
recherche Google Ads avant la mise en ligne : la règle vaut pour ces pages
aussi.

### Q22 · Contenu des programmes de coaching
**Statut :** ouverte
**Source :** B.3 > Page Coaching personnel > bloc 3 : « Les programmes : par
objectif (liste à fournir par Harmony), chacun avec sa durée, son rythme et
pour qui il est fait ».
La liste n'existe pas. Les maquettes montrent le tableau avec les 6 objectifs
provisoires de Q7 en lignes, et [durée], [rythme], [pour qui] en colonnes.

