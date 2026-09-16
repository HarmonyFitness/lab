<?php
/**
 * Installe la protection par mot de passe de lab.harmony.ch.
 *
 * Pourquoi ce fichier : Apache exige un chemin ABSOLU pour AuthUserFile,
 * et ce chemin n'est connu que du serveur. PHP le connaît, lui. Ce script
 * écrit donc les .htaccess avec le bon chemin, puis se supprime.
 *
 * À ouvrir une fois dans le navigateur :
 *   https://lab.harmony.ch/installer-acces-2607bb07086789cd.php?go=2607bb07086789cd
 *
 * Il ne touche à rien d'autre : il n'écrit que des .htaccess dont le
 * contenu est figé ci-dessous, et il ne lit aucun mot de passe.
 */

header('Content-Type: text/plain; charset=utf-8');
$jeton = '2607bb07086789cd';

if (!isset($_GET['go']) || $_GET['go'] !== $jeton) {
    http_response_code(403);
    echo "Il manque le jeton dans l'adresse.\n";
    echo "Ouvrez : " . basename(__FILE__) . "?go=" . $jeton . "\n";
    exit;
}

$racine = __DIR__;
$motsDePasse = $racine . '/.htpasswd';

echo "Racine du site vue par le serveur :\n  " . $racine . "\n\n";

if (!is_readable($motsDePasse)) {
    http_response_code(500);
    echo "ARRÊT : le fichier .htpasswd est introuvable ou illisible ici.\n";
    echo "Rien n'a été écrit. Vérifiez qu'il a bien été déployé.\n";
    exit;
}

$racineHt = <<<HT
# Écrit par l'installeur, ne pas modifier le chemin à la main.
# Tout le lab derrière un mot de passe.

AuthType Basic
AuthName "Harmony Lab"
AuthUserFile {$motsDePasse}

# Le compte qui voit tout le lab.
Require user marketing

# Le fichier des mots de passe ne se sert jamais.
<Files ".htpasswd">
  Require all denied
</Files>

# Deux fichiers restent lisibles sans compte : la page d'explication, qui
# sinon redemanderait elle-même un mot de passe, et robots.txt, qui doit
# continuer de dire aux moteurs de ne rien indexer.
<Files "401.html">
  Require all granted
</Files>
<Files "robots.txt">
  Require all granted
</Files>

ErrorDocument 401 /401.html

HT;

$elargi = <<<HT
# Écrit par l'installeur.
# Le compte « sport » échoue à la règle de la racine partout ailleurs :
# c'est ce qui le limite. Ici, il passe. AuthType, AuthName et AuthUserFile
# sont hérités de la racine, on ne les répète pas.

Require user marketing sport

HT;

$favicon = <<<HT
# Écrit par l'installeur.
# Le dossier reste protégé. Seule l'icône sort, pour qu'un compte limité
# ne se voie pas redemander un mot de passe à cause d'elle.

<Files "favicon.png">
  Require user marketing sport
</Files>

HT;

$aEcrire = array(
    ''                       => $racineHt,
    'fitness'                => $favicon,
    'fitness/sport'          => $elargi,
    'fitness/cours'          => $elargi,
    'fitness/assets'         => $elargi,
    'fitness/data'           => $elargi,
);

$erreurs = array();
foreach ($aEcrire as $dossier => $contenu) {
    $chemin = $racine . ($dossier === '' ? '' : '/' . $dossier);
    if (!is_dir($chemin)) { $erreurs[] = "dossier absent : " . $chemin; continue; }
    $fichier = $chemin . '/.htaccess';
    if (file_put_contents($fichier, $contenu) === false) {
        $erreurs[] = "écriture refusée : " . $fichier;
    } else {
        echo "écrit : " . ($dossier === '' ? '.htaccess' : $dossier . '/.htaccess') . "\n";
    }
}

echo "\n";
if ($erreurs) {
    http_response_code(500);
    echo "PROBLÈMES :\n";
    foreach ($erreurs as $e) { echo "  - " . $e . "\n"; }
    echo "\nLe script ne s'est pas supprimé : corrigez et relancez.\n";
    exit;
}

echo "La protection est en place.\n";
echo "  marketing : tout le lab\n";
echo "  sport     : /fitness/sport, ses sous-pages et /fitness/cours\n\n";
echo "Ligne à transmettre pour que la configuration soit versionnée :\n";
echo "  AuthUserFile " . $motsDePasse . "\n\n";

if (@unlink(__FILE__)) {
    echo "Ce script s'est supprimé.\n";
} else {
    echo "ATTENTION : suppression impossible. Supprimez " . basename(__FILE__) . " en FTP.\n";
}
