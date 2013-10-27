<?php
include "../tipox/launch.php";

$lanzador=new Lanzador(array(
    'title'=>'2×3 llueve',
    'js'=>array(
        "../tipox/tercera/md5_paj.js",
        "2x3llueve.js"
    ),
    'css'=>array(
        "2x3llueve.css"
    ),
    'empezar'=>'cargando'
));

$lanzador->lanzar();

?>