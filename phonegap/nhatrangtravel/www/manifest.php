<?php
header('Content-Type: text/cache-manifest');
$filesToCache = array(
    './index.html', 
    '../pages/content_review.html', 
    './js/app.js', 
    '../../js/framework7.min.v1.js',
    './img/yahoo-logo.png', 
    '../../js/framework7.min.js', 
    '../../css/framework7.min.css'
);
?>
CACHE MANIFEST

CACHE:
<?php
// Print files that we need to cache and store hash data
$hashes = '';
foreach($filesToCache as $file) {
    echo $file."\n";
    $hashes.=md5_file($file);
};
?>

NETWORK:
*

# Hash Version: <?=md5($hashes)?>