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

  /* L'engagement présélectionné se lit dans le référentiel, jamais en dur :
     changer le défaut est une saisie, pas une reprise du code. */
  function engagementDefaut() {
    var e = D.referentiels.engagements.filter(function (x) { return x.defaut; })[0];
    return e ? e.id : D.referentiels.engagements[0].id;
  }

  var regles = {

    /* B.3 > Page Tarifs > Règles : Premium couvre tous les clubs,
       Essential couvre Essential et GYM, GYM couvre Pâquis. La règle est
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
      if (liste.length === 1) return 'Accès au club ' + liste[0].nom;
      if (liste.length === D.clubs.length) return 'Accès aux ' + D.clubs.length + ' clubs';
      return 'Accès à ' + liste.length + ' clubs';
    },

    /* Grisé : un seul sens, "pas accessible depuis ce club". */
    produitDisponible: function (p, idClub) {
      if (!idClub) return true;
      var c = club(idClub);
      if (!c) return true;
      var cat = categorie(p.categorie);
      return !!cat && cat.couvre.indexOf(c.categorie) !== -1;
    },

    extraDisponible: function (e, idClub) {
      if (!idClub) return true;
      return e.clubs.indexOf(idClub) !== -1;
    },

    extrasDuClub: function (idClub) {
      if (!idClub) return [];
      return D.extras.filter(function (e) { return e.clubs.indexOf(idClub) !== -1; });
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

    /* Q8 : sur un club GYM, la ligne informe au lieu de compter. */
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
  function aValider(cond) { return cond ? '<span class="wf-avalider">à valider par Harmony</span>' : ''; }

  /* Positions des repères sur la carte, calculées depuis les coordonnées
     des clubs. La carte du wireframe n'est pas une vraie carte : elle situe
     les repères les uns par rapport aux autres.

     Les clubs genevois sont trop proches pour que leurs repères se
     distinguent à cette échelle. Une passe d'écartement les sépare, sinon
     la règle "forme et lettre, jamais la couleur seule" ne sert à rien :
     un repère caché sous un autre n'est lisible d'aucune façon. Le calcul
     est déterministe, la carte ne bouge pas d'un affichage à l'autre. */
  var ECART_MIN = 8;   /* en % de la largeur de la carte */
  var _positions = null;

  function positions() {
    if (_positions) return _positions;
    var lats = D.clubs.map(function (x) { return x.gps.lat; });
    var lngs = D.clubs.map(function (x) { return x.gps.lng; });
    var minLat = Math.min.apply(null, lats), maxLat = Math.max.apply(null, lats);
    var minLng = Math.min.apply(null, lngs), maxLng = Math.max.apply(null, lngs);

    var pts = D.clubs.map(function (c) {
      return {
        id: c.id,
        x: 10 + ((c.gps.lng - minLng) / (maxLng - minLng)) * 80,
        y: 90 - ((c.gps.lat - minLat) / (maxLat - minLat)) * 80
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

  function famille(id) {
    return D.referentiels.familles.find(function (f) { return f.id === id || f.slug === id; }) || null;
  }

  return {
    data: D,
    club: club, categorie: categorie, cours: cours, extra: extra,
    produit: produit, coach: coach, tarif: tarif, engagement: engagement,
    promotion: promotion, engagementDefaut: engagementDefaut,
    regles: regles,
    prixTexte: prixTexte, texte: texte, esc: esc, spec: spec,
    aValider: aValider, position: position, positions: positions,
    lienCours: lienCours, famille: famille
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

  function forme(cat, prefixe) {
    return '<span class="' + prefixe + ' ' + prefixe + '--' + cat.forme + '"></span>';
  }

  /* --- Structure ------------------------------------------------- */

  function barreGroupe() {
    var liens = ['Harmony', 'Fitness', 'Arts martiaux', 'École de natation', 'Famille'];
    return '<div class="barre-groupe" data-spec="B.3 > Arborescence > Barre groupe">' +
      '<div class="barre-groupe__inner">' +
      liens.map(function (l) {
        return '<a href="#"' + (l === 'Fitness' ? ' aria-current="true"' : '') + '>' + esc(l) + '</a>';
      }).join('') + '</div></div>';
  }

  /* B.3 > intro : 4 entrées et un bouton Séance d'essai. */
  function entete(courante, racine) {
    var base = racine || '';
    var nav = [
      { nom: 'Clubs',      href: base + 'clubs/' },
      { nom: 'Sport',      href: base + 'sport/' },
      { nom: 'Bien-être',  href: '#' },
      { nom: 'Tarifs',     href: base + 'tarifs/' }
    ];
    return '<header class="entete" data-spec="B.3 > Arborescence > Header">' +
      '<div class="entete__inner">' +
      '<a class="entete__logo" href="' + base + '">Harmony Fitness</a>' +
      '<nav class="entete__nav">' + nav.map(function (e) {
        return '<a href="' + e.href + '"' + (e.nom === courante ? ' aria-current="page"' : '') +
          '>' + esc(e.nom) + '</a>';
      }).join('') + '</nav>' +
      '<a class="btn btn--secondaire" href="' + base + 'seance-essai/">Séance d\'essai</a>' +
      '</div></header>';
  }

  function pied() {
    var cols = [
      { titre: 'Nos clubs', liens: ['Genève', 'Vaud'] },
      { titre: 'Le sport', liens: ['Plateau fitness', 'Cours collectifs', 'Small Group Training', 'Coaching personnel'] },
      { titre: 'Aide', liens: ["Besoin d'aide ?", 'Actualités'] },
      { titre: 'Contact', liens: ['[e-mail]', '[téléphone]'] }
    ];
    return '<footer class="pied" data-spec="B.3 > Arborescence > Footer"><div class="pied__inner">' +
      '<div class="pied__cols">' + cols.map(function (c) {
        return '<div><h4>' + esc(c.titre) + '</h4><ul style="list-style:none;padding:0">' +
          c.liens.map(function (l) { return '<li><a href="#">' + esc(l) + '</a></li>'; }).join('') +
          '</ul></div>';
      }).join('') + '</div>' +
      '<div class="pied__bas">Mentions légales · Confidentialité · Harmony Fitness</div>' +
      '</div></footer>';
  }

  function filAriane(items) {
    return '<nav class="fil">' + items.map(function (it, i) {
      return (i ? ' &rsaquo; ' : '') + (it.href ? '<a href="' + it.href + '">' + esc(it.nom) + '</a>' : esc(it.nom));
    }).join('') + '</nav>';
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
      '<button type="button" class="badge-cat" data-act="panneau-cat" data-id="' + cat.id + '"' +
      ' aria-expanded="' + (o.ouvert ? 'true' : 'false') + '">' +
      forme(cat, 'badge-cat__forme') + 'Club ' + esc(cat.nom) + '</button>' +
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
          '<h3>' + forme(cat, 'badge-cat__forme') + ' Club ' + esc(cat.nom) + '</h3>' +
          '<p>' + esc(cat.promesse) + aValider(cat.promesseAValider) + '</p>' +
          (o.court ? '' : '<ul>' + cat.socle.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>') +
          '<p class="ligne-acces">' + esc(cat.ligneAcces) + '</p>' +
          '<p class="mention">' + esc(R.ligneAcces(cat.id)) + '</p></div>';
      }).join('') + '</div>' +
      (o.court ? '' :
        '<details><summary class="lien-texte">Comment on classe Essential et Premium</summary>' +
        '<p class="mention">Essential : club 4 étoiles fitness-guide.ch. Premium : club 5 étoiles ' +
        'fitness-guide.ch et cours aquatiques en piscine. ' +
        '<a href="https://www.fitness-guide.ch" rel="noopener">fitness-guide.ch</a></p></details>') +
      '</section>';
  }

  /* --- Choix du club et carte ------------------------------------ */

  function carte(etat, opts) {
    var o = opts || {};
    return '<div class="carte-bloc">' +
      '<div class="carte">' +
      '<div class="carte__fond">Carte des ' + D.clubs.length + ' clubs</div>' +
      D.clubs.map(function (c) {
        var cat = H.categorie(c.categorie), p = H.position(c);
        var actif = etat.club === c.id || etat.survol === c.id;
        return '<button type="button" class="carte__repere carte__repere--' + cat.forme +
          (actif ? ' carte__repere--actif' : '') + '"' +
          ' style="left:' + p.x.toFixed(1) + '%;top:' + p.y.toFixed(1) + '%"' +
          ' data-act="' + (o.mobile ? 'apercu-club' : 'choisir-club') + '" data-id="' + c.id + '"' +
          ' title="' + esc(c.nom) + ' · ' + esc(cat.nom) + '"' +
          ' aria-label="' + esc(c.nom) + ', club ' + esc(cat.nom) + '">' + cat.lettre + '</button>';
      }).join('') +
      '</div>' +
      /* Légende sous la carte, pour ne masquer aucun repère. Forme et
         lettre, jamais la couleur seule (B.3 > Page Tarifs > Règles). */
      '<div class="carte__legende">' + D.categories.map(function (cat) {
        return '<span>' + forme(cat, 'badge-cat__forme') + esc(cat.nom) +
          ' (' + cat.lettre + ')</span>';
      }).join('') + '</div>';
  }

  /* B.3 > Page Tarifs > trame > 2. Un seul composant pour /clubs, /tarifs,
     /offre-du-moment et /seance-essai : seul le libellé change. */
  function choixClub(etat, opts) {
    var o = opts || {};
    var libelle = o.libelle || 'Choisissez votre club référent';
    if (etat.club) return clubReplie(etat, o);
    return '<section class="choix-club" data-spec="B.3 > Page Tarifs > Trame > 2">' +
      '<div><h2>' + esc(libelle) + '</h2>' +
      R.clubsParCanton().map(function (g) {
        return '<div class="choix-club__canton">' + esc(g.canton) + '</div>' +
          g.clubs.map(function (c) {
            var cat = H.categorie(c.categorie);
            /* Vrai lien vers l'état du club, pas un bouton : la page marche
               même si le script ne se charge pas (B.3 > Page Tarifs). */
            return '<a class="club-ligne' +
              (etat.survol === c.id ? ' club-ligne--survol' : '') + '"' +
              ' href="?club=' + c.id + '"' +
              ' data-act="choisir-club" data-id="' + c.id + '"' +
              ' data-survol="' + c.id + '">' +
              forme(cat, 'badge-cat__forme') +
              '<span><span class="club-ligne__nom">' + esc(c.nom) + '</span>' +
              '<span class="club-ligne__meta"> · ' + esc(cat.nom) + '<br>' +
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
    return '<section data-spec="B.3 > Page Tarifs > Trame > 2 (mobile)">' +
      R.clubsParCanton().map(function (g) {
        return '<div class="choix-club__canton">' + esc(g.canton) + '</div>' +
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
  return {
    barreGroupe: barreGroupe, entete: entete, pied: pied, filAriane: filAriane,
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

  /* B.3 > Page Tarifs > trame > 4 : les 4 lignes d'inclusion sont toujours
     affichées, dans le même ordre, avec "Non inclus" quand c'est le cas (Q4). */
  function lignesInclusion(p) {
    return '<ul class="produit__inclus">' + D.referentiels.inclusions.map(function (inc) {
      var v = p.inclus ? p.inclus[inc.id] : false;
      if (v === true) {
        return '<li><span class="produit__marque">✓</span><span>' + esc(inc.libelle) + '</span></li>';
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
  function photoProduit(p, pr, etat) {
    var ailleurs = pr.promo ? null : R.promoAutreEngagement(p, etat);
    var promo = pr.promo || ailleurs;
    var jours = joursRestants(promo && promo.validite ? promo.validite.fin
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
  function carteProduit(p, etat) {
    var dispo = R.produitDisponible(p, etat.club);
    if (!dispo) return '';
    var choisi = etat.produitChoisi === p.id;
    var pr = R.prix(p, etat.tarif, etat.engagement, etat);
    var corps = '', pied = '', specRef;

    if (p.type === 'formule') {
      specRef = 'B.3 > Page Tarifs > Trame > 4';
      var mois = moisEngagement[etat.engagement] || 1;
      var total = (typeof pr.valeur === 'number') ? pr.valeur * mois : null;
      corps =
        '<p class="produit__acces">' + esc(R.ligneAcces(p.categorie)) + '</p>' +
        lignesInclusion(p) +
        blocPrix(pr, '/ mois') +
        '<div class="produit__total">Total ' +
        esc(H.engagement(etat.engagement).nom.toLowerCase()) + ' : ' + prixTexte(total) + '</div>' +
        ligneRemise(pr) + ligneRemiseAilleurs(p, etat) +
        (pr.mentionRepli ? '<p class="mention">' + esc(pr.mentionRepli) + '</p>' : '');
      pied = etat.club
        ? '<button type="button" class="btn btn--bloc" data-act="choisir-produit" data-id="' +
          p.id + '">Choisir ' + esc(p.nom) + '</button>'
        : '';

    } else if (p.type === 'offre') {
      specRef = 'B.3 > Page Tarifs > Trame > 3';
      var pm = R.parMois(p);
      corps =
        '<p class="produit__duree">' + esc(texte(p.duree, '[durée]')) + '</p>' +
        '<p class="produit__acces">' + esc(R.ligneAcces(p.categorie)) + '</p>' +
        lignesInclusion(p) +
        blocPrix(pr, '') +
        '<div class="produit__total">soit env. ' + prixTexte(pm) + ' par mois</div>' +
        ligneRemise(pr) +
        (pr.mentionRepli ? '<p class="mention">' + esc(pr.mentionRepli) + '</p>' : '');
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
      corps =
        '<p class="produit__acces">' + esc(R.ligneAcces(p.categorie)) + '</p>' +
        '<p class="mention">Valable ' + esc(texte(p.duree, '[X] mois')) +
        ' à partir de l\'achat</p>' +
        blocPrix(pr, '') +
        '<div class="produit__total">' + prixTexte(parEntree) + " par entrée</div>" +
        ligneRemise(pr) +
        (pr.mentionRepli ? '<p class="mention">' + esc(pr.mentionRepli) + '</p>' : '');
      pied = etat.club
        ? '<button type="button" class="btn btn--bloc" data-act="choisir-produit" data-id="' +
          p.id + '">Acheter ce carnet</button>'
        : '';
    }

    return '<article class="produit' + (choisi ? ' produit--choisi' : '') + '" data-spec="' + specRef + '">' +
      photoProduit(p, pr, etat) +
      '<h3>' + esc(p.nom) + '</h3>' + corps +
      '<div class="produit__pied">' + pied + '</div></article>';
  }

  /* L'Extra est une ligne pleine largeur, empilée sous les Abonnements.
     Ce n'est pas une carte produit : on ne le compare pas à ses voisins, on
     le lit et on l'ajoute.
     Vendu en ligne : prix + "Ajouter". Vendu en club : "Sur demande en
     club", sans prix ni bouton. */
  function carteExtra(e, etat) {
    var enLigne = e.modeVente === 'en-ligne';
    var ajoute = (etat.extrasChoisis || []).indexOf(e.id) !== -1;
    return '<div class="extra" data-spec="B.3 > Page Tarifs > Trame > 4 (Extras)">' +
      '<div class="extra__corps">' +
      '<strong>' + esc(e.nom) + '</strong> <span class="extra__marque">Extra</span>' +
      (e.regroupeAValider
        ? ' <span class="wf-avalider">liste détaillée à fournir par Harmony</span>' : '') +
      '<p class="mention" style="margin:4px 0 0">' + esc(e.description) + '</p></div>' +
      '<div class="extra__droite">' +
      (enLigne
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

  /* Sans club : ligne en tête de section, aucun bouton désactivé. */
  function ligneSansClub(etat) {
    if (etat.club) return '';
    return '<p class="indispo" data-spec="B.3 > Page Tarifs > Règles > Sans club">' +
      'Choisissez d\'abord votre club pour souscrire.</p>';
  }

  /* Une seule barre collante en haut. Pas de barre d'ancres. */
  function barreCollante(etat) {
    var c = etat.club ? H.club(etat.club) : null;
    return '<div class="barre-collante" data-spec="B.3 > Page Tarifs > Règles > Barre collante">' +
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
      '<p class="mention">' + c.atouts.map(esc).join(' · ') + '</p>' +
      '<p class="carte-club__cours">' + esc(R.ligneCoursCarteClub(c.id)) + '</p>' +
      '<div class="carte-club__pied">' +
      '<a class="btn btn--petit" href="' + (o.base || '') + 'tarifs/?club=' + c.id +
      '&amp;source=' + (o.source || 'liste-clubs') + '">S\'abonner</a>' +
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

    var filtres = '<div class="filtres">' +
      opt(D.referentiels.jours.map(function (j) { return { id: j, nom: j[0].toUpperCase() + j.slice(1) }; }),
          f.jour, 'jour', 'Tous les jours') +
      opt(D.referentiels.objectifs, f.objectif, 'objectif', 'Tous les objectifs') +
      opt(D.referentiels.intensites, f.intensite, 'intensite', 'Toutes les intensités') +
      opt(D.referentiels.formats.filter(function (x) { return formatsPresents.indexOf(x.id) !== -1; }),
          f.format, 'format', 'Tous les formats') +
      '</div>';

    var visibles = seances.filter(function (s) {
      var co = H.cours(s.cours); if (!co) return false;
      if (f.jour && s.jour !== f.jour) return false;
      if (f.objectif && co.objectifPrincipal !== f.objectif) return false;
      if (f.intensite && co.intensite !== f.intensite) return false;
      if (f.format && co.format !== f.format) return false;
      return true;
    });

    var corps = '';
    D.referentiels.jours.forEach(function (jour) {
      var duJour = visibles.filter(function (s) { return s.jour === jour; })
        .sort(function (a, b) { return a.heure.localeCompare(b.heure); });
      if (!duJour.length) return;
      corps += '<tr class="planning__jour"><td colspan="4">' + esc(jour[0].toUpperCase() + jour.slice(1)) + '</td></tr>';
      corps += duJour.map(function (s) {
        var co = H.cours(s.cours);
        var inten = D.referentiels.intensites.find(function (x) { return x.id === co.intensite; });
        return '<tr><td>' + esc(s.heure) + '</td>' +
          '<td><a href="' + H.lienCours(co, '../../') + '">' + esc(co.nom) + '</a>' +
          (co.estExtra ? ' <span class="extra__marque">Extra</span>' : '') + '</td>' +
          '<td>' + esc(s.duree) + ' min</td>' +
          '<td>' + esc(inten ? inten.nom : '') + '</td></tr>';
      }).join('');
    });

    return '<section id="planning" data-spec="B.3 > Trame de la page club > 4">' +
      '<h2>Planning</h2>' + filtres +
      (corps
        ? '<table class="planning"><thead><tr><th>Heure</th><th>Cours</th><th>Durée</th>' +
          '<th>Intensité</th></tr></thead><tbody>' + corps + '</tbody></table>'
        : '<p class="planning__vide">Aucune séance ne correspond à ces filtres.</p>') +
      '<p class="mention">Mis à jour le [date de mise à jour].</p></section>';
  }

  /* Composant Personne : carte + panneau au clic. Pas de page coach. */
  function grilleCoachs(liste, etat) {
    return '<div class="coachs" data-spec="B.3 > Fiche coach dans le CMS">' +
      liste.map(function (k) {
        return '<button type="button" class="coach" data-act="panneau-coach" data-id="' + k.id + '"' +
          ' aria-expanded="' + (etat.coachOuvert === k.id) + '">' +
          V.blocImage(k.prenom + ', coach à [club]', 'portrait') +
          '<div class="coach__prenom">' + esc(k.prenom) + '</div>' +
          '<div class="coach__badges">' + k.badges.map(function (b) {
            return '<span class="coach__badge">' + esc(b) + '</span>';
          }).join('') + '</div></button>';
      }).join('') + '</div>' +
      (etat.coachOuvert ? panneauCoach(etat.coachOuvert) : '');
  }

  function panneauCoach(id) {
    var k = H.coach(id); if (!k) return '';
    return '<div class="panneau-cat"><h4>' + esc(k.prenom) + '</h4>' +
      '<p>' + esc(k.phrase) + '</p>' +
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

  function temoignages(n) {
    var txt = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor ' +
      'incididunt ut labore et dolore magna aliqua.';
    var out = [];
    for (var i = 0; i < (n || 3); i++) {
      out.push('<div class="temoignage"><p>« ' + txt + ' »</p>' +
        '<div class="temoignage__auteur">[Prénom], membre à [club]</div></div>');
    }
    return '<div class="grille grille--3" data-spec="Annexe A > A.2 > Bloc témoignage">' +
      out.join('') + '</div>';
  }

  /* Le CTA essai sert sur presque toutes les pages : sa référence de spec
     dépend donc de la page qui l'affiche, elle ne peut pas être figée. */
  function ctaEssai(base, spec) {
    return '<section class="cta-essai" data-spec="' +
      esc(spec || 'B.3 > Page Tarifs > Trame > 6') + '">' +
      '<h2>Envie d\'essayer d\'abord ?</h2>' +
      '<p>Demandez à être rappelé pour votre séance d\'essai.</p>' +
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
    blocPrix: blocPrix, ligneRemise: ligneRemise, annoncePromo: annoncePromo,
    ligneRemiseAilleurs: ligneRemiseAilleurs,
    ligneIndisponible: ligneIndisponible, ligneSansClub: ligneSansClub,
    barreCollante: barreCollante, barreRecap: barreRecap, carteClub: carteClub,
    planning: planning, grilleCoachs: grilleCoachs, panneauCoach: panneauCoach,
    faq: faq, temoignages: temoignages, ctaEssai: ctaEssai, compteur: compteur,
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
    /* Promo simulée. En production c'est la date de validité qui décide,
       ici c'est le sélecteur d'état, pour montrer les deux cas.
       ?promo= (vide) simule "aucune promo en cours". */
    var promo = params.get('promo');
    return {
      club: (club && H.club(club)) ? club : null,
      tarif: (tarif && H.tarif(tarif)) ? tarif : 'adulte',
      engagement: H.engagementDefaut(),
      offreActive: true,
      promo: (promo === null) ? 'carnets-10' : (H.promotion(promo) ? promo : null),
      produitChoisi: null,
      extrasChoisis: [],
      carteOuverte: false,
      apercuClub: null,
      survol: null,
      catOuverte: null,
      coachOuvert: null,
      faqOuverte: null,
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
    'aller-choix-club': function (etat) { etat.club = null; majUrl(etat); },
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
      if (p && p.type === 'formule') allerA('extras');
    },
    'ajouter-extra': function (etat, id) {
      if (etat.extrasChoisis.indexOf(id) === -1) etat.extrasChoisis.push(id);
    },
    'retirer-extra': function (etat, id) {
      etat.extrasChoisis = etat.extrasChoisis.filter(function (x) { return x !== id; });
    },
    'panneau-cat': function (etat, id) { etat.catOuverte = (etat.catOuverte === id) ? null : id; },
    'panneau-coach': function (etat, id) { etat.coachOuvert = (etat.coachOuvert === id) ? null : id; },
    'faq': function (etat, id) { var n = Number(id); etat.faqOuverte = (etat.faqOuverte === n) ? null : n; },
    'finaliser': function (etat) { etat.message = 'Redirection vers le tunnel de souscription.'; }
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
      (url ? '<span class="wf-champ"><label>URL simulée</label><code>' + esc(url) + '</code></span>' : '') +
      '<span class="wf-champ" style="margin-left:auto"><a href="' + (o.base || '') + '">Sommaire du lab</a></span>' +
      '</div></div>';
  }

  function brancherSelecteur(racine, etat) {
    racine.addEventListener('change', function (ev) {
      var el = ev.target.closest('[data-etat]');
      if (!el) return;
      var cle = el.getAttribute('data-etat');
      if (el.type === 'checkbox') { etat[cle] = el.checked; return; }
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
        titre: canton === 'Vaud' ? 'Nos clubs dans le canton de Vaud' : 'Nos clubs à ' + canton,
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

  /* B.3 > Trame de la page club > 2. Fixe en bas d'écran sur mobile. */
  function barreRapide(c) {
    var liens = [
      { nom: 'Planning', href: '#planning' },
      { nom: 'Horaires', href: '#infos' },
      { nom: 'Itinéraire', href: '#infos' },
      { nom: 'Appeler', href: '#infos' }
    ];
    return '<div class="barre-rapide" data-spec="B.3 > Trame de la page club > 2">' +
      liens.map(function (l) {
        return '<a href="' + l.href + '">' + esc(l.nom) + '</a>';
      }).join('') +
      '<span class="mention">Ouvert aujourd\'hui jusqu\'à [heure]</span></div>';
  }

  /* B.3 > Trame de la page club > 3. Identiques à la fiche Google. */
  function infosPratiques(c) {
    var lignes = [
      ['Adresse', texte(c.adresse, '[adresse]')],
      ['Horaires', texte(c.horaires, '[horaires, jours fériés compris]')],
      ['Transports', '[transports]'],
      ['Parking', c.equipements.indexOf('parking') !== -1 ? '[détail parking]' : 'Pas de parking'],
      ['Téléphone', texte(c.tel, '[téléphone]')],
      ['E-mail', texte(c.email, '[e-mail]')]
    ];
    return '<section id="infos" data-spec="B.3 > Trame de la page club > 3">' +
      '<h2>Infos pratiques</h2>' +
      '<table class="tableau"><tbody>' + lignes.map(function (l) {
        return '<tr><th style="width:160px">' + esc(l[0]) + '</th><td>' + esc(l[1]) + '</td></tr>';
      }).join('') + '</tbody></table>' +
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
              (co.traitement === null ? ' <span class="wf-avalider">page ou section à trancher</span>' : '') +
              '</li>';
          }).join('') + '</ul></div>';
      }).join('') + '</div></section>';
  }

  /* B.3 > Trame de la page club > 6. Partie extras masquée si le club n'en a pas. */
  function formulesEtExtras(c, etat) {
    var formules = R.formulesDuClub(c.id);
    var extras = R.extrasDuClub(c.id);
    var estGym = c.categorie === 'gym';
    return '<section data-spec="B.3 > Trame de la page club > ' + (estGym ? '5 (variante GYM)' : '6') + '">' +
      '<h2>Formules et Extras</h2>' +
      '<div class="grille grille--cartes">' + formules.map(function (p) {
        /* Même prix que sur /tarifs : le teaser suit la promo en cours,
           sinon le club annoncerait un prix que la page Tarifs dément. */
        var pr = R.prixMini(p, 'adulte', etat);
        return '<div class="produit"><h3>' + esc(p.nom) + '</h3>' +
          '<p class="produit__acces">' + esc(R.ligneAcces(p.categorie)) + '</p>' +
          '<p class="mention">Tarif adulte dès ' + prixTexte(pr.valeur) + ' / mois' +
          (pr.promo ? ' <span class="pastille-remise">- ' + pr.promo.remise.valeur +
            (pr.promo.remise.type === 'montant' ? ' CHF' : '%') + '</span>' : '') +
          '</p></div>';
      }).join('') + '</div>' +
      (extras.length
        ? '<h3 style="margin-top:24px">Les Extras de ' + esc(c.nom) + '</h3>' +
          extras.map(function (e) { return V.carteExtra(e, { club: c.id, extrasChoisis: [] }); }).join('')
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
  function bienEtreBloc(c) {
    var espaces = R.bienEtreDuClub(c.id);
    if (!espaces.length) return '';
    return '<section data-spec="B.3 > Trame de la page club > 9">' +
      '<h2>Bien-être</h2>' +
      '<ul>' + espaces.map(function (e) { return '<li>' + esc(e.nom) + '</li>'; }).join('') + '</ul>' +
      '<p><a class="lien-texte" href="#">Voir nos espaces bien-être</a></p></section>';
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

  /* Variante GYM : passerelle secondaire vers les cours collectifs. */
  function passerelleCoursCollectifs(c) {
    if (c.categorie !== 'gym') return '';
    return '<section data-spec="B.3 > Variante GYM">' +
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
    barreRapide: barreRapide, infosPratiques: infosPratiques, coursDuClub: coursDuClub,
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

  function smallGroupTrainings() {
    return D.extras.filter(function (e) { return e.type === 'sgt'; });
  }

  /* Créneaux d'un cours, groupés par club. */
  function creneauxDuCours(idCours) {
    var parClub = {};
    D.seances.filter(function (s) { return s.cours === idCours; }).forEach(function (s) {
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
    var vus = {};
    D.seances.forEach(function (s) {
      if (s.cours !== idCours) return;
      var c = H.club(s.club);
      if (c) vus[c.categorie] = 1;
    });
    return Object.keys(vus);
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
    if (f.objectif && c.objectifPrincipal !== f.objectif) return false;
    if (f.intensite && c.intensite !== f.intensite) return false;
    if (f.format && c.format !== f.format) return false;
    if (f.categorie && categoriesDuCours(c.id).indexOf(f.categorie) === -1) return false;
    if (f.club && !R.seancesDuClub(f.club).some(function (s) { return s.cours === c.id; })) return false;
    if (!correspondRecherche(c, f.recherche)) return false;
    return true;
  }

  /* Une catégorie de clubs qui ne propose aucun cours collectif : le cas
     existe (GYM). Déduit des données, pas écrit en dur : si Harmony en
     ajoute un jour, le message disparaît tout seul. */
  function categorieSansCours(idCat) {
    if (!idCat) return false;
    return !D.cours.some(function (c) {
      return !c.estExtra && categoriesDuCours(c.id).indexOf(idCat) !== -1;
    });
  }

  function catalogueParObjectif(filtres) {
    var f = filtres || {};
    var visibles = D.cours.filter(function (c) {
      if (c.estExtra) return false;
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
    coachsPersonnels: coachsPersonnels, catalogueParObjectif: catalogueParObjectif,
    categoriesDuCours: categoriesDuCours, coursFiltre: coursFiltre,
    categorieSansCours: categorieSansCours
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

  /* Ligne d'attributs d'un cours, même vocabulaire partout. */
  function attributsCours(co) {
    var bouts = [];
    var principal = nomObjectif(co.objectifPrincipal);
    bouts.push(principal || '[Objectif à définir]');
    if (co.objectifSecondaire) bouts.push('aussi ' + nomObjectif(co.objectifSecondaire).toLowerCase());
    bouts.push(nomIntensite(co.intensite));
    bouts.push(nomFormat(co.format));
    return '<p class="mention">' + esc(bouts.join(' · ')) +
      aValider(co.objectifsAValider) + '</p>';
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
      selectFiltre(D.categories.map(function (c) { return { id: c.id, nom: 'Clubs ' + c.nom }; }),
        f.categorie, 'categorie', 'Toutes les catégories de clubs') +
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
      var co = H.cours(s.cours); if (!co || co.estExtra) return false;
      if (f.club && s.club !== f.club) return false;
      /* La catégorie se juge sur le club de la séance, pas sur le cours :
         un cours donné à Meyrin et à Veyrier ne doit sortir qu'une fois
         filtré Premium la séance de Veyrier. */
      if (f.categorie) {
        var cl = H.club(s.club);
        if (!cl || cl.categorie !== f.categorie) return false;
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
            '<td><a href="' + H.lienCours(co, base) + '">' + esc(co.nom) + '</a></td>' +
            '<td><a href="' + base + 'clubs/club/?club=' + c.id + '">' + esc(c.nom) + '</a></td>' +
            '<td>' + esc(s.duree) + ' min</td></tr>';
        }).join('');
    });

    return '<section id="planning" data-spec="B.3 > Sport > Cours collectifs (hub)">' +
      '<h2>Planning type</h2>' + filtres +
      (corps
        ? '<table class="planning"><thead><tr><th>Heure</th><th>Cours</th><th>Club</th>' +
          '<th>Durée</th></tr></thead><tbody>' + corps + '</tbody></table>'
        : videPlanning(etat, base)) +
      '<p class="mention">Planning type saisi au CMS. Mis à jour le [date de mise à jour].</p></section>';
  }

  /* Catalogue rangé par les 6 objectifs (B.3 > Cours collectifs (hub)). */
  function catalogueCours(etat, base) {
    var groupes = R.catalogueParObjectif(etat.filtres || {});
    return '<section data-spec="B.3 > Sport > Cours collectifs (hub)">' +
      '<h2>Nos cours par objectif</h2>' +
      (groupes.length ? groupes.map(function (g) {
        return '<h3 style="margin-top:24px">' + esc(g.objectif.nom) + aValider(g.aValider) + '</h3>' +
          '<div class="grille grille--cartes">' + g.cours.map(function (co) {
            var fam = co.famille ? H.famille(co.famille) : null;
            return '<div class="produit"><h4><a href="' + H.lienCours(co, base) + '">' +
              esc(co.nom) + '</a></h4>' +
              attributsCours(co) +
              (fam ? '<p class="mention">Famille ' + esc(fam.nom) + '</p>' : '') +
              (co.traitement === null
                ? '<p><span class="wf-avalider">page ou section à trancher</span></p>' : '') +
              '</div>';
          }).join('') + '</div>';
      }).join('') : videCatalogue(etat, base)) +
      '</section>';
  }

  /* B.3 > Catégories de clubs : "Pas de cours collectifs" en GYM, des Small
     Group Training y sont proposés en Extra. On informe, on ne laisse pas un
     "aucun résultat" sec là où il y a une raison. */
  function raisonCategorie(etat, base) {
    var f = etat.filtres || {};
    if (!R.categorieSansCours(f.categorie)) return '';
    var cat = H.categorie(f.categorie);
    return 'Les clubs ' + esc(cat.nom) + ' ne proposent pas de cours collectifs. ' +
      'Des Small Group Training y sont proposés en Extra. ' +
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

  /* Liens vers les 4 pages de famille (B.3 > Cours collectifs (hub)). */
  function liensFamilles(base) {
    return '<section data-spec="B.3 > Sport > Cours collectifs (hub)">' +
      '<h2>Nos disciplines</h2>' +
      '<div class="grille grille--cartes">' + D.referentiels.familles.map(function (f) {
        var m = R.membresRanges(f.id);
        var total = m.liens.length + m.sections.length + m.filtres.length;
        return '<div class="produit"><h3><a href="' + base + 'cours/fiche/?cours=' + f.slug + '">' +
          esc(f.nom) + '</a>' +
          (f.slugAValider ? ' <span class="wf-avalider">slug à confirmer</span>' : '') + '</h3>' +
          '<p>' + esc(f.description) + '</p>' +
          '<p class="mention">' + total + ' cours dans cette famille</p></div>';
      }).join('') + '</div></section>';
  }

  /* Bloc « variantes » : actif seulement sur une page de famille. */
  function blocVariantes(idFamille, base) {
    var f = H.famille(idFamille); if (!f) return '';
    var m = R.membresRanges(f.id);
    var out = '<section data-spec="B.3 > Sport > Pages de famille"><h2>Les cours ' + esc(f.nom) + '</h2>';

    if (m.liens.length) {
      out += '<div class="grille grille--cartes">' + m.liens.map(function (co) {
        return '<div class="produit"><h3><a href="' + H.lienCours(co, base) + '">' +
          esc(co.nom) + '</a></h3>' + attributsCours(co) +
          '<p>' + esc(co.description) + '</p></div>';
      }).join('') + '</div>';
    }

    m.sections.forEach(function (co) {
      out += '<section id="' + co.id + '" style="margin-top:26px">' +
        '<h3>' + esc(co.nom) +
        (co.traitement === null ? ' <span class="wf-avalider">page ou section à trancher</span>' : '') +
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
    return '<section data-spec="B.3 > Sport > Fiches cours"><h2>' + esc(titre) + '</h2>' +
      '<table class="tableau"><thead><tr><th>Club</th><th>Catégorie</th><th>Créneaux</th></tr></thead><tbody>' +
      groupes.map(function (g) {
        return '<tr><td><a href="' + base + 'clubs/club/?club=' + g.club.id + '">' +
          esc(g.club.nom) + '</a></td>' +
          '<td>' + esc(H.categorie(g.club.categorie).nom) + '</td>' +
          '<td>' + g.seances.map(function (s) {
            var co = H.cours(s.cours);
            return esc(s.jour + ' ' + s.heure) +
              (co && groupes.famille ? ' (' + esc(co.nom) + ')' : '');
          }).join(' · ') + '</td></tr>';
      }).join('') + '</tbody></table></section>';
  }

  /* Bloc « en Extra » d'une fiche Small Group Training. */
  function blocExtraDuCours(co, base) {
    if (!co.estExtra || !co.extra) return '';
    var e = H.extra(co.extra); if (!e) return '';
    return '<section data-spec="B.3 > Sport > Fiches cours (Extra)">' +
      '<div class="produit">' +
      '<h2>' + esc(e.nom) + ' <span class="extra__marque">Extra</span></h2>' +
      '<p>Ce cours n\'est inclus dans aucune formule : c\'est un Extra de votre abonnement.</p>' +
      '<p><strong>' + prixTexte(e.prix) + '</strong></p>' +
      '<p class="mention">Proposé à : ' + e.clubs.map(function (id) {
        var c = H.club(id); return c ? esc(c.nom) : esc(id);
      }).join(', ') + '</p>' +
      '<p><a class="btn" href="' + base + 'tarifs/">Voir les tarifs</a></p>' +
      '</div></section>';
  }

  return {
    attributsCours: attributsCours, nomObjectif: nomObjectif,
    nomIntensite: nomIntensite, nomFormat: nomFormat,
    filtresCours: filtresCours, planningType: planningType, catalogueCours: catalogueCours,
    liensFamilles: liensFamilles, blocVariantes: blocVariantes,
    creneaux: creneaux, blocExtraDuCours: blocExtraDuCours
  };
})());
