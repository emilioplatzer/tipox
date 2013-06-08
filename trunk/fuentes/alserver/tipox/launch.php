<?php
// ASCII7
date_default_timezone_set("America/Buenos_Aires"); 

require_once "comunes.php";

function lanzar($def){
$versionManifiestoOffline=@$def['version_offline']?:'';
$offline=!!@$def['offline'];
$def['title']=isset($def['title'])?$def['title']:'men&uacute;';
$def['jss']=@$def['jss']?:array();
$def['css']=@$def['css']?:array();
$def['para_ipad']=@$def['para_ipad']?:false;
$def['jss']=array_merge(array(
    '../tercera/modernizr.custom.74701',
    '../tipox/comunes',
    '../tipox/app',
    '../tipox/grilla'
),$def['jss']);
$def['css']=array_merge(array(
    '../tipox/tipox.css',
    '../tipox/grilla.css'
),$def['css']);
$def['links']=@$def['links']?:array();
$objetosACachear=array_merge(
    array(
        '.',
        '../imagenes/error.png',
        '../imagenes/reloj.gif',
        '../imagenes/cargando.gif',
        '../tipox/tabla_prueba_tabla_comun.js'
    ),
    $def['css'],
    array_map(function($file){return $file.".js";},$def['jss'])
);
if(isset($def['app_icon'])){
    $objetosACachear[]=$def['app_icon'];
    $def['links']=array_merge(array(
        array('rel'=>"apple-touch-icon", "href"=>$def['app_icon']),
        array('rel'=>"icon", "href"=>$def['app_icon']),
    ),$def['links']);
}
if(isset($_REQUEST['generar'])){
    generarManifiesto(array_merge($objetosACachear,$def['objetos_offline']),$versionManifiestoOffline);
    echo "listo ($versionManifiestoOffline): ";
    if($offline){
        echo "el sistema est&aacute; listo para trabajar offline";
    }else{
        echo "generado el manifiesto pero. <b>El sistema no est&aacute; offline</b>";
    }
    die();
}
if($offline){
    $htmlManifiesto="manifest='manifiesto.manifest'";
}else{
    $htmlManifiesto='';
}
echo <<<HTML
<!DOCTYPE html>
<html id="home" lang="es" {$htmlManifiesto}>
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
foreach($def['links'] as $un_link){
    echo "<link rel=\"{$un_link['rel']}\" href=\"{$un_link['href']}\">\n";
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

function generarManifiesto($archivos,$versionManifiestoOffline){
    $ahora=date(DATE_ATOM);
    $archivoMasNuevo="0";
    $noExisten="";
    foreach($archivos as $nombre_archivo){
        if(file_exists($nombre_archivo)){
            $fechaEste=date(DATE_ATOM, filemtime($nombre_archivo=='.'?'launch.php':$nombre_archivo));
            if($fechaEste>$archivoMasNuevo){
                $archivoMasNuevo=$fechaEste;
            }
        }else{
            $noExisten.="\n# ne: {$nombre_archivo}";
        }
    }
    $listaArchivos=implode("\n",$archivos);
    $contenidoNuevo=<<<MANIFEST
CACHE MANIFEST
# {$versionManifiestoOffline}
# {$archivoMasNuevo}
$listaArchivos
$noExisten

NETWORK:
app.php

MANIFEST;
    $contenidoViejo=file_get_contents('manifiesto.manifest');
    if($contenidoViejo!=$contenidoNuevo){
        file_put_contents('manifiesto.manifest',$contenidoNuevo);
    }
}