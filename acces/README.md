# Accès à lab.harmony.ch

Le lab est protégé par identifiant et mot de passe, avec un accès limité
possible à une partie des pages.

| Compte | Ce qu'il voit |
|---|---|
| `marketing` | tout le lab |
| `sport` | `/fitness/sport` et ses sous-pages, `/fitness/cours`, et les fichiers communs |

Les mots de passe sont dans `.htpasswd` à la racine du repo, hachés en
bcrypt. Apache 2.4 et LiteSpeed lisent ce format nativement.

## En service depuis le 2026-09-16

Les six `.htaccess` sont dans le repo, à leur place, et repartent à chaque
déploiement comme le reste du site.

Apache exige un chemin **absolu** pour désigner le fichier des mots de
passe, et ce chemin n'était connu que du serveur. Un installeur PHP, ouvert
une fois puis auto-supprimé, l'a relevé et écrit les fichiers. Le chemin
retenu, visible dans le `.htaccess` de la racine :

```
/home/clients/…/sites/lab.harmony.ch/.htpasswd
```

> Si le site déménage ou est renommé, ce chemin devient faux et **tout le
> site répond 500**. C'est la première chose à regarder.

## Ce que ça suppose de l'hébergement

Apache ou LiteSpeed, avec les `.htaccess` autorisés, et PHP pour
l'installeur. C'est le cas de la quasi-totalité des hébergements
mutualisés. **Sur nginx, un `.htaccess` est ignoré sans erreur** : la
protection n'existerait pas, en silence. Vérifier en navigation privée
qu'une page demande bien un mot de passe.

## Comment marche l'accès limité

La racine dit `Require user marketing`. Le compte `sport` n'y figure pas,
donc il est refusé partout. Chaque dossier qui doit lui être ouvert porte
un `.htaccess` qui redit la règle en l'incluant : c'est la règle du
dossier le plus proche qui s'applique.

Les six fichiers écrits :

| Dossier | Ce qu'il fait |
|---|---|
| racine | demande un compte, n'accepte que `marketing` |
| `fitness/` | laisse passer l'icône du site |
| `fitness/sport/` | ouvre à `sport` |
| `fitness/cours/` | ouvre à `sport` |
| `fitness/assets/` | ouvre à `sport` (CSS et scripts) |
| `fitness/data/` | ouvre à `sport` (les données) |

Pour ajouter un compte : `htpasswd -B .htpasswd nouveau` sur un Mac, puis
ajouter son nom dans les `.htaccess` concernés.

## Pourquoi `/fitness/cours` est ouvert au compte sport

La demande portait sur `/sport`. Mais le catalogue de
`/fitness/sport/cours-collectifs/` renvoie vers les fiches de cours, qui
sont dans `/fitness/cours/`. Sans ce dossier, chaque clic sur un cours
tomberait sur un refus, et l'accès ne servirait pas à grand-chose. C'est
une ligne à retirer si ce n'est pas voulu.

## Trois limites, à connaître avant de promettre quoi que ce soit

**Restreindre des pages ne restreint pas les données.** Une page ne
s'affiche que si le navigateur charge `data/data.js`, et ce fichier
contient tout : formules, tarifs, les dix clubs, les promotions. Le compte
`sport` peut donc lire les tarifs en ouvrant ce fichier directement. Si
l'enjeu est de cacher des chiffres à quelqu'un, il faut un autre montage :
un second site, avec seulement les pages et les données concernées.

**La navigation va buter.** Le menu pointe vers Tarifs et Clubs. Le compte
`sport` qui clique dessus tombe sur `401.html`, qui le lui explique.
Acceptable pour un lab, pas pour un site de production.

**Basic Auth n'est pas un système de comptes.** Les identifiants se
partagent, ils circulent à chaque requête (chiffrés, le site étant en
HTTPS), il n'y a pas de bouton de déconnexion et aucune trace de qui a
consulté quoi. C'est une barrière contre les curieux et les moteurs de
recherche, pas contre quelqu'un de déterminé.
