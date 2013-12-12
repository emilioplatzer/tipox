<?php
session_start();

date_default_timezone_set('America/Buenos_Aires');

require_once "les_paroles.php";

if(@$_REQUEST['hacer']){
    $hacer=$_REQUEST['hacer'];
    $funcion="hacer_$hacer";
    if(!function_exists($funcion)){
        echo "<h1> 404 no existe la función";
    }else{
        $funcion();
        header('Location: ./');
        die();
    }
}

echo <<<HTML
<!doctype html>
<html><head><title>Gina cumple 12</title>
<meta charset="utf-8">
<link rel=stylesheet href=gina.css type="text/css">
<link rel="icon" type="image/png" href="gina.png" />
</head>
<body>
HTML;

function poner_logo(){
echo <<<HTML
	<img id=logo src=imagenes/gina.jpg class=ilustracion_principal>
	<h1 id=titulo>Festejando el cumple de <span id=quien_cumple>Gina</span></h1>
	<div class=limpiar></div>
HTML;
}

if(!isset($_SESSION['terminal'])){
    iniciar_terminal();
}

function iniciar_terminal(){
    $db=abrir_db();
    if($db){
        try{
            insertar($db,"sessionid", array('sessionid', 'user_agent', 'ip'), 
                array(session_id(), $_SERVER['HTTP_USER_AGENT'], $_SERVER['REMOTE_ADDR'])
            );
            $_SESSION['terminal']=$db->lastInsertId();
        }catch(Exception $err){
            if($err->getCode()!='42S02'){ // no existe la tabla
                throw $err;
            }
        }
    }
}

function datos_actuales(){
    $db=abrir_db();
    $sql_datos=$db->prepare(<<<SQL
        SELECT c.juego, c.estado, j.imagen, j.descripcion, 
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

function mostrar_pantalla(){
    $datos=datos_actuales();
    if(!$datos || !$datos->jugador){
        mostrar_iniciar();
    }else{
        mostrar_opciones($datos);
    }
}

function mostrar_iniciar(){
    poner_logo();
	echo <<<HTML
		<form method=post>
		<p>Para jugar necesitás ingresar tu nombre</p>
		<p><label for=nombre>nombre </label><input name=nombre id=nombre>
		<p><input type=submit value=ingresar name=hacer> <small>(t={$_SESSION['terminal']})</small>
		</form>
HTML;
}

function sanitizar(){
}

function mostrar_opciones($datos){
    $db=abrir_db();
    sanitizar($datos);
    $sql_opciones=$db->prepare(<<<SQL
        select o.juego, o.opcion, o.texto, j.juego
          from opciones o LEFT JOIN jugadas j ON o.juego=j.juego AND o.opcion=j.jugada AND j.jugador=:jugador
          where o.juego=:juego
SQL
    );
    $sql_opciones->execute(array(':juego'=>$datos->juego, ':jugador'=>$datos->jugador));
    $opciones=$sql_opciones->fetchAll(PDO::FETCH_OBJ);
    sanitizar($opciones);
    if($datos->estado==0){
            echo <<<HTML
            <h1>ingresado el jugador número {$datos->numero}: {$datos->jugador}</h1>
HTML;
        $jugando=false;
    }else{
        echo <<<HTML
            <img src='imagenes/m_{$datos->imagen}' class=ilustracion_principal>
            <div class=pregunta><span class=numero_pregunta>{$datos->juego}:</span> {$datos->descripcion}</div>
            <div class=limpiar></div>
HTML;
        $jugando=$datos->estado==1 && !$datos->jugada;
        foreach($opciones as $k=>$v){
            echo "<div class=opcion>\n";
            if($jugando){
                echo "<a href='./?hacer=jugar&juego={$datos->juego}&jugada={$v->opcion}'>\n";
            }else if($datos->jugada==$v->opcion){
                echo "<span class=elegido>";
            }
            echo "<span class=numero_opcion>{$v->opcion}:</span> {$v->texto}";
            if($jugando){
                echo "</a>\n";
            }else if($datos->jugada==$v->opcion){
                echo "</span>";
            }
            echo "</div>\n";
        }
    }
    echo "<p class=error>{$_SESSION['error']}</p>";
    if(!$jugando){
        mostrar_esperando();
    }
}

function mostrar_esperando(){
    echo <<<HTML
        <h2>esperando a que inicie el juego <img src=..\imagenes\mini_loading.gif></h2>
        <h2><a href='./'>INTENTAR AHORA</a></h2>
HTML;
}

function hacer_jugar(){
    $_SESSION['error']="";
    $datos=datos_actuales();
    $db=abrir_db();
    try{
        if($datos->estado==1 && $datos->juego==$_REQUEST['juego']){
            insertar($db, 'jugadas', array('juego', 'jugador', 'jugada'), array($datos->juego, $datos->jugador, $_REQUEST['jugada']));
        }else{
            $_SESSION['error']="fuera de tiempo";
        }
    }catch(Exception $err){
        $_SESSION['error']="{$err->getCode()}: {$err->getMessage()}";
    }
}

function hacer_ingresar(){
    $nombre=trim(strtoupper($_REQUEST['nombre']));
    $_SESSION['error']="";
    $db=abrir_db();
    try{
        insertar($db, 'jugadores',  array('jugador', 'terminal'), 
            array(':jugador'=>$nombre,':terminal'=>$_SESSION['terminal'])
        );
    }catch(Exception $err){
        if($err->getCode()==23000){
            $_SESSION['error']='El nombre ya fue elegido';
        }else{
            $_SESSION['error']="{$err->getCode()}: {$err->getMessage()}";
        }
    }
}

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

function hacer_crear_db(){
    $db=abrir_db();
    try{
        $sentencias=file_get_contents('creacion_db.sql');
        foreach(explode('/*OTRA*/',$sentencias) as $sentencia){
            echo "<BR>".$sentencia." <b>ok</b>";
            $db->query($sentencia);
        }
        $datos=file_get_contents('preguntas.txt');
        foreach(explode("\n---",$datos) as $pregunta){
            if(trim($pregunta)){
                $lineas=explode("\n",$pregunta);
                $linea_pregunta=trim(array_shift($lineas));
                $campos_pregunta=explode('|',$linea_pregunta);
                echo "<BR>".$linea_pregunta[0]." <b>ok</b>";
                insertar($db, 'juegos', array('juego','imagen','descripcion'), $campos_pregunta);
                foreach($lineas as $linea_opcion){
                    if(trim($linea_opcion)){
                        $campos_opciones=explode('|',$linea_opcion);
                        echo "<BR>".$campos_opciones[0]." <b>ok</b>";
                        array_unshift($campos_opciones,$campos_pregunta[0]);
                        insertar($db, 'opciones', array('juego','opcion','texto'), $campos_opciones);
                    }
                }
            }
        }
    }catch(Exception $err){
        echo "<BR><B>".$err->getMessage();
        echo "<BR>interrumpido";
        return;
    }
    foreach($_SESSION as $k=>$v){
        unset($_SESSION[$k]);
    }
    mostrar_opciones(2,false);
}

mostrar_pantalla();

echo "<p><small><pre>terminal={$_SESSION['terminal']}</pre></small></p>";

?>