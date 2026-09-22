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
Gym garde la promesse de B.3, qui est déjà rédigée.
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

### Q4 · Coaching personnel et formule Gym
**Statut :** tranchée
**Source :** B.3 > Page Coaching personnel > bloc 7 (« et la formule Gym
(séances non incluses, à confirmer) »).
Impacte la carte formule Gym sur /tarifs : la ligne « séances de coaching »
est-elle absente, ou présente avec une mention ?
**Réponse (Hugo, étape 1) :** pas de séances de coaching incluses en Gym.
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
**Statut :** tranchée
**Source :** B.3 > Cours collectifs : périmètre et pages retenues > « À réconcilier ».
B.3 signale lui-même la contradiction entre la logique de juillet (9 fiches +
3 hubs) et le document de septembre (une trentaine de pages).
**Réponse :** CLAUDE.md > Périmètre tranche pour les maquettes : on construit les
gabarits (hub, hub de catégorie, fiche), pas le volume de pages. Le choix reste
ouvert côté cahier des charges.

**Réponse (B.3, 2026-09-14) :** la réconciliation est faite dans B.3. Plus
de hub de catégorie, 2 templates au lieu de 3, 4 pages de famille et ~30
fiches sur le même gabarit.
### Q7 · Les 6 objectifs de cours
**Statut :** tranchée
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

