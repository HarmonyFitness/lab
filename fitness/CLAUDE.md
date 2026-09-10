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
- `fitness/docs/` ne doit jamais être publié sur lab.harmony.ch (document interne). Vérifier comment le déploiement l'exclut, sinon le signaler avant tout commit.
- Ne jamais ajouter une page, un bloc ou une fonctionnalité absent de B.3.
- En cas de doute ou de contradiction entre deux sources : ne pas trancher. Ajouter la question dans `docs/questions.md`, poser un placeholder visible et continuer.

## Périmètre

- `/clubs` (hub) et `/clubs/[slug]` (gabarit club + variante GYM)
- `/tarifs` : état sans club et état `/tarifs/[slug]` avec club référent choisi
- `/offre-du-moment`
- `/seance-essai`
- `/sport`, `/sport/plateau-fitness`, `/sport/cours-collectifs` (+ un hub de catégorie + une fiche cours), `/sport/small-group-training` (+ une fiche), `/sport/coaching-personnel`

Cours collectifs : le volume de pages n'est pas tranché (voir "À réconcilier" dans B.3). On maquette les gabarits (hub, hub de catégorie, fiche), pas toutes les pages.

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
- Arborescence qui reproduit le site map : `fitness/index.html`, `fitness/tarifs/index.html`, `fitness/clubs/index.html`, `fitness/clubs/club/index.html`, `fitness/sport/plateau-fitness/index.html`, etc. Les URL du lab se lisent comme celles du futur site.
- Pages à gabarit (club, état club de Tarifs, fiche cours) : un seul fichier, le club passé en paramètre. `tarifs/?club=geneve-la-praille` représente `/tarifs/geneve-la-praille`, `clubs/club/?club=meyrin` représente `/clubs/meyrin`, `cours/fiche/?cours=yoga` représente `/cours/yoga` (la fiche cours est à la racine du site, pas sous `/sport`).
- Données dans `fitness/data/data.js` (objet global), qui reproduit le modèle CMS de la section 7 :
  clubs, produits (formules, offres, carnets), extras, cours, coachs.
- Aucune donnée en dur dans les pages : tout est lu depuis `data.js`. Si une info change, elle change partout.
- Composants partagés dans `fitness/components/`, styles dans `fitness/assets/`.
- `fitness/index.html` sert de sommaire du lab : liste des pages et des états à tester.
- Traçabilité : chaque bloc porte `data-spec="B.3 > Trame page club > 4"` (section et numéro du bloc dans B.3).
- Un sélecteur d'état visible en haut de chaque page (réservé au wireframe) pour tester : sans club / club GYM / club Essential / club Premium, tarif Adulte / Jeune, offre active ou non.

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
- Le sélecteur d'engagement accepte 2 ou 3 valeurs sans que la carte formule change de forme. Le nombre d'engagements se lit dans les données, jamais en dur dans la mise en page.
- Extras vendus en ligne : prix + "Ajouter". Extras vendus en club : "Sur demande en club", sans prix ni bouton.
- Offres promo : durée aussi visible que le prix, "soit env. CHF X.– par mois".
- Barre récap en bas d'écran quand un produit est choisi, bouton "Finaliser mon abonnement". Une seule barre collante en haut. Pas de barre d'ancres.
- Pas de cartes cadeaux.

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
