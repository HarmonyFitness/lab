# B.3 — fitness.harmony.ch

> Source : Notion, "B.3 — fitness.harmony.ch"
> (Livrables / Cahier des charges : Refonte digitale Harmony Groupe / Annexe B – Site maps et mapping fonctionnel par site).
> Export du 2026-09-10. Lecture seule : ne pas modifier ici, modifier dans Notion.

Site de marque, d'acquisition et d'orientation. Aucune transaction sur le site : les abonnements et les séances d'essai renvoient vers Echino, la réservation des soins bien-être vers l'outil du prestataire. Quatre entrées dans le header (Clubs, Sport, Bien-être, Tarifs) et un bouton « Séance d'essai », plus les pages « Besoin d'aide ? » et Actualités accessibles depuis le footer. Trois niveaux de navigation.

## Arborescence

```text
fitness.harmony.ch
│
├── [Barre groupe]  Harmony · Fitness · Arts martiaux · École de natation · Famille
│
├── Accueil  /
│
├── Clubs  /clubs
│   └── [10 pages club]  /clubs/[ville | ville-quartier]
│       (module « Catégories de clubs » : ancre /clubs#categories, pas de page dédiée)
│
├── Sport  /sport
│   ├── Plateau fitness  /sport/plateau-fitness
│   ├── Cours collectifs  /sport/cours-collectifs
│   │   ├── Cardio & renforcement       (hub catégorie)
│   │   ├── Yoga, Pilates & doux         (hub catégorie)
│   │   ├── LesMills                     (hub marque)
│   │   └── [9 fiches cours dédiées]  /cours/[cours]
│   ├── Small Group Training  /sport/small-group-training
│   │   └── [fiches Small Group Training]  /cours/[cours]
│   └── Coaching personnel  /sport/coaching-personnel
│
├── Bien-être  /bien-etre
│   ├── Espaces wellness  /bien-etre/espaces
│   └── Massage & physiothérapie  /bien-etre/soins
│
├── Tarifs  (menu déroulant)
│   ├── Tous les tarifs  /tarifs
│   │   └── [état club ×10]  /tarifs/[slug du club]  (canonical vers /tarifs, hors sitemap)
│   ├── Offre du moment  /offre-du-moment  (entrée masquée sans offre active)
│   └── Offre entreprise  /offre-entreprise  → renvoi corporate
│
├── [Bouton header]  Séance d'essai  /seance-essai
│
└── [Footer]  Besoin d'aide ? /aide   ·   Actualités /actualites   ·   Mentions légales   ·   Confidentialité
```

