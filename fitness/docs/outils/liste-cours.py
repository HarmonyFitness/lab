# -*- coding: utf-8 -*-
"""
Génère le tableur « Cours collectifs et Small Group Training » à envoyer à
Harmony, pré-rempli avec les données du lab.

    python3 docs/outils/liste-cours.py        (depuis fitness/)

Rien n'est saisi ici : tout est lu dans data/data.js, et le fichier se
régénère à chaque fois que les données bougent. Un cours qui partage sa
fiche avec un autre (memeFicheQue) ne fait qu'une ligne : c'est un seul
cours pour le client, et ce sont les colonnes des clubs qui disent sous
quelle forme il y est donné.

Le document sert deux systèmes, le site et Echino. D'où deux clés en tête
de tableau : notre identifiant, qui ne change jamais, et le code Echino,
qu'Harmony remplit. Sans ce pont, les deux bases se rapprochent par le nom
du cours, et ça casse au premier accent ou au premier renommage.

Dépendances : openpyxl, et node pour lire data.js.
"""
import json, io, os, subprocess, sys, collections
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import FormulaRule
from openpyxl.utils import get_column_letter

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(os.path.dirname(ICI))
DATA = os.path.join(RACINE, 'data', 'data.js')
SORTIE = os.path.join(ICI, 'cours-harmony.xlsx')

LECTEUR = """
global.window = {}; require(process.argv[1]);
var D = window.DATA;
function nom(l, id) { var x = D.referentiels[l].find(function (y) { return y.id === id; }); return x ? x.nom : ''; }
var clubs = D.clubs.map(function (c) {
  return { id: c.id, nom: c.nom, cat: c.categorie, canton: c.canton }; });
var lignes = D.cours.filter(function (c) { return !c.memeFicheQue; }).map(function (c) {
  var ids = D.cours.filter(function (x) { return x.id === c.id || x.memeFicheQue === c.id; });
  var parClub = {}, durees = [];
  D.seances.forEach(function (s) {
    var e = ids.find(function (x) { return x.id === s.cours; }); if (!e) return;
    parClub[s.club] = e.estExtra ? 'SGT' : 'Cours co';
    durees.push(s.duree);
  });
  return { id: c.id, nom: c.nom,
    objP: nom('objectifs', c.objectifPrincipal),
    objS: nom('objectifs', c.objectifSecondaire),
    intensite: nom('intensites', c.intensite), format: nom('formats', c.format),
    clubs: parClub, durees: durees };
});
console.log(JSON.stringify({ clubs: clubs, lignes: lignes,
  objectifs: D.referentiels.objectifs.map(function (o) { return o.nom; }),
  intensites: D.referentiels.intensites.map(function (o) { return o.nom; }),
  formats: D.referentiels.formats.map(function (o) { return o.nom; }) }));
"""

try:
    brut = subprocess.check_output(['node', '-e', LECTEUR, DATA])
except (OSError, subprocess.CalledProcessError) as e:
    sys.exit('Lecture de data.js impossible : %s' % e)
d = json.loads(brut.decode('utf-8'))
clubs, lignes = d['clubs'], d['lignes']

CAT = {'gym': 'Gym', 'essential': 'Essential', 'premium': 'Premium'}
TYPES = ['Cours co', 'SGT', 'Les deux selon le club']
FORMES = ['Cours co', 'SGT']
STATUTS = ['Actif', 'Nouveau', 'À retirer']
LICENCES = ['Aucune', 'Les Mills', 'Hyrox', 'Les Mills + Hyrox', 'Autre']

def licence(nom):
    lm, hy = nom.startswith('Les Mills'), 'Hyrox' in nom
    if lm and hy: return 'Les Mills + Hyrox'
    if lm: return 'Les Mills'
    if hy: return 'Hyrox'
    return 'Aucune'

def duree(l):
    if not l['durees']: return None
    return collections.Counter(l['durees']).most_common(1)[0][0]

