/* Harmony Fitness : logique et composants partagés du lab.

   Deux couches :
   - HF.regles : les règles métier de B.3, sous forme de fonctions pures.
     Rien n'y est écrit en dur, tout se lit dans window.DATA.
   - HF.vues   : les composants, sous forme de fonctions qui rendent du HTML.
     Aucune donnée en dur : chaque vue reçoit les données et l'état.

   L'état vit dans le store Alpine "wf", piloté par le sélecteur d'état.
   Les clics passent par la délégation d'événements (data-act), pour que les
   composants restent de simples chaînes de caractères réutilisables. */

window.HF = (function () {
  'use strict';

  var D = window.DATA;

  /* ---------------------------------------------------------------- */
  /* Accès aux données                                                  */
  /* ---------------------------------------------------------------- */
  function club(id)      { return D.clubs.find(function (c) { return c.id === id; }) || null; }
  function categorie(id) { return D.categories.find(function (c) { return c.id === id; }) || null; }
  function cours(id)     { return D.cours.find(function (c) { return c.id === id; }) || null; }
  function extra(id)     { return D.extras.find(function (e) { return e.id === id; }) || null; }
  function produit(id)   { return D.produits.find(function (p) { return p.id === id; }) || null; }
  function coach(id)     { return D.coachs.find(function (c) { return c.id === id; }) || null; }
  function tarif(id)     { return D.referentiels.tarifs.find(function (t) { return t.id === id; }) || null; }
  function engagement(id){ return D.referentiels.engagements.find(function (e) { return e.id === id; }) || null; }
  function promotion(id) { return (D.promotions || []).find(function (o) { return o.id === id; }) || null; }

  /* Nom d'un produit, mis en forme. Règle de nommage (Q34) : le premier mot
     d'une formule est le nom d'une catégorie de club, il dit quels clubs elle
     ouvre ; ce qui suit est le niveau. Le niveau se distingue à l'oeil pour
     qu'on ne le confonde pas avec une catégorie. La coupure se déduit du nom
     de la catégorie : aucun champ en plus, et un nom qui ne suit pas la règle
     s'affiche simplement tel quel. */
  function nomProduitHtml(p) {
    if (!p) return '';
    var cat = p.categorie ? categorie(p.categorie) : null;
    var base = cat ? cat.nom : null;
    if (!base || p.nom.indexOf(base + ' ') !== 0) return esc(p.nom);
    return esc(base) + ' <span class="niveau">' + esc(p.nom.slice(base.length + 1)) + '</span>';
  }

  /* L'engagement présélectionné se lit dans le référentiel, jamais en dur :
     changer le défaut est une saisie, pas une reprise du code. */
  function engagementDefaut() {
    var e = D.referentiels.engagements.filter(function (x) { return x.defaut; })[0];
    return e ? e.id : D.referentiels.engagements[0].id;
  }

  var regles = {

    /* B.3 > Page Tarifs > Règles : Premium couvre tous les clubs,
       Essential couvre Essential et Gym, Gym couvre Pâquis. La règle est
       portée par categorie.couvre, jamais par une liste de clubs. */
    clubsDeCategorie: function (idCat) {
      var cat = categorie(idCat);
      if (!cat) return [];
      return D.clubs.filter(function (c) { return cat.couvre.indexOf(c.categorie) !== -1; });
    },

    /* "Accès au club Genève · Pâquis", "Accès à 7 clubs", "Accès aux 10 clubs".
       Le nombre est calculé, jamais saisi. */
    ligneAcces: function (idCat) {
      var liste = regles.clubsDeCategorie(idCat);
      if (liste.length === 0) return 'Accès à [X] clubs';
      /* Toujours un nombre, y compris pour un seul club : la ligne se lit de
         la même façon d'une formule à l'autre, et le détail des clubs se
         trouve au point d'info à côté. */
      if (liste.length === 1) return 'Accès à 1 club';
      if (liste.length === D.clubs.length) return 'Accès aux ' + D.clubs.length + ' clubs';
      return 'Accès à ' + liste.length + ' clubs';
    },

    /* Nombre de cours collectifs d'un format donné qu'une catégorie ouvre.
       Un cours, pas une séance : c'est le nombre de cours différents qu'on
       peut pratiquer, pas le nombre de créneaux. Déduit des séances, donc
       jamais saisi, et c'est ce qui sépare Essential de Premium. */
    nbCoursFormule: function (idCat, idFormat) {
      var clubs = regles.clubsDeCategorie(idCat).map(function (c) { return c.id; });
      if (!clubs.length) return null;
      var vus = {};
      D.seances.forEach(function (se) {
        if (clubs.indexOf(se.club) === -1) return;
        var co = cours(se.cours);
        if (!co || co.estExtra || co.format !== idFormat) return;
        /* Même population que le catalogue du hub : une variante traitée en
           filtre n'y est pas une entrée, elle ne doit pas être comptée ici
           non plus, sinon la carte et le catalogue annoncent deux nombres
           différents pour la même chose. */
        if (co.traitement === 'filtre-intensite' || co.traitement === 'filtre-format') return;
        vus[co.id] = 1;
      });
      return Object.keys(vus).length;
    },

    /* Nombre de cours collectifs différents chez Harmony, tous clubs et
       tous formats confondus : la même population que le catalogue du hub
       et que nbCoursFormule (Extras et variantes en filtre exclus). C'est la
       preuve du hero de l'accueil (Hugo, 2026-10-23). */
    nbCoursCollectifs: function () {
      var vus = {};
      D.seances.forEach(function (se) {
        var co = cours(se.cours);
        if (!co || co.estExtra) return;
        if (co.traitement === 'filtre-intensite' || co.traitement === 'filtre-format') return;
        vus[co.id] = 1;
      });
      return Object.keys(vus).length;
    },

    /* Grisé : un seul sens, "pas accessible depuis ce club".
       Deux conditions, à ne pas confondre. L'accès vient de la catégorie du
       produit : Premium couvre tous les clubs. La souscription peut en plus
       être restreinte à certaines catégories de clubs référents, c'est le cas
       de Premium Platinum, qui donne accès aux 10 clubs mais ne se souscrit que
       depuis un club Premium. Sans souscriptionDepuis, seule l'accès compte. */
    produitDisponible: function (p, idClub) {
      if (!idClub) return true;
      var c = club(idClub);
      if (!c) return true;
      var cat = categorie(p.categorie);
      if (!cat || cat.couvre.indexOf(c.categorie) === -1) return false;
      if (p.souscriptionDepuis && p.souscriptionDepuis.indexOf(c.categorie) === -1) return false;
      return true;
    },

    /* Routage d'une demande de contact. Le motif décide du destinataire, le
       club dit lequel. Renvoie de quoi afficher la phrase "Votre message part
       à ...", et si le club est obligatoire pour ce motif. */
    destinataireContact: function (idMotif, idClub) {
      var C = D.contact;
      var m = C.motifs.find(function (x) { return x.id === idMotif; }) || null;
      if (!m) return { motif: null, type: null, nom: null, email: null, clubRequis: false };
      if (m.destination !== 'club') {
        return { motif: m, type: 'central', nom: C.central.nom, email: C.central.email,
                 clubRequis: false };
      }
      var c = idClub ? club(idClub) : null;
      return {
        motif: m, type: 'club', clubRequis: true,
        nom: c ? 'Harmony ' + c.nom : null,
        email: c ? c.email : null
      };
    },

    /* Un Extra est-il compris dans le produit choisi ? Seuls les Extras
       vendus en ligne le sont : ceux vendus en club restent "Sur demande en
       club", puisqu'ils ne se vendent pas ici. Règle déduite du mode de
       vente, jamais une liste d'exceptions écrite à la main. */
    extraInclus: function (e, etat) {
      if (!etat || !etat.produitChoisi) return false;
      var p = produit(etat.produitChoisi);
      return !!p && !!p.inclutExtras && e.modeVente === 'en-ligne';
    },

    extraDisponible: function (e, idClub) {
      if (!idClub) return true;
      return e.clubs.indexOf(idClub) !== -1;
    },

    extrasDuClub: function (idClub) {
      if (!idClub) return [];
      return D.extras.filter(function (e) { return e.clubs.indexOf(idClub) !== -1; });
    },

    /* Actualités. La collection est unique et partagée par les cinq sites
       (B.1) : chaque site n'affiche que son flux. Ici, publié, tagué
       « fitness », du plus récent au plus ancien. Un article tagué fitness
       et corpo s'affiche sur les deux sites, saisi une fois. */
    articlesFitness: function () {
      return (D.articles || []).filter(function (a) {
        return a.statut === 'publie' && a.verticales.indexOf('fitness') !== -1;
      }).sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
    },
    /* Un article se cherche parmi ceux qui s'affichent : un brouillon ou une
       actu d'une autre verticale n'a pas d'adresse sur ce site. */
    article: function (id) {
      return regles.articlesFitness().find(function (a) { return a.id === id; }) || null;
    },
    autresArticles: function (id, n) {
      return regles.articlesFitness().filter(function (a) { return a.id !== id; }).slice(0, n || 3);
    },
    themeActu: function (id) {
      return (D.referentiels.themesActu || []).find(function (t) { return t.id === id; }) || null;
    },

    /* Les Small Group Training donnés dans un club, lus sur le planning et
       nulle part ailleurs. Sans club, toute la liste : la page Tarifs sans
       club référent montre l'offre entière. */
    sgtDuClub: function (idClub) {
      var liste = regles.smallGroupTrainings();
      if (!idClub) return liste;
      var donnes = {};
      D.seances.forEach(function (s) { if (s.club === idClub) donnes[s.cours] = 1; });
      return liste.filter(function (c) { return donnes[c.id]; });
    },

    /* Les Small Group Training qu'une formule ouvre : ceux donnés dans l'un
       des clubs que sa catégorie couvre. C'est categorie.couvre qui décide,
       jamais la seule catégorie du club référent : depuis un club Essential
       on peut souscrire Premium, et l'Extra ouvre alors les dix clubs. */
    sgtDeCategorie: function (idCategorie) {
      var ouverts = {};
      regles.clubsDeCategorie(idCategorie).forEach(function (c) { ouverts[c.id] = 1; });
      var donnes = {};
      D.seances.forEach(function (se) { if (ouverts[se.club]) donnes[se.cours] = 1; });
      return regles.smallGroupTrainings().filter(function (c) { return donnes[c.id]; });
    },

    /* Deux chiffres de réassurance, déduits des données et jamais saisis.
       Le nombre de clubs, et le nombre de séances d'un planning type sur une
       semaine, Extras exclus : ce qu'on annonce est ce qui est compris. */
    nbClubs: function () { return D.clubs.length; },

    /* B.3 > Accueil > « cours en avant ». Lesquels : ceux que l'éditeur a
       marqués `enAvant` d'abord, puis les plus programmés dans la semaine,
       Extras et entrées de fiche partagée exclus (Hugo, 2026-10-22). Le
       défaut se déduit, le drapeau ne se saisit que pour y déroger, comme
       `alaUne` pour les articles. */
    coursEnAvant: function (n) {
      var nb = {};
      D.seances.forEach(function (s) { nb[s.cours] = (nb[s.cours] || 0) + 1; });
      return D.cours.filter(function (c) { return !c.estExtra && !c.memeFicheQue; })
        .sort(function (a, b) {
          return (b.enAvant ? 1 : 0) - (a.enAvant ? 1 : 0) ||
            (nb[b.id] || 0) - (nb[a.id] || 0) ||
            a.nom.localeCompare(b.nom, 'fr');
        }).slice(0, n || 4);
    },

    nbSeancesSemaine: function () {
      return D.seances.filter(function (se) {
        var co = cours(se.cours);
        return !!co && !co.estExtra;
      }).length;
    },

    /* Les espaces bien-être du référentiel, et les clubs qui en ont au moins
       un. Tout se déduit des équipements saisis sur les clubs : la page
       Espaces wellness ne saisit rien, elle lit. */
    espacesBienEtre: function () {
      return D.referentiels.equipements.filter(function (e) { return e.bienEtre; });
    },

    clubsAvecEspace: function (idEquipement) {
      return D.clubs.filter(function (c) {
        return c.equipements.indexOf(idEquipement) !== -1;
      });
    },

    /* Les espaces wellness qu'une formule ouvre : ceux des clubs que sa
       catégorie couvre. Rien n'est saisi sur la formule, tout se déduit des
       équipements des clubs, comme le nombre de cours. */
    espacesDeFormule: function (idCategorie) {
      var clubs = regles.clubsDeCategorie(idCategorie);
      return regles.espacesBienEtre().filter(function (e) {
        return clubs.some(function (c) { return c.equipements.indexOf(e.id) !== -1; });
      });
    },

    clubsBienEtre: function () {
      var ids = regles.espacesBienEtre().map(function (e) { return e.id; });
      return D.clubs.filter(function (c) {
        return c.equipements.some(function (e) { return ids.indexOf(e) !== -1; });
      });
    },

    /* Les formules qui comprennent une ligne d'inclusion, dans l'ordre.
       Sert à dire « dès la formule X » sans jamais énumérer : une
       énumération devient fausse le jour où une formule s'ajoute, et
       Premium Platinum l'a prouvé (Q48). */
    formulesAvec: function (idInclusion) {
      return D.produits
        .filter(function (p) {
          return p.type === 'formule' && p.inclus && p.inclus[idInclusion];
        })
        .sort(function (a, b) { return (a.ordre || 0) - (b.ordre || 0); });
    },

    /* La formule qui comprend les Extras. On la retrouve par son champ,
       jamais par son identifiant : demain il peut y en avoir une autre. */
    formuleAvecExtras: function () {
      return D.produits.find(function (p) {
        return p.type === 'formule' && p.inclutExtras;
      }) || null;
    },

    /* L'unique Extra qui couvre tous les Small Group Training. Il n'y en a
       qu'un : on l'appelle par son type, pas par son identifiant, pour que
       le code n'ait pas à connaître le nom du produit. */
    extraDesSgt: function () {
      return D.extras.find(function (e) { return e.type === 'sgt'; }) || null;
    },

    /* La promotion en cours qui porte sur ce produit, ou null. Une promo
       s'applique à des produits qui existent déjà, abonnements ou carnets
       indifféremment : le type du produit n'entre pas dans la règle.
       En production c'est la date qui décide. Dans le lab, etat.promo dit
       quelle campagne on simule. */
    promoDuProduit: function (p, etat) {
      if (!p || !etat || !etat.promo) return null;
      var promo = promotion(etat.promo);
      if (!promo) return null;
      if (promo.produits.indexOf(p.id) === -1) return null;
      /* Une promo peut ne porter que sur certains engagements. engagements
         vide ou absent : elle porte sur tous (Q29). */
      if (promo.engagements && promo.engagements.length &&
          promo.engagements.indexOf(etat.engagement) === -1) return null;
      return promo;
    },

    /* La promo porte sur ce produit, mais pas sur l'engagement affiché.
       Sans ça, une remise réservée aux 12 mois serait invisible tant que le
       visiteur reste sur "Sans engagement", qui est l'état par défaut. */
    promoAutreEngagement: function (p, etat) {
      if (!p || !etat || !etat.promo) return null;
      var promo = promotion(etat.promo);
      if (!promo || promo.produits.indexOf(p.id) === -1) return null;
      if (!promo.engagements || !promo.engagements.length) return null;
      return promo.engagements.indexOf(etat.engagement) === -1 ? promo : null;
    },

    /* "avec l'engagement 12 mois". Le libellé vient du référentiel, jamais
       écrit en dur : le jour où un troisième engagement arrive, ça suit. */
    libelleEngagementsPromo: function (promo) {
      if (!promo || !promo.engagements || !promo.engagements.length) return '';
      var noms = promo.engagements.map(function (id) {
        var e = engagement(id);
        return e ? e.nom : id;
      });
      return 'avec l\'engagement ' + noms.join(' ou ');
    },

    /* Version courte, pour une pastille : "12 mois". Le séparateur évite le
       problème de grammaire de "en Sans engagement". */
    libelleEngagementsCourt: function (promo) {
      if (!promo || !promo.engagements || !promo.engagements.length) return '';
      return promo.engagements.map(function (id) {
        var e = engagement(id);
        return e ? e.nom : id;
      }).join(' ou ');
    },

    /* La promo simulée comme étant en cours, si au moins un de ses produits
       est accessible depuis le club choisi : annoncer une remise sur des
       produits qu'on ne peut pas acheter d'ici serait une fausse promesse. */
    promoVisible: function (etat) {
      if (!etat || !etat.promo) return null;
      var promo = promotion(etat.promo);
      if (!promo) return null;
      var accessible = promo.produits.some(function (id) {
        var p = produit(id);
        return !!p && regles.produitDisponible(p, etat.club);
      });
      return accessible ? promo : null;
    },

    /* Où envoyer le lecteur : une promo sur des abonnements renvoie à la
       section Abonnements, une promo sur des carnets à la section Carnets.
       Une promo qui porte sur les deux renvoie aux deux. Le produit n'est
       jamais dupliqué : il vit dans sa section, et nulle part ailleurs. */
    sectionsDePromo: function (promo) {
      if (!promo) return [];
      var libelles = {
        formule: { ancre: 'abonnements', nom: 'Voir les abonnements' },
        carnet: { ancre: 'carnets', nom: 'Voir les carnets' }
      };
      var vus = {}, out = [];
      promo.produits.forEach(function (id) {
        var p = produit(id);
        if (!p || vus[p.type] || !libelles[p.type]) return;
        vus[p.type] = 1;
        out.push(libelles[p.type]);
      });
      return out;
    },

    /* Les produits promo dédiés réellement affichés : accessibles depuis le
       club, et seulement si une campagne tourne (case "Offre active"). */
    offresVisibles: function (etat) {
      if (!etat || etat.offreActive === false) return [];
      return regles.produitsVisibles('offre', etat.club);
    },

    /* La section Offre du moment existe dès qu'il y a l'un ou l'autre :
       un produit promo dédié, ou une remise sur des produits existants. */
    offreDuMoment: function (etat) {
      return regles.offresVisibles(etat).length > 0 || !!regles.promoVisible(etat);
    },

    /* Échéance du compteur. Il compte ce que la section montre en cartes,
       c'est-à-dire les offres dédiées. Quand il n'y en a pas, il compte la
       promo, qui est alors la seule campagne. Jamais les deux à la fois :
       un compteur au-dessus de cartes qui n'ont pas cette échéance ment.
       La date de la promo reste de toute façon dans sa ligne d'annonce. */
    finOffre: function (etat) {
      var dates = regles.offresVisibles(etat)
        .map(function (p) { return p.validite ? p.validite.fin : null; })
        .filter(Boolean).sort();
      if (dates.length) return dates[0];
      var promo = regles.promoVisible(etat);
      return (promo && promo.validite) ? promo.validite.fin : null;
    },

    /* Le prix remisé est calculé depuis le prix catalogue, jamais saisi.
       Prix catalogue inconnu : la remise l'est aussi, on ne l'invente pas. */
    prixRemise: function (valeur, promo) {
      if (typeof valeur !== 'number' || !promo) return null;
      if (promo.remise.type === 'montant') return valeur - promo.remise.valeur;
      return Math.round(valeur * (1 - promo.remise.valeur / 100));
    },

    /* Tarif par âge : ne grise jamais. Un produit sans le tarif choisi
       s'affiche au prix adulte avec "Pas de tarif [x], prix adulte".
       etat est facultatif : sans lui, prix catalogue, sans remise. */
    prix: function (p, idTarif, idEngagement, etat) {
      var applique = p.prix && p.prix[idTarif] ? idTarif : 'adulte';
      var bloc = p.prix ? p.prix[applique] : null;
      var valeur = null;
      if (bloc) valeur = (idEngagement in bloc) ? bloc[idEngagement] : bloc.unique;
      if (valeur === undefined) valeur = null;
      var promo = regles.promoDuProduit(p, etat);
      var remise = promo ? regles.prixRemise(valeur, promo) : null;
      return {
        valeur: (remise === null) ? valeur : remise,
        valeurCatalogue: valeur,
        promo: promo,
        tarifApplique: applique,
        repli: applique !== idTarif,
        mentionRepli: applique !== idTarif
          ? 'Pas de tarif ' + (tarif(idTarif) ? tarif(idTarif).nom.toLowerCase() : idTarif) + ', prix adulte'
          : null
      };
    },

    /* "soit env. CHF X.– par mois", toujours calculé (B.3 > trame > 3). */
    parMois: function (p) {
      var brut = p.prix && p.prix.adulte ? p.prix.adulte.unique : null;
      if (brut === null || brut === undefined || !p.dureeMois) return null;
      return Math.round(brut / p.dureeMois);
    },

    seancesDuClub: function (idClub) {
      return D.seances.filter(function (s) { return s.club === idClub; });
    },

    coursDuClub: function (idClub) {
      var vus = {};
      return regles.seancesDuClub(idClub).map(function (s) { return s.cours; })
        .filter(function (id) { if (vus[id]) return false; vus[id] = 1; return true; })
        .map(cours);
    },

    clubsDuCours: function (idCours) {
      var vus = {};
      return D.seances.filter(function (s) { return s.cours === idCours; })
        .map(function (s) { return s.club; })
        .filter(function (id) { if (vus[id]) return false; vus[id] = 1; return true; })
        .map(club);
    },

    coachsDuClub: function (idClub) {
      return D.coachs.filter(function (k) { return k.lieux.indexOf(idClub) !== -1; });
    },

    /* Le prix le plus bas d'un produit, tous engagements confondus. "Dès"
       veut dire le moins cher : avec une promo réservée aux 12 mois, c'est
       le prix 12 mois remisé, pas le prix sans engagement. */
    prixMini: function (p, idTarif, etat) {
      var retenu = null;
      D.referentiels.engagements.forEach(function (e) {
        var pr = regles.prix(p, idTarif, e.id, etat);
        if (typeof pr.valeur !== 'number') return;
        if (!retenu || pr.valeur < retenu.valeur) retenu = pr;
      });
      /* Aucun prix connu : on renvoie quand même la forme, avec la promo
         qui s'appliquerait, pour que la pastille reste possible. */
      return retenu || regles.prix(p, idTarif, engagementDefaut(), etat);
    },

    /* B.3 > Clubs > Carte club : prix de la formule la moins chère qui donne
       accès au club, au tarif Adulte. Tant qu'aucun prix n'est connu, la
       carte affiche le placeholder plutôt qu'un montant inventé. */
    desParMois: function (idClub, etat) {
      return regles.desParMoisDetail(idClub, etat).valeur;
    },

    /* Même calcul, mais qui dit aussi si le montant vient d'une promo : la
       carte club peut alors afficher la pastille. Sans quoi /clubs
       annoncerait un prix que la page Tarifs dément. */
    desParMoisDetail: function (idClub, etat) {
      var c = club(idClub);
      if (!c) return { valeur: null, promo: null };
      var retenu = null;
      D.produits
        .filter(function (p) { return p.type === 'formule' && regles.produitDisponible(p, idClub); })
        .forEach(function (p) {
          var pr = regles.prixMini(p, 'adulte', etat);
          if (typeof pr.valeur !== 'number') return;
          if (!retenu || pr.valeur < retenu.valeur) retenu = pr;
        });
      return retenu ? { valeur: retenu.valeur, promo: retenu.promo } : { valeur: null, promo: null };
    },

    /* Q8 : sur un club Gym, la ligne informe au lieu de compter. */
    ligneCoursCarteClub: function (idClub) {
      var c = club(idClub);
      if (!c) return '';
      if (c.categorie === 'gym') return 'Pas de cours collectifs · Small Group Training en Extra';
      var n = regles.seancesDuClub(idClub).filter(function (s) {
        var co = cours(s.cours); return co && !co.estExtra;
      }).length;
      return n + ' cours par semaine';
    },

    clubsParCanton: function () {
      var cantons = [];
      D.clubs.forEach(function (c) { if (cantons.indexOf(c.canton) === -1) cantons.push(c.canton); });
      return cantons.map(function (canton) {
        return {
          canton: canton,
          clubs: D.clubs.filter(function (c) { return c.canton === canton; })
            .sort(function (a, b) { return a.nom.localeCompare(b.nom, 'fr'); })
        };
      });
    },

    offresActives: function () {
      return D.produits.filter(function (p) { return p.type === 'offre'; });
    },

    /* Les produits à rendre dans une section, une fois le filtrage par club
       appliqué. Les autres partent dans la ligne "Pas disponible depuis
       [club]" : ils ne laissent jamais une cellule vide dans la grille. */
    produitsVisibles: function (type, idClub) {
      return D.produits.filter(function (p) {
        return p.type === type && regles.produitDisponible(p, idClub);
      });
    }
  };

  /* ---------------------------------------------------------------- */
  /* Formatage                                                          */
  /* ---------------------------------------------------------------- */
  function prixTexte(v) {
    return (v === null || v === undefined) ? 'CHF XX.–' : 'CHF ' + v + '.–';
  }
  function texte(v, placeholder) {
    return (v === null || v === undefined || v === '') ? placeholder : v;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
  function spec(ref) { return '<span class="wf-spec">' + esc(ref) + '</span>'; }
  /* Les marqueurs « à valider » ont été retirés des maquettes (Hugo,
     2026-10-23) : ce qui reste à valider vit dans docs/questions.md. */
  function aValider() { return ''; }

  /* Fond de carte : lac Léman, cantons de Genève et de Vaud, frontière
     suisse, en chemins SVG dans un repère de 1000 de large. Généré par
     docs/outils/fond-carte.py depuis swiss-maps (géodonnées OFS GEOSTAT,
     usage non commercial, attribution affichée sur la carte). Embarqué : le
     lab n'appelle aucune carte en ligne. Les constantes de projection sont
     celles du script, les clubs sont placés avec la même formule. */
  var FOND_CARTE = {
    lon0: 5.95, lat1: 46.58, k: 0.690251, echelle: 2069.64, largeur: 1000, hauteur: 952,
    suisse: 'M1600 -600L1600 1408L1593 1405L1593 1386L1588 1377L1577 1373L1565 1358L1561 1341L1556 1336L1552 1325L1556 1308L1551 1289L1534 1284L1526 1279L1514 1261L1516 1254L1523 1250L1531 1247L1533 1238L1524 1225L1519 1224L1519 1215L1516 1203L1509 1195L1502 1200L1496 1198L1487 1191L1480 1189L1474 1156L1460 1144L1454 1133L1448 1135L1436 1112L1429 1091L1420 1092L1409 1082L1411 1073L1411 1064L1406 1060L1399 1065L1392 1064L1385 1075L1375 1085L1374 1090L1368 1095L1351 1098L1346 1104L1334 1106L1324 1099L1319 1090L1320 1083L1331 1054L1341 1046L1346 1045L1342 1035L1345 1029L1347 1022L1335 1004L1341 990L1346 985L1352 974L1349 964L1358 941L1351 942L1345 938L1333 943L1324 938L1314 939L1289 936L1277 931L1275 924L1271 924L1243 927L1237 930L1225 915L1217 918L1213 915L1208 892L1202 879L1205 867L1204 860L1224 840L1226 830L1233 822L1221 777L1230 755L1235 753L1239 743L1246 735L1246 717L1259 713L1268 700L1273 684L1278 683L1289 676L1294 671L1294 662L1301 648L1300 631L1308 619L1306 610L1302 605L1300 596L1293 593L1288 597L1283 598L1278 589L1272 587L1265 577L1259 577L1256 571L1258 564L1251 552L1243 545L1238 544L1225 534L1215 534L1212 522L1214 517L1210 509L1198 510L1193 509L1193 501L1186 485L1176 473L1173 463L1175 450L1181 444L1188 439L1204 438L1224 412L1224 405L1218 397L1220 387L1223 382L1246 314L1047 257L814 253L680 337L551 362L434 452L386 552L428 574L427 588L434 597L431 602L421 608L415 614L413 627L419 633L429 654L445 670L444 677L453 685L471 677L471 674L479 671L490 654L496 652L493 663L495 668L502 670L510 668L513 670L510 678L514 680L516 693L493 732L467 752L452 756L436 765L428 774L424 770L422 774L407 771L393 781L389 787L383 788L378 797L368 800L361 811L343 822L338 829L342 854L323 871L313 873L290 884L279 898L274 897L266 906L253 907L246 903L228 901L221 899L214 900L204 884L181 889L176 887L147 885L142 893L138 908L134 906L124 915L118 909L94 902L78 904L64 899L48 904L47 914L39 923L30 925L23 930L17 928L11 933L10 924L24 914L22 898L45 853L46 840L51 839L56 844L58 836L61 832L60 827L66 819L60 810L51 807L47 803L21 790L23 785L34 779L28 770L36 753L42 749L63 752L64 747L59 739L67 738L73 742L82 735L82 729L92 724L96 718L108 715L121 704L139 719L145 711L149 702L158 691L163 689L172 699L177 694L193 687L199 688L218 706L224 700L228 702L249 679L250 678L246 672L248 667L244 657L230 639L235 634L221 622L222 610L219 608L231 595L234 589L242 589L245 583L247 577L242 572L245 563L243 561L244 551L250 541L252 541L251 538L261 525L271 505L269 503L270 496L286 489L298 471L298 465L303 453L316 438L309 427L303 423L299 412L296 416L286 417L267 395L235 370L223 370L216 360L213 352L164 336L178 311L180 304L193 287L196 281L193 272L179 260L182 251L177 246L177 234L183 230L211 201L234 142L269 100L278 105L292 87L285 82L296 69L231 4L246 -11L253 -22L271 -38L292 -52L303 -65L310 -66L328 -77L330 -86L352 -102L352 -105L364 -119L370 -119L386 -137L398 -144L406 -158L455 -202L457 -215L470 -223L477 -231L499 -240L536 -264L541 -264L561 -272L576 -282L579 -289L587 -299L593 -296L604 -301L603 -311L608 -315L614 -314L623 -317L632 -330L632 -335L627 -341L636 -350L645 -356L650 -355L679 -363L688 -369L700 -381L700 -390L714 -402L719 -405L718 -414L728 -434L694 -461L688 -484L702 -492L701 -508L705 -524L730 -565L733 -600Z',
    geneve: 'M322 480L319 491L313 489L315 480L323 471L336 482L332 486L322 480ZM416 490L404 514L348 486L350 476L338 474L319 463L317 457L323 453L322 448L330 443L340 451L355 452L361 463L376 467L417 487L416 490ZM386 552L428 574L427 588L434 597L431 602L421 608L415 614L413 627L419 633L429 654L445 670L444 677L453 685L471 677L471 674L479 671L490 654L496 652L493 663L495 668L502 670L510 668L513 670L510 678L514 680L516 693L493 732L467 752L452 756L436 765L428 774L424 770L422 774L407 771L393 781L389 787L383 788L378 797L368 800L361 811L343 822L338 829L342 854L323 871L313 873L290 884L279 898L274 897L266 906L253 907L246 903L228 901L221 899L214 900L204 884L181 889L176 887L147 885L142 893L138 908L134 906L124 915L118 909L94 902L78 904L64 899L48 904L47 914L39 923L30 925L23 930L17 928L11 933L10 924L24 914L22 898L45 853L46 840L51 839L56 844L58 836L61 832L60 827L66 819L60 810L51 807L47 803L21 790L23 785L34 779L28 770L36 753L42 749L63 752L64 747L59 739L67 738L73 742L82 735L82 729L92 724L96 718L108 715L121 704L139 719L145 711L149 702L158 691L163 689L172 699L177 694L193 687L199 688L218 706L224 700L228 702L250 678L246 672L248 667L244 657L230 639L235 634L221 622L222 610L219 608L231 595L234 589L242 589L245 583L247 577L242 572L245 563L243 561L244 551L250 541L252 541L273 567L293 579L316 588L356 609L386 552Z',
    vaud: 'M1246 314L1047 257L814 253L680 337L551 362L434 452L417 487L376 467L361 463L355 452L340 451L330 443L322 448L323 453L317 457L319 463L338 474L350 476L348 486L404 514L356 609L316 588L293 579L273 567L252 541L251 538L260 525L271 505L269 503L270 496L286 489L298 471L298 465L303 453L316 438L309 427L303 423L299 412L296 416L286 417L267 395L235 370L223 370L216 360L213 352L164 336L178 311L180 304L193 287L196 281L193 272L179 260L182 251L177 246L177 234L183 230L211 201L234 142L245 128L269 100L278 105L292 87L285 82L296 69L231 4L246 -11L253 -22L271 -38L292 -52L303 -65L310 -66L328 -77L330 -86L352 -102L352 -105L364 -119L370 -119L386 -137L398 -144L406 -158L455 -202L457 -215L470 -223L477 -231L499 -240L536 -264L541 -264L561 -272L576 -282L579 -289L587 -299L593 -296L604 -301L603 -311L608 -315L614 -314L623 -317L632 -330L632 -335L627 -341L636 -350L645 -356L650 -355L679 -363L688 -369L700 -381L700 -390L714 -402L719 -405L722 -391L718 -414L728 -434L694 -461L688 -484L702 -492L701 -508L705 -524L730 -565L736 -563L743 -556L761 -555L826 -579L841 -596L850 -600L1155 -600L1187 -567L1133 -515L1186 -460L1193 -464L1197 -457L1183 -441L1181 -437L1191 -443L1213 -422L1222 -428L1236 -414L1242 -412L1252 -403L1255 -410L1263 -406L1267 -408L1272 -418L1277 -414L1292 -428L1300 -433L1307 -426L1306 -420L1318 -413L1322 -417L1327 -409L1343 -413L1355 -409L1354 -414L1372 -424L1374 -416L1383 -429L1382 -435L1389 -451L1396 -455L1403 -470L1397 -477L1392 -476L1392 -473L1387 -480L1380 -474L1376 -465L1366 -471L1374 -484L1366 -508L1369 -530L1386 -556L1401 -570L1377 -594L1354 -586L1347 -592L1367 -600L1373 -600L1377 -597L1381 -600L1447 -600L1451 -596L1457 -599L1456 -600L1477 -600L1475 -597L1468 -569L1463 -569L1470 -553L1477 -554L1485 -561L1490 -556L1483 -550L1478 -539L1483 -535L1481 -530L1490 -527L1490 -521L1480 -503L1460 -508L1452 -516L1442 -498L1444 -495L1439 -489L1441 -481L1451 -469L1452 -460L1439 -445L1442 -438L1430 -422L1423 -426L1414 -420L1404 -407L1403 -401L1409 -399L1387 -376L1379 -381L1370 -370L1373 -361L1383 -364L1389 -358L1402 -363L1413 -353L1417 -344L1410 -330L1409 -320L1390 -300L1384 -291L1365 -280L1347 -256L1349 -251L1346 -242L1336 -233L1331 -231L1320 -217L1314 -221L1305 -211L1308 -203L1318 -196L1308 -179L1313 -175L1311 -168L1306 -165L1301 -168L1292 -159L1277 -165L1279 -170L1271 -173L1255 -168L1237 -142L1231 -149L1214 -146L1221 -137L1214 -126L1211 -113L1218 -101L1220 -91L1219 -48L1213 -44L1217 -29L1214 -10L1208 7L1214 10L1223 2L1234 1L1232 -4L1236 -14L1245 -10L1250 2L1257 3L1265 7L1276 -7L1282 -11L1291 -7L1307 1L1322 28L1329 24L1335 33L1339 33L1341 23L1355 17L1360 19L1357 28L1362 36L1342 42L1311 79L1303 99L1300 98L1301 88L1296 86L1295 77L1288 78L1274 84L1261 85L1252 84L1250 78L1242 87L1240 97L1231 111L1241 128L1250 138L1259 137L1262 152L1270 164L1275 170L1281 170L1284 176L1299 177L1305 175L1310 162L1332 137L1355 121L1352 147L1360 136L1375 136L1377 140L1394 147L1397 153L1402 153L1407 160L1427 160L1431 157L1447 169L1452 177L1462 181L1464 202L1475 214L1470 218L1473 248L1476 248L1490 269L1478 291L1491 289L1505 280L1527 272L1531 246L1558 215L1595 186L1600 189L1600 783L1593 785L1586 792L1549 811L1537 789L1518 773L1513 742L1505 731L1504 715L1496 709L1486 693L1483 675L1459 652L1451 639L1443 609L1429 595L1415 586L1410 580L1404 543L1405 526L1401 514L1386 496L1362 497L1353 493L1334 468L1332 461L1340 441L1336 419L1323 408L1300 382L1246 314ZM1177 -358L1170 -344L1157 -329L1148 -326L1142 -317L1145 -311L1157 -304L1156 -297L1162 -287L1174 -294L1193 -325L1193 -346L1196 -350L1186 -357L1182 -354L1177 -358ZM1232 -309L1240 -320L1256 -325L1271 -318L1281 -308L1304 -302L1312 -309L1309 -312L1311 -319L1333 -354L1326 -366L1305 -382L1293 -400L1285 -398L1279 -386L1257 -367L1257 -361L1237 -335L1238 -330L1224 -324L1221 -327L1213 -322L1206 -325L1198 -312L1206 -304L1232 -309ZM313 489L319 491L322 480L332 486L336 482L323 471L315 480L313 489ZM1596 -600L1590 -597L1578 -575L1573 -571L1558 -554L1551 -555L1543 -563L1550 -577L1557 -584L1544 -595L1547 -600Z',
    leman: 'M1300 382L1297 383L1301 392L1299 399L1297 396L1298 399L1295 400L1284 394L1259 399L1230 389L1223 382L1200 384L1158 369L1153 364L1123 360L1107 353L1042 355L1019 360L982 357L936 365L912 365L851 381L815 361L803 360L775 373L766 382L762 387L762 408L754 420L688 452L663 453L650 472L640 475L630 493L616 491L586 477L583 464L573 448L574 438L565 432L545 433L535 429L532 434L504 441L505 444L490 452L468 474L468 483L460 500L439 527L441 535L434 555L429 563L418 568L419 580L410 598L399 606L372 648L357 652L350 665L346 689L350 697L345 716L319 759L308 766L304 764L298 771L295 767L297 772L293 774L287 773L284 770L291 761L290 752L292 740L286 726L292 690L289 678L304 653L310 651L317 629L311 615L316 600L318 600L316 588L332 567L339 555L350 544L362 515L362 505L368 496L369 479L388 446L406 429L409 418L422 404L426 397L442 384L464 390L469 380L476 376L475 358L487 341L488 323L497 320L497 316L510 309L530 279L546 268L556 252L567 243L575 244L606 234L621 236L632 245L649 247L674 228L695 224L715 216L722 207L733 207L731 201L735 189L743 182L758 181L761 179L762 168L768 159L771 161L783 152L794 132L800 130L806 132L814 130L839 146L843 146L844 148L872 147L880 138L891 135L898 127L918 126L934 139L941 137L950 141L955 147L956 144L969 153L970 149L976 148L990 153L1021 151L1027 154L1038 154L1078 170L1103 191L1116 190L1122 185L1134 185L1145 191L1160 204L1184 216L1195 216L1228 224L1228 227L1235 225L1262 231L1266 245L1290 252L1301 272L1309 269L1320 270L1326 275L1333 285L1337 282L1344 289L1361 287L1371 297L1371 306L1376 310L1381 308L1386 310L1392 320L1392 326L1397 332L1397 340L1402 353L1394 365L1392 375L1385 376L1385 380L1359 377L1352 381L1342 379L1338 370L1340 378L1320 382L1324 390L1331 393L1325 392L1325 395L1320 381L1311 384L1301 380L1300 382Z'
  };

  /* Positions des repères, en % du plan, calculées depuis les coordonnées
     GPS des clubs avec la projection du fond (Hugo, 2026-10-22 : carte plus
     haute fidélité). Avant, les repères étaient seulement placés les uns
     par rapport aux autres sur un fond vide.

     Les clubs genevois sont trop proches pour que leurs repères se
     distinguent à cette échelle. Une passe d'écartement les sépare, sinon
     la règle "forme et lettre, jamais la couleur seule" ne sert à rien :
     un repère caché sous un autre n'est lisible d'aucune façon. Le calcul
     est déterministe, la carte ne bouge pas d'un affichage à l'autre. */
  var ECART_MIN = 9;   /* en % de la largeur du plan */
  var _positions = null;

  function positions() {
    if (_positions) return _positions;
    var F = FOND_CARTE;
    var pts = D.clubs.map(function (c) {
      return {
        id: c.id,
        x: (c.gps.lng - F.lon0) * F.k * F.echelle / F.largeur * 100,
        y: (F.lat1 - c.gps.lat) * F.echelle / F.hauteur * 100
      };
    });

    for (var pas = 0; pas < 60; pas++) {
      var bouge = false;
      for (var i = 0; i < pts.length; i++) {
        for (var j = i + 1; j < pts.length; j++) {
          var dx = pts[j].x - pts[i].x, dy = pts[j].y - pts[i].y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d >= ECART_MIN) continue;
          bouge = true;
          /* Deux repères exactement confondus : on les sépare sur un axe
             fixe, pour rester déterministe. */
          if (d < 0.001) { dx = 1; dy = 0; d = 1; }
          var pousse = (ECART_MIN - d) / 2;
          pts[i].x -= (dx / d) * pousse; pts[i].y -= (dy / d) * pousse;
          pts[j].x += (dx / d) * pousse; pts[j].y += (dy / d) * pousse;
        }
      }
      pts.forEach(function (pt) {
        pt.x = Math.min(94, Math.max(6, pt.x));
        pt.y = Math.min(94, Math.max(6, pt.y));
      });
      if (!bouge) break;
    }

    _positions = {};
    pts.forEach(function (pt) { _positions[pt.id] = { x: pt.x, y: pt.y }; });
    return _positions;
  }

  function position(c) { return positions()[c.id] || { x: 50, y: 50 }; }

  /* Traduit la destination résolue d'un cours en URL du lab.
     /cours/pilates                     -> cours/fiche/?cours=pilates
     /cours/pilates#swiss-ball-pilates  -> cours/fiche/?cours=pilates#swiss-ball-pilates
     La règle de destination vit dans data.js, pas ici : cette fonction ne
     fait que changer de forme d'URL. */
  function lienCours(co, base) {
    var dest = (co && co.destination) || '';
    var reste = dest.replace(/^\/cours\//, '');
    var morceaux = reste.split('#');
    return (base || '') + 'cours/fiche/?cours=' + morceaux[0] +
      (morceaux[1] ? '#' + morceaux[1] : '');
  }

  /* La page d'une famille est une fiche comme une autre, désignée par son
     slug. Une seule fonction pour la construire, sinon l'adresse se
     réécrit à la main à chaque endroit qui y renvoie. */
  function lienFamille(f, base) {
    return f ? (base || '') + 'cours/fiche/?cours=' + f.slug : '';
  }

  /* Un club à Meyrin ou à Versoix n'est pas à Genève-ville. On écrit donc
     toujours « Canton de Genève », jamais « Genève » seul, dès qu'il s'agit
     d'un regroupement géographique. Le nom de la commune, lui, reste nu. */
  function libelleCanton(canton) {
    return canton ? 'Canton de ' + canton : '';
  }

  /* L'ancre d'un canton se déduit de son nom, elle ne se saisit pas : le
     footer y renvoie, le hub la porte, et les deux se suivent tout seuls. */
  function ancreCanton(canton) {
    return 'canton-' + String(canton || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function famille(id) {
    return D.referentiels.familles.find(function (f) { return f.id === id || f.slug === id; }) || null;
  }

  return {
    data: D,
    club: club, categorie: categorie, cours: cours, extra: extra,
    produit: produit, coach: coach, tarif: tarif, engagement: engagement,
    promotion: promotion, engagementDefaut: engagementDefaut,
    nomProduitHtml: nomProduitHtml,
    regles: regles,
    prixTexte: prixTexte, texte: texte, esc: esc, spec: spec, FOND_CARTE: FOND_CARTE,
    aValider: aValider, position: position, positions: positions,
    lienCours: lienCours, lienFamille: lienFamille,
    famille: famille, libelleCanton: libelleCanton, ancreCanton: ancreCanton
  };
})();

/* ------------------------------------------------------------------ */
/* Composants partagés                                                  */
/* Chaque vue rend une chaîne HTML. Aucune donnée en dur : tout vient    */
/* de window.DATA et de l'état du wireframe.                            */
/* ------------------------------------------------------------------ */
window.HF.vues = (function () {
  'use strict';
  var H = window.HF, D = H.data, R = H.regles;
  var esc = H.esc, prixTexte = H.prixTexte, texte = H.texte, aValider = H.aValider;

  /* Label de catégorie (Hugo, 2026-10-23) : un mot sur une pastille de
     couleur, dans les bleus et gris d'Harmony, du plus discret au plus
     marqué (Gym gris, Essential bleu clair, Premium bleu de marque). Plus
     de forme (carré, rond, triangle) : on ne dessine pas d'icône pour
     une catégorie. Le mot porte le sens, la couleur ne dit rien seule. */
  function labelCat(cat, texteLabel) {
    return '<span class="label-cat label-cat--' + cat.id + '">' +
      esc(texteLabel || ('Club ' + cat.nom)) + '</span>';
  }
  /* Gardé pour les appels existants : ne dessine plus rien. */
  function forme() { return ''; }

  /* --- Structure ------------------------------------------------- */

  /* Dossier assets/, lu sur l'adresse de ce script : les logos se trouvent
     depuis n'importe quelle page, même celles qui n'ont pas de base (la
     barre groupe n'en reçoit pas). */
  var dossierAssets = (function () {
    var s = document.currentScript;
    return s && s.src ? new URL('.', s.src).href : 'assets/';
  })();

  /* Logo du design system (couleurs figées dans le fichier), « FITNESS »
     réduit à 68 % de sa taille d'origine (Hugo, 2026-10-22). Fond clair
     uniquement : jamais dans le footer, qui est sur le bleu de marque. */
  function logo(fichier, alt, classe) {
    return '<img class="' + classe + '" src="' + dossierAssets + 'logos/' + fichier + '" alt="' + esc(alt) + '">';
  }

  /* « Harmony » en texte, pas en logo : avec le logo Fitness juste dessous,
     le header en montrait deux (Hugo, 2026-10-22).
     Libellés de B.3. « Sports de combat », jamais « Arts martiaux » (Q66). */
  /* L'espace membre est commun aux cinq sites : il vit dans la barre
     groupe, à droite, et plus dans le header de Fitness (Hugo,
     2026-10-23). Il ouvre l'espace hébergé par l'outil métier, dont le nom
     n'apparaît jamais (B.3). Icône et mot sur ordinateur, icône seule sur
     mobile : l'aria-label garde le nom. Les sites défilent dans leur propre
     bande, pour que le lien reste visible quand la ligne déborde. */
  function barreGroupe() {
    var liens = ['Harmony', 'Fitness', 'Sports de combat', 'École de natation', 'Famille'];
    return '<div class="barre-groupe" data-spec="B.3 > Arborescence > Barre groupe">' +
      '<div class="barre-groupe__inner">' +
      '<nav class="barre-groupe__sites" aria-label="Sites Harmony">' +
      liens.map(function (l) {
        return '<a href="#"' + (l === 'Fitness' ? ' aria-current="true"' : '') + '>' + esc(l) + '</a>';
      }).join('') + '</nav>' +
      '<a class="barre-groupe__compte" href="#" rel="noopener" aria-label="Espace membre">' +
      '<svg class="barre-groupe__icone" viewBox="0 0 20 20" aria-hidden="true" focusable="false">' +
      '<circle cx="10" cy="6.5" r="3.4" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
      '<path d="M3.4 17c0-3.4 3-5.6 6.6-5.6s6.6 2.2 6.6 5.6" fill="none" ' +
      'stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
      '<span class="barre-groupe__compte-texte">Espace membre</span></a>' +
      '</div></div>';
  }

  /* Les sous-menus du header, lus dans l'arborescence de B.3 : trois
     niveaux de navigation. Une seule source pour le menu déroulant de
     l'ordinateur et pour l'accordéon du burger mobile (Hugo, 2026-10-23).
     Clubs n'est pas un déroulant dans B.3 : on l'ajoute parce que trouver
     son club est la tâche la plus fréquente, à valider (Q69). Les pages
     hors du lab (Massage) gardent « # » et se lisent en
     grisé. L'Offre du moment n'apparaît que si une campagne tourne : c'est
     l'entrée du menu qui disparaît, pas la page. */
  function sousMenus(base, etat) {
    var campagne = !!(etat && R.offreDuMoment(etat));
    return [
      { nom: 'Clubs', href: base + 'clubs/', tous: 'Tous nos clubs',
        groupes: R.clubsParCanton().map(function (g) {
          return { titre: H.libelleCanton(g.canton), liens: g.clubs.map(function (c) {
            return { nom: c.nom, href: base + 'clubs/club/?club=' + c.id };
          }) };
        }) },
      { nom: 'Sport', href: base + 'sport/', tous: 'Tout le sport',
        groupes: [{ liens: [
          { nom: 'Plateau fitness', href: base + 'sport/plateau-fitness/' },
          { nom: 'Cours collectifs', href: base + 'sport/cours-collectifs/' },
          { nom: 'Small Group Training', href: base + 'sport/small-group-training/' },
          { nom: 'Coaching personnel', href: base + 'sport/coaching-personnel/' }
        ] }] },
      { nom: 'Bien-être', href: base + 'bien-etre/', tous: 'Tout le bien-être',
        groupes: [{ liens: [
          { nom: 'Espaces wellness', href: base + 'bien-etre/espaces/' },
          { nom: 'Massage & physiothérapie' }
        ] }] },
      { nom: 'Tarifs', href: base + 'tarifs/', signal: campagne,
        groupes: [{ liens: [
          { nom: 'Tous les tarifs', href: base + 'tarifs/' },
          campagne ? { nom: 'Offre du moment', href: base + 'offre-du-moment/', promo: true } : null
          /* L'offre entreprise quitte le menu pour le footer (Hugo,
             2026-10-23, Q71) : dans le déroulant Tarifs, juste avant
             l'achat, elle donnait une raison d'attendre (« mon employeur a
             peut-être un tarif »). */
        ].filter(Boolean) }] }
    ];
  }

  function lienSousMenu(l) {
    if (!l.href) return '<a class="lien-hors" href="#">' + esc(l.nom) + '</a>';
    return '<a href="' + l.href + '"' + (l.promo ? ' class="nav-promo"' : '') + '>' +
      esc(l.nom) + (l.promo ? '<span class="nav-signal" aria-hidden="true"></span>' : '') + '</a>';
  }

  var CHEVRON = '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">' +
    '<path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* B.3 > intro : 4 entrées et un bouton Séance d'essai. L'état est
     facultatif : il ne sert qu'à savoir si une campagne tourne, pour
     l'entrée Offre du moment et le point sur Tarifs. */
  function entete(courante, racine, etat) {
    var base = racine || '';
    var menus = sousMenus(base, etat);
    /* Menu centré : la largeur du logo change d'une verticale à l'autre,
       un menu collé au logo bougerait avec lui (Hugo, 2026-10-23). À
       droite, deux actions qui ne pèsent pas pareil : l'abonnement est
       l'objectif, il est le seul bouton. La séance d'essai est un lien
       texte, pour ne pas la mettre au même niveau (Hugo, 2026-10-23).
       « S'abonner » et non « S'inscrire » : c'est déjà le mot des cartes
       club et de la barre récap, et B.3 tient à un seul mot par chose.
       L'espace membre est dans la barre groupe, commun aux cinq sites.
       Chaque entrée reste un lien vers sa rubrique ; la flèche à côté
       ouvre le déroulant. Il s'ouvre au survol et au focus, sans
       JavaScript, comme le point d'info de Tarifs : au toucher, la flèche
       prend le focus et ouvre. */
    var nav = menus.map(function (m) {
      return '<div class="nav-rub' + (m.nom === 'Clubs' ? ' nav-rub--large' : '') + '">' +
        '<a class="nav-rub__lien" href="' + m.href + '"' + (m.nom === courante ? ' aria-current="page"' : '') + '>' +
        esc(m.nom) + (m.signal ? '<span class="nav-signal" title="Une offre est en cours"></span>' +
          '<span class="sr-only"> (offre en cours)</span>' : '') + '</a>' +
        '<button type="button" class="nav-rub__fleche" aria-label="Sous-menu ' + esc(m.nom) + '">' + CHEVRON + '</button>' +
        '<div class="nav-rub__panneau"><div class="nav-rub__boite">' +
        m.groupes.map(function (g) {
          return '<div class="nav-rub__groupe">' + (g.titre ? '<div class="nav-rub__titre">' + esc(g.titre) + '</div>' : '') +
            g.liens.map(lienSousMenu).join('') + '</div>';
        }).join('') +
        (m.tous ? '<a class="nav-rub__tous" href="' + m.href + '">' + esc(m.tous) + '</a>' : '') +
        '</div></div></div>';
    }).join('');

    /* Mobile : un burger, panneau sous le header, une rubrique par
       accordéon (<details>, sans JavaScript). En bas, la séance d'essai et
       l'espace membre, que le header mobile n'a pas la place de montrer. */
    var burger = '<details class="burger">' +
      '<summary aria-label="Menu"><svg class="burger__ouvrir" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
      '<svg class="burger__fermer" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></summary>' +
      '<div class="burger__panneau">' +
      menus.map(function (m) {
        return '<details class="burger__rub"' + (m.nom === courante ? ' open' : '') + '>' +
          '<summary' + (m.nom === courante ? ' aria-current="page"' : '') + '>' + esc(m.nom) +
          (m.signal ? '<span class="nav-signal" title="Une offre est en cours"></span>' : '') + CHEVRON + '</summary>' +
          '<div class="burger__liens">' +
          (m.tous ? '<a href="' + m.href + '">' + esc(m.tous) + '</a>' : '') +
          m.groupes.map(function (g) {
            return (g.titre ? '<div class="nav-rub__titre">' + esc(g.titre) + '</div>' : '') +
              g.liens.map(lienSousMenu).join('');
          }).join('') + '</div></details>';
      }).join('') +
      '<div class="burger__pied">' +
      '<a class="btn btn--secondaire btn--bloc" href="' + base + 'seance-essai/">Séance d\'essai</a>' +
      '<a class="lien-hors" href="#">Espace membre</a>' +
      '</div></div></details>';

    return '<header class="entete" data-spec="B.3 > Arborescence > Header">' +
      '<div class="entete__inner">' +
      '<a class="entete__logo" href="' + base + '">' + logo('harmony-fitness-logo.svg', 'Harmony Fitness, accueil', 'entete__img') + '</a>' +
      '<nav class="entete__nav" aria-label="Menu principal">' + nav + '</nav>' +
      '<div class="entete__actions">' +
      '<a class="entete__essai" href="' + base + 'seance-essai/">Séance d\'essai</a>' +
      '<a class="btn btn--entete" href="' + base + 'tarifs/">S\'abonner</a>' + burger +
      '</div></div></header>';
  }

  /* Les cantons où Harmony a des clubs, déduits des clubs eux-mêmes : une
     ouverture dans un troisième canton n'oblige pas à toucher le footer. */
  function cantons() {
    var vus = [];
    D.clubs.forEach(function (c) { if (vus.indexOf(c.canton) === -1) vus.push(c.canton); });
    return vus;
  }

  /* Tous les liens du footer pointaient vers « # », « Nous contacter »
     compris, alors que la page existe (Hugo, 2026-09-22). Un lien mort au
     bas de chaque page se lit comme une erreur de maquette, et c'en était
     une : le seul élément vivant en bas de page était le bandeau séance
     d'essai juste au-dessus, ce qui donnait au footer l'air de renvoyer là.
     Les liens vont maintenant aux pages qui existent. Celles qui ne sont
     pas au périmètre du lab (Besoin d'aide ?, Espace membre, le téléphone)
     gardent « # » et s'affichent en grisé, pour qu'on voie que c'est voulu
     et pas oublié. */
  function pied(base) {
    var b = base || '';
    var cols = [
      /* Les cantons se lisent dans les données, et avec le même libellé que
         partout ailleurs : "Canton de Genève", jamais "Genève" seul. */
      { titre: 'Nos clubs', liens: cantons().map(function (c) {
          return { nom: H.libelleCanton(c), href: b + 'clubs/#' + H.ancreCanton(c) };
        }) },
      { titre: 'Le sport', liens: [
        { nom: 'Plateau fitness', href: b + 'sport/plateau-fitness/' },
        { nom: 'Cours collectifs', href: b + 'sport/cours-collectifs/' },
        { nom: 'Small Group Training', href: b + 'sport/small-group-training/' },
        { nom: 'Coaching personnel', href: b + 'sport/coaching-personnel/' }
      ] },
      /* L'espace membre est aussi au footer (Hugo, 2026-10-23) : c'est là
         qu'un membre le cherche quand le header est replié sur mobile. Il
         vit chez l'outil métier, hors du lab, d'où le grisé. */
      { titre: 'Aide', liens: [
        { nom: "Besoin d'aide ?" },
        { nom: 'Espace membre' },
        { nom: 'Actualités', href: b + 'actualites/' },
        /* Renvoi vers la page Entreprises du site corporate, hors du lab
           (Q71). */
        { nom: 'Offre entreprise' }
      ] },
      /* Le footer ne donne plus d'adresse e-mail : un seul canal écrit, le
         formulaire, pour que toute demande soit comptée et dispatchée (Q37). */
      /* Pas de téléphone : on n'appelle pas Harmony (Hugo, 2026-10-23). */
      { titre: 'Contact', liens: [
        { nom: 'Nous contacter', href: b + 'nous-contacter/' }
      ] }
    ];
    return '<footer class="pied" data-spec="B.3 > Arborescence > Footer"><div class="pied__inner">' +
      /* Une seule inscription à la newsletter, ici, sur toutes les pages
         (Annexe A : « formulaire simple présent en footer »). B.3 la cite
         sur l'accueil : c'est ce footer qui la porte, pas un bloc en plus
         (Hugo, 2026-10-22, Q63). Le formulaire ne part nulle part dans le
         lab. */
      '<form class="pied__news" data-spec="Annexe A > Formulaire d\'inscription newsletter" onsubmit="return false">' +
      '<div><h2>Newsletter</h2><p>Nouveaux cours, événements et offres, par e-mail.</p></div>' +
      '<div class="pied__news-champs">' +
      '<label class="visuellement-cache" for="news-email">Votre adresse e-mail</label>' +
      '<input class="champ" id="news-email" type="email" placeholder="Votre adresse e-mail" autocomplete="email">' +
      '<button type="submit" class="btn">S\'inscrire</button></div>' +
      '</form>' +
      '<div class="pied__cols">' + cols.map(function (c) {
        return '<div><h2>' + esc(c.titre) + '</h2><ul style="list-style:none;padding:0">' +
          c.liens.map(function (l) {
            return l.href
              ? '<li><a href="' + l.href + '">' + esc(l.nom) + '</a></li>'
              : '<li><a class="pied__hors" href="#" title="Page hors du périmètre du lab">' +
                esc(l.nom) + '</a></li>';
          }).join('') +
          '</ul></div>';
      }).join('') + '</div>' +
      '<div class="pied__bas">Mentions légales · Confidentialité · Harmony Fitness</div>' +
      '</div></footer>';
  }

  /* Pied de landing : la même logique que le header. On garde ce qu'on ne
     peut pas retirer, les mentions légales, et un seul lien utile, le
     contact. Le reste emmènerait ailleurs (Q50). */
  function piedLanding(base) {
    return '<footer class="pied pied--landing" data-spec="B.3 > Tarifs et offres > Offre du moment (variante à valider)">' +
      '<div class="pied__inner"><div class="pied__bas">' +
      '<a href="' + (base || '') + 'nous-contacter/">Nous contacter</a> · ' +
      'Mentions légales · Confidentialité · Harmony Fitness</div></div></footer>';
  }

  function filAriane(items) {
    return '<nav class="fil">' + items.map(function (it, i) {
      return (i ? ' &rsaquo; ' : '') + (it.href ? '<a href="' + it.href + '">' + esc(it.nom) + '</a>' : esc(it.nom));
    }).join('') + '</nav>';
  }

  /* Header de landing (Hugo, 2026-09-16, Q50). Une page de campagne a un
     seul but : prendre l'offre annoncée par la publicité. Tout ce qui
     emmène ailleurs, menu, espace membre, séance d'essai, coûte des
     conversions payées au clic. Reste le logo, qui est la sortie de
     secours attendue de tout le monde, et une action.
     Ce header n'est pas dans B.3 : c'est une variante à valider. */
  function enteteLanding(base, opts) {
    var o = opts || {};
    return '<header class="entete entete--landing" data-spec="B.3 > Tarifs et offres > Offre du moment (variante à valider)">' +
      '<div class="entete__inner">' +
      '<a class="entete__logo" href="' + (base || '') + '">' + logo('harmony-fitness-logo.svg', 'Harmony Fitness, accueil', 'entete__img') + '</a>' +
      '<div class="entete__actions">' +
      (o.cta
        ? '<a class="btn" href="' + o.cta.href + '">' + esc(o.cta.libelle) + '</a>'
        : '') +
      '</div></div></header>';
  }

  /* Hero de landing : la photo porte la promesse, le panneau porte le nom,
     l'échéance et l'action. La photo va d'un bord à l'autre, elle n'est pas
     une illustration à côté du texte : sur une page de campagne, c'est elle
     qu'on voit avant de lire. */
  function heroLanding(o) {
    var opt = o || {};
    return '<section class="hero-landing" data-spec="B.3 > Tarifs et offres > Offre du moment">' +
      '<div class="hero-landing__photo">' +
      blocImage(opt.photo || 'Visuel de campagne, pleine largeur', 'landing') + '</div>' +
      '<div class="hero-landing__panneau">' +
      (opt.surtitre ? '<p class="hero-landing__sur">' + esc(opt.surtitre) + '</p>' : '') +
      '<h1>' + (opt.titreHtml || esc(opt.titre || '')) + '</h1>' +
      (opt.texte ? '<p>' + esc(opt.texte) + '</p>' : '') +
      (opt.compteur || '') +
      (opt.cta
        ? '<p class="hero-landing__actions"><a class="btn" href="' + opt.cta.href + '">' +
          esc(opt.cta.libelle) + '</a></p>'
        : '') +
      (opt.mention ? '<p class="mention">' + esc(opt.mention) + '</p>' : '') +
      /* Trois preuves dans le hero, pas plus : sur une landing d'annonce, la
         première chose qu'on se demande devant un prix, c'est « c'est
         sérieux ? » et « c'est près de chez moi ? ». Les chiffres se
         déduisent des données ; ceux qu'on n'a pas restent en placeholder,
         une note ne s'invente pas. */
      (opt.preuves && opt.preuves.length
        ? '<ul class="preuves">' + opt.preuves.map(function (pv) {
            return '<li><span class="preuves__valeur">' + esc(pv.valeur) + '</span>' +
              '<span class="preuves__libelle">' + esc(pv.libelle) + '</span></li>';
          }).join('') + '</ul>'
        : '') +
      '</div></section>';
  }

  function blocImage(legende, variante) {
    return '<div class="img ' + (variante ? 'img--' + variante : '') + '">' + esc(legende) + '</div>';
  }

  /* --- Catégories ------------------------------------------------ */

  /* B.3 > Catégories de clubs > Règles d'affichage : le badge est toujours
     accompagné de sa ligne d'accès, et la distinction ne repose jamais sur
     la seule couleur (forme + lettre). */
  function badgeCategorie(idCat, opts) {
    var cat = H.categorie(idCat); if (!cat) return '';
    var o = opts || {};
    return '<span data-spec="B.3 > Catégories de clubs > Règles d\'affichage">' +
      '<button type="button" class="badge-cat badge-cat--' + cat.id + '" data-act="panneau-cat" data-id="' + cat.id + '"' +
      ' aria-expanded="' + (o.ouvert ? 'true' : 'false') + '">' +
      'Club ' + esc(cat.nom) + '</button>' +
      (o.sansLigne ? '' : ' <span class="ligne-acces">' + esc(cat.ligneAcces) + '</span>') +
      (o.ouvert ? panneauCategorie(idCat) : '') + '</span>';
  }

  function panneauCategorie(idCat) {
    var cat = H.categorie(idCat); if (!cat) return '';
    return '<div class="panneau-cat">' +
      '<h4>Club ' + esc(cat.nom) + '</h4>' +
      '<p>' + esc(cat.promesse) + aValider(cat.promesseAValider) + '</p>' +
      '<p class="ligne-acces">' + esc(cat.ligneAcces) + '</p>' +
      '<a class="lien-texte" href="#categories">Voir les catégories de clubs</a></div>';
  }

  /* Module Catégories de clubs : saisi une fois, affiché sur /clubs
     (ancre #categories), sur /tarifs, en version courte sur l'accueil. */
  function moduleCategories(opts) {
    var o = opts || {};
    return '<section id="categories" data-spec="B.3 > Module « Catégories de clubs »">' +
      '<h2>Nos catégories de clubs</h2>' +
      /* Une catégorie de club n'est pas un produit : elle suit la grille de
         la section (3 colonnes sur toute la largeur), pas la largeur des
         cartes produit. */
      '<div class="grille grille--3">' + D.categories.map(function (cat) {
        return '<div class="bloc">' +
          '<h3>' + labelCat(cat) + '</h3>' +
          '<p>' + esc(cat.promesse) + aValider(cat.promesseAValider) + '</p>' +
          (o.court ? '' : '<ul>' + cat.socle.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>') +
          '<p class="ligne-acces">' + esc(cat.ligneAcces) + '</p>' +
          '<p class="mention">' + esc(R.ligneAcces(cat.id)) +
          /* H.vues est lu à l'appel, pas à la définition : ce module est le
             premier chargé, infoClubs arrive avec le suivant. */
          H.vues.infoClubs(cat.id) + '</p></div>';
      }).join('') + '</div>' +
      (o.court ? '' :
        '<details><summary class="lien-texte">Comment on classe Essential et Premium</summary>' +
        '<p class="mention">Essential : club 4 étoiles fitness-guide.ch. Premium : club 5 étoiles ' +
        'fitness-guide.ch et cours aquatiques en piscine. ' +
        '<a href="https://www.fitness-guide.ch" rel="noopener">fitness-guide.ch</a></p></details>') +
      '</section>';
  }

  /* --- Choix du club et carte ------------------------------------ */

  /* Le fond en SVG : la Suisse en blanc, l'étranger en gris bleuté,
     les cantons en pointillés, le lac en bleu clair. Quelques noms, pas
     plus : la carte situe les clubs, ce n'est pas un plan de ville. */
  function fondCarte() {
    var F = H.FOND_CARTE;
    return '<svg class="carte__svg" viewBox="0 0 ' + F.largeur + ' ' + F.hauteur + '"' +
      ' preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
      '<rect class="carte__ailleurs" width="' + F.largeur + '" height="' + F.hauteur + '"/>' +
      '<path class="carte__suisse" d="' + F.suisse + '"/>' +
      '<path class="carte__canton" d="' + F.geneve + '"/>' +
      '<path class="carte__canton" d="' + F.vaud + '"/>' +
      '<path class="carte__lac" d="' + F.leman + '"/>' +
      '<text class="carte__nom carte__nom--lac" x="700" y="300">Lac Léman</text>' +
      '<text class="carte__nom" x="360" y="190">Canton de Vaud</text>' +
      '<text class="carte__nom" x="60" y="935">Canton de Genève</text>' +
      '<text class="carte__nom carte__nom--ailleurs" x="700" y="740">France</text>' +
      '</svg>';
  }

  function carte(etat, opts) {
    var o = opts || {};
    return '<div class="carte-bloc">' +
      '<div class="carte" role="group" aria-label="Carte des ' + D.clubs.length + ' clubs">' +
      '<div class="carte__plan">' + fondCarte() +
      D.clubs.map(function (c) {
        var cat = H.categorie(c.categorie), p = H.position(c);
        var actif = etat.club === c.id || etat.survol === c.id;
        var classes = 'carte__repere carte__repere--' + cat.id +
          (actif ? ' carte__repere--actif' : '');
        var pos = ' style="left:' + p.x.toFixed(1) + '%;top:' + p.y.toFixed(1) + '%"';
        var titre = ' title="' + esc(c.nom) + ' · ' + esc(cat.nom) + '"' +
          ' aria-label="' + esc(c.nom) + ', club ' + esc(cat.nom) + '"';
        /* Sur l'accueil, la carte n'est pas un choix : un repère est un lien
           vers la page du club (opts.lien = base). Ailleurs, un bouton. */
        if (o.lien !== undefined) {
          return '<a class="' + classes + '"' + pos + titre + ' href="' + o.lien +
            'clubs/club/?club=' + c.id + '">' + cat.lettre + '</a>';
        }
        return '<button type="button" class="' + classes + '"' + pos +
          ' data-act="' + (o.mobile ? 'apercu-club' : 'choisir-club') + '" data-id="' + c.id + '"' +
          titre + '>' + cat.lettre + '</button>';
      }).join('') +
      '</div><span class="carte__source">Fond : OFS, GEOSTAT</span></div>' +
      /* Légende sous la carte, pour ne masquer aucun repère : la pastille
         du repère, sa lettre et le nom. La couleur ne dit rien seule. */
      '<div class="carte__legende">' + D.categories.map(function (cat) {
        return '<span><span class="carte__pastille carte__repere--' + cat.id + '">' + cat.lettre +
          '</span>' + esc(cat.nom) + '</span>';
      }).join('') + '</div>';
  }

  /* B.3 > Page Tarifs > trame > 2. Un seul composant pour /clubs, /tarifs,
     /offre-du-moment et /seance-essai : seul le libellé change. */
  function choixClub(etat, opts) {
    var o = opts || {};
    var libelle = o.libelle || 'Choisissez votre club référent';
    if (etat.club) return clubReplie(etat, o);
    /* sansTitre : quand le composant est déjà sous un titre de la page, il
       n'en remet pas un. Deux titres qui se suivent pour un seul bloc
       cassent la hiérarchie et se lisent comme deux sections. */
    return '<section class="choix-club" id="choix-club" data-spec="B.3 > Page Tarifs > Trame > 2">' +
      '<div>' + (o.sansTitre ? '' : '<h2>' + esc(libelle) + '</h2>') +
      R.clubsParCanton().map(function (g) {
        return '<div class="choix-club__canton">' + esc(H.libelleCanton(g.canton)) + '</div>' +
          g.clubs.map(function (c) {
            var cat = H.categorie(c.categorie);
            /* Vrai lien vers l'état du club, pas un bouton : la page marche
               même si le script ne se charge pas (B.3 > Page Tarifs). */
            return '<a class="club-ligne' +
              (etat.survol === c.id ? ' club-ligne--survol' : '') + '"' +
              ' href="?club=' + c.id + '"' +
              ' data-act="choisir-club" data-id="' + c.id + '"' +
              ' data-survol="' + c.id + '">' +
              '<span><span class="club-ligne__nom">' + esc(c.nom) + '</span> ' + labelCat(cat) +
              '<span class="club-ligne__meta"><br>' +
              esc(texte(c.adresse, '[adresse]')) + '</span></span></a>';
          }).join('');
      }).join('') +
      '<button type="button" class="btn btn--secondaire btn--bloc" data-act="ouvrir-carte" ' +
      'style="margin-top:10px">Voir sur la carte</button></div>' +
      carte(etat) + '</section>';
  }

  function clubReplie(etat, opts) {
    var o = opts || {};
    var c = H.club(etat.club), t = H.tarif(etat.tarif);
    return '<div class="club-replie" data-spec="B.3 > Page Tarifs > Trame > 2">' +
      '<strong>' + esc(o.libelleReplie || 'Club référent') + ' : ' + esc(c.nom) + '</strong>' +
      badgeCategorie(c.categorie, { sansLigne: true, ouvert: etat.catOuverte === c.categorie }) +
      (o.sansTarif ? '' : '<span>· Tarif ' + esc(t.nom) + '</span>') +
      '<button type="button" class="lien-texte" data-act="modifier-club" ' +
      'style="background:none;border:0;font:inherit;margin-left:auto">Modifier</button></div>';
  }

  /* Mobile : pastilles par canton, puis carte en plein écran. */
  function pastillesMobile(etat) {
    return '<section id="choix-club-mobile" data-spec="B.3 > Page Tarifs > Trame > 2 (mobile)">' +
      R.clubsParCanton().map(function (g) {
        return '<div class="choix-club__canton">' + esc(H.libelleCanton(g.canton)) + '</div>' +
          '<div class="pastilles">' + g.clubs.map(function (c) {
            var cat = H.categorie(c.categorie);
            return '<a class="btn btn--discret btn--petit" href="?club=' + c.id + '" ' +
              'data-act="choisir-club" data-id="' + c.id + '">' +
              esc(c.nom) + ' · ' + esc(cat.nom) + '</a>';
          }).join('') + '</div>';
      }).join('') +
      '<button type="button" class="btn btn--secondaire btn--bloc" data-act="ouvrir-carte" ' +
      'style="margin-top:12px">Voir sur la carte</button></section>';
  }

  function cartePleinEcran(etat, opts) {
    var o = opts || {};
    var c = etat.apercuClub ? H.club(etat.apercuClub) : null;
    return '<div class="carte-plein' + (o.fixe ? ' carte-plein--fixe' : '') +
      '" data-spec="B.3 > Page Tarifs > Règles > Carte">' +
      '<div class="carte-plein__barre">' +
      '<button type="button" class="btn btn--discret btn--petit" data-act="fermer-carte">Retour</button>' +
      '<strong>Nos clubs</strong></div>' +
      carte(etat, { mobile: true }) +
      (c ? '<div class="carte-plein__fiche"><strong>' + esc(c.nom) + '</strong> · ' +
        esc(H.categorie(c.categorie).nom) + '<br><span class="mention">' +
        esc(texte(c.adresse, '[adresse]')) + '</span><br>' +
        '<button type="button" class="btn btn--petit" data-act="choisir-club" data-id="' + c.id +
        '" style="margin-top:8px">Choisir ce club</button></div>' : '') +
      '</div>';
  }

  /* --- Sélecteurs ------------------------------------------------ */

  function selecteurTarif(etat) {
    return '<div data-spec="B.3 > Page Tarifs > Trame > 2">' +
      '<div class="segments">' + D.referentiels.tarifs.map(function (t) {
        return '<button type="button" data-act="tarif" data-id="' + t.id + '" aria-pressed="' +
          (etat.tarif === t.id) + '">' + esc(t.nom) +
          (t.mention ? ' · ' + esc(t.mention) : '') + '</button>';
      }).join('') + '</div>' +
      '<p class="mention" style="margin-top:6px">Justificatif d\'âge demandé en club.</p></div>';
  }

  function selecteurEngagement(etat) {
    return '<div class="segments" data-spec="B.3 > Page Tarifs > Trame > 4">' +
      D.referentiels.engagements.map(function (e) {
        return '<button type="button" data-act="engagement" data-id="' + e.id + '" aria-pressed="' +
          (etat.engagement === e.id) + '">' + esc(e.nom) + '</button>';
      }).join('') + '</div>';
  }
  /* Le bouton d'une carte cliquable (Hugo, 2026-10-23) : une surface
     cliquable sans bouton ne se devine pas. Toute la carte reste le lien
     (le titre s'étire par-dessus) ; le bouton le montre. Il est visuel,
     caché aux lecteurs d'écran, qui ont déjà le lien du titre. */
  function actionCarte(libelle) {
    return '<p class="carte__action"><span class="btn btn--tertiaire btn--petit" aria-hidden="true">' +
      esc(libelle) + '</span></p>';
  }
  return {
    actionCarte: actionCarte, labelCat: labelCat,
    barreGroupe: barreGroupe, entete: entete, enteteLanding: enteteLanding,
    heroLanding: heroLanding, pied: pied, piedLanding: piedLanding,
    filAriane: filAriane,
    blocImage: blocImage, badgeCategorie: badgeCategorie, panneauCategorie: panneauCategorie,
    moduleCategories: moduleCategories, carte: carte, choixClub: choixClub,
    clubReplie: clubReplie, pastillesMobile: pastillesMobile, cartePleinEcran: cartePleinEcran,
    selecteurTarif: selecteurTarif, selecteurEngagement: selecteurEngagement,
    forme: forme
  };
})();

/* ------------------------------------------------------------------ */
/* Composants Tarifs et contenu                                         */
/* ------------------------------------------------------------------ */
Object.assign(window.HF.vues, (function () {
  'use strict';
  var H = window.HF, D = H.data, R = H.regles, V = H.vues;
  var esc = H.esc, prixTexte = H.prixTexte, texte = H.texte;

  var moisEngagement = { sans: 1, '12mois': 12 };

  /* Les Extras compris dans une formule, nommés. Une ligne qui dit juste
     "Extras" ne vend rien : ce sont les noms qui font la différence entre
     Premium et Premium Platinum. Liste déduite du club référent quand il est choisi,
     sinon tous les Extras vendus en ligne. Au-delà de MAX_EXTRAS, on compte
     le reste plutôt que d'allonger la carte sans fin. */
  var MAX_EXTRAS = 4;
  /* Une seule grammaire pour tout ce qu'une ligne d'inclusion nomme : des
     tags, quatre au plus, puis on compte le reste. Allonger la carte sans
     fin la rend incomparable avec sa voisine. */
  /* max : quatre par défaut, la limite d'une carte. Un bloc pleine largeur
     qui parle d'un seul club les montre tous : il n'a pas à être comparable
     à un voisin. */
  function tagsListe(noms, max) {
    if (!noms.length) return '';
    var montres = noms.slice(0, max || MAX_EXTRAS);
    var reste = noms.length - montres.length;
    return '<span class="tags tags--inclus">' +
      montres.map(function (n) { return '<span class="tag">' + esc(n) + '</span>'; }).join('') +
      (reste ? '<span class="tag tag--secondaire">et ' + reste + ' autre' +
        (reste > 1 ? 's' : '') + '</span>' : '') +
      '</span>';
  }

  function detailExtras(etat) {
    var liste = (etat && etat.club ? R.extrasDuClub(etat.club) : D.extras)
      .filter(function (e) { return e.modeVente === 'en-ligne'; });
    return tagsListe(liste.map(function (e) { return e.nom; }));
  }

  /* B.3 > Page Tarifs > trame > 4 : les lignes d'inclusion sont toujours
     affichées, dans le même ordre, avec "Non inclus" quand c'est le cas (Q4). */
  function lignesInclusion(p, etat) {
    return '<ul class="produit__inclus">' + D.referentiels.inclusions.map(function (inc) {
      var v = p.inclus ? p.inclus[inc.id] : false;
      /* Seule la ligne Extras porte un détail, et seulement quand elle est
         incluse : sur les autres formules, "Non inclus" dit déjà tout. */
      var detail = (inc.id === 'extras' && v === true) ? detailExtras(etat) : '';
      /* Ligne déduite : la valeur n'est pas dans le produit, elle se calcule.
         Les espaces wellness ouverts par la formule séparent nettement Gym,
         Essential et Premium, et personne n'a à les saisir produit par
         produit. */
      if (inc.derive === 'wellness') {
        var espaces = R.espacesDeFormule(p.categorie);
        if (!espaces.length) {
          return '<li class="non"><span class="produit__marque">·</span><span>' +
            esc(inc.libelle) + ' : Non inclus</span></li>';
        }
        return '<li><span class="produit__marque">✓</span><span>' +
          esc(inc.libelle) + tagsListe(espaces.map(function (e) { return e.nom; })) +
          '</span></li>';
      }
      /* Une ligne de cours dit combien de cours différents la formule ouvre,
         pas combien de séances : c'est ce qui sépare Essential de Premium. */
      var compte = '';
      if (inc.format && v === true) {
        var n = R.nbCoursFormule(p.categorie, inc.format);
        compte = ' : ' + (n ? n + ' cours' : '[X] cours');
      }
      if (v === true) {
        return '<li><span class="produit__marque">✓</span><span>' +
          esc(inc.libelle) + esc(compte) + detail + '</span></li>';
      }
      if (v === false || v === undefined) {
        return '<li class="non"><span class="produit__marque">·</span><span>' +
          esc(inc.libelle) + ' : Non inclus</span></li>';
      }
      return '<li><span class="produit__marque">✓</span><span>' +
        esc(inc.libelle) + ' : ' + esc(v) + '</span></li>';
    }).join('') + '</ul>';
  }

  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',
    'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  function dateTexte(iso) {
    if (!iso) return '[date]';
    var d = new Date(iso);
    return d.getDate() + ' ' + MOIS[d.getMonth()] + ' ' + d.getFullYear();
  }

  function joursRestants(fin) {
    if (!fin) return null;
    return Math.max(0, Math.ceil((new Date(fin) - new Date()) / 86400000));
  }

  /* Échéance qui s'applique à ce produit : celle de la campagne qui le
     remise, ou la sienne s'il est lui-même un produit promo daté. */
  function finDuProduit(p, pr) {
    if (pr.promo && pr.promo.validite) return pr.promo.validite.fin;
    return p.validite ? p.validite.fin : null;
  }

  function texteRemise(promo) {
    return '- ' + promo.remise.valeur + (promo.remise.type === 'montant' ? ' CHF' : '%');
  }

  /* Photo d'illustration en tête de carte : elle humanise le produit.
     Deux pastilles se posent dessus, jamais plus : le pourcentage de remise
     à gauche, les jours restants à droite.
     La campagne peut tourner sans porter sur l'engagement affiché. La
     pastille est alors en contour et dit sa condition ("- 15% · 12 mois") :
     sinon une remise réservée aux 12 mois serait invisible depuis l'état par
     défaut de la page. Le prix, lui, n'est pas barré : il n'est pas remisé.
     Une carte sans photo saisie n'affiche pas de cadre vide. */
  function photoProduit(p, pr, etat, opts) {
    var ailleurs = pr.promo ? null : R.promoAutreEngagement(p, etat);
    var promo = pr.promo || ailleurs;
    /* Sur la landing d'une campagne, l'échéance est déjà au hero, une seule
       fois pour toute la page : la répéter sur chaque carte donnerait le
       même nombre deux fois à l'écran. */
    var jours = (opts && opts.sansJours) ? null
      : joursRestants(promo && promo.validite ? promo.validite.fin
        : (p.validite ? p.validite.fin : null));
    var gauche = !promo ? '' :
      '<span class="pastille-remise pastille-remise--sur-photo' +
      (ailleurs ? ' pastille-remise--conditionnee' : '') + '">' + texteRemise(promo) +
      (ailleurs ? ' · ' + esc(R.libelleEngagementsCourt(ailleurs)) : '') + '</span>';
    var droite = (jours === null) ? '' :
      '<span class="pastille-jours">' + jours + ' jours restants</span>';
    if (!gauche && !droite && !p.photo) return '';
    return '<div class="produit__photo">' +
      (p.photo ? V.blocImage(p.photo, 'large') : '') + gauche + droite + '</div>';
  }

  /* B.3 > Page Tarifs > Trame > 3 : une remise sur un produit existant
     s'affiche en pastille + prix barré. Le prix barré est toujours là quand
     une remise s'applique, même si le prix catalogue est encore inconnu :
     c'est un emplacement à prévoir en front, la barre et la taille le
     distinguent du prix remisé. */
  /* Point d'info sur la ligne d'accès : "Accès aux 10 clubs" ne dit pas
     lesquels. Au survol sur ordinateur, au toucher sur mobile, grâce à
     :focus-within : le déclencheur est un vrai bouton, donc toucher l'ouvre
     et toucher ailleurs le referme, sans une ligne de JavaScript.
     Liste groupée par canton, comme partout ailleurs. */
  function infoClubs(idCat) {
    var groupes = R.parCanton(R.clubsDeCategorie(idCat));
    if (!groupes.length) return '';
    return '<span class="infobulle">' +
      '<button type="button" class="infobulle__point" aria-label="Voir les clubs inclus">i</button>' +
      '<span class="infobulle__contenu" role="note">' +
      groupes.map(function (g) {
        return '<strong>' + esc(H.libelleCanton(g.canton)) + '</strong><br>' +
          g.clubs.map(function (c) { return esc(c.nom); }).join('<br>');
      }).join('<span class="infobulle__sep"></span>') +
      '</span></span>';
  }

  function blocPrix(pr, unite) {
    var barre = pr.promo
      ? ' <span class="produit__barre">' + prixTexte(pr.valeurCatalogue) + '</span>' : '';
    /* Prix remisé, prix barré, puis l'unité : "CHF 76.- CHF 89.- / mois".
       L'unité en dernier porte sur les deux. */
    return '<div class="produit__prix">' + prixTexte(pr.valeur) + barre +
      (unite ? ' <span class="produit__prix-unite">' + unite + '</span>' : '') + '</div>';
  }

  /* Une seule phrase pour dire la campagne, partout : son nom, la condition
     d'engagement si elle en a une, sa date de fin. */
  function phrasePromo(promo) {
    var cond = R.libelleEngagementsPromo(promo);
    return esc(promo.nom) + (cond ? ', ' + esc(cond) : '') +
      ', jusqu\'au ' + esc(dateTexte(promo.validite ? promo.validite.fin : null));
  }

  function ligneRemise(pr) {
    if (!pr.promo) return '';
    return '<p class="mention produit__promo">' + phrasePromo(pr.promo) + '</p>';
  }

  /* La campagne porte sur ce produit mais pas sur l'engagement affiché : on
     le dit, sans pastille ni prix barré, puisque ce prix-là n'est pas remisé.
     Sinon une remise réservée aux 12 mois resterait invisible sur l'état par
     défaut de la page, qui est "Sans engagement". */
  function ligneRemiseAilleurs(p, etat) {
    var promo = R.promoAutreEngagement(p, etat);
    if (!promo) return '';
    return '<p class="mention produit__promo produit__promo--ailleurs">' +
      phrasePromo(promo) + '</p>';
  }

  /* Carte produit, trois variantes : formule, offre, carnet.
     Sans club : aucun bouton de souscription, jamais un bouton désactivé. */
  /* opts.pied remplace le bouton de pied de carte. La page Tarifs fait
     choisir un produit, qui remplit la barre récap ; la landing d'une
     campagne, elle, envoie directement au tunnel (B.3 > Offre du moment).
     Deux parcours différents, une seule carte. */
  function carteProduit(p, etat, opts) {
    var o = opts || {};
    var dispo = R.produitDisponible(p, etat.club);
    if (!dispo) return '';
    var choisi = etat.produitChoisi === p.id;
    var pr = R.prix(p, etat.tarif, etat.engagement, etat);
    var haut = '', bas = '', pied = '', specRef;

    if (p.type === 'formule') {
      specRef = 'B.3 > Page Tarifs > Trame > 4';
      var mois = moisEngagement[etat.engagement] || 1;
      var total = (typeof pr.valeur === 'number') ? pr.valeur * mois : null;
      haut =
        '<p class="produit__acces">' + esc(R.ligneAcces(p.categorie)) +
        infoClubs(p.categorie) + '</p>' +
        lignesInclusion(p, etat) +
        ligneRemise(pr) + ligneRemiseAilleurs(p, etat) +
        (pr.mentionRepli ? '<p class="mention">' + esc(pr.mentionRepli) + '</p>' : '');
      bas =
        blocPrix(pr, '/ mois') +
        '<div class="produit__total">Total ' +
        esc(H.engagement(etat.engagement).nom.toLowerCase()) + ' : ' + prixTexte(total) + '</div>';
      pied = etat.club
        ? '<button type="button" class="btn btn--bloc" data-act="choisir-produit" data-id="' +
          p.id + '">Choisir ' + esc(p.nom) + '</button>'
        : '';

    } else if (p.type === 'offre') {
      specRef = 'B.3 > Page Tarifs > Trame > 3';
      var pm = R.parMois(p);
      haut =
        '<p class="produit__duree">' + esc(texte(p.duree, '[durée]')) + '</p>' +
        '<p class="produit__acces">' + esc(R.ligneAcces(p.categorie)) +
        infoClubs(p.categorie) + '</p>' +
        lignesInclusion(p, etat);
      haut += ligneRemise(pr) +
        (pr.mentionRepli ? '<p class="mention">' + esc(pr.mentionRepli) + '</p>' : '');
      bas =
        blocPrix(pr, '') +
        '<div class="produit__total">soit env. ' + prixTexte(pm) + ' par mois</div>';
      pied = etat.club
        ? '<button type="button" class="btn btn--bloc" data-act="choisir-produit" data-id="' +
          p.id + '">Choisir ' + esc(p.nom) + '</button>'
        : '';

    } else {
      specRef = 'B.3 > Page Tarifs > Trame > 5';
      var entrees = p.nbEntrees;
      var parEntree = (typeof pr.valeur === 'number' && entrees)
        ? Math.round(pr.valeur / entrees) : null;
      /* Le volume est déjà dans le nom du carnet : ne pas le répéter. */
      haut =
        '<p class="produit__acces">' + esc(R.ligneAcces(p.categorie)) +
        infoClubs(p.categorie) + '</p>' +
        '<p class="mention">Valable ' + esc(texte(p.duree, '[X] mois')) +
        ' à partir de l\'achat</p>';
      haut += ligneRemise(pr) +
        (pr.mentionRepli ? '<p class="mention">' + esc(pr.mentionRepli) + '</p>' : '');
      bas =
        blocPrix(pr, '') +
        '<div class="produit__total">' + prixTexte(parEntree) + " par entrée</div>";
      pied = etat.club
        ? '<button type="button" class="btn btn--bloc" data-act="choisir-produit" data-id="' +
          p.id + '">Acheter ce carnet</button>'
        : '';
    }

    /* Le pied fourni par la page décide seul, club ou pas : sur une landing,
       une carte sans club doit quand même porter l'étape suivante, sinon
       elle n'a aucune action (Hugo, 2026-09-16). Sans pied fourni, la règle
       de B.3 tient : pas de bouton de souscription sans club référent. */
    if (o.pied) pied = o.pied(p, etat);

    /* Le bloc bas est collé en pied de carte, et ne contient que le prix, le
       total et le bouton : trois éléments de hauteur constante. Les prix se
       lisent donc sur la même ligne d'une carte à l'autre, quelle que soit la
       longueur de ce qu'il y a au-dessus. Les mentions de campagne et de
       tarif restent au-dessus du prix, où elles l'annoncent. */
    return '<article class="produit' + (choisi ? ' produit--choisi' : '') + '" data-spec="' + specRef + '">' +
      photoProduit(p, pr, etat, o) +
      '<h3>' + H.nomProduitHtml(p) + '</h3>' + haut +
      '<div class="produit__bas">' + bas +
      '<div class="produit__pied">' + pied + '</div></div></article>';
  }

  /* L'Extra est une ligne pleine largeur, empilée sous les Abonnements.
     Ce n'est pas une carte produit : on ne le compare pas à ses voisins, on
     le lit et on l'ajoute.
     Vendu en ligne : prix + "Ajouter". Vendu en club : "Sur demande en
     club", sans prix ni bouton. */
  /* Pour l'Extra qui regroupe les Small Group Training, la description
     générique n'apprend rien : ce que le visiteur veut savoir, c'est ce qu'il
     pourra faire dans SON club. On liste donc les trainings, lus sur le
     planning. Un club sans séance encore saisie garde la description. */
  /* Une liste de trainings nommés, précédée de sa portée. Le libellé porte
     toute l'information : sans lui, deux listes côte à côte se lisent comme
     une seule liste coupée en deux. */
  function ligneSgt(libelle, liste) {
    return '<p class="extra__ou"><span class="extra__portee">' + esc(libelle) +
      '</span> ' + liste.map(function (c) { return esc(c.nom); }).join(' · ') + '</p>';
  }

  /* Deux lignes plutôt qu'une (Hugo, 2026-09-22). Ce que le club référent
     propose et ce que la formule ouvre ailleurs sont deux questions
     différentes, et une seule liste répondait à la première en laissant
     croire qu'elle répondait aux deux.
     Sur une page club, la question « et ailleurs ? » ne se pose pas : la
     page parle d'un club, on garde une ligne. */
  function lignesSgt(etat, opts) {
    var idClub = etat && etat.club;
    var tous = R.smallGroupTrainings();

    if (!idClub) return tous.length ? ligneSgt('Selon les clubs', tous) : '';

    var ici = R.sgtDuClub(idClub);
    if ((opts || {}).portee === 'club') {
      return ici.length ? ligneSgt('Dans ce club', ici) : '';
    }

    /* La portée de la deuxième ligne se déduit de la formule choisie. Tant
       qu'aucune n'est choisie, on ne peut pas la nommer, donc on ne la nomme
       pas : on montre le catalogue entier en disant que la formule décide. */
    var p = etat.produitChoisi ? H.produit(etat.produitChoisi) : null;
    var formule = p && p.type === 'formule' ? p : null;
    var ailleurs = formule ? R.sgtDeCategorie(formule.categorie) : tous;
    var libelle = formule
      ? 'Dans tous les clubs de la formule ' + formule.nom
      : 'Dans les autres clubs, selon votre formule';

    if (!ici.length) return ailleurs.length ? ligneSgt(libelle, ailleurs) : '';

    /* Deux lignes identiques ne sont pas deux informations : quand le club
       référent propose déjà tout ce que la formule ouvre, une seule ligne. */
    var memes = ici.length === ailleurs.length && ici.every(function (c, i) {
      return c.id === ailleurs[i].id;
    });
    return ligneSgt('Dans votre club référent', ici) +
      (memes ? '' : ligneSgt(libelle, ailleurs));
  }

  function descriptionExtra(e, etat, opts) {
    var repli = '<p class="mention" style="margin:4px 0 0">' +
      esc(e.description) + '</p>';
    if (e.type !== 'sgt') return repli;
    /* Un club sans séance encore saisie garde la description générique. */
    return lignesSgt(etat, opts) || repli;
  }

  function carteExtra(e, etat, opts) {
    var enLigne = e.modeVente === 'en-ligne';
    var ajoute = (etat.extrasChoisis || []).indexOf(e.id) !== -1;
    var inclus = R.extraInclus(e, etat);
    return '<div class="extra" data-spec="B.3 > Page Tarifs > Trame > 4 (Extras)">' +
      '<div class="extra__corps">' +
      '<strong>' + esc(e.nom) + '</strong> <span class="extra__marque">Extra</span>' +
      descriptionExtra(e, etat, opts) + '</div>' +
      '<div class="extra__droite">' +
      (inclus
        ? '<span class="extra__inclus">Inclus avec la formule ' +
          esc(H.produit(etat.produitChoisi).nom) + '</span>'
        : enLigne
          ? '<strong>' + prixTexte(e.prix) + '</strong>' +
            (etat.club
              ? '<button type="button" class="btn btn--secondaire btn--petit" data-act="' +
                (ajoute ? 'retirer-extra' : 'ajouter-extra') + '" data-id="' + e.id + '">' +
                (ajoute ? 'Retirer' : 'Ajouter') + '</button>'
              : '')
          : '<span class="mention">Sur demande en club</span>') +
      '</div></div>';
  }

  /* B.3 > Page Tarifs > Trame > 3 : une remise sur un produit existant
     s'affiche sur la carte du produit. La section Offre du moment ne la
     duplique donc pas en carte : elle l'annonce en une ligne et renvoie
     à la section où le produit vit. Un seul produit, un seul bouton. */
  function annoncePromo(etat, opts) {
    var o = opts || {};
    var promo = R.promoVisible(etat);
    if (!promo) return '';
    /* Sur Tarifs, le lien est une ancre dans la page. Ailleurs, il renvoie
       à la même ancre sur Tarifs, avec le club déjà choisi. */
    var liens = R.sectionsDePromo(promo).map(function (s) {
      return '<a class="lien-texte" href="' + (o.lienBase || '') + '#' + s.ancre + '">' +
        esc(s.nom) + '</a>';
    }).join(' ');
    var cond = R.libelleEngagementsPromo(promo);
    return '<p class="annonce" data-spec="' + esc(o.spec || 'B.3 > Page Tarifs > Trame > 3') + '">' +
      '<strong>Jusqu\'au ' + esc(dateTexte(promo.validite ? promo.validite.fin : null)) +
      '</strong> : ' + esc(promo.nom) + (cond ? ', ' + esc(cond) : '') + '. ' + liens + '</p>';
  }

  /* Les produits non disponibles sont regroupés en une ligne en fin de
     section, jamais affichés en cartes grisées. Contraste normal. */
  function ligneIndisponible(produits, etat) {
    if (!etat.club) return '';
    var absents = produits.filter(function (p) { return !R.produitDisponible(p, etat.club); });
    if (!absents.length) return '';
    var c = H.club(etat.club);
    return '<p class="indispo" data-spec="B.3 > Page Tarifs > Règles > Grisé">' +
      'Pas disponible depuis ' + esc(c.nom) + ' : ' +
      absents.map(function (p) { return esc(p.nom); }).join(', ') + '. ' +
      '<a class="lien-texte" href="#categories">Pourquoi ?</a></p>';
  }

  /* Sans club : ligne en tête de section, aucun bouton désactivé.
     opts.lien rend la ligne actionnable : sur une landing, le choix du club
     est plus bas dans la page, et une phrase qui dit quoi faire sans donner
     le moyen de le faire est une impasse. */
  function ligneSansClub(etat, opts) {
    if (etat.club) return '';
    var o = opts || {};
    return '<p class="indispo" data-spec="B.3 > Page Tarifs > Règles > Sans club">' +
      esc(o.texte || 'Choisissez d\'abord votre club pour souscrire.') +
      (o.lien
        ? ' <a class="lien-texte" href="' + o.lien.href + '">' + esc(o.lien.libelle) + '</a>'
        : '') + '</p>';
  }

  /* Une seule barre collante en haut. Pas de barre d'ancres. */
  /* Sans club, la barre attend (Hugo, 2026-10-22) : tant que le choix du
     club est à l'écran, « Choisir mon club » ferait doublon avec lui. Elle
     glisse en haut de l'écran une fois le bloc de choix dépassé, et le
     bouton y ramène. Avec un club, elle colle comme avant. */
  function barreCollante(etat) {
    var c = etat.club ? H.club(etat.club) : null;
    return '<div class="barre-collante' + (c ? '' : ' barre-collante--attente') + '"' +
      ' data-spec="B.3 > Page Tarifs > Règles > Barre collante">' +
      '<div class="barre-collante__inner">' +
      (c
        ? '<span>Club référent : <strong>' + esc(c.nom) + '</strong></span>' +
          '<button type="button" class="lien-texte" data-act="modifier-club" ' +
          'style="background:none;border:0;font:inherit">Modifier</button>'
        : '<button type="button" class="btn btn--petit" data-act="aller-choix-club">Choisir mon club</button>') +
      '</div></div>';
  }

  /* Barre récap : produit, engagement, tarif, extras, total par mois.
     Elle est fixée en bas d'écran (B.3 : "barre récap en bas d'écran"),
     et apparaît dès qu'un produit est choisi : c'est le bouton de
     validation qui emmène à l'étape suivante. L'espaceur qui la précède
     rend au document la hauteur qu'elle lui prend, pour que le pied de
     page reste atteignable. Le nom Echino n'apparaît jamais. */
  function barreRecap(etat) {
    if (!etat.produitChoisi) return '';
    var p = H.produit(etat.produitChoisi);
    if (!p) return '';
    /* Un carnet s'achète, il ne s'abonne pas. */
    var libelle = (p.type === 'carnet')
      ? 'Finaliser mon achat' : 'Finaliser mon abonnement';
    var pr = R.prix(p, etat.tarif, etat.engagement, etat);
    var extras = (etat.extrasChoisis || []).map(H.extra).filter(Boolean);
    var detail = [H.tarif(etat.tarif).nom];
    if (p.type === 'formule') detail.push(H.engagement(etat.engagement).nom);
    if (p.type === 'offre') detail.push(texte(p.duree, '[durée]'));
    if (extras.length) detail.push(extras.map(function (e) { return e.nom; }).join(', '));
    return '<div class="barre-recap__espace" aria-hidden="true"></div>' +
      '<div class="barre-recap" data-spec="B.3 > Page Tarifs > Règles > Barre récap">' +
      (etat.message ? '<div class="barre-recap__message">' + esc(etat.message) + '</div>' : '') +
      '<div class="barre-recap__inner">' +
      '<div><strong>' + esc(p.nom) + '</strong>' +
      '<div class="barre-recap__detail">' + esc(detail.join(' · ')) + '</div></div>' +
      '<div class="barre-recap__total">' + prixTexte(pr.valeur) +
      (p.type === 'formule' ? ' / mois' : '') + '</div>' +
      '<button type="button" class="btn" data-act="finaliser">' + esc(libelle) + '</button>' +
      '</div></div>';
  }

  /* "Tarif adulte dès CHF X.– / mois", avec la pastille quand le montant
     vient d'une promo. Un seul endroit pour cette ligne : carte club, hero
     de la page club. */
  function desParMoisTexte(idClub, etat) {
    var des = R.desParMoisDetail(idClub, etat);
    return 'Tarif adulte dès ' + prixTexte(des.valeur) + ' / mois' +
      (des.promo ? ' <span class="pastille-remise">- ' + des.promo.remise.valeur +
        (des.promo.remise.type === 'montant' ? ' CHF' : '%') + '</span>' : '');
  }

  /* B.3 > Carte club : toute la carte est cliquable, un seul bouton
     "S'abonner", un lien texte "Planning". Pas de liens imbriqués. */
  function carteClub(c, etat, opts) {
    var o = opts || {};
    var cat = H.categorie(c.categorie);
    return '<article class="carte-club" data-spec="B.3 > Carte club">' +
      '<h3 class="carte-club__titre"><a class="carte-club__lien" href="' +
      (o.base || '') + 'clubs/club/?club=' + c.id + '">' + esc(c.nom) + '</a></h3>' +
      '<p>' + V.badgeCategorie(c.categorie, { ouvert: etat.catOuverte === c.categorie }) + '</p>' +
      '<p class="mention">' + esc(texte(c.adresse, '[adresse]')) + '</p>' +
      /* Atouts en liste cochée, comme les équipements du ClubCard du
         design system : deux ou trois points forts, lus d'un coup d'oeil. */
      '<ul class="atouts">' + c.atouts.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>' +
      '<p class="carte-club__cours">' + esc(R.ligneCoursCarteClub(c.id)) + '</p>' +
      '<div class="carte-club__pied">' +
      '<a class="btn btn--petit" href="' + (o.base || '') + 'tarifs/?club=' + c.id +
      '&amp;source=' + (o.source || 'liste-clubs') + '">S\'abonner</a>' +
      '<a class="btn btn--tertiaire btn--petit" href="' + (o.base || '') + 'clubs/club/?club=' + c.id + '">Voir le club</a>' +
      '<span class="mention">' + desParMoisTexte(c.id, etat) + '</span>' +
      '<a class="lien-texte" href="' + (o.base || '') + 'clubs/club/?club=' + c.id +
      '#planning">Planning</a></div></article>';
  }

  /* --- Contenu ---------------------------------------------------- */

  /* B.3 > Trame de la page club > 4 : filtres jour, objectif, intensité,
     format. Seuls les formats présents dans le club s'affichent. Les
     séances de Small Group Training portent le marqueur "Extra". */
  function planning(idClub, etat) {
    var f = etat.filtres || {};
    var seances = R.seancesDuClub(idClub);
    var formatsPresents = [];
    seances.forEach(function (s) {
      var co = H.cours(s.cours);
      if (co && formatsPresents.indexOf(co.format) === -1) formatsPresents.push(co.format);
    });

    function opt(liste, courant, cle, vide) {
      return '<select data-act="filtre" data-cle="' + cle + '"><option value="">' + vide + '</option>' +
        liste.map(function (x) {
          return '<option value="' + x.id + '"' + (courant === x.id ? ' selected' : '') + '>' +
            esc(x.nom) + '</option>';
        }).join('') + '</select>';
    }

    /* Le jour se choisit dans la rangée des jours, pas dans un filtre. */
    var filtres = '<div class="filtres">' +
      opt(D.referentiels.objectifs, f.objectif, 'objectif', 'Tous les objectifs') +
      opt(D.referentiels.intensites, f.intensite, 'intensite', 'Toutes les intensités') +
      opt(D.referentiels.formats.filter(function (x) { return formatsPresents.indexOf(x.id) !== -1; }),
          f.format, 'format', 'Tous les formats') +
      '</div>';

    var visibles = seances.filter(function (s) {
      var co = H.cours(s.cours); if (!co) return false;
      if (f.objectif && co.objectifPrincipal !== f.objectif) return false;
      if (f.intensite && co.intensite !== f.intensite) return false;
      if (f.format && co.format !== f.format) return false;
      return true;
    });

    /* La semaine affichée, lue dans l'outil de réservation (Hugo,
       2026-10-23) : de vraies dates, la semaine en cours d'abord, trois
       semaines à l'avance au plus. Le lab rejoue le planning type. */
    var dec = etat.semaine || 0;
    var auj = new Date(); auj.setHours(0, 0, 0, 0);
    var idxAuj = (auj.getDay() + 6) % 7;
    var lundi = new Date(auj);
    lundi.setDate(auj.getDate() - idxAuj + 7 * dec);
    var dates = D.referentiels.jours.map(function (j, i) {
      var d = new Date(lundi); d.setDate(lundi.getDate() + i); return d;
    });
    function jourMois(d, opts) {
      return d.toLocaleDateString('fr-CH', opts).replace(/(^|\s)1(\s)/, '$11er$2');
    }
    var dimanche = dates[6];
    var titreSemaine = 'Semaine du ' + jourMois(lundi, { day: 'numeric' }) +
      (lundi.getMonth() !== dimanche.getMonth() ? ' ' + jourMois(lundi, { month: 'long' }) : '') +
      ' au ' + jourMois(dimanche, { day: 'numeric', month: 'long' });
    var nav = '<div class="semaine-nav">' +
      '<button type="button" class="btn btn--secondaire btn--petit" data-act="semaine" data-id="prec"' +
      (dec === 0 ? ' disabled' : '') + ' aria-label="Semaine précédente">‹</button>' +
      '<button type="button" class="btn btn--secondaire btn--petit" data-act="semaine" data-id="suiv"' +
      (dec === 3 ? ' disabled' : '') + ' aria-label="Semaine suivante">›</button>' +
      '<strong class="semaine-nav__titre">' + esc(titreSemaine) + '</strong>' +
      (dec ? '<button type="button" class="btn btn--tertiaire btn--petit" data-act="semaine" data-id="courante">Cette semaine</button>' : '') +
      '</div>';

    /* Les jours à l'horizontale, aujourd'hui choisi par défaut ; les cours
       du jour choisi en dessous, les uns sous les autres (Hugo,
       2026-10-23). Même composant sur ordinateur et sur mobile. */
    var choisi = etat.jourPlanning == null ? idxAuj : etat.jourPlanning;
    var jours = '<div class="jours" role="tablist" aria-label="Jour">' +
      D.referentiels.jours.map(function (jour, i) {
        var n = visibles.filter(function (s) { return s.jour === jour; }).length;
        var estAuj = dates[i].getTime() === auj.getTime();
        return '<button type="button" role="tab" class="jours__jour' +
          (i === choisi ? ' jours__jour--choisi' : '') + (estAuj ? ' jours__jour--auj' : '') +
          (n ? '' : ' jours__jour--vide') + '" aria-selected="' + (i === choisi) + '"' +
          ' data-act="jour-planning" data-id="' + i + '"' +
          ' aria-label="' + esc(jourMois(dates[i], { weekday: 'long', day: 'numeric', month: 'long' }) +
            (estAuj ? ', aujourd\'hui' : '') + ', ' + n + ' cours') + '">' +
          '<span class="jours__nom">' + esc(estAuj ? 'Auj.' : jourMois(dates[i], { weekday: 'short' }).replace('.', '')) + '</span>' +
          '<span class="jours__date">' + dates[i].getDate() + '</span></button>';
      }).join('') + '</div>';

    function minutes(h) { var p = h.split(':'); return Number(p[0]) * 60 + Number(p[1]); }
    function fin(s) {
      var m = minutes(s.heure) + s.duree;
      return Math.floor(m / 60) + ':' + ('0' + (m % 60)).slice(-2);
    }
    var duJour = visibles.filter(function (s) { return s.jour === D.referentiels.jours[choisi]; })
      .sort(function (a, b) { return a.heure.localeCompare(b.heure); });
    var titreJour = jourMois(dates[choisi], { weekday: 'long', day: 'numeric', month: 'long' })
      .replace(/^./, function (x) { return x.toUpperCase(); });
    var liste = duJour.length
      ? '<ul class="seances">' + duJour.map(function (s) {
          var co = H.cours(s.cours);
          var inten = D.referentiels.intensites.find(function (x) { return x.id === co.intensite; });
          var form = D.referentiels.formats.find(function (x) { return x.id === co.format; });
          return '<li class="seance-ligne' + (co.estExtra ? ' seance-ligne--extra' : '') + '">' +
            '<div class="seance-ligne__heure"><strong>' + esc(s.heure) + '</strong>' +
            '<span>' + esc(fin(s)) + '</span></div>' +
            '<div class="seance-ligne__corps">' +
            '<a class="seance-ligne__nom" href="' + H.lienCours(co, '../../') + '">' + esc(co.nom) + '</a>' +
            '<span class="seance-ligne__tags">' +
            (co.estExtra ? '<span class="extra__marque">Extra</span>' : '') +
            (inten ? '<span class="tag">' + esc(inten.nom) + '</span>' : '') +
            (form ? '<span class="tag">' + esc(form.nom) + '</span>' : '') +
            '<span class="seance-ligne__duree">' + esc(s.duree) + ' min</span></span></div></li>';
        }).join('') + '</ul>'
      : '<p class="planning__vide">Aucun cours ' +
        (f.objectif || f.intensite || f.format ? 'ne correspond à ces filtres ' : '') +
        'ce jour-là.</p>';

    return '<section id="planning" data-spec="B.3 > Trame de la page club > 4">' +
      '<h2>Planning</h2>' + filtres + nav + jours +
      '<h3 class="seances__titre">' + esc(titreJour) + '</h3>' + liste +
      '</section>';
  }

  /* Composant Personne : carte + panneau au clic. Pas de page coach.
     Forme du CoachCard du design system (2026-10-22) : photo ronde à
     gauche, prénom et badges à droite. En attendant la photo, les
     initiales ; la légende du placeholder reste dans le title.
     Mini bio facultative (Hugo, 2026-10-23) : sous les badges quand elle
     est saisie, rien sinon. */
  function grilleCoachs(liste, etat) {
    return '<div class="coachs" data-spec="B.3 > Fiche coach dans le CMS">' +
      liste.map(function (k) {
        return '<button type="button" class="coach' + (k.bio ? ' coach--bio' : '') + '" data-act="panneau-coach" data-id="' + k.id + '"' +
          ' aria-expanded="' + (etat.coachOuvert === k.id) + '">' +
          '<span class="coach__photo" title="' + esc('Photo : ' + k.prenom + ', coach à [club]') + '" aria-hidden="true">' +
          esc(k.prenom.charAt(0).toUpperCase()) + '</span>' +
          '<span class="coach__corps">' +
          '<span class="coach__prenom">' + esc(k.prenom) + '</span>' +
          '<span class="coach__badges">' + k.badges.map(function (b) {
            return '<span class="coach__badge">' + esc(b) + '</span>';
          }).join('') + '</span>' +
          (k.bio ? '<span class="coach__bio">' + esc(k.bio) + '</span>' : '') +
          '</span></button>';
      }).join('') + '</div>' +
      (etat.coachOuvert ? panneauCoach(etat.coachOuvert) : '');
  }

  function panneauCoach(id) {
    var k = H.coach(id); if (!k) return '';
    return '<div class="panneau-cat"><h4>' + esc(k.prenom) + '</h4>' +
      '<p class="mention">Intervient à : ' + k.lieux.map(function (l) {
        var c = H.club(l); return esc(c ? c.nom : l);
      }).join(', ') + '</p>' +
      (k.coachingPersonnel
        ? '<a class="lien-texte" href="../../sport/coaching-personnel/">Coaching personnel</a>' : '') +
      '</div>';
  }

  function faq(items, etat) {
    return '<section class="faq" data-spec="Annexe A > A.2 > FAQ contextuelle">' +
      items.map(function (it, i) {
        var ouvert = etat.faqOuverte === i;
        return '<button type="button" class="faq__q" data-act="faq" data-id="' + i + '"' +
          ' aria-expanded="' + ouvert + '">' + esc(it.q) + '<span>' + (ouvert ? '−' : '+') + '</span></button>' +
          (ouvert ? '<div class="faq__r">' + esc(it.r) + '</div>' : '');
      }).join('') + '</section>';
  }

  /* opts.portrait (accueil) : le premier témoignage en grand, avec son
     portrait à l'arc du logo, les autres en ligne avec un petit visage. On
     lit d'abord une personne, pas une grille de citations. */
  function temoignages(n, opts) {
    var txt = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor ' +
      'incididunt ut labore et dolore magna aliqua.';
    var out = [];
    if ((opts || {}).portrait) {
      var autres = [];
      for (var j = 1; j < (n || 3); j++) {
        autres.push('<li><span class="visage visage--petit" title="Photo : portrait du membre" aria-hidden="true"></span>' +
          '<div><p>« ' + txt + ' »</p><div class="temoignage__auteur">[Prénom], membre à [club]</div></div></li>');
      }
      return '<div class="temoignage-portrait" data-spec="Annexe A > A.2 > Bloc témoignage">' +
        V.blocImage('Photo : portrait d\'une membre, la soixantaine, dans son club, regard caméra', 'portrait') +
        '<div><blockquote class="temoignage-portrait__citation">« ' + txt + ' »</blockquote>' +
        '<div class="temoignage__auteur">[Prénom], membre à [club] depuis [année]</div>' +
        '<ul class="voix voix--une">' + autres.join('') + '</ul></div></div>';
    }
    for (var i = 0; i < (n || 3); i++) {
      out.push('<div class="temoignage"><p>« ' + txt + ' »</p>' +
        '<div class="temoignage__auteur">[Prénom], membre à [club]</div></div>');
    }
    return '<div class="grille grille--3" data-spec="Annexe A > A.2 > Bloc témoignage">' +
      out.join('') + '</div>';
  }

  /* Bloc de note, pour une landing d'annonce. Les chiffres ne sont pas
     inventés : une note et un nombre d'avis sont des faits, ils se lisent
     dans l'outil qui les collecte ou ils restent en placeholder. */
  /* La note se lit dans data.js, au format suisse (4,8 / 5). Le nombre
     d'avis reste un placeholder tant qu'il n'est pas fourni. */
  function noteValeur() {
    var a = D.avis || {};
    return a.note != null ? a.note.toLocaleString('fr-CH') + ' / ' + (a.sur || 5) : '[note] / 5';
  }
  function noteSource() {
    var a = D.avis || {};
    return a.source ? 'avis ' + a.source : '[source des avis]';
  }
  function noteAvis() {
    var a = D.avis || {};
    return '<div class="note" data-spec="Annexe A > A.2 > Preuve sociale">' +
      '<div class="note__valeur">' + esc(noteValeur()) + '</div>' +
      '<div class="note__detail">Moyenne de nos ' + R.nbClubs() + ' clubs sur ' + esc(a.source || '[source des avis]') +
      (a.nombre ? ' · ' + a.nombre + ' avis' : '') + '</div></div>';
  }

  /* B.3 > Page Tarifs > Trame > 6 : la sortie pour qui ne se reconnaît dans
     aucune formule. Volontairement discrète, une ligne de texte et un lien,
     pas un bloc de conversion : elle ne doit pas détourner de la souscription
     en ligne, juste exister pour ceux qui en ont besoin. Le club est passé au
     formulaire, qui le présélectionne, et la source permet de compter les
     demandes venues d'ici (Q37). */
  function ligneConseil(etat, base) {
    var c = etat.club ? H.club(etat.club) : null;
    var p = new URLSearchParams({ motif: 'conseil', source: 'tarifs' });
    if (c) p.set('club', c.id);
    return '<p class="conseil" data-spec="B.3 > Page Tarifs > Trame > 6">' +
      '<strong>Vous ne trouvez pas la formule qui vous convient ?</strong> ' +
      'Certains clubs proposent des arrangements sur mesure. ' +
      (c ? 'Parlez-en avec ' + esc(c.nom) + '. ' : 'Parlez-en avec votre club. ') +
      '<a class="lien-texte" href="' + (base || '') + 'nous-contacter/?' + p.toString() + '">' +
      (c ? 'Contacter ' + esc(c.nom) : 'Contacter un club') + '</a>' +
      '</p>';
  }

  /* Phrase de destination sous le formulaire de contact. On affiche à qui le
     message part, plutôt que de demander au visiteur de choisir : il ne
     connaît pas l'organisation d'Harmony, elle si. */
  function destinataireLigne(idMotif, idClub) {
    var d = R.destinataireContact(idMotif, idClub);
    if (!d.motif) {
      return '<p class="destinataire destinataire--vide">Choisissez un sujet : ' +
        'nous vous dirons à qui votre message part.</p>';
    }
    if (d.type === 'club' && !d.nom) {
      return '<p class="destinataire destinataire--vide">Choisissez votre club : ' +
        'ce sujet est traité par le club lui-même.</p>';
    }
    return '<p class="destinataire">Votre message part à <strong>' + esc(d.nom) +
      '</strong>. ' + esc(D.contact.delai) + '</p>';
  }

  /* Une demande d'essai part toujours au club : c'est lui qui rappelle et
     qui reçoit la personne. Pas de sujet à choisir, donc pas la même règle
     que le formulaire de contact, mais la même ligne à l'écran, pour que le
     visiteur sache où part sa demande avant de l'envoyer. */
  function destinataireEssai(idClub) {
    var c = idClub ? H.club(idClub) : null;
    if (!c) {
      return '<p class="destinataire destinataire--vide">Choisissez votre club : ' +
        'c\'est lui qui vous rappelle.</p>';
    }
    return '<p class="destinataire">Votre demande part à <strong>Harmony ' +
      esc(c.nom) + '</strong>. ' + esc(D.contact.delai) + '</p>';
  }

  /* Le CTA essai sert sur presque toutes les pages : sa référence de spec
     dépend donc de la page qui l'affiche, elle ne peut pas être figée. */
  /* --- Actualités ------------------------------------------------- */

  /* Thème et date d'un article : la même ligne sur la carte, en tête
     d'article et dans le teaser. Le thème est un tag, comme un attribut de
     cours : une valeur fermée du référentiel, qui porte son mot. */
  function metaArticle(a) {
    var t = R.themeActu(a.theme);
    return '<p class="article__meta">' +
      (t ? '<span class="tag">' + esc(t.nom) + '</span>' : '') +
      '<time datetime="' + esc(a.date) + '">' + esc(dateTexte(a.date)) + '</time></p>';
  }

  /* Carte d'article : elle mène quelque part, donc cliquable en entier,
     comme une carte de cours. Photo, thème et date, titre, chapeau. */
  function carteArticle(a, base) {
    return '<article class="produit produit--lien article-carte" data-spec="B.3 > Actualités > Liste des articles">' +
      '<div class="produit__photo">' + V.blocImage(a.photo, 'large') + '</div>' +
      metaArticle(a) +
      '<h3><a href="' + (base || '') + 'actualites/article/?article=' + esc(a.id) + '">' +
      esc(a.titre) + '</a></h3>' +
      '<p class="mention">' + esc(a.chapeau) + '</p>' + V.actionCarte('Lire l\'article') + '</article>';
  }

  /* L'article à la une : une carte couchée, la photo plus grande, le titre
     plus gros. Cliquable en entier comme les autres. */
  function carteArticleUne(a, base) {
    return '<article class="produit produit--lien article-une" data-spec="B.3 > Actualités > À la une">' +
      V.blocImage(a.photo, 'large') +
      '<div class="article-une__texte">' + metaArticle(a) +
      '<h2><a href="' + (base || '') + 'actualites/article/?article=' + esc(a.id) + '">' +
      esc(a.titre) + '</a></h2>' +
      '<p class="article-une__chapeau">' + esc(a.chapeau) + '</p>' +
      V.actionCarte('Lire l\'article') + '</div></article>';
  }

  /* La liste : un article à la une, puis les autres (Hugo, 2026-10-22).
     À la une = le plus récent, sauf si un article porte le drapeau
     `alaUne` : l'éditeur peut tenir une actu en tête pendant que d'autres
     sortent. Le drapeau est facultatif, le défaut se déduit.
     État vide prévu : une page blanche se lit comme une panne. */
  function listeArticles(base) {
    var liste = R.articlesFitness();
    if (!liste.length) {
      return '<p class="indispo">Pas encore d\'actualité. Revenez bientôt, ou ' +
        '<a class="lien-texte" href="' + (base || '') + 'clubs/">passez voir votre club</a>.</p>';
    }
    var une = liste.find(function (a) { return a.alaUne; }) || liste[0];
    var autres = liste.filter(function (a) { return a !== une; });
    return carteArticleUne(une, base) +
      (autres.length
        ? '<h2 class="h-bloc">Les autres actualités</h2><div class="grille grille--cartes">' +
          autres.map(function (a) { return carteArticle(a, base); }).join('') + '</div>'
        : '');
  }

  /* En-tête d'article : thème, date, titre, chapeau, photo de couverture.
     Pas de signature (Hugo, 2026-10-22). */
  function enteteArticle(a) {
    return '<div class="article__entete">' + metaArticle(a) +
      '<h1>' + esc(a.titre) + '</h1>' +
      '<p class="article__chapeau">' + esc(a.chapeau) + '</p>' +
      V.blocImage(a.photo, 'large') + '</div>';
  }

  /* Les liens vivent dans le texte, comme un éditeur de CMS les pose
     (Hugo, 2026-10-22) : pas de bloc à part. Notation du lab dans les
     données : [texte](club:id), [texte](cours:id), [texte](page:chemin/),
     [texte](https://…). Un club ou un cours inconnu reste du texte, jamais
     un lien cassé. Le CMS aura son propre sélecteur de lien. */
  function texteAvecLiens(t, base) {
    return esc(t).replace(/\[([^\]]+)\]\(([a-z]+):([^)\s]+)\)/g, function (m, txt, type, cible) {
      var href = null;
      if (type === 'club' && H.club(cible)) href = (base || '') + 'clubs/club/?club=' + cible;
      else if (type === 'cours' && H.cours(cible)) href = H.lienCours(H.cours(cible), base);
      else if (type === 'page') href = (base || '') + cible;
      else if (type === 'https' || type === 'http') href = type + ':' + cible;
      return href ? '<a href="' + href + '">' + txt + '</a>' : txt;
    });
  }

  /* Le corps : des blocs typés, comme un éditeur de CMS les produit.
     Paragraphe (avec ses liens), intertitre, image avec sa légende. */
  function corpsArticle(a, base) {
    return '<div class="article__corps">' + (a.corps || []).map(function (b) {
      if (b.type === 'h2') return '<h2>' + esc(b.texte) + '</h2>';
      if (b.type === 'image') return '<figure>' + V.blocImage(b.legende, 'large') +
        '<figcaption class="mention">' + esc(b.legende) + '</figcaption></figure>';
      return '<p>' + texteAvecLiens(b.texte, base) + '</p>';
    }).join('') + '</div>';
  }

  function autresArticles(id, n, base) {
    var liste = R.autresArticles(id, n);
    if (!liste.length) return '';
    return '<h2>Autres actualités</h2><div class="grille grille--3">' +
      liste.map(function (a) { return carteArticle(a, base); }).join('') + '</div>' +
      '<p style="margin-top:14px"><a class="lien-texte" href="' + (base || '') +
      'actualites/">Toutes les actualités</a></p>';
  }

  /* Annexe A > Bloc actualités (teaser) : les n derniers articles et un lien
     vers la liste. Pour la page d'accueil (B.3), construit avant elle. */
  /* --- Accueil (B.3 > Accueil) ------------------------------------
     Des teasers : chacun lit les données et renvoie vers la page qui fait
     foi. Rien n'est saisi ici qui existe ailleurs. */

  /* « Pourquoi Harmony » : un court manifeste puis trois différenciants
     (Hugo, 2026-10-23, au lieu d'un titre et de quatre arguments). Le
     texte est une proposition, à valider par Harmony (Q62). Un seul bloc
     pour l'accueil et la landing de campagne (Q52). */
  /* opts.visages (accueil) : chaque argument est porté par une personne,
     un visage rond au-dessus de sa phrase, le tout centré sur un aplat
     teinté. La landing garde ses cartes. */
  /* Le manifeste dit une conviction, pas l'offre : la liste salle, eau,
     coachs, wellness est déjà dans le sous-titre du hero et dans les trois
     différenciants juste dessous (Hugo, 2026-10-23). */
  /* Deux lignes, coupées après « Chez Harmony, » (Hugo, 2026-10-23). */
  var MANIFESTE = ['Chez Harmony,', 'chacun s\'entraîne à son rythme.'];
  function pourquoiHarmony(spec, opts) {
    var o = opts || {};
    var visages = ['une membre en conversation avec son coach',
      'une nageuse qui sort la tête de l\'eau, souriante',
      'une membre détendue au sauna, les yeux fermés'];
    var items = [
      { titre: 'Des coachs à vos côtés', texte: 'Pour bien démarrer, garder le cap et viser plus loin.' },
      { titre: 'La salle et l\'eau', texte: 'Plateau, cours collectifs, piscine et cours aquatiques : de quoi varier chaque semaine.' },
      { titre: 'Le temps de récupérer', texte: 'Sauna, hammam, jacuzzi : la séance se termine en douceur.' }
    ];
    /* Pas de surtitre « Pourquoi Harmony » (Hugo, 2026-10-23) : le
       manifeste se suffit. */
    var tete = '<h2 class="manifeste">' + MANIFESTE.map(esc).join('<br>') + '</h2>';
    if (o.visages) {
      return '<section class="section-voix section-voix--centre" data-spec="' + esc(spec || 'B.3 > Accueil > arguments « pourquoi Harmony »') + '">' +
        tete + '<ul class="voix voix--centre">' + items.map(function (d, i) {
          return '<li><span class="visage" title="' + esc('Photo : ' + visages[i]) + '" aria-hidden="true"></span>' +
            '<div><h3>' + esc(d.titre) + '</h3><p>' + esc(d.texte) + '</p></div></li>';
        }).join('') + '</ul></section>';
    }
    return '<section data-spec="' + esc(spec || 'B.3 > Accueil > arguments « pourquoi Harmony »') + '">' + tete +
      '<div class="grille grille--3">' + items.map(function (d) {
        return '<div class="bloc"><h3>' + esc(d.titre) + '</h3><p>' + esc(d.texte) + '</p></div>';
      }).join('') + '</div></section>';
  }

  /* Aperçu des clubs : la liste par canton et la carte, les mêmes règles
     que partout (canton, ordre alphabétique, catégorie à côté du nom). Ce
     n'est pas un choix de club référent : chaque nom et chaque repère est
     un lien vers la page du club. */
  function apercuClubs(etat, base) {
    var b = base || '';
    return '<section id="clubs" data-spec="B.3 > Accueil > aperçu carte clubs">' +
      '<h2>Un club près de chez vous</h2>' +
      '<p class="bloc__intro">' + R.nbClubs() + ' clubs entre Genève et Vaud. Choisissez celui ' +
      'qui vous arrange, près de chez vous ou du travail.</p>' +
      '<div class="apercu-clubs">' +
      '<div class="apercu-clubs__liste">' + R.clubsParCanton().map(function (g) {
        return '<div><h3 class="choix-club__canton">' + esc(H.libelleCanton(g.canton)) + '</h3>' +
          '<ul>' + g.clubs.map(function (c) {
            var cat = H.categorie(c.categorie);
            return '<li><a href="' + b + 'clubs/club/?club=' + c.id + '">' + esc(c.nom) + '</a>' +
              ' ' + V.labelCat(cat) + '</li>';
          }).join('') + '</ul></div>';
      }).join('') +
      '<p><a class="lien-texte" href="' + b + 'clubs/">Tous nos clubs</a></p></div>' +
      '<div class="apercu-clubs__carte">' + V.carte(etat, { lien: b }) + '</div>' +
      '</div>' +
      /* Le module Catégories réduit à une ligne (Hugo, 2026-10-23, Q70) :
         en bloc, il redisait ce que dit le teaser des formules juste
         dessous (« Accès à 7 clubs »). Le détail vit sur le hub. */
      '<p class="apercu-clubs__categories">' +
      D.categories.map(function (cat) {
        return V.labelCat(cat);
      }).join(' ') +
      ' : <a class="lien-texte" href="' + b + 'clubs/#categories">ce qui change d\'une catégorie à l\'autre</a></p>' +
      '</section>';
  }

  /* Offre du moment : une ligne, le compteur et le renvoi vers la landing.
     Même règle que la landing : une seule campagne annoncée. Des offres
     dédiées d'abord ; sinon, la promotion sur des produits existants. Sans
     campagne, le bloc disparaît, comme l'entrée du menu. */
  function teaserOffre(etat, base) {
    var b = base || '';
    if (!R.offreDuMoment(etat)) return '';
    var offres = R.offresVisibles(etat);
    var corps = offres.length
      ? '<p>' + offres.map(function (p) { return '<strong>' + H.nomProduitHtml(p) + '</strong>'; }).join(' · ') +
        '<br><span class="mention">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span></p>'
      : V.annoncePromo(etat, { lienBase: b + 'tarifs/', spec: 'B.3 > Accueil > bloc offre du moment' });
    return '<section data-spec="B.3 > Accueil > bloc offre du moment (compteur)">' +
      '<div class="bloc bloc--offre">' +
      '<div><h2>Offre du moment</h2>' + corps + '</div>' +
      '<div class="bloc--offre__action">' + V.compteur(R.finOffre(etat)) +
      '<a class="btn btn--promo" href="' + b + 'offre-du-moment/">Voir l\'offre</a></div>' +
      '</div></section>';
  }

  /* Teaser tarifs : une ligne par formule, dans l'ordre des formules, avec
     une phrase qui dit ce qu'elle est (champ accroche du produit, Hugo,
     2026-10-23), puis ce qui les sépare le plus vite, le nombre de clubs et
     le prix « dès ».
     Pas de carte produit : sans club référent, rien ne se souscrit ici.
     Chaque ligne mène à la page Tarifs, qui fait foi. */
  function teaserTarifs(etat, base) {
    var b = base || '';
    var formules = D.produits.filter(function (p) { return p.type === 'formule'; })
      .sort(function (x, y) { return x.ordre - y.ordre; });
    return '<section data-spec="B.3 > Accueil > teaser tarifs">' +
      '<h2>Une formule pour chaque envie</h2>' +
      '<p class="bloc__intro">Du plateau seul à l\'accès complet, choisissez ce qui vous ressemble. ' +
      'Sans club choisi, voici les prix de départ.</p>' +
      '<div class="formules">' + formules.map(function (p) {
        var pr = R.prixMini(p, 'adulte', etat);
        /* La ligne n'est plus un lien (Hugo, 2026-10-23) : cliquable sans
           bouton, elle ne se devinait pas. Le bouton dessous mène aux tarifs. */
        return '<div class="formules__ligne">' +
          '<span class="formules__nom">' + H.nomProduitHtml(p) + '</span>' +
          '<span class="formules__accroche">' + (p.accroche ? esc(p.accroche) : '[Phrase de la formule]') + '</span>' +
          '<span class="formules__acces">' + esc(R.ligneAcces(p.categorie)) + '</span>' +
          '<span class="formules__prix">dès ' + prixTexte(pr.valeur) + ' / mois' +
          (pr.promo ? ' <span class="pastille-remise">- ' + pr.promo.remise.valeur +
            (pr.promo.remise.type === 'montant' ? ' CHF' : '%') + '</span>' : '') + '</span>' +
          '</div>';
      }).join('') + '</div>' +
      '<p class="mention">Prix adulte, avec l\'engagement le plus avantageux. ' +
      '</p>' +
      /* Un vrai bouton sous les formules (Hugo, 2026-10-23) : les lignes
         sont cliquables, mais rien ne le disait. C'est le moment de
         conversion de la page. */
      '<p class="bloc__action"><a class="btn" href="' + b + 'tarifs/">Comparer les formules</a></p>' +
      '</section>';
  }

  /* Cours en avant : quatre cartes, la même carte que le catalogue. */
  function coursEnAvant(n, base) {
    var b = base || '';
    var liste = R.coursEnAvant(n || 4);
    if (!liste.length) return '';
    /* Photo en tête de carte et défilement horizontal sur mobile (Hugo,
       2026-10-23) : quatre cartes d'étiquettes se lisaient comme un
       tableau, et prenaient un écran et demi empilées. Le catalogue complet
       vit sur le hub, la règle « pas de slider sur une liste indexable »
       ne s'applique pas à ce teaser. */
    return '<section data-spec="B.3 > Accueil > cours en avant">' +
      '<h2>Des cours à votre rythme</h2>' +
      '<div class="grille grille--cartes defile-mobile">' + liste.map(function (co) {
        return V.carteCours(co, b, { photo: true });
      }).join('') + '</div>' +
      '<p style="margin-top:14px"><a class="lien-texte" href="' + b +
      'sport/cours-collectifs/">Tous les cours</a></p></section>';
  }

  /* Les cours collectifs sur l'accueil : une entrée par objectif, pas une
     sélection de cours (Hugo, 2026-10-23). On arrive avec un but (se
     dépenser, se détendre…), pas avec un nom de cours en tête. Chaque
     carte mène à la section de l'objectif dans le catalogue du hub, compte
     ses cours et en cite trois. Même rangement que le catalogue
     (catalogueParObjectif) : les nombres sont les mêmes des deux côtés. */
  function objectifsCours(base) {
    var b = base || '';
    /* Les Extras ne sont pas comptés : la somme des six cartes retombe sur
       la preuve du hero (« 46 cours collectifs différents »), qui ne compte
       que ce qui est inclus. Le catalogue, lui, les montre marqués Extra. */
    var groupes = R.catalogueParObjectif({}).filter(function (g) { return g.objectif.id; })
      .map(function (g) {
        return { objectif: g.objectif, cours: g.cours.filter(function (c) { return !c.estExtra; }) };
      }).filter(function (g) { return g.cours.length; });
    if (!groupes.length) return '';
    return '<section data-spec="B.3 > Accueil > cours en avant (par objectif)">' +
      '<h2>En groupe, choisissez votre objectif</h2>' +
      '<p class="bloc__intro">Se renforcer, se dépenser, se détendre : chaque cours a son but. ' +
      'Partez de ce que vous cherchez.</p>' +
      '<div class="grille grille--3 defile-mobile">' + groupes.map(function (g) {
        var noms = g.cours.slice(0, 3).map(function (c) { return c.nom; });
        return '<div class="produit produit--lien">' +
          '<div class="produit__photo">' + V.blocImage('Photo : ' + g.objectif.nom.toLowerCase(), 'large') + '</div>' +
          '<h3 class="titre-carte"><a href="' + b + 'sport/cours-collectifs/#objectif-' + g.objectif.id + '">' +
          esc(g.objectif.nom) + '</a></h3>' +
          '<p class="mention"><strong>' + g.cours.length + ' cours</strong> · ' + esc(noms.join(', ')) +
          (g.cours.length > 3 ? '…' : '') + '</p>' + V.actionCarte('Voir les cours') + '</div>';
      }).join('') + '</div>' +
      '<p class="bloc__action"><a class="lien-texte" href="' + b +
      'sport/cours-collectifs/">Voir tous les cours et le planning</a></p></section>';
  }

  /* Les quatre piliers du sport, une seule source pour le hub Sport et
     l'accueil. base mène au dossier sport/ depuis la page qui appelle. */
  function piliersSport(base) {
    var b = base || '';
    return [
      { titre: 'Plateau fitness', href: b + 'plateau-fitness/', lien: 'Voir le plateau fitness',
        photo: 'Photo plateau musculation', inclus: V.ligneInclusion('plateau'),
        texte: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore.' },
      { titre: 'Cours collectifs', href: b + 'cours-collectifs/', lien: 'Voir les cours collectifs',
        photo: 'Photo cours collectif en salle', inclus: V.ligneInclusion('cours'),
        texte: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.' },
      { titre: 'Small Group Training', href: b + 'small-group-training/', lien: 'Voir le Small Group Training',
        photo: 'Photo entraînement en petit groupe', inclus: V.ligneExtra(),
        texte: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.' },
      { titre: 'Coaching personnel', href: b + 'coaching-personnel/', lien: 'Voir le coaching personnel',
        photo: 'Photo séance de coaching', inclus: V.ligneInclusion('coaching', { prefixe: 'Des séances incluses' }),
        texte: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.' }
    ];
  }

  /* Comment s'entraîner, sur l'accueil (Hugo, 2026-10-23) : trois façons
     plutôt que quatre produits. Seul, le plateau ; accompagné, le
     coaching ; en groupe, les cours collectifs et le Small Group Training.
     C'est la question que se pose le visiteur, pas notre catalogue, et
     « En groupe » ouvre le bloc suivant, les cours par objectif. Lignes
     d'inclusion déduites des formules, données de piliersSport. */
  function sportEnAvant(base) {
    var b = base || '';
    var p = {};
    piliersSport(b + 'sport/').forEach(function (x) { p[x.titre] = x; });
    var plateau = p['Plateau fitness'], coaching = p['Coaching personnel'],
        cours = p['Cours collectifs'], sgt = p['Small Group Training'];
    var carte = function (photo, mode, lien, corps, action) {
      return '<div class="produit produit--lien">' +
        '<div class="produit__photo">' + V.blocImage(photo, 'large') + '</div>' +
        '<h3 class="titre-carte"><a href="' + lien.href + '">' + esc(mode) + '</a></h3>' + corps +
        V.actionCarte(action) + '</div>';
    };
    return '<section data-spec="B.3 > Accueil > le sport (seul, accompagné, en groupe)">' +
      '<h2>Comment voulez-vous vous entraîner ?</h2>' +
      '<p class="bloc__intro">En autonomie, avec un coach ou en groupe : chez Harmony, vous pouvez ' +
      'passer de l\'un à l\'autre selon vos envies.</p>' +
      '<div class="grille grille--3 defile-mobile modes">' +
      carte('Photo : une membre en autonomie sur le plateau, à son rythme', 'En autonomie', plateau,
        '<p><strong>Plateau fitness</strong></p><p>Vos machines, vos charges, votre rythme.</p><p class="mention">' + plateau.inclus + '</p>', 'Découvrir le plateau') +
      carte('Photo : un coach et un membre pendant une séance', 'Accompagné', coaching,
        '<p><strong>Coaching personnel</strong></p><p>Un programme construit avec vous, et quelqu\'un pour le suivre.</p><p class="mention">' + coaching.inclus + '</p>', 'Découvrir le coaching') +
      /* En groupe : deux produits, un inclus et un payant. La carte mène
         aux cours collectifs ; le Small Group Training a son propre lien,
         avec sa ligne Extra, pour ne pas le faire passer pour inclus. */
      carte('Photo : un cours collectif en salle, énergie du groupe', 'En groupe', cours,
        '<p><strong>Cours collectifs</strong></p><p>L\'énergie du groupe pour aller plus loin.</p><p class="mention">' + cours.inclus + '</p>' +
        '<p style="margin-top:8px"><a class="lien-texte" href="' + sgt.href + '">Small Group Training</a></p>' +
        '<p class="mention">' + sgt.inclus + '</p>',
        'Découvrir les cours') +
      '</div></section>';
  }

  /* Bien-être : les espaces en tags et le nombre de clubs qui en ont,
     déduits des équipements, et le renvoi vers le hub. */
  function teaserBienEtre(base) {
    var b = base || '';
    var espaces = R.espacesBienEtre(), clubs = R.clubsBienEtre();
    return '<section data-spec="B.3 > Accueil > bloc bien-être">' +
      '<div class="bloc bloc--couche bloc--clair">' +
      V.blocImage('Photo : deux membres au hammam après la séance, détendues, lumière douce', 'carre') +
      '<div class="bloc--couche__texte"><h2 class="titre-section">Du temps pour vous</h2>' +
      '<p>Récupérer compte autant que s\'entraîner. Après l\'effort, offrez-vous ' +
      'une pause au sauna, au hammam ou quelques longueurs dans la piscine.</p>' +
      V.tagsListe(espaces.map(function (e) { return e.nom; }), espaces.length) +
      '<p class="mention">Dans ' + clubs.length + ' de nos ' + R.nbClubs() + ' clubs</p>' +
      '<p class="bloc__action"><a class="btn btn--secondaire" href="' + b +
      'bien-etre/">Découvrir nos espaces bien-être</a></p>' +
      '</div></div></section>';
  }

  function teaserActualites(n, base) {
    var liste = R.articlesFitness().slice(0, n || 3);
    if (!liste.length) return '';
    return '<section data-spec="B.3 > Accueil > teaser actualités">' +
      '<h2>La vie de nos clubs</h2><div class="grille grille--3">' +
      liste.map(function (a) { return carteArticle(a, base); }).join('') + '</div>' +
      '<p style="margin-top:14px"><a class="lien-texte" href="' + (base || '') +
      'actualites/">Toutes les actualités</a></p></section>';
  }

  function ctaEssai(base, spec) {
    return '<section class="cta-essai" data-spec="' +
      esc(spec || 'B.3 > Page Tarifs > Trame > 6') + '">' +
      '<h2>Envie d\'essayer avant de vous décider ?</h2>' +
      '<p>Laissez-nous vos coordonnées, le club vous rappelle pour fixer votre séance d\'essai.</p>' +
      '<a class="btn" href="' + (base || '') + 'seance-essai/">Demander une séance d\'essai</a></section>';
  }

  /* Compteur lié à la date de fin de l'offre (Annexe A > A.2). */
  function compteur(fin) {
    if (!fin) return '';
    var reste = Math.max(0, Math.ceil((new Date(fin) - new Date()) / 86400000));
    return '<div class="compteur" data-spec="Annexe A > A.2 > Compteur d\'offre">' +
      '<span>' + reste + '</span> jours restants</div>';
  }

  return {
    lignesInclusion: lignesInclusion, carteProduit: carteProduit, carteExtra: carteExtra,
    tagsListe: tagsListe,
    carteArticle: carteArticle, listeArticles: listeArticles, enteteArticle: enteteArticle,
    corpsArticle: corpsArticle, autresArticles: autresArticles,
    teaserActualites: teaserActualites,
    pourquoiHarmony: pourquoiHarmony, apercuClubs: apercuClubs, teaserOffre: teaserOffre,
    teaserTarifs: teaserTarifs, coursEnAvant: coursEnAvant, teaserBienEtre: teaserBienEtre,
    piliersSport: piliersSport, sportEnAvant: sportEnAvant, objectifsCours: objectifsCours,
    blocPrix: blocPrix, ligneRemise: ligneRemise, annoncePromo: annoncePromo,
    infoClubs: infoClubs,
    ligneRemiseAilleurs: ligneRemiseAilleurs,
    ligneIndisponible: ligneIndisponible, ligneSansClub: ligneSansClub,
    barreCollante: barreCollante, barreRecap: barreRecap, carteClub: carteClub,
    planning: planning, grilleCoachs: grilleCoachs, panneauCoach: panneauCoach,
    faq: faq, temoignages: temoignages, noteAvis: noteAvis, noteValeur: noteValeur, noteSource: noteSource,
    destinataireEssai: destinataireEssai,
    ctaEssai: ctaEssai, compteur: compteur,
    ligneConseil: ligneConseil, destinataireLigne: destinataireLigne,
    desParMoisTexte: desParMoisTexte
  };
})());

/* ------------------------------------------------------------------ */
/* État du wireframe et pilotage                                        */
/* ------------------------------------------------------------------ */
Object.assign(window.HF, (function () {
  'use strict';
  var H = window.HF, D = H.data;

  function etatInitial() {
    var params = new URLSearchParams(window.location.search);
    var club = params.get('club');
    var tarif = params.get('tarif');
    /* Offre et promo simulées. En production ce sont les dates de validité
       qui décident, ici c'est le sélecteur d'état, pour montrer les deux cas.
       Par défaut, aucune campagne ne tourne (Hugo, 2026-10-22) : la page se
       lit d'abord telle qu'elle est la plupart du temps. ?offre=1 active
       l'offre du moment, ?promo=[id] lance une promotion. */
    var offre = params.get('offre');
    var promo = params.get('promo');
    /* Le motif arrive dans l'URL quand on vient d'une autre page (la ligne
       de conseil de /tarifs, par exemple). */
    var motif = params.get('motif');
    return {
      club: (club && H.club(club)) ? club : null,
      tarif: (tarif && H.tarif(tarif)) ? tarif : 'adulte',
      engagement: H.engagementDefaut(),
      offreActive: offre === '1',
      promo: (promo && H.promotion(promo)) ? promo : null,
      contactMotif: (motif && D.contact.motifs.some(function (m) { return m.id === motif; }))
        ? motif : '',
      /* Demande d'essai : la date indicative et ce que la personne vient
         chercher. L'objectif reprend le référentiel des cours, il n'y a pas
         de liste à part (Q53). */
      essaiDate: '',
      essaiObjectif: '',
      produitChoisi: null,
      extrasChoisis: [],
      carteOuverte: false,
      apercuClub: null,
      survol: null,
      catOuverte: null,
      coachOuvert: null,
      faqOuverte: null,
      semaine: 0,
      jourPlanning: null,
      message: null,
      filtres: { club: '', categorie: '', jour: '', objectif: '', intensite: '',
                 format: '', recherche: '' },
      source: params.get('source') || null
    };
  }

  /* CLAUDE.md > Technique : tarifs/?club=meyrin représente /tarifs/meyrin.
     L'URL suit le choix du club, sans rechargement. */
  function majUrl(etat) {
    if (!window.history || !window.history.replaceState) return;
    var p = new URLSearchParams(window.location.search);
    if (etat.club) p.set('club', etat.club); else p.delete('club');
    if (etat.tarif && etat.tarif !== 'adulte') p.set('tarif', etat.tarif); else p.delete('tarif');
    if (etat.offreActive) p.set('offre', '1'); else p.delete('offre');
    if (etat.promo) p.set('promo', etat.promo); else p.delete('promo');
    var q = p.toString();
    window.history.replaceState(null, '', window.location.pathname + (q ? '?' + q : ''));
  }

  /* L'URL telle qu'elle se lira sur le futur site, affichée par le
     sélecteur d'état pour que la correspondance reste visible. */
  function urlSimulee(etat, gabarit) {
    if (gabarit === 'tarifs') return etat.club ? '/tarifs/' + etat.club : '/tarifs';
    if (gabarit === 'club') return etat.club ? '/clubs/' + etat.club : '/clubs';
    return null;
  }

  /* Un extra qui n'est plus proposé après un changement de club est retiré,
     avec un message (B.3 > Page Tarifs > Règles > Barre récap). */
  function nettoyerExtras(etat) {
    var avant = etat.extrasChoisis.slice();
    etat.extrasChoisis = avant.filter(function (id) {
      var e = H.extra(id);
      return e && H.regles.extraDisponible(e, etat.club);
    });
    var retires = avant.filter(function (id) { return etat.extrasChoisis.indexOf(id) === -1; });
    etat.message = retires.length
      ? 'Retiré, pas proposé depuis ce club : ' +
        retires.map(function (id) { return H.extra(id).nom; }).join(', ')
      : null;
  }

  function nettoyerProduit(etat) {
    if (!etat.produitChoisi) return;
    var p = H.produit(etat.produitChoisi);
    if (p && !H.regles.produitDisponible(p, etat.club)) etat.produitChoisi = null;
  }

  /* Navigation ancrée. Le décalage tient compte de la barre collante du
     haut, sinon le titre visé passe dessous. Respecte le réglage système
     "réduire les animations". */
  function allerA(id) {
    var cible = document.getElementById(id);
    if (!cible) return;
    var barre = document.querySelector('.barre-collante');
    var decalage = (barre ? barre.getBoundingClientRect().height : 0) + 12;
    var doux = !window.matchMedia ||
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: cible.getBoundingClientRect().top + window.scrollY - decalage,
      behavior: doux ? 'smooth' : 'auto'
    });
  }

  var actions = {
    'choisir-club': function (etat, id) {
      etat.club = id; etat.carteOuverte = false; etat.apercuClub = null;
      nettoyerProduit(etat); nettoyerExtras(etat); majUrl(etat);
    },
    'modifier-club': function (etat) { etat.club = null; nettoyerProduit(etat); nettoyerExtras(etat); majUrl(etat); },
    /* Ramène au choix du club visible : la liste et la carte sur
       ordinateur, les pastilles sur mobile. */
    'aller-choix-club': function () {
      var ordi = document.getElementById('choix-club');
      allerA(ordi && ordi.offsetParent ? 'choix-club' : 'choix-club-mobile');
    },
    'ouvrir-carte': function (etat) { etat.carteOuverte = true; },
    'fermer-carte': function (etat) { etat.carteOuverte = false; etat.apercuClub = null; },
    'apercu-club': function (etat, id) { etat.apercuClub = id; },
    'tarif': function (etat, id) { etat.tarif = id; majUrl(etat); },
    'engagement': function (etat, id) { etat.engagement = id; },
    /* Choisir un abonnement emmène à l'étape suivante, les Extras : c'est
       la question qu'on se pose juste après avoir choisi sa formule. Un
       carnet ou une offre n'ont pas d'Extras, on ne déplace donc personne.
       Se désélectionner ne fait jamais bouger la page. */
    'choisir-produit': function (etat, id) {
      var deja = etat.produitChoisi === id;
      etat.produitChoisi = deja ? null : id;
      if (deja) return;
      var p = H.produit(id);
      /* Une formule qui inclut les Extras rend caduc ce qu'on avait ajouté :
         on ne facture pas deux fois. On le dit plutôt que de vider en
         silence. */
      if (p && p.inclutExtras && (etat.extrasChoisis || []).length) {
        etat.extrasChoisis = [];
        etat.message = 'Les Extras que vous aviez ajoutés sont compris dans la formule ' + p.nom + '.';
      }
      if (p && p.type === 'formule') allerA('extras');
    },
    'ajouter-extra': function (etat, id) {
      if (etat.extrasChoisis.indexOf(id) === -1) etat.extrasChoisis.push(id);
    },
    'retirer-extra': function (etat, id) {
      etat.extrasChoisis = etat.extrasChoisis.filter(function (x) { return x !== id; });
    },
    'panneau-cat': function (etat, id) { etat.catOuverte = (etat.catOuverte === id) ? null : id; },
    /* Planning : semaine affichée, 0 = la semaine en cours. */
    'semaine': function (etat, id) {
      etat.semaine = id === 'courante' ? 0 : Math.max(0, Math.min(3, (etat.semaine || 0) + (id === 'suiv' ? 1 : -1)));
      if (id === 'courante') etat.jourPlanning = null;
    },
    'jour-planning': function (etat, id) { etat.jourPlanning = Number(id); },
    'panneau-coach': function (etat, id) { etat.coachOuvert = (etat.coachOuvert === id) ? null : id; },
    'faq': function (etat, id) { var n = Number(id); etat.faqOuverte = (etat.faqOuverte === n) ? null : n; },
    'finaliser': function (etat) { etat.message = 'Redirection vers le tunnel de souscription.'; },
    /* Landing de campagne : pas de barre récap, le bouton part droit au
       tunnel. Le lien est paramétré par l'offre et le club référent, sans
       quoi le visiteur devrait rechoisir ce qu'il vient de choisir. */
    'profiter': function (etat, id) {
      var p = H.produit(id), c = etat.club ? H.club(etat.club) : null;
      etat.produitChoisi = id;
      etat.message = 'Redirection vers le tunnel de souscription, avec ' +
        (p ? '« ' + p.nom + ' »' : 'l\'offre') +
        (c ? ' et ' + c.nom : '') + ' en paramètre.';
    },
    /* Simulation : le wireframe ne poste rien. On montre où part la demande,
       c'est ce qui compte pour valider le dispatch. */
    /* Simulation, comme le formulaire de contact : le wireframe ne poste
       rien. Ce qu'on veut valider ici, c'est que la demande part au club, que
       la date est dans la fenêtre annoncée, et que l'origine du clic est
       transmise : sans elle, impossible de savoir quelle page génère les
       essais. */
    'envoyer-essai': function (etat) {
      if (!etat.club) { etat.message = 'Choisissez d\'abord votre club.'; return; }
      if (!etat.essaiDate) { etat.message = 'Choisissez une date indicative.'; return; }
      var c = H.club(etat.club);
      var obj = D.referentiels.objectifs.find(function (o) { return o.id === etat.essaiObjectif; });
      etat.message = 'Simulation : la demande de rappel partirait à Harmony ' + c.nom +
        ', pour le ' + etat.essaiDate +
        (obj ? ', objectif « ' + obj.nom + ' »' : '') +
        (etat.source ? ', origine « ' + etat.source + ' »' : '') + '.';
    },
    'envoyer-contact': function (etat) {
      var d = H.regles.destinataireContact(etat.contactMotif, etat.club);
      if (!d.motif) { etat.message = 'Choisissez d\'abord un sujet.'; return; }
      if (d.clubRequis && !etat.club) { etat.message = 'Choisissez votre club.'; return; }
      etat.message = 'Simulation : la demande partirait à ' + d.nom +
        ', avec le sujet « ' + d.motif.libelle + ' ».';
    }
  };

  /* Délégation : un seul écouteur par page, les composants restent de
     simples chaînes de caractères. */
  function brancher(racine, etat) {
    racine.addEventListener('click', function (ev) {
      var el = ev.target.closest('[data-act]');
      if (!el || !racine.contains(el)) return;
      var act = el.getAttribute('data-act');
      if (act === 'filtre') return;
      if (!actions[act]) return;
      ev.preventDefault();
      actions[act](etat, el.getAttribute('data-id'));
    });
    racine.addEventListener('change', function (ev) {
      var el = ev.target.closest('[data-act="filtre"]');
      if (!el) return;
      var cle = el.getAttribute('data-cle');
      etat.filtres[cle] = el.value;
      /* Catégorie et club se contredisent vite : Meyrin est Essential, on ne
         peut pas lui demander en même temps d'être Premium. La catégorie
         commande, le club incompatible est relâché. */
      if (cle === 'categorie' && etat.filtres.club) {
        var c = H.club(etat.filtres.club);
        if (el.value && (!c || c.categorie !== el.value)) etat.filtres.club = '';
      }
    });
    racine.addEventListener('mouseover', function (ev) {
      var el = ev.target.closest('[data-survol]');
      etat.survol = el ? el.getAttribute('data-survol') : null;
    });
  }

  /* Sélecteur d'état, réservé au wireframe. Visible en haut de chaque page. */
  function selecteurEtat(etat, opts) {
    var o = opts || {};
    var esc = H.esc;
    function select(cle, vide, liste, courant) {
      return '<option value="">' + vide + '</option>' + liste.map(function (x) {
        return '<option value="' + x.id + '"' + (courant === x.id ? ' selected' : '') + '>' +
          esc(x.nom) + '</option>';
      }).join('');
    }
    var url = urlSimulee(etat, o.gabarit);
    return '<div class="wf-barre' + (o.collante ? ' wf-barre--collante' : '') +
      '"><div class="wf-barre__inner">' +
      '<span class="wf-barre__titre">Wireframe</span>' +
      '<span class="wf-champ"><label>Club</label><select data-etat="club">' +
      select('club', 'Sans club', D.clubs.map(function (c) {
        return { id: c.id, nom: c.nom + ' · ' + H.categorie(c.categorie).nom };
      }), etat.club) + '</select></span>' +
      '<span class="wf-champ"><label>Tarif</label><select data-etat="tarif">' +
      D.referentiels.tarifs.map(function (t) {
        return '<option value="' + t.id + '"' + (etat.tarif === t.id ? ' selected' : '') + '>' +
          esc(t.nom) + '</option>';
      }).join('') + '</select></span>' +
      '<span class="wf-champ"><label>Engagement</label><select data-etat="engagement">' +
      D.referentiels.engagements.map(function (e) {
        return '<option value="' + e.id + '"' + (etat.engagement === e.id ? ' selected' : '') + '>' +
          esc(e.nom) + '</option>';
      }).join('') + '</select></span>' +
      '<span class="wf-champ"><label><input type="checkbox" data-etat="offreActive"' +
      (etat.offreActive ? ' checked' : '') + '> Offre active</label></span>' +
      '<span class="wf-champ"><label>Promo</label><select data-etat="promo">' +
      select('promo', 'Aucune', D.promotions || [], etat.promo) + '</select></span>' +
      (url ? '<span class="wf-champ"><label>URL</label><code>' + esc(url) + '</code></span>' : '') +
      '<span class="wf-champ" style="margin-left:auto"><a href="' + (o.base || '') + 'sommaire/">Sommaire du lab</a></span>' +
      '</div></div>';
  }

  function brancherSelecteur(racine, etat) {
    racine.addEventListener('change', function (ev) {
      var el = ev.target.closest('[data-etat]');
      if (!el) return;
      var cle = el.getAttribute('data-etat');
      if (el.type === 'checkbox') { etat[cle] = el.checked; majUrl(etat); return; }
      etat[cle] = el.value || null;
      if (cle === 'club') { nettoyerProduit(etat); nettoyerExtras(etat); }
      majUrl(etat);
    });
  }

  return {
    etatInitial: etatInitial, majUrl: majUrl, urlSimulee: urlSimulee,
    actions: actions, brancher: brancher, allerA: allerA,
    selecteurEtat: selecteurEtat, brancherSelecteur: brancherSelecteur
  };
})());

/* ------------------------------------------------------------------ */
/* Règles et composants de la branche Clubs                             */
/* ------------------------------------------------------------------ */
Object.assign(window.HF.regles, (function () {
  'use strict';
  var H = window.HF, D = H.data, R = H.regles;

  /* B.3 > Trame de la page club > 8 : "socle de la catégorie + En plus à
     [club]". Le socle n'est pas saisi : c'est ce que tous les clubs de la
     catégorie ont en commun. Une saisie de moins, une divergence de moins. */
  function equipementsSocle(idCat) {
    var clubs = D.clubs.filter(function (c) { return c.categorie === idCat; });
    if (!clubs.length) return [];
    return clubs[0].equipements.filter(function (e) {
      return clubs.every(function (c) { return c.equipements.indexOf(e) !== -1; });
    });
  }

  function equipementsEnPlus(idClub) {
    var c = H.club(idClub); if (!c) return [];
    var socle = equipementsSocle(c.categorie);
    return c.equipements.filter(function (e) { return socle.indexOf(e) === -1; });
  }

  function equipement(id) {
    return D.referentiels.equipements.find(function (e) { return e.id === id; }) || null;
  }

  /* Espaces bien-être du club, déduits de ses équipements. */
  function bienEtreDuClub(idClub) {
    var c = H.club(idClub); if (!c) return [];
    return c.equipements.map(equipement).filter(function (e) { return e && e.bienEtre; });
  }

  /* B.3 > Trame de la page club > 5 : liste compacte rangée par les 6
     objectifs. Les Small Group Training ne sont pas des cours inclus. */
  /* B.3 > Trame de la page club > 5 : chaque cours apparaît une seule
     fois, sous son objectif principal. L'objectif secondaire ne range
     jamais, il informe. Les Small Group Training ne sont pas des cours
     inclus : ils vivent dans le bloc Extras. */
  function coursParObjectif(idClub) {
    var liste = R.coursDuClub(idClub).filter(function (co) { return !co.estExtra; });
    var groupes = D.referentiels.objectifs.map(function (o) {
      return { objectif: o, cours: liste.filter(function (co) { return co.objectifPrincipal === o.id; }) };
    }).filter(function (g) { return g.cours.length; });
    var sansObjectif = liste.filter(function (co) { return !co.objectifPrincipal; });
    if (sansObjectif.length) {
      groupes.push({ objectif: { id: null, nom: '[Objectif à définir]' }, cours: sansObjectif, aValider: true });
    }
    return groupes;
  }

  /* Formules qui donnent accès au club, dans l'ordre de B.3. */
  function formulesDuClub(idClub) {
    return R.produitsVisibles('formule', idClub);
  }

  /* Filtres du hub /clubs : Ma formule, Équipements, Un cours précis. */
  function filtrerClubs(f) {
    return D.clubs.filter(function (c) {
      if (f.formule) {
        var p = H.produit(f.formule);
        if (!p || !R.produitDisponible(p, c.id)) return false;
      }
      if (f.equipement && c.equipements.indexOf(f.equipement) === -1) return false;
      if (f.cours && !R.seancesDuClub(c.id).some(function (s) { return s.cours === f.cours; })) return false;
      return true;
    });
  }

  function parCanton(liste) {
    var cantons = [];
    liste.forEach(function (c) { if (cantons.indexOf(c.canton) === -1) cantons.push(c.canton); });
    return cantons.map(function (canton) {
      return {
        canton: canton,
        /* Même formule pour les deux cantons : « Nos clubs à Genève » laissait
           croire à la ville, alors que Meyrin, Versoix ou Blandonnet n'y sont
           pas. */
        titre: 'Nos clubs dans le canton de ' + canton,
        clubs: liste.filter(function (c) { return c.canton === canton; })
          .sort(function (a, b) { return a.nom.localeCompare(b.nom, 'fr'); })
      };
    });
  }

  return {
    equipementsSocle: equipementsSocle, equipementsEnPlus: equipementsEnPlus,
    equipement: equipement, bienEtreDuClub: bienEtreDuClub,
    coursParObjectif: coursParObjectif, formulesDuClub: formulesDuClub,
    filtrerClubs: filtrerClubs, parCanton: parCanton
  };
})());

Object.assign(window.HF.vues, (function () {
  'use strict';
  var H = window.HF, D = H.data, R = H.regles, V = H.vues;
  var esc = H.esc, prixTexte = H.prixTexte, texte = H.texte, aValider = H.aValider;

  /* B.3 > Trame de la page club > 3. Identiques à la fiche Google.
     Plus de barre rapide (Hugo, 2026-10-23) : elle redisait ces infos juste
     au-dessus. Ce qu'elle avait en propre vit ici : « Ouvert aujourd'hui »
     sous les horaires, l'itinéraire sous l'adresse. Pas de téléphone : on
     n'appelle pas le club, on lui écrit. */
  function infosPratiques(c) {
    var itineraire = 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent('Harmony Fitness ' + c.nom);
    var lignes = [
      ['Adresse', esc(texte(c.adresse, '[adresse]')) +
        '<br><a class="lien-texte" href="' + esc(itineraire) + '" target="_blank" rel="noopener">Itinéraire</a>'],
      ['Horaires', esc(texte(c.horaires, '[horaires, jours fériés compris]')) +
        '<br><span class="mention">Ouvert aujourd\'hui jusqu\'à [heure]</span>'],
      ['Transports', '[transports]'],
      ['Parking', c.equipements.indexOf('parking') !== -1 ? '[détail parking]' : 'Pas de parking']
    ];
    /* Plus d'adresse e-mail affichée : elle ne se compte pas, ne se dispatche
       pas et laisse le manager surveiller deux boîtes. On envoie au
       formulaire, club présélectionné (Q37). */
    /* Six lignes en tableau faisaient un écran à elles seules. Une grille de
       définitions, trois par ligne sur ordinateur, dit la même chose en
       deux lignes : ce sont des couples libellé-valeur, pas un tableau. */
    return '<section id="infos" data-spec="B.3 > Trame de la page club > 3">' +
      '<h2>Infos pratiques</h2>' +
      '<dl class="infos">' + lignes.map(function (l) {
        return '<div class="infos__item"><dt>' + esc(l[0]) + '</dt><dd>' + l[1] + '</dd></div>';
      }).join('') +
      '<div class="infos__item"><dt>Écrire au club</dt><dd><a class="lien-texte" href="../../nous-contacter/?motif=club&amp;club=' +
      c.id + '&amp;source=page-club">Nous contacter</a></dd></div>' +
      '</dl>' +
      '<p class="mention">Coordonnées strictement identiques à la fiche Google Business du club.</p>' +
      '</section>';
  }

  /* B.3 > Trame de la page club > 5. Texte stable et indexable : c'est lui
     qui capte "[cours] [commune]". */
  function coursDuClub(c) {
    var groupes = R.coursParObjectif(c.id);
    if (!groupes.length) return '';
    return '<section data-spec="B.3 > Trame de la page club > 5">' +
      '<h2>Les cours de ' + esc(c.nom) + '</h2>' +
      '<div class="grille grille--3">' + groupes.map(function (g) {
        return '<div><h3>' + esc(g.objectif.nom) + H.aValider(g.aValider) + '</h3><ul>' +
          g.cours.map(function (co) {
            return '<li><a href="' + H.lienCours(co, '../../') + '">' + esc(co.nom) + '</a>' +
              (co.traitement === null ? '' : '') +
              '</li>';
          }).join('') + '</ul></div>';
      }).join('') + '</div></section>';
  }

  /* B.3 > Trame de la page club > 6. Partie extras masquée si le club n'en a pas. */
  function formulesEtExtras(c, etat) {
    var formules = R.formulesDuClub(c.id);
    var extras = R.extrasDuClub(c.id);
    var estGym = c.categorie === 'gym';
    return '<section data-spec="B.3 > Trame de la page club > ' + (estGym ? '5 (variante Gym)' : '6') + '">' +
      '<h2>Formules et Extras</h2>' +
      '<div class="grille grille--cartes">' + formules.map(function (p) {
        /* Même prix que sur /tarifs : le teaser suit la promo en cours,
           sinon le club annoncerait un prix que la page Tarifs dément. */
        var pr = R.prixMini(p, 'adulte', etat);
        return '<div class="produit"><h3>' + H.nomProduitHtml(p) + '</h3>' +
          '<p class="produit__acces">' + esc(R.ligneAcces(p.categorie)) +
        V.infoClubs(p.categorie) + '</p>' +
          '<p class="mention">Tarif adulte dès ' + prixTexte(pr.valeur) + ' / mois' +
          (pr.promo ? ' <span class="pastille-remise">- ' + pr.promo.remise.valeur +
            (pr.promo.remise.type === 'montant' ? ' CHF' : '%') + '</span>' : '') +
          '</p></div>';
      }).join('') + '</div>' +
      (extras.length
        ? '<h3 style="margin-top:24px">Les Extras de ' + esc(c.nom) + '</h3>' +
          extras.map(function (e) {
            return V.carteExtra(e, { club: c.id, extrasChoisis: [] }, { portee: 'club' });
          }).join('')
        : '') +
      '<p style="margin-top:14px"><a class="btn" href="../../tarifs/?club=' + c.id +
      '&amp;source=page-club">Voir les tarifs</a></p></section>';
  }

  /* B.3 > Trame de la page club > 8 */
  function equipementsBloc(c) {
    var cat = H.categorie(c.categorie);
    var socle = R.equipementsSocle(c.categorie).map(R.equipement).filter(Boolean);
    var enPlus = R.equipementsEnPlus(c.id).map(R.equipement).filter(Boolean);
    function liste(items) {
      return '<ul>' + items.map(function (e) {
        return '<li>' + esc(e.nom) + aValider(e.aValider) + '</li>';
      }).join('') + '</ul>';
    }
    return '<section data-spec="B.3 > Trame de la page club > 8">' +
      '<h2>Équipements</h2>' +
      '<div class="grille grille--2">' +
      '<div><h3>Le socle des clubs ' + esc(cat.nom) + '</h3>' + liste(socle) + '</div>' +
      (enPlus.length ? '<div><h3>En plus à ' + esc(c.nom) + '</h3>' + liste(enPlus) + '</div>' : '') +
      '</div></section>';
  }

  /* B.3 > Trame de la page club > 9 */
  function bienEtreBloc(c, base) {
    var espaces = R.bienEtreDuClub(c.id);
    if (!espaces.length) return '';
    /* Les espaces en tags, la même grammaire que la ligne « Espaces
       wellness » des cartes formule : une liste à puces de cinq mots
       prenait cinq lignes pour dire ce qu'une ligne dit. */
    return '<section data-spec="B.3 > Trame de la page club > 9">' +
      '<h2>Bien-être</h2>' +
      V.tagsListe(espaces.map(function (e) { return e.nom; }), espaces.length) +
      '<p><a class="lien-texte" href="' + (base || '') +
      'bien-etre/espaces/">Voir nos espaces bien-être</a></p></section>';
  }

  /* B.3 > Trame de la page club > 10 : une carte, un lien vers le site de
     l'école de natation, aucun contenu natation sur la page fitness. */
  function passerelleNatation(c) {
    if (!c.bassin) return '';
    return '<section data-spec="B.3 > Trame de la page club > 10">' +
      '<div class="produit"><h2>École de natation</h2>' +
      '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.</p>' +
      '<p><a class="btn btn--secondaire" href="#">Voir ' + esc(c.nom) +
      ' sur le site de l\'école de natation</a></p>' +
      '<p class="mention">Aquagym et aquabike restent au planning fitness.</p>' +
      '</div></section>';
  }

  /* Variante Gym : passerelle secondaire vers les cours collectifs. */
  function passerelleCoursCollectifs(c) {
    if (c.categorie !== 'gym') return '';
    return '<section data-spec="B.3 > Variante Gym">' +
      '<div class="produit"><h2>Envie de cours collectifs ?</h2>' +
      '<p>Ils sont inclus dès la formule Essential.</p>' +
      '<p><a class="btn btn--secondaire" href="../../tarifs/?club=' + c.id +
      '">Voir les formules</a></p></div></section>';
  }

  /* B.3 > Trame de la page club > 14 : 2 ou 3 clubs avec leur catégorie. */
  function clubsProximite(c, etat) {
    var liste = c.proximite.map(H.club).filter(Boolean);
    if (!liste.length) return '';
    return '<section data-spec="B.3 > Trame de la page club > 14">' +
      '<h2>Clubs à proximité</h2>' +
      '<div class="grille grille--3">' + liste.map(function (v) {
        return V.carteClub(v, etat, { base: '../../', source: 'page-club' });
      }).join('') + '</div></section>';
  }

  /* B.3 > Trame de la page club > 12 : les offres en cours accessibles
     depuis ce club, bloc masqué s'il n'y en a aucune. Même règle que sur
     Tarifs : un produit promo dédié s'affiche en carte, une remise sur des
     produits existants s'annonce en une ligne, qui renvoie à la section
     correspondante de Tarifs avec ce club déjà choisi. */
  function offreDuClub(c, etat) {
    var local = {
      club: c.id, tarif: 'adulte', engagement: H.engagementDefaut(), produitChoisi: null,
      promo: etat.promo, offreActive: etat.offreActive
    };
    var offres = R.offresVisibles(local);
    var annonce = V.annoncePromo(local, {
      lienBase: '../../tarifs/?club=' + c.id,
      spec: 'B.3 > Trame de la page club > 12'
    });
    if (!offres.length && !annonce) return '';
    return '<section data-spec="B.3 > Trame de la page club > 12">' +
      '<h2>Offre du moment</h2>' +
      /* Même règle que sur Tarifs : le compteur de section ne sert que
         quand aucune carte ne porte déjà ses jours restants. */
      (offres.length ? '' : V.compteur(R.finOffre(local))) + annonce +
      (offres.length
        ? '<div class="grille grille--cartes" style="margin-top:12px">' + offres.map(function (p) {
            return V.carteProduit(p, local);
          }).join('') + '</div>'
        : '') +
      '</section>';
  }

  return {
    infosPratiques: infosPratiques, coursDuClub: coursDuClub,
    formulesEtExtras: formulesEtExtras, equipementsBloc: equipementsBloc,
    bienEtreBloc: bienEtreBloc, passerelleNatation: passerelleNatation,
    passerelleCoursCollectifs: passerelleCoursCollectifs,
    clubsProximite: clubsProximite, offreDuClub: offreDuClub
  };
})());

/* ------------------------------------------------------------------ */
/* Règles et composants de la branche Sport                             */
/* Vocabulaire de B.3 : catégorie pour les clubs. Pour les cours,       */
/* objectif (rangement), famille (discipline à variantes), fiche.        */
/* ------------------------------------------------------------------ */
Object.assign(window.HF.regles, (function () {
  'use strict';
  var H = window.HF, D = H.data, R = H.regles;

  /* Tous les membres d'une famille, cours générique compris. */
  function membresDeFamille(idFamille) {
    return D.cours.filter(function (c) { return c.famille === idFamille; });
  }

  /* B.3 : la page de famille liste TOUS ses membres. Ce qui change, c'est
     la forme : un membre avec page dédiée est un lien, un membre sans page
     est une section avec ancre. Les variantes absorbées en filtre ne sont
     ni l'un ni l'autre, elles sont citées comme filtre. */
  function membresRanges(idFamille) {
    var f = H.famille(idFamille);
    var membres = membresDeFamille(idFamille).filter(function (c) {
      return !f || f.coursGenerique !== c.id;
    });
    return {
      liens:    membres.filter(function (c) { return c.traitement === 'page'; }),
      sections: membres.filter(function (c) { return c.traitement === 'section' || c.traitement === null; }),
      filtres:  membres.filter(function (c) {
        return c.traitement === 'filtre-intensite' || c.traitement === 'filtre-format';
      })
    };
  }

  /* Un cours est une page de famille quand sa page porte la famille. */
  function familleDuCoursGenerique(idCours) {
    return D.referentiels.familles.find(function (f) { return f.coursGenerique === idCours; }) || null;
  }

  /* Les Small Group Training sont des cours, pas des produits : un seul
     Extra les couvre tous, et c'est lui qui porte le prix et les clubs.
     Le hub liste donc les cours qui en font partie, jamais l'Extra
     lui-même : « Small Group Training » est le nom de l'Extra, pas celui
     d'un training (Hugo, 2026-09-16). */
  function smallGroupTrainings() {
    var e = R.extraDesSgt();
    if (!e) return [];
    return D.cours.filter(function (c) { return c.estExtra && c.extra === e.id; });
  }

  /* Les entrées qui partagent une fiche : le cours lui-même, et celles qui
     pointent sur lui. Une fiche montre tout ce qui vit dessus. */
  function coursDeLaFiche(idCours) {
    return D.cours.filter(function (c) {
      return c.id === idCours || c.memeFicheQue === idCours;
    });
  }

  /* Créneaux d'un cours, groupés par club. Une fiche partagée rassemble les
     créneaux de ses deux entrées : le visiteur cherche où pratiquer, pas
     comment c'est rangé dans le CMS. */
  function creneauxDuCours(idCours) {
    var ids = coursDeLaFiche(idCours).map(function (c) { return c.id; });
    var parClub = {};
    D.seances.filter(function (s) { return ids.indexOf(s.cours) !== -1; }).forEach(function (s) {
      (parClub[s.club] = parClub[s.club] || []).push(s);
    });
    return Object.keys(parClub).map(function (idClub) {
      return {
        club: H.club(idClub),
        seances: parClub[idClub].sort(function (a, b) {
          var j = D.referentiels.jours.indexOf(a.jour) - D.referentiels.jours.indexOf(b.jour);
          return j || a.heure.localeCompare(b.heure);
        })
      };
    }).sort(function (a, b) { return a.club.nom.localeCompare(b.club.nom, 'fr'); });
  }

  /* Une page de famille montre les clubs de toute la famille. */
  function creneauxDeFamille(idFamille) {
    var ids = membresDeFamille(idFamille).map(function (c) { return c.id; });
    var parClub = {};
    D.seances.filter(function (s) { return ids.indexOf(s.cours) !== -1; }).forEach(function (s) {
      (parClub[s.club] = parClub[s.club] || []).push(s);
    });
    return Object.keys(parClub).map(function (idClub) {
      return { club: H.club(idClub), seances: parClub[idClub] };
    }).sort(function (a, b) { return a.club.nom.localeCompare(b.club.nom, 'fr'); });
  }

  function coachsDuCours(idCours) {
    var co = H.cours(idCours);
    return co ? co.coachs.map(H.coach).filter(Boolean) : [];
  }

  function coachsDeFamille(idFamille) {
    var vus = {};
    return membresDeFamille(idFamille).reduce(function (acc, c) {
      c.coachs.forEach(function (k) { if (!vus[k]) { vus[k] = 1; acc.push(k); } });
      return acc;
    }, []).map(H.coach).filter(Boolean);
  }

  function coachsPersonnels() {
    return D.coachs.filter(function (k) { return k.coachingPersonnel; });
  }

  /* Catalogue du hub : les 6 objectifs, chaque cours une seule fois sous
     son objectif principal. Les cours absorbés en filtre ne sont pas des
     entrées de catalogue, ils vivent dans leur page de famille. */
  /* Les catégories de clubs où ce cours est donné. Jamais saisi : déduit des
     séances, comme les clubs d'un cours. */
  function categoriesDuCours(idCours) {
    var ids = coursDeLaFiche(idCours).map(function (c) { return c.id; });
    var vus = {};
    D.seances.forEach(function (s) {
      if (ids.indexOf(s.cours) === -1) return;
      var c = H.club(s.club);
      if (c) vus[c.categorie] = 1;
    });
    return Object.keys(vus);
  }

  /* Ce cours est-il accessible avec la formule d'une catégorie donnée ? La
     règle d'accès est cumulative : Premium couvre Essential et Gym, donc un
     cours donné dans un club Essential est accessible en Premium. Filtrer et
     compter par la seule catégorie du club dirait le contraire. */
  function coursAccessible(idCours, idCat) {
    var cat = H.categorie(idCat);
    if (!cat) return true;
    return categoriesDuCours(idCours).some(function (x) {
      return cat.couvre.indexOf(x) !== -1;
    });
  }

  /* Recherche : insensible à la casse et aux accents, sur le nom du cours,
     celui de sa famille (chercher "pilates" doit sortir ses variantes) et
     celui de ses objectifs (chercher "danse" doit sortir les cours rangés
     sous "Danser", même si aucun ne porte le mot dans son nom). */
  function sansAccent(t) {
    return String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function nomObjectifRecherche(id) {
    var o = D.referentiels.objectifs.find(function (x) { return x.id === id; });
    return o ? o.nom : '';
  }
  function correspondRecherche(c, terme) {
    var t = sansAccent(terme).trim();
    if (!t) return true;
    var fam = c.famille ? H.famille(c.famille) : null;
    var champs = [c.nom, fam ? fam.nom : '',
      nomObjectifRecherche(c.objectifPrincipal), nomObjectifRecherche(c.objectifSecondaire)];
    return champs.some(function (x) { return sansAccent(x).indexOf(t) !== -1; });
  }

  /* Un cours passe-t-il les filtres du hub ? Une seule règle, utilisée par le
     catalogue et par le planning, pour qu'ils ne divergent jamais. */
  function coursFiltre(c, f) {
    /* Une fiche partagée porte deux entrées : le cours collectif et le Small
       Group Training du même nom. Les filtres qui portent sur la séance ou
       sur le format regardent les deux, sinon HIIT disparaît dès qu'on filtre
       le club où il n'est donné qu'en Extra. */
    var entrees = coursDeLaFiche(c.id);
    if (f.objectif && c.objectifPrincipal !== f.objectif) return false;
    if (f.intensite && c.intensite !== f.intensite) return false;
    if (f.format && !entrees.some(function (x) { return x.format === f.format; })) return false;
    if (f.categorie && !coursAccessible(c.id, f.categorie)) return false;
    if (f.club && !entrees.some(function (x) {
      return R.seancesDuClub(f.club).some(function (s) { return s.cours === x.id; });
    })) return false;
    if (!correspondRecherche(c, f.recherche)) return false;
    return true;
  }

  /* Sous quelle forme ce cours se paie-t-il ?
     '' : inclus partout. 'toujours' : c'est un Small Group Training, donc un
     Extra partout où il est donné. 'parfois' : la même pratique est incluse
     dans certains clubs et en Extra dans d'autres, deux entrées, une fiche.
     Déduit des données : personne ne saisit cette information. */
  function formeExtra(idCours, portee) {
    var entrees = coursDeLaFiche(idCours);
    var p = portee || {};
    /* Avec un club ou une catégorie en filtre, la réponse se restreint à ce
       périmètre : HIIT est « parfois » un Extra dans l'absolu, mais à
       Genève · La Praille il l'est toujours. Dire « parfois » à quelqu'un qui
       a choisi son club, c'est le laisser payer sans le savoir. */
    if (p.club || p.categorie) {
      var cat = p.categorie ? H.categorie(p.categorie) : null;
      var donnes = {};
      D.seances.forEach(function (s) {
        if (p.club && s.club !== p.club) return;
        if (cat) {
          var cl = H.club(s.club);
          if (!cl || cat.couvre.indexOf(cl.categorie) === -1) return;
        }
        donnes[s.cours] = 1;
      });
      entrees = entrees.filter(function (c) { return donnes[c.id]; });
    }
    if (!entrees.length) return '';
    var extras = entrees.filter(function (c) { return c.estExtra; });
    if (!extras.length) return '';
    return extras.length === entrees.length ? 'toujours' : 'parfois';
  }

  /* Une catégorie de clubs qui ne propose aucun cours collectif : le cas
     existe (Gym). Déduit des données, pas écrit en dur : si Harmony en
     ajoute un jour, le message disparaît tout seul. */
  function categorieSansCours(idCat) {
    var cat = idCat ? H.categorie(idCat) : null;
    if (!cat) return false;
    /* La question se pose sur les séances, pas sur les cours : une fiche
       partagée existe dans les deux formes, et c'est le club qui tranche.
       Compter les cours ferait croire à un cours collectif en Gym parce que
       la même pratique est incluse ailleurs. */
    return !D.seances.some(function (s) {
      var co = H.cours(s.cours); if (!co || co.estExtra) return false;
      var cl = H.club(s.club);
      return cl && cat.couvre.indexOf(cl.categorie) !== -1;
    });
  }

  function catalogueParObjectif(filtres) {
    var f = filtres || {};
    var visibles = D.cours.filter(function (c) {
      /* Un Small Group Training est un cours collectif payant : il a sa place
         ici, marqué « Extra » (Hugo, 2026-09-16, Q45). Ce qu'on ne veut pas,
         c'est deux cartes du même nom : une entrée qui partage sa fiche avec
         une autre n'est pas une entrée du catalogue, c'est la même carte. */
      if (c.memeFicheQue) return false;
      if (c.traitement === 'filtre-intensite' || c.traitement === 'filtre-format') return false;
      return coursFiltre(c, f);
    });
    var groupes = D.referentiels.objectifs.map(function (o) {
      return { objectif: o, cours: visibles.filter(function (c) { return c.objectifPrincipal === o.id; }) };
    }).filter(function (g) { return g.cours.length; });
    var orphelins = visibles.filter(function (c) { return !c.objectifPrincipal; });
    if (orphelins.length) {
      groupes.push({ objectif: { id: null, nom: '[Objectif à définir]' }, cours: orphelins, aValider: true });
    }
    return groupes;
  }

  return {
    membresDeFamille: membresDeFamille, membresRanges: membresRanges,
    familleDuCoursGenerique: familleDuCoursGenerique,
    smallGroupTrainings: smallGroupTrainings,
    creneauxDuCours: creneauxDuCours, creneauxDeFamille: creneauxDeFamille,
    coachsDuCours: coachsDuCours, coachsDeFamille: coachsDeFamille,
    coachsPersonnels: coachsPersonnels, coursDeLaFiche: coursDeLaFiche,
    catalogueParObjectif: catalogueParObjectif,
    categoriesDuCours: categoriesDuCours, coursFiltre: coursFiltre,
    formeExtra: formeExtra,
    coursAccessible: coursAccessible, categorieSansCours: categorieSansCours
  };
})());

Object.assign(window.HF.vues, (function () {
  'use strict';
  var H = window.HF, D = H.data, R = H.regles, V = H.vues;
  var esc = H.esc, prixTexte = H.prixTexte, texte = H.texte, aValider = H.aValider;

  function nomObjectif(id) {
    var o = D.referentiels.objectifs.find(function (x) { return x.id === id; });
    return o ? o.nom : null;
  }
  function nomIntensite(id) {
    var x = D.referentiels.intensites.find(function (i) { return i.id === id; });
    return x ? x.nom : '';
  }
  function nomFormat(id) {
    var x = D.referentiels.formats.find(function (i) { return i.id === id; });
    return x ? x.nom : '';
  }

  /* Attributs d'un cours en tags, même vocabulaire partout. Intensité et
     format sont des valeurs fermées du référentiel, et ce sont elles que les
     filtres manipulent : les voir en tag sur la carte fait le lien entre ce
     qu'on a filtré et ce qu'on lit. Ils portent toujours leur mot, jamais une
     couleur ou une forme seule.
     Sur le catalogue du hub, l'objectif principal est déjà le titre de la
     section : le répéter sur chaque carte n'apprend rien, d'où sansObjectif.
     L'objectif secondaire, lui, n'apparaît nulle part ailleurs. */
  function attributsCours(co, opts) {
    var o = opts || {};
    var tags = [];
    if (!o.sansObjectif) {
      tags.push({ texte: nomObjectif(co.objectifPrincipal) || '[Objectif à définir]' });
    }
    /* Intensité et format d'abord : ce sont les valeurs courtes et fermées
       que les filtres manipulent. L'objectif secondaire, plus long, ferme la
       ligne et passe seul à la ligne suivante quand il ne tient pas. */
    if (nomIntensite(co.intensite)) tags.push({ texte: nomIntensite(co.intensite) });
    if (nomFormat(co.format)) tags.push({ texte: nomFormat(co.format) });
    if (co.objectifSecondaire) {
      tags.push({ texte: 'aussi ' + nomObjectif(co.objectifSecondaire).toLowerCase(),
                  classe: ' tag--secondaire' });
    }
    if (!tags.length) return '';
    return '<p class="tags">' + tags.map(function (t) {
      return '<span class="tag' + (t.classe || '') + '">' + esc(t.texte) + '</span>';
    }).join('') + aValider(co.objectifsAValider) + '</p>';
  }

  function selectFiltre(liste, courant, cle, vide) {
    return '<select data-act="filtre" data-cle="' + cle + '"><option value="">' + vide + '</option>' +
      liste.map(function (x) {
        return '<option value="' + x.id + '"' + (courant === x.id ? ' selected' : '') + '>' +
          esc(x.nom) + '</option>';
      }).join('') + '</select>';
  }

  /* Les filtres du hub : catégorie de clubs, club, objectif, intensité,
     format. Une seule barre pour toute la page : elle pilote le catalogue et
     le planning en même temps. Le filtre « type » n'existe plus.
     La catégorie vient en premier parce qu'elle commande la liste des clubs :
     choisir Premium ne laisse que les clubs Premium dans le second menu. */
  function filtresCours(etat) {
    var f = etat.filtres || {};
    var clubs = D.clubs.filter(function (c) {
      return !f.categorie || c.categorie === f.categorie;
    });
    return '<div class="filtres" data-spec="B.3 > Sport > Cours collectifs (hub)">' +
      /* Libellé au nom de la formule, pas du club : le filtre répond à
         « qu'est-ce que je peux faire avec cette formule », et la règle est
         cumulative. « Clubs Premium » aurait laissé croire à un lieu. */
      selectFiltre(D.categories.map(function (c) { return { id: c.id, nom: 'Avec la formule ' + c.nom }; }),
        f.categorie, 'categorie', 'Toutes les formules') +
      selectFiltre(clubs.map(function (c) { return { id: c.id, nom: c.nom }; }), f.club, 'club', 'Tous les clubs') +
      selectFiltre(D.referentiels.objectifs, f.objectif, 'objectif', 'Tous les objectifs') +
      selectFiltre(D.referentiels.intensites, f.intensite, 'intensite', 'Toutes les intensités') +
      selectFiltre(D.referentiels.formats, f.format, 'format', 'Tous les formats') +
      '</div>';
  }

  /* Le planning n'ajoute que son filtre jour : les 4 autres sont déjà en
     haut de page et s'appliquent ici aussi. */
  function planningType(etat, base) {
    var f = etat.filtres || {};
    var filtres = '<div class="filtres">' +
      selectFiltre(D.referentiels.jours.map(function (j) { return { id: j, nom: j[0].toUpperCase() + j.slice(1) }; }),
        f.jour, 'jour', 'Tous les jours') +
      '<span class="mention">Les filtres du haut de page s\'appliquent aussi au planning.</span>' +
      '</div>';

    var visibles = D.seances.filter(function (s) {
      var co = H.cours(s.cours); if (!co) return false;
      if (f.club && s.club !== f.club) return false;
      /* Accès cumulatif, comme au catalogue : filtrer Premium garde les
         séances des clubs Essential et Gym, puisque la formule Premium y
         donne accès. */
      if (f.categorie) {
        var cl = H.club(s.club);
        var cat = H.categorie(f.categorie);
        if (!cl || !cat || cat.couvre.indexOf(cl.categorie) === -1) return false;
      }
      if (f.jour && s.jour !== f.jour) return false;
      return R.coursFiltre(co, { objectif: f.objectif, intensite: f.intensite,
        format: f.format, recherche: f.recherche });
    });

    var corps = '';
    D.referentiels.jours.forEach(function (jour) {
      var duJour = visibles.filter(function (s) { return s.jour === jour; })
        .sort(function (a, b) { return a.heure.localeCompare(b.heure) || a.club.localeCompare(b.club); });
      if (!duJour.length) return;
      corps += '<tr class="planning__jour"><td colspan="4">' + esc(jour[0].toUpperCase() + jour.slice(1)) + '</td></tr>' +
        duJour.map(function (s) {
          var co = H.cours(s.cours), c = H.club(s.club);
          return '<tr><td>' + esc(s.heure) + '</td>' +
            '<td><a href="' + H.lienCours(co, base) + '">' + esc(co.nom) + '</a>' +
            (co.estExtra ? ' <span class="extra__marque">Extra</span>' : '') + '</td>' +
            '<td><a href="' + base + 'clubs/club/?club=' + c.id + '">' + esc(c.nom) + '</a></td>' +
            '<td>' + esc(s.duree) + ' min</td></tr>';
        }).join('');
    });

    /* Le planning mêle des séances incluses et des séances en Extra : on le
       dit une fois, en tête, plutôt que de laisser le marqueur s'expliquer
       tout seul. La ligne ne sort pas si rien n'est en Extra. */
    var mixte = visibles.some(function (s) {
      var co = H.cours(s.cours); return co && co.estExtra;
    });

    return '<section id="planning" data-spec="B.3 > Sport > Cours collectifs (hub)">' +
      '<h2>Planning type</h2>' + filtres +
      (mixte ? '<p class="mention">Inclus dans votre abonnement, sauf mention « Extra ».</p>' : '') +
      (corps
        ? '<table class="planning"><thead><tr><th>Heure</th><th>Cours</th><th>Club</th>' +
          '<th>Durée</th></tr></thead><tbody>' + corps + '</tbody></table>'
        : videPlanning(etat, base)) +
      '<p class="mention">Planning type saisi au CMS. Mis à jour le [date de mise à jour].</p></section>';
  }

  /* Catalogue rangé par les 6 objectifs (B.3 > Cours collectifs (hub)). */
  function catalogueCours(etat, base) {
    var f = etat.filtres || {};
    var groupes = R.catalogueParObjectif(f);
    /* Six objectifs et cinquante cartes : sans moyen d'y aller, celui qui
       cherche « Danser » défile cinq objectifs. Une ligne d'ancres sous le
       titre, déduite des objectifs présents, et un id par section. Ce n'est
       pas une barre collante, c'est une table des matières (audit du
       2026-10-21, écart 3). */
    var ancre = function (g) { return g.objectif.id ? 'objectif-' + g.objectif.id : null; };
    var sommaire = groupes.filter(ancre).length > 1
      ? '<nav class="ancres" aria-label="Aller à un objectif">' + groupes.filter(ancre).map(function (g) {
          return '<a href="#' + ancre(g) + '">' + esc(g.objectif.nom) + '</a>';
        }).join('') + '</nav>'
      : '';
    return '<section id="catalogue" data-spec="B.3 > Sport > Cours collectifs (hub)">' +
      '<h2>Nos cours par objectif</h2>' +
      (raisonCategorie(etat, base) && groupes.length
        ? '<p class="mention">' + raisonCategorie(etat, base) + '</p>' : '') +
      sommaire +
      (groupes.length ? groupes.map(function (g) {
        return '<h3 class="h-bloc"' + (ancre(g) ? ' id="' + ancre(g) + '"' : '') + '>' +
          esc(g.objectif.nom) + aValider(g.aValider) + '</h3>' +
          '<div class="grille grille--cartes">' + g.cours.map(function (co) {
            return carteCours(co, base, { club: f.club, categorie: f.categorie, sansObjectif: true });
          }).join('') + '</div>';
      }).join('') : videCatalogue(etat, base)) +
      '</section>';
  }

  /* La carte d'un cours, cliquable en entier (Q47). Une seule carte pour le
     catalogue du hub et les cours en avant de l'accueil : la même règle
     Extra, la même mention de famille. opts.club et opts.categorie bornent
     la lecture du caractère Extra au périmètre filtré. */
  function carteCours(co, base, opts) {
    var o = opts || {};
    /* Sur la carte du cours qui EST la page de famille, la mention
       renverrait sur la carte elle-même : on l'enlève. */
    var fam = co.famille ? H.famille(co.famille) : null;
    if (fam && R.familleDuCoursGenerique(co.id)) fam = null;
    /* Un Small Group Training se lit dans le catalogue comme les autres,
       mais jamais comme les autres : la carte porte le mot Extra et dit en
       clair ce que ça coûte en plus. Trois cas, trois traitements. Inclus
       partout : rien de plus. Extra partout : le liseré, le mot et la
       phrase, parce que c'est un autre produit. Extra dans certains clubs
       seulement : une phrase, sans liseré ni marqueur, sinon on ferait fuir
       d'un cours qui est inclus presque partout. */
    var forme = R.formeExtra(co.id, { club: o.club, categorie: o.categorie });
    return '<div class="produit produit--lien' +
      (forme === 'toujours' ? ' produit--extra' : '') + '">' +
      (o.photo ? '<div class="produit__photo">' + V.blocImage('Photo cours ' + co.nom, 'large') + '</div>' : '') +
      '<h4><a href="' + H.lienCours(co, base) + '">' + esc(co.nom) + '</a>' +
      (forme === 'toujours' ? ' <span class="extra__marque">Extra</span>' : '') + '</h4>' +
      attributsCours(co, { sansObjectif: !!o.sansObjectif }) +
      (forme
        ? '<p class="mention">' + (forme === 'toujours'
            ? 'En option de votre formule, pas inclus'
            : 'Inclus, sauf dans les clubs où il est donné en Extra') + '</p>'
        : '') +
      /* La famille est un lien, pas une étiquette : c'est par là que les
         pages de famille se trouvent, depuis chaque cours qui en fait
         partie, et non par une liste qui se ferait passer pour l'inventaire
         des disciplines (Hugo, 2026-09-16, Q46). */
      (fam ? '<p class="mention">Famille <a class="lien-texte" href="' +
        H.lienFamille(fam, base) + '">' + esc(fam.nom) + '</a></p>' : '') +
      V.actionCarte(forme === 'toujours' ? 'Voir le training' : 'Voir le cours') +
      '</div>';
  }

  /* B.3 > Catégories de clubs : "Pas de cours collectifs" en Gym, des Small
     Group Training y sont proposés en Extra. On informe, on ne laisse pas un
     "aucun résultat" sec là où il y a une raison. */
  function raisonCategorie(etat, base) {
    var f = etat.filtres || {};
    if (!R.categorieSansCours(f.categorie)) return '';
    var cat = H.categorie(f.categorie);
    return 'Les clubs ' + esc(cat.nom) + ' ne proposent aucun cours collectif ' +
      'inclus dans la formule. Ce qui s\'y donne est en Extra, marqué comme tel. ' +
      '<a class="lien-texte" href="' + (base || '') +
      'sport/small-group-training/">Voir les Small Group Training</a>';
  }
  function videCatalogue(etat, base) {
    return '<p class="planning__vide">' +
      (raisonCategorie(etat, base) || 'Aucun cours ne correspond à ces filtres.') + '</p>';
  }
  function videPlanning(etat, base) {
    return '<p class="planning__vide">' +
      (raisonCategorie(etat, base) || 'Aucune séance ne correspond à ces filtres.') + '</p>';
  }

  /* La ligne « ce qui l'inclut » d'une discipline, déduite des formules.
     Trois cas : toutes les formules la comprennent, certaines seulement, ou
     aucune, et c'est alors un Extra. Personne ne saisit cette phrase : elle
     se recalcule le jour où une formule change. */
  function ligneInclusion(idInclusion, opts) {
    var prefixe = (opts && opts.prefixe) || 'Inclus';
    var avec = R.formulesAvec(idInclusion);
    var toutes = D.produits.filter(function (p) { return p.type === 'formule'; });
    if (!avec.length) return ligneExtra();
    if (avec.length === toutes.length) return prefixe + ' dans toutes les formules';
    return prefixe + ' dès la formule ' + H.nomProduitHtml(avec[0]);
  }

  /* Ce qui se vend en Extra n'est compris dans aucune formule, sauf celle qui
     les inclut tous. La ligne le dit dans cet ordre : ce que ça coûte
     d'abord, la sortie par le haut ensuite (Hugo, 2026-09-16). Le nom de la
     formule se lit dans les données, il n'est jamais écrit dans une page. */
  function ligneExtra() {
    var f = R.formuleAvecExtras();
    return 'En Extra de votre abonnement' +
      (f ? ' ou inclus dans la formule ' + H.nomProduitHtml(f) : '');
  }

  /* Bloc « variantes » : actif seulement sur une page de famille. */
  function blocVariantes(idFamille, base) {
    var f = H.famille(idFamille); if (!f) return '';
    var m = R.membresRanges(f.id);
    var out = '<section data-spec="B.3 > Sport > Pages de famille"><h2>Les cours ' + esc(f.nom) + '</h2>';

    if (m.liens.length) {
      /* Un membre de la famille peut être un Extra : la famille dit la
         pratique, pas le mode d'accès. On le marque, sinon le visiteur le
         croit inclus comme ses voisins. */
      out += '<div class="grille grille--cartes">' + m.liens.map(function (co) {
        return '<div class="produit produit--lien"><h3><a href="' + H.lienCours(co, base) + '">' +
          esc(co.nom) + '</a>' +
          (co.estExtra ? ' <span class="extra__marque">Extra</span>' : '') +
          '</h3>' + attributsCours(co) +
          '<p>' + esc(co.description) + '</p>' + V.actionCarte('Voir le cours') + '</div>';
      }).join('') + '</div>';
    }

    m.sections.forEach(function (co) {
      out += '<section id="' + co.id + '" style="margin-top:26px">' +
        '<h3>' + esc(co.nom) +
        (co.estExtra ? ' <span class="extra__marque">Extra</span>' : '') +
        (co.traitement === null ? '' : '') +
        '</h3>' + attributsCours(co) +
        '<p>' + esc(co.description) + '</p>' +
        '<p class="mention">Ancre : <code>#' + co.id + '</code></p></section>';
    });

    if (m.filtres.length) {
      out += '<p class="mention" style="margin-top:20px">Aussi proposé en ' +
        m.filtres.map(function (co) {
          var quoi = co.traitement === 'filtre-intensite'
            ? nomIntensite(co.intensite).toLowerCase() : nomFormat(co.format).toLowerCase();
          return esc(co.nom) + ' (' + esc(quoi) + ')';
        }).join(', ') +
        '. Ces variantes ne sont pas des pages : elles se retrouvent par les filtres du planning.</p>';
    }

    return out + '</section>';
  }

  /* Créneaux, pour une fiche comme pour une famille. */
  function creneaux(groupes, base, titre) {
    if (!groupes.length) return '';
    /* Un même cours peut être inclus dans un club et en Extra dans un autre :
       le tableau doit le dire club par club, sinon le visiteur lit la même
       ligne pour deux réalités qui ne coûtent pas le même prix. */
    var mixte = groupes.some(function (g) {
      return g.seances.some(function (s) { var c = H.cours(s.cours); return c && c.estExtra; });
    });
    return '<section data-spec="B.3 > Sport > Fiches cours"><h2>' + esc(titre) + '</h2>' +
      (mixte ? '<p class="mention">Inclus dans votre abonnement, sauf mention « Extra ».</p>' : '') +
      '<table class="tableau"><thead><tr><th>Club</th><th>Catégorie</th><th>Créneaux</th></tr></thead><tbody>' +
      groupes.map(function (g) {
        var enExtra = g.seances.some(function (s) {
          var c = H.cours(s.cours); return c && c.estExtra;
        });
        return '<tr><td><a href="' + base + 'clubs/club/?club=' + g.club.id + '">' +
          esc(g.club.nom) + '</a>' +
          (enExtra ? ' <span class="extra__marque">Extra</span>' : '') + '</td>' +
          '<td>' + esc(H.categorie(g.club.categorie).nom) + '</td>' +
          '<td>' + g.seances.map(function (s) {
            var co = H.cours(s.cours);
            return esc(s.jour + ' ' + s.heure) +
              (co && groupes.famille ? ' (' + esc(co.nom) + ')' : '');
          }).join(' · ') + '</td></tr>';
      }).join('') + '</tbody></table></section>';
  }

  /* Bloc « en Extra » d'une fiche Small Group Training.
     Le prix n'est pas celui du training : c'est celui de l'Extra « Small
     Group Training », qui les couvre tous. On le dit, sinon le visiteur croit
     payer ce training-là et compte deux fois s'il en pratique deux.
     Une fiche peut être partagée par deux entrées : le cours collectif, inclus,
     et le Small Group Training du même nom, payant. Le bloc sort alors sur la
     fiche du cours inclus, avec une autre phrase : il ne s'agit plus de dire
     « ce cours est un Extra » mais « dans certains clubs, il l'est ». */
  function blocExtraDuCours(co, base) {
    var entree = R.coursDeLaFiche(co.id).filter(function (c) {
      return c.estExtra && c.extra;
    })[0];
    if (!entree) return '';
    var e = H.extra(entree.extra); if (!e) return '';
    var partage = entree.id !== co.id;
    /* Les clubs listés sont ceux où CE training est donné, pas ceux où
       l'Extra est vendu : la fiche répond à « où je le pratique ». */
    var clubs = R.clubsDuCours(entree.id);
    var platinum = R.formuleAvecExtras();
    return '<section data-spec="B.3 > Sport > Fiches cours (Extra)">' +
      '<div class="produit">' +
      '<h2>' + (partage ? 'Aussi en Small Group Training' : 'Un Small Group Training') +
      ' <span class="extra__marque">Extra</span></h2>' +
      '<p>' + (partage
        ? 'Dans certains clubs, ce cours est donné en petit groupe avec un coach. ' +
          'Cette forme-là ne s\'ajoute pas à votre abonnement toute seule : ' +
          'elle se prend en Extra.'
        : 'Ce cours ne se pratique qu\'en petit groupe avec un coach, et se prend ' +
          'en Extra de votre abonnement.') + '</p>' +
      '<p>Il fait partie de l\'Extra <strong>' + esc(e.nom) + '</strong>, ' +
      'qui donne accès à tous les Small Group Training du club.' +
      (platinum ? ' Cet Extra est compris dans la formule ' +
        H.nomProduitHtml(platinum) + '.' : '') + '</p>' +
      '<p><strong>' + prixTexte(e.prix) + '</strong> ' +
      '<span class="mention">pour l\'Extra, quel que soit le nombre de Small Group Training pratiqués</span></p>' +
      (clubs.length
        ? '<p class="mention">Proposé à : ' + clubs.map(function (c) {
            return esc(c.nom);
          }).join(', ') + '</p>'
        : '') +
      '<p><a class="btn" href="' + base + 'tarifs/">Voir les tarifs</a></p>' +
      '</div></section>';
  }

  return {
    attributsCours: attributsCours, nomObjectif: nomObjectif,
    nomIntensite: nomIntensite, nomFormat: nomFormat,
    filtresCours: filtresCours, planningType: planningType, catalogueCours: catalogueCours,
    carteCours: carteCours,
    blocVariantes: blocVariantes,
    ligneInclusion: ligneInclusion, ligneExtra: ligneExtra,
    creneaux: creneaux, blocExtraDuCours: blocExtraDuCours
  };
})());

/* ------------------------------------------------------------------ */
/* Header collant : il disparaît quand on descend, réapparaît dès qu'on */
/* remonte (Hugo, 2026-10-22, Q68, à valider par Harmony).              */
/* ------------------------------------------------------------------ */
/* Collé en permanence, il mangerait 75 px sur les pages longues ; caché,
   S'abonner et Séance d'essai seraient à une page de défilement. Il
   revient donc au premier geste vers le haut.
   Deux cas où il ne colle pas, déduits de la page et jamais d'une liste :
   une page qui a déjà sa barre collante B.3 (Tarifs : « une seule barre
   collante en haut »), et le header réduit d'une landing.
   Le header est rendu par x-html : son hôte passe en display: contents,
   sinon position: sticky n'a aucune marge pour coller (comme .hote-collant). */
(function () {
  'use strict';
  var header = null, dernierY = 0, seuil = 8;

  function trouver() {
    if (header && document.contains(header)) return header;
    header = document.querySelector('header.entete:not(.entete--landing)');
    if (!header) return null;
    if (document.querySelector('.barre-collante')) { header = null; return null; }
    if (header.parentElement) header.parentElement.classList.add('hote-collant');
    header.classList.add('entete--collant');
    return header;
  }

  function surDefilement() {
    var h = trouver();
    if (!h) return;
    var y = window.scrollY || 0;
    if (Math.abs(y - dernierY) < seuil) return;
    /* Tout en haut, ou en remontant : visible. En descendant, passé sa
       propre hauteur : caché. Le focus clavier dedans le garde visible. */
    /* « Collé » se lit sur la position à l'écran : offsetTop d'un élément
       sticky suit le défilement et ne dit plus où il était au départ. */
    var colle = h.getBoundingClientRect().top <= 0.5 && y > 0;
    var cache = colle && y > dernierY && y > 3 * h.offsetHeight && !h.contains(document.activeElement);
    h.classList.toggle('entete--cache', cache);
    h.classList.toggle('entete--decolle', colle);
    dernierY = y;
  }

  window.addEventListener('scroll', surDefilement, { passive: true });
  document.addEventListener('focusin', function (ev) {
    if (header && header.contains(ev.target)) header.classList.remove('entete--cache');
  });
  window.addEventListener('load', function () { trouver(); });
})();

/* ------------------------------------------------------------------ */
/* Barre « Choisir mon club » de Tarifs : visible seulement une fois le */
/* bloc de choix du club dépassé, tant qu'aucun club n'est choisi.      */
/* ------------------------------------------------------------------ */
/* La barre est re-rendue par Alpine à chaque changement d'état : la classe
   se recalcule au défilement et après chaque rendu, jamais gardée. */
(function () {
  'use strict';
  function verifier() {
    var barre = document.querySelector('.barre-collante--attente');
    if (!barre) return;
    var ordi = document.getElementById('choix-club');
    var bloc = ordi && ordi.offsetParent ? ordi : document.getElementById('choix-club-mobile');
    var depasse = bloc ? bloc.getBoundingClientRect().bottom < 0 : true;
    barre.classList.toggle('barre-collante--visible', depasse);
  }
  window.addEventListener('scroll', verifier, { passive: true });
  window.addEventListener('resize', verifier);
  window.addEventListener('load', function () {
    verifier();
    new MutationObserver(verifier).observe(document.body, { childList: true, subtree: true });
  });
})();
