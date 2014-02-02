<?php
/* Por $Author: emilioplatzer@gmail.com $ Revisión $Revision: 131 $ del $Date: 2013-11-10 17:39:54 -0300 (dom 10 de nov de 2013) $ */
include "../tipox/launch.php";

$lanzador=new Lanzador(array(
    'title'=>'dónde te dejé',
    'js'=>array(
        '../tipox/comunes.js',
        '../tipox/controlador.js',
        '../terceros/decimal.js',
        '../tipox/acumuladores.js',
        '../tipox/chromatizador.js',
        '../tipox/aplicacion.js',
        // '../tipox/objeto_circular.js',
        '../tipox/grilla2.js',
        'dondetedeje.js'
    ),
    'css'=>array(
        '../tipox/tipox.css',
        '../tipox/grilla2.css',
        'dondetedeje.css',
    ),
    'empezar'=>'cargando'
));

$lanzador->lanzar();
?>