<?php
// ASCII7

require_once "comunes.php";

function lanzar($def){
$def['title']=isset($def['title'])?$def['title']:'men&uacute;';
$def['jss']=@$def['jss']?:array();
$def['css']=@$def['css']?:array();
$def['para_ipad']=@$def['para_ipad']?:false;
$def['jss']=array_merge(array(
    '../tercera/modernizr.custom.74701',
    '../tipox/comunes'
    ,'../tipox/app'
    ,'../tipox/grilla'
),$def['jss']);
$def['css']=array_merge(array(
    '../tipox/tipox.css',
    '../tipox/grilla.css'
),$def['css']);
echo <<<HTML
<!DOCTYPE html>
<html id="home" lang="es">
<head>
<meta charset=utf-8 />
<title>{$def['title']}</title>
HTML;
if($def['para_ipad']){
    echo <<<HTML
    <meta name="format-detection" content="telephone=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name='viewport' content='user-scalable=no, width=768'>
HTML;
}
foreach($def['css'] as $un_css){
    echo "<link rel=stylesheet href='{$un_css}' />\n";
}
echo <<<HTML
</head>
<body>
cargando...
<br>
<div style='padding:10px'>
<img src='../imagenes/reloj.gif' alt='cargando...' style='text-align:center'>
</div>
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