**Réponse (doc de septembre, relayé par Hugo le 2026-09-14) :** les 6
objectifs sont dans B.3, le mapping cours par cours est appliqué dans
`data.js`. Les entrées marquées `objectifsAValider` sont les propositions de
Hugo pour les trous du doc, pas des décisions. L'objectif secondaire existe
comme champ et reste vide partout sauf sur Pilates et Les Mills Body Balance.
### Q8 · Nombre de cours par semaine dans un club Gym
**Statut :** tranchée
**Source :** B.3 > Clubs > ligne « Clubs (hub) » (la carte club affiche « nombre de
cours par semaine ») croisé avec B.3 > Catégories de clubs (Gym : « Pas de cours
collectifs »).
Que montre la carte de Genève · Pâquis : rien, un zéro, ou le nombre de séances
de Small Group Training ?
**Réponse (Hugo, étape 1) :** sur la carte d'un club Gym, le nombre de cours est
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
**Statut :** partiellement tranchée (volumes posés le 2026-09-14)
**Source :** B.3 > Page Tarifs > trame, bloc 5 (« filtres Gym / Essential /
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
Gym. Elle a été choisie pour que les maquettes montrent des cas contrastés,
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

### Q20 · Plage horaire élargie des clubs Gym
**Statut :** ouverte
**Source :** B.3 > Catégories de clubs (« Plateau fitness complet, horaires
élargis ») et B.3 > Variante Gym (« Le hero met en avant les horaires
élargis »).
La plage n'est donnée nulle part, alors que c'est l'argument central du hero
d'un club Gym.
**Placeholder :** « Horaires élargis : [plage horaire Gym]. »

## Relevées en construisant la branche Sport (étape 5)

### Q21 · H1 et title des pages de famille et des fiches cours
**Statut :** tranchée
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

**Réponse (B.3, 2026-09-14) :** écrit dans B.3, section « H1 et title des
pages cours ». H1 = le nom seul. Title = « Cours de [cours] à Genève et Vaud
| Harmony », ou sans « Cours de » quand ça sonne faux, ce qui est le cas des
formats Les Mills. Aucune commune dans le title d'une fiche.
### Q22 · Contenu des programmes de coaching
**Statut :** ouverte
**Source :** B.3 > Page Coaching personnel > bloc 3 : « Les programmes : par
objectif (liste à fournir par Harmony), chacun avec sa durée, son rythme et
pour qui il est fait ».
La liste n'existe pas. Les maquettes montrent le tableau avec les 6 objectifs
provisoires de Q7 en lignes, et [durée], [rythme], [pour qui] en colonnes.

## Relevées en reconstruisant la branche cours (étape 5 bis)

### Q24 · Page ou section pour les membres des familles Yoga et Aqua
**Statut :** ouverte
**Source :** B.3 > Cours collectifs : périmètre des fiches, règle 1 (« On ne
rétrograde pas un actif ») et règle 2 (2 critères sur 3).
Hugo a tranché membre par membre pour Pilates, et indiqué que Les Mills serait
« quasiment une page de liens ». Rien n'est dit pour les 5 membres de la
famille Yoga (Hatha Yoga, Yin Yoga, Yoga Vinyasa, Air Yoga, Yoga Dos) ni pour
les 4 de la famille Aqua (Aqua Gym, Aqua Bike, Aqua Zumba, Aqua Jogger). La
décision dépend des apparitions en Search Console.
**Dans les maquettes :** `traitement: null`, rendu en section avec l'ancre,
et le marqueur visible « page ou section à trancher ». Le gabarit gère les deux
formes sans changement.

### Q25 · Slug de la famille Aqua
**Statut :** ouverte
**Source :** Hugo, 2026-09-14 : « le mot cherché est plutôt aquagym ou
aquafitness que aqua seul ».
`/cours/aqua` est provisoire, marqué « slug à confirmer » dans la maquette.
Tranché avec les volumes de recherche.

### Q26 · Objectif principal de Les Mills Shapes
**Statut :** proposition posée le 2026-09-16, à confirmer par Harmony
**Source :** le mapping du doc de septembre ne mentionne pas ce cours, et il
ne figurait pas non plus dans les propositions de Hugo pour les trous.

**Ce qu'est Shapes.** Un cours inspiré de la barre classique : ballet, Pilates
et yoga mêlés, en petites amplitudes et en répétitions, pour sculpter,
gainer et tenir la posture. Peu d'impact, beaucoup de brûlure musculaire.

**Proposition :** `objectifPrincipal: 'se-renforcer'` (Se renforcer et
sculpter), `objectifSecondaire: 'bouger-mieux'`. Le mot « sculpter » est
littéralement la promesse du cours, et la posture est le bénéfice qu'on en
retire sans l'avoir cherché.

**Pourquoi pas « Danser ».** L'inspiration vient du ballet, mais il n'y a pas
de chorégraphie à apprendre. Quelqu'un qui filtre sur « Danser » attend Zumba,
Salsa ou All Styles Dance : Shapes le décevrait, et le cours se ferait
ignorer par ceux qui le cherchaient vraiment.

**Le cours qui va sur plusieurs objectifs n'est pas un problème de modèle.**
Un cours est rangé sous un seul objectif dans le catalogue et dans le filtre,
sinon il apparaît deux fois et le visiteur croit à deux cours. Le second
objectif existe quand même : il s'affiche en tag « aussi bouger mieux » et il
est pris en compte par la recherche. Même traitement que Pilates (aussi bouger
mieux) et Les Mills Body Balance (aussi bouger mieux).

**À confirmer par Harmony :** la façon dont le cours est donné dans les clubs.
Si les coachs le poussent côté cardio ou côté détente, le classement bouge.

### Q27 · Liste détaillée des Extras
**Statut :** ouverte
**Source :** Hugo a posé une liste provisoire le 2026-09-14, en attendant celle
d'Harmony : Small Group Training, Service Pressing, Gel de l'abonnement, tous
dans les clubs Essential et Premium, tous à « CHF XX.– ».

Ce qui reste ouvert : les Extras autres que le Small Group Training, et les
clubs où chacun est proposé.

- L'Extra « Service linge », que j'avais posé d'après la mention « les services
  (linge…) » de B.3, est remplacé par « Service Pressing », le nom donné par
  Hugo. Si les deux services sont distincts, il faut les rétablir tous les deux.
- **Genève · La Praille a sa vraie liste** (Harmony, 2026-09-16) : TRX Pilates,
  HIIT, HIIT Boxing, Flow, Cross Training, Ceremony Hyrox Max. Le remplissage
  « Lorem Ipsum » y a donc été retiré.
- Un Small Group Training de remplissage, nommé « Lorem Ipsum », reste dans les
  huit autres clubs sauf Genève · Pâquis, qui a le sien (Hugo, 2026-09-16). Son
  nom dit ce qu'il est : un placeholder, qui part club par club à mesure
  qu'Harmony donne les vraies listes.
- Le point « un Extra par Small Group Training » est tranché depuis : voir Q43.
  Il n'y a plus qu'un Extra pour tous les Small Group Training, donc plus de
  liste d'Extras à fournir de ce côté-là. Ce qui manque encore, c'est la liste
  des Small Group Training eux-mêmes et des clubs où ils sont donnés : ce sont
  des cours, ils s'ajoutent au planning.

### Q28 · Durée de validité et prix des carnets d'entrées
**Statut :** ouverte
**Source :** Hugo, 2026-09-14. « Ce sont des carnets de 5. On va aussi proposer
des carnets de 10 entrées. Prévoir une durabilité de ces carnets. X mois pour
10 entrées, X mois pour 5. Tout ça est une simulation, on travaille sur l'offre
en ce moment. »

Tranché : deux volumes, 5 et 10 entrées, dans chacune des trois catégories,
soit 6 carnets. La validité est une durée par carnet, plus longue pour le
carnet de 10 que pour celui de 5.

Restent inconnus, et affichés en placeholder :
- la durée de validité de chaque volume, « Valable [X] mois à partir de
  l'achat »
- les prix, « CHF XX.– », donc aussi le prix ramené à l'entrée
- le libellé exact. B.3 fixe le vocabulaire « carnet d'entrées » sans dire
  comment nommer un volume. Retenu dans les maquettes : « Carnet de 5 entrées
  Essential ». À valider.

B.3 ne mentionne aucune durée de validité pour les carnets. Si elle est
retenue, elle est à ajouter à B.3 > Page Tarifs > trame > 5 et au champ
« durée » du Produit en section 7.3.


### Q29 · La promotion n'existe pas dans le modèle de contenu
**Statut :** ouverte
**Source :** Hugo, 2026-09-14. « Il faut anticiper qu'on peut proposer des
promos sur des abonnements ou sur des carnets. Ici par exemple, pour l'exemple,
on va considérer que tous les carnets 10 entrées sont à -20%. »

B.3 > Page Tarifs > trame > 3 pose déjà la règle d'affichage : « Une remise sur
un produit existant s'affiche en pastille + prix barré sur sa carte ». Mais la
section 7 ne décrit aucune entité qui porte cette remise. Le Produit a un type
(formule, offre, carnet) et des dates de validité « pour les offres », rien
d'autre. Sans entité dédiée, la seule façon de faire une promo serait de
dupliquer le produit, ce qui casse la comparaison entre cartes et oblige à
maintenir deux prix.

Posé dans les maquettes, à valider : une collection **Promotion**, avec nom,
remise en pourcentage ou en montant, liste des produits concernés, dates de
validité, conditions. Le type du produit n'entre pas dans la règle : la même
promo marche sur un abonnement et sur un carnet. Le prix remisé est calculé
depuis le prix catalogue, jamais saisi.

À trancher avec Harmony :
- une promo peut-elle porter sur des produits de types différents à la fois ?
- peut-il y avoir deux promos en cours en même temps sur deux produits
  différents ? Sur le même produit ?
- ~~la remise se cumule-t-elle avec l'engagement 12 mois ?~~ **Tranché par Hugo
  le 2026-09-14 : la remise porte sur l'engagement 12 mois.** Le champ
  `engagements` vaut `['12mois']` sur la promo d'abonnements. Reste à confirmer
  que c'est la règle de toutes les promos d'abonnement, ou seulement de
  celle-ci : le champ accepte les deux.
- une promo sur un produit existant doit-elle aussi apparaître sur
  /offre-du-moment, qui ne présente aujourd'hui que les produits promo dédiés ?
- la remise s'applique-t-elle à tous les tarifs (Adulte, Ado, Jeune, Senior) ?

Dans les maquettes, la promo en cours est simulée par le sélecteur d'état, pas
par les dates : on peut ainsi montrer les deux cas. Les deux campagnes du jeu
de démonstration ne sont pas des campagnes Harmony : les carnets de 10 entrées
à -20%, et les abonnements Essential et Premium à -15%, ce second cas étant un
abonnement simplement remisé, sans produit dédié à la Black Friday.

Conséquence repérée en construisant ce second cas : la ligne « Tarif adulte dès
CHF X.– / mois » des cartes club et du hero de la page club doit suivre la
promo, sinon /clubs annonce un prix que /tarifs dément. Corrigé. La pastille
n'y apparaîtra qu'une fois les prix réels connus : tant qu'ils valent tous
« CHF XX.– », on ne sait pas laquelle des formules accessibles est la moins
chère, donc pas laquelle porte la remise.

### Q30 · Photo d'illustration sur la carte produit
**Statut :** tranchée par Hugo, à répercuter dans B.3
**Source :** Hugo, 2026-09-14. « Pour humaniser les offres, on va prévoir
d'avoir une photo d'illustration sur le produit (carte, abo). »

B.3 > Page Tarifs > trame > 4 et 5 décrit la carte produit sans image. La photo
est ajoutée en tête de carte, sur toute la largeur, pour les trois variantes
(formule, offre, carnet). L'Extra n'en a pas : ce n'est pas une carte produit.

Conséquences à valider :
- la photo devient un champ du Produit en section 7.3, avec son texte
  alternatif. Une carte sans photo saisie reste valide et n'affiche pas de
  cadre vide.
- il faut 11 visuels au lancement, un par produit. Qui les fournit ?
- une photo par produit ou une photo par catégorie de club, réutilisée par
  tous les produits de cette catégorie ? La seconde option coûte moins cher à
  produire et à maintenir.

### Q31 · Dire une promo réservée à un engagement, sans la présenter comme une remise sur l'engagement
**Statut :** posé dans les maquettes, à valider par Hugo
**Source :** conséquence de la décision du 2026-09-14, la remise porte sur les
12 mois.

Une remise réservée aux 12 mois est invisible sur l'autre engagement. Le
2026-09-14, Hugo a aussi tranché que « 12 mois » devient l'engagement
présélectionné, donc le cas est devenu secondaire : il ne concerne plus que le
visiteur qui bascule sur « Sans engagement ». La pastille conditionnée reste
utile pour lui, elle dit que la campagne existe et à quelle condition.

Retenu dans les maquettes, après retour de Hugo le 2026-09-14 qui attendait de
voir les pastilles : sur l'engagement remisé, pastille pleine et prix barré
normalement. Sur l'autre engagement, pastille en contour qui porte sa condition
(« - 15% · 12 mois ») et ligne en retrait, mais pas de prix barré, puisque ce
prix-là n'est pas remisé.

Tension à arbitrer : B.3 > Page Tarifs > Règles > Engagement dit « pas de
pastille ni de pourcentage de remise sur l'engagement ». Cette règle vise
l'écart structurel entre les deux engagements, qu'on ne présente jamais comme
une promotion. Ici il s'agit d'une campagne datée, qui se trouve conditionnée à
un engagement : ce n'est pas la même chose, mais la ligne affichée porte quand
même un pourcentage à côté du mot « engagement ». Si Hugo juge que c'est trop
proche de ce que B.3 interdit, la ligne se retire en une ligne de code, et la
campagne redevient invisible depuis l'état par défaut.

### Q32 · Filtre par catégorie de clubs et recherche sur le hub des cours
**Statut :** tranchée, filtre cumulatif depuis le 2026-09-15
**Source :** Hugo, 2026-09-15. « Il serait également intéressant de filtrer par
catégorie de clubs : Gym (en réalité pas de cours co pour Gym), Essential,
Premium. Aussi, intégrer une barre de recherche. »

B.3 prévoit quatre filtres sur le hub : club, objectif, intensité, format. Deux
s'ajoutent, et ce sont des ajouts, pas des lectures de B.3 :
- **catégorie de clubs** (Gym, Essential, Premium), qui répond à « qu'est-ce que
  je peux faire dans un club Premium »
- **recherche par nom**, pour qui sait déjà ce qu'il cherche

Choix faits dans la maquette, à valider :
- ~~la catégorie porte sur la catégorie du club où le cours est donné~~
  **Tranché par Hugo le 2026-09-15 : c'est l'accès qui compte, et il est
  cumulatif.** « Quand un cours est catégorisé en Essential, il est aussi
  accessible via l'offre Premium. » Filtrer Premium remonte donc les cours des
  clubs Essential et Gym, et le comptage des cartes formule suit la même règle.
  Le filtre est renommé en conséquence : « Avec la formule Premium » plutôt que
  « Clubs Premium », qui laissait croire à un lieu.
- la catégorie commande le menu des clubs : choisir Premium ne laisse que les
  trois clubs Premium, et relâche un club devenu incompatible. Sans ça on peut
  demander « Meyrin » et « Premium » en même temps, ce qui ne veut rien dire.
- filtrer sur Gym ne renvoie rien. Plutôt qu'un « aucun résultat » sec, la page
  explique : « Les clubs Gym ne proposent pas de cours collectifs. Des Small
  Group Training y sont proposés en Extra », avec un lien vers le hub Small
  Group Training. Le cas est déduit des données : si un cours collectif arrive
  un jour en Gym, le message disparaît tout seul.
- la recherche porte sur le nom du cours, celui de sa famille et celui de ses
  objectifs. Chercher « danse » remonte les cours rangés sous « Danser » même
  si aucun ne porte le mot dans son nom. À confirmer : est-ce trop large ?
- le bloc « Nos disciplines » (les 4 pages de famille) n'est pas filtré : ce
  sont des pages de navigation, pas un catalogue. Il reste donc visible sous le
  message Gym. À trancher si ça gêne.

Reste ouvert : faut-il aussi une recherche sur le planning de la page club ?

### Q33 · La formule Premium Platinum
**Statut :** tranchée par Harmony, points d'application ouverts
**Source :** Hugo, 2026-09-15. « On va à nouveau intégrer une formule. La
formule Premium Platinum. C'est la formule Premium mais avec les services extra
inclus. Elle est disponible uniquement pour les clubs Premium. »

Posé dans les maquettes :
- 4e formule, après Premium. Catégorie d'accès : Premium, donc les 10 clubs.
- nouveau champ `souscriptionDepuis: ['premium']`. L'accès et la souscription
  deviennent deux choses distinctes : Premium Platinum ouvre les 10 clubs mais ne se
  souscrit que depuis un club Premium. Depuis un club Essential ou Gym, la
  carte n'apparaît pas et la formule est regroupée dans la ligne « Pas
  disponible depuis [club] », comme les autres produits indisponibles.
- 5e ligne d'inclusion, « Extras », pour que les 4 cartes se comparent ligne à
  ligne : c'est la seule chose qui distingue Premium Platinum de Premium.
- champ `inclutExtras`. Quand Premium Platinum est choisie, les Extras vendus en ligne
  passent en « Inclus avec la formule Premium Platinum », ceux vendus en club restent
  « Sur demande en club ». La règle se déduit du mode de vente, elle ne cite
  aucun Extra en particulier : « Séances de coaching en plus » reste donc en
  « Sur demande en club » tout seul, comme demandé.
- les Extras déjà ajoutés au récap sont retirés au moment du choix, avec un
  message. On ne facture pas deux fois, et on ne vide pas en silence.

À trancher avec Harmony :
- **le nom de formule sans catégorie de club.** B.3 recommande « nom de formule
  = nom de catégorie ». Premium Platinum casse cette règle : il n'y a pas de club
  Premium Platinum. Un visiteur peut chercher « les clubs Premium Platinum » et ne rien
  trouver. Faut-il une phrase sur la carte, du type « Dans les 3 clubs
  Premium » ? Aujourd'hui la carte affiche « Accès aux 10 clubs », ce qui est
  juste mais ne dit pas la restriction de souscription.
- **la ligne « Pourquoi ? »** de la ligne des produits indisponibles renvoie au
  module Catégories de clubs, qui explique l'accès. Ici la raison est autre :
  une restriction de souscription. Faut-il un mot dédié ?
- **les tarifs réduits** (Ado, Jeune, Senior) s'appliquent-ils à Premium Platinum ?
  Posé comme Premium en attendant.
- **l'engagement** : Premium Platinum existe-t-elle sans engagement, ou seulement en
  12 mois ?
- **la promotion en cours** sur Essential et Premium porte-t-elle aussi sur
  Premium Platinum ? Non aujourd'hui dans le jeu de démonstration.
- **le prix** de Premium Platinum, et le libellé exact de la ligne d'inclusion
  « Extras », qui dit aujourd'hui juste « Extras ».

### Q34 · Graphie « Gym » et système de nommage des formules
**Statut :** tranchée par Hugo le 2026-09-15
**Source :** Hugo, 2026-09-15. « Pour une cohérence avec les autres formules, il
faut écrire "Gym" et pas "GYM" en majuscule. »

**Graphie.** Appliquée partout dans les maquettes. B.3 disait l'inverse : « Une
seule graphie, GYM, identique en club, dans l'appli et sur le site. » La ligne
est corrigée sur Notion et dans l'export local. À répercuter hors du site : en
club, dans l'appli, dans Echino, et dans la section 7 du cahier des charges, que
je ne modifie pas (fichier en lecture seule, il porte encore « GYM »).

**Système de nommage.** Jusqu'ici une règle simple tenait : nom de formule = nom
de catégorie de club. Elle disait au visiteur quels clubs sa formule ouvre.
Premium Platinum la casse : c'est une formule sans catégorie correspondante, et son nom
ne dit rien des clubs auxquels elle donne accès.

**Tranché : option 1.** Le premier mot d'un nom de formule est toujours le nom
d'une catégorie de club, il dit quels clubs la formule ouvre ; ce qui suit est
le niveau. La formule s'appelle donc « Premium Platinum », et l'orthographe
anglaise « Platinum » est retenue, cohérente avec Gym, Essential et Premium.
Le niveau s'affiche en italique et dans une teinte à part, pour qu'on ne le
prenne pas pour une catégorie de club. À vérifier avant impression : le nom
circule-t-il déjà commercialement sous la forme « Platinium » ? Mieux vaut une
seule graphie, même imparfaite, que deux.

Les trois options examinées :
1. le premier mot d'un nom de formule est toujours une catégorie de club, donc
   « Premium Platinum » et non « Premium Platinum » seul. La règle survit, elle
   s'applique aux produits futurs, et Premium Platinum reste vendable comme un niveau.
2. garder « Premium Platinum » seul, et rendre la restriction explicite partout : une
   ligne « À souscrire dans l'un des 3 clubs Premium » sur la carte, et une
   mention dans le module Catégories qui dit que Premium Platinum est une formule, pas
   une catégorie.
3. faire de Premium Platinum une option de Premium plutôt qu'une formule. Écarté :
   Harmony veut un produit à vendre.

**Orthographe de Premium Platinum.** Le mot n'existe ni en français (« platine ») ni en
anglais (« platinum »). Les autres noms du jeu sont anglophones : Gym,
Essential, Premium. « Platinum » serait la graphie cohérente. À trancher avec
Harmony : si le nom est déjà utilisé commercialement sous cette forme, il vaut
mieux le garder que d'avoir deux graphies en circulation.

### Q35 · Nombre de cours par formule et point d'info sur les clubs
**Statut :** tranchée par Hugo, deux points à valider
**Source :** Hugo, 2026-09-15. « Pour différencier les formules Essential et
Premium (même en promo), il faut également dire le nombre de cours collectifs
(pas de séance mais de cours) associé à chaque formule. » Et : « En dessous du
nom de la formule, mettre un point d'info où au survol on peut voir le nom des
clubs. »

Posé dans les maquettes :
- les lignes de cours comptent les **cours différents**, pas les séances :
  « Cours collectifs en salle : 25 cours », « Cours aquatiques : 4 cours ». Le
  nombre est déduit des séances des clubs que la formule ouvre, donc jamais
  saisi. Quand il ne peut pas l'être, « [X] cours ».
- la ligne d'accès porte toujours un nombre, y compris pour un seul club
  (« Accès à 1 club »). B.3 prévoyait « Accès au club Genève · Pâquis » pour ce
  cas : la ligne est corrigée, puisque le nom du club se lit maintenant dans le
  point d'info.
- le point d'info ouvre au survol sur ordinateur et au toucher sur mobile, sans
  une ligne de JavaScript : le déclencheur est un vrai bouton et le panneau
  s'ouvre en `:hover` et en `:focus-within`. Il est donc aussi accessible au
  clavier. Liste groupée par canton, comme partout ailleurs.

À valider :
- **le nombre affiché bouge avec le catalogue.** 25 cours aujourd'hui, 24 le
  mois prochain si Harmony en retire un. Est-ce qu'on assume un nombre vivant,
  calculé, ou est-ce qu'on préfère un ordre de grandeur stable, du type « plus
  de 20 cours » ? Un chiffre exact est plus vendeur mais il engage.
- **faut-il compter les cours ou les créneaux ?** Hugo a tranché pour les cours.
  À vérifier auprès de Harmony que c'est bien ce qui parle au prospect : « 25
  cours différents » et « 180 séances par semaine » ne racontent pas la même
  chose.
- le point d'info n'est pas dans B.3 d'origine. Il est ajouté sur les cartes
  produit et dans le module Catégories de clubs, pas ailleurs.

### Q36 · Le modèle de contenu (section 7) ne connaît pas les nouveautés
**Statut :** ouverte, bloquante pour le développement
**Source :** relecture de B.3 du 2026-09-15, à la demande de Hugo.

B.3 est à jour. La **section 7, modèle de contenu**, ne l'est pas. C'est la page
que Richard lira pour construire le CMS : tant qu'elle ne porte pas ces champs,
ils n'existent pas pour lui. Elle décrit aujourd'hui le Produit ainsi :

> type (formule, offre, carnet), nom, catégorie, engagements ou durée, ce qui
> est inclus, tarifs couverts, conditions, verticale, identifiant dans l'outil
> métier, dates de validité pour les offres.

Manquent, tous posés dans les maquettes et validés par Hugo :
- `photo` et son texte alternatif, sur le Produit (Q30)
- `souscriptionDepuis` : les catégories de clubs depuis lesquelles le produit se
  souscrit. C'est ce qui sépare l'accès de la souscription, et c'est la règle
  qui fait exister Premium Platinum (Q33)
- `inclutExtras` : la formule comprend les Extras vendus en ligne (Q33)
- `nbEntrees` et `duree` sur les carnets (Q28)
- une collection **Promotion** : nom, remise en pourcentage ou en montant,
  liste des produits concernés, engagements concernés, dates de validité,
  conditions (Q29)
- la ligne d'inclusion `extras` dans la liste des inclusions, et le fait qu'une
  ligne d'inclusion de cours porte un format, pour compter les cours (Q35)
- la graphie « Gym » : la section 7 écrit encore « GYM » (Q34)

À faire : mettre à jour la page section 7 dans Notion. Je ne l'ai pas touchée,
c'est une autre page que B.3 et son export local est en lecture seule.

### Q37 · Où envoyer une demande de conseil, alors qu'il n'y a pas de formulaire de contact
**Statut :** ouverte, une décision à prendre avant de construire
**Source :** Hugo, 2026-09-15. « Certains clubs proposent un peu du sur mesure,
mais on ne peut pas complexifier l'offre ici. La page tarif devrait contenir une
information pour interpeller ceux qui ne trouvent pas la bonne formule et les
inviter à se rendre en club ou à contacter le club. Discret comme message. Il
faudrait que ça renvoie un formulaire de contact avec le champ club
présélectionné, pour tracker les demandes comme les demandes d'essai. »

La ligne est posée sur /tarifs, après tous les produits, avant le module
Catégories. Sans cadre, sans bouton : une ligne séparée par un filet. Elle
existe pour qui en a besoin, elle ne détourne pas de la souscription en ligne.

**Le problème : la destination n'existe pas.** B.3 dit « coordonnées sur chaque
page club + bloc contact du footer, pas de formulaire ni de page contact dans le
header ». Les pages club donnent une adresse e-mail. Un e-mail ne se compte pas,
ne présélectionne pas le club et ne se dispatche pas.

Trois options.

**1. Réutiliser le formulaire de la séance d'essai.** B.3 lui donne déjà les bons
champs : date indicative, club, **motif**, dispatch par club. Coût nul.
Problème : on envoie sur une page « Séance d'essai » quelqu'un qui veut juste un
conseil tarifaire. Le H1 ment, et la statistique mélange deux intentions.

**2. Une page dédiée, même gabarit (recommandé).** `/nous-contacter`, qui
réutilise le gabarit « demande de rappel » de la séance d'essai avec un motif
différent, un H1 propre et une URL à part. Exactement le rapport qu'ont /tarifs
et /tarifs/[club] : deux adresses, un gabarit.
Coût devis : **+1 page, +0 gabarit.** Le tableau des volumes passe de ~18 à ~19
pages à gabarit unique, le nombre de gabarits à concevoir ne bouge pas.
Bénéfice : tracking propre, H1 juste, et le site gagne enfin un formulaire de
contact, qui manque aussi au footer et aux pages club.

**3. Le formulaire général de « Besoin d'aide ? ».** Il est déjà prévu en bas de
cette page. Mais envoyer un prospect qui hésite entre deux formules sur une page
de self-service SAV est un mauvais signal, et le club n'y est pas présélectionné.

C'est l'option 2 qui est câblée dans la maquette, avec un marqueur « page de
contact à valider » bien visible. Le lien porte déjà `club`, `motif=conseil` et
`source=tarifs`, donc la demande est traçable dès qu'elle arrive.

À trancher aussi, si l'option 2 est retenue :
- le formulaire remplace-t-il l'adresse e-mail des pages club, ou coexiste-t-il ?
  Deux canaux pour la même demande, c'est deux endroits à surveiller pour le
  manager du club.
- qui reçoit : le club, ou une adresse centrale qui redispatche ?
- le délai de réponse annoncé, s'il y en a un.

### Q38 · Dispatch du formulaire de contact
**Statut :** tranchée par Hugo dans l'intention, une variante proposée
**Source :** Hugo, 2026-09-15. « J'aimerais qu'il y ait uniquement le
formulaire, pour tracker les demandes de contact. Mais il faut un dispatch des
envois des notifications. Pour la page contact il faudrait choisir le
destinataire : Team Harmony, Meyrin, Veyrier… en plus du motif du message. Si
Team Harmony alors c'est l'adresse contact d'Harmony qui reçoit, sinon
l'adresse mail du club sélectionné. Annoncer un délai de réponse non chiffré,
au plus vite. »

Tranché et appliqué : un seul canal écrit, le formulaire. Les adresses e-mail
disparaissent des pages club et du footer. Le téléphone et l'adresse restent.
Délai non chiffré, « Nous vous répondons au plus vite. »

**Une variante sur le choix du destinataire, à valider.** Hugo demande un menu
« destinataire » à onze entrées, Équipe Harmony plus les dix clubs, en plus du
motif. Ce que la maquette fait à la place : le visiteur donne son **sujet** et
son **club**, et le destinataire est déduit du sujet, puis affiché sous le
formulaire, « Votre message part à Harmony Meyrin ».

Pourquoi : demander à quelqu'un de choisir entre Équipe Harmony et dix clubs,
c'est lui demander de connaître l'organisation d'Harmony. « Je veux résilier,
j'écris au club ou au siège ? » Personne ne le sait de l'extérieur, et les
demandes mal routées reviennent en travail manuel. Le sujet, lui, est une
question à laquelle tout le monde sait répondre.

Ce que la variante ne perd pas :
- le dispatch demandé existe, à l'identique. Un motif part au club, un autre au
  central. La table de routage vit dans le CMS, pas dans le code : changer la
  destination d'un motif est une saisie.
- le tracking demandé existe : motif, club et source sont enregistrés.
- la transparence est meilleure : le destinataire est annoncé avant l'envoi,
  et le visiteur peut le corriger en changeant le sujet ou le club.

Ce que la variante perd : celui qui sait exactement à qui il veut écrire ne le
désigne pas nommément. Il choisit son club, ce qui revient au même dès que le
sujet part au club.

Passer au menu explicite si Hugo le préfère : c'est un champ de plus dans le
formulaire et une règle de priorité sur la table de routage. Une heure.

À trancher aussi :
- **le nom du destinataire central.** « Team Harmony » est en anglais sur un
  site francophone. « Équipe Harmony » est posé dans la maquette. Si l'équipe
  traite surtout des abonnements et des factures, « Service membres » dirait
  mieux ce que le visiteur peut en attendre.
- **la liste des sujets**, provisoire, marquée « à valider par Harmony » dans la
  maquette : choisir ma formule, question sur un club, question sur un cours,
  gérer mon abonnement, offre entreprise, candidature/presse/partenariat, autre.
  C'est cette liste qui décide du routage : elle se valide avec les clubs.
- **la gestion de l'abonnement part-elle au club ou au central ?** Posé au
  central. Selon l'organisation d'Harmony, c'est peut-être le club.
- **qui surveille la boîte centrale**, et sous quel délai réel. Le site promet
  « au plus vite » : sans personne derrière, la promesse coûte plus cher que
  l'ancienne adresse e-mail.

### Q39 · Libellés des objectifs : « mobilité » et « Se préparer à la compétition »
**Statut :** ouverte, recommandations posées, à trancher par le test d'arborescence
**Source :** Hugo, 2026-09-15.

**1. « Bouger mieux et soulager son dos » est long. Pourquoi pas « mobilité » ?**

B.3 signale déjà ce libellé comme l'un des deux doutes à lever par le test
d'arborescence, avec la confusion « Se dépenser » / « Se dépasser ». La question
est donc ouverte au bon endroit.

Deux raisons de ne pas prendre « mobilité » tel quel :
- c'est du vocabulaire de métier. Le pratiquant averti sait ce qu'est le travail
  de mobilité ; le débutant, qui est la cible de ce rangement, entend soit rien,
  soit « mobilité réduite ». Or les objectifs servent à orienter quelqu'un qui
  ne connaît pas encore l'offre.
- les cinq autres objectifs sont des verbes : se renforcer, se dépenser, se
  dépasser, se détendre, danser. « Mobilité » est un nom : il casse la série, et
  une liste qui change de nature grammaticale se lit moins vite.

Trois candidats à soumettre au test, du plus court au plus explicite :
- **« Bouger mieux »** : court, garde le verbe et la série. Le dos reste visible
  dans les noms de cours du groupe (Pilates Gym Dos, Yoga Dos, Gym Douce Dos).
  C'est celui que je recommande.
- « Soulager mon dos » : nomme la douleur, donc très efficace sur ceux qui l'ont,
  mais exclut ceux qui viennent pour la souplesse.
- le libellé actuel, gardé comme témoin.

**2. Le client demande un objectif « Se préparer à la compétition ».**

D'accord avec Hugo : cela rentre dans « Se dépasser ». Trois raisons.

- **Le groupe serait vide.** Dans le jeu de démonstration, le seul cours qui
  irait dans cet objectif est Hyrox, et Hyrox est un Small Group Training, donc
  un Extra, donc absent du catalogue des cours collectifs. Un septième objectif
  afficherait une section vide ou à un seul élément, ce qui est pire que pas
  d'objectif du tout.
- **Le rangement sert le débutant, pas l'expert.** Six lignes à parcourir, c'est
  déjà beaucoup. En ajouter une septième pour une audience minuscule coûte à
  tout le monde et ne sert presque personne.
- **Le besoin est réel mais il vit ailleurs.** La préparation à la compétition,
  chez Harmony, c'est le Small Group Training (Hyrox) et le coaching personnel,
  dont B.3 range déjà les programmes selon les mêmes 6 objectifs. C'est la
  réponse à donner au client : le besoin est servi, pas par un objectif de cours
  collectifs.

Si Harmony insiste, la question à lui poser est simple : quels cours collectifs,
nommément, iraient dans cet objectif ? Si la réponse tient en moins de trois
cours, l'objectif ne se justifie pas.

**3. Trouvé en vérifiant.** « Les Mills Grit » était saisi en format « petit
groupe » alors que ce n'est pas un Small Group Training : corrigé en « salle ».
Reste « Pilates Privilège », en format petit groupe et non-Extra. Si c'est
vraiment du petit groupe, B.3 en fait un Extra payant. À trancher avec Harmony.

**4. Autre trouvaille, réglée.** 10 cours du catalogue n'avaient aucune séance.
Un cours sans séance est un cours que personne ne peut suivre : il disparaissait
des filtres par formule et des comptages tout en restant au catalogue.
Hugo, le 2026-09-15 : « Quand y'a pas de séances, invente-en, pour compléter le
site web. On intégrera les vraies données ensuite. » 30 séances ajoutées, 3 par
cours, réparties sur les clubs et les jours, jamais dans un club Gym. Le
planning passe de 68 à 98 séances et plus aucun cours n'est orphelin.
Les nombres concordent maintenant de bout en bout : catalogue Premium 47 cours,
carte formule Premium 43 en salle + 4 aquatiques.
À remplacer par le vrai planning : c'est du jeu de démonstration, assumé comme
tel dans le code et dans la mention affichée sous le planning.

### Q40 · « Nos disciplines » laissait croire à un inventaire
**Statut :** corrigé, libellé à valider
**Source :** Hugo, 2026-09-15. « Sur le hub des cours, on a Nos disciplines. Si
je comprends bien ce sont les pages hub pour certains cours. J'ai un problème
avec cette section, ça nous laisse croire que ce sont les seules disciplines
qu'on a. »

Le problème est réel et c'est un problème de promesse, pas de mise en page. Le
titre « Nos disciplines » annonce un inventaire, alors que ces quatre pages
existent pour une tout autre raison : ce sont les disciplines à plusieurs
variantes, retenues parce qu'elles ont une demande générique mesurée. Le
catalogue juste au-dessus en compte 47.

Corrigé : le titre devient « Des disciplines déclinées en plusieurs cours », et
une phrase sous le titre nomme les quatre et renvoie au catalogue pour le reste.
La liste des noms est construite depuis les données : une cinquième famille,
Stretching par exemple, s'ajouterait à la phrase toute seule.

À valider :
- **le libellé.** « Des disciplines déclinées en plusieurs cours » est juste
  mais long. Alternatives : « Quatre disciplines, plusieurs cours chacune », ou
  nommer directement « Pilates, Yoga, Les Mills, Aqua » en titre, ce qui ne
  promet rien du tout. Le mot « famille » est du vocabulaire interne, il ne
  devrait pas se retrouver dans un titre public.
- **la place du bloc.** Il est aujourd'hui sous le catalogue, ce qui est
  cohérent : on découvre l'offre complète, puis on entre dans une discipline.
  Le remonter au-dessus rendrait ces quatre pages plus visibles pour le SEO,
  au prix de la même ambiguïté qu'on vient de corriger.

### Q41 · Composition du header
**Statut :** tranchée par Hugo, trois points à valider
**Source :** Hugo, 2026-09-16. « Le menu devrait être aligné à gauche. À droite,
Séance d'essai est un bouton secondaire, bouton principal S'inscrire ou bien
S'abonner vers la page tarif. Il faut une icône pour l'espace membre ou bien
Se connecter, ça renvoie vers la plateforme Echino. »

Appliqué : menu collé au logo à gauche, actions à droite dans l'ordre
croissant d'engagement, « Se connecter » avec icône, « Séance d'essai » en
secondaire, « S'abonner » en principal vers /tarifs.

**S'abonner plutôt que S'inscrire**, et c'est une recommandation, pas un
détail. « S'abonner » est déjà le mot de la carte club et de la barre récap.
B.3 tient à un seul mot par chose, c'est la règle qui a fait choisir « Extra »
et « catégorie ». « S'inscrire » se dirait aussi d'une newsletter ou d'un
cours : trois mots pour une action, c'est un mot de trop.

À valider :
- **la destination du bouton principal.** Il mène à /tarifs, donc il promet un
  abonnement et livre une page de prix. C'est l'usage courant et /tarifs est la
  page de conversion, mais on peut aussi assumer « Voir les tarifs », plus
  honnête et moins vendeur. Mon avis : garder « S'abonner », le prospect qui
  clique cherche à s'abonner, pas à lire un tableau.
- **le header mobile.** Le menu passe derrière un burger, qui n'est pas
  maquetté à ce stade : la maquette se contente de masquer le menu, comme
  avant. Restent le compte en icône seule et « S'abonner ». « Séance d'essai »
  disparaît du header mobile faute de place ; elle reste dans le CTA de chaque
  page. À trancher : est-ce acceptable, ou faut-il la garder et sacrifier autre
  chose ? Le burger est de toute façon à maquetter.
- **l'espace membre.** Le libellé est « Se connecter », avec une icône de
  personne. Alternative : « Espace membre », plus explicite pour qui n'a pas
  encore de compte mais plus long. Le lien sort vers l'outil métier : à
  confirmer que c'est bien une redirection et non une page intermédiaire, et
  que le membre revient ensuite sur le site.

### Q42 · Hyrox est une licence, et Cross Training porte deux sens
**Statut :** appliqué, un point à confirmer
**Source :** le client via Hugo, 2026-09-16. « HYROX c'est une licence. On
l'utilise pour un cours collectif nommé Les Mills Ceremony Hyrox et un Small
Group Training nommé Ceremony Hyrox Max. Donc pas de SGT "Hyrox". D'ailleurs
l'Hyrox n'est finalement pas chez Pâquis, c'est un autre SGT appelé Cross
Training. 3 cours par semaine, 45 min : mardi 12h15, jeudi 18h30, vendredi
12h15. »

Appliqué :
- le cours collectif « Les Mills Ceremony » devient « Les Mills Ceremony
  Hyrox », dans la famille Les Mills. Slug `/cours/les-mills-ceremony-hyrox`.
- le Small Group Training « Hyrox » devient « Ceremony Hyrox Max ». Il quitte
  Genève · Pâquis et reste proposé à Meyrin.
- Genève · Pâquis reçoit le Small Group Training « Cross Training », avec les
  trois créneaux donnés. Le club est un club Gym : son planning n'a que des
  Small Group Training, la règle tient toujours.
- règle posée : une licence n'est pas un produit. Le nom seul, Hyrox ou Les
  Mills, ne désigne rien et n'apparaît jamais comme nom de produit. Seule
  exception, les titles SEO, parce que c'est le mot que les gens cherchent :
  le title du hub Small Group Training garde « Hyrox ».

**Confirmé par le client le 2026-09-16 : Cross Training a bien trois formes,
et les trois sont justes.**
- une **zone du plateau**, qu'on utilise en autonomie avec le matériel adapté.
  Elle vit sur la page Plateau fitness, elle n'est pas un cours.
- un **cours collectif**, en groupe avec un coach, inclus dans les formules.
  Rétabli à Meyrin et Denges.
- un **Small Group Training** à Genève · Pâquis, payant en Extra.

Retenu dans les maquettes : les deux cours partagent **une seule fiche**,
`/cours/cross-training`. Deux pages du même nom se cannibaliseraient au
référencement, et B.3 dit déjà qu'un format n'est jamais une page mais un
filtre. La fiche rassemble les créneaux des deux formes et porte un bloc
« Aussi en Small Group Training » qui explique que celle-là est un Extra.

**La vraie question que ça pose au modèle de contenu**, et elle est
structurante : le caractère Extra ne tient pas au cours, il tient à la séance.
La même pratique est incluse à Meyrin et payante à Pâquis. Dans les maquettes
je porte la distinction avec deux entrées de cours, dont la seconde renvoie à
la fiche de la première. Au CMS, c'est un choix à faire, et il appartient à la
section 7 (Q36) : soit deux produits liés, soit un cours dont chaque séance dit
si elle est incluse ou en Extra. La seconde option est plus juste mais elle
change la saisie du planning.

**Historique du point, désormais clos.**
- B.3 le cite comme une **zone du plateau fitness** (musculation, cardio,
  fonctionnel, cross training)
- la liste de juillet en faisait un **cours collectif en salle**, que j'avais
  saisi à Meyrin et Denges
- le client en fait maintenant un **Small Group Training** à Pâquis

J'ai tranché pour le Small Group Training, seul cas dont on soit sûr, et
retiré les séances de cours collectif inventées. La zone du plateau reste,
elle ne gêne pas : un nom de zone et un nom de cours peuvent coexister.

Ce qu'il faut confirmer : **Cross Training existe-t-il aussi comme cours
collectif inclus, dans les clubs Essential et Premium ?** Si oui, le même nom
serait inclus dans un club et payant dans un autre. C'est tenable seulement si
on l'affiche clairement, et ça mérite plutôt deux noms distincts. La question
vaut pour tout futur Small Group Training : un nom de Small Group Training ne
devrait jamais être aussi un nom de cours collectif.

### Q43 · Un seul Extra pour tous les Small Group Training
**Statut :** tranchée par Hugo le 2026-09-16
**Source :** Hugo, sur la page `/sport/small-group-training/` : « Pourquoi
mettre un prix sur les SGT ? On part du principe qu'ils sont tous inclus dans
les SGT, en option des formules et inclus dans Platinum. "Small Group Training"
ne peut pas être un SGT. Du coup quand on est sur la page tarif, je propose
uniquement en extra à choisir "Small Group Training" et pas le détail. Par
exemple pour Pâquis ou La Praille, on met uniquement en extra "Small Group
Training", pas Cross Training. »

**Ce que ça change.** B.3 disait « chaque Small Group Training est un extra à
part ». C'est faux désormais, et la phrase est corrigée dans le cahier des
charges.

Le modèle est maintenant :
- **un seul Extra**, nommé « Small Group Training ». C'est lui qui porte le
  prix et les clubs. Il s'ajoute à une formule, et il est compris dans la
  formule Premium Platinum, comme tous les Extras vendus en ligne.
- **les Small Group Training sont des cours**, de format petit groupe, marqués
  `estExtra` et rattachés à cet Extra. Ils n'ont pas de prix à eux : Cross
  Training et Ceremony Hyrox Max ne se vendent pas séparément.
- « Small Group Training » **n'apparaît jamais comme un training** dans le hub.
  C'est le nom de l'Extra qui les regroupe, pas celui d'une pratique. Le hub
  annonce l'Extra et son prix en haut, puis liste les trainings sans prix.
- sur la page Tarifs et sur la fiche club, **seul l'Extra s'affiche**. Pâquis
  et La Praille proposent « Small Group Training », jamais « Cross Training ».

**Pourquoi c'est mieux.** Un prix par training obligerait le visiteur à
additionner pour savoir ce qu'il paie, et à choisir sa pratique avant de
connaître son budget. Un prix unique répond à la seule question qui compte :
combien coûte l'accès au petit groupe dans mon club.

**Effet de bord réglé au passage :** l'Extra fourre-tout marqué
`regroupeAValider` (Q27) disparaît. Les clubs où un Small Group Training est
programmé sont ajoutés d'office aux clubs de l'Extra, pour qu'un planning et
une page Tarifs ne puissent jamais se contredire.

**Ce qui reste à confirmer par Harmony :** la liste des Small Group Training
par club. Aujourd'hui le hub en montre deux, Cross Training (La Praille,
Pâquis) et Ceremony Hyrox Max (Meyrin), pendant que l'Extra est proposé dans
les dix clubs.

