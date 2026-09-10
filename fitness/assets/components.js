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

    /* Tarif par âge : ne grise jamais. Un produit sans le tarif choisi
       s'affiche au prix adulte avec "Pas de tarif [x], prix adulte". */
    prix: function (p, idTarif, idEngagement) {
      var applique = p.prix && p.prix[idTarif] ? idTarif : 'adulte';
      var bloc = p.prix ? p.prix[applique] : null;
      var valeur = null;
      if (bloc) valeur = (idEngagement in bloc) ? bloc[idEngagement] : bloc.unique;
      return {
        valeur: (valeur === undefined) ? null : valeur,
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

    /* B.3 > Clubs > Carte club : prix de la formule la moins chère qui donne
       accès au club, au tarif Adulte. Tant qu'aucun prix n'est connu, la
       carte affiche le placeholder plutôt qu'un montant inventé. */
    desParMois: function (idClub) {
      var c = club(idClub);
      if (!c) return null;
      var montants = D.produits
        .filter(function (p) { return p.type === 'formule' && regles.produitDisponible(p, idClub); })
        .map(function (p) { return regles.prix(p, 'adulte', 'sans').valeur; })
        .filter(function (v) { return typeof v === 'number'; });
      return montants.length ? Math.min.apply(null, montants) : null;
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

  /* Position d'un repère sur la carte, calculée depuis les coordonnées
     des clubs. La carte du wireframe n'est pas une vraie carte : elle
     situe les repères les uns par rapport aux autres. */
  function position(c) {
    var lats = D.clubs.map(function (x) { return x.gps.lat; });
    var lngs = D.clubs.map(function (x) { return x.gps.lng; });
    var minLat = Math.min.apply(null, lats), maxLat = Math.max.apply(null, lats);
    var minLng = Math.min.apply(null, lngs), maxLng = Math.max.apply(null, lngs);
    return {
      x: 8 + ((c.gps.lng - minLng) / (maxLng - minLng)) * 84,
      y: 92 - ((c.gps.lat - minLat) / (maxLat - minLat)) * 84
    };
  }

  return {
    data: D,
    club: club, categorie: categorie, cours: cours, extra: extra,
    produit: produit, coach: coach, tarif: tarif, engagement: engagement,
    regles: regles,
    prixTexte: prixTexte, texte: texte, esc: esc, spec: spec,
    aValider: aValider, position: position
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
      '<div class="grille grille--3">' + D.categories.map(function (cat) {
        return '<div class="produit">' +
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
      '<div class="carte__fond">Carte des 10 clubs</div>' +
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
            return '<button type="button" class="club-ligne' +
              (etat.survol === c.id ? ' club-ligne--survol' : '') + '"' +
              ' data-act="choisir-club" data-id="' + c.id + '"' +
              ' data-survol="' + c.id + '" aria-pressed="false">' +
              forme(cat, 'badge-cat__forme') +
              '<span><span class="club-ligne__nom">' + esc(c.nom) + '</span>' +
              '<span class="club-ligne__meta"> · ' + esc(cat.nom) + '<br>' +
              esc(texte(c.adresse, '[adresse]')) + '</span></span></button>';
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
            return '<button type="button" class="btn btn--discret btn--petit" ' +
              'data-act="choisir-club" data-id="' + c.id + '">' +
              esc(c.nom) + ' · ' + esc(cat.nom) + '</button>';
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

  /* Carte produit, trois variantes : formule, offre, carnet.
     Sans club : aucun bouton de souscription, jamais un bouton désactivé. */
  function carteProduit(p, etat) {
    var dispo = R.produitDisponible(p, etat.club);
    if (!dispo) return '';
    var choisi = etat.produitChoisi === p.id;
    var pr = R.prix(p, etat.tarif, etat.engagement);
    var corps = '', pied = '', specRef;

    if (p.type === 'formule') {
      specRef = 'B.3 > Page Tarifs > Trame > 4';
      var mois = moisEngagement[etat.engagement] || 1;
      var total = (typeof pr.valeur === 'number') ? pr.valeur * mois : null;
      corps =
        '<p class="produit__acces">' + esc(R.ligneAcces(p.categorie)) + '</p>' +
        lignesInclusion(p) +
        '<div class="produit__prix">' + prixTexte(pr.valeur) +
        ' <span class="produit__prix-unite">/ mois</span></div>' +
        '<div class="produit__total">Total ' +
        esc(H.engagement(etat.engagement).nom.toLowerCase()) + ' : ' + prixTexte(total) + '</div>' +
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
        '<div class="produit__prix">' + prixTexte(pr.valeur) + '</div>' +
        '<div class="produit__total">soit env. ' + prixTexte(pm) + ' par mois</div>' +
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
      corps =
        '<p class="produit__acces">' + esc(R.ligneAcces(p.categorie)) + '</p>' +
        '<p>' + esc(entrees === null ? '[X] entrées' : entrees + ' entrées') + '</p>' +
        '<div class="produit__prix">' + prixTexte(pr.valeur) + '</div>' +
        '<div class="produit__total">' + prixTexte(parEntree) + " par entrée</div>" +
        (pr.mentionRepli ? '<p class="mention">' + esc(pr.mentionRepli) + '</p>' : '');
      pied = etat.club
        ? '<button type="button" class="btn btn--bloc" data-act="choisir-produit" data-id="' +
          p.id + '">Acheter ce carnet</button>'
        : '';
    }

    return '<article class="produit' + (choisi ? ' produit--choisi' : '') + '" data-spec="' + specRef + '">' +
      '<h3>' + esc(p.nom) + '</h3>' + corps +
      '<div class="produit__pied">' + pied + '</div></article>';
  }

  /* Extras vendus en ligne : prix + "Ajouter". Vendus en club :
     "Sur demande en club", sans prix ni bouton. */
  function carteExtra(e, etat) {
    var enLigne = e.modeVente === 'en-ligne';
    var ajoute = (etat.extrasChoisis || []).indexOf(e.id) !== -1;
    return '<div class="extra" data-spec="B.3 > Page Tarifs > Trame > 4 (Extras)">' +
      '<div class="extra__corps">' +
      '<strong>' + esc(e.nom) + '</strong> <span class="extra__marque">Extra</span>' +
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
     Le nom Echino n'apparaît jamais. */
  function barreRecap(etat) {
    if (!etat.produitChoisi) return '';
    var p = H.produit(etat.produitChoisi);
    if (!p) return '';
    var pr = R.prix(p, etat.tarif, etat.engagement);
    var extras = (etat.extrasChoisis || []).map(H.extra).filter(Boolean);
    var detail = [H.tarif(etat.tarif).nom];
    if (p.type === 'formule') detail.push(H.engagement(etat.engagement).nom);
    if (p.type === 'offre') detail.push(texte(p.duree, '[durée]'));
    if (extras.length) detail.push(extras.map(function (e) { return e.nom; }).join(', '));
    return '<div class="barre-recap" data-spec="B.3 > Page Tarifs > Règles > Barre récap">' +
      (etat.message ? '<div class="barre-recap__message">' + esc(etat.message) + '</div>' : '') +
      '<div class="barre-recap__inner">' +
      '<div><strong>' + esc(p.nom) + '</strong>' +
      '<div class="barre-recap__detail">' + esc(detail.join(' · ')) + '</div></div>' +
      '<div class="barre-recap__total">' + prixTexte(pr.valeur) +
      (p.type === 'formule' ? ' / mois' : '') + '</div>' +
      '<button type="button" class="btn" data-act="finaliser">Finaliser mon abonnement</button>' +
      '</div></div>';
  }

  /* B.3 > Carte club : toute la carte est cliquable, un seul bouton
     "S'abonner", un lien texte "Planning". Pas de liens imbriqués. */
  function carteClub(c, etat, opts) {
    var o = opts || {};
    var cat = H.categorie(c.categorie);
    var des = R.desParMois(c.id);
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
      '<span class="mention">Tarif adulte dès ' + prixTexte(des) + ' / mois</span>' +
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
      if (f.objectif && co.objectif !== f.objectif) return false;
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
          '<td><a href="../../cours/fiche/?cours=' + co.id + '">' + esc(co.nom) + '</a>' +
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

  function ctaEssai(base) {
    return '<section class="cta-essai" data-spec="B.3 > Page Tarifs > Trame > 6">' +
      '<h2>Envie d\'essayer d\'abord ?</h2>' +
      '<p>Demandez à être rappelé pour votre séance d\'essai.</p>' +
      '<a class="btn" href="' + (base || '') + 'seance-essai/">Demander une séance d\'essai</a></section>';
  }

  /* Compteur lié à la date de fin de l'offre (Annexe A > A.2). */
  function compteur(fin) {
    var reste = Math.max(0, Math.ceil((new Date(fin) - new Date()) / 86400000));
    return '<div class="compteur" data-spec="Annexe A > A.2 > Compteur d\'offre">' +
      '<span>' + reste + '</span> jours restants</div>';
  }

  return {
    lignesInclusion: lignesInclusion, carteProduit: carteProduit, carteExtra: carteExtra,
    ligneIndisponible: ligneIndisponible, ligneSansClub: ligneSansClub,
    barreCollante: barreCollante, barreRecap: barreRecap, carteClub: carteClub,
    planning: planning, grilleCoachs: grilleCoachs, panneauCoach: panneauCoach,
    faq: faq, temoignages: temoignages, ctaEssai: ctaEssai, compteur: compteur
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
    return {
      club: (club && H.club(club)) ? club : null,
      tarif: (tarif && H.tarif(tarif)) ? tarif : 'adulte',
      engagement: 'sans',
      offreActive: true,
      produitChoisi: null,
      extrasChoisis: [],
      carteOuverte: false,
      apercuClub: null,
      survol: null,
      catOuverte: null,
      coachOuvert: null,
      faqOuverte: null,
      message: null,
      filtres: { jour: '', objectif: '', intensite: '', format: '' },
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
    'choisir-produit': function (etat, id) {
      etat.produitChoisi = (etat.produitChoisi === id) ? null : id;
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
      etat.filtres[el.getAttribute('data-cle')] = el.value;
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
    return '<div class="wf-barre"><div class="wf-barre__inner">' +
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
    actions: actions, brancher: brancher,
    selecteurEtat: selecteurEtat, brancherSelecteur: brancherSelecteur
  };
})());
