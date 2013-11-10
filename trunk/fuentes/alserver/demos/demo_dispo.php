<?php
/* Por $Author$ Revisión $Revision: 23 $ del $Date$ */
include "../tipox/launch.php";

$lanzador=new Lanzador(array(
    'title'=>'demo dispo',
    'js'=>array(
        '../tipox/comunes.js',
        '../tipox/chromatizador.js',
        '../tipox/aplicacion.js',
        '../tipox/colocador.js',
        "demo_dispo.js"
    ),
    'css'=>array(
        "demo_dispo.css"
    ),
    'empezar'=>'cargando'
));

switch(@$_REQUEST['a']){
case 1:
    break;
case 2:
    $lanzador->params['meta'][]=array('name'=>'viewport', 'content'=>'user-scalable=yes, initial-scale=1.0, width=device-width');
    break;
case 3:
    $lanzador->params['meta'][]=array('name'=>'viewport', 'content'=>'user-scalable=yes, width=768');
    break;
default:
    $lanzador->params['meta'][]=array('name'=>'viewport', 'content'=>'user-scalable=no');
}

$lanzador->lanzar();

?>