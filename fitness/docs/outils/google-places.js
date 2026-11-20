#!/usr/bin/env node
/* Relevé quotidien des fiches Google des clubs (Hugo, 2026-11-20).

   Lit l'identifiant Google de chaque club dans data/data.js, demande sa
   fiche à l'API Places (New), une fois par club, et écrit la copie dans
   data/google.js, que les pages lisent. Les visiteurs ne déclenchent
   aucun appel : 10 appels par jour, environ 300 par mois, dans la tranche
   gratuite du palier « Enterprise + Atmosphere » (celui des avis).

   Lancé chaque nuit par .github/workflows/google-places.yml, ou à la main :
     GOOGLE_PLACES_KEY=… node fitness/docs/outils/google-places.js
   La clé vient de l'environnement, jamais d'un fichier du dépôt. GOOGLE_REFERER
   (facultatif) envoie un en-tête Referer, pour une clé restreinte à un site.

   Le fichier n'est réécrit que si une donnée a changé : pas de commit ni
   de déploiement pour rien. Sortie : « change » ou « identique » sur la
   dernière ligne, lue par la tâche planifiée.

   Production : ce relevé reste une solution de maquette. Les conditions de
   l'API Places limitent la conservation de son contenu ; le futur site lira
   l'API Google Business Profile, données d'Harmony (Q76). */

'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = path.join(__dirname, '..', '..');
const DATA = path.join(RACINE, 'data', 'data.js');
const SORTIE = path.join(RACINE, 'data', 'google.js');

/* Seuls les champs affichés. Les avis et la note imposent de toute façon le
   palier « Enterprise + Atmosphere » : un seul appel par club reste le
   moins cher. */
const CHAMPS = [
  'formattedAddress',
  'regularOpeningHours.weekdayDescriptions',
  'rating',
  'userRatingCount',
  'googleMapsUri',
  'reviews.rating',
  'reviews.text.text',
  'reviews.publishTime',
  'reviews.authorAttribution.displayName'
].join(',');

const cle = process.env.GOOGLE_PLACES_KEY;
if (!cle) { console.error('GOOGLE_PLACES_KEY manquante.'); process.exit(1); }

global.window = {};
require(DATA);
const clubs = window.DATA.clubs.filter(function (c) { return c.googlePlaceId; });

function lireAncien() {
  if (!fs.existsSync(SORTIE)) return null;
  const txt = fs.readFileSync(SORTIE, 'utf8');
  const m = txt.match(/window\.GOOGLE_DATA = ([\s\S]*);\s*$/);
  return m ? JSON.parse(m[1]) : null;
}

async function fiche(id) {
  const entetes = { 'X-Goog-Api-Key': cle, 'X-Goog-FieldMask': CHAMPS };
  if (process.env.GOOGLE_REFERER) entetes.Referer = process.env.GOOGLE_REFERER;
  const rep = await fetch('https://places.googleapis.com/v1/places/' + encodeURIComponent(id) +
    '?languageCode=fr', { headers: entetes });
  if (!rep.ok) throw new Error(id + ' : HTTP ' + rep.status + ' ' + (await rep.text()).slice(0, 200));
  const p = await rep.json();
  return {
    adresse: (p.formattedAddress || '').replace(/, (Suisse|Switzerland)$/, ''),
    horaires: p.regularOpeningHours ? p.regularOpeningHours.weekdayDescriptions : null,
    note: p.rating == null ? null : p.rating,
    nombre: p.userRatingCount || 0,
    lien: p.googleMapsUri || null,
    avis: (p.reviews || []).map(function (r) {
      return {
        note: r.rating,
        texte: r.text ? r.text.text : '',
        date: r.publishTime ? r.publishTime.slice(0, 10) : null,
        auteur: r.authorAttribution ? r.authorAttribution.displayName : ''
      };
    })
  };
}

(async function () {
  const ancien = lireAncien();
  const lieux = {};
  let erreurs = 0;
  for (const c of clubs) {
    try {
      lieux[c.googlePlaceId] = await fiche(c.googlePlaceId);
    } catch (e) {
      erreurs++;
      console.error('Échec ' + c.id + ' : ' + e.message);
      /* Une fiche en échec garde sa dernière copie, jamais un trou. */
      if (ancien && ancien.lieux[c.googlePlaceId]) lieux[c.googlePlaceId] = ancien.lieux[c.googlePlaceId];
    }
  }
  if (erreurs === clubs.length) { console.error('Aucune fiche lue, rien n\'est écrit.'); process.exit(1); }

  if (ancien && JSON.stringify(ancien.lieux) === JSON.stringify(lieux)) {
    console.log(clubs.length - erreurs + ' fiches lues, aucune donnée changée.');
    console.log('identique');
    return;
  }
  const contenu = {
    releve: new Date().toISOString().slice(0, 10),
    source: 'Google Places API (New), relevé quotidien',
    lieux: lieux
  };
  fs.writeFileSync(SORTIE,
    '/* Copie des fiches Google des clubs, écrite par docs/outils/google-places.js.\n' +
    '   Ne pas modifier à la main : le prochain relevé l\'écraserait. */\n' +
    'window.GOOGLE_DATA = ' + JSON.stringify(contenu, null, 1) + ';\n');
  console.log(clubs.length - erreurs + ' fiches lues, ' + erreurs + ' en échec, fichier réécrit.');
  console.log('change');
})().catch(function (e) { console.error(e); process.exit(1); });