POLICE = 'Arial'
NOIR = Font(name=POLICE, size=10)
BLANC = Font(name=POLICE, size=10, bold=True, color='FFFFFF')
TITRE = Font(name=POLICE, size=14, bold=True)
GRIS = Font(name=POLICE, size=10, color='767676')
H2 = Font(name=POLICE, size=11, bold=True, color='1F3864')
F_ENTETE = PatternFill('solid', fgColor='1F3864')
F_CLUB = PatternFill('solid', fgColor='2E5C8A')
F_CLE = PatternFill('solid', fgColor='5B5B5B')
F_ASAISIR = PatternFill('solid', fgColor='FFF7DC')
F_CALC = PatternFill('solid', fgColor='EFEFEF')
BORD = Border(*[Side(style='thin', color='D0D0D0')] * 4)

wb = Workbook()

# ------------------------------------------------------------------ Listes
ls = wb.create_sheet('Listes')
colonnes = [('Objectifs', d['objectifs']), ('Intensites', d['intensites']),
            ('Formats', d['formats']), ('Types', TYPES), ('Formes', FORMES),
            ('Statuts', STATUTS), ('Licences', LICENCES)]
for i, (titre, vals) in enumerate(colonnes, start=1):
    c = ls.cell(row=1, column=i, value=titre); c.font = BLANC; c.fill = F_ENTETE
    for j, v in enumerate(vals, start=2):
        ls.cell(row=j, column=i, value=v).font = NOIR
    ls.column_dimensions[get_column_letter(i)].width = 24
ls['I1'] = "Ces listes alimentent les menus déroulants de l'onglet Cours."
ls['I1'].font = GRIS
ls['I2'] = "Ajouter une valeur ici l'ajoute au menu, à condition d'étendre la plage de validation."
ls['I2'].font = GRIS

def plage(i, n):
    L = get_column_letter(i)
    return 'Listes!$%s$2:$%s$%d' % (L, L, n + 1)

# ------------------------------------------------------------------ Cours
ws = wb.create_sheet('Cours', 0)
entetes = ['Identifiant', 'Code Echino', 'Cours', 'Statut', 'Type',
           'Objectif principal', 'Objectif secondaire', 'Intensité', 'Format',
           'Durée (min)', 'Licence', 'Places (petit groupe)']
NB_FIXES = len(entetes)
for c in clubs:
    entetes.append('%s\n(%s)' % (c['nom'], CAT[c['cat']]))
entetes += ['Contrôle', 'Remarques']

G = NB_FIXES + 1                      # première colonne club
P = NB_FIXES + len(clubs)             # dernière colonne club
COL_CTRL, COL_REM = P + 1, P + 2
LG, LP = get_column_letter(G), get_column_letter(P)
LC = get_column_letter(COL_CTRL)

for i, t in enumerate(entetes, start=1):
    c = ws.cell(row=1, column=i, value=t)
    c.font = BLANC
    c.fill = F_CLE if i <= 2 else (F_CLUB if G <= i <= P else F_ENTETE)
    c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
ws.row_dimensions[1].height = 36

def controle(r):
    zone = '%s%d:%s%d' % (LG, r, LP, r)
    attendu = ('IF(COUNTIF({z},"Cours co")>0,IF(COUNTIF({z},"SGT")>0,'
               '"Les deux selon le club","Cours co"),"SGT")').format(z=zone)
    return (
        '=IF(C{r}="","",'
        'IF(E{r}="","Type à choisir",'
        'IF(F{r}="","Objectif principal à choisir",'
        'IF(H{r}="","Intensité à choisir",'
        'IF(I{r}="","Format à choisir",'
        'IF(COUNTIF({z},"Cours co")+COUNTIF({z},"SGT")=0,"Aucun club coché",'
        'IF(E{r}={a},"OK","Type et clubs se contredisent")))))))'
    ).format(r=r, z=zone, a=attendu)

VIDES = 25
derniere = 1 + len(lignes) + VIDES

