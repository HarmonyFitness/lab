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

    /* B.3 > Sport > les 3 hubs de catégorie */
    categoriesCours: [
      { id: 'cardio-renforcement', nom: 'Cardio & renforcement', slug: 'cardio-renforcement' },
      { id: 'yoga-pilates-doux',   nom: 'Yoga, Pilates & doux',  slug: 'yoga-pilates-doux' },
      { id: 'lesmills',            nom: 'LesMills',              slug: 'lesmills' }
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
      { id: 'piscine',      nom: 'Piscine',             aValider: true },
      { id: 'sauna',        nom: 'Sauna',               aValider: true },
      { id: 'hammam',       nom: 'Hammam',              aValider: true },
      { id: 'jacuzzi',      nom: 'Jacuzzi',             aValider: true },
      { id: 'jets',         nom: 'Jets massants',       aValider: true },
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
      id: 'formule-gym', type: 'formule', nom: 'GYM', categorie: 'gym', ordre: 1,
      inclus: { plateau: true, cours: false, aqua: false, coaching: false },
      prix: { adulte: { sans: null, '12mois': null } },
      conditions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      idMetier: null
    },
    {
      id: 'formule-essential', type: 'formule', nom: 'Essential', categorie: 'essential', ordre: 2,
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
      id: 'formule-premium', type: 'formule', nom: 'Premium', categorie: 'premium', ordre: 3,
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
      id: 'bf-premium', type: 'offre', nom: 'Black Friday Premium', categorie: 'premium', ordre: 1,
      duree: '7 mois', dureeMois: 7,
      inclus: { plateau: true, cours: true, aqua: true, coaching: '[X] séances' },
      prix: { adulte: { unique: 777 } },
      conditions: 'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
      validite: { debut: '2026-11-21', fin: '2026-12-01' },
      idMetier: null
    },
    {
      id: 'bf-essential', type: 'offre', nom: 'Black Friday Essential', categorie: 'essential', ordre: 2,
      duree: '7 mois et 7 semaines', dureeMois: 8.61,
      inclus: { plateau: true, cours: true, aqua: false, coaching: '[X] séances' },
      prix: { adulte: { unique: 777 } },
      conditions: 'Excepteur sint occaecat cupidatat non proident sunt in culpa.',
      validite: { debut: '2026-11-21', fin: '2026-12-01' },
      idMetier: null
    },

    /* Carnets d'entrées, un par catégorie. Volume et prix inconnus (Q13). */
    { id: 'carnet-gym', type: 'carnet', nom: "Carnet d'entrées GYM", categorie: 'gym', ordre: 1,
      nbEntrees: null, prix: { adulte: { unique: null } },
      conditions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', idMetier: null },
    { id: 'carnet-essential', type: 'carnet', nom: "Carnet d'entrées Essential", categorie: 'essential', ordre: 2,
      nbEntrees: null, prix: { adulte: { unique: null } },
      conditions: 'Sed do eiusmod tempor incididunt ut labore et dolore magna.', idMetier: null },
    { id: 'carnet-premium', type: 'carnet', nom: "Carnet d'entrées Premium", categorie: 'premium', ordre: 3,
      nbEntrees: null, prix: { adulte: { unique: null } },
      conditions: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.', idMetier: null }
  ],

  /* ------------------------------------------------------------------ */
  /* Extras : section 7.2 > Extra                                         */
  /* C'est ici, et nulle part ailleurs, que se saisissent les clubs où un  */
  /* extra est proposé. La fiche club, la page Tarifs et la fiche cours    */
  /* lisent cette donnée (B.3 > Fiche club dans le CMS).                   */
  /* ------------------------------------------------------------------ */
  extras: [
    { id: 'hyrox', nom: 'Hyrox', type: 'sgt',
      clubs: ['geneve-paquis', 'meyrin'],
      modeVente: 'en-ligne', prix: null, idMetier: null, cours: 'hyrox',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.' },

    { id: 'service-linge', nom: 'Service linge', type: 'service',
      clubs: ['geneve-la-praille', 'veyrier', 'denges'], clubsAValider: true,
      modeVente: 'en-ligne', prix: null, idMetier: null, cours: null,
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.' },

    { id: 'coaching-plus', nom: 'Séances de coaching en plus', type: 'service',
      clubs: ['blandonnet', 'geneve-eaux-vives', 'geneve-la-praille', 'meyrin',
              'versoix', 'veyrier', 'denges', 'gland', 'signy'], clubsAValider: true,
      modeVente: 'en-club', prix: null, idMetier: null, cours: null,
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.' }
  ],

  /* ------------------------------------------------------------------ */
  /* Cours : section 7.2 > Cours                                          */
  /* pageDediee : les 9 fiches retenues par B.3. Les autres sont la        */
  /* longue traîne, présentes au planning et aux filtres sans page.        */
  /* Les clubs qui proposent un cours se déduisent des séances.            */
  /* ------------------------------------------------------------------ */
  cours: [
    { id: 'yoga', nom: 'Yoga', pageDediee: true, categoriesCours: ['yoga-pilates-doux'],
      objectif: 'se-detendre', intensite: 'doux', format: 'salle', estExtra: false, extra: null,
      destination: 'fiche', coachs: ['sofia', 'nadia'],
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
      benefices: ['Lorem ipsum dolor sit amet', 'Consectetur adipiscing elit', 'Sed do eiusmod tempor'] },

    { id: 'pilates', nom: 'Pilates', pageDediee: true, categoriesCours: ['yoga-pilates-doux'],
      objectif: 'bouger-mieux', intensite: 'doux', format: 'salle', estExtra: false, extra: null,
      destination: 'fiche', coachs: ['sofia'],
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.',
      benefices: ['Ut enim ad minim veniam', 'Quis nostrud exercitation', 'Ullamco laboris nisi'] },

    { id: 'indoor-cycling', nom: 'Indoor Cycling (RPM)', pageDediee: true,
      categoriesCours: ['cardio-renforcement', 'lesmills'],
      objectif: 'se-depenser', intensite: 'intense', format: 'salle', estExtra: false, extra: null,
      destination: 'fiche', coachs: ['marc', 'karim'],
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
      benefices: ['Duis aute irure dolor', 'In reprehenderit in voluptate', 'Velit esse cillum dolore'] },

    { id: 'hiit', nom: 'HIIT', pageDediee: true, categoriesCours: ['cardio-renforcement'],
      objectif: 'se-depasser', intensite: 'intense', format: 'salle', estExtra: false, extra: null,
      destination: 'fiche', coachs: ['thomas', 'lea'],
      description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum sed ut perspiciatis.',
      benefices: ['Excepteur sint occaecat', 'Cupidatat non proident', 'Sunt in culpa qui officia'] },

    { id: 'cross-training', nom: 'Cross Training', pageDediee: true, categoriesCours: ['cardio-renforcement'],
      objectif: 'se-depasser', intensite: 'intense', format: 'salle', estExtra: false, extra: null,
      destination: 'fiche', coachs: ['thomas', 'karim'],
      description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam.',
      benefices: ['Sed ut perspiciatis unde', 'Omnis iste natus error', 'Sit voluptatem accusantium'] },

    { id: 'zumba', nom: 'Zumba', pageDediee: true, categoriesCours: ['cardio-renforcement'],
      objectif: 'danser', intensite: 'modere', format: 'salle', estExtra: false, extra: null,
      destination: 'fiche', coachs: ['lea'],
      description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores.',
      benefices: ['Nemo enim ipsam voluptatem', 'Quia voluptas sit aspernatur', 'Aut odit aut fugit'] },

    { id: 'body-pump', nom: 'LesMills Body Pump', pageDediee: true,
      categoriesCours: ['cardio-renforcement', 'lesmills'],
      objectif: 'se-renforcer', intensite: 'modere', format: 'salle', estExtra: false, extra: null,
      destination: 'fiche', coachs: ['marc', 'lea'],
      description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit sed quia non numquam.',
      benefices: ['Neque porro quisquam est', 'Qui dolorem ipsum quia', 'Dolor sit amet consectetur'] },

    { id: 'body-combat', nom: 'LesMills Body Combat', pageDediee: true,
      categoriesCours: ['cardio-renforcement', 'lesmills'],
      objectif: 'se-depenser', intensite: 'intense', format: 'salle', estExtra: false, extra: null,
      destination: 'fiche', coachs: ['karim'],
      description: 'Ut enim ad minima veniam quis nostrum exercitationem ullam corporis suscipit laboriosam nisi ut aliquid ex ea commodi.',
      benefices: ['Ut enim ad minima veniam', 'Quis nostrum exercitationem', 'Ullam corporis suscipit'] },

    { id: 'hybrid-training', nom: 'Hybrid Training by Harmony', pageDediee: true,
      categoriesCours: ['cardio-renforcement'],
      objectif: 'se-depasser', intensite: 'intense', format: 'salle', estExtra: false, extra: null,
      destination: 'fiche', coachs: ['thomas', 'marc'],
      description: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.',
      benefices: ['Quis autem vel eum iure', 'Reprehenderit qui in ea', 'Voluptate velit esse quam'] },

    /* Small Group Training : la fiche affiche la mention "Extra", les clubs
       et le prix, lus sur l'Extra (B.3 > Sport > Fiches cours dédiées). */
    { id: 'hyrox', nom: 'Hyrox', pageDediee: true, categoriesCours: [],
      objectif: 'se-depasser', intensite: 'intense', format: 'petit-groupe',
      estExtra: true, extra: 'hyrox',
      destination: 'fiche', coachs: ['thomas'],
      description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.',
      benefices: ['At vero eos et accusamus', 'Et iusto odio dignissimos', 'Ducimus qui blanditiis'] },

    /* Longue traîne : au planning et aux filtres, sans page dédiée. */
    { id: 'aquagym', nom: 'Aquagym', pageDediee: false, categoriesCours: [],
      objectif: 'bouger-mieux', intensite: 'doux', format: 'aqua', estExtra: false, extra: null,
      destination: 'mere', coachs: ['nadia'],
      description: 'Et harum quidem rerum facilis est et expedita distinctio.', benefices: [] },
    { id: 'aquabike', nom: 'Aquabike', pageDediee: false, categoriesCours: [],
      objectif: 'se-depenser', intensite: 'modere', format: 'aqua', estExtra: false, extra: null,
      destination: 'mere', coachs: ['nadia'],
      description: 'Nam libero tempore cum soluta nobis est eligendi optio.', benefices: [] }
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
  /* Planning type saisi au CMS. Alimente le planning de la page club,     */
  /* le "où pratiquer" des fiches cours, le filtre cours de /clubs et le   */
  /* nombre de cours par semaine. Une séance de Small Group Training       */
  /* porte le marqueur Extra, qui se déduit de son cours.                  */
  /* ------------------------------------------------------------------ */
  seances: [
    { club: 'geneve-paquis', jour: 'lundi',    heure: '18:30', duree: 60, cours: 'hyrox' },
    { club: 'geneve-paquis', jour: 'mercredi', heure: '12:15', duree: 45, cours: 'hyrox' },
    { club: 'geneve-paquis', jour: 'samedi',   heure: '10:00', duree: 60, cours: 'hyrox' },

    { club: 'meyrin', jour: 'lundi',    heure: '12:15', duree: 45, cours: 'body-pump' },
    { club: 'meyrin', jour: 'lundi',    heure: '19:00', duree: 55, cours: 'hiit' },
    { club: 'meyrin', jour: 'mardi',    heure: '09:30', duree: 60, cours: 'yoga' },
    { club: 'meyrin', jour: 'mercredi', heure: '18:30', duree: 50, cours: 'indoor-cycling' },
    { club: 'meyrin', jour: 'jeudi',    heure: '12:15', duree: 45, cours: 'cross-training' },
    { club: 'meyrin', jour: 'vendredi', heure: '18:00', duree: 60, cours: 'zumba' },
    { club: 'meyrin', jour: 'samedi',   heure: '10:00', duree: 60, cours: 'hyrox' },
    { club: 'meyrin', jour: 'samedi',   heure: '11:15', duree: 60, cours: 'hybrid-training' },

    { club: 'geneve-la-praille', jour: 'lundi',    heure: '07:00', duree: 45, cours: 'aquabike' },
    { club: 'geneve-la-praille', jour: 'lundi',    heure: '12:15', duree: 45, cours: 'body-pump' },
    { club: 'geneve-la-praille', jour: 'mardi',    heure: '10:00', duree: 45, cours: 'aquagym' },
    { club: 'geneve-la-praille', jour: 'mardi',    heure: '18:30', duree: 60, cours: 'yoga' },
    { club: 'geneve-la-praille', jour: 'mercredi', heure: '12:15', duree: 45, cours: 'pilates' },
    { club: 'geneve-la-praille', jour: 'jeudi',    heure: '19:00', duree: 55, cours: 'body-combat' },
    { club: 'geneve-la-praille', jour: 'vendredi', heure: '12:15', duree: 45, cours: 'hiit' },
    { club: 'geneve-la-praille', jour: 'samedi',   heure: '10:00', duree: 60, cours: 'hybrid-training' },

    { club: 'blandonnet', jour: 'lundi',    heure: '12:15', duree: 45, cours: 'hiit' },
    { club: 'blandonnet', jour: 'mardi',    heure: '18:30', duree: 60, cours: 'pilates' },
    { club: 'blandonnet', jour: 'mercredi', heure: '19:00', duree: 50, cours: 'indoor-cycling' },
    { club: 'blandonnet', jour: 'jeudi',    heure: '12:15', duree: 45, cours: 'body-pump' },
    { club: 'blandonnet', jour: 'samedi',   heure: '10:30', duree: 60, cours: 'zumba' },

    { club: 'geneve-eaux-vives', jour: 'lundi',    heure: '18:30', duree: 60, cours: 'yoga' },
    { club: 'geneve-eaux-vives', jour: 'mardi',    heure: '12:15', duree: 45, cours: 'body-pump' },
    { club: 'geneve-eaux-vives', jour: 'mercredi', heure: '19:00', duree: 55, cours: 'pilates' },
    { club: 'geneve-eaux-vives', jour: 'vendredi', heure: '12:15', duree: 45, cours: 'hiit' },

    { club: 'versoix', jour: 'lundi',    heure: '19:00', duree: 50, cours: 'indoor-cycling' },
    { club: 'versoix', jour: 'mercredi', heure: '12:15', duree: 45, cours: 'body-combat' },
    { club: 'versoix', jour: 'samedi',   heure: '10:00', duree: 60, cours: 'zumba' },

    { club: 'veyrier', jour: 'lundi',    heure: '10:00', duree: 45, cours: 'aquagym' },
    { club: 'veyrier', jour: 'mardi',    heure: '18:30', duree: 60, cours: 'yoga' },
    { club: 'veyrier', jour: 'mercredi', heure: '07:00', duree: 45, cours: 'aquabike' },
    { club: 'veyrier', jour: 'jeudi',    heure: '12:15', duree: 45, cours: 'body-pump' },
    { club: 'veyrier', jour: 'vendredi', heure: '18:00', duree: 60, cours: 'pilates' },

    { club: 'denges', jour: 'lundi',    heure: '12:15', duree: 45, cours: 'cross-training' },
    { club: 'denges', jour: 'mardi',    heure: '10:00', duree: 45, cours: 'aquagym' },
    { club: 'denges', jour: 'mercredi', heure: '18:30', duree: 55, cours: 'body-combat' },
    { club: 'denges', jour: 'jeudi',    heure: '07:00', duree: 45, cours: 'aquabike' },
    { club: 'denges', jour: 'vendredi', heure: '12:15', duree: 45, cours: 'hiit' },
    { club: 'denges', jour: 'samedi',   heure: '10:00', duree: 60, cours: 'hybrid-training' },

    { club: 'gland', jour: 'lundi',    heure: '18:30', duree: 60, cours: 'zumba' },
    { club: 'gland', jour: 'mercredi', heure: '12:15', duree: 45, cours: 'body-pump' },
    { club: 'gland', jour: 'vendredi', heure: '19:00', duree: 50, cours: 'indoor-cycling' },

    { club: 'signy', jour: 'mardi',    heure: '12:15', duree: 45, cours: 'hiit' },
    { club: 'signy', jour: 'jeudi',    heure: '18:30', duree: 60, cours: 'pilates' },
    { club: 'signy', jour: 'samedi',   heure: '10:00', duree: 60, cours: 'body-pump' }
  ]
};
