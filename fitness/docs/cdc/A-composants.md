# Annexe A – Spécifications des composants partagés

> Source : Notion, "Annexe A – Spécifications des composants partagés"
> (Livrables / Cahier des charges : Refonte digitale Harmony Groupe).
> Export du 2026-09-10. Lecture seule : ne pas modifier ici, modifier dans Notion.

> 🎯 **Objectif** : détailler les composants réutilisables de la bibliothèque partagée, mutualisés entre les 5 sites, pour estimer précisément la charge. · 👥 **Audience** : développeurs, UI designer.

**Cette annexe pose une intention structurelle, pas une spécification UX ou technique détaillée.** Les composants listés ci-dessous sont ceux que le développeur devra construire pour l'ensemble de l'écosystème. Leur composition précise (blocs, hiérarchie visuelle, interactions détaillées) sera portée par le UI / UX designer sur la base des prototypes HTML fournis par le consultant (voir section 11.2).

---

## A.1 Logique de la bibliothèque de composants

**Principe : mutualisation forte et cohérence garantie.**

L'ensemble des 5 sites de l'écosystème Harmony repose sur une bibliothèque unique de composants partagés. Une modification d'un composant se propage à tous les sites où il est utilisé. Cette approche a trois bénéfices majeurs :

- **Économie de développement** : un composant développé une fois, utilisable sur toutes les verticales
- **Cohérence UX et de marque** : le visiteur retrouve les mêmes éléments d'interface d'une verticale à l'autre
- **Maintenance facilitée** : une évolution ou une correction se répercute automatiquement partout

**Déclinaisons contrôlées.**

