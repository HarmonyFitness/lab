# 7. Modèle de contenu et back-office

> Source : Notion, "7. Modèle de contenu et back-office"
> (Livrables / Cahier des charges : Refonte digitale Harmony Groupe).
> Miroir du 2026-10-01. **Notion fait foi.** Ce fichier en est une copie,
> tenue à jour en même temps que la page Notion : toute décision se reporte
> dans les deux, jamais dans un seul.

> 🎯 **Objectif** : définir la structure des contenus gérés dans le back-office (types de pages, collections, relations, permissions), pour dimensionner le schéma de données. · 👥 **Audience** : développeurs, équipes contenu.

**L'ambition de cette section : mutualiser au maximum.** Plutôt que de multiplier les pages uniques et les collections cloisonnées, tout l'écosystème Harmony est bâti sur un petit nombre de templates de page et de collections partagés. Une donnée saisie une fois est affichée partout où elle est pertinente. Un template développé une fois couvre plusieurs types d'objets métier grâce à des blocs activables. Cette philosophie irrigue toute la section : lisez d'abord les templates (7.1), puis les collections qui les alimentent (7.2), puis les mécaniques techniques et la gouvernance.

## 7.1 Templates de page

**Principe : mutualisation maximale.**

L'écosystème digital d'Harmony est bâti sur un principe de mutualisation forte : plutôt que de développer une page unique par cas, les pages du projet reposent sur un petit nombre de templates réutilisables. Chaque template couvre plusieurs types d'objets métier grâce à des blocs activables selon la nature de la fiche ou selon la verticale.

Deux bénéfices majeurs :

- **Économie de développement et de maintenance** : un template développé une fois, utilisable partout
- **Cohérence UX** : le visiteur retrouve une structure familière d'une verticale à l'autre, tout en percevant les spécificités éditoriales

> 💡 Les templates décrits ci-dessous posent une **intention structurelle**, pas des spécifications UX ou techniques détaillées. Les blocs et éléments cités sont des exemples pour illustrer le principe et donner un ordre de grandeur au développeur pour son chiffrage. Le UI / UX designer travaillera à partir de **prototypes HTML fonctionnels** fournis par Harmony (voir section 11.2), qui posent déjà la structure et les composants. Son rôle est un travail de finalisation UX / UI et de direction artistique, pas une conception ex nihilo.

### Template 1 : Lieu d'exercice

Un seul template pour **club Fitness, bassin Aqua, centre MAA**. Il présente un lieu physique où se pratique une activité, avec ses informations pratiques, son équipe, son offre.

Selon la nature du lieu, certains éléments spécifiques sont mis en avant : la catégorie du club et le planning des cours pour Fitness, les caractéristiques du bassin et les cours par âge et niveau pour Aqua. Le template doit permettre ces variations tout en gardant une structure de base commune.

### Template 2 : Discipline, cours, programme

Un template pour **cours collectifs Fitness, disciplines MAA, cours Aqua, activités Famille**. Il présente une pratique enseignée, avec sa description, ses modalités, les lieux qui la proposent et l'équipe qui l'anime.

Des éléments spécifiques peuvent être mis en avant selon la verticale : palmarès et exigences pour MAA, grille de niveaux pour Aqua, tranche d'âge pour Famille et Aqua.

### Template 3 : Personne (composant, pas de page au lancement)

