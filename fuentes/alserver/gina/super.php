<?php
session_start();

include "../tipox/launch.php";

$lanzador=new Lanzador(array(
    'title'=>'Juegos del cumpleaños de Gina',
    'js'=>array(
        '../tipox/comunes.js',
        '../tipox/aplicacion.js',
        '../tipox/objeto_circular.js',
        '../tipox/colocador.js',
        (@$_SESSION['super']?'super.js':'login_basico.js')
    ),
    'css'=>array(
        'gina_bb.css',
        'gina.css',
        'super.css',
    ),
    'empezar'=>'cargando'
));

$lanzador->lanzar();

?>