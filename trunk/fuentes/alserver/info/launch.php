<?php
include "../tipox/launch.php";

$lanzador=new Lanzador(array(
    'title'=>'info sobre tipox',
    'js'=>array('info.js'),
));
$lanzador->lanzar();
?>