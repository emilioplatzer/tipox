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
        '../tipox/enviador.js',
        (@$_SESSION['super']?'podio.js':'login_basico.js')
    ),
    'css'=>array(
        'gina_bb.css',
        'gina.css',
        'podio.css',
    ),
    'empezar'=>'cargando'
));

$lanzador->lanzar();

?>