Chaque composant peut avoir des variantes visuelles ou fonctionnelles selon la verticale (couleurs de l'identité, contenus, options activables). Ces variations sont gouvernées par le design system produit par le UI / UX designer (voir A.4).

**Composants partagés vs composants spécifiques.**

La majorité des composants du projet est partagée entre plusieurs sites (voir A.2). Certains composants n'existent que sur une verticale et ne relèvent pas de la bibliothèque partagée (voir A.3). Le chiffrage doit inclure les deux catégories.

## A.2 Inventaire des composants partagés

Ce tableau recense les composants mutualisés entre plusieurs sites. La colonne « Complexité relative » (S / M / L) est indicative pour orienter le chiffrage, elle n'est pas contractuelle.

**Légende.**

- Sites : FIT = Fitness, MAA = MAA, AQ = Aqua, FAM = Famille, CORP = Corporate, TOUS = les 5 sites
- Interactivité : Statique = HTML/CSS pur · Interactif = JavaScript côté client · Hybride = données via API
- Complexité : S = simple, M = moyenne, L = complexe

### Navigation et structure

| Composant | Rôle métier | Sites concernés | Interactivité | Complexité |
|---|---|---|---|---|
| Header groupe (barre inter-sites) | Circulation entre les 5 univers de l'écosystème | TOUS | Interactif | M |
| Header verticale | Navigation propre à chaque site (4 à 5 entrées) | TOUS | Interactif | M |
| Footer commun | Liens Besoin d'aide, Actualités, mentions légales, confidentialité, contact secondaire | TOUS | Statique | S |
| Sélecteur de langue | Bascule entre FR / DE / EN (voir section 9) | TOUS | Interactif | S |

### Conversion et formulaires

| Composant | Rôle métier | Sites concernés | Interactivité | Complexité |
|---|---|---|---|---|
| Formulaire de demande d'essai | Formulaire de conversion principal, dispatch dynamique par club (voir 6.3.1) | FIT, MAA | Interactif | M |
| Formulaire de contact général | Contact avec dispatch dynamique par club ou centralisé (voir 6.3.2) | TOUS | Interactif | M |
| Formulaire de contact Entreprise | Formulaire B2B avec qualification du contact (voir 6.3.3) | CORP | Interactif | M |
| Formulaire d'inscription newsletter | Formulaire simple présent en footer, stockage CMS et transmission automatique à Echino ou Mizu selon la verticale (voir 6.3.4 et 8.4) | TOUS | Interactif | S |
| Page de confirmation de formulaire | Page d'atterrissage générique post-soumission avec message de succès contextualisé | TOUS | Statique | S |

### Orientation commerciale

| Composant | Rôle métier | Sites concernés | Interactivité | Complexité |
|---|---|---|---|---|
| Comparateur de formules / page Tarifs | Fitness : page Tarifs, club référent × tarif par âge × engagement, produits non accessibles regroupés, barre récap vers Echino (voir B.3). MAA : 3 paliers × engagement (voir 6.2) | FIT, MAA | Interactif | L |
| Compteur / chronomètre d'offre | Lié à la date de fin d'une offre promotionnelle (gérée dans le CMS) | FIT, MAA | Interactif | M |
| CTA d'orientation vers checkout | Construction dynamique du lien avec paramètres (Mizu, et Echino : club référent, produit, extras) | Verticaux | Interactif | M |
| Sélecteur de club / bassin | FIT : choix du club référent (liste par canton et carte sur ordinateur, pastilles et carte plein écran sur mobile), qui détermine les produits accessibles et les extras. Réutilisé sur /tarifs, /offre-du-moment et /seance-essai. AQ : cours proposés | Verticaux | Interactif | M |

### Affichage dynamique

| Composant | Rôle métier | Sites concernés | Interactivité | Complexité |
|---|---|---|---|---|
| Carte géographique | FIT : 10 clubs, un seul composant pour /clubs, /tarifs et l'offre du moment. Repères distingués par catégorie (forme et lettre, pas seulement la couleur), chargement à la demande, compatible avec le consentement cookies, plein écran sur mobile. AQ : 3 bassins. Marqueurs aux couleurs Harmony | FIT, AQ | Interactif | M |
| Filtres multi-critères | FIT : cours par type / club / intensité. AQ : cours par bassin. Coaching : coachs par club / spécialité | FIT, AQ | Interactif | M |
| Grille filtrable de professionnels | Coachs, instructeurs, moniteurs saisis une fois dans le CMS, filtrables par lieu et spécialité | FIT, MAA, AQ | Interactif | M |
| Planning des cours collectifs | Planning type saisi dans le CMS pour la mise en ligne. Intégration API Echino en option ensuite, sans refonte du composant (voir principe de découplage en 8.2) | FIT | Interactif | M |
| Grille des disciplines / cours | MAA : 7 disciplines. AQ : 10 cours + 5 familles de cours | MAA, AQ | Statique | S |

### Éditoriaux réutilisables

| Composant | Rôle métier | Sites concernés | Interactivité | Complexité |
|---|---|---|---|---|
| Bloc témoignage | Témoignages clients avec verticale et contexte associés, modules dynamiques par verticale | TOUS | Statique | S |
| FAQ contextuelle | Questions liées à une page produit ou service, format accordéon | TOUS | Interactif | S |
| FAQ complète | Page « Besoin d'aide ? » avec toutes les questions, filtrables par catégorie | Verticaux | Interactif | M |
| Bloc actualités (teaser) | Aperçu d'articles depuis la collection unique CMS, filtré par verticale | TOUS | Statique | S |
| Page article standard | Gabarit unique pour tous les articles, filtrage par tag verticale | TOUS | Statique | S |
| Galerie photos et vidéos | Médias maîtrisés, vidéos hébergées en externe (YouTube, Vimeo) | TOUS | Interactif | M |
| Passerelles inter-sites | Liens contextuels entre verticales (ex : MAA vers FAM pour Baby MAA, FIT vers CORP pour Offre Entreprise) | Verticaux | Statique | S |

### Transverses techniques

| Composant | Rôle métier | Sites concernés | Interactivité | Complexité |
|---|---|---|---|---|
| Bandeau de consentement cookies | Intégration Axeptio, gestion du consentement LPD / RGPD (voir 8.3) | TOUS | Interactif | S |
| Bandeau d'alerte / promotion | Bandeau ponctuel utilisable pour communication commerciale ou institutionnelle | TOUS | Interactif | S |

## A.3 Composants spécifiques par verticale

Ces composants n'existent que sur une seule verticale et ne sont pas mutualisés dans la bibliothèque partagée. Ils doivent néanmoins être pris en compte dans le chiffrage.

| Composant | Rôle métier | Verticale | Interactivité | Complexité |
|---|---|---|---|---|
| Grille de niveaux pédagogique | 11 paliers (Moussaillon + Niveaux 1 à 10), format accordéon ou timeline | AQ | Interactif | M |
| Palmarès et résultats compétition | Crédibilise la marque MAA par la performance sportive | MAA | Statique | S |
| Bloc « cours par âge et niveau » | Présentation éditoriale spécifique Aqua (au lieu du comparateur de formules classique) | AQ | Statique | M |
| Composants Famille | Modèle éditorial spécifique à préciser en phase de conception (offre transversale famille) | FAM | À définir | À définir |

## A.4 Principes de déclinaison visuelle

**Identité Harmony conservée ou revisitée.**

Les composants s'appuient sur l'identité visuelle Harmony existante, à conserver ou revisiter selon accord avec le UI / UX designer et l'équipe Harmony (voir section 11.3).

**Variations par verticale.**

Chaque composant peut décliner ses attributs visuels (couleurs, iconographie, illustrations) selon la verticale, tout en gardant sa structure fonctionnelle. Ces déclinaisons sont pilotées par un design system unique produit par le UI / UX designer, avec des variables (tokens) qui portent les identités par verticale.

**Cohérence garantie.**

Le design system doit rendre impossible qu'un composant devienne visuellement incohérent avec sa verticale ou avec le groupe. Le développeur intègre ces principes dans son implémentation.

## A.5 Renvoi aux prototypes HTML fournis

Les composants listés dans cette annexe sont incarnés dans les **prototypes HTML fonctionnels** produits en interne par le consultant en charge du projet (voir section 11.2). Ces prototypes posent l'intention structurelle, la composition et l'interaction attendue pour chaque composant, et servent de référence de travail au UI / UX designer (finalisation) et au développeur (production).

Le développeur n'a donc pas à concevoir l'interaction de chaque composant ex nihilo. Il travaille à partir des prototypes fournis, en collaboration avec le designer pour la finalisation UI et la construction du design system exploitable.