for k, l in enumerate(lignes):
    r = 2 + k
    formes = set(l['clubs'].values())
    ws.cell(row=r, column=1, value=l['id'])
    ws.cell(row=r, column=3, value=l['nom'])
    ws.cell(row=r, column=4, value='Actif')
    ws.cell(row=r, column=5, value=('Les deux selon le club' if len(formes) > 1
                                    else (list(formes)[0] if formes else '')))
    ws.cell(row=r, column=6, value=l['objP'])
    ws.cell(row=r, column=7, value=l['objS'])
    ws.cell(row=r, column=8, value=l['intensite'])
    ws.cell(row=r, column=9, value=l['format'])
    ws.cell(row=r, column=10, value=duree(l))
    ws.cell(row=r, column=11, value=licence(l['nom']))
    for j, c in enumerate(clubs):
        ws.cell(row=r, column=G + j, value=l['clubs'].get(c['id'], ''))

for r in range(2, derniere + 1):
    neuve = r > 1 + len(lignes)
    for i in range(1, COL_REM + 1):
        c = ws.cell(row=r, column=i)
        c.font = GRIS if i == 1 else NOIR
        c.border = BORD
        c.alignment = Alignment(
            horizontal='center' if (G <= i <= P or i in (10, 12)) else 'left',
            vertical='center')
        if neuve and i != 1:
            c.fill = F_ASAISIR
    ctrl = ws.cell(row=r, column=COL_CTRL, value=controle(r))
    ctrl.fill = F_CALC
    ctrl.font = GRIS
    ctrl.alignment = Alignment(horizontal='left', vertical='center')

def valide(formule, col_debut, col_fin=None):
    dv = DataValidation(type='list', formula1=formule, allow_blank=True,
                        showErrorMessage=True,
                        error='Choisissez une valeur dans la liste.',
                        errorTitle='Valeur hors liste')
    ws.add_data_validation(dv)
    a = get_column_letter(col_debut); b = get_column_letter(col_fin or col_debut)
    dv.add('%s2:%s%d' % (a, b, derniere))

valide(plage(6, len(STATUTS)), 4)
valide(plage(4, len(TYPES)), 5)
valide(plage(1, len(d['objectifs'])), 6, 7)
valide(plage(2, len(d['intensites'])), 8)
valide(plage(3, len(d['formats'])), 9)
valide(plage(7, len(LICENCES)), 11)
valide(plage(5, len(FORMES)), G, P)

rouge = PatternFill('solid', fgColor='FCE4E4')
vert = PatternFill('solid', fgColor='E8F3E8')
ws.conditional_formatting.add(
    '%s2:%s%d' % (LC, LC, derniere),
    FormulaRule(formula=['AND($%s2<>"",$%s2<>"OK")' % (LC, LC)], fill=rouge,
                font=Font(name=POLICE, size=10, bold=True, color='9C0006')))
for col in range(G, P + 1):
    L = get_column_letter(col)
    ws.conditional_formatting.add('%s2:%s%d' % (L, L, derniere), FormulaRule(
        formula=['$%s2="SGT"' % L], fill=rouge,
        font=Font(name=POLICE, size=10, bold=True, color='9C3B00')))
    ws.conditional_formatting.add('%s2:%s%d' % (L, L, derniere), FormulaRule(
        formula=['$%s2="Cours co"' % L], fill=vert,
        font=Font(name=POLICE, size=10, color='2E5C2E')))

ws.freeze_panes = 'D2'
ws.auto_filter.ref = 'A1:%s%d' % (get_column_letter(COL_REM), derniere)
largeurs = {1: 24, 2: 16, 3: 30, 4: 12, 5: 21, 6: 28, 7: 28, 8: 12, 9: 13,
            10: 11, 11: 17, 12: 12, COL_CTRL: 30, COL_REM: 40}
for col in range(G, P + 1):
    largeurs[col] = 15
