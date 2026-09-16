# B.3 — fitness.harmony.ch

> Source : Notion, "B.3 — fitness.harmony.ch"
> (Livrables / Cahier des charges : Refonte digitale Harmony Groupe / Annexe B – Site maps et mapping fonctionnel par site).
> Export du 2026-09-14, troisième passe : décisions du lab reportées dans Notion
> (engagements, coaching Gym, carte club Gym, carnets).
> Lecture seule : ne pas modifier ici, modifier dans Notion.

Site de marque, d'acquisition et d'orientation. Aucune transaction sur le site : les abonnements et les séances d'essai renvoient vers Echino, la réservation des soins bien-être vers l'outil du prestataire. Header : quatre entrées alignées à gauche, collées au logo (Clubs, Sport, Bien-être, Tarifs). À droite, les actions, de la plus discrète à la plus engageante : « Se connecter » avec une icône, qui ouvre l'espace membre de l'outil métier dont le nom n'apparaît jamais ; « Séance d'essai » en bouton secondaire ; « S'abonner » en bouton principal, vers /tarifs. On dit « S'abonner » et non « S'inscrire » : c'est déjà le mot de la carte club et de la barre récap. Sur mobile, le menu passe derrière un burger, le compte garde son icône seule et l'action principale reste. Les pages « Besoin d'aide ? » et Actualités restent accessibles depuis le footer. Trois niveaux de navigation.

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
│   ├── Cours collectifs  /sport/cours-collectifs   (catalogue rangé par objectif)
│   │   ├── [pages de famille]  /cours/[discipline]   Pilates, Yoga, Les Mills, Aqua
│   │   └── [fiches cours]  /cours/[cours]
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
└── [Footer]  Nous contacter /nous-contacter   ·   Besoin d'aide ? /aide   ·   Actualités /actualites   ·   Mentions légales   ·   Confidentialité
```

**Composants transverses :** témoignages, FAQ contextuelle (la FAQ complète vit sur la page « Besoin d'aide ? »).

**Contact :** un seul canal écrit, le formulaire de `/nous-contacter`. Plus d'adresse e-mail affichée, ni sur les pages club ni dans le footer : un e-mail ne se compte pas, ne présélectionne pas le club et ne se dispatche pas, et il laisse le manager surveiller deux boîtes. Le téléphone et l'adresse restent sur chaque page club, et le bloc contact du footer renvoie au formulaire. Pas de page contact dans le header : on y arrive depuis les pages club, le footer et la page Tarifs.

**Dispatch.** Le visiteur donne son sujet et son club, pas son destinataire : lui demander de choisir entre « Équipe Harmony » et dix clubs, c'est lui demander de connaître l'organisation d'Harmony. Chaque motif porte sa destination au CMS, club ou central, et le destinataire calculé est affiché sous le formulaire (« Votre message part à Harmony Meyrin »), donc sans surprise et corrigeable. Un motif qui part au club rend le champ club obligatoire. Délai annoncé non chiffré : « Nous vous répondons au plus vite. »

**Barre groupe :** libellés publics (Arts martiaux, École de natation) ; sous-domaines techniques inchangés (maa.harmony.ch, aqua.harmony.ch).

**Actualités :** flux propre à fitness.harmony.ch, alimenté par la collection unique du CMS partagé (voir B.1).

## Convention de nommage des clubs

Nom de page = ville seule, ou « Ville · Quartier » quand plusieurs clubs partagent la même ville (le cas ne se présente qu'à Genève). Chaque club a sa page, tous partagent le même gabarit.

| Club | Catégorie | Slug |
|---|---|---|
| Genève · Pâquis | Gym | `/clubs/geneve-paquis` |
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
2. **Club référent et tarif**, intégrés à la page (pas de pop-up, pas de géolocalisation). Ordinateur : liste des clubs groupée par canton, ordre alphabétique, nom + catégorie + adresse + icônes des formats de cours, carte à droite, survol synchronisé entre liste et repère. Mobile : pastilles par canton (nom + catégorie) et bouton « Voir sur la carte » qui ouvre la carte en plein écran, mini-fiche au toucher d'un repère avec « Choisir ce club ». Sélecteur de tarif, Adulte par défaut, avec « Justificatif d'âge demandé en club. » Une fois le club choisi, le bloc se replie en une ligne : « Club référent : [club] · Tarif [x] · Modifier »
3. **Offre du moment** : produits promo dédiés. Durée aussi visible que le prix, accès en nombre de clubs, « soit env. CHF X.– par mois » (validé par Harmony, pas de prix barré sur une durée inhabituelle), compteur. Une remise sur un produit existant s'affiche en pastille + prix barré sur sa carte. Ce n'est pas un produit promo dédié : c'est un pourcentage (ou un montant) appliqué à des produits qui existent déjà, abonnements ou carnets indifféremment, sans créer de produit. Le prix remisé est calculé depuis le prix catalogue, jamais saisi. Le prix barré est toujours présent quand une remise s'applique : un emplacement à prévoir en front, même quand le prix catalogue n'est pas encore connu. Le pourcentage de remise s'affiche en pastille sur la photo de la carte, à gauche, les jours restants à droite, jamais plus de deux pastilles. Le compteur de section ne sert alors que quand la section n'a aucune carte. La section existe dès qu'il y a l'un ou l'autre : un produit promo dédié, affiché en carte puisqu'il n'existe nulle part ailleurs, ou une promotion sur des produits existants, annoncée en une ligne (« Jusqu'au [date] : [nom de la promo] ») avec un lien d'ancre vers la section où le produit vit. Jamais de carte dupliquée : un produit, une carte, un bouton d'achat. Le compteur compte les offres dédiées, ou la promotion quand elle est la seule campagne, jamais les deux à la fois
4. **Abonnements** : sélecteur d'engagement (« Sans engagement » et « 12 mois », « 12 mois » présélectionné), 4 formules dans l'ordre Gym, Essential, Premium, Premium Platinum. **Premium Platinum** est Premium plus les Extras inclus, et ne se souscrit que depuis un club Premium : depuis un club Essential ou Gym, sa carte n'apparaît pas et elle est regroupée dans la ligne « Pas disponible depuis [club] ». Sur sa carte, la ligne d'inclusion « Extras » nomme ce qui est compris, en tags : le mot seul ne vend rien, surtout sur mobile. Liste déduite du club référent, au-delà de 4 on compte le reste. Les formules qui ne les incluent pas gardent « Extras : Non inclus » sans détail, c'est le contraste qui porte l'argument. Quand Premium Platinum est choisie, les Extras vendus en ligne passent en « Inclus avec la formule Premium Platinum », sans prix ni bouton ; ceux vendus en club restent « Sur demande en club », puisqu'ils ne se vendent pas ici. Nommage des formules : le premier mot est toujours le nom d'une catégorie de club, il dit quels clubs la formule ouvre ; ce qui suit est le niveau, affiché dans un style distinct pour qu'on ne le prenne pas pour une catégorie. Carte : nom, accès en nombre de clubs, ce qui est inclus (plateau fitness, cours collectifs, aqua, séances de coaching). Les lignes de cours disent combien de cours différents la formule ouvre, pas combien de séances : « Cours collectifs en salle : 25 cours », « Cours aquatiques : 4 cours ». C'est ce qui sépare Essential de Premium, en promo comme hors promo. L'accès est cumulatif : un cours donné dans un club Essential compte pour Premium. Le catalogue du hub et ces lignes comptent la même population, sinon la carte et le catalogue annoncent deux nombres différents pour la même chose. Nombre calculé depuis le CMS, jamais saisi, prix par mois en gros et total en dessous, bouton « Choisir [formule] ». Les **Extras** proposés dans le club juste en dessous, bouton « Ajouter ». Les Extras vendus en club (ex. séances de coaching en plus de celles incluses) s'affichent sans prix ni bouton, avec la mention « Sur demande en club » : on informe, on ne vend pas en ligne
5. **Carnets d'entrées** : deux volumes, 5 et 10 entrées, dans chacune des trois catégories, soit 6 carnets. Chaque carnet porte une durée de validité, plus longue pour le carnet de 10 que pour celui de 5, affichée sur la carte (« Valable X mois à partir de l'achat »). Le volume est dans le nom du carnet, pas répété en dessous : deux cartes voisines se distinguent au titre. Filtres Gym / Essential / Premium sans club, seuls les carnets valables une fois le club choisi. Prix ramené à l'entrée. Bouton « Acheter ce carnet », direct vers Echino. Pas de cartes cadeaux
6. **Sortie vers le conseil en club** : une ligne discrète après tous les produits, « Vous ne trouvez pas la formule qui vous convient ? Certains clubs proposent des arrangements sur mesure. » Renvoi vers un formulaire de contact avec le club présélectionné, motif et source dans le lien, pour compter ces demandes comme les demandes d'essai. Pas de cadre ni de bouton : elle existe pour qui en a besoin, elle ne détourne pas de la souscription en ligne. La page de destination reste à trancher, le site n'a pas de formulaire de contact aujourd'hui (voir commentaire). Puis module Catégories de clubs (court), réassurance, FAQ tarifs (engagement, frais d'inscription, résiliation, pause, accord parental pour les moins de 18 ans), CTA séance d'essai

**Règles**

- **Sans club** : tous les prix sont visibles, aucun bouton de souscription, une ligne « Choisissez d'abord votre club pour souscrire. » en tête de section. Pas de bouton désactivé
- **Grisé : un seul sens, « pas accessible depuis ce club ».** Accès et souscription sont deux choses différentes : l'accès vient de la catégorie du produit, la souscription peut en plus être restreinte à certaines catégories de clubs référents (Premium Platinum donne accès aux 10 clubs mais ne se souscrit que depuis un club Premium). Un produit catégorisé est disponible quand sa catégorie couvre le club référent (Premium : tous les clubs, Essential : Essential et Gym, Gym : Pâquis). Extras et offres : disponibles s'ils sont proposés depuis ce club. Les produits non disponibles sont regroupés en une ligne en fin de section, « Pas disponible depuis [club] : … Pourquoi ? » (lien vers le module Catégories), texte à contraste normal
- **Tarif (âge) : ne grise jamais.** Un produit sans le tarif choisi s'affiche au prix adulte avec « Pas de tarif [x], prix adulte ». Aujourd'hui : tarifs Ado, Jeune et Senior sur Essential et Premium ; Gym, carnets et offres au tarif Adulte seulement (réglage par produit, voir section 7)
- **Accès** : toujours un nombre, « Accès à 1 club », « Accès à 7 clubs », « Accès aux 10 clubs ». Nombre calculé depuis le CMS, jamais saisi. Un point d'info à côté donne la liste des clubs, groupée par canton : au survol sur ordinateur, au toucher sur mobile
- **Engagement** : deux valeurs, « Sans engagement » et « 12 mois », dans cet ordre, « 12 mois » présélectionné : c'est l'offre mise en avant, et celle que les promotions d'abonnement remisent. Une promotion sur un abonnement porte toujours sur le 12 mois seulement, jamais sur le sans engagement. Le sélecteur doit accepter une troisième valeur sans que la carte formule change de forme : le nombre d'engagements se lit dans le CMS, jamais en dur dans la mise en page. Pas de pastille ni de pourcentage de remise sur l'engagement, les deux prix s'affichent. Le prix barré reste réservé à une remise de l'offre du moment sur un produit existant. Une promotion peut être conditionnée à un engagement (« -15% avec l'engagement 12 mois ») : ce n'est pas une remise sur l'engagement mais une campagne datée. Sur l'engagement remisé, pastille pleine et prix barré normalement. Sur l'autre engagement, pastille en contour qui porte sa condition (« - 15% · 12 mois ») et ligne en retrait, mais pas de prix barré puisque ce prix n'est pas remisé : sans quoi la campagne serait invisible pour qui bascule sur l'autre engagement
- **Lignes d'inclusion** : les cartes formule affichent les mêmes lignes, dans le même ordre, avec « Non inclus » quand la formule ne couvre pas la ligne. Une ligne n'est jamais retirée : les cartes restent comparables ligne à ligne
- **Photo d'illustration** : chaque carte produit (formule, offre, carnet) porte une photo en tête, sur toute la largeur de la carte, pour humaniser l'offre. La pastille de remise se pose dessus. La photo est un champ du Produit au CMS, avec son texte alternatif : une carte sans photo saisie reste valide et n'affiche pas de cadre vide. L'Extra n'en a pas, ce n'est pas une carte produit
- **Barre récap** en bas d'écran (abonnements, offres et carnets) dès qu'un produit est choisi. Fixée en bas d'écran, pas en fin de page : c'est le bouton de validation qui emmène à l'étape suivante. Libellé « Finaliser mon achat » pour un carnet, qui s'achète et ne s'abonne pas. Choisir un abonnement emmène automatiquement à la section Extras, l'étape suivante du parcours ; un carnet ou une offre ne déplacent personne : produit, engagement, tarif, extras, total par mois, bouton « Finaliser mon abonnement » vers Echino (lien paramétré). Le nom Echino n'apparaît jamais. Un extra qui n'est plus proposé après un changement de club est retiré avec un message
- **Une seule barre collante en haut** : « Choisir mon club », puis « Club référent : [club] · Modifier ». Pas de barre d'ancres
- **Carte** : même composant que /clubs. Chargée quand elle devient visible (ordinateur) ou à l'ouverture (mobile). Compatible avec le bandeau cookies : fournisseur sans cookie de suivi, ou liste en repli avec un message clair. Repères distingués par forme et lettre (Gym, Essential, Premium) avec légende. Sur mobile, le bouton retour ferme la carte
- **Paramètre de campagne** : `?tarif=jeune` présélectionne le tarif (exception à B.1, sans effet SEO)
- **Copy** : vouvoiement, boutons à la première personne (« Choisir mon club »), un seul format de prix (« CHF 89.– »). Vocabulaire : club (jamais salle), formule, Abonnements (titre de section), carnet d'entrées, Extra, offre du moment, club référent, tarif

- **Cantons** : un regroupement géographique s'écrit toujours « Canton de Genève », jamais « Genève » seul. Meyrin, Versoix et Blandonnet ne sont pas dans la ville de Genève, et la liste des clubs est la première chose que lit un prospect qui cherche où s'entraîner. Même formule pour les deux cantons. Le nom d'une commune reste nu (« Genève · Pâquis »), et les titles SEO gardent « à Genève et Vaud », qui est calé sur les requêtes

**Tarifs par âge** (harmonisés, MAA à traiter à part) : Adulte, Ado · 16-18 ans, Jeune · 19-25 ans, Senior · 65 ans et +. L'âge est toujours affiché à côté du nom. Remplacent Full Access, Young (16-18 ans), Young (19-25 ans), Senior (+65 ans). Âge déclaré dans Echino, vérifié en club.

**SEO** : `/tarifs` est la seule page indexable, avec tout le catalogue en HTML. Les états `/tarifs/[slug du club]` ont un canonical vers `/tarifs` et sortent du sitemap XML (pas de noindex en plus). Title type « Tarifs et abonnements fitness à Genève et Vaud | Harmony », à valider avec la Search Console et les termes de recherche Google Ads. 301 depuis l'actuelle page tarifs. Les recherches de prix locales sont captées par les pages club (bloc « Formules et extras »).

## Clubs

**Rôle.** Moteur d'acquisition locale et de SEO géolocalisé. La page club est le point de rencontre entre la recherche de planning et la recherche de cours (voir « Cours collectifs : nommage, architecture et enjeux web »).

| Page | Slug | Intention | Composants clés |
|---|---|---|---|
| Clubs (hub) | `/clubs` | Trouver le bon club en quelques secondes et savoir avec quelle formule y aller, point d'entrée du SEO local | Liste groupée par canton (Genève, Vaud) en HTML et carte, même composant que Tarifs (carte à droite sur ordinateur, bouton « Voir sur la carte » sur mobile). Pas de géolocalisation ni de recherche : 10 clubs, zone de chalandise restreinte, et on choisit souvent un club près de son travail plutôt que de chez soi. Filtres (Ma formule, Équipements, Un cours précis), cartes club cliquables (nom, badge catégorie, adresse, atouts, nombre de cours par semaine, ligne d'accès, « Tarif adulte dès CHF X.– / mois », bouton « S'abonner », lien Planning, voir « Carte club » ci-dessous), module Catégories de clubs (#categories), FAQ courte, CTA essai |
| Page club (gabarit ×10) | `/clubs/[ville \| ville-quartier]` | Servir le membre qui cherche son planning, convertir le prospect local, cibler « salle fitness [quartier] » | Voir « Trame de la page club » ci-dessous : hero avec badge catégorie et ligne d'accès, barre rapide, infos pratiques, planning HTML filtrable (saisi au CMS, voir principe de découplage en 8.2), cours du club cliquables vers leurs fiches, équipements, bien-être, passerelle école de natation, galerie, coachs, témoignages, offre du moment, FAQ locale, clubs à proximité, CTA paramétrés |

### Catégories de clubs

Le mot retenu est « catégorie », sur le site, dans le CMS et dans les documents. Trois catégories : Gym, Essential, Premium. Les noms ne sont pas traduits. Chaque formule donne accès à une catégorie et à celles qu'elle inclut.

| Catégorie | Promesse | Socle garanti dans chaque club | Ligne d'accès affichée |
|---|---|---|---|
| Gym | Un plateau fitness complet, accessible sur une plage horaire plus large | Plateau fitness complet, horaires élargis. Pas de cours collectifs (des Small Group Training y sont proposés en extra) | « Accessible avec toutes nos formules » |
| Essential | À compléter | Club 4 étoiles fitness-guide.ch, cours collectifs en salle | « Accessible dès la formule Essential » |
| Premium | À compléter | Définition : club 5 étoiles fitness-guide.ch ET cours aquatiques en piscine. Plus les cours collectifs en salle | « Accessible dès la formule Premium » |

**Règles d'affichage**

- Le badge (« Club Gym », « Club Essential », « Club Premium ») est toujours accompagné de sa ligne d'accès : c'est elle qui répond à la question du visiteur. Il est cliquable : panneau court avec la promesse de la catégorie et lien vers /clubs#categories. La distinction visuelle ne repose pas uniquement sur la couleur.
- Les étoiles fitness-guide.ch servent uniquement à définir et différencier Essential et Premium, dans le module ci-dessous. Essential = 4 étoiles, Premium = 5 étoiles. Elles n'apparaissent ni sur les cartes club ni sur les pages club.
- Gym est un concept, pas un premier niveau : le vocabulaire évite toute idée de hiérarchie (niveau, gamme). Comme Essential inclut Gym, Gym est aussi un argument de vente pour Essential.
- Une seule graphie, Gym, identique en club, dans l'appli et sur le site.
- Nommage des formules : le premier mot est toujours le nom d'une catégorie de club, il dit quels clubs la formule ouvre (« formule Premium »). Ce qui suit est le niveau (« Premium Platinum »), affiché dans un style distinct pour qu'on ne le prenne pas pour une catégorie. Pas de préfixe « Accès ». La règle passe à l'échelle : un niveau haut sur Essential s'appellerait « Essential quelque chose ».
- Accès : la formule Premium inclut Essential et Gym, la formule Essential inclut Gym.
- Extras : les Small Group Training et les services (linge…) ne sont inclus dans aucune formule, sauf **Premium Platinum**, qui comprend ceux vendus en ligne. Ceux vendus en club (séances de coaching en plus) ne sont compris dans aucune formule, y compris Premium Platinum : ils ne se vendent pas en ligne. Chaque Small Group Training est un extra à part, et l'offre varie selon les clubs (Ceremony Hyrox Max ne sera pas partout). **Hyrox est une licence, pas un produit**, au même titre que Les Mills : Harmony l'utilise pour un cours collectif, « Les Mills Ceremony Hyrox », et pour un Small Group Training, « Ceremony Hyrox Max ». Le nom de la licence seul ne désigne rien et n'apparaît jamais comme nom de produit. Exception : les titles SEO peuvent porter le nom de la licence, parce que c'est lui que les gens cherchent. Un seul mot, « Extra », identique en club, dans l'appli, sur le site et dans Echino.
- Coaching personnel : des séances sont incluses dans les formules Essential, Premium et Premium Platinum (nombre à compléter). La formule Gym n'en inclut aucune. Les séances en plus sont un Extra vendu en club uniquement.

**Module « Catégories de clubs » (pas de page dédiée)**

Saisi une fois dans le CMS, affiché sur /clubs (ancre #categories), sur /tarifs, et en version courte sur l'accueil. Contenu : promesse de chaque catégorie, socle garanti, formule d'accès, ligne repliable « Comment on classe Essential et Premium » (label fitness-guide.ch + lien externe). Pas de page /clubs/categories : aucune demande de recherche propre, et une page de plus dupliquerait l'explication déjà présente sur Tarifs.

### Carte club (liste /clubs)

- Toute la carte est cliquable vers la page club : pas de bouton « Voir le club ».
- Un seul bouton, « S'abonner », qui ouvre `/tarifs/[slug du club]` avec le club référent présélectionné. À côté : « Tarif adulte dès CHF X.– / mois », prix de la formule la moins chère qui donne accès au club, au tarif Adulte (sinon « dès » afficherait le prix Jeune), tous engagements confondus et remise en cours comprise : sinon /clubs annonce un prix que /tarifs dément deux clics plus loin.
- Un lien texte « Planning » vers le planning de la page club (ancre).
- Sur un club Gym, le nombre de cours par semaine est remplacé par « Pas de cours collectifs · Small Group Training en Extra ». La ligne n'est jamais masquée : elle informe.
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
5. **Les cours du club** : liste compacte rangée par les 6 objectifs, chaque cours apparaissant une seule fois, sous son objectif principal (voir « Cours collectifs : périmètre et pages retenues »). Chaque cours est cliquable vers sa destination (`/cours/[cours]`, ou la page de famille avec ancre pour une variante). Texte stable et indexable, c'est lui qui capte « [cours] [commune] ». Un slider de 3 ou 4 cours phares peut s'ajouter au-dessus de la liste, jamais la remplacer
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

**Variante Gym.** Le hero met en avant les horaires élargis. Pas de cours collectifs inclus : le planning (bloc 4) n'affiche que les Small Group Training, marqués « Extra », et le bloc 5 est remplacé par le bloc Extras. Passerelle secondaire : « Envie de cours collectifs ? Ils sont inclus dès la formule Essential. »

**Un même nom, plusieurs formes.** Cross Training est à la fois une zone du plateau qu'on utilise en autonomie, un cours collectif encadré par un coach, et un Small Group Training à Genève · Pâquis. La zone vit sur la page Plateau fitness. Les deux cours partagent **une seule fiche** : un format n'est jamais une page, c'est un filtre, et deux pages du même nom se cannibaliseraient au référencement. La fiche rassemble les créneaux des deux et porte un bloc « Aussi en Small Group Training » qui dit que cette forme-là est un Extra. Un club propose une forme ou l'autre, jamais les deux : aujourd'hui Versoix en cours collectif, Genève · La Praille et Genève · Pâquis en Small Group Training, les autres clubs n'en proposent pas encore. C'est une règle de cohérence à contrôler à la saisie. Quand une fiche mélange les deux, le tableau « Où le pratiquer » porte la mention « Extra » club par club, avec la ligne « Inclus dans votre abonnement, sauf mention Extra ». Conséquence pour le CMS : **le caractère Extra se juge sur la séance, pas sur le cours** : la même pratique est incluse à Meyrin et payante à Pâquis, et le planning marque « Extra » là où elle l'est.

**Destination des cours.** Chaque cours du planning a une destination : sa fiche, la page de famille avec ancre sur la bonne section pour une variante, la page mère pour un niveau ou un format. Champ « destination » à prévoir par cours dans le CMS.

### SEO des pages clubs

- **Hub /clubs** : liste des clubs en HTML, pas seulement dans la carte, groupée par canton (« Nos clubs dans le canton de Genève », « Nos clubs dans le canton de Vaud »). Données structurées ItemList.
- **Page club** : H1 = marque + commune, requête générique dans le title (« Salle de sport à [commune] … | Harmony [club] ») et le sous-titre. 200 à 300 mots écrits pour chaque club, pas le même texte avec le nom changé. Données structurées HealthClub (adresse, GPS, horaires, équipements) + fil d'Ariane.
- **Fiche Google Business** de chaque club pointée vers sa nouvelle page (avec UTM), coordonnées strictement identiques.
- **Redirections** : chaque URL club actuelle redirige en 301 vers sa page club, pas vers le hub. Ces URL portent la position 1 sur les recherches de planning (voir 10.6).
- **Pas de pages cours × club au lancement** (`/clubs/[club]/[cours]`) : le croisement est capté par le planning et la liste des cours du club. À rouvrir après le lancement selon la Search Console.

## Sport

**Rôle.** Présente l'offre sportive et alimente le SEO par type de pratique. Les pages suivent l'ordre de ce qui est inclus : plateau fitness (toutes les formules), cours collectifs (dès Essential), Small Group Training (Extra payant), coaching personnel (séances incluses dès Essential). Gym n'est plus une verticale : c'est une catégorie de club (voir Clubs).

| Page | Slug | Intention | Composants clés |
|---|---|---|---|
| Sport (hub) | `/sport` | Présenter l'offre sportive et router vers les 3 piliers | Blocs vers plateau fitness, cours collectifs, Small Group Training et coaching personnel (dans cet ordre, avec ce que chaque formule inclut), teaser planning, CTA essai |
| Cours collectifs (hub) | `/sport/cours-collectifs` | Présenter les cours, montrer le planning, nourrir le SEO | Catalogue rangé par les 6 objectifs, recherche par nom, filtres (formule, club, objectif, intensité, format ; l'accès aux cours est cumulatif, filtrer Premium remonte les cours des clubs Essential et Gym), liens vers les pages de famille, planning type filtrable (saisi au CMS), CTA essai, témoignages |
| Pages de famille (même gabarit que les fiches, 4 pages) | `/cours/[discipline]` | Capter la recherche générique (Pilates, Yoga, Les Mills, Aqua), expliquer la discipline, distribuer vers les variantes et vers les clubs | Description de la discipline, variantes en sections avec ancres, clubs qui la proposent + créneaux, coachs associés, CTA essai et lien vers /tarifs |
| Fiches cours (1 gabarit, ~30 pages) | `/cours/[cours]` | Page SEO par type de cours, convertir | Description + bénéfices, niveau/intensité, clubs qui le proposent + créneaux, coachs associés, CTA essai et lien vers /tarifs, FAQ intégrée. Pour un Small Group Training : mention « Extra », clubs où il est proposé et prix, lus sur l'Extra dans le CMS (une seule saisie) |
| Plateau fitness | `/sport/plateau-fitness` | Présenter le cœur de l'offre, inclus dans toutes les formules et promesse de la catégorie Gym. SEO musculation et cardio | Présentation des zones (musculation, cardio, fonctionnel, cross training), matériel, photos, renvoi vers le bloc Équipements de chaque page club, lien vers /tarifs, CTA essai. Remplace la page Équipement : « équipements » ne garde qu'un sens, la liste fermée de la fiche club |
| Small Group Training (hub) | `/sport/small-group-training` | Présenter l'entraînement en petit groupe, payant en Extra, et capter les recherches type « hyrox genève » | Principe (un coach, quelques personnes), mention « Extra » bien visible, liste des Small Group Training avec les clubs où ils sont proposés et leur prix (lus sur l'Extra), liens vers leurs fiches `/cours/[cours]`, lien vers /tarifs, CTA essai. S'il n'y a qu'un Small Group Training au lancement, le hub peut attendre : sa fiche suffit |
| Coaching personnel | `/sport/coaching-personnel` | Mettre en valeur l'accompagnement Harmony : les coachs, les programmes, l'application de suivi | Voir « Page Coaching personnel » ci-dessous |

### Titres de la branche Sport

Le menu utilise le vocabulaire Harmony, le title les mots que les gens cherchent. Titles à valider avec la Search Console et les termes de recherche Google Ads avant la mise en ligne.

| Page | H1 (+ sous-titre) | Title |
|---|---|---|
| Sport | Le sport chez Harmony | Musculation, cours collectifs et coaching \| Harmony |
| Plateau fitness | Plateau fitness : musculation, cardio et fonctionnel | Salle de musculation à Genève et Vaud \| Harmony |
| Cours collectifs | Cours collectifs (+ « Inclus dès la formule Essential ») | Cours collectifs fitness à Genève et Vaud \| Harmony |
| Small Group Training | Small Group Training : l'entraînement en petit groupe (+ « Un coach pour quelques personnes, en Extra de votre abonnement. ») | Small Group Training et Hyrox à Genève \| Harmony (le title garde le nom de la licence, qui est le mot cherché ; le produit, lui, s'appelle Ceremony Hyrox Max) |
| Coaching personnel | Coaching personnel : un coach et un programme pour vous (+ « Des séances incluses dans les formules Essential, Premium et Premium Platinum, un suivi dans l'application [nom]. ») | Coach sportif à Genève et Vaud \| Harmony |

Slug du plateau : `/sport/plateau-fitness` par défaut, `/sport/musculation` si les données de recherche le justifient. Traductions : « Small Group Training » reste en anglais dans toutes les langues ; en allemand, le coaching personnel se dit « Personal Training ».

### Page Coaching personnel

Objectif : montrer que l'abonnement Harmony, c'est aussi un accompagnement. On ne vend rien en ligne ici : les séances incluses font partie des formules, les séances en plus se prennent en club.

1. **Hero** : H1, sous-titre, CTA « Voir les formules » (/tarifs) et « Demander une séance d'essai »
2. **Comment ça marche** : bilan avec un coach, programme personnalisé, suivi dans l'application. Ce qui est inclus : [X] séances dans les formules Essential, Premium et Premium Platinum. Envie de plus : séances supplémentaires en Extra, sur demande en club
3. **Les programmes** : rangés selon les 6 objectifs des cours collectifs, pour garder le même vocabulaire sur toute la branche Sport. Chacun avec sa durée, son rythme et pour qui il est fait. Liste des programmes à fournir par Harmony
4. **L'application de suivi** : ce qu'elle permet (programme, séances, progrès), captures d'écran, liens vers les stores. Nom et fonctionnalités à compléter
5. **Les coachs** : grille filtrable par club et spécialité (composant Personne, badge « Coach personnel »)
6. **Témoignages** : idéalement avec un résultat concret, accord écrit du membre
7. **FAQ** : combien de séances incluses, comment les réserver, changer de coach, séances en plus, et la formule Gym (séances non incluses)
8. **CTA final** : tarifs + essai

## Cours collectifs : périmètre et pages retenues

La famille cours collectifs repose sur **2 templates** à développer. Le nombre de familles ou de fiches ne multiplie pas les templates : un même modèle est réutilisé.

| Template à développer | Réutilisé pour | Pages |
|---|---|---|
| Hub global cours collectifs | `/sport/cours-collectifs/` | 1 |
| Gabarit cours | les 4 pages de famille et les fiches cours : même gabarit, la page de famille active en plus le bloc « variantes » | ~34 |

**Deux axes, deux rôles.** Le rangement se fait par les 6 objectifs : hub cours collectifs, bloc « cours du club » des pages club, filtres du planning. Le SEO est porté par les fiches cours, les pages de famille et le croisement cours + commune. Le classement par objectif est un levier de compréhension et de conversion, pas un levier de trafic (voir « Cours collectifs : nommage, architecture et enjeux web », section 3).

**Les 6 objectifs.** Se renforcer et sculpter, Se dépenser, Se dépasser, Bouger mieux et soulager son dos, Se détendre, Danser. Chaque cours porte un objectif principal, un objectif secondaire facultatif, une intensité (doux, modéré, intense) et un format (salle, aqua, petit groupe). Le champ est figé pour le développement, les libellés sont du contenu éditable : ils seront validés par le test d'arborescence (section 7 du doc de septembre), qui doit trancher deux doutes, la confusion entre « Se dépenser » et « Se dépasser », et la longueur de « Bouger mieux et soulager son dos ». Mapping cours par cours dans le doc de septembre. L'intensité et le format s'affichent en tag sur les cartes et les fiches de cours : ce sont les valeurs que les filtres manipulent, le tag fait le lien entre ce qu'on a filtré et ce qu'on lit. L'objectif principal est un tag lui aussi, sauf dans le catalogue du hub où il est déjà le titre de la section. Un tag porte toujours son mot, jamais une couleur ou une forme seule.

**Pages de famille : 4.** Pilates, Yoga, Les Mills, Aqua. Critère : discipline à variantes multiples avec une demande générique mesurée. Stretching est un cinquième candidat, à vérifier en Search Console avant de trancher.

**Aqua reste sur Fitness.** Aquagym et aquabike sont des cours collectifs inclus dans l'abonnement, au planning des clubs Premium, réservés dans Echino. aqua.harmony.ch vend l'apprentissage de la natation, un autre produit et un autre outil. Règle d'exclusion à tenir des deux côtés : Fitness ne parle jamais de cours de natation, Aqua ne parle jamais d'aquagym ni d'aquabike, chacun renvoie à l'autre par une passerelle (voir B.5).

**Périmètre des fiches.** Deux règles, dans cet ordre :

1. **On ne rétrograde pas un actif.** Toute page qui a déjà des apparitions et une position en Search Console garde sa page. La liste de 9 pages retenue en juillet laissait de côté Body Balance (28 505 apparitions, position 11,1), Circuit Training (20 161) et Core Training (19 496, position 10,2), soit des pages à portée de la première page de Google.
2. **Pour un cours sans historique**, page dédiée seulement s'il coche 2 critères sur 3 : demande propre mesurable, compréhensible hors contexte, besoin différent. Un niveau, un format ou un accessoire n'est jamais une page : c'est une section de la page de famille, ou un filtre.

Soit une trentaine de fiches au lancement, contre environ 80 pages de cours aujourd'hui.

**Charge réelle.** Le gabarit est unique : 9 fiches ou 30 ne change presque rien au développement. Ce qui change, c'est le contenu. Et ces pages existent déjà : il s'agit d'une migration avec réécriture, pas d'une création. Chiffrage à annoncer sur cette base.

**Multilingue.** FR complet au lancement. DE et EN sur les 4 pages de famille et les 10 fiches prioritaires, le reste en V2. À arbitrer au CODIR avec la décision Polylang ou WPML.

**Slugs.** Pages de famille et fiches partagent `/cours/[...]` : plus court, reprend le mot tapé, même chemin que le site actuel (redirections simplifiées). Le fil d'Ariane garde Sport > Cours collectifs > [cours]. Redirection 301 de `/cours/yoga-pilates` vers la page de famille Pilates : cette page fait 6 728 apparitions en position 41,5, c'est le cas d'école des deux pages faibles qui se partagent un sujet.

**Vocabulaire.** « Catégorie » est réservé aux clubs (Gym, Essential, Premium). Pour les cours : **objectif** (rangement), **famille** (discipline à variantes), **fiche** (un cours).

**H1 et title des pages cours (résout Q21).** H1 = le nom du cours ou de la famille, seul, sans ajout géographique. Title = « Cours de [cours] à Genève et Vaud | Harmony », ou « [cours] à Genève et Vaud | Harmony » quand « cours de » sonne faux (formats Les Mills). Le mot « cours » est repris parce que les requêtes le portent (« cours pilates » 2 849 apparitions, « cours de pilates » 2 117). Aucune commune dans le title d'une fiche : le croisement cours + commune est produit par les pages club et par le bloc « clubs qui proposent ce cours », pas par du bourrage de titre.

**Orthographe Les Mills.** En deux mots partout, dans les noms de cours comme dans les slugs : « Les Mills Body Pump », `/cours/les-mills`. Le site actuel en porte quatre orthographes différentes (voir doc de septembre, section 8).

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
| Nous contacter | `/nous-contacter` | Recevoir et tracer toute demande écrite, et la router vers le club ou l'équipe centrale | Même gabarit « demande de rappel » que la séance d'essai, avec un autre motif : sujet (liste fermée, porte la destination), club (obligatoire quand le sujet part au club, présélectionné quand on arrive d'une page club ou de Tarifs), nom, e-mail, téléphone facultatif, message. Destinataire calculé et affiché. Paramètres `motif`, `club` et `source` dans l'URL, pour compter les demandes par origine comme les demandes d'essai |
| Actualités | `/actualites` | Nourrir le SEO avec du contenu frais propre à Fitness (vie des clubs, nouveaux cours, événements) | Liste des articles tagués Fitness, provenant de la collection unique du CMS partagé (voir B.1). Teaser en page d'accueil |
| Besoin d'aide ? | `/aide` | Résoudre en autonomie puis router vers le bon canal : FAQ complète, contact local via les pages clubs, formulaire général en dernier recours | FAQ complète par catégories, renvoi vers les pages clubs (coordonnées), formulaire de contact général en bas de page |
| Mentions légales | `/mentions-legales` | Conformité | Contenu légal |
| Confidentialité | `/confidentialite` | Conformité LPD/RGPD | Contenu légal, lien gestion des cookies |

## Volume de pages (pour le devis)

Comptage sur la langue de référence (FR). Le DE et l'EN multiplient le volume de **contenu** à produire, pas le nombre de **gabarits** à concevoir.

| Type | Nombre | Note |
|---|---|---|
| Pages à gabarit unique | ~19 | Accueil, Tarifs, Offre du moment, Séance d'essai, Nous contacter (même gabarit que la séance d'essai : +1 page, +0 gabarit), Offre entreprise, hub Clubs, hub Sport, Plateau fitness, hub Cours collectifs, hub Small Group Training, Coaching personnel, hub Bien-être, Espaces, Soins, Actualités, Besoin d'aide ?, 2 légales. Les 10 états /tarifs/[club] ne sont pas des pages indexables |
| Pages club (même gabarit) | 10 | Contenu multiplié, un seul gabarit |
| Pages de famille (même gabarit que les fiches) | 4 | Pilates, Yoga, Les Mills, Aqua |
| Fiches cours (1 gabarit) | ~30 | Migration des pages qui ont déjà une position, plus les cours qui cochent 2 critères sur 3. Détail dans « Cours collectifs : périmètre et pages retenues » |
| **Total pages indexables au lancement** | **~63** | Hors fiches Small Group Training (même gabarit que les fiches cours, nombre selon l'offre) |
| Cours sans page propre | ~30 | Variantes absorbées en section d'une page de famille (avec ancre), ou traitées en filtre d'intensité ou de format. Présentes au planning, jamais orphelines |
