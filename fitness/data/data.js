/* Harmony Fitness : données du lab de wireframes.

   Reproduit le modèle CMS de docs/cdc/07-modele-contenu.md (section 7.2).
   Règles d'affichage : docs/cdc/B3-fitness.md.

   Trois conventions, posées dans CLAUDE.md :
   - null  = donnée inconnue. Les composants affichent un placeholder visible
             entre crochets ("CHF XX.–", "[adresse]"). Jamais de valeur inventée.
   - aValider = texte rédigé mais pas encore validé par Harmony. Affiché tel
             quel avec le marqueur "à valider par Harmony".
   - Rien n'est saisi deux fois. Les clubs d'un produit se déduisent de sa
             catégorie, les clubs d'un cours se déduisent des séances, les
             clubs d'un extra sont saisis sur l'extra et nulle part ailleurs.

   Les coachs sont fictifs. Les coordonnées GPS sont au niveau de la commune,
   à remplacer par l'adresse exacte de chaque club.
*/

window.DATA = {

  /* ------------------------------------------------------------------ */
  /* Référentiels : listes fermées, partagées par toutes les collections */
  /* ------------------------------------------------------------------ */
  referentiels: {

    /* B.3 > Page Tarifs > Tarifs par âge */
    tarifs: [
      { id: 'adulte', nom: 'Adulte',  mention: '',             defaut: true },
      { id: 'ado',    nom: 'Ado',     mention: '16-18 ans'  },
      { id: 'jeune',  nom: 'Jeune',   mention: '19-25 ans'  },
      { id: 'senior', nom: 'Senior',  mention: '65 ans et +' }
    ],

    /* questions.md > Q5 */
    engagements: [
      { id: 'sans',   nom: 'Sans engagement', defaut: true },
      { id: '12mois', nom: '12 mois' }
    ],

    /* B.3 > Page Tarifs > trame > 4 : "plateau fitness, cours collectifs,
       aqua, séances de coaching". Les 3 cartes formule affichent ces 4
       lignes, dans cet ordre, avec "Non inclus" quand c'est le cas (Q4). */
    inclusions: [
      { id: 'plateau',  libelle: 'Plateau fitness' },
      { id: 'cours',    libelle: 'Cours collectifs en salle' },
      { id: 'aqua',     libelle: 'Cours aquatiques' },
      { id: 'coaching', libelle: 'Séances de coaching' }
    ],

    /* questions.md > Q7, provisoires. docs/cdc/cours-collectifs.md fera foi. */
    objectifs: [
      { id: 'se-renforcer',  nom: 'Se renforcer et sculpter' },
      { id: 'se-depenser',   nom: 'Se dépenser' },
      { id: 'se-depasser',   nom: 'Se dépasser' },
      { id: 'bouger-mieux',  nom: 'Bouger mieux et soulager son dos' },
      { id: 'se-detendre',   nom: 'Se détendre' },
      { id: 'danser',        nom: 'Danser' }
    ],
    intensites: [
      { id: 'doux',    nom: 'Doux' },
      { id: 'modere',  nom: 'Modéré' },
      { id: 'intense', nom: 'Intense' }
    ],
    formats: [
      { id: 'salle',        nom: 'Salle' },
      { id: 'aqua',         nom: 'Aqua' },
      { id: 'petit-groupe', nom: 'Petit groupe' }
    ],

    /* B.3 > Cours collectifs : périmètre et pages retenues > Pages de famille.
       Une famille est une discipline à variantes. Sa page utilise le même
       gabarit qu'une fiche, avec le bloc « variantes » activé en plus.
       "coursGenerique" : l'id du cours dont la page EST la page de famille
       (Pilates et Yoga existent aussi comme séances). null quand la famille
       n'a pas de séance à son nom (Les Mills, Aqua). */
    familles: [
      { id: 'pilates',   nom: 'Pilates',   slug: 'pilates',   coursGenerique: 'pilates',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
      { id: 'yoga',      nom: 'Yoga',      slug: 'yoga',      coursGenerique: 'yoga',
        description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
      { id: 'les-mills', nom: 'Les Mills', slug: 'les-mills', coursGenerique: null,
        description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
      { id: 'aqua',      nom: 'Aqua',      slug: 'aqua',      coursGenerique: null, slugAValider: true,
        description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' }
    ],

    /* B.3 > Destination des cours : « sa fiche, la page de famille avec ancre
       sur la bonne section pour une variante, la page mère pour un niveau ou
       un format ». Le traitement d'un membre de famille décide de sa
       destination, et le champ destination est résolu, pas recalculé à
       l'affichage. */
    traitements: [
      { id: 'page',            nom: 'Page dédiée' },
      { id: 'section',         nom: 'Section de la page de famille' },
      { id: 'filtre-intensite',nom: "Absorbé en filtre d'intensité" },
      { id: 'filtre-format',   nom: 'Absorbé en filtre de format' }
    ],

    /* B.3 impose une liste fermée sans la donner. Provisoire, voir Q15.
       Reconstituée depuis les mentions de B.3 (zones du plateau, espaces
       wellness, FAQ locale). */
    equipements: [
      { id: 'musculation',  nom: 'Plateau musculation', aValider: true },
      { id: 'cardio',       nom: 'Zone cardio',         aValider: true },
      { id: 'fonctionnel',  nom: 'Espace fonctionnel',  aValider: true },
      { id: 'cross',        nom: 'Cross training',      aValider: true },
      { id: 'salle-cours',  nom: 'Salle de cours',      aValider: true },
      { id: 'piscine',      nom: 'Piscine',             aValider: true, bienEtre: true },
      { id: 'sauna',        nom: 'Sauna',               aValider: true, bienEtre: true },
      { id: 'hammam',       nom: 'Hammam',              aValider: true, bienEtre: true },
      { id: 'jacuzzi',      nom: 'Jacuzzi',             aValider: true, bienEtre: true },
      { id: 'jets',         nom: 'Jets massants',       aValider: true, bienEtre: true },
      { id: 'parking',      nom: 'Parking',             aValider: true }
    ],

    jours: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
  },

  /* ------------------------------------------------------------------ */
  /* Catégories : B.3 > Catégories de clubs                              */
  /* couvre[] porte toute la règle d'accès. Le nombre de clubs d'une      */
  /* formule s'en déduit par comptage, il n'est jamais saisi.             */
  /* ------------------------------------------------------------------ */
  categories: [
    {
      id: 'gym',
      nom: 'GYM',
      lettre: 'G',
      forme: 'triangle',
      promesse: 'Un plateau fitness complet, accessible sur une plage horaire plus large',
      promesseAValider: false,
      socle: [
        'Plateau fitness complet, horaires élargis',
        'Pas de cours collectifs : des Small Group Training y sont proposés en Extra'
      ],
      ligneAcces: 'Accessible avec toutes nos formules',
      couvre: ['gym'],
      etoiles: null
    },
    {
      id: 'essential',
      nom: 'Essential',
      lettre: 'E',
      forme: 'carre',
      promesse: "Un club complet pour s'entraîner : plateau fitness et cours collectifs en salle.",
      promesseAValider: true,
      socle: [
        'Club 4 étoiles fitness-guide.ch',
        'Cours collectifs en salle'
      ],
      ligneAcces: 'Accessible avec les formules Essential et Premium',
      couvre: ['essential', 'gym'],
      etoiles: 4
    },
    {
      id: 'premium',
      nom: 'Premium',
      lettre: 'P',
      forme: 'cercle',
      promesse: "Tout pour s'entraîner, piscine comprise : plateau fitness, cours collectifs et cours aquatiques.",
      promesseAValider: true,
      socle: [
        'Club 5 étoiles fitness-guide.ch',
        'Cours aquatiques en piscine',
        'Cours collectifs en salle'
      ],
      ligneAcces: 'Accessible avec la formule Premium',
      couvre: ['premium', 'essential', 'gym'],
      etoiles: 5
    }
  ],

  /* ------------------------------------------------------------------ */
  /* Clubs : B.3 > Convention de nommage des clubs (noms, slugs, catégories) */
  /* Trois champs absents volontairement, parce qu'ils se déduisent :         */
  /*  - etoiles  : découlent de la catégorie (section 7.3)                    */
  /*  - extras   : saisis sur l'Extra, qui porte ses clubs (B.3 > Fiche club) */
  /*  - coachs   : c'est le champ "lieux" du coach qui décide de la page club */
  /*               où il apparaît (B.3 > Fiche coach dans le CMS)             */
  /* ------------------------------------------------------------------ */
  clubs: [
    { id: 'blandonnet', nom: 'Blandonnet', ville: 'Blandonnet', quartier: null,
      canton: 'Genève', categorie: 'essential', bassin: false,
      adresse: null, horaires: null, tel: null, email: null,
      gps: { lat: 46.2180, lng: 6.0850 },
      equipements: ['musculation', 'cardio', 'fonctionnel', 'salle-cours', 'sauna', 'parking'],
      atouts: ['Lorem ipsum dolor sit amet', 'Consectetur adipiscing elit'],
      proximite: ['meyrin', 'geneve-paquis'] },

    { id: 'geneve-eaux-vives', nom: 'Genève · Eaux-Vives', ville: 'Genève', quartier: 'Eaux-Vives',
      canton: 'Genève', categorie: 'essential', bassin: false,
      adresse: null, horaires: null, tel: null, email: null,
      gps: { lat: 46.2040, lng: 6.1620 },
      equipements: ['musculation', 'cardio', 'salle-cours', 'sauna'],
      atouts: ['Sed do eiusmod tempor incididunt', 'Ut labore et dolore magna'],
      proximite: ['geneve-paquis', 'veyrier'] },

    { id: 'geneve-la-praille', nom: 'Genève · La Praille', ville: 'Genève', quartier: 'La Praille',
      canton: 'Genève', categorie: 'premium', bassin: true,
      adresse: null, horaires: null, tel: null, email: null,
      gps: { lat: 46.1830, lng: 6.1280 },
      equipements: ['musculation', 'cardio', 'fonctionnel', 'cross', 'salle-cours', 'piscine', 'sauna', 'hammam', 'jacuzzi', 'jets', 'parking'],
      atouts: ['Ut enim ad minim veniam', 'Quis nostrud exercitation ullamco'],
      proximite: ['veyrier', 'geneve-eaux-vives'] },

    { id: 'geneve-paquis', nom: 'Genève · Pâquis', ville: 'Genève', quartier: 'Pâquis',
      canton: 'Genève', categorie: 'gym', bassin: false,
      adresse: null, horaires: null, tel: null, email: null,
      gps: { lat: 46.2120, lng: 6.1480 },
      equipements: ['musculation', 'cardio', 'fonctionnel'],
      atouts: ['Duis aute irure dolor', 'Reprehenderit in voluptate velit'],
      proximite: ['geneve-eaux-vives', 'blandonnet'] },

    { id: 'meyrin', nom: 'Meyrin', ville: 'Meyrin', quartier: null,
      canton: 'Genève', categorie: 'essential', bassin: false,
      adresse: null, horaires: null, tel: null, email: null,
      gps: { lat: 46.2330, lng: 6.0800 },
      equipements: ['musculation', 'cardio', 'fonctionnel', 'cross', 'salle-cours', 'sauna', 'parking'],
      atouts: ['Excepteur sint occaecat cupidatat', 'Non proident sunt in culpa'],
      proximite: ['blandonnet', 'versoix'] },

    { id: 'versoix', nom: 'Versoix', ville: 'Versoix', quartier: null,
      canton: 'Genève', categorie: 'essential', bassin: false,
      adresse: null, horaires: null, tel: null, email: null,
      gps: { lat: 46.2830, lng: 6.1620 },
      equipements: ['musculation', 'cardio', 'salle-cours', 'parking'],
      atouts: ['Qui officia deserunt mollit', 'Anim id est laborum'],
      proximite: ['meyrin', 'gland'] },

    { id: 'veyrier', nom: 'Veyrier', ville: 'Veyrier', quartier: null,
      canton: 'Genève', categorie: 'premium', bassin: true,
      adresse: null, horaires: null, tel: null, email: null,
      gps: { lat: 46.1650, lng: 6.1840 },
      equipements: ['musculation', 'cardio', 'fonctionnel', 'salle-cours', 'piscine', 'sauna', 'hammam', 'jacuzzi', 'parking'],
      atouts: ['Lorem ipsum dolor sit amet', 'Sed ut perspiciatis unde omnis'],
      proximite: ['geneve-la-praille', 'geneve-eaux-vives'] },

    { id: 'denges', nom: 'Denges', ville: 'Denges', quartier: null,
      canton: 'Vaud', categorie: 'premium', bassin: true,
      adresse: null, horaires: null, tel: null, email: null,
      gps: { lat: 46.5320, lng: 6.5350 },
      equipements: ['musculation', 'cardio', 'fonctionnel', 'cross', 'salle-cours', 'piscine', 'sauna', 'hammam', 'jets', 'parking'],
      atouts: ['Iste natus error sit voluptatem', 'Accusantium doloremque laudantium'],
      proximite: ['gland', 'signy'] },

    { id: 'gland', nom: 'Gland', ville: 'Gland', quartier: null,
      canton: 'Vaud', categorie: 'essential', bassin: false,
      adresse: null, horaires: null, tel: null, email: null,
      gps: { lat: 46.4200, lng: 6.2680 },
      equipements: ['musculation', 'cardio', 'salle-cours', 'sauna', 'parking'],
      atouts: ['Totam rem aperiam eaque ipsa', 'Quae ab illo inventore veritatis'],
      proximite: ['signy', 'versoix'] },

    { id: 'signy', nom: 'Signy', ville: 'Signy', quartier: null,
      canton: 'Vaud', categorie: 'essential', bassin: false,
      adresse: null, horaires: null, tel: null, email: null,
      gps: { lat: 46.3900, lng: 6.2260 },
      equipements: ['musculation', 'cardio', 'fonctionnel', 'salle-cours', 'parking'],
      atouts: ['Et quasi architecto beatae vitae', 'Dicta sunt explicabo nemo enim'],
      proximite: ['gland', 'versoix'] }
  ],

  /* ------------------------------------------------------------------ */
  /* Produits : section 7.2 > Produit                                     */
  /* type formule | offre | carnet. Pas de champ club : les clubs          */
  /* accessibles découlent de la catégorie (section 7.4).                  */
  /* prix[tarif][engagement] = null quand le prix n'est pas connu.          */
  /* Un tarif absent de prix s'affiche au prix adulte avec la mention       */
  /* "Pas de tarif [x], prix adulte" (B.3 > Page Tarifs > Règles).          */
  /* ------------------------------------------------------------------ */
  produits: [
    {
      id: 'formule-gym', photo: 'Photo plateau musculation, ambiance libre-service', type: 'formule', nom: 'GYM', categorie: 'gym', ordre: 1,
      inclus: { plateau: true, cours: false, aqua: false, coaching: false },
      prix: { adulte: { sans: null, '12mois': null } },
      conditions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      idMetier: null
    },
    {
      id: 'formule-essential', photo: 'Photo cours collectif en salle', type: 'formule', nom: 'Essential', categorie: 'essential', ordre: 2,
      inclus: { plateau: true, cours: true, aqua: false, coaching: '[X] séances' },
      prix: {
        adulte: { sans: null, '12mois': null },
        ado:    { sans: null, '12mois': null },
        jeune:  { sans: null, '12mois': null },
        senior: { sans: null, '12mois': null }
      },
      conditions: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      idMetier: null
    },
    {
      id: 'formule-premium', photo: 'Photo bassin de natation', type: 'formule', nom: 'Premium', categorie: 'premium', ordre: 3,
      inclus: { plateau: true, cours: true, aqua: true, coaching: '[X] séances' },
      prix: {
        adulte: { sans: null, '12mois': null },
        ado:    { sans: null, '12mois': null },
        jeune:  { sans: null, '12mois': null },
        senior: { sans: null, '12mois': null }
      },
      conditions: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      idMetier: null
    },

    /* Offres Black Friday. Seuls prix réels du lab : ils sont fournis.
       dureeMois sert au calcul de "soit env. CHF X.– par mois", qui est
       toujours calculé, jamais saisi (B.3 > Page Tarifs > trame > 3). */
    {
      id: 'bf-premium', photo: 'Photo ambiance club, visuel de campagne', type: 'offre', nom: 'Black Friday Premium', categorie: 'premium', ordre: 1,
      duree: '7 mois', dureeMois: 7,
      inclus: { plateau: true, cours: true, aqua: true, coaching: '[X] séances' },
      prix: { adulte: { unique: 777 } },
      conditions: 'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
      validite: { debut: '2026-11-21', fin: '2026-12-01' },
      idMetier: null
    },
    {
      id: 'bf-essential', photo: 'Photo ambiance club, visuel de campagne', type: 'offre', nom: 'Black Friday Essential', categorie: 'essential', ordre: 2,
      duree: '7 mois et 7 semaines', dureeMois: 8.61,
      inclus: { plateau: true, cours: true, aqua: false, coaching: '[X] séances' },
      prix: { adulte: { unique: 777 } },
      conditions: 'Excepteur sint occaecat cupidatat non proident sunt in culpa.',
      validite: { debut: '2026-11-21', fin: '2026-12-01' },
      idMetier: null
    },

    /* Carnets d'entrées : deux volumes, 5 et 10 entrées, dans chacune des
       trois catégories. Chaque carnet a une durée de validité, différente
       selon le volume. Volumes posés par Hugo le 2026-09-14, durées et prix
       encore inconnus, l'offre est en cours de construction (Q13, Q28).
       "duree" est le même champ que sur les offres : une durée en toutes
       lettres, affichée telle quelle. */
    { id: 'carnet-gym-5', photo: 'Photo entrée du club', type: 'carnet', nom: 'Carnet de 5 entrées GYM', categorie: 'gym', ordre: 1,
      nbEntrees: 5, duree: null, prix: { adulte: { unique: null } },
      conditions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', idMetier: null },
    { id: 'carnet-gym-10', photo: 'Photo entrée du club', type: 'carnet', nom: 'Carnet de 10 entrées GYM', categorie: 'gym', ordre: 2,
      nbEntrees: 10, duree: null, prix: { adulte: { unique: null } },
      conditions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', idMetier: null },

    { id: 'carnet-essential-5', photo: 'Photo cours collectif en salle', type: 'carnet', nom: 'Carnet de 5 entrées Essential', categorie: 'essential', ordre: 3,
      nbEntrees: 5, duree: null, prix: { adulte: { unique: null } },
      conditions: 'Sed do eiusmod tempor incididunt ut labore et dolore magna.', idMetier: null },
    { id: 'carnet-essential-10', photo: 'Photo cours collectif en salle', type: 'carnet', nom: 'Carnet de 10 entrées Essential', categorie: 'essential', ordre: 4,
      nbEntrees: 10, duree: null, prix: { adulte: { unique: null } },
      conditions: 'Sed do eiusmod tempor incididunt ut labore et dolore magna.', idMetier: null },

    { id: 'carnet-premium-5', photo: 'Photo cours aquatique', type: 'carnet', nom: 'Carnet de 5 entrées Premium', categorie: 'premium', ordre: 5,
      nbEntrees: 5, duree: null, prix: { adulte: { unique: null } },
      conditions: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.', idMetier: null },
    { id: 'carnet-premium-10', photo: 'Photo cours aquatique', type: 'carnet', nom: 'Carnet de 10 entrées Premium', categorie: 'premium', ordre: 6,
      nbEntrees: 10, duree: null, prix: { adulte: { unique: null } },
      conditions: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.', idMetier: null }
  ],

  /* ------------------------------------------------------------------ */
  /* Promotions : une remise sur des produits qui existent déjà            */
  /* (B.3 > Page Tarifs > Trame > 3 : "Une remise sur un produit existant  */
  /* s'affiche en pastille + prix barré sur sa carte").                    */
  /*                                                                       */
  /* À ne pas confondre avec un produit de type "offre", qui est un produit */
  /* promo dédié, avec son nom, sa durée et son prix propres. Ici on ne     */
  /* crée pas de produit : on applique un pourcentage à une liste de        */
  /* produits existants, abonnements ou carnets, indifféremment.            */
  /*                                                                       */
  /* La remise se saisit en pourcentage. Le prix remisé est calculé, jamais */
  /* saisi : un prix catalogue qui change met à jour la promo tout seul.    */
  /*                                                                       */
  /* En production, ce sont les dates de validité qui décident de la promo  */
  /* en cours. Dans le lab, c'est le sélecteur d'état qui la simule, pour   */
  /* qu'on puisse montrer les deux cas sans changer les données.           */
  /* Exemples posés par Hugo le 2026-09-14 : tous les carnets de 10 entrées */
  /* à -20%, et les abonnements Essential et Premium à -15%. Le second cas  */
  /* est un abonnement simplement remisé, sans produit dédié à la Black     */
  /* Friday. Aucune des deux n'est une vraie campagne Harmony (Q29).        */
  /* ------------------------------------------------------------------ */
  promotions: [
    {
      id: 'carnets-10',
      nom: 'Les carnets de 10 entrées à -20%',
      remise: { type: 'pourcentage', valeur: 20 },
      produits: ['carnet-gym-10', 'carnet-essential-10', 'carnet-premium-10'],
      validite: { debut: '2026-09-01', fin: '2026-09-30' },
      conditions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
      id: 'abos-essential-premium',
      nom: 'Essential et Premium à -15%',
      remise: { type: 'pourcentage', valeur: 15 },
      produits: ['formule-essential', 'formule-premium'],
      /* Tranché par Hugo le 2026-09-14 : la remise porte sur l'engagement
         12 mois, pas sur le sans engagement. null vaudrait "les deux".
         Le libellé de l'engagement se lit dans le référentiel, jamais ici. */
      engagements: ['12mois'],
      validite: { debut: '2026-09-01', fin: '2026-09-30' },
      conditions: 'Sed do eiusmod tempor incididunt ut labore et dolore magna.'
    }
  ],

  /* ------------------------------------------------------------------ */
  /* Extras : section 7.2 > Extra                                         */
  /* C'est ici, et nulle part ailleurs, que se saisissent les clubs où un  */
  /* extra est proposé. La fiche club, la page Tarifs et la fiche cours    */
  /* lisent cette donnée (B.3 > Fiche club dans le CMS).                   */
  /*                                                                      */
  /* Liste provisoire posée par Hugo le 2026-09-14, en attendant celle     */
  /* d'Harmony. Les trois derniers sont proposés dans les clubs Essential  */
  /* et Premium, c'est-à-dire partout sauf Genève · Pâquis, le seul GYM.   */
  /* ------------------------------------------------------------------ */
  extras: [
    /* Hyrox a sa propre fiche cours et ses propres clubs. */
    { id: 'hyrox', nom: 'Hyrox', type: 'sgt',
      clubs: ['geneve-paquis', 'meyrin'],
      modeVente: 'en-ligne', prix: null, idMetier: null, cours: 'hyrox',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt.' },

    /* Tous les autres Small Group Training, en attendant leur liste
       détaillée : B.3 veut un Extra par Small Group Training, celui-ci les
       représente tous. Voir questions.md > Q27. */
    { id: 'small-group-training', nom: 'Small Group Training', type: 'sgt',
      clubs: ['blandonnet', 'geneve-eaux-vives', 'geneve-la-praille', 'meyrin',
              'versoix', 'veyrier', 'denges', 'gland', 'signy'],
      modeVente: 'en-ligne', prix: null, idMetier: null, cours: null,
      regroupeAValider: true,
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.' },

    { id: 'service-pressing', nom: 'Service Pressing', type: 'service',
      clubs: ['blandonnet', 'geneve-eaux-vives', 'geneve-la-praille', 'meyrin',
              'versoix', 'veyrier', 'denges', 'gland', 'signy'],
      modeVente: 'en-ligne', prix: null, idMetier: null, cours: null,
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.' },

    { id: 'gel-abonnement', nom: "Gel de l'abonnement", type: 'service',
      clubs: ['blandonnet', 'geneve-eaux-vives', 'geneve-la-praille', 'meyrin',
              'versoix', 'veyrier', 'denges', 'gland', 'signy'],
      modeVente: 'en-ligne', prix: null, idMetier: null, cours: null,
      description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.' },

    /* B.3 > Catégories de clubs : « Les séances en plus sont un Extra vendu
       en club uniquement. » Donc pas de prix ni de bouton. */
    { id: 'coaching-plus', nom: 'Séances de coaching en plus', type: 'service',
      clubs: ['blandonnet', 'geneve-eaux-vives', 'geneve-la-praille', 'meyrin',
              'versoix', 'veyrier', 'denges', 'gland', 'signy'],
      modeVente: 'en-club', prix: null, idMetier: null, cours: null,
      description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.' }
  ],

  /* ------------------------------------------------------------------ */
  /* Cours : section 7.2 > Cours                                          */
  /*                                                                      */
  /* Mapping objectifs et familles : doc de septembre, relayé par Hugo le  */
  /* 2026-09-14. Les entrées marquées aValider sont ses propositions pour  */
  /* les trous du doc, pas des décisions.                                  */
  /*                                                                      */
  /* famille     : la discipline à variantes, ou null                      */
  /* traitement  : page | section | filtre-intensite | filtre-format       */
  /*               null quand la décision n'est pas prise                  */
  /* destination : résolue ici, jamais recalculée à l'affichage (B.3 >     */
  /*               Destination des cours)                                  */
  /*                                                                      */
  /* Un cours sans famille a toujours une page : B.3 ne décrit les cours   */
  /* sans page propre que comme des variantes de famille, et impose qu'un  */
  /* cours au planning ne soit jamais orphelin.                            */
  /*                                                                      */
  /* objectifSecondaire : le doc de septembre n'en définit aucun. Le champ */
  /* existe, il reste vide sauf sur les deux cas donnés par Hugo.          */
  /* ------------------------------------------------------------------ */
  cours: [

    /* --- Famille Pilates ------------------------------------------- */
    { id: 'pilates', nom: 'Pilates', famille: 'pilates', traitement: 'page',
      objectifPrincipal: 'se-renforcer', objectifSecondaire: 'bouger-mieux', objectifsAValider: true,
      intensite: 'modere', format: 'salle', estExtra: false, extra: null,
      coachs: ['sofia'],
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, quis nostrud exercitation ullamco laboris.',
      benefices: ['Lorem ipsum dolor sit amet', 'Consectetur adipiscing elit', 'Sed do eiusmod tempor'] },
    { id: 'trx-pilates', nom: 'TRX Pilates', famille: 'pilates', traitement: 'page',
      objectifPrincipal: 'se-renforcer', objectifSecondaire: null,
      intensite: 'modere', format: 'salle', estExtra: false, extra: null,
      coachs: ['sofia'],
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      benefices: ['Ut enim ad minim veniam', 'Quis nostrud exercitation', 'Ullamco laboris nisi'] },
    { id: 'pilates-gym-dos', nom: 'Pilates Gym Dos', famille: 'pilates', traitement: 'page',
      objectifPrincipal: 'bouger-mieux', objectifSecondaire: null,
      intensite: 'doux', format: 'salle', estExtra: false, extra: null,
      coachs: ['sofia'],
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      benefices: ['Duis aute irure dolor', 'In reprehenderit in voluptate', 'Velit esse cillum dolore'] },
    { id: 'swiss-ball-pilates', nom: 'Swiss Ball Pilates', famille: 'pilates', traitement: 'section',
      objectifPrincipal: 'se-renforcer', objectifSecondaire: null,
      intensite: 'modere', format: 'salle', estExtra: false, extra: null,
      coachs: ['sofia'],
      description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.',
      benefices: [] },
    { id: 'pilates-stretching', nom: 'Pilates Stretching', famille: 'pilates', traitement: 'section',
      objectifPrincipal: 'bouger-mieux', objectifSecondaire: null,
      intensite: 'doux', format: 'salle', estExtra: false, extra: null,
      coachs: ['sofia'],
      description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.',
      benefices: [] },
    { id: 'pilates-avance', nom: 'Pilates Avancé', famille: 'pilates', traitement: 'filtre-intensite',
      objectifPrincipal: 'se-renforcer', objectifSecondaire: null,
      intensite: 'intense', format: 'salle', estExtra: false, extra: null,
      coachs: ['sofia'], description: '', benefices: [] },
    { id: 'pilates-privilege', nom: 'Pilates Privilège', famille: 'pilates', traitement: 'filtre-format',
      objectifPrincipal: 'se-renforcer', objectifSecondaire: null,
      intensite: 'modere', format: 'petit-groupe', estExtra: false, extra: null,
      coachs: ['sofia'], description: '', benefices: [] },

    /* --- Famille Yoga ---------------------------------------------- */
    /* traitement null : page ou section n'est pas tranché pour ces
       variantes, voir questions.md > Q24. */
    { id: 'yoga', nom: 'Yoga', famille: 'yoga', traitement: 'page',
      objectifPrincipal: 'se-detendre', objectifSecondaire: null,
      intensite: 'doux', format: 'salle', estExtra: false, extra: null,
      coachs: ['sofia', 'nadia'],
      description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
      benefices: ['Nemo enim ipsam voluptatem', 'Quia voluptas sit aspernatur', 'Aut odit aut fugit'] },
    { id: 'hatha-yoga', nom: 'Hatha Yoga', famille: 'yoga', traitement: null,
      objectifPrincipal: 'se-detendre', objectifSecondaire: null,
      intensite: 'doux', format: 'salle', estExtra: false, extra: null,
      coachs: ['sofia'],
      description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit.',
      benefices: [] },
    { id: 'yin-yoga', nom: 'Yin Yoga', famille: 'yoga', traitement: null,
      objectifPrincipal: 'se-detendre', objectifSecondaire: null,
      intensite: 'doux', format: 'salle', estExtra: false, extra: null,
      coachs: ['nadia'],
      description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
      benefices: [] },
    { id: 'yoga-vinyasa', nom: 'Yoga Vinyasa', famille: 'yoga', traitement: null,
      objectifPrincipal: 'se-detendre', objectifSecondaire: null,
      intensite: 'modere', format: 'salle', estExtra: false, extra: null,
      coachs: ['sofia'],
      description: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae.',
      benefices: [] },
    { id: 'air-yoga', nom: 'Air Yoga', famille: 'yoga', traitement: null,
      objectifPrincipal: 'se-detendre', objectifSecondaire: null,
      intensite: 'modere', format: 'salle', estExtra: false, extra: null,
      coachs: ['nadia'],
      description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
      benefices: [] },
    { id: 'yoga-dos', nom: 'Yoga Dos', famille: 'yoga', traitement: null,
      objectifPrincipal: 'bouger-mieux', objectifSecondaire: null,
      intensite: 'doux', format: 'salle', estExtra: false, extra: null,
      coachs: ['sofia'],
      description: 'Et harum quidem rerum facilis est et expedita distinctio, nam libero tempore cum soluta.',
      benefices: [] },

    /* --- Famille Les Mills ------------------------------------------ */
    /* « Presque tous les formats Les Mills ont du trafic, donc ce sera
       quasiment une page de liens, avec peu ou pas de sections. » */
    { id: 'les-mills-body-pump', nom: 'Les Mills Body Pump', famille: 'les-mills', traitement: 'page',
      objectifPrincipal: 'se-renforcer', objectifSecondaire: null,
      intensite: 'modere', format: 'salle', estExtra: false, extra: null,
      coachs: ['marc', 'lea'],
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      benefices: ['Lorem ipsum dolor sit amet', 'Consectetur adipiscing elit', 'Sed do eiusmod tempor'] },
    { id: 'les-mills-body-attack', nom: 'Les Mills Body Attack', famille: 'les-mills', traitement: 'page',
      objectifPrincipal: 'se-depenser', objectifSecondaire: null,
      intensite: 'intense', format: 'salle', estExtra: false, extra: null,
      coachs: ['karim'],
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
      benefices: ['Ut enim ad minim veniam', 'Quis nostrud exercitation', 'Ullamco laboris nisi'] },
    { id: 'les-mills-body-balance', nom: 'Les Mills Body Balance', famille: 'les-mills', traitement: 'page',
      objectifPrincipal: 'se-detendre', objectifSecondaire: 'bouger-mieux', objectifsAValider: true,
      intensite: 'doux', format: 'salle', estExtra: false, extra: null,
      coachs: ['sofia', 'lea'],
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.',
      benefices: ['Duis aute irure dolor', 'In reprehenderit in voluptate', 'Velit esse cillum'] },
    { id: 'les-mills-body-combat', nom: 'Les Mills Body Combat', famille: 'les-mills', traitement: 'page',
      objectifPrincipal: 'se-depenser', objectifSecondaire: null, objectifsAValider: true,
      intensite: 'intense', format: 'salle', estExtra: false, extra: null,
      coachs: ['karim'],
      description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.',
      benefices: ['Excepteur sint occaecat', 'Cupidatat non proident', 'Sunt in culpa qui officia'] },
    { id: 'les-mills-rpm', nom: 'Les Mills RPM', famille: 'les-mills', traitement: 'page',
      objectifPrincipal: 'se-depenser', objectifSecondaire: null,
      intensite: 'intense', format: 'salle', estExtra: false, extra: null,
      coachs: ['marc', 'karim'],
      description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      benefices: ['Sed ut perspiciatis unde', 'Omnis iste natus error', 'Sit voluptatem accusantium'] },
    { id: 'les-mills-core', nom: 'Les Mills Core', famille: 'les-mills', traitement: 'page',
      objectifPrincipal: 'se-renforcer', objectifSecondaire: null,
      intensite: 'modere', format: 'salle', estExtra: false, extra: null,
      coachs: ['lea'],
      description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      benefices: ['Nemo enim ipsam voluptatem', 'Quia voluptas sit', 'Aspernatur aut odit'] },
    { id: 'les-mills-shapes', nom: 'Les Mills Shapes', famille: 'les-mills', traitement: 'page',
      objectifPrincipal: null, objectifSecondaire: null,
      intensite: 'modere', format: 'salle', estExtra: false, extra: null,
      coachs: ['lea'],
      description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur.',
      benefices: [] },
    { id: 'les-mills-ceremony', nom: 'Les Mills Ceremony', famille: 'les-mills', traitement: 'page',
      objectifPrincipal: 'se-depasser', objectifSecondaire: null,
      intensite: 'intense', format: 'salle', estExtra: false, extra: null,
      coachs: ['thomas'],
      description: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil.',
      benefices: ['Quis autem vel eum iure', 'Reprehenderit qui in ea', 'Voluptate velit esse'] },
    { id: 'les-mills-grit', nom: 'Les Mills Grit', famille: 'les-mills', traitement: 'page',
      objectifPrincipal: 'se-depasser', objectifSecondaire: null,
      intensite: 'intense', format: 'petit-groupe', estExtra: false, extra: null,
      coachs: ['thomas', 'karim'],
      description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
      benefices: ['At vero eos et accusamus', 'Et iusto odio dignissimos', 'Ducimus qui blanditiis'] },

    /* --- Famille Aqua ------------------------------------------------ */
    { id: 'aqua-gym', nom: 'Aqua Gym', famille: 'aqua', traitement: null,
      objectifPrincipal: 'se-depenser', objectifSecondaire: null, objectifsAValider: true,
      intensite: 'doux', format: 'aqua', estExtra: false, extra: null,
      coachs: ['nadia'],
      description: 'Et harum quidem rerum facilis est et expedita distinctio, nam libero tempore.',
      benefices: [] },
    { id: 'aqua-bike', nom: 'Aqua Bike', famille: 'aqua', traitement: null,
      objectifPrincipal: 'se-depenser', objectifSecondaire: null, objectifsAValider: true,
      intensite: 'modere', format: 'aqua', estExtra: false, extra: null,
      coachs: ['nadia'],
      description: 'Cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime.',
      benefices: [] },
    { id: 'aqua-zumba', nom: 'Aqua Zumba', famille: 'aqua', traitement: null,
      objectifPrincipal: 'danser', objectifSecondaire: null,
      intensite: 'modere', format: 'aqua', estExtra: false, extra: null,
      coachs: ['nadia', 'lea'],
      description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe.',
      benefices: [] },
    { id: 'aqua-jogger', nom: 'Aqua Jogger', famille: 'aqua', traitement: null,
      objectifPrincipal: 'se-depenser', objectifSecondaire: null, objectifsAValider: true,
      intensite: 'modere', format: 'aqua', estExtra: false, extra: null,
      coachs: ['nadia'],
      description: 'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus.',
      benefices: [] },

    /* --- Fiches sans famille ---------------------------------------- */
    { id: 'caf', nom: 'CAF', famille: null, traitement: 'page',
      objectifPrincipal: 'se-renforcer', objectifSecondaire: null,
      intensite: 'modere', format: 'salle', estExtra: false, extra: null,
      coachs: ['lea'],
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.',
      benefices: ['Lorem ipsum dolor sit amet', 'Consectetur adipiscing elit', 'Sed do eiusmod tempor'] },
    { id: 'total-sculpt', nom: 'Total Sculpt', famille: null, traitement: 'page',
      objectifPrincipal: 'se-renforcer', objectifSecondaire: null,
      intensite: 'modere', format: 'salle', estExtra: false, extra: null,
      coachs: ['lea', 'marc'],
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.',
      benefices: ['Ut enim ad minim veniam', 'Quis nostrud exercitation', 'Ullamco laboris nisi'] },
    { id: 'cardio-sculpt', nom: 'Cardio Sculpt', famille: null, traitement: 'page',
      objectifPrincipal: 'se-renforcer', objectifSecondaire: null,
      intensite: 'modere', format: 'salle', estExtra: false, extra: null,
      coachs: ['marc'],
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
      benefices: ['Duis aute irure dolor', 'In reprehenderit', 'Voluptate velit esse'] },
    { id: 'core-training', nom: 'Core Training', famille: null, traitement: 'page',
      objectifPrincipal: 'se-renforcer', objectifSecondaire: null,
      intensite: 'modere', format: 'salle', estExtra: false, extra: null,
      coachs: ['thomas'],
      description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.',
      benefices: ['Excepteur sint occaecat', 'Cupidatat non proident', 'Sunt in culpa'] },
    { id: 'abdos-flash', nom: 'Abdos Flash', famille: null, traitement: 'page',
      objectifPrincipal: 'se-renforcer', objectifSecondaire: null,
      intensite: 'modere', format: 'salle', estExtra: false, extra: null,
      coachs: ['lea'],
      description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.',
      benefices: ['Sed ut perspiciatis', 'Unde omnis iste natus', 'Error sit voluptatem'] },
    { id: 'hiit', nom: 'HIIT', famille: null, traitement: 'page',
      objectifPrincipal: 'se-depenser', objectifSecondaire: null,
      intensite: 'intense', format: 'salle', estExtra: false, extra: null,
      coachs: ['thomas', 'lea'],
      description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      benefices: ['Nemo enim ipsam', 'Quia voluptas sit', 'Aspernatur aut odit'] },
    { id: 'circuit-training', nom: 'Circuit Training', famille: null, traitement: 'page',
      objectifPrincipal: 'se-depenser', objectifSecondaire: null,
      intensite: 'intense', format: 'salle', estExtra: false, extra: null,
      coachs: ['thomas'],
      description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur.',
      benefices: ['Neque porro quisquam', 'Est qui dolorem ipsum', 'Quia dolor sit amet'] },
    { id: 'cross-training', nom: 'Cross Training', famille: null, traitement: 'page',
      objectifPrincipal: 'se-depenser', objectifSecondaire: null,
      intensite: 'intense', format: 'salle', estExtra: false, extra: null,
      coachs: ['thomas', 'karim'],
      description: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam.',
      benefices: ['Quis autem vel eum iure', 'Reprehenderit qui in ea', 'Voluptate velit esse'] },
    { id: 'indoor-cycling', nom: 'Indoor Cycling', famille: null, traitement: 'page',
      objectifPrincipal: 'se-depenser', objectifSecondaire: null,
      intensite: 'intense', format: 'salle', estExtra: false, extra: null,
      coachs: ['marc', 'karim'],
      description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis.',
      benefices: ['At vero eos et accusamus', 'Et iusto odio', 'Dignissimos ducimus'] },
    { id: 'step', nom: 'Step', famille: null, traitement: 'page',
      objectifPrincipal: 'se-depenser', objectifSecondaire: null,
      intensite: 'modere', format: 'salle', estExtra: false, extra: null,
      coachs: ['lea'],
      description: 'Et harum quidem rerum facilis est et expedita distinctio nam libero tempore.',
      benefices: ['Et harum quidem rerum', 'Facilis est et expedita', 'Distinctio nam libero'] },
    { id: 'core-bike', nom: 'Core Bike', famille: null, traitement: 'page',
      objectifPrincipal: 'se-depenser', objectifSecondaire: null,
      intensite: 'intense', format: 'salle', estExtra: false, extra: null,
      coachs: ['marc'],
      description: 'Cum soluta nobis est eligendi optio cumque nihil impedit quo minus id.',
      benefices: ['Cum soluta nobis', 'Est eligendi optio', 'Cumque nihil impedit'] },
    { id: 'hybrid-training', nom: 'Hybrid Training by Harmony', famille: null, traitement: 'page',
      objectifPrincipal: 'se-depasser', objectifSecondaire: null,
      intensite: 'intense', format: 'salle', estExtra: false, extra: null,
      coachs: ['thomas', 'marc'],
      description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus.',
      benefices: ['Temporibus autem', 'Quibusdam et aut officiis', 'Debitis aut rerum'] },
    { id: 'stretching', nom: 'Stretching', famille: null, traitement: 'page',
      objectifPrincipal: 'bouger-mieux', objectifSecondaire: null,
      intensite: 'doux', format: 'salle', estExtra: false, extra: null,
      coachs: ['sofia'],
      description: 'Itaque earum rerum hic tenetur a sapiente delectus ut aut reiciendis.',
      benefices: ['Itaque earum rerum', 'Hic tenetur a sapiente', 'Delectus ut aut'] },
    { id: 'mobilite-stretching', nom: 'Mobilité Stretching', famille: null, traitement: 'page',
      objectifPrincipal: 'bouger-mieux', objectifSecondaire: null,
      intensite: 'doux', format: 'salle', estExtra: false, extra: null,
      coachs: ['sofia'],
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.',
      benefices: [] },
    { id: 'gym-douce', nom: 'Gym Douce', famille: null, traitement: 'page',
      objectifPrincipal: 'bouger-mieux', objectifSecondaire: null,
      intensite: 'doux', format: 'salle', estExtra: false, extra: null,
      coachs: ['nadia'],
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      benefices: [] },
    { id: 'gym-douce-dos', nom: 'Gym Douce Dos', famille: null, traitement: 'page',
      objectifPrincipal: 'bouger-mieux', objectifSecondaire: null,
      intensite: 'doux', format: 'salle', estExtra: false, extra: null,
      coachs: ['nadia'],
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
      benefices: [] },
    { id: 'move-and-mind', nom: 'Move & Mind', famille: null, traitement: 'page',
      objectifPrincipal: 'bouger-mieux', objectifSecondaire: null,
      intensite: 'doux', format: 'salle', estExtra: false, extra: null,
      coachs: ['sofia'],
      description: 'Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia.',
      benefices: [] },
    { id: 'cours-zen', nom: 'Cours Zen', famille: null, traitement: 'page',
      objectifPrincipal: 'se-detendre', objectifSecondaire: null,
      intensite: 'doux', format: 'salle', estExtra: false, extra: null,
      coachs: ['nadia'],
      description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.',
      benefices: [] },
    { id: 'sophrologie-stretching', nom: 'Sophrologie Stretching', famille: null, traitement: 'page',
      objectifPrincipal: 'se-detendre', objectifSecondaire: null,
      intensite: 'doux', format: 'salle', estExtra: false, extra: null,
      coachs: ['sofia'],
      description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit.',
      benefices: [] },
    { id: 'zumba', nom: 'Zumba', famille: null, traitement: 'page',
      objectifPrincipal: 'danser', objectifSecondaire: null,
      intensite: 'modere', format: 'salle', estExtra: false, extra: null,
      coachs: ['lea'],
      description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci.',
      benefices: ['Neque porro quisquam est', 'Qui dolorem ipsum quia', 'Dolor sit amet'] },
    { id: 'salsa', nom: 'Salsa', famille: null, traitement: 'page',
      objectifPrincipal: 'danser', objectifSecondaire: null,
      intensite: 'modere', format: 'salle', estExtra: false, extra: null,
      coachs: ['lea'],
      description: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.',
      benefices: [] },
    { id: 'all-styles-dance', nom: 'All Styles Dance', famille: null, traitement: 'page',
      objectifPrincipal: 'danser', objectifSecondaire: null,
      intensite: 'modere', format: 'salle', estExtra: false, extra: null,
      coachs: ['lea'],
      description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis.',
      benefices: [] },
    { id: 'boxe', nom: 'Boxe', famille: null, traitement: 'page',
      objectifPrincipal: 'se-depenser', objectifSecondaire: null, objectifsAValider: true,
      intensite: 'intense', format: 'salle', estExtra: false, extra: null,
      coachs: ['karim'],
      description: 'Et harum quidem rerum facilis est et expedita distinctio nam libero.',
      benefices: [] },

    /* --- Small Group Training : un Extra, pas un cours inclus --------- */
    { id: 'hyrox', nom: 'Hyrox', famille: null, traitement: 'page',
      objectifPrincipal: 'se-depasser', objectifSecondaire: null,
      intensite: 'intense', format: 'petit-groupe', estExtra: true, extra: 'hyrox',
      coachs: ['thomas'],
      description: 'Cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.',
      benefices: ['Cum soluta nobis', 'Est eligendi optio', 'Cumque nihil impedit'] }
  ],

  /* ------------------------------------------------------------------ */
  /* Coachs : section 7.2, fiche détaillée en B.3 > Fiche coach dans le CMS */
  /* Personnes fictives. Prénom seul, 3 badges maximum.                     */
  /* ------------------------------------------------------------------ */
  coachs: [
    { id: 'lea', prenom: 'Léa', photo: 'Portrait coach',
      badges: ['Les Mills', 'Small Group Training'], verticales: ['fitness'],
      lieux: ['blandonnet', 'meyrin', 'gland'], coachingPersonnel: true,
      phrase: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 'marc', prenom: 'Marc', photo: 'Portrait coach',
      badges: ['Les Mills'], verticales: ['fitness'],
      lieux: ['blandonnet', 'geneve-eaux-vives', 'signy'], coachingPersonnel: false,
      phrase: 'Sed do eiusmod tempor incididunt ut labore et dolore magna.' },
    { id: 'sofia', prenom: 'Sofia', photo: 'Portrait coach',
      badges: ['Yoga', 'Pilates'], verticales: ['fitness'],
      lieux: ['geneve-eaux-vives', 'geneve-la-praille', 'veyrier'], coachingPersonnel: true,
      phrase: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.' },
    { id: 'nadia', prenom: 'Nadia', photo: 'Portrait coach',
      badges: ['Aqua', 'Yoga'], verticales: ['fitness', 'aqua'],
      lieux: ['geneve-la-praille', 'veyrier', 'denges'], coachingPersonnel: false,
      phrase: 'Duis aute irure dolor in reprehenderit in voluptate velit.' },
    { id: 'thomas', prenom: 'Thomas', photo: 'Portrait coach',
      badges: ['Small Group Training', 'Coach personnel'], verticales: ['fitness'],
      lieux: ['geneve-paquis', 'geneve-la-praille', 'meyrin'], coachingPersonnel: true,
      phrase: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa.' },
    { id: 'karim', prenom: 'Karim', photo: 'Portrait coach',
      badges: ['Les Mills', 'Coach personnel'], verticales: ['fitness'],
      lieux: ['meyrin', 'versoix', 'denges'], coachingPersonnel: true,
      phrase: 'Qui officia deserunt mollit anim id est laborum lorem ipsum.' }
  ],

  /* ------------------------------------------------------------------ */
  /* Séances : section 7.2 > Club > champ "séances"                       */
  /* Planning type saisi au CMS. Un club GYM n'a que des Small Group       */
  /* Training. Le format aqua n'existe que dans les clubs Premium.         */
  /* ------------------------------------------------------------------ */
  seances: [
    { club: 'geneve-paquis', jour: 'lundi',    heure: '18:30', duree: 60, cours: 'hyrox' },
    { club: 'geneve-paquis', jour: 'mercredi', heure: '12:15', duree: 45, cours: 'hyrox' },
    { club: 'geneve-paquis', jour: 'samedi',   heure: '10:00', duree: 60, cours: 'hyrox' },

    { club: 'meyrin', jour: 'lundi',    heure: '12:15', duree: 45, cours: 'les-mills-body-pump' },
    { club: 'meyrin', jour: 'lundi',    heure: '19:00', duree: 55, cours: 'hiit' },
    { club: 'meyrin', jour: 'mardi',    heure: '09:30', duree: 60, cours: 'yoga' },
    { club: 'meyrin', jour: 'mardi',    heure: '18:30', duree: 60, cours: 'pilates' },
    { club: 'meyrin', jour: 'mercredi', heure: '18:30', duree: 50, cours: 'les-mills-rpm' },
    { club: 'meyrin', jour: 'jeudi',    heure: '12:15', duree: 45, cours: 'cross-training' },
    { club: 'meyrin', jour: 'jeudi',    heure: '19:00', duree: 60, cours: 'yoga-dos' },
    { club: 'meyrin', jour: 'vendredi', heure: '18:00', duree: 60, cours: 'zumba' },
    { club: 'meyrin', jour: 'samedi',   heure: '10:00', duree: 60, cours: 'hyrox' },
    { club: 'meyrin', jour: 'samedi',   heure: '11:15', duree: 60, cours: 'hybrid-training' },

    { club: 'geneve-la-praille', jour: 'lundi',    heure: '07:00', duree: 45, cours: 'aqua-bike' },
    { club: 'geneve-la-praille', jour: 'lundi',    heure: '12:15', duree: 45, cours: 'les-mills-body-pump' },
    { club: 'geneve-la-praille', jour: 'lundi',    heure: '18:30', duree: 60, cours: 'trx-pilates' },
    { club: 'geneve-la-praille', jour: 'mardi',    heure: '10:00', duree: 45, cours: 'aqua-gym' },
    { club: 'geneve-la-praille', jour: 'mardi',    heure: '18:30', duree: 60, cours: 'yoga-vinyasa' },
    { club: 'geneve-la-praille', jour: 'mercredi', heure: '12:15', duree: 45, cours: 'pilates' },
    { club: 'geneve-la-praille', jour: 'mercredi', heure: '19:00', duree: 45, cours: 'aqua-zumba' },
    { club: 'geneve-la-praille', jour: 'jeudi',    heure: '19:00', duree: 55, cours: 'les-mills-body-combat' },
    { club: 'geneve-la-praille', jour: 'vendredi', heure: '12:15', duree: 45, cours: 'hiit' },
    { club: 'geneve-la-praille', jour: 'vendredi', heure: '18:30', duree: 60, cours: 'les-mills-body-balance' },
    { club: 'geneve-la-praille', jour: 'samedi',   heure: '10:00', duree: 60, cours: 'hybrid-training' },

    { club: 'blandonnet', jour: 'lundi',    heure: '12:15', duree: 45, cours: 'hiit' },
    { club: 'blandonnet', jour: 'lundi',    heure: '18:30', duree: 60, cours: 'swiss-ball-pilates' },
    { club: 'blandonnet', jour: 'mardi',    heure: '18:30', duree: 60, cours: 'pilates' },
    { club: 'blandonnet', jour: 'mercredi', heure: '19:00', duree: 50, cours: 'indoor-cycling' },
    { club: 'blandonnet', jour: 'jeudi',    heure: '12:15', duree: 45, cours: 'les-mills-body-pump' },
    { club: 'blandonnet', jour: 'vendredi', heure: '12:15', duree: 30, cours: 'abdos-flash' },
    { club: 'blandonnet', jour: 'samedi',   heure: '10:30', duree: 60, cours: 'zumba' },

    { club: 'geneve-eaux-vives', jour: 'lundi',    heure: '18:30', duree: 60, cours: 'hatha-yoga' },
    { club: 'geneve-eaux-vives', jour: 'mardi',    heure: '12:15', duree: 45, cours: 'les-mills-body-pump' },
    { club: 'geneve-eaux-vives', jour: 'mercredi', heure: '19:00', duree: 55, cours: 'pilates-avance' },
    { club: 'geneve-eaux-vives', jour: 'jeudi',    heure: '12:15', duree: 45, cours: 'caf' },
    { club: 'geneve-eaux-vives', jour: 'jeudi',    heure: '19:00', duree: 60, cours: 'yin-yoga' },
    { club: 'geneve-eaux-vives', jour: 'vendredi', heure: '12:15', duree: 45, cours: 'hiit' },
    { club: 'geneve-eaux-vives', jour: 'samedi',   heure: '11:00', duree: 60, cours: 'salsa' },

    { club: 'versoix', jour: 'lundi',    heure: '19:00', duree: 50, cours: 'indoor-cycling' },
    { club: 'versoix', jour: 'mardi',    heure: '12:15', duree: 45, cours: 'stretching' },
    { club: 'versoix', jour: 'mercredi', heure: '12:15', duree: 45, cours: 'les-mills-body-combat' },
    { club: 'versoix', jour: 'jeudi',    heure: '18:30', duree: 60, cours: 'gym-douce' },
    { club: 'versoix', jour: 'samedi',   heure: '10:00', duree: 60, cours: 'zumba' },

    { club: 'veyrier', jour: 'lundi',    heure: '10:00', duree: 45, cours: 'aqua-gym' },
    { club: 'veyrier', jour: 'mardi',    heure: '18:30', duree: 60, cours: 'yoga' },
    { club: 'veyrier', jour: 'mercredi', heure: '07:00', duree: 45, cours: 'aqua-bike' },
    { club: 'veyrier', jour: 'mercredi', heure: '19:00', duree: 45, cours: 'aqua-jogger' },
    { club: 'veyrier', jour: 'jeudi',    heure: '12:15', duree: 45, cours: 'les-mills-core' },
    { club: 'veyrier', jour: 'vendredi', heure: '18:00', duree: 60, cours: 'pilates-privilege' },
    { club: 'veyrier', jour: 'samedi',   heure: '10:00', duree: 60, cours: 'air-yoga' },

    { club: 'denges', jour: 'lundi',    heure: '12:15', duree: 45, cours: 'cross-training' },
    { club: 'denges', jour: 'lundi',    heure: '18:30', duree: 60, cours: 'pilates-gym-dos' },
    { club: 'denges', jour: 'mardi',    heure: '10:00', duree: 45, cours: 'aqua-gym' },
    { club: 'denges', jour: 'mercredi', heure: '18:30', duree: 55, cours: 'les-mills-body-attack' },
    { club: 'denges', jour: 'jeudi',    heure: '07:00', duree: 45, cours: 'aqua-bike' },
    { club: 'denges', jour: 'jeudi',    heure: '19:00', duree: 45, cours: 'les-mills-grit' },
    { club: 'denges', jour: 'vendredi', heure: '12:15', duree: 45, cours: 'circuit-training' },
    { club: 'denges', jour: 'samedi',   heure: '10:00', duree: 60, cours: 'hybrid-training' },

    { club: 'gland', jour: 'lundi',    heure: '18:30', duree: 60, cours: 'zumba' },
    { club: 'gland', jour: 'mardi',    heure: '12:15', duree: 45, cours: 'core-training' },
    { club: 'gland', jour: 'mercredi', heure: '12:15', duree: 45, cours: 'les-mills-body-pump' },
    { club: 'gland', jour: 'jeudi',    heure: '18:30', duree: 60, cours: 'pilates-stretching' },
    { club: 'gland', jour: 'vendredi', heure: '19:00', duree: 50, cours: 'core-bike' },

    { club: 'signy', jour: 'mardi',    heure: '12:15', duree: 45, cours: 'hiit' },
    { club: 'signy', jour: 'mercredi', heure: '19:00', duree: 45, cours: 'step' },
    { club: 'signy', jour: 'jeudi',    heure: '18:30', duree: 60, cours: 'pilates' },
    { club: 'signy', jour: 'vendredi', heure: '12:15', duree: 45, cours: 'total-sculpt' },
    { club: 'signy', jour: 'samedi',   heure: '10:00', duree: 60, cours: 'les-mills-body-pump' }
  ]
};

/* ------------------------------------------------------------------ */
/* Résolution du champ "destination"                                    */
/*                                                                      */
/* B.3 > Destination des cours : « Chaque cours du planning a une        */
/* destination : sa fiche, la page de famille avec ancre sur la bonne    */
/* section pour une variante, la page mère pour un niveau ou un format.  */
/* Champ destination à prévoir par cours dans le CMS. »                  */
/*                                                                      */
/* Dans le CMS, ce champ est saisi ou calculé à l'enregistrement. Ici il */
/* est résolu une fois au chargement, pour que les données restent       */
/* lisibles. Les composants lisent cours.destination et ne connaissent   */
/* jamais la règle.                                                      */
/* ------------------------------------------------------------------ */
(function () {
  var D = window.DATA;
  function famille(id) {
    return D.referentiels.familles.find(function (f) { return f.id === id; }) || null;
  }
  D.cours.forEach(function (c) {
    var f = c.famille ? famille(c.famille) : null;

    if (!f) { c.destination = '/cours/' + c.id; c.aSaPage = true; return; }

    /* La page de la famille est celle de son cours générique. */
    if (f.coursGenerique === c.id) { c.destination = '/cours/' + f.slug; c.aSaPage = true; return; }

    if (c.traitement === 'page') { c.destination = '/cours/' + c.id; c.aSaPage = true; return; }
    if (c.traitement === 'filtre-intensite' || c.traitement === 'filtre-format') {
      c.destination = '/cours/' + f.slug; c.aSaPage = false; return;
    }
    /* section, ou traitement pas encore tranché : ancre sur la page de famille */
    c.destination = '/cours/' + f.slug + '#' + c.id;
    c.aSaPage = false;
  });
})();