Un composant unique pour **coach Fitness, instructeur MAA, moniteur Aqua** : une carte (photo, prénom, badges) et un panneau au clic (phrase de présentation, lieux d'intervention). Il s'affiche sur les pages lieu, les fiches cours et la page coaching. Un professionnel est saisi une fois dans le back-office de `harmony.ch` et associé à plusieurs verticales et lieux. Pas de page individuelle au lancement : pages minces, à refaire à chaque départ, et risque de doublons entre sous-domaines.

### Template 4 : Formule ou offre commerciale

Un template pour toutes les **formules d'abonnement et offres promotionnelles**. Il présente une offre commerciale avec ses caractéristiques, ses avantages, et un CTA « S'abonner » qui redirige vers l'outil métier associé (voir section 6.2).

Des composants spécifiques peuvent être activés : compteur de fin d'offre pour les promos (Fitness et MAA), comparateur (MAA), éléments pédagogiques pour Aqua et Famille. Sur Fitness, pas de page par formule : tous les produits vivent sur la page Tarifs, l'offre en cours sur la page Offre du moment (voir B.3).

### Template 5 : Article ou actualité

Structure classique de billet éditorial. Une collection unique dans le CMS avec tag verticale, un template unique d'affichage.

### Template 6 : Page éditoriale libre

Le template « wildcard » pour toutes les pages singulières : home, hub, page concept, page corpo, pages « Notre école », « L'academy », « Notre concept », etc.

Fonctionne comme un empilement libre de blocs modulaires. La bibliothèque de blocs disponible sera définie en phase de conception avec le UI/UX designer et le développeur.

### Micro-templates utilitaires

- Page légale (mentions, confidentialité)
- Page « Besoin d'aide ? » (FAQ complète, coordonnées, formulaire)
- Page de confirmation de formulaire
- Page 404

### Ce que ça change pour le chiffrage

Sans mutualisation, un développeur pourrait chiffrer sur la base de chaque page individuelle, ce qui gonflerait fortement l'estimation.

Avec la mutualisation posée ici, le chiffrage se concentre sur un **petit nombre de templates réutilisables** (listés ci-dessus, à affiner en phase de conception). La production éditoriale de chaque instance de page reste portée par les équipes Harmony ; le développement lui-même se concentre sur ces templates.

### Points d'attention pour la mise en œuvre

- **Conception détaillée** : la composition précise de chaque template (choix des blocs, hiérarchie visuelle, interactions, comportement responsive) est portée par le UI/UX designer en phase de conception. Cette section pose l'intention, pas la solution.
- **Discipline éditoriale** : un template mutualisé demande que le back-office rende visible ce qui est pertinent pour la nature de la fiche (ne pas laisser un éditeur Aqua remplir des champs Fitness par erreur).
- **Approche technique** : la manière dont le CMS gère les variations selon la nature de la fiche (blocs conditionnels, champs conditionnels, sous-types) varie selon les outils. Le développeur précisera dans sa réponse comment il propose d'implémenter cette souplesse.
- **Priorité conception** : le Template 1 (Lieu d'exercice) est le plus mobilisé du projet (13 instances au minimum : 10 clubs Fitness et 3 bassins Aqua). Sa structure impacte fortement la lisibilité et la maintenance de tout le projet, à traiter en priorité en phase de conception.

## 7.2 Types de contenus (collections)

Les templates définis en 7.1 sont alimentés par les collections suivantes. Chaque collection est un type d'objet métier stocké dans le CMS, avec ses propres champs, règles et relations. Le développeur précisera dans sa réponse comment il propose de structurer ces collections dans l'outil retenu.

| Collection | Description | Verticales concernées |
|---|---|---|
| Page | Page éditoriale libre (accueil, hub, page légale, etc.) — alimente le Template 6 | TOUS |
| Article (actualité) | Article de news, avec tag verticale — alimente le Template 5 | TOUS (collection unique, affichage filtré par verticale) |
| Club | Fiche club Fitness (10 clubs prévus) — alimente le Template 1 | FIT |
| Bassin | Fiche bassin Aqua (3 bassins prévus) — alimente le Template 1 | AQ |
| Discipline | Fiche discipline MAA (7 disciplines prévues) — alimente le Template 2 | MAA |
| Cours | Fiche cours (cours collectif Fitness, cours de natation Aqua) — alimente le Template 2 | FIT, AQ |
| Produit | Formule d'abonnement, offre promotionnelle ou carnet d'entrées, avec son identifiant dans l'outil métier (Echino ou Mizu selon verticale). Alimente le Template 4 et la page Tarifs | Verticaux |
| Extra | Service ou activité en supplément de la formule (service linge, Small Group Training). Un seul Extra couvre tous les Small Group Training : c'est lui qui porte le prix et les clubs, les trainings eux-mêmes sont des Cours sans prix propre. Un Extra est donc lié à zéro, une ou plusieurs fiches Cours. Clubs où il est proposé (saisis ici uniquement : la fiche club, la page Tarifs et la fiche cours lisent cette donnée ; un club où une séance de Small Group Training est programmée est ajouté d'office, jamais l'inverse), mode de vente (en ligne : prix et identifiant Echino ; en club : mention « Sur demande en club », sans prix ni bouton, ex. séances de coaching en plus) | FIT (extensible) |
| Coach / Instructeur / Moniteur | Fiche professionnel, associable à une ou plusieurs verticales et un ou plusieurs clubs/bassins — alimente le Template 3 | FIT, MAA, AQ |
| Témoignage | Témoignage client, avec verticale et contexte associés | TOUS |
| Question FAQ | Question de FAQ, avec catégorie et verticale, réutilisable en FAQ complète et FAQ contextuelle | TOUS |
| Événement | Fiche événement (portes ouvertes, stages, fête de fin d'année) | AQ prioritairement, extensible |
| Niveau (référentiel pédagogique) | Palier de progression (11 niveaux pour Aqua : Moussaillon + Niveaux 1 à 10) | AQ |
| Résultat / palmarès | Résultat de compétition ou distinction | MAA |

**Note.** Cette liste est indicative et pourra être affinée en phase de conception. Certaines collections peuvent être fusionnées ou décomposées selon les recommandations du développeur.

**Deux collections de plus, mises au jour par les prototypes.**

- **Séance** (FIT) : un créneau du planning type, avec son cours, son club, son jour, son heure, sa durée et son coach. C'est une collection à part entière et pas un champ de Cours, parce que presque tout s'en déduit : les clubs où un cours est donné, les Small Group Training d'un club, le nombre de cours qu'une formule ouvre, le caractère Extra club par club. Saisie au CMS pour la mise en ligne, remplaçable par l'API Echino ensuite sans refonte du composant (principe de découplage, section 8.2).
- **Promotion** (FIT, MAA) : une remise appliquée à des produits qui existent déjà, à ne pas confondre avec une offre, qui est un produit (voir 6.2). Champs : nom, dates de validité, remise en pourcentage **ou** en montant, produits visés, engagements concernés. Le prix remisé est calculé, jamais saisi. Sans cette collection, une remise de saison obligerait à dupliquer chaque produit.

## 7.3 Champs et structure de chaque collection

Pour chaque collection, les champs précis (types, contraintes, valeurs par défaut) seront définis en phase de conception, en co-construction avec le développeur retenu. Cette section pose les **principes de structuration** attendus.

**Principes généraux.**

- Chaque contenu doit avoir un titre, un slug (identifiant URL), un statut (publié, brouillon)
- Les contenus éditoriaux (Page, Article) doivent supporter un contenu riche : texte, images, vidéos embed, liens, tableaux, blocs personnalisés
- Les médias (images, vidéos, documents) sont stockés dans une bibliothèque centrale et réutilisables
- Les contenus sont versés dans le multilingue (voir section 9)

**Exemples d'attentes spécifiques.**

- **Club** : nom, quartier, catégorie (Gym / Essential / Premium), adresse, horaires, coordonnées, équipements (liste fermée), galerie, coachs associés, séances. Les étoiles découlent de la catégorie (Essential 4, Premium 5) : pas de champ par club. Dans la liste fermée des équipements, **chaque entrée porte un drapeau « espace bien-être »** : ce drapeau, et lui seul, décide de ce qui apparaît sur `/bien-etre/espaces` et dans le bloc bien-être des pages club. La répartition des saunas et hammams ne se saisit nulle part ailleurs. Graphie : **Gym**, jamais GYM en capitales, en club, dans l'appli, sur le site et dans Echino. Détail en Annexe B.3
- **Produit** : type (formule, offre, carnet), nom, catégorie (Fitness : Gym, Essential ou Premium), engagements ou durée, ce qui est inclus (plateau fitness, cours collectifs en salle, cours aquatiques, espaces bien-être, séances de coaching, Extras inclus ou non), **restriction de souscription** éventuelle (la formule Premium Platinum ne se souscrit que depuis un club Premium ; depuis un club Essential ou Gym sa carte n'est pas masquée en silence, elle est regroupée dans la ligne « Pas disponible depuis [club] »), tarifs couverts (Adulte, Ado 16-18 ans, Jeune 19-25 ans, Senior 65 ans et + : un seul ou plusieurs) avec un prix par tarif et par engagement, conditions, verticale, identifiant dans l'outil métier, dates de validité pour les offres. Pas de champ club : les clubs accessibles découlent de la catégorie. Détail en Annexe B.3
- **Coach** : prénom, photo (obligatoire pour apparaître), badges rangés par verticale (liste fermée, 3 maximum), verticales, lieux (clubs, bassins, centre MAA), coaching personnel oui/non, phrase de présentation. Référencé dans le back-office de `harmony.ch`. Détail en Annexe B.3

**Le développeur détaillera dans sa réponse** sa proposition de structure pour les principales collections, en s'appuyant sur les fonctionnalités décrites en section 6 et les site maps de l'Annexe B.

## 7.4 Relations entre collections

**Enjeu.** L'un des principes fondateurs du back-office (voir section 4) est la **mutualisation** : une donnée saisie une fois est réutilisée partout où elle est pertinente. Ce principe repose sur des relations bien pensées entre collections.

**Exemples de relations attendues.**

- Un **Coach** est lié à une ou plusieurs **verticales** et un ou plusieurs **clubs/bassins**. Il apparaît automatiquement sur les pages correspondantes.
- Un **Cours** porte un **objectif principal** (qui le range, un cours n'apparaît qu'une fois), un objectif secondaire facultatif, une **intensité**, un **format** (salle, aqua, petit groupe) et, s'il se décline, une **famille** (Pilates, Yoga, Les Mills, Aqua). « Catégorie » est réservé aux clubs et ne s'emploie jamais pour un cours. Les clubs qui le proposent **ne se saisissent pas** : ils se déduisent de ses séances, et la fiche affiche automatiquement les clubs concernés et leurs créneaux.
- Deux champs de plus sur le **Cours**, dictés par le métier. **Le caractère Extra se juge sur la séance, pas sur le cours** : la même pratique est incluse dans un club et payante dans un autre, et un club propose une forme ou l'autre, jamais les deux. Et **deux formes de vente d'une même pratique partagent une seule fiche** : un format n'est jamais une page, deux pages du même nom se cannibaliseraient au référencement. Prévoir le lien d'une entrée vers celle dont elle partage la fiche. Une **licence** (Les Mills, Hyrox) est un attribut, jamais un produit : le nom de la licence seul ne désigne rien, sauf dans un title SEO.
- Un **Produit** (formule, offre, carnet) est lié à une **verticale** et, pour Fitness, à une **catégorie de club** (le prix dépend de la catégorie, pas du club). Les clubs où il est accessible en découlent : Premium couvre tous les clubs, Essential couvre Essential et Gym, Gym couvre Gym. Accès et souscription sont deux choses différentes : l'accès vient de la catégorie, la souscription peut être restreinte à part. Il porte son identifiant dans l'outil métier.
- Un **Extra** est lié aux **clubs** qui le proposent et, pour les Small Group Training, aux **fiches Cours** qu'il couvre, au pluriel : un seul Extra, plusieurs trainings. Une formule peut inclure les Extras vendus en ligne (Premium Platinum) ; ceux vendus en club ne sont compris dans aucune formule, puisqu'ils ne se vendent pas en ligne. Choisir une telle formule vide les Extras déjà ajoutés et le dit : on ne facture pas deux fois, et on ne vide pas en silence. Le parcours d'abonnement se fait dans cet ordre : club référent, formule, extras.
- Un **Article (actualité)** est lié à une ou plusieurs **verticales** via un tag. Il apparaît sur les sites correspondants et sur le hub Corpo.
- Une **Question FAQ** est liée à une **catégorie** et à une ou plusieurs **verticales**. Elle est utilisable en FAQ contextuelle (sur une page produit/service) et en FAQ complète (page « Besoin d'aide ? »).

**Le développeur détaillera dans sa réponse** son approche technique pour gérer ces relations dans le CMS retenu, en particulier la manière dont un contenu multi-référencé s'affiche sur les différents sites.

## 7.5 Gestion du multilingue dans le back-office

Voir section 9 pour le détail. Principes attendus côté back-office :

- Chaque contenu peut être saisi en français, allemand et anglais
- L'éditeur voit clairement l'état de traduction de chaque contenu (traduit, en attente, obsolète si le contenu source a évolué)
- La langue par défaut est le français
- Comportement de fallback à préciser en conception : que se passe-t-il quand un contenu n'existe pas dans une langue ?

## 7.6 Rôles et permissions

**Objectif.** Le back-office est mutualisé entre les 5 sites, mais chaque éditeur ne doit accéder qu'aux contenus qui le concernent.

**Deux profils d'utilisateurs prévus au lancement.**

| Rôle | Périmètre d'édition | Utilisateurs types |
|---|---|---|
| Admin | Accès complet à tous les contenus, toutes verticales, toutes langues. Peut gérer les utilisateurs et les paramètres du CMS. | Consultant en charge du projet, référent technique interne éventuel |
| Éditeur verticale | Accès en lecture et écriture sur les contenus de sa verticale uniquement. Peut publier directement. | Un ou plusieurs référents par verticale (FIT, MAA, AQ, FAM, CORP) |

**Évolution possible.** Cette structure de rôles peut être affinée dans le futur (contributeur en lecture seule, valideur, rôles croisés multi-verticales) mais l'entrée en production se fait avec ces 2 rôles.

**Contenus partagés (coachs, actualités multi-verticales).** Décidé pour les coachs : ils sont référencés dans le back-office de `harmony.ch`, avec des verticales attribuées, et s'affichent automatiquement sur les sites de ces verticales (jamais sur le site corporate). Reste à désigner qui les édite (admin ou éditeur CORP) et à fixer la règle pour les actualités multi-verticales.

## 7.7 Workflow éditorial

**Choix retenu : publication directe pour les personnes autorisées.**

Pas de workflow de validation formel avant publication. Chaque éditeur verticale peut publier directement les contenus de son périmètre. Cette approche privilégie l'agilité éditoriale et l'autonomie des équipes, en cohérence avec l'un des principes fondateurs du projet.

**États des contenus attendus.**

- **Brouillon** : contenu en cours de rédaction, non visible sur le site
- **Publié** : contenu visible sur le site
- **Programmé** (optionnel, à confirmer) : publication automatique à une date future
- **Dépublié / archivé** : contenu masqué du site mais conservé en base pour réactivation éventuelle

**Historique et versions.**

Le CMS doit conserver un historique des modifications (qui a modifié quoi et quand) pour permettre un retour arrière en cas d'erreur. Le niveau de détail attendu (versionnage complet vs journal simple) est à préciser par le développeur.

**Notifications.**

Pas de système de notification complexe requis au lancement. À raffiner selon les besoins des équipes en phase de conception.
