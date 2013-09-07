<?php
include "../tipox/launch.php";

$lanzador=new Lanzador(array(
    'title'=>'info sobre tipox',
    'js'=>array(
        '../tipox/compatibilidad.js',
        '../tipox/aplicacion.js',
        '../tipox/colocador.js',
        'demo_colocador.js'
    ),
    'empezar'=>'cargando'
));
$lanzador->lanzar();
?>