**Composants transverses :** témoignages, FAQ contextuelle (la FAQ complète vit sur la page « Besoin d'aide ? »).

**Contact :** coordonnées sur chaque page club + bloc contact du footer (e-mail en lien direct, téléphone). Pas de formulaire ni de page contact dans le header.

**Barre groupe :** libellés publics (Arts martiaux, École de natation) ; sous-domaines techniques inchangés (maa.harmony.ch, aqua.harmony.ch).

**Actualités :** flux propre à fitness.harmony.ch, alimenté par la collection unique du CMS partagé (voir B.1).

## Convention de nommage des clubs

Nom de page = ville seule, ou « Ville · Quartier » quand plusieurs clubs partagent la même ville (le cas ne se présente qu'à Genève). Chaque club a sa page, tous partagent le même gabarit.

| Club | Catégorie | Slug |
|---|---|---|
| Genève · Pâquis | GYM | `/clubs/geneve-paquis` |
| Genève · Eaux-Vives | Essential | `/clubs/geneve-eaux-vives` |
| Genève · La Praille | Premium | `/clubs/geneve-la-praille` |
| Blandonnet | Essential | `/clubs/blandonnet` |
| Meyrin | Essential | `/clubs/meyrin` |
| Versoix | Essential | `/clubs/versoix` |
| Gland | Essential | `/clubs/gland` |
| Signy | Essential | `/clubs/signy` |
| Veyrier | Premium | `/clubs/veyrier` |
| Denges | Premium | `/clubs/denges` |

## Accueil

**Rôle.** Porte d'entrée principale : oriente vite vers les trois actions clés (s'abonner, trouver un club, essayer) et condense les arguments de marque.

| Page | Slug | Intention | Composants clés |
|---|---|---|---|
| Accueil | `/` | Capter tous les profils et orienter vers s'abonner / trouver un club / essayer, tout en portant les arguments « pourquoi Harmony » | Hero + CTA primaire, module Catégories de clubs (version courte), aperçu carte clubs, teaser tarifs (lien /tarifs), bloc offre du moment (compteur), preuve sociale (témoignages), cours en avant, bloc bien-être, teaser actualités, newsletter |

## Tarifs et offres

**Rôle.** Le cœur de conversion du site. Menu « Tarifs » (Tous les tarifs, Offre du moment, Offre entreprise) et séance d'essai en bouton du header. Pages à la racine du site : pas de dossier /offres, qui n'aurait pas de page à lui. Pousse vers Echino depuis la page Tarifs et la page Offre du moment, et capte les indécis via la séance d'essai.

| Page | Slug | Intention | Composants clés |
|---|---|---|---|
| Tarifs | `/tarifs` (état club : `/tarifs/[slug du club]`) | Montrer tous les produits et leurs prix, puis faire souscrire depuis le club référent vers Echino. Seule page indexable pour les recherches de prix | Voir « Page Tarifs » ci-dessous : bloc club référent et tarif (liste par canton et carte), offre du moment, abonnements avec extras, carnets d'entrées, produits non disponibles regroupés, barre récap vers Echino (club référent, produit, tarif, extras). Club présélectionné quand on arrive d'une page club ou d'une carte de /clubs. Les prix dépendent de la catégorie, pas du club. Module Catégories de clubs (court), FAQ tarifs, réassurance, CTA essai |
| Offre du moment | `/offre-du-moment` | Landing des campagnes (SMA, emailing) : reprendre la promesse de la pub et faire souscrire l'offre en cours | Adresse stable, contenu qui change (H1 et title au nom de l'offre). Hero (nom, durée, prix, compteur), produits de l'offre (accès en nombre de clubs, « soit env. CHF X.– par mois »), choix du club référent (même composant que Tarifs, regroupe les offres non accessibles), bouton « Profiter de l'offre » vers Echino (lien paramétré), conditions, FAQ courte, lien « Voir tous nos tarifs ». Sans offre active : page conservée avec un message court et deux liens (tarifs, essai), entrée retirée du menu |
| Séance d'essai | `/seance-essai` | Générer des demandes de rappel pour un essai (pas une réservation ferme) | Accès par le bouton du header (hors menu) et les CTA essai. Formulaire demande de rappel (date indicative J+1 à J+14, club, motif, dispatch par club), réassurance, choix du club (même composant que Tarifs, libellé « Club où faire votre essai »), témoignages |
| Offre entreprise | `/offre-entreprise` | Orienter le B2B vers l'offre entreprise du corporate | Pitch B2B court, CTA sortant vers harmony.ch, relais du formulaire entreprise |

### Page Tarifs

Une seule page, deux états, un seul gabarit. `/tarifs` : aucun club choisi. `/tarifs/[slug du club]` (même slug que la page club, ex. `/tarifs/geneve-la-praille`) : la même page avec le club référent présélectionné. Choisir ou changer de club met à jour la page et l'URL sans rechargement. Chaque club est un vrai lien vers son état : tout marche même si le script plante.

**Club référent.** Terme utilisé en club et dans Echino : le club où l'on gère son abonnement et dont on suit l'actualité. Obligatoire pour souscrire un abonnement, une offre ou un carnet. Selon sa formule, on s'entraîne aussi dans d'autres clubs.

**Trame**

