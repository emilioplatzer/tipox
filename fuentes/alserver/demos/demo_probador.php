<?php
include "../tipox/launch.php";

$lanzador=new Lanzador(array(
    'title'=>'info sobre tipox',
    'js'=>array(
        '../tipox/compatibilidad.js',
        '../tipox/aplicacion.js',
        '../tipox/colocador.js',
        '../tipox/tdd.js',
        'demo_tdd.js'
    ),
    'empezar'=>'cargando'
));
$lanzador->lanzar();
?>