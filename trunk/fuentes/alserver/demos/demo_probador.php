<?php
include "../tipox/launch.php";

$lanzador=new Lanzador(array(
    'title'=>'info sobre tipox',
    'js'=>array(
        '../tipox/comunes.js',
        '../tipox/chromatizador.js',
        '../tipox/aplicacion.js',
        '../tipox/colocador.js',
        '../tipox/probador.js',
        'demo_probador.js'
    ),
    'css'=>array(
        '../tipox/probador.css',
    ),
    'empezar'=>'cargando'
));
$lanzador->lanzar();
?>