### Q44 · La liste de La Praille corrige deux cours, et pose une question de nom
**Statut :** appliquée le 2026-09-16, deux points à confirmer
**Source :** Harmony, la liste des Small Group Training de Genève · La Praille :
TRX Pilates, HIIT, HIIT Boxing, Flow, Cross Training, Ceremony Hyrox Max.

**Deux cours étaient saisis en cours collectif par erreur.**
- **TRX Pilates** n'était donné qu'à La Praille. Il devient donc un Small Group
  Training partout où il existe : il quitte le catalogue des cours collectifs
  et il est compté en moins dans les formules. Il reste membre de la famille
  Pilates, qui dit la pratique et pas le mode d'accès, et la page de famille le
  marque « Extra ».
- **HIIT** reste un cours collectif à Meyrin, Blandonnet, Genève · Eaux-Vives et
  Signy, et devient un Small Group Training à La Praille seulement. Deux
  entrées, une seule fiche, comme Cross Training : le tableau « Où le
  pratiquer » marque « Extra » sur la ligne de La Praille et pas ailleurs.

**Deux cours sont créés :** HIIT Boxing et Flow, qui n'existent qu'à La Praille
et n'ont pas d'équivalent en cours collectif.

**Ceremony Hyrox Max** n'était qu'à Meyrin : il est aussi donné à La Praille.

