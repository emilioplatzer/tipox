<?php
/* Por $Author$ Revisión $Revision$ del $Date$ */
include "demo_probador.php";

$lanzador->params['title']='Demo para poner importe en letras';
$lanzador->params['css'][]='../tipox/tipox.css';
$lanzador->params['js'][]='../tipox/colocadorProbador.js';
$lanzador->params['js'][]='../tipox/letras.js';
$lanzador->params['js'][]='../terceros/md5_paj.js';
$lanzador->params['js'][]='demo_probador_con_colocador.js';
$lanzador->params['js'][]='demo_tablas.js';

$lanzador->params['css'][]='demo_tablas.css';

$lanzador->lanzar();
