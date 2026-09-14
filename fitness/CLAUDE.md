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

- `/clubs` (hub) et `/clubs/[slug]` (gabarit club + variante GYM)
- `/tarifs` : état sans club et état `/tarifs/[slug]` avec club référent choisi
- `/offre-du-moment`
- `/seance-essai`
- `/sport`, `/sport/plateau-fitness`, `/sport/cours-collectifs`, `/sport/small-group-training`, `/sport/coaching-personnel`
- `/cours/[...]` : gabarit unique, deux cas. Une fiche de cours, ou une page de famille qui active en plus le bloc "variantes".

Cours collectifs : 2 templates seulement, le hub et le gabarit cours. On maquette les gabarits, pas les ~34 pages.

## Fidélité attendue

- Niveaux de gris, une seule couleur d'accent réservée aux éléments cliquables
- Typo système, hiérarchie claire, vraies structures
- Images : blocs gris avec une légende ("Photo plateau musculation")
- Copy : celle de B.3 partout où B.3 la donne (H1, sous-titres, titles, libellés de boutons, mentions obligatoires). Pour le texte de remplissage que B.3 ne fournit pas (paragraphes de description, corps de FAQ, témoignages), lorem ipsum, à une longueur réaliste par rapport au vrai texte attendu.
- Donnée manquante (prix, adresse, nombre) : placeholder visible entre crochets, jamais du lorem ipsum et jamais une valeur inventée
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
- Un sélecteur d'état visible en haut de chaque page (réservé au wireframe) pour tester : sans club / club GYM / club Essential / club Premium, tarif Adulte / Jeune, offre active ou non.

Mise en page des cartes produit
- 4 cartes par ligne sur la largeur d'une section, soit 290 px en 1280. La largeur se règle par la variable CSS `--cartes-par-ligne`, jamais carte par carte.
- Une section qui a moins de 4 cartes garde la même largeur et laisse le reste vide. Une carte fait la même taille d'une section à l'autre.
- Au-delà de 4 cartes, la grille passe à la ligne. Pas de slider sur une liste que B.3 veut indexable : catalogue de cours, membres d'une famille, liste des cours d'un club. B.3 est explicite, "un slider de 3 ou 4 cours phares peut s'ajouter au-dessus de la liste, jamais la remplacer".
- L'Extra n'est pas une carte produit : c'est une ligne pleine largeur, empilée. On ne compare pas un Extra à ses voisins.
- Chaque carte produit porte une photo d'illustration en tête, sur toute la largeur de la carte : elle humanise l'offre (décision Hugo, 2026-09-14, Q30). La légende est un champ du produit dans `data.js`, jamais écrite dans la page. L'Extra n'en a pas.
- Un encadré qui n'est pas un produit (catégorie de club, engagement de réassurance, étape, zone du plateau) porte la classe `.bloc`, pas `.produit`. Il suit la grille de sa section (`grille--3`, `grille--2`) et occupe toute la largeur disponible : un bloc catégorie GYM fait la même largeur qu'un bloc « Nos engagements ». La largeur de carte produit est réservée aux produits.

## Règles métier (non négociables)

Clubs et catégories
- 10 clubs, noms et slugs exactement comme dans B.3 ("Genève · La Praille", `/clubs/geneve-la-praille`).
- 3 catégories : GYM (Pâquis), Essential (Blandonnet, Eaux-Vives, Gland, Meyrin, Signy, Versoix), Premium (Denges, La Praille, Veyrier). Le mot est "catégorie".
- Accès : Premium couvre tous les clubs, Essential couvre Essential et GYM, GYM couvre Pâquis.
- Les prix dépendent de la catégorie, jamais du club.
- Listes de clubs groupées par canton (Genève, Vaud), ordre alphabétique, catégorie affichée à côté du nom.
- Carte d'un club GYM : le nombre de cours par semaine est remplacé par "Pas de cours collectifs · Small Group Training en Extra". La ligne n'est jamais masquée.

