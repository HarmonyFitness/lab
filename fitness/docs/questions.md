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
