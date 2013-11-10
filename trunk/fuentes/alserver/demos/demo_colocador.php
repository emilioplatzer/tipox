<?php
include "../tipox/launch.php";

$lanzador=new Lanzador(array(
    'title'=>'info sobre tipox',
    'js'=>array(
        '../tipox/comunes.js',
        '../tipox/chromatizador.js',
        '../tipox/aplicacion.js',
        '../tipox/colocador.js',
        '../tipox/colocador.js',
        '../tipox/letras.js',
        'demo_colocador.js'
    ),
    'empezar'=>'cargando'
));

if(basename($_SERVER['PHP_SELF'])==basename(__FILE__)){
    $lanzador->lanzar();
}
?>