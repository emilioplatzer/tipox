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

$lanzador->lanzar();

?>