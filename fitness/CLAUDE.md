# Wireframes Harmony Fitness (mid-fidélité)

## Contexte

Refonte de fitness.harmony.ch, un des 5 sites de l'écosystème Harmony Groupe (mise en ligne avril 2027).
Ces wireframes servent de référence au designer UI (Christophe) et au développeur (Richard).
Consultant et décideur sur la structure : Hugo.

## Repo et hébergement

- Ce repo sert lab.harmony.ch. On travaille uniquement dans le dossier `fitness/`, publié sur lab.harmony.ch/fitness/.
- Ne jamais créer, modifier ou supprimer un fichier hors de `fitness/`. Si c'est nécessaire (config de déploiement, robots.txt), le proposer et attendre la validation.
- Tous les liens internes sont relatifs, pour marcher en local comme sur lab.harmony.ch/fitness/.
- Chaque page porte `<meta name="robots" content="noindex, nofollow">` : ces wireframes ne doivent jamais apparaître dans Google (le domaine harmony.ch porte le SEO du groupe).
- Travail sur la branche `fitness-v2`. Fusion dans la branche de déploiement seulement quand Hugo le demande.
- Un commit par tâche, message en français qui dit ce qui a été fait.

## Source de vérité

- `docs/cdc/B3-fitness.md` : site map, trames de pages et règles de Fitness. Ce fichier fait foi.
- `docs/cdc/07-modele-contenu.md` : collections Club, Produit, Extra, Cours, Coach.
- `docs/cdc/A-composants.md` : composants partagés.
- `docs/cdc/cours-collectifs.md` : nommage, objectifs, intensités et formats des cours. Fait foi sur ces listes dès qu'il est déposé.
- Ces fichiers sont dans `fitness/docs/cdc/` et en lecture seule. Ne jamais les modifier.
- `fitness/docs/` et ce fichier ne doivent jamais être publiés sur lab.harmony.ch (documents internes). Tous deux sont exclus dans `.github/workflows/deploy.yml`.
- Après chaque déploiement, relire le journal du workflow. Un fichier interne qui y apparaît en "Upload" est en ligne, et l'ajouter à la liste `exclude` ne le retire pas : FTP-Deploy-Action ignore les fichiers exclus des deux côtés, et le déploiement suivant réécrit l'état du serveur sans eux. Le fichier devient orphelin, présent sur le serveur et invisible pour le sync. Il faut alors le supprimer en FTPS, hors du déploiement. C'est arrivé une fois, le 2026-09-11, avec ce fichier.
- Ne jamais ajouter une page, un bloc ou une fonctionnalité absent de B.3.
- En cas de doute ou de contradiction entre deux sources : ne pas trancher. Ajouter la question dans `docs/questions.md`, poser un placeholder visible et continuer.

## Périmètre

- `/clubs` (hub) et `/clubs/[slug]` (gabarit club + variante Gym)
- `/tarifs` : état sans club et état `/tarifs/[slug]` avec club référent choisi
- `/offre-du-moment`
- `/seance-essai`
- `/nous-contacter` : formulaire unique de contact, ajouté le 2026-09-15 (Q37). Même gabarit que la séance d'essai, un autre motif.
- `/sport`, `/sport/plateau-fitness`, `/sport/cours-collectifs`, `/sport/small-group-training`, `/sport/coaching-personnel`
- `/cours/[...]` : gabarit unique, deux cas. Une fiche de cours, ou une page de famille qui active en plus le bloc "variantes".

Cours collectifs : 2 templates seulement, le hub et le gabarit cours. On maquette les gabarits, pas les ~34 pages.

## Fidélité attendue

- Niveaux de gris, une seule couleur d'accent réservée aux éléments cliquables
- Typo système, hiérarchie claire, vraies structures
- Images : blocs gris avec une légende ("Photo plateau musculation")
- Copy : celle de B.3 partout où B.3 la donne (H1, sous-titres, titles, libellés de boutons, mentions obligatoires). Pour le texte de remplissage que B.3 ne fournit pas (paragraphes de description, corps de FAQ, témoignages), lorem ipsum, à une longueur réaliste par rapport au vrai texte attendu.
- Donnée manquante (prix, adresse, nombre) : placeholder visible entre crochets, jamais du lorem ipsum et jamais une valeur inventée
- Exception au "jamais une valeur inventée" : les **séances du planning** sont un jeu de démonstration, inventé et assumé (décision Hugo, 2026-09-15). Un planning vide ne montre rien de ce que le gabarit doit faire, et il fausse tous les comptages qui en découlent. Le planning porte déjà sa mention "Planning type saisi au CMS. Mis à jour le [date]". La règle tient toujours pour un prix, une adresse ou un horaire d'ouverture, qui se lisent comme des faits.
- **Aucun cours orphelin** : un cours sans aucune séance est un cours que personne ne peut suivre. Il disparaît des filtres par formule et des comptages, mais reste au catalogue : c'est une incohérence visible. Chaque cours du catalogue a au moins une séance.
- Un cours collectif n'est jamais programmé dans un club Gym : ces clubs n'ont que des Small Group Training (B.3 > Variante Gym).
- Pas de design de marque, pas d'effets
- Chaque page en desktop (1280 px) et mobile (375 px), les deux sont obligatoires

