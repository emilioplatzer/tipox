<?php
include "demo_probador.php";

$lanzador->params['js'][]='../tipox/colocadorProbador.js';
$lanzador->params['js'][]='demo_probador_con_colocador.js';

$lanzador->lanzar();
?>