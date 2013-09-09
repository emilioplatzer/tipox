<?php
include "../tipox/launch.php";

$lanzador=new Lanzador(array(
    'title'=>'info sobre tipox',
    'js'=>array(
        '../tipox/chromatizador.js',
        '../tipox/aplicacion.js',
        '../tipox/colocador.js',
        'demo_colocador.js'
    ),
    'empezar'=>'cargando'
));
$lanzador->lanzar();
?>