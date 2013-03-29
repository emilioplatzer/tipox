<?php
// ASCII7

require_once "comunes.php";

function lanzar($def){
$def['title']=isset($def['title'])?$def['title']:'men&uacute;';
$def['jss']=$def['jss']?:array();
$def['jss']=array_merge(array(
    '../tercera/modernizr.custom.74701',
    '../tipox/comunes'
    ,'../tipox/app'
),$def['jss']);
echo <<<HTML
<!DOCTYPE html>
<html id="home" lang="es">
<head>
<meta charset=utf-8 />
<title>{$def['title']}</title>
<link rel="stylesheet" href="../tipox/tipox.css" />
</head>
<body>
cargando...
<br>
<img src='../imagenes/cargando.gif' alt='cargando...'>
HTML;
foreach($def['jss'] as $un_js){
    echo "<script src='{$un_js}.js'></script>\n";
}
echo <<<HTML
</body>
</head>
</html>
HTML;
}