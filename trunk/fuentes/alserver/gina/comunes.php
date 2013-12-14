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

function insertar($db, $tabla, $campos, $valores, $completar_con_null=false){
    if($completar_con_null && count($valores)<count($campos)){
        while(count($valores)<count($campos)){
            $valores[]=null;
        }
    }
    $dos_puntos=array_map(function($nombre){ return ":$nombre"; },$campos);
    $ins=$db->prepare("insert into $tabla (".
        implode(', ',$campos).") values (".
        implode(', ',$dos_puntos).")"
    );
    return $ins->execute(array_combine($dos_puntos,$valores));
}


function datos_actuales($con_jugagdor_actual=true){
    $db=abrir_db();
    if($con_jugagdor_actual){
        $where=", sessionid s LEFT JOIN jugadores u ON s.terminal=u.terminal WHERE s.terminal=:terminal";
        $campos_adic=", s.terminal, u.jugador, u.numero, (select p.jugada from jugadas p where p.juego=c.juego and p.jugador=u.jugador) as jugada";
        $parametros=array(':terminal'=>@$_SESSION['terminal']);
    }else{
        $where="";
        $campos_adic="";
        $parametros=array();
    }
    $cursor=$db->prepare(<<<SQL
        SELECT c.juego, c.estado, j.imagen, j.descripcion, imagenok, correcta, descripcionrta $campos_adic
          FROM control c LEFT JOIN juegos j ON c.juego=j.juego
               $where
SQL
    );
    $cursor->execute($parametros);
    $datos=$cursor->fetchObject();
    return $datos;
}

function sanitizar(){
}

function limpiar_sesion(){
    foreach($_SESSION as $k=>$v){
        unset($_SESSION[$k]);
    }
}

function loguear($hasta_cuando,$que){
    file_put_contents('log.txt',$que."\n",FILE_APPEND);
}
?>