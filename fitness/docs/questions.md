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
**Statut :** ouverte
**Source :** le mapping du doc de septembre ne mentionne pas ce cours, et il
ne figure pas non plus dans les propositions de Hugo pour les trous.
**Dans les maquettes :** `objectifPrincipal: null`. Le cours remonte dans un
groupe « [Objectif à définir] » en fin de catalogue, visible exprès. Un cours
sans objectif principal n'a pas sa place dans un catalogue rangé par objectif.

### Q27 · Liste détaillée des Extras
**Statut :** ouverte
**Source :** B.3 > Catégories de clubs : « Chaque Small Group Training est un
extra à part, et l'offre varie selon les clubs ».
Hugo a posé une liste provisoire le 2026-09-14, en attendant celle d'Harmony :
Small Group Training (tous sauf Hyrox), Service Pressing, Gel de l'abonnement,
tous dans les clubs Essential et Premium, tous à « CHF XX.– ».

Deux points à reprendre quand Harmony fournit la vraie liste :
- « Small Group Training » regroupe aujourd'hui tous les autres Small Group
  Training en un seul Extra. B.3 en veut un par Small Group Training, chacun
  avec sa fiche cours. L'Extra est donc marqué `regroupeAValider` et n'a pas
  de lien vers une fiche.
- L'Extra « Service linge », que j'avais posé d'après la mention « les services
  (linge…) » de B.3, est remplacé par « Service Pressing », le nom donné par
  Hugo. Si les deux services sont distincts, il faut les rétablir tous les deux.

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
**Statut :** tranchée par Hugo, à répercuter dans B.3
**Source :** Hugo, 2026-09-15. « Il serait également intéressant de filtrer par
catégorie de clubs : Gym (en réalité pas de cours co pour Gym), Essential,
Premium. Aussi, intégrer une barre de recherche. »

B.3 prévoit quatre filtres sur le hub : club, objectif, intensité, format. Deux
s'ajoutent, et ce sont des ajouts, pas des lectures de B.3 :
- **catégorie de clubs** (Gym, Essential, Premium), qui répond à « qu'est-ce que
  je peux faire dans un club Premium »
- **recherche par nom**, pour qui sait déjà ce qu'il cherche

Choix faits dans la maquette, à valider :
- la catégorie porte sur la catégorie du club où le cours est donné, pas sur la
  règle d'accès des formules. Filtrer Essential ne remonte donc pas les cours
  des clubs Gym, alors que la formule Essential y donne accès. Si c'est « ce à
  quoi ma formule me donne droit » qui est attendu, c'est un autre filtre, celui
  de /clubs, qui s'appelle « Ma formule ».
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

### Q33 · La formule Platinium
**Statut :** tranchée par Harmony, points d'application ouverts
**Source :** Hugo, 2026-09-15. « On va à nouveau intégrer une formule. La
formule Platinium. C'est la formule Premium mais avec les services extra
inclus. Elle est disponible uniquement pour les clubs Premium. »

Posé dans les maquettes :
- 4e formule, après Premium. Catégorie d'accès : Premium, donc les 10 clubs.
- nouveau champ `souscriptionDepuis: ['premium']`. L'accès et la souscription
  deviennent deux choses distinctes : Platinium ouvre les 10 clubs mais ne se
  souscrit que depuis un club Premium. Depuis un club Essential ou Gym, la
  carte n'apparaît pas et la formule est regroupée dans la ligne « Pas
  disponible depuis [club] », comme les autres produits indisponibles.
- 5e ligne d'inclusion, « Extras », pour que les 4 cartes se comparent ligne à
  ligne : c'est la seule chose qui distingue Platinium de Premium.
- champ `inclutExtras`. Quand Platinium est choisie, les Extras vendus en ligne
  passent en « Inclus avec la formule Platinium », ceux vendus en club restent
  « Sur demande en club ». La règle se déduit du mode de vente, elle ne cite
  aucun Extra en particulier : « Séances de coaching en plus » reste donc en
  « Sur demande en club » tout seul, comme demandé.
- les Extras déjà ajoutés au récap sont retirés au moment du choix, avec un
  message. On ne facture pas deux fois, et on ne vide pas en silence.

À trancher avec Harmony :
- **le nom de formule sans catégorie de club.** B.3 recommande « nom de formule
  = nom de catégorie ». Platinium casse cette règle : il n'y a pas de club
  Platinium. Un visiteur peut chercher « les clubs Platinium » et ne rien
  trouver. Faut-il une phrase sur la carte, du type « Dans les 3 clubs
  Premium » ? Aujourd'hui la carte affiche « Accès aux 10 clubs », ce qui est
  juste mais ne dit pas la restriction de souscription.
- **la ligne « Pourquoi ? »** de la ligne des produits indisponibles renvoie au
  module Catégories de clubs, qui explique l'accès. Ici la raison est autre :
  une restriction de souscription. Faut-il un mot dédié ?
- **les tarifs réduits** (Ado, Jeune, Senior) s'appliquent-ils à Platinium ?
  Posé comme Premium en attendant.
- **l'engagement** : Platinium existe-t-elle sans engagement, ou seulement en
  12 mois ?
- **la promotion en cours** sur Essential et Premium porte-t-elle aussi sur
  Platinium ? Non aujourd'hui dans le jeu de démonstration.
- **le prix** de Platinium, et le libellé exact de la ligne d'inclusion
  « Extras », qui dit aujourd'hui juste « Extras ».

### Q34 · Graphie « Gym » et système de nommage des formules
**Statut :** graphie tranchée par Hugo, système de nommage à trancher
**Source :** Hugo, 2026-09-15. « Pour une cohérence avec les autres formules, il
faut écrire "Gym" et pas "GYM" en majuscule. »

**Graphie.** Appliquée partout dans les maquettes. B.3 disait l'inverse : « Une
seule graphie, GYM, identique en club, dans l'appli et sur le site. » La ligne
est corrigée sur Notion et dans l'export local. À répercuter hors du site : en
club, dans l'appli, dans Echino, et dans la section 7 du cahier des charges, que
je ne modifie pas (fichier en lecture seule, il porte encore « GYM »).

**Système de nommage.** Jusqu'ici une règle simple tenait : nom de formule = nom
de catégorie de club. Elle disait au visiteur quels clubs sa formule ouvre.
Platinium la casse : c'est une formule sans catégorie correspondante, et son nom
ne dit rien des clubs auxquels elle donne accès.

Trois options examinées, détail et recommandation dans la réponse à Hugo du
2026-09-15 :
1. le premier mot d'un nom de formule est toujours une catégorie de club, donc
   « Premium Platinum » et non « Platinium » seul. La règle survit, elle
   s'applique aux produits futurs, et Platinium reste vendable comme un niveau.
2. garder « Platinium » seul, et rendre la restriction explicite partout : une
   ligne « À souscrire dans l'un des 3 clubs Premium » sur la carte, et une
   mention dans le module Catégories qui dit que Platinium est une formule, pas
   une catégorie.
3. faire de Platinium une option de Premium plutôt qu'une formule. Écarté :
   Harmony veut un produit à vendre.

**Orthographe de Platinium.** Le mot n'existe ni en français (« platine ») ni en
anglais (« platinum »). Les autres noms du jeu sont anglophones : Gym,
Essential, Premium. « Platinum » serait la graphie cohérente. À trancher avec
Harmony : si le nom est déjà utilisé commercialement sous cette forme, il vaut
mieux le garder que d'avoir deux graphies en circulation.
