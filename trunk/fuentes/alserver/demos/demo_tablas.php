<?php
include "demo_probador.php";

$lanzador->params['title']='Demo para poner importe en letras';
$lanzador->params['css'][]='../tipox/tipox.css';
$lanzador->params['js'][]='../tipox/colocadorProbador.js';
$lanzador->params['js'][]='../tipox/letras.js';
$lanzador->params['js'][]='demo_probador_con_colocador.js';
$lanzador->params['js'][]='demo_tablas.js';

$lanzador->lanzar();