**Ce qu'il faut confirmer.**
1. **« Flow » ou « FLOW » ?** La liste l'écrit en capitales. Je l'ai écrit
   « Flow », comme on écrit « Gym » et non « GYM » : on ne crie pas un nom de
   cours. Si c'est une marque déposée qui impose ses capitales, ça change.
2. **Les autres clubs.** Si TRX Pilates et HIIT étaient mal saisis à La Praille,
   la même erreur est probable ailleurs. Il faut la liste des Small Group
   Training club par club, et pas seulement les plannings : devant une série de
   séances, on ne voit pas si c'est inclus ou payant.

**Ce que ça a révélé au passage.** Le bloc « Aussi en Small Group Training »
d'une fiche partagée était construit mais jamais affiché : la condition
d'affichage regardait l'entrée principale de la fiche, qui est un cours
collectif. Corrigé : elle regarde maintenant toutes les entrées de la fiche.

### Q45 · Les Small Group Training entrent dans le catalogue des cours collectifs
**Statut :** tranchée par Hugo le 2026-09-16
**Source :** Hugo : « techniquement, un Small Group Training est un cours
collectif. Donc pourquoi pas les faire remonter dans les cours collectifs mais
visuellement bien montrer que ce sont des Small Group Training et que ça
sous-entend un Extra. Par contre garder quand même la page
/sport/small-group-training/. »

