# Accès à lab.harmony.ch

Le lab passe derrière un identifiant et un mot de passe, avec la
possibilité de donner des accès limités à une partie des pages.

Les fichiers de ce dossier ne sont **pas encore actifs** : ils portent
l'extension `.htaccess` en suffixe, pas en nom. Il manque une information
que seul l'hébergeur donne, le chemin absolu du site sur le serveur. Une
fois ce chemin connu, les fichiers sont déplacés à leur place définitive
et partent avec le déploiement, comme le reste du repo.

## Ce que ça suppose de l'hébergement

Apache ou LiteSpeed, avec les fichiers `.htaccess` autorisés. C'est le cas
de la quasi-totalité des hébergements mutualisés, et le déploiement FTPS
du repo va dans ce sens. **Sur nginx, un `.htaccess` est purement ignoré**,
sans erreur : la protection n'existerait pas, en silence. À vérifier avant
d'annoncer que le lab est protégé.

## 1. Créer le fichier des mots de passe

Sur un Mac, les outils Apache sont déjà là. Dans un terminal :

```bash
htpasswd -B -c ~/htpasswd-lab hugo      # -c crée le fichier
htpasswd -B    ~/htpasswd-lab harmony   # sans -c ensuite, sinon il écrase
htpasswd -B    ~/htpasswd-lab cours
```

`-B` demande du bcrypt, le plus solide des formats qu'Apache accepte. Le
mot de passe est demandé à chaque ligne, il ne s'écrit jamais dans la
commande : il resterait dans l'historique du terminal.

Le fichier obtenu ressemble à ça, un compte par ligne :

```
hugo:$2y$05$T7k....
harmony:$2y$05$9Qm....
cours:$2y$05$aZr....
```

**Ce fichier ne va jamais dans le repo.** Il se dépose en FTP, à la racine
du site, sous le nom `.htpasswd`. Idéalement un cran au-dessus de la
racine web, si l'hébergeur le permet : il est de toute façon interdit
d'accès par une règle du `.htaccess`, mais hors du dossier web il n'est
même pas atteignable.

## 2. Relever le chemin absolu

C'est le chemin du dossier où est déposé `.htpasswd`, vu du serveur, pas
du FTP. Il se lit dans le gestionnaire de fichiers de l'hébergeur, ou avec
`pwd` en SSH. Il ressemble à `/home/clients/xxxxxxxx/sites/lab.harmony.ch`.

Il remplace la ligne `AuthUserFile` de `racine.htaccess`.

> Un chemin faux fait répondre **500 à tout le site**. Ouvrir une page
> juste après la mise en ligne, et garder le FTP ouvert pour pouvoir
> renommer le fichier si besoin.

## 3. Mettre les fichiers en place

| Fichier d'ici | Sa place définitive |
|---|---|
| `racine.htaccess` | `.htaccess` (racine du site) |
| `fitness.htaccess` | `fitness/.htaccess` |
| `cours.htaccess` | `fitness/cours/.htaccess` |
| `cours.htaccess` | `fitness/sport/cours-collectifs/.htaccess` |
| `assets.htaccess` | `fitness/assets/.htaccess` |
| `assets.htaccess` | `fitness/data/.htaccess` |

## Comment marche l'accès limité

La racine dit : `Require user hugo harmony`. Le compte `cours` n'y figure
pas, donc il est refusé partout. Chaque dossier qui doit lui être ouvert
porte un `.htaccess` qui redit la règle en l'incluant. C'est la règle du
dossier le plus proche qui s'applique.

Pour créer un autre accès limité, disons `tarifs` :

1. `htpasswd -B ~/htpasswd-lab tarifs`, puis redéposer le fichier
2. copier `cours.htaccess` dans `fitness/tarifs/`, en ajoutant `tarifs` à
   la liste des comptes
3. ajouter `tarifs` aux deux `.htaccess` des dossiers communs
   (`fitness/assets/` et `fitness/data/`), sans lesquels la page
   s'afficherait sans style ni données

## Quatre limites, à connaître avant de promettre quoi que ce soit

**Restreindre des pages ne restreint pas les données.** Une page de cours
ne s'affiche que si le navigateur peut charger `data/data.js`, et ce
fichier contient tout : les formules, les tarifs, les dix clubs, les
promotions. Un compte limité aux cours peut donc lire les tarifs en
ouvrant ce fichier directement. Si l'enjeu est de cacher des chiffres à
quelqu'un, il faut un autre montage : un second site, avec seulement les
pages et les données concernées.

**Les pages de cours vivent à deux endroits.** Les fiches sont dans
`fitness/cours/`, mais le catalogue qui y mène est dans
`fitness/sport/cours-collectifs/`. Ouvrir `/cours` seul donnerait des
fiches sans porte d'entrée.

**La navigation va buter.** Le menu d'une page de cours pointe vers
Tarifs, Clubs et Sport. Un compte limité qui clique dessus tombe sur la
page `401.html`, qui le lui explique. C'est acceptable pour un lab, ça ne
le serait pas pour un site de production.

**L'authentification Basic n'est pas un système de comptes.** Les
identifiants se partagent, ils circulent à chaque requête (chiffrés, le
site étant en HTTPS), il n'y a pas de bouton de déconnexion et aucune
trace de qui a consulté quoi. C'est une barrière contre les curieux et
les moteurs de recherche, pas contre quelqu'un de déterminé.
