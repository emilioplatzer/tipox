<?php

function abrir_db(){
    global $parametros_db;
    global $db;
    if(!$db){
        $db = new PDO(
            "mysql:host={$parametros_db['host']};port=xxx;dbname={$parametros_db['database']};charset=utf8", 
            $parametros_db['usuario'], 
            $parametros_db['clave'],
            array(
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"
            )
        );
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // Set Errorhandling to Exception
        $db->exec("SET NAMES 'utf8';");
    }
    return $db;
}

function insertar($db, $tabla, $campos, $valores){
    $dos_puntos=array_map(function($nombre){ return ":$nombre"; },$campos);
    $ins=$db->prepare("insert into $tabla (".
        implode(', ',$campos).") values (".
        implode(', ',$dos_puntos).")"
    );
    return $ins->execute(array_combine($dos_puntos,$valores));
}


function datos_actuales(){
    $db=abrir_db();
    $sql_datos=$db->prepare(<<<SQL
        SELECT c.juego, c.estado, j.imagen, j.descripcion, imagenok, correcta,
               s.terminal, u.jugador, u.numero, 
               (select p.jugada from jugadas p where p.juego=c.juego and p.jugador=u.jugador) as jugada
          FROM control c LEFT JOIN juegos j ON c.juego=j.juego,
               sessionid s LEFT JOIN jugadores u ON s.terminal=u.terminal
          WHERE s.terminal=:terminal
SQL
    );
    $sql_datos->execute(array(':terminal'=>$_SESSION['terminal']));
    $datos=$sql_datos->fetchObject();
    return $datos;
}

function sanitizar(){
}

?>