**Il a raison, et ça réparait un trou.** Un visiteur qui cherchait HIIT à
Genève · La Praille ne trouvait rien : le cours existe, il a une fiche, mais le
catalogue le cachait parce qu'il est payant là-bas. Pâquis, lui, apparaissait
comme un club sans aucun cours.

**Ce qui a été fait.**
- Le catalogue et le planning type du hub contiennent les Small Group Training.
- Trois traitements sur la carte, selon ce que le cours coûte vraiment :
  inclus partout, rien de plus ; Extra partout, liseré, marqueur « Extra » et
  « En option de votre formule, pas inclus » ; Extra dans certains clubs
  seulement, la phrase sans le marqueur, sinon on ferait fuir d'un cours qui
  est inclus presque partout.
- Le planning marque « Extra » sur les séances concernées, sous la ligne
  « Inclus dans votre abonnement, sauf mention Extra ».
- Le compteur annonce « 51 cours, dont 5 en Extra ».
- La page `/sport/small-group-training/` reste : elle explique le principe,
  porte le prix de l'Extra et capte les recherches propres à ces cours.

**Les garde-fous, parce que c'est là que ça peut déraper.**
1. **Le nombre de cours d'une formule ne change pas** : il ne compte que ce qui
   est inclus. Le catalogue montre plus que ce que la formule promet, et c'est
   l'affichage qui dit la différence, jamais le compte.
