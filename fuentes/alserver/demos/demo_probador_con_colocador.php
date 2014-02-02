<?php
/* Por $Author$ Revisión $Revision$ del $Date$ */
include "demo_probador.php";

$lanzador->params['css'][]='../tipox/tipox.css';
$lanzador->params['js'][]='../tipox/colocadorProbador.js';
$lanzador->params['js'][]='../tipox/colocador_pr.js';
$lanzador->params['js'][]='../terceros/decimal.js';
$lanzador->params['js'][]='../tipox/acumuladores.js';
$lanzador->params['js'][]='../tipox/acumuladores_pr.js';
$lanzador->params['js'][]='demo_probador_con_colocador.js';

$lanzador->lanzar();
?>