## Technique

- HTML + CSS + Alpine.js, sans build. Doit s'ouvrir en local sans serveur et marcher tel quel sur lab.harmony.ch/fitness/.
- Alpine est une copie locale dans `fitness/assets/alpine.min.js`, pas un CDN : aucune page ne dépend du réseau. Version notée dans le commentaire du fichier qui l'appelle.
- Toutes les ressources partagées sont appelées avec un paramètre de version : `assets/wireframe.css?v=...`, `data/data.js?v=...`, `assets/components.js?v=...`, `assets/alpine.min.js?v=...`. **Bumper ce jeton dans toutes les pages dès qu'on touche à `assets/` ou à `data/`**, sinon le navigateur de Hugo continue de servir l'ancienne version et le correctif semble ne pas marcher. Format : date plus une lettre, `2026-09-14b`. Le jeton doit être identique sur toutes les pages.
- Arborescence qui reproduit le site map : `fitness/index.html`, `fitness/tarifs/index.html`, `fitness/clubs/index.html`, `fitness/clubs/club/index.html`, `fitness/sport/plateau-fitness/index.html`, etc. Les URL du lab se lisent comme celles du futur site.
- Pages à gabarit (club, état club de Tarifs, page cours) : un seul fichier, le paramètre dans l'URL. `tarifs/?club=geneve-la-praille` représente `/tarifs/geneve-la-praille`, `clubs/club/?club=meyrin` représente `/clubs/meyrin`, `cours/fiche/?cours=pilates` représente `/cours/pilates` (les pages cours sont à la racine du site, pas sous `/sport`). Le même paramètre accepte un cours ou une famille.
- Données dans `fitness/data/data.js` (objet global), qui reproduit le modèle CMS de la section 7 :
  clubs, produits (formules, offres, carnets), extras, cours, coachs.
- Aucune donnée en dur dans les pages : tout est lu depuis `data.js`. Si une info change, elle change partout.
- Composants partagés dans `fitness/components/`, styles dans `fitness/assets/`.
- `fitness/index.html` sert de sommaire du lab : liste des pages et des états à tester.
- Traçabilité : chaque bloc porte `data-spec="B.3 > Trame page club > 4"` (section et numéro du bloc dans B.3).
- Un sélecteur d'état visible en haut de chaque page (réservé au wireframe) pour tester : sans club / club Gym / club Essential / club Premium, tarif Adulte / Jeune, offre active ou non.

Mise en page des cartes produit
- 4 cartes par ligne sur la largeur d'une section, soit 290 px en 1280. La largeur se règle par la variable CSS `--cartes-par-ligne`, jamais carte par carte.
- Une section qui a moins de 4 cartes garde la même largeur et laisse le reste vide. Une carte fait la même taille d'une section à l'autre.
- Au-delà de 4 cartes, la grille passe à la ligne. Pas de slider sur une liste que B.3 veut indexable : catalogue de cours, membres d'une famille, liste des cours d'un club. B.3 est explicite, "un slider de 3 ou 4 cours phares peut s'ajouter au-dessus de la liste, jamais la remplacer".
- L'Extra n'est pas une carte produit : c'est une ligne pleine largeur, empilée. On ne compare pas un Extra à ses voisins.
- Chaque carte produit porte une photo d'illustration en tête, sur toute la largeur de la carte : elle humanise l'offre (décision Hugo, 2026-09-14, Q30). La légende est un champ du produit dans `data.js`, jamais écrite dans la page. L'Extra n'en a pas.
- Les prix s'alignent en bas de carte, d'une carte à l'autre. Tout ce qui suit la liste d'inclusion est enfermé dans `.produit__bas`, collé en pied : prix, total, bouton, trois éléments de hauteur constante. Les mentions de hauteur variable (campagne en cours, tarif de repli) restent **au-dessus** du prix, où elles l'annoncent. Sans ça, une liste d'inclusion plus longue que sa voisine décale le prix et la comparaison se fait mal.
- Un encadré qui n'est pas un produit (catégorie de club, engagement de réassurance, étape, zone du plateau) porte la classe `.bloc`, pas `.produit`. Il suit la grille de sa section (`grille--3`, `grille--2`) et occupe toute la largeur disponible : un bloc catégorie Gym fait la même largeur qu'un bloc « Nos engagements ». La largeur de carte produit est réservée aux produits.