1. **Hero** : H1 « Tarifs Harmony Fitness » (état club : « Tarifs à [club] »), sous-titre « Le prix dépend des clubs que vous voulez fréquenter. »
2. **Club référent et tarif**, intégrés à la page (pas de pop-up, pas de géolocalisation). Ordinateur : liste des clubs groupée par canton (Genève, Vaud), ordre alphabétique, nom + catégorie + adresse + icônes des formats de cours, carte à droite, survol synchronisé entre liste et repère. Mobile : pastilles par canton (nom + catégorie) et bouton « Voir sur la carte » qui ouvre la carte en plein écran, mini-fiche au toucher d'un repère avec « Choisir ce club ». Sélecteur de tarif, Adulte par défaut, avec « Justificatif d'âge demandé en club. » Une fois le club choisi, le bloc se replie en une ligne : « Club référent : [club] · Tarif [x] · Modifier »
3. **Offre du moment** : produits promo dédiés. Durée aussi visible que le prix, accès en nombre de clubs, « soit env. CHF X.– par mois » (validé par Harmony, pas de prix barré sur une durée inhabituelle), compteur. Une remise sur un produit existant s'affiche en pastille + prix barré sur sa carte
4. **Abonnements** : sélecteur d'engagement, 3 formules dans l'ordre GYM, Essential, Premium. Carte : nom, accès en nombre de clubs, ce qui est inclus (plateau fitness, cours collectifs, aqua, séances de coaching), prix par mois en gros et total en dessous, bouton « Choisir [formule] ». Les **Extras** proposés dans le club juste en dessous, bouton « Ajouter ». Les Extras vendus en club (ex. séances de coaching en plus de celles incluses) s'affichent sans prix ni bouton, avec la mention « Sur demande en club » : on informe, on ne vend pas en ligne
5. **Carnets d'entrées** : filtres GYM / Essential / Premium sans club, seuls les carnets valables une fois le club choisi. Prix ramené à l'entrée. Bouton « Acheter ce carnet », direct vers Echino. Pas de cartes cadeaux
6. Module Catégories de clubs (court), réassurance, FAQ tarifs (engagement, frais d'inscription, résiliation, pause, accord parental pour les moins de 18 ans), CTA séance d'essai

**Règles**

- **Sans club** : tous les prix sont visibles, aucun bouton de souscription, une ligne « Choisissez d'abord votre club pour souscrire. » en tête de section. Pas de bouton désactivé
- **Grisé : un seul sens, « pas accessible depuis ce club ».** Un produit catégorisé est disponible quand sa catégorie couvre le club référent (Premium : tous les clubs, Essential : Essential et GYM, GYM : Pâquis). Extras et offres : disponibles s'ils sont proposés depuis ce club. Les produits non disponibles sont regroupés en une ligne en fin de section, « Pas disponible depuis [club] : … Pourquoi ? » (lien vers le module Catégories), texte à contraste normal
- **Tarif (âge) : ne grise jamais.** Un produit sans le tarif choisi s'affiche au prix adulte avec « Pas de tarif [x], prix adulte ». Aujourd'hui : tarifs Ado, Jeune et Senior sur Essential et Premium ; GYM, carnets et offres au tarif Adulte seulement (réglage par produit, voir section 7)
- **Accès** : « Accès au club Genève · Pâquis », « Accès à 7 clubs », « Accès aux 10 clubs ». Nombre calculé depuis le CMS, jamais saisi
- **Barre récap** en bas d'écran (abonnements et offres) dès qu'un produit est choisi : produit, engagement, tarif, extras, total par mois, bouton « Finaliser mon abonnement » vers Echino (lien paramétré). Le nom Echino n'apparaît jamais. Un extra qui n'est plus proposé après un changement de club est retiré avec un message
- **Une seule barre collante en haut** : « Choisir mon club », puis « Club référent : [club] · Modifier ». Pas de barre d'ancres
- **Carte** : même composant que /clubs. Chargée quand elle devient visible (ordinateur) ou à l'ouverture (mobile). Compatible avec le bandeau cookies : fournisseur sans cookie de suivi, ou liste en repli avec un message clair. Repères distingués par forme et lettre (GYM, Essential, Premium) avec légende. Sur mobile, le bouton retour ferme la carte
- **Paramètre de campagne** : `?tarif=jeune` présélectionne le tarif (exception à B.1, sans effet SEO)
- **Copy** : vouvoiement, boutons à la première personne (« Choisir mon club »), un seul format de prix (« CHF 89.– »). Vocabulaire : club (jamais salle), formule, Abonnements (titre de section), carnet d'entrées, Extra, offre du moment, club référent, tarif

**Tarifs par âge** (harmonisés, MAA à traiter à part) : Adulte, Ado · 16-18 ans, Jeune · 19-25 ans, Senior · 65 ans et +. L'âge est toujours affiché à côté du nom. Remplacent Full Access, Young (16-18 ans), Young (19-25 ans), Senior (+65 ans). Âge déclaré dans Echino, vérifié en club.

**SEO** : `/tarifs` est la seule page indexable, avec tout le catalogue en HTML. Les états `/tarifs/[slug du club]` ont un canonical vers `/tarifs` et sortent du sitemap XML (pas de noindex en plus). Title type « Tarifs et abonnements fitness à Genève et Vaud | Harmony », à valider avec la Search Console et les termes de recherche Google Ads. 301 depuis l'actuelle page tarifs. Les recherches de prix locales sont captées par les pages club (bloc « Formules et extras »).

## Clubs

**Rôle.** Moteur d'acquisition locale et de SEO géolocalisé. La page club est le point de rencontre entre la recherche de planning et la recherche de cours (voir « Cours collectifs : nommage, architecture et enjeux web »).

| Page | Slug | Intention | Composants clés |
|---|---|---|---|
| Clubs (hub) | `/clubs` | Trouver le bon club en quelques secondes et savoir avec quelle formule y aller, point d'entrée du SEO local | Liste groupée par canton (Genève, Vaud) en HTML et carte, même composant que Tarifs (carte à droite sur ordinateur, bouton « Voir sur la carte » sur mobile). Pas de géolocalisation ni de recherche : 10 clubs, zone de chalandise restreinte, et on choisit souvent un club près de son travail plutôt que de chez soi. Filtres (Ma formule, Équipements, Un cours précis), cartes club cliquables (nom, badge catégorie, adresse, atouts, nombre de cours par semaine, ligne d'accès, « Tarif adulte dès CHF X.– / mois », bouton « S'abonner », lien Planning, voir « Carte club » ci-dessous), module Catégories de clubs (#categories), FAQ courte, CTA essai |
| Page club (gabarit ×10) | `/clubs/[ville \| ville-quartier]` | Servir le membre qui cherche son planning, convertir le prospect local, cibler « salle fitness [quartier] » | Voir « Trame de la page club » ci-dessous : hero avec badge catégorie et ligne d'accès, barre rapide, infos pratiques, planning HTML filtrable (saisi au CMS, voir principe de découplage en 8.2), cours du club cliquables vers leurs fiches, équipements, bien-être, passerelle école de natation, galerie, coachs, témoignages, offre du moment, FAQ locale, clubs à proximité, CTA paramétrés |

### Catégories de clubs

Le mot retenu est « catégorie », sur le site, dans le CMS et dans les documents. Trois catégories : GYM, Essential, Premium. Les noms ne sont pas traduits. Chaque formule donne accès à une catégorie et à celles qu'elle inclut.

| Catégorie | Promesse | Socle garanti dans chaque club | Ligne d'accès affichée |
|---|---|---|---|
| GYM | Un plateau fitness complet, accessible sur une plage horaire plus large | Plateau fitness complet, horaires élargis. Pas de cours collectifs (des Small Group Training y sont proposés en extra) | « Accessible avec toutes nos formules » |
| Essential | À compléter | Club 4 étoiles fitness-guide.ch, cours collectifs en salle | « Accessible avec les formules Essential et Premium » |
| Premium | À compléter | Définition : club 5 étoiles fitness-guide.ch ET cours aquatiques en piscine. Plus les cours collectifs en salle | « Accessible avec la formule Premium » |

**Règles d'affichage**

- Le badge (« Club GYM », « Club Essential », « Club Premium ») est toujours accompagné de sa ligne d'accès : c'est elle qui répond à la question du visiteur. Il est cliquable : panneau court avec la promesse de la catégorie et lien vers /clubs#categories. La distinction visuelle ne repose pas uniquement sur la couleur.
- Les étoiles fitness-guide.ch servent uniquement à définir et différencier Essential et Premium, dans le module ci-dessous. Essential = 4 étoiles, Premium = 5 étoiles. Elles n'apparaissent ni sur les cartes club ni sur les pages club.
- GYM est un concept, pas un premier niveau : le vocabulaire évite toute idée de hiérarchie (niveau, gamme). Comme Essential inclut GYM, GYM est aussi un argument de vente pour Essential.
- Une seule graphie, GYM, identique en club, dans l'appli et sur le site.
- Recommandé : nom de formule = nom de catégorie (« formule Premium »), sans le préfixe « Accès ».
- Accès : la formule Premium inclut Essential et GYM, la formule Essential inclut GYM.
- Extras : les Small Group Training et les services (linge…) ne sont inclus dans aucune formule. Chaque Small Group Training est un extra à part, et l'offre varie selon les clubs (Hyrox ne sera pas partout). Un seul mot, « Extra », identique en club, dans l'appli, sur le site et dans Echino.
- Coaching personnel : des séances sont incluses dans les formules Essential et Premium (nombre à compléter). Les séances en plus sont un Extra vendu en club uniquement.

**Module « Catégories de clubs » (pas de page dédiée)**

Saisi une fois dans le CMS, affiché sur /clubs (ancre #categories), sur /tarifs, et en version courte sur l'accueil. Contenu : promesse de chaque catégorie, socle garanti, formule d'accès, ligne repliable « Comment on classe Essential et Premium » (label fitness-guide.ch + lien externe). Pas de page /clubs/categories : aucune demande de recherche propre, et une page de plus dupliquerait l'explication déjà présente sur Tarifs.

### Carte club (liste /clubs)

- Toute la carte est cliquable vers la page club : pas de bouton « Voir le club ».
- Un seul bouton, « S'abonner », qui ouvre `/tarifs/[slug du club]` avec le club référent présélectionné. À côté : « Tarif adulte dès CHF X.– / mois », prix de la formule la moins chère qui donne accès au club, au tarif Adulte (sinon « dès » afficherait le prix Jeune).
- Un lien texte « Planning » vers le planning de la page club (ancre).
- Accessibilité : le lien principal est porté par le nom du club et étendu à toute la carte, les boutons passent au-dessus. Pas de liens imbriqués.
- Suivi : un paramètre de source (liste /clubs ou page club) accompagne « S'abonner » jusqu'au lien Echino, pour mesurer l'usage du raccourci.

### Fiche club dans le CMS

Chaque club est un objet de données, pas une page rédigée à la main : une saisie, plusieurs affichages.

| Donnée | Où elle ressort |
|---|---|
| Catégorie | Badge, marqueur carte, filtre « Ma formule », produits accessibles sur la page Tarifs, nombre de clubs affiché sur chaque formule, lien Echino paramétré, module Catégories de clubs |
| Équipements (liste fermée, cases à cocher) | Icônes page club, filtres /clubs, tableau /bien-etre/espaces |
| Horaires (dont jours fériés) | « Ouvert aujourd'hui jusqu'à … », infos pratiques, données structurées |
| Séances | Planning club, « où pratiquer » sur les fiches cours, filtre cours sur /clubs, nombre de cours par semaine |
| Coordonnées + GPS | Infos pratiques, carte, fiche Google, données structurées |
| Clubs à proximité | Bloc en bas de page club |
| Extras proposés dans le club (pas saisis ici : lus sur chaque Extra, qui porte ses clubs, voir section 7) | Bloc « Formules et extras » de la page club, extras de la page Tarifs, marqueur « Extra » au planning, fiches cours des Small Group Training |

La liste d'équipements est fermée : sinon un manager écrit « Sauna », un autre « sauna finlandais », et les filtres ne marchent plus.

### Fiche coach dans le CMS

Les coachs sont référencés une seule fois dans le back-office de `harmony.ch`, avec une ou plusieurs verticales attribuées et un ou plusieurs lieux (clubs, bassins, centre MAA). Un même coach peut donc apparaître sur Fitness, l'école de natation et Arts martiaux. Il n'apparaît pas sur le site corporate, qui sert uniquement à orienter. Sur Fitness, la même donnée alimente le bloc équipe des pages club, la grille de /sport/coaching-personnel et les « coachs associés » des fiches cours.

| Champ | Règle |
|---|---|
| Prénom | Prénom seul |
| Photo | Obligatoire pour apparaître sur le site, cadrage homogène (shooting commun recommandé) |
| Badges | 3 maximum, liste fermée alignée sur les familles de cours (Pilates, Yoga, Les Mills, Aqua, Small Group Training…), plus « Coach personnel » si la personne fait du coaching individuel. Les badges sont rangés par verticale : chaque site n'affiche que les siens (un coach aquagym et natation affiche « Aqua » sur Fitness et « Natation » sur l'école de natation) |
| Verticales et lieux | Plusieurs possibles. La verticale décide du site, le lieu décide de la page club où le coach apparaît |
| Phrase de présentation | Une ligne, affichée au clic |

Points d'attention : consentement écrit pour la photo, et retrait sous une semaine quand un coach quitte le club. Pas de coach affiché sur les séances au lancement (maintenance trop lourde en saisie manuelle), à envisager en V2 avec l'API Echino. Le partage d'une collection entre sites est déjà un point ouvert du devis développement : les coachs s'y ajoutent aux actualités. Process à caler : qui signale les arrivées et départs (le manager du club), qui met à jour le back-office.

### Trame de la page club

Principe : l'utile d'abord, la conviction ensuite. Une grande partie des visiteurs arrive via « Harmony [club] planning » : ce sont surtout des membres, ils doivent trouver planning et horaires sans scroller.

1. **Hero** : H1 « Harmony [club] », sous-titre avec « salle de sport », badge catégorie + ligne d'accès, CTA « S'abonner » avec « Tarif adulte dès CHF X.– / mois » (vers `/tarifs/[slug du club]`, club référent présélectionné) et « Demander une séance d'essai » (demande de rappel, pas une réservation)
2. **Barre rapide** : Planning, Horaires, Itinéraire, Appeler, « Ouvert aujourd'hui jusqu'à … ». Fixe en bas d'écran sur mobile
3. **Infos pratiques** : adresse, horaires et jours fériés, transports, parking, téléphone, e-mail. Identiques à la fiche Google
4. **Planning HTML** : filtres jour, objectif, intensité, format (salle, aqua, petit groupe : seuls les formats présents dans le club s'affichent, aqua uniquement en Premium), ouvert sur le jour en cours, date de dernière mise à jour. Chaque séance renvoie à la fiche du cours. Les séances de Small Group Training portent un marqueur « Extra », pour ne jamais les confondre avec les cours inclus
5. **Les cours du club** : liste compacte rangée par les 6 objectifs, chaque cours cliquable vers sa fiche (`/cours/[cours]`). Texte stable et indexable, c'est lui qui capte « [cours] [commune] ». Un slider de 3 ou 4 cours phares peut s'ajouter au-dessus de la liste, jamais la remplacer
6. **Formules et extras du club** : les formules qui donnent accès au club (accès en nombre de clubs, « Tarif adulte dès CHF X.– / mois »), puis les Small Group Training et services proposés dans ce club, avec « Extra » et leur prix, lien vers la fiche du Small Group Training. Lien « Voir les tarifs » vers `/tarifs/[slug du club]`. Partie extras masquée si le club n'a aucun extra
7. **L'équipe du club** : grille des coachs du club, photo + prénom + badges. Chaque badge renvoie à la fiche ou à la page famille du cours. Au clic : panneau court (phrase de présentation, clubs où le coach intervient, lien coaching personnel si badge). Pas de page coach dédiée au lancement. Option : le manager du club en tête de grille. Texte alternatif des photos : « [Prénom], coach [discipline] à [club] »
8. **Équipements** : socle de la catégorie + « En plus à [club] »
9. **Bien-être** : espaces du club, liens vers /bien-etre
10. **Passerelle école de natation** (clubs avec bassin) : une carte, un lien vers la page du lieu sur le site de l'école de natation, aucun contenu natation sur la page fitness. Aquagym et aquabike restent au planning fitness
11. **Galerie, témoignages**
12. **Offre du moment** : les offres en cours accessibles depuis ce club, bloc masqué s'il n'y en a aucune
13. **FAQ locale** : parking, vestiaires, enfants, piscine
14. **Clubs à proximité** : 2 ou 3 clubs avec leur catégorie (maillage, et alternative si la catégorie dépasse le budget)
15. **CTA final** : tarifs + essai

**Variante GYM.** Le hero met en avant les horaires élargis. Pas de cours collectifs inclus : le planning (bloc 4) n'affiche que les Small Group Training, marqués « Extra », et le bloc 5 est remplacé par le bloc Extras. Passerelle secondaire : « Envie de cours collectifs ? Ils sont inclus dès la formule Essential. »

**Destination des cours.** Chaque cours du planning a une destination : sa fiche, la page de famille avec ancre sur la bonne section pour une variante, la page mère pour un niveau ou un format. Champ « destination » à prévoir par cours dans le CMS.

### SEO des pages clubs

- **Hub /clubs** : liste des clubs en HTML, pas seulement dans la carte, groupée par canton (« Nos clubs à Genève », « Nos clubs dans le canton de Vaud »). Données structurées ItemList.
- **Page club** : H1 = marque + commune, requête générique dans le title (« Salle de sport à [commune] … | Harmony [club] ») et le sous-titre. 200 à 300 mots écrits pour chaque club, pas le même texte avec le nom changé. Données structurées HealthClub (adresse, GPS, horaires, équipements) + fil d'Ariane.
- **Fiche Google Business** de chaque club pointée vers sa nouvelle page (avec UTM), coordonnées strictement identiques.
- **Redirections** : chaque URL club actuelle redirige en 301 vers sa page club, pas vers le hub. Ces URL portent la position 1 sur les recherches de planning (voir 10.6).
- **Pas de pages cours × club au lancement** (`/clubs/[club]/[cours]`) : le croisement est capté par le planning et la liste des cours du club. À rouvrir après le lancement selon la Search Console.

## Sport

**Rôle.** Présente l'offre sportive et alimente le SEO par type de pratique. Les pages suivent l'ordre de ce qui est inclus : plateau fitness (toutes les formules), cours collectifs (dès Essential), Small Group Training (Extra payant), coaching personnel (séances incluses en Essential et Premium). GYM n'est plus une verticale : c'est une catégorie de club (voir Clubs).

| Page | Slug | Intention | Composants clés |
|---|---|---|---|
| Sport (hub) | `/sport` | Présenter l'offre sportive et router vers les 3 piliers | Blocs vers plateau fitness, cours collectifs, Small Group Training et coaching personnel (dans cet ordre, avec ce que chaque formule inclut), teaser planning, CTA essai |
| Cours collectifs (hub) | `/sport/cours-collectifs` | Présenter les cours, montrer le planning, nourrir le SEO | Catalogue par catégorie, filtres (club, type, intensité), planning type filtrable (saisi au CMS), CTA essai, témoignages |
| Hub Cardio & renforcement | `/sport/cours-collectifs/cardio-renforcement` | Page SEO de catégorie, regrouper les cours cardio et renfo | Description catégorie, liste des cours liés, clubs concernés, CTA essai |
| Hub Yoga, Pilates & doux | `/sport/cours-collectifs/yoga-pilates-doux` | Page SEO de catégorie, regrouper les cours doux et corps-esprit | Description catégorie, liste des cours liés, passerelle vers Bien-être, CTA essai |
| Hub LesMills | `/sport/cours-collectifs/lesmills` | Hub de marque transverse, argument commercial et SEO | Présentation LesMills, programmes proposés, clubs concernés, CTA essai |
| Fiches cours dédiées (1 gabarit, 9 pages) | `/cours/[cours]` | Page SEO par type de cours, convertir | Description + bénéfices, niveau/intensité, clubs qui le proposent + créneaux, coachs associés, CTA essai et lien vers /tarifs, FAQ intégrée. Pour un Small Group Training : mention « Extra », clubs où il est proposé et prix, lus sur l'Extra dans le CMS (une seule saisie) |
| Plateau fitness | `/sport/plateau-fitness` | Présenter le cœur de l'offre, inclus dans toutes les formules et promesse de la catégorie GYM. SEO musculation et cardio | Présentation des zones (musculation, cardio, fonctionnel, cross training), matériel, photos, renvoi vers le bloc Équipements de chaque page club, lien vers /tarifs, CTA essai. Remplace la page Équipement : « équipements » ne garde qu'un sens, la liste fermée de la fiche club |
| Small Group Training (hub) | `/sport/small-group-training` | Présenter l'entraînement en petit groupe, payant en Extra, et capter les recherches type « hyrox genève » | Principe (un coach, quelques personnes), mention « Extra » bien visible, liste des Small Group Training avec les clubs où ils sont proposés et leur prix (lus sur l'Extra), liens vers leurs fiches `/cours/[cours]`, lien vers /tarifs, CTA essai. S'il n'y a qu'un Small Group Training au lancement, le hub peut attendre : sa fiche suffit |
| Coaching personnel | `/sport/coaching-personnel` | Mettre en valeur l'accompagnement Harmony : les coachs, les programmes, l'application de suivi | Voir « Page Coaching personnel » ci-dessous |

### Titres de la branche Sport

Le menu utilise le vocabulaire Harmony, le title les mots que les gens cherchent. Titles à valider avec la Search Console et les termes de recherche Google Ads avant la mise en ligne.

| Page | H1 (+ sous-titre) | Title |
|---|---|---|
| Sport | Le sport chez Harmony | Musculation, cours collectifs et coaching \| Harmony |
| Plateau fitness | Plateau fitness : musculation, cardio et fonctionnel | Salle de musculation à Genève et Vaud \| Harmony |
| Cours collectifs | Cours collectifs (+ « Inclus dès la formule Essential ») | Cours collectifs fitness à Genève et Vaud \| Harmony |
| Small Group Training | Small Group Training : l'entraînement en petit groupe (+ « Un coach pour quelques personnes, en Extra de votre abonnement. ») | Small Group Training et Hyrox à Genève \| Harmony (Hyrox seulement s'il est proposé au lancement) |
| Coaching personnel | Coaching personnel : un coach et un programme pour vous (+ « Des séances incluses dans les formules Essential et Premium, un suivi dans l'application [nom]. ») | Coach sportif à Genève et Vaud \| Harmony |

Slug du plateau : `/sport/plateau-fitness` par défaut, `/sport/musculation` si les données de recherche le justifient. Traductions : « Small Group Training » reste en anglais dans toutes les langues ; en allemand, le coaching personnel se dit « Personal Training ».

### Page Coaching personnel

Objectif : montrer que l'abonnement Harmony, c'est aussi un accompagnement. On ne vend rien en ligne ici : les séances incluses font partie des formules, les séances en plus se prennent en club.

1. **Hero** : H1, sous-titre, CTA « Voir les formules » (/tarifs) et « Demander une séance d'essai »
2. **Comment ça marche** : bilan avec un coach, programme personnalisé, suivi dans l'application. Ce qui est inclus : [X] séances dans les formules Essential et Premium. Envie de plus : séances supplémentaires en Extra, sur demande en club
3. **Les programmes** : par objectif (liste à fournir par Harmony), chacun avec sa durée, son rythme et pour qui il est fait
4. **L'application de suivi** : ce qu'elle permet (programme, séances, progrès), captures d'écran, liens vers les stores. Nom et fonctionnalités à compléter
5. **Les coachs** : grille filtrable par club et spécialité (composant Personne, badge « Coach personnel »)
6. **Témoignages** : idéalement avec un résultat concret, accord écrit du membre
7. **FAQ** : combien de séances incluses, comment les réserver, changer de coach, séances en plus, et la formule GYM (séances non incluses, à confirmer)
8. **CTA final** : tarifs + essai

## Cours collectifs : périmètre et pages retenues

La famille cours collectifs repose sur **3 templates** à développer, déclinés en **13 pages**. Le nombre de hubs ou de fiches ne multiplie pas les templates : un même modèle est réutilisé.

| Template à développer | Réutilisé pour | Pages |
|---|---|---|
| Hub global cours collectifs | `/sport/cours-collectifs/` | 1 |
| Hub de catégorie | Cardio & renforcement, Yoga/Pilates/doux, LesMills | 3 |
| Fiche cours | les 9 cours retenus ci-dessous | 9 |

**Pages cours dédiées au lancement : 9.** Critères de sélection : cours cherché par son nom sur Google, marque forte, absence de doublon. Tous les autres cours vivent en fiche riche dans leur hub de catégorie (présents au planning et aux filtres) et peuvent être promus en page dédiée plus tard sans refonte.

**Slugs.** Les fiches cours sont en `/cours/[cours]` : plus court, reprend le mot tapé, même chemin que le site actuel (redirections simplifiées). Le fil d'Ariane garde Sport > Cours collectifs > [cours].

**À réconcilier.** Cette section date de juillet. Le document « Cours collectifs : nommage, architecture et enjeux web » (septembre) pose une autre logique : chaque cours garde sa fiche, pages de famille pour les disciplines à variantes, variante en page dédiée si elle coche 2 critères sur 3, soit une trentaine de pages. Périmètre, volume et slugs des hubs à trancher avant le devis final.

| Cours | Type | Note |
|---|---|---|
| Yoga | Générique | Page ombrelle : absorbe Hatha, Vinyasa, Yoga Dos, Thérapeutique, Air Yoga |
| Pilates | Générique | Page ombrelle : absorbe les 7 variantes (Avancé, Gym Dos, Privilège, Stretching, Swiss Ball, TRX) |
| Indoor Cycling (RPM) | Générique | Cible « indoor cycling », présente RPM comme le format LesMills |
| HIIT | Générique | Terme très recherché |
| Cross Training | Générique | Terme très recherché |
| Zumba | Grand public | Marque reconnue du grand public |
| LesMills Body Pump | Flagship LesMills | Aussi listé dans les hubs Cardio et LesMills |
| LesMills Body Combat | Flagship LesMills | Format fitness, distinct de la verticale MAA |
| Hybrid Training by Harmony | Signature Harmony | Page de marque, cours différenciateur |

## Bien-être

**Rôle.** Incarne la dimension bien-être de la marque, signature « Espaces de sport et de bien-être ». Vitrine : la réservation des soins reste externalisée.

| Page | Slug | Intention | Composants clés |
|---|---|---|---|
| Bien-être (hub) | `/bien-etre` | Porter la vision bien-être et router vers espaces et soins | Storytelling bien-être, blocs vers espaces / soins, clubs concernés (surtout Premium), CTA |
| Espaces wellness | `/bien-etre/espaces` | Présenter sauna, hammam, jacuzzi, jets massants et leur répartition par club | Présentation des espaces, tableau de disponibilité par club, galerie, renvoi pages club |
| Massage & physiothérapie | `/bien-etre/soins` | Vitrine des soins, orienter vers la réservation externe | Présentation des soins, praticiens, tarifs indicatifs, CTA sortant vers l'outil de réservation (paramétré si possible) |

## Actualités, Besoin d'aide ? & pages légales

**Rôle.** Actualités : flux propre à Fitness pour nourrir le SEO avec du contenu frais. Besoin d'aide : self-service d'abord, la FAQ absorbe le gros des questions, le contact humain reste en dernier recours. Ces pages sont accessibles depuis le footer uniquement, pas dans le header.

| Page | Slug | Intention | Composants clés |
|---|---|---|---|
| Actualités | `/actualites` | Nourrir le SEO avec du contenu frais propre à Fitness (vie des clubs, nouveaux cours, événements) | Liste des articles tagués Fitness, provenant de la collection unique du CMS partagé (voir B.1). Teaser en page d'accueil |
| Besoin d'aide ? | `/aide` | Résoudre en autonomie puis router vers le bon canal : FAQ complète, contact local via les pages clubs, formulaire général en dernier recours | FAQ complète par catégories, renvoi vers les pages clubs (coordonnées), formulaire de contact général en bas de page |
| Mentions légales | `/mentions-legales` | Conformité | Contenu légal |
| Confidentialité | `/confidentialite` | Conformité LPD/RGPD | Contenu légal, lien gestion des cookies |

## Volume de pages (pour le devis)

Comptage sur la langue de référence (FR). Le DE et l'EN multiplient le volume de **contenu** à produire, pas le nombre de **gabarits** à concevoir.

| Type | Nombre | Note |
|---|---|---|
| Pages à gabarit unique | ~18 | Accueil, Tarifs, Offre du moment, Séance d'essai, Offre entreprise, hub Clubs, hub Sport, Plateau fitness, hub Cours collectifs, hub Small Group Training, Coaching personnel, hub Bien-être, Espaces, Soins, Actualités, Besoin d'aide ?, 2 légales. Les 10 états /tarifs/[club] ne sont pas des pages indexables |
| Pages club (même gabarit) | 10 | Contenu multiplié, un seul gabarit |
| Fiches cours dédiées (1 gabarit) | 9 | Cœur + extension, détail dans « Cours collectifs : périmètre et pages retenues » |
| Hubs de catégorie cours | 3 | Cardio & renfo, Yoga/Pilates/doux, LesMills |
| **Total pages indexables au lancement** | **~40** | Hors longue traîne et hors fiches Small Group Training (même gabarit que les fiches cours, nombre selon l'offre) |
| Longue traîne de cours | ~35 | Fiches légères back-office, présentes au planning et aux filtres, non comptées comme pages SEO au lancement |