for col, w in largeurs.items():
    ws.column_dimensions[get_column_letter(col)].width = w

# ------------------------------------------------------------------ Textes
tx = wb.create_sheet('Textes')
for i, t in enumerate(['Identifiant', 'Cours', 'Description (2 à 3 lignes)',
                       'Bénéfice 1', 'Bénéfice 2', 'Bénéfice 3'], start=1):
    c = tx.cell(row=1, column=i, value=t)
    c.font = BLANC; c.fill = F_CLE if i == 1 else F_ENTETE
    c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
for k, l in enumerate(lignes):
    r = 2 + k
    tx.cell(row=r, column=1, value=l['id']).font = GRIS
    tx.cell(row=r, column=2, value=l['nom']).font = NOIR
    for i in range(3, 7):
        c = tx.cell(row=r, column=i); c.fill = F_ASAISIR; c.font = NOIR
        c.alignment = Alignment(wrap_text=True, vertical='top')
tx.freeze_panes = 'C2'
for col, w in {1: 24, 2: 30, 3: 70, 4: 28, 5: 28, 6: 28}.items():
    tx.column_dimensions[get_column_letter(col)].width = w
tx['H1'] = ("Les textes du site. À remplir quand vous voudrez, le tableau des "
            "cours passe en premier.")
tx['H1'].font = GRIS

# ------------------------------------------------------------------ Clubs
cl = wb.create_sheet('Clubs')
for i, t in enumerate(['Identifiant', 'Club', 'Catégorie', 'Canton',
                       'Code Echino'], start=1):
    c = cl.cell(row=1, column=i, value=t)
    c.font = BLANC; c.fill = F_CLE if i in (1, 5) else F_ENTETE
    c.alignment = Alignment(horizontal='center', vertical='center')
for k, c in enumerate(clubs):
    r = 2 + k
    cl.cell(row=r, column=1, value=c['id']).font = GRIS
    cl.cell(row=r, column=2, value=c['nom']).font = NOIR
    cl.cell(row=r, column=3, value=CAT[c['cat']]).font = NOIR
    cl.cell(row=r, column=4, value=c.get('canton') or '').font = NOIR
    e = cl.cell(row=r, column=5); e.fill = F_ASAISIR; e.font = NOIR
for col, w in {1: 24, 2: 26, 3: 14, 4: 14, 5: 18}.items():
    cl.column_dimensions[get_column_letter(col)].width = w
cl['G1'] = ("Une colonne par club dans l'onglet Cours, dans cet ordre. "
            "Le code Echino sert à rapprocher les deux bases.")
cl['G1'].font = GRIS