## Règles métier (non négociables)

Clubs et catégories
- 10 clubs, noms et slugs exactement comme dans B.3 ("Genève · La Praille", `/clubs/geneve-la-praille`).
- Une seule graphie, **Gym**, jamais GYM en capitales (décision Hugo, 2026-09-15, Q34). Idem en club, dans l'appli et dans Echino.
- 3 catégories : Gym (Pâquis), Essential (Blandonnet, Eaux-Vives, Gland, Meyrin, Signy, Versoix), Premium (Denges, La Praille, Veyrier). Le mot est "catégorie".
- Accès : Premium couvre tous les clubs, Essential couvre Essential et Gym, Gym couvre Pâquis.
- La ligne d'accès d'une catégorie se dit avec "dès" : "Accessible dès la formule Essential". Une énumération ("avec les formules Essential et Premium") devient fausse dès qu'une formule s'ajoute, et il faut alors la corriger partout. Ce n'est pas théorique : la page Coaching personnel et le hub Sport disaient encore "Essential et Premium" un jour après la naissance de Premium Platinum (Q48).
- **La règle vaut pour toute ligne d'inclusion, pas seulement pour l'accès aux clubs**, et elle ne se saisit pas : `HF.vues.ligneInclusion(id)` la déduit des formules. Trois réponses possibles, "dans toutes les formules", "dès la formule X", ou "En Extra de votre abonnement" quand aucune formule ne la comprend. Une phrase écrite dans une page est une phrase que personne ne corrigera.
- Les prix dépendent de la catégorie, jamais du club.
- Listes de clubs groupées par canton, ordre alphabétique, catégorie affichée à côté du nom.
- Un regroupement géographique s'écrit toujours **"Canton de Genève"**, jamais "Genève" seul : Meyrin, Versoix et Blandonnet ne sont pas dans la ville de Genève (décision Hugo, 2026-09-15). Même formule pour les deux cantons, y compris dans les titres du hub : "Nos clubs dans le canton de Genève". Le nom d'une commune, lui, reste nu : "Genève · Pâquis".
- Exception : les `<title>` de B.3 gardent "à Genève et Vaud". Ce sont des titles SEO calés sur les requêtes, pas des regroupements.
- Carte d'un club Gym : le nombre de cours par semaine est remplacé par "Pas de cours collectifs · Small Group Training en Extra". La ligne n'est jamais masquée.