2. **Filtrer un club ou une formule restreint la réponse à ce périmètre.** HIIT
   est « parfois » un Extra dans l'absolu, mais à La Praille il l'est toujours.
   Dire « parfois » à quelqu'un qui a choisi son club, c'est le laisser payer
   sans le savoir.
3. **Une fiche partagée reste une seule carte.** Deux cartes du même nom
   feraient croire à deux cours.
4. **Le message Gym se calcule sur les séances, pas sur les cours.** Sinon la
   fiche partagée de Cross Training, incluse ailleurs, faisait croire à un
   cours collectif inclus à Pâquis.

**Ce que ça laisse ouvert :** la page `/sport/cours-collectifs/` promet
« Inclus dès la formule Essential » en sous-titre, et montre maintenant des
cours qui ne le sont pas. La mention sous le titre le dit, mais si Harmony
trouve que ça brouille la promesse, l'autre option est de reléguer les Extras
dans une section en fin de catalogue.

### Q46 · La section des familles disparaît du hub
**Statut :** tranchée par Hugo le 2026-09-16
**Source :** Hugo : « J'ai encore du mal avec la section Des disciplines
déclinées en plusieurs cours. Pour moi on pense encore que ce sont les seules
disciplines. Cette section est-elle obligatoire ? On peut pas tout simplement,
sur une fiche cours co qui appartient à une famille, rendre cliquable la
famille ? »

**Ce qui a été essayé avant.** Q40 avait déjà changé le titre, de « Nos
disciplines » à « Des disciplines déclinées en plusieurs cours », avec une
phrase qui renvoyait au catalogue. Ça n'a pas suffi, et c'est logique : une
section de quatre cartes en pleine largeur se lit comme un sommaire, quoi
qu'annonce son titre. Le problème n'était pas la formulation, c'était la forme.

**Ce qui est fait.** La section est supprimée. Les pages de famille se trouvent
maintenant depuis les cours qui en font partie :
- dans le catalogue, la mention « Famille Pilates » de chaque carte est un lien ;
- sur une fiche, la famille est un cran du fil d'Ariane, entre le hub et le
  cours : `Accueil › Sport › Cours collectifs › Pilates › Swiss Ball Pilates`.

**Ce que ça change pour le maillage.** Vingt-quatre cours renvoient vers une page
de famille, là où la section en offrait quatre liens. C'est plus de liens
internes, mieux situés, et chacun arrive avec son contexte.

**Ce qu'on perd.** La description de chaque famille et son nombre de cours,
qui n'existaient que sur ces cartes. Les deux vivent sur la page de famille
elle-même, qui est leur place.

**B.3 demandait « liens vers les pages de famille » sur le hub.** C'est
toujours le cas : ce sont les mentions de famille du catalogue. La ligne du
cahier des charges est précisée, pas contredite.

**Sur une fiche de Small Group Training aussi.** TRX Pilates est un Extra, mais
il reste de la famille Pilates : son fil d'Ariane donne
`Accueil › Sport › Small Group Training › Pilates › TRX Pilates`. La famille
dit la pratique, le hub dit le mode d'accès.

### Q47 · Carte de cours cliquable en entier, sans bouton
**Statut :** tranchée par Hugo le 2026-09-16
**Source :** Hugo : « doit-on rendre les cartes cours (cours co, SGT)
cliquables ou ajouter un CTA ? Plutôt que le titre cliquable ? »

**La carte entière, sans bouton.** Une carte dans une grille se lit comme un
bouton : on la vise, on tape dessus, et il ne se passait rien parce que seul
le titre était cliquable. Sur mobile, viser un titre au pouce est pénible ;
la carte fait 358 px de large.

**Pourquoi pas un bouton par carte.** Le catalogue en compte cinquante et un.
Cinquante et un boutons « Voir le cours » alourdissent la page, répètent la
même chose, et surtout entrent en concurrence avec les vraies actions :
« S'abonner », « Demander une séance d'essai ». Une carte de cours ne
déclenche rien, elle emmène quelque part. La règle qui en sort :

> Une carte qui mène quelque part est cliquable en entier. Une carte qui
> déclenche une action porte un bouton.

Les cartes produit de la page Tarifs gardent donc « Choisir [formule] » :
elles ne mènent nulle part, elles enregistrent un choix.

**Comment c'est fait.** Le lien du titre s'étire par-dessus la carte
(`::after` en `inset: 0`), plutôt que d'envelopper la carte dans un `<a>` ou
de poser un gestionnaire de clic. Trois raisons : envelopper la carte est
impossible tant qu'elle contient un autre lien, celui de la famille, car des
liens imbriqués sont invalides ; un seul lien reste dans l'arbre
d'accessibilité, donc un lecteur d'écran n'annonce pas deux fois la même
destination ; et sans JavaScript, le clic du milieu ouvre un nouvel onglet
comme sur n'importe quel lien.

Les liens à l'intérieur de la carte repassent au-dessus de la nappe par
`z-index` : cliquer « Famille Pilates » mène bien à la famille, pas au cours.

**Contrepartie assumée :** le texte d'une carte n'est plus sélectionnable.
C'est le prix de cette technique, et il est faible sur une carte de catalogue.

**Le bouton « Voir le cours » du hub Small Group Training disparaît**, pour que
les cartes de cours se comportent partout pareil.

### Q48 · « Inclus dès Essential » contre « dans les formules Essential et Premium »
**Statut :** corrigé le 2026-09-16
**Source :** Hugo, sur `/sport` : « Pour Cours collectifs on dit "Inclus dès la
formule Essential". Pour Coaching personnel on dit "Des séances incluses dans
les formules Essential et Premium". Cohérent ? »

**Non, et l'énumération était déjà fausse.** Premium Platinum comprend elle
aussi des séances de coaching. La phrase datait d'avant sa création : elle est
devenue fausse le jour où la formule est née, et personne ne l'a vue, y compris
moi, y compris en relisant la page pour d'autres raisons.

C'est exactement ce que la règle du « dès » sert à éviter. Elle existait déjà
pour l'accès aux clubs ; elle n'avait pas été appliquée aux lignes d'inclusion.

**Ce qui est fait.** Ces phrases ne sont plus écrites dans les pages : elles se
déduisent des formules, avec `HF.vues.ligneInclusion(id)`. Trois réponses
possibles :