# ------------------------------------------------------------------ Mode d'emploi
me = wb.create_sheet("Mode d'emploi", 0)
me.column_dimensions['A'].width = 4
me.column_dimensions['B'].width = 118
contenu = [
    ('titre', 'Cours collectifs et Small Group Training'),
    ('gris', "Document de travail Harmony · pré-rempli avec ce que nous avons "
             "aujourd'hui, à vérifier et à compléter"),
    ('vide', ''),
    ('h2', "Ce qu'on vous demande"),
    ('p', "Onglet « Cours » : un cours par ligne, et pour chaque club, dire "
          "si le cours y est donné et sous quelle forme. C'est la seule chose "
          "urgente. Les onglets « Textes » et « Clubs » peuvent attendre."),
    ('vide', ''),
    ('h2', "Les deux colonnes grises, à ne pas négliger"),
    ('p', "Identifiant · notre clé technique. Elle ne change jamais, même si "
          "le cours est renommé. Ne rien y écrire, ne pas la supprimer : c'est "
          "elle qui permet de recharger ce fichier sans tout recasser."),
    ('p', "Code Echino · à vous. C'est le pont entre le site et Echino. Sans "
          "lui, les deux bases se rapprochent par le nom du cours, et ça casse "
          "au premier accent ou au premier renommage."),
    ('vide', ''),
    ('h2', 'Les autres colonnes'),
    ('p', "Cours · le nom exact, tel qu'il doit apparaître sur le site."),
    ('p', "Statut · Actif, Nouveau, ou À retirer. Ne supprimez pas une ligne : "
          "marquez-la À retirer, on saura quoi faire de l'existant."),
    ('p', "Type · Cours co, SGT, ou « Les deux selon le club » quand la même "
          "pratique est incluse ici et payante ailleurs."),
    ('p', "Objectif principal · obligatoire. C'est lui qui range le cours dans "
          "le catalogue du site, classé par objectif. Un cours n'apparaît que "
          "dans un seul groupe, sinon le visiteur croit à deux cours."),
    ('p', "Objectif secondaire · facultatif. Il s'affiche en second sur la "
          "fiche et il est pris en compte par la recherche."),
    ('p', "Intensité, Format, Durée · un choix chacun. La durée est celle du "
          "créneau type ; si elle varie d'un club à l'autre, dites-le en "
          "Remarques."),
    ('p', "Licence · Les Mills, Hyrox, les deux, ou aucune. Une licence n'est "
          "pas un produit : elle ne s'affiche jamais seule comme nom de cours."),
    ('p', "Places · seulement pour les petits groupes, le nombre de personnes "
          "maximum. C'est ce qui rend la réservation Echino nécessaire."),
    ('p', "Une colonne par club · vide si le cours n'y est pas donné, sinon "
          "Cours co (compris dans l'abonnement) ou SGT (payant, en Extra)."),
    ('p', "Contrôle · calculé, ne rien y écrire. La case devient rouge quand "
          "il manque quelque chose ou quand le Type et les clubs se "
          "contredisent."),
    ('vide', ''),
    ('h2', 'Exemple de ligne'),
    ('p', "HIIT · Type « Les deux selon le club » · Objectif principal « Se "
          "dépenser » · Intensité « Intense » · Format « Salle » · Durée 45 · "
          "Licence « Aucune » · Meyrin, Blandonnet, Genève · Eaux-Vives et "
          "Signy en « Cours co » · Genève · La Praille en « SGT » · les autres "
          "clubs laissés vides."),
    ('vide', ''),
    ('h2', "Deux points d'attention"),
    ('p', "1. Un Small Group Training n'est pas un cours collectif au sens du "
          "prix : il n'est compris dans aucune formule et s'ajoute à "
          "l'abonnement. C'est la distinction la plus importante de ce "
          "document, et la plus facile à rater : un planning ne dit pas si une "
          "séance est incluse ou payante."),
    ('p', "2. Un même nom peut porter les deux formes selon le club. C'est "
          "prévu : une seule ligne, et ce sont les colonnes des clubs qui le "
          "disent."),
    ('vide', ''),
    ('h2', 'Les couleurs'),
    ('p', "Jaune pâle · à remplir. Vert · cours compris dans l'abonnement. "
          "Orange · Small Group Training. Rouge · une incohérence à regarder."),
    ('vide', ''),
    ('gris', "Les lignes déjà remplies viennent des plannings qui nous ont été "
             "transmis. Elles sont à vérifier, pas à prendre pour argent "
             "comptant : c'est justement là que des cours collectifs et des "
             "Small Group Training ont été confondus."),
]
r = 2
for genre, txt in contenu:
    c = me.cell(row=r, column=2, value=txt)
    c.font = {'titre': TITRE, 'h2': H2, 'gris': GRIS}.get(genre, NOIR)
    c.alignment = Alignment(wrap_text=True, vertical='top')
    # Pas de hauteur imposée sur les paragraphes : Excel ajuste tout seul,
    # et une hauteur fixe couperait les plus longs.
    if genre not in ('p', 'gris'):
        me.row_dimensions[r].height = 20
    r += 1

del wb['Sheet']
wb.save(SORTIE)
print('écrit : %s (%d cours, %d lignes vides)' % (SORTIE, len(lignes), VIDES))