Page Tarifs
- Une page, deux états, même gabarit. `/tarifs/[slug]` = même page avec le club référent présélectionné.
- Club référent obligatoire pour souscrire (abonnement, offre, carnet).
- Sans club : tous les prix visibles, aucun bouton de souscription, ligne "Choisissez d'abord votre club pour souscrire."
- Choix du club intégré à la page : pas de pop-up, pas de géolocalisation. Desktop : liste à gauche, carte à droite. Mobile : pastilles par canton + bouton "Voir sur la carte" (plein écran).
- Grisé = un seul sens : "pas accessible depuis ce club". Les produits concernés sont regroupés en une ligne en fin de section ("Pas disponible depuis [club] : ... Pourquoi ?").
- Tarif par âge : Adulte (défaut), Ado · 16-18 ans, Jeune · 19-25 ans, Senior · 65 ans et +. Il ne grise jamais. Un produit sans ce tarif s'affiche au prix adulte avec "Pas de tarif [x], prix adulte". Tarifs réduits : Essential et Premium seulement.
- Ordre des sections : Offre du moment, Abonnements (Extras juste en dessous), Carnets d'entrées.
- Carte formule : accès en nombre de clubs (calculé depuis les données), ce qui est inclus, prix par mois, bouton "Choisir [formule]".
- La ligne d'accès porte **toujours un nombre**, y compris pour un seul club ("Accès à 1 club") : elle se lit de la même façon d'une formule à l'autre. Le détail des clubs est dans un point d'info à côté, au survol sur ordinateur et au toucher sur mobile (Q35).
- Le point d'info marche sans JavaScript : le déclencheur est un vrai `<button>`, le panneau s'ouvre en `:hover` et en `:focus-within`. Toucher ouvre, toucher ailleurs referme, le clavier y accède. Liste des clubs groupée par canton, comme partout ailleurs.
- Les lignes de cours disent **combien de cours différents** la formule ouvre, pas combien de séances : "Cours collectifs en salle : 25 cours", "Cours aquatiques : 4 cours". C'est ce qui sépare Essential de Premium quand les deux affichent juste "Cours collectifs". Le nombre est déduit des séances, jamais saisi ; quand il ne peut pas l'être, "[X] cours".
- 4 formules, dans l'ordre Gym, Essential, Premium, Premium Platinum. **Premium Platinum** (décision Harmony, 2026-09-15, Q33) : c'est Premium plus les Extras inclus.
- **Nommage des formules** (Q34) : le premier mot est toujours le nom d'une catégorie de club, il dit quels clubs la formule ouvre. Ce qui suit est le niveau. La règle passe à l'échelle : un niveau haut sur Essential s'appellerait "Essential quelque chose".
- Le niveau s'affiche en italique et dans `--niveau`, une teinte à part. Ni l'accent, réservé aux éléments cliquables, ni la couleur d'outillage : il faut qu'on ne prenne pas un niveau pour une catégorie de club. La coupure du nom se déduit du nom de la catégorie, il n'y a pas de champ en plus : un nom qui ne suit pas la règle s'affiche tel quel.
- Le niveau est mis en forme là où on lit le produit (titre de carte). Pas dans un libellé de bouton, ni dans une ligne de texte courant : on ne met pas de l'italique dans un bouton.
- Accès et souscription sont deux choses différentes. L'accès vient de la catégorie du produit : Premium Platinum donne accès aux 10 clubs, comme Premium. La souscription peut être restreinte par `souscriptionDepuis` : Premium Platinum ne se souscrit que depuis un club Premium. Depuis un club Essential ou Gym, sa carte n'apparaît pas, elle est regroupée dans la ligne "Pas disponible depuis [club]", jamais masquée en silence.
- La ligne d'inclusion "Extras" nomme ce qui est compris : le mot seul ne vend rien, ce sont les noms qui font la différence entre Premium et Premium Platinum. Les noms s'affichent en tags, les mêmes pastilles que sur les cartes de cours, pour garder une seule grammaire visuelle. Liste déduite du club référent quand il est choisi, sinon tous les Extras vendus en ligne. Au-delà de 4, on compte le reste ("et 2 autres") plutôt que d'allonger la carte sans fin. Les formules qui ne les incluent pas gardent "Extras : Non inclus", sans détail : c'est le contraste qui porte l'argument.
- Une formule qui porte `inclutExtras` fait passer les Extras **vendus en ligne** en "Inclus avec la formule [nom]", sans prix ni bouton. Les Extras vendus en club restent "Sur demande en club" : ils ne se vendent pas ici, donc ils ne peuvent pas être compris dans une formule. La règle se déduit du mode de vente, jamais d'une liste d'exceptions écrite à la main.
- Choisir une formule qui inclut les Extras vide les Extras déjà ajoutés et le dit dans la barre récap : on ne facture pas deux fois, et on ne vide pas en silence.
- Les cartes formule affichent les mêmes lignes d'inclusion, dans le même ordre, avec "Non inclus" quand la formule ne couvre pas la ligne. Une ligne n'est jamais retirée : les cartes restent comparables ligne à ligne. Pas de séances de coaching incluses en Gym.
- Deux engagements : "Sans engagement" et "12 mois", dans cet ordre, **"12 mois" présélectionné** : c'est l'offre mise en avant, et celle que les promotions remisent. Le défaut se lit dans `data.js` (`defaut: true`), jamais en dur dans un composant. Le sélecteur accepte 2 ou 3 valeurs sans que la carte formule change de forme : le nombre d'engagements se lit dans les données, jamais en dur dans la mise en page.
- Pas de pastille ni de pourcentage de remise sur l'engagement : les deux prix s'affichent, c'est tout. Le prix barré est réservé à une remise de l'offre du moment sur un produit existant.
- Extras vendus en ligne : prix + "Ajouter". Extras vendus en club : "Sur demande en club", sans prix ni bouton.
- Offres promo : durée aussi visible que le prix, "soit env. CHF X.– par mois".
- Deux choses différentes, à ne jamais confondre. Un produit de type "offre" est un produit promo dédié, avec son nom, sa durée et son prix. Une **promotion** est une remise appliquée à des produits qui existent déjà, abonnements ou carnets indifféremment : elle s'affiche en pastille et en prix barré sur la carte du produit (B.3 > Page Tarifs > trame > 3), elle ne crée pas de produit.
- La remise se saisit en pourcentage ou en montant. Le prix remisé est calculé depuis le prix catalogue, jamais saisi. Le prix barré est toujours là quand une remise s'applique, même si le prix catalogue est encore inconnu : c'est un emplacement à prévoir en front. Ordre : prix remisé, prix barré, unité.
- Deux pastilles au maximum sur la photo d'une carte produit, jamais plus : le pourcentage de remise à gauche, les jours restants à droite. Les jours restants viennent de la campagne qui remise le produit, ou de sa propre date de validité s'il est lui-même un produit promo daté.
- Le compteur de la section Offre du moment ne sert que quand la section n'a aucune carte, c'est à dire quand la campagne est une remise sur des produits qui vivent ailleurs dans la page. Sinon chaque carte porte déjà ses jours restants et le compteur ferait doublon.
- En production, ce sont les dates de validité qui décident de la promo en cours. Dans le lab, c'est le sélecteur d'état, pour qu'on puisse montrer les deux cas sans toucher aux données.
- La section "Offre du moment" existe dès qu'il y a l'un ou l'autre : un produit promo dédié, ou une promotion en cours. Un produit promo dédié s'y affiche en carte, puisqu'il n'existe nulle part ailleurs. Une promotion sur des produits existants s'y annonce en une ligne ("Jusqu'au [date] : [nom de la promo]") avec un lien d'ancre vers la section où le produit vit. **Jamais de carte dupliquée** : un produit, une carte, un bouton d'achat.
- Le compteur compte ce que la section montre en cartes, donc les offres dédiées. Quand il n'y en a pas, il compte la promotion, qui est alors la seule campagne. Jamais les deux à la fois : un compteur posé au-dessus de cartes qui n'ont pas cette échéance ment.
- Une promotion n'est annoncée que si au moins un de ses produits est accessible depuis le club choisi.
- Une promotion sur un abonnement porte **toujours sur le 12 mois seulement**, jamais sur le sans engagement (champ `engagements`, vide = tous les engagements, non utilisé sur les abonnements). Ce n'est pas une remise sur l'engagement, que B.3 interdit d'afficher : c'est une campagne datée qui se trouve limitée à un engagement. Sur l'engagement remisé : pastille pleine et prix barré. Sur l'autre : pastille en contour qui porte sa condition (« - 15% · 12 mois ») et ligne en retrait, mais pas de prix barré, puisque ce prix-là n'est pas remisé. Sans cette pastille, la campagne serait invisible pour qui bascule sur « Sans engagement » (Q31).
- Les libellés d'engagement affichés viennent toujours du référentiel, jamais écrits en dur : une troisième valeur doit suivre sans retoucher les composants.
- Barre récap **fixée en bas d'écran** dès qu'un produit est choisi, quel que soit son type : c'est le bouton de validation qui emmène à l'étape suivante. Libellé "Finaliser mon abonnement", sauf pour un carnet, qui s'achète et ne s'abonne pas : "Finaliser mon achat". Un espaceur de même hauteur rend au document la place qu'elle lui prend, pour que le pied de page reste atteignable.
- Choisir un abonnement emmène automatiquement à la section Extras (ancre `#extras`) : c'est la question qu'on se pose juste après avoir choisi sa formule. Un carnet ou une offre ne déplacent personne, ils n'ont pas d'Extras. Se désélectionner ne fait jamais bouger la page. Le défilement respecte le réglage système "réduire les animations" et se décale de la hauteur de la barre collante, sinon le titre visé passe dessous.
- Un composant collant rendu par `x-html` doit avoir un hôte en `display: contents` (classe `hote-collant`), sinon le conteneur fait exactement sa hauteur et `position: sticky` n'a aucune marge pour coller.
- Une seule barre collante en haut. Pas de barre d'ancres.
- Pas de cartes cadeaux.
- Une ligne discrète en fin de catalogue pour qui ne se reconnaît dans aucune formule : « Vous ne trouvez pas la formule qui vous convient ? », renvoi vers un formulaire de contact avec le club présélectionné (décision Hugo, 2026-09-15, Q37). Pas de cadre, pas de bouton, une ligne séparée par un filet : elle existe pour ceux qui en ont besoin, elle ne détourne pas de la souscription en ligne. Le lien porte `club`, `motif` et `source`, pour que la demande soit comptée comme une demande d'essai.