| Cas | Ce qui s'affiche |
|---|---|
| Toutes les formules la comprennent | Inclus dans toutes les formules |
| Certaines seulement | Inclus dès la formule [la première, dans l'ordre] |
| Aucune | En Extra de votre abonnement |

Le hub Sport et la page Coaching personnel lisent cette fonction. Le jour où
une formule s'ajoute, ou change ce qu'elle comprend, les quatre lignes suivent
toutes seules.

**Le cahier des charges portait la même faute.** Le sous-titre de la page
Coaching personnel, dans B.3, énumérait « Essential, Premium et Premium
Platinum » : il avait donc déjà été corrigé une fois. Il dit maintenant « dès
la formule Essential », avec la raison, pour que la correction ne soit pas à
refaire.

**Complément du même jour.** La ligne des Small Group Training disait « En
Extra de votre abonnement » et s'arrêtait là. Hugo l'a complétée : « En Extra
de votre abonnement ou inclus dans la formule Premium Platinum ». Dans cet
ordre, ce que ça coûte d'abord, la sortie par le haut ensuite. Le nom de la
formule est déduit de son champ `inclutExtras`, jamais écrit dans la page :
c'est la même règle, appliquée au dernier des quatre piliers.

**Ce que ça ne change pas :** la mention « Pas de séances de coaching incluses
dans la formule Gym » reste. Dire ce qui commence à Essential ne dit pas
explicitement ce qui manque en Gym, et sur cette page-là c'est une question que
les visiteurs se posent.

### Q49 · Une campagne n'a pas de nom dans le modèle
**Statut :** ouverte, posée en construisant `/offre-du-moment` le 2026-09-16
**Source :** B.3 > Tarifs et offres : « Adresse stable, contenu qui change (H1
et title au nom de l'offre) ».

**Le problème.** La phrase suppose une campagne à un seul produit. La nôtre en
a deux, Black Friday Premium et Black Friday Essential, qui portent chacun son
nom. Le nom qui les réunit, « Black Friday », n'existe nulle part : ni sur les
produits, ni ailleurs dans le modèle. Le H1 et le title de la landing n'ont
donc rien à afficher.

**Ce que fait la maquette en attendant.**

| Cas | H1 et title |
|---|---|
| Une seule offre dédiée | son nom |
| Plusieurs offres dédiées | `[Nom de la campagne]`, marqué à saisir |
| Une remise sur des produits existants | le nom de la promotion, qui en a un |
| Aucune campagne | « Pas d'offre en ce moment » |

**Ce qu'il faudrait trancher.** Soit une campagne devient une entité du CMS,
avec son nom, ses dates et les produits qu'elle réunit, et les offres dédiées
s'y rattachent comme les promotions s'y rattacheraient. Soit on accepte qu'une
campagne ne porte qu'un produit, et la question disparaît. La première est plus
juste, la seconde est plus simple : c'est une décision de modèle (section 7),
pas d'affichage.

**Deux autres écarts avec B.3, tranchés dans la maquette et à valider.**

1. **Le hero ne porte ni durée ni prix.** B.3 demande « nom, durée, prix,
   compteur ». Avec deux produits de durées et de prix différents, un prix au
   hero annoncerait celui d'une carte et pas de l'autre. Durée et prix restent
   donc sur les cartes, le hero garde le nom et le compteur.
2. **Une seule campagne annoncée à la fois.** Quand des offres dédiées
   tournent, la page ne montre pas l'annonce de la promotion sur les carnets,
   qui tourne en même temps dans le lab. Cette page reprend la promesse d'une
   publicité, une seule : renvoyer ailleurs quelqu'un qui vient d'arriver pour
   la première campagne, c'est le perdre. Les conditions suivent la même règle,
   elles ne parlent que de ce que la page montre.

**Et une conséquence sur le compteur.** Le compteur est au hero, une fois pour
la page, donc les cartes ne portent plus leur pastille « jours restants » ici :
le même nombre deux fois à l'écran ne renseigne personne. Sur /tarifs, où il
n'y a pas de hero de campagne, la règle inverse continue de s'appliquer.

### Q50 · Un header et un pied réduits sur la landing de campagne
**Statut :** demandé par Hugo le 2026-09-16, à valider par Harmony
**Source :** Hugo : « j'aimerais que ça ressemble plus à une landing page avec
hero spécial. Il faut une photo en place. Et je réfléchis du coup à pousser
l'idée de la landing page et avoir une version 2 du header. Sans distraction à
part s'abonner ou bien choisir son offre promotionnelle. »

**Pourquoi c'est justifié.** Cette page est la destination d'annonces payées.
Chaque sortie du parcours, menu, espace membre, séance d'essai, barre groupe,
est un clic acheté qui ne convertit pas. Le reste du site sert à explorer ;
cette page sert à prendre l'offre annoncée.

**Ce qui est en place.**
- **Hero de campagne** : photo pleine largeur du conteneur, panneau posé
  dessus qui porte le sur-titre « Offre du moment », le nom, l'échéance et
  l'action. En mobile le panneau passe sous la photo : un texte sur une image
  n'est lisible ni l'un ni l'autre sur 390 px.
- **Header réduit** : le logo et une seule action, « Profiter de l'offre »,
  qui descend à l'offre. Pas de menu, pas d'espace membre, pas de séance
  d'essai, pas de barre groupe. Le logo reste cliquable : c'est la sortie de
  secours que tout le monde cherche, et la retirer est plus irritant
  qu'efficace.
- **Pied réduit** : mentions légales et un lien de contact. Le reste
  emmènerait ailleurs.
- **Pas de CTA séance d'essai.** Ce n'est pas un oubli : B.3 ne le met pas
  dans les blocs de cette page, et sur une landing il entrerait en concurrence
  avec « Profiter de l'offre ».

**Ce que ça ouvre.** Si la variante est validée, elle ne concerne pas que cette
page : toute landing de campagne future en hériterait, et le gabarit vaut aussi
pour une page d'atterrissage d'annonce sur un club ou sur un cours. Il faudra
alors décider si c'est un gabarit du CMS ou un réglage par page.

**Ce que je n'ai pas pu faire.** Hugo renvoie aux pages d'offres.harmony.ch
pour la direction visuelle. Ce domaine n'est pas joignable depuis
l'environnement de travail : la maquette suit les conventions de landing et le
système graphique du lab, pas ces pages-là. À recaler sur captures.

### Q51 · Le choix du club passe après l'offre sur la landing
**Statut :** tranchée par Hugo le 2026-09-16
**Source :** Hugo : « cette page s'adresse principalement à une audience
froide, on s'en servira comme landing page pour nos annonces Meta ou Google.
Le choix du club avant le détail des offres n'est pas trop tôt ? »

**Oui, c'était trop tôt.** Quelqu'un qui arrive d'une annonce vient vérifier
une promesse : ce que c'est, combien ça coûte, jusqu'à quand. Lui demander son
club avant de la tenir, c'est un péage à l'entrée, sur un trafic qui n'a encore
rien investi et qui est payé au clic.

**Le nouvel ordre :** hero, l'offre, le club, les conditions, la FAQ, le lien
vers tous les tarifs. On tient la promesse d'abord, on demande ensuite, au
moment où c'est nécessaire pour agir.

**La ligne sans club n'est plus une impasse.** Elle disait « Choisissez d'abord
votre club pour souscrire » alors que le choix était au-dessus, puis en dessous
de l'offre. Elle porte maintenant un lien qui descend au bloc du club. Une
phrase qui dit quoi faire sans donner le moyen de le faire, c'est un cul-de-sac
poli.

**Le bon cas, celui qu'il faut viser côté acquisition :** quand l'annonce porte
déjà le club dans son adresse (`?club=meyrin`), le bloc de choix se replie en
une ligne de rappel et les boutons sont actifs dès la première carte. Une
annonce géolocalisée devrait toujours transporter son club : c'est une étape en
moins pour quelqu'un qui vient de cliquer.

**Ce qui n'a pas changé :** pas de bouton de souscription sans club référent.
C'est une règle de B.3, elle vaut ici comme sur Tarifs.

### Q52 · Composition de la landing : arguments, preuve sociale, et le club en dernière étape
**Statut :** demandé par Hugo le 2026-09-16, contenu à fournir par Harmony
**Source :** Hugo : « il manque des sections pour présenter Harmony, ses
avantages, sa philosophie. Des éléments différenciants. Aussi de la social
proof comme des témoignages ou des notes. Et mettre le choix après la formule
fait un peu bizarre finalement, qu'en penses-tu ? »

**Sur le club : ce n'était pas l'ordre, c'était le poids.** Une liste de dix
clubs avec sa carte, posée entre l'offre et le reste, coupe la page en deux.
Le bloc n'était pas au mauvais endroit dans le raisonnement, il était trop
lourd au milieu d'une page qui doit se lire d'une traite. Il est maintenant le
dernier geste, après les arguments, sous le titre « Dernière étape ».

**Conséquence, et c'est ce qui manquait :** une fois le club choisi en bas de
page, l'action est là, pas seulement en haut. Le bloc affiche le rappel du club
et une ligne par offre disponible, avec son prix et son bouton. Personne ne
remonte une page pour finir ce qu'il a commencé en bas.

**La composition, du haut vers le bas.**

| Bloc | Ce qu'il fait |
|---|---|
| Hero | tient la promesse de l'annonce, échéance, action |
| L'offre | ce qu'on achète, prix, ce qui est inclus |
| Pourquoi Harmony | quatre différenciants : la landing s'adresse à des gens qui ne connaissent pas la marque |
| Ils s'entraînent chez Harmony | la note, le nombre d'avis, trois témoignages |
| Dernière étape | le club, puis l'action |
| Conditions, FAQ, lien vers tous les tarifs | ce qu'on vérifie avant de s'engager |

Les arguments sont **entre** l'offre et l'engagement, à l'endroit où le doute
arrive : le prix a été vu, il faut maintenant une raison de choisir Harmony
plutôt qu'un autre.

**Deux blocs absents de B.3**, ajoutés sur demande et notés comme tels dans le
cahier des charges : « Pourquoi Harmony » et la preuve sociale. Les témoignages
ne sont pas une nouveauté, c'est le composant partagé déjà utilisé sur Tarifs
et sur le hub des cours ; B.3 les prévoit sur l'Accueil et sur la séance
d'essai.

**Ce qui attend Harmony.**
- **Les quatre différenciants** : ce sont des arguments de marque, ils ne
  s'inventent pas. Placeholders `[Différenciant 1]` à `[Différenciant 4]`.
  Quatre, parce qu'au-delà personne ne les lit.
- **La note et le nombre d'avis** : ce sont des faits. `[note] / 5`,
  `[nombre] avis`, `[source des avis]`, marqués à valider. Il faudra dire d'où
  ils viennent (Google, une plateforme d'avis, une enquête interne) et comment
  ils se mettent à jour : une note figée dans le CMS vieillit mal.
- **Les témoignages** : de vrais membres, avec leur club.

**Le hero porte trois preuves** (Hugo, 2026-09-16 : « qu'on soit tout de suite
hooked »). Devant un prix, sur une page où on n'a jamais mis les pieds, deux
questions viennent avant toutes les autres : c'est sérieux, et c'est près de
chez moi ? Les trois chiffres y répondent, sous le bouton, séparés par un
filet : le chiffre gros, le mot petit, c'est ce qui se lit en diagonale.

| Preuve | D'où elle vient |
|---|---|
| **10** clubs en Suisse romande | déduit, `nbClubs()` |
| **[note] / 5**, [nombre] avis | à fournir par Harmony |
| **92** séances par semaine, incluses | déduit, `nbSeancesSemaine()`, Extras exclus |

Deux précautions. Le troisième chiffre exclut les Small Group Training : on
annonce ce qui est compris, pas ce qui se paie en plus. Et « Suisse romande »
est le seul mot écrit en dur : il tient tant que les clubs restent dans les
cantons de Genève et de Vaud.

**La note reste un placeholder, et c'est important.** Une note s'invente encore
moins qu'un prix : fausse, elle se retourne contre la marque, et personne ne la
vérifie avant de la publier. Il faudra dire d'où elle vient et comment elle se
met à jour.

**Une correction dans la foulée.** Sans club, les cartes n'avaient aucun
bouton : B.3 interdit un bouton de souscription tant que le club référent n'est
pas choisi, et j'avais appliqué la règle à la lettre. Résultat, sur une landing,
des cartes en cul-de-sac. Elles portent maintenant « Choisir mon club », qui
descend au bloc du club. Ce n'est pas un bouton de souscription : la règle tient,
la page ne laisse plus le visiteur sans rien à faire. La ligne d'explication
au-dessus des cartes a disparu du même coup, elle aurait dit deux fois la même
chose.

**Une répétition assumée.** Quand un club est déjà choisi, le bouton est sur la
carte en haut et dans la dernière étape en bas. Ce n'est pas un produit
dupliqué, c'est la même action rappelée en fin de page, ce que fait toute
landing qui convertit.

### Q53 · Le « motif » d'une demande d'essai est un objectif
**Statut :** tranchée avec Hugo le 2026-09-16
**Source :** B.3 > Séance d'essai : « Formulaire demande de rappel (date
indicative J+1 à J+14, club, motif, dispatch par club) ».

« Motif » pouvait se lire de deux façons : un sujet, comme sur le formulaire de
contact, ou ce que la personne vient chercher. La seconde lecture est retenue :
le champ reprend **les six objectifs des cours**, sans créer de liste à part.

Trois raisons. Aucun référentiel en plus à saisir et à maintenir. Le coach sait
quoi préparer avant la séance. Et la demande d'essai parle le même vocabulaire
que le catalogue de cours, ce qui ouvre la porte à un rapprochement plus tard :
proposer à quelqu'un qui a coché « Se détendre » les cours rangés sous cet
objectif dans son club.

Le champ n'est pas obligatoire, « Sans préférence » est une réponse valable.

### Q54 · « Séance d'essai » ou « journée d'essai » ?
**Statut :** ouverte, bloquante pour la copy
**Source :** le client, 2026-09-16 : « La journée d'essai Harmony est proposée
au tarif de 20 CHF, déduits en cas de souscription à un abonnement avec
engagement (hors abonnements mensuels sans engagement). »

**Deux mots pour la même chose.** B.3 dit « séance d'essai » partout : le
bouton du header, les CTA de toutes les pages, l'adresse `/seance-essai`. La
phrase tarifaire du client dit « journée d'essai ». Et le déroulé qu'il a donné,
accueil, entretien, accompagnement, autonomie, entretien de fin, ressemble
davantage à une demi-journée qu'à une séance.

C'est exactement le genre d'écart que B.3 combat ailleurs : un seul mot par
chose, en club, dans l'appli, sur le site et dans Echino. Deux mots, et le
visiteur se demande s'il a droit à une séance ou à une journée, alors que c'est
la même chose et qu'elle est payante.

**Dans la maquette :** « séance d'essai » partout, puisque c'est B.3, et la
phrase tarifaire reprise **telle quelle**, avec « journée », parce que c'est une
condition commerciale du client et qu'on ne réécrit pas une condition sans son
accord. L'écart est donc visible à l'écran, volontairement.

**Ce qu'il faut trancher :** le mot, et ce qu'il recouvre. Si c'est une journée,
l'adresse, le bouton du header et tous les CTA changent.

**Un point de fond à ne pas rater.** L'essai est **payant**, 20 CHF. Tous les
CTA du site disent « Demander une séance d'essai » sans le mentionner. Sur la
page, la condition est posée au-dessus des champs, jamais sous le bouton : une
condition qu'on découvre après avoir tout rempli est une condition cachée. Mais
il faut décider si les CTA eux-mêmes doivent le dire, et notamment celui du
header, qui est présent sur toutes les pages.

### Q55 · La piscine est-elle un espace bien-être ?
**Statut :** ouverte, visible à l'écran
**Source :** B.3 > Bien-être > Espaces wellness : « Présenter sauna, hammam,
jacuzzi, jets massants et leur répartition par club ». Quatre espaces. Les
données en marquent cinq : `piscine` porte `bienEtre: true`.

**Où ça se voit.** La piscine apparaît sur la page Espaces wellness et dans le
bloc bien-être des pages club, à côté du sauna. Le marqueur « hors des quatre
espaces nommés par B.3 » est affiché sur sa carte, exprès.

**Pourquoi ce n'est pas anodin.** Une piscine ne joue pas le même rôle qu'un
sauna. Elle sert aux cours aquatiques, qui sont au planning fitness, et à
l'école de natation, qui est un autre site. La ranger en bien-être la fait
compter trois fois, dans trois discours différents.

**Deux sorties.** Soit la piscine perd son drapeau `bienEtre` et la page
Espaces s'aligne sur les quatre espaces de B.3, la piscine restant un
équipement comme un autre. Soit B.3 l'ajoute à sa liste, et il faut dire ce
qu'elle apporte ici que les cours aquatiques ne disent pas déjà.

**La question est devenue plus visible le 2026-09-17**, avec la ligne
d'inclusion « Espaces wellness » sur les cartes formule. Sur Premium, la carte
affiche « Piscine » en premier tag, juste sous « Cours aquatiques : 4 cours ».
Le même bassin y est donc annoncé deux fois, dans deux registres. C'est
l'argument le plus net pour lui retirer le drapeau.

**Et c'est aussi la démonstration de l'intérêt de tout déduire** : le jour où
la réponse tombe, un seul drapeau dans `data.js` change la page Espaces, le
bloc bien-être des dix pages club et les quatre cartes formule, d'un coup.

### Q56 · Ce qu'il manque pour construire la page Soins
**Statut :** bloquante, page non maquettée
**Source :** B.3 > Bien-être : « Massage & physiothérapie. Vitrine des soins,
orienter vers la réservation externe. Présentation des soins, praticiens,
tarifs indicatifs, CTA sortant vers l'outil de réservation (paramétré si
possible) ».

Quatre choses manquent, et sans elles la page serait une coquille à refaire :

1. **La liste des soins**, avec leur durée.
2. **Les praticiens** : sont-ils salariés d'Harmony ou indépendants hébergés ?
   La réponse change le discours de la page, et la responsabilité de la prise
   de rendez-vous.
3. **Les tarifs indicatifs.** Un prix ne s'invente pas. « Indicatif » veut-il
   dire une fourchette, ou un prix qui dépend du praticien ?
4. **L'outil de réservation externe** : son nom, son adresse, et surtout s'il
   accepte des paramètres. B.3 dit « paramétré si possible » : si l'outil sait
   recevoir le club et le soin, le lien évite au visiteur de tout resaisir.
   Sinon le bouton l'envoie sur une page d'accueil et une partie s'y perd.

**Une question de fond derrière la quatrième.** Les soins sont-ils proposés
dans tous les clubs, ou seulement dans certains ? Si c'est par club, il faut un
champ sur la fiche club, comme pour les équipements, et la page Soins pourra
dire où, comme la page Espaces le fait.

En attendant, le hub renvoie vers `/bien-etre/soins` avec le marqueur « page à
construire » : le lien existe dans la site map, on ne le cache pas.

### Q57 · « Jacuzzi ou jet massant » : une ligne du client, deux équipements chez nous
**Statut :** ouverte sur un point, deux points répondus le 2026-09-17
**Source :** document de disponibilité des prestations par club (Harmony,
2026-09-17), lignes Sauna, Hammam et Jacuzzi. Hugo précise que **le document
est ancien**.

Le document a été appliqué pour les trois lignes demandées. Sauna dans 9 clubs
sur 10, hammam dans 5, jacuzzi dans 2.

**Répondu · les étoiles se lisent Essential et Premium.** Le document range
les clubs en « 4 étoiles » et « 5 étoiles » (Hugo, 2026-09-17). Ce ne sont pas
d'anciens noms, comme je l'avais d'abord écrit ici : ce sont les étoiles
fitness-guide.ch, et B.3 s'en sert pour définir les deux catégories, Essential
= 4 étoiles, Premium = 5 étoiles. Elles sont donc bien à l'écran, dans le
module des catégories de clubs, et nulle part ailleurs : ni sur les cartes
club, ni sur les pages club. Pour lire le document client, la règle est la
même dans les deux cas : on traduit en catégories avant d'appliquer.

**Répondu · Pâquis n'a pas de wellness.** Le club ne figurait pas dans le
document, et c'était une déduction de notre part. Hugo la confirme : Genève ·
Pâquis n'a aucun espace bien-être. Il reste donc hors du tableau de la page
Espaces et son bloc bien-être ne s'affiche pas.

**Ouverte · le document fusionne ce que nous séparons.** Sa ligne s'intitule
« Jacuzzi ou jet massant » et coche La Praille, Veyrier et Denges. Le
référentiel, lui, a deux équipements distincts, `jacuzzi` et `jets`, et la
page Espaces leur fait deux colonnes. Appliquer la ligne telle quelle
obligerait à inventer : soit un jacuzzi à Denges, soit des jets massants à
Veyrier, alors que le document ne dit ni l'un ni l'autre. La répartition
existante a donc été gardée (jacuzzi à La Praille et Veyrier, jets à La
Praille et Denges) et la ligne n'a rien changé.

Deux sorties : soit Harmony précise club par club lequel des deux est
installé, soit les deux équipements n'en font plus qu'un, « Jacuzzi ou jets
massants », et la page Espaces perd une colonne. La deuxième est la plus
simple si la distinction ne se vend pas, et c'est d'ailleurs ce que le
document faisait déjà.

**Ce que « vieux document » implique, et qui n'est pas neutre.** Sur une
source ancienne, ajouter un équipement est peu risqué : un club qui avait un
sauna l'a probablement encore. **Retirer en est un autre.** Le hammam de
Veyrier a disparu parce que le document ne le coche pas, et c'est la seule
suppression de l'opération. Si Veyrier a installé un hammam depuis, la page
Espaces l'annonce absent, ce qui est pire qu'un silence. À confirmer avant la
mise en ligne, ou à relever au prochain point avec les clubs.

**Ce que le document change, et qui n'est pas anodin.** Le sauna est
désormais dans neuf clubs sur dix, le hammam dans cinq dont trois Essential.
Conséquence directe sur les cartes formule : la ligne « Espaces wellness »
d'Essential affiche maintenant « Sauna, Hammam » là où elle n'affichait que
« Sauna ». L'écart avec Premium se joue donc sur la piscine, le jacuzzi et
les jets, pas sur le hammam. À savoir avant d'en faire un argument de vente.
