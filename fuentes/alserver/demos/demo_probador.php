<?php
/* Por $Author$ Revisión $Revision$ del $Date$ */
include "../tipox/launch.php";

$lanzador=new Lanzador(array(
    'title'=>'info sobre tipox',
    'js'=>array(
        '../tipox/comunes.js',
        '../tipox/chromatizador.js',
        '../tipox/aplicacion.js',
        '../tipox/objeto_circular.js',
        '../tipox/colocador.js',
        '../tipox/probador.js',
        'demo_probador.js'
    ),
    'css'=>array(
        '../tipox/probador.css',
    ),
    'empezar'=>'cargando'
));

if(basename($_SERVER['PHP_SELF'])==basename(__FILE__)){
    $lanzador->lanzar();
}
?>