Cours
- Vocabulaire strict : "catégorie" est réservé aux clubs (Gym, Essential, Premium). Pour les cours on dit **objectif** (rangement), **famille** (discipline à variantes), **fiche** (un cours). Ne jamais écrire "catégorie de cours".
- Un cours porte un objectif principal, un objectif secondaire facultatif, une intensité (doux, modéré, intense) et un format (salle, aqua, petit groupe).
- Intensité et format s'affichent en **tag** sur les cartes et les fiches de cours : ce sont des valeurs fermées du référentiel, et ce sont elles que les filtres manipulent, donc le tag fait le lien entre ce qu'on a filtré et ce qu'on lit. Un tag porte toujours son mot, jamais une couleur ou une forme seule.
- L'objectif principal est un tag lui aussi, sauf dans le catalogue du hub où il est déjà le titre de la section : on ne répète pas sur chaque carte ce que le titre vient de dire. L'objectif secondaire est un tag en pointillés, il n'apparaît nulle part ailleurs.
- Les 6 objectifs sont du contenu, jamais du code. Leurs libellés seront validés par un test d'arborescence : les lire toujours dans `data.js`, ne jamais les écrire en dur.
- Hub des cours collectifs : filtres formule, club, objectif, intensité, format, plus une recherche par nom (décision Hugo, 2026-09-15, Q32).
- **L'accès aux cours est cumulatif**, comme l'accès aux clubs : un cours donné dans un club Essential est accessible avec la formule Premium. Le filtre du hub et le comptage des cartes formule suivent tous deux `categorie.couvre`, jamais la seule catégorie du club où le cours est donné. Le libellé le dit : "Avec la formule Premium", pas "Clubs Premium", qui ferait croire à un lieu.
- Le filtre formule commande la liste des clubs : choisir Premium ne laisse que les clubs Premium dans le menu suivant, et relâche un club devenu incompatible.
- Le catalogue du hub et les lignes de cours des cartes formule comptent **la même population** : cours non-Extra, variantes traitées en filtre exclues. Sinon la carte et le catalogue annoncent deux nombres différents pour la même chose.
- La recherche porte sur le nom du cours, celui de sa famille et celui de ses objectifs, sans casse ni accents : chercher "danse" doit sortir les cours rangés sous "Danser", même si aucun ne porte le mot dans son nom.
- Le champ de recherche est écrit en clair dans la page, jamais rendu par `x-html` : un composant re-rendu à chaque frappe ferait perdre le curseur.
- Une catégorie sans aucun cours collectif (Gym aujourd'hui) n'affiche pas un "aucun résultat" sec : elle explique pourquoi et renvoie vers les Small Group Training. Le cas est déduit des données, jamais écrit en dur : si Harmony ajoute des cours en Gym, le message disparaît tout seul.
- Rangement par objectif principal : catalogue du hub, bloc "cours du club" des pages club, filtres du planning. Un cours apparaît une seule fois, sous son objectif principal. L'objectif secondaire informe, il ne range jamais.
- Un membre de famille peut être rangé sous un autre objectif que sa famille. La page de famille n'est donc jamais filtrée par objectif.
- **Aucun bloc du hub ne liste les familles.** Une liste de quatre disciplines en section se lit comme l'inventaire de l'offre, quel que soit son titre : deux formulations ont été essayées, les deux donnaient la même impression fausse (Q40, puis Q46). Les pages de famille se trouvent depuis les cours qui en font partie : la mention « Famille Pilates » est un lien sur chaque carte du catalogue, et la famille est un cran du fil d'Ariane sur chaque fiche. Vingt-quatre cours y renvoient, contre quatre liens avant : c'est mieux maillé et ça ne promet rien.
- **Une carte qui mène quelque part est cliquable en entier ; une carte qui déclenche une action porte un bouton** (Hugo, 2026-09-16, Q47). Les cartes de cours mènent à une fiche : toute leur surface est cliquable, sans bouton. Les cartes produit de la page Tarifs déclenchent un choix : elles gardent « Choisir [formule] ». Pas de « Voir le cours » sur chaque carte : cinquante boutons entrent en concurrence avec les vraies actions de la page.
- La carte cliquable étire le lien du titre par-dessus elle (`.produit--lien`, `::after` en `inset: 0`), sans JavaScript : un seul lien dans l'arbre d'accessibilité, un vrai lien qui s'ouvre au clic du milieu, et 358 px de large à viser sur mobile au lieu d'un titre. Les liens à l'intérieur de la carte, comme la famille, repassent au-dessus par `z-index`. Contrepartie assumée : le texte de la carte n'est plus sélectionnable.
- La page de famille liste tous ses membres. Membre avec page dédiée : un lien vers sa fiche. Membre sans page : une section sur la page de famille, avec ancre.
- Chaque cours porte un champ `destination` résolu dans `data.js`, jamais une règle recalculée à l'affichage. Les composants lisent `cours.destination`.
- La règle d'exclusion Aqua vaut **aussi pour les légendes de photo et tout texte de remplissage** : Fitness ne dit jamais "natation" ni "bassin de natation" pour parler de son offre. On dit "cours aquatique". Le mot natation n'apparaît que dans la passerelle vers l'école de natation et dans la barre groupe, qui pointent vers l'autre site.
- **Un même nom peut porter plusieurs formes**, et ce n'est pas une erreur : Cross Training est une zone du plateau, un cours collectif et un Small Group Training (client, 2026-09-16, Q42). Les deux cours partagent une seule fiche, via le champ `memeFicheQue` : un format n'est jamais une page, et deux pages du même nom se cannibaliseraient. La fiche rassemble les créneaux des deux entrées.
- **Un club propose une forme ou l'autre, jamais les deux** : une même pratique est soit un cours collectif inclus, soit un Small Group Training payant, selon le club (client, 2026-09-16). C'est une règle de cohérence à vérifier dans les données, pas seulement une situation de fait. Deux cours vivent aujourd'hui sous les deux formes : Cross Training (cours collectif à Versoix, Extra à La Praille et Pâquis) et HIIT (cours collectif à Meyrin, Blandonnet, Eaux-Vives et Signy, Extra à La Praille).
- **Un cours n'est pas un cours collectif parce qu'il est saisi au planning** : Harmony a corrigé deux entrées le 2026-09-16, TRX Pilates et HIIT à La Praille, qui étaient en réalité des Small Group Training. Devant une liste de séances, demander la forme, pas seulement l'horaire.
- **Un Small Group Training est un cours collectif payant, et il vit dans le catalogue** (Hugo, 2026-09-16, Q45). Le cacher privait le visiteur d'une partie de l'offre de son club, et rendait introuvables des cours qui ont pourtant une fiche. Trois traitements sur la carte : inclus partout, rien de plus ; Extra partout, liseré + marqueur « Extra » + « En option de votre formule, pas inclus » ; Extra dans certains clubs seulement, la phrase sans le marqueur, sinon on fait fuir d'un cours inclus presque partout.
- **Ce qui est dans le catalogue n'est pas ce qui est compté dans une formule.** `nbCoursFormule` exclut les Extras, le compteur du hub les annonce à part (« 51 cours, dont 5 en Extra »). Une formule ne promet que ce qu'elle inclut.
- **Dès qu'un club ou une formule est filtré, la réponse se restreint à ce périmètre** : HIIT est « parfois » un Extra dans l'absolu, mais à Genève · La Praille il l'est toujours, et c'est ça qu'il faut dire à quelqu'un qui a choisi son club. `formeExtra(idCours, portee)`.
- **Une fiche partagée n'est qu'une carte dans le catalogue** : l'entrée qui porte `memeFicheQue` n'y est pas une entrée. En revanche les filtres club et format regardent les deux entrées, sinon HIIT disparaît dès qu'on filtre le club où il n'est donné qu'en Extra.
- **Un membre d'une famille peut être un Extra** : la famille dit la pratique, pas le mode d'accès. TRX Pilates reste dans la famille Pilates alors que c'est un Small Group Training. La page de famille le marque « Extra », sinon on le croit inclus comme ses voisins. Le catalogue des cours collectifs, lui, ne le liste pas.
- Quand une fiche mélange les deux, le tableau « Où le pratiquer » porte la mention Extra **club par club**, et une ligne le dit : « Inclus dans votre abonnement, sauf mention Extra ». Sinon le visiteur lit la même ligne pour deux réalités qui ne coûtent pas le même prix. La mention n'apparaît pas sur une fiche qui ne mélange rien.
- Conséquence pour le modèle : **le caractère Extra se juge sur la séance, pas sur le cours**. La même pratique est incluse à Meyrin et payante à Pâquis. Dans les maquettes, deux entrées portent la distinction ; au CMS, c'est une décision de modèle à trancher (Q36).
- **Un seul Extra pour tous les Small Group Training** (Hugo, 2026-09-16, Q43). L'Extra "Small Group Training" porte le prix et les clubs ; il s'ajoute à une formule et il est compris dans Premium Platinum. Les Small Group Training eux-mêmes sont des cours de format petit groupe, marqués `estExtra` et rattachés à cet Extra : **aucun n'a de prix à lui**. Sur la page Tarifs comme sur la fiche club, seul l'Extra s'affiche, jamais le détail des trainings : Pâquis propose "Small Group Training", pas "Cross Training".
- Là où l'Extra s'affiche (page Tarifs, fiche club), sa ligne **nomme les Small Group Training donnés dans ce club**, lus sur le planning, à la place d'une description générique. Le visiteur voit ce qu'il achète, et ça reste un seul produit. Sans club référent, la ligne nomme tous les trainings du catalogue.
- "Small Group Training" est le nom de l'Extra, donc **jamais celui d'un training**. Le hub liste les trainings, pas l'Extra : un Extra fourre-tout dans la liste ferait croire à une pratique de plus.
- Un club où une séance de Small Group Training est programmée est ajouté d'office aux clubs de l'Extra (dérivé dans `data.js`). Jamais l'inverse : un club peut vendre l'Extra sans séance encore au planning.
- **Une licence n'est pas un produit.** Hyrox et Les Mills sont des licences : le nom seul ne désigne rien et n'apparaît jamais comme nom de produit. Hyrox sert à deux produits distincts, le cours collectif "Les Mills Ceremony Hyrox" et le Small Group Training "Ceremony Hyrox Max" (client, 2026-09-16, Q42). Seule exception : un title SEO peut porter le nom de la licence, parce que c'est lui que les gens cherchent.
- Les Mills s'écrit en deux mots partout, noms de cours et slugs compris : "Les Mills Body Pump", `/cours/les-mills`.
- Le fil d'Ariane d'une fiche remonte vers le hub dont le cours relève : Small Group Training pour un cours en Extra, Cours collectifs pour les autres. Une fiche partagée reste sous Cours collectifs, puisque c'est sous cette forme qu'elle existe d'abord.
- H1 = le nom du cours ou de la famille, seul, sans mention géographique. Title = "Cours de [cours] à Genève et Vaud | Harmony", ou "[cours] à Genève et Vaud | Harmony" quand "cours de" sonne faux, ce qui est le cas des formats Les Mills. Aucune commune dans le title d'une fiche.

Header
- Menu à gauche, collé au logo. Les actions à droite, de la plus discrète à la plus engageante : "Se connecter", "Séance d'essai" en bouton secondaire, "S'abonner" en bouton principal vers `/tarifs` (décision Hugo, 2026-09-16, Q41).
- **"S'abonner", jamais "S'inscrire"** : c'est déjà le mot de la carte club et de la barre récap. B.3 tient à un seul mot par chose, et "s'inscrire" se dirait aussi d'une newsletter ou d'un cours.
- "Se connecter" ouvre l'espace membre, hébergé par l'outil métier. Son nom n'apparaît jamais, ni dans le libellé ni ailleurs.
- Mobile : le menu passe derrière un burger, non maquetté à ce stade. Restent le compte en icône seule et l'action principale ; la séance d'essai reste accessible par le CTA de chaque page.

Composants partagés
- Choix du club + carte : un seul composant pour /clubs, /tarifs, /offre-du-moment, /seance-essai.
- Repères de carte distingués par forme et lettre (G, E, P), avec légende. Jamais la couleur seule.

Contact
- Un seul canal écrit : le formulaire. Plus d'adresse e-mail affichée, ni sur les pages club ni dans le footer. Un e-mail ne se compte pas, ne présélectionne pas le club et ne se dispatche pas.
- **Le visiteur ne choisit pas son destinataire, il donne son sujet et son club.** Lui demander de trancher entre « Équipe Harmony » et dix clubs, c'est lui demander de connaître l'organisation d'Harmony. Chaque motif porte sa destination dans `data.js`, le destinataire est calculé et affiché sous le formulaire (« Votre message part à Harmony Meyrin ») : pas de surprise, et il peut corriger en changeant le sujet ou le club (Q38).
- Un motif qui part au club rend le champ club obligatoire. Le délai annoncé n'est jamais chiffré : « Nous vous répondons au plus vite. »
- Les champs d'un formulaire sont écrits en clair dans la page, jamais rendus par `x-html` : un composant re-rendu à chaque frappe ferait perdre le curseur. Seules la liste des motifs et la règle de routage sont partagées.
- Un `<select>` dont les options viennent d'un `x-for` se présélectionne avec `:selected` sur l'option, pas avec `x-model` : `x-model` s'applique avant que les options existent, et le menu reste vide alors que l'état est bon.

## Règles de copy

- Vouvoiement. Boutons à la première personne ("Choisir mon club").
- Jamais de tiret cadratin. Utiliser ":" ou ",".
- Registre simple : "pour", pas "afin de".
- Prix au format "CHF 89.–". Prix inconnus : "CHF XX.–". Ne jamais inventer un prix.
- Vocabulaire fixe : club (jamais "salle"), formule, Abonnements (titre de section), carnet d'entrées, Extra, offre du moment, club référent, tarif, catégorie.
- Le nom "Echino" n'apparaît jamais à l'écran.
- H1, sous-titres et titles : reprendre exactement ceux de B.3.
- Donnée inconnue : placeholder visible entre crochets, par exemple "[adresse]", "[X] séances", "[nom de l'application]".
- Texte rédigé mais pas encore validé par Harmony : affiché tel quel, avec le marqueur "à valider par Harmony". Ne pas le remplacer par un placeholder, le texte existe.

## Méthode de travail

1. Avant de coder une page : lister ses blocs (depuis B.3), ses états, les composants utilisés et les questions. Attendre la validation.
2. Construire les composants partagés avant les pages.
3. Après chaque page : relire la page contre B.3 et produire une checklist bloc par bloc (conforme / écart / question).
4. Une page par tâche. Ne pas retoucher une page validée sans le dire.