Page Tarifs
- Une page, deux états, même gabarit. `/tarifs/[slug]` = même page avec le club référent présélectionné.
- Club référent obligatoire pour souscrire (abonnement, offre, carnet).
- Sans club : tous les prix visibles, aucun bouton de souscription, ligne "Choisissez d'abord votre club pour souscrire."
- Choix du club intégré à la page : pas de pop-up, pas de géolocalisation. Desktop : liste à gauche, carte à droite. Mobile : pastilles par canton + bouton "Voir sur la carte" (plein écran).
- Grisé = un seul sens : "pas accessible depuis ce club". Les produits concernés sont regroupés en une ligne en fin de section ("Pas disponible depuis [club] : ... Pourquoi ?").
- Tarif par âge : Adulte (défaut), Ado · 16-18 ans, Jeune · 19-25 ans, Senior · 65 ans et +. Il ne grise jamais. Un produit sans ce tarif s'affiche au prix adulte avec "Pas de tarif [x], prix adulte". Tarifs réduits : Essential et Premium seulement.
- Ordre des sections : Offre du moment, Abonnements (Extras juste en dessous), Carnets d'entrées.
- Carte formule : accès en nombre de clubs (calculé depuis les données), ce qui est inclus, prix par mois, bouton "Choisir [formule]".
- Les 3 cartes formule affichent les mêmes lignes d'inclusion, dans le même ordre, avec "Non inclus" quand la formule ne couvre pas la ligne. Une ligne n'est jamais retirée : les cartes restent comparables ligne à ligne. Pas de séances de coaching incluses en GYM.
- Deux engagements : "Sans engagement" et "12 mois", dans cet ordre, "Sans engagement" présélectionné. Le sélecteur accepte 2 ou 3 valeurs sans que la carte formule change de forme : le nombre d'engagements se lit dans les données, jamais en dur dans la mise en page.
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
- Une promotion peut être conditionnée à un engagement (champ `engagements`, vide = tous). Ce n'est pas une remise sur l'engagement, que B.3 interdit d'afficher : c'est une campagne datée qui se trouve limitée à un engagement. Sur l'engagement remisé : pastille pleine et prix barré. Sur l'autre : pastille en contour qui porte sa condition (« - 15% · 12 mois ») et ligne en retrait, mais pas de prix barré, puisque ce prix-là n'est pas remisé. Sans cette pastille, la campagne serait invisible depuis « Sans engagement », qui est l'état par défaut (Q31).
- Les libellés d'engagement affichés viennent toujours du référentiel, jamais écrits en dur : une troisième valeur doit suivre sans retoucher les composants.
- Barre récap **fixée en bas d'écran** dès qu'un produit est choisi, quel que soit son type : c'est le bouton de validation qui emmène à l'étape suivante. Libellé "Finaliser mon abonnement", sauf pour un carnet, qui s'achète et ne s'abonne pas : "Finaliser mon achat". Un espaceur de même hauteur rend au document la place qu'elle lui prend, pour que le pied de page reste atteignable.
- Choisir un abonnement emmène automatiquement à la section Extras (ancre `#extras`) : c'est la question qu'on se pose juste après avoir choisi sa formule. Un carnet ou une offre ne déplacent personne, ils n'ont pas d'Extras. Se désélectionner ne fait jamais bouger la page. Le défilement respecte le réglage système "réduire les animations" et se décale de la hauteur de la barre collante, sinon le titre visé passe dessous.
- Un composant collant rendu par `x-html` doit avoir un hôte en `display: contents` (classe `hote-collant`), sinon le conteneur fait exactement sa hauteur et `position: sticky` n'a aucune marge pour coller.
- Une seule barre collante en haut. Pas de barre d'ancres.
- Pas de cartes cadeaux.

Cours
- Vocabulaire strict : "catégorie" est réservé aux clubs (GYM, Essential, Premium). Pour les cours on dit **objectif** (rangement), **famille** (discipline à variantes), **fiche** (un cours). Ne jamais écrire "catégorie de cours".
- Un cours porte un objectif principal, un objectif secondaire facultatif, une intensité (doux, modéré, intense) et un format (salle, aqua, petit groupe).
- Les 6 objectifs sont du contenu, jamais du code. Leurs libellés seront validés par un test d'arborescence : les lire toujours dans `data.js`, ne jamais les écrire en dur.
- Rangement par objectif principal : catalogue du hub, bloc "cours du club" des pages club, filtres du planning. Un cours apparaît une seule fois, sous son objectif principal. L'objectif secondaire informe, il ne range jamais.
- Un membre de famille peut être rangé sous un autre objectif que sa famille. La page de famille n'est donc jamais filtrée par objectif.
- La page de famille liste tous ses membres. Membre avec page dédiée : un lien vers sa fiche. Membre sans page : une section sur la page de famille, avec ancre.
- Chaque cours porte un champ `destination` résolu dans `data.js`, jamais une règle recalculée à l'affichage. Les composants lisent `cours.destination`.
- Les Mills s'écrit en deux mots partout, noms de cours et slugs compris : "Les Mills Body Pump", `/cours/les-mills`.
- H1 = le nom du cours ou de la famille, seul, sans mention géographique. Title = "Cours de [cours] à Genève et Vaud | Harmony", ou "[cours] à Genève et Vaud | Harmony" quand "cours de" sonne faux, ce qui est le cas des formats Les Mills. Aucune commune dans le title d'une fiche.

Composants partagés
- Choix du club + carte : un seul composant pour /clubs, /tarifs, /offre-du-moment, /seance-essai.
- Repères de carte distingués par forme et lettre (G, E, P), avec légende. Jamais la couleur seule.

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
