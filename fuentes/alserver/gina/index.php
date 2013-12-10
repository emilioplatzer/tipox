<?php
session_start();

date_default_timezone_set('America/Buenos_Aires');

require_once "les_paroles.php";

if(@$_REQUEST['hacer']){
	foreach($_REQUEST as $k=>$v){
		$_SESSION[$_REQUEST['hacer'].'_'.$k]=$v;
	}
	$_SESSION['hacer']=$_REQUEST['hacer'];
	header('Location: ./');
	die();
}

$hacer=@$_SESSION['hacer']?:'iniciar';
$funcion="hacer_$hacer";

if(!function_exists($funcion)){
    if(isset($_SESSION['jugador'])){
        $hacer='esperando';
    }else{
        $hacer='iniciar';
    }
    $funcion="hacer_$hacer";
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
	<img id=logo src=gina.png class=ilustracion_principal>
	<h1 id=titulo>Festejando el cumple de <span id=quien_cumple>Gina</span></h1>
	<div class=limpiar></div>
HTML;
}
// echo json_encode($_SESSION);

if(!isset($_SESSION['terminal'])){
    iniciar_terminal();
}

function iniciar_terminal(){
    $db=abrir_db();
    if($db){
        try{
            $ins=$db->prepare("insert into sessionid (sessionid) values (:sessionid)");
            $ins->execute(array(':sessionid'=>session_id()));
            $_SESSION['terminal']=$db->lastInsertId();
        }catch(Exception $err){
            if($err->getCode()!='42S02'){ // no existe la tabla
                throw $err;
            }
        }
    }
}

$funcion();

echo "<p><small><pre>hacer={$_SESSION['hacer']}</pre></small></p>";

function hacer_iniciar(){
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

function mostrar_opciones($juego){
    $db=abrir_db();
    $ins=$db->prepare("select * from juegos where juego=:juego");
    $ins->execute(array(':juego'=>$juego));
    $juegos=$ins->fetchAll(PDO::FETCH_OBJ);
    $juegos=$juegos[0];
    sanitizar($juego);
    $ins=$db->prepare("select * from opciones where juego=:juego");
    $ins->execute(array(':juego'=>$juego));
    $opciones=$ins->fetchAll(PDO::FETCH_OBJ);
    sanitizar($opciones);
    echo <<<HTML
        <img src='imagenes/{$juegos->imagen}' class=ilustracion_principal>
        <div class=pregunta><span class=numero_pregunta>{$juegos->juego}</span> {$juegos->descripcion}</div>
        <div class=limpiar></div>
HTML;
    foreach($opciones as $k=>$v){
        echo <<<HTML
            <div class=opcion>
                <a href='./?hacer=jugar&juego={$juego}&opcion={$v->opcion}'>
                    <span class=numero_opcion>{$v->opcion}</span> 
                    {$v->texto}
                </a>
            </div>
HTML;
    }
}

function juego_actual(){
    $db=abrir_db();
    $ins=$db->prepare("select juego from control where activo=1");
    $ins->execute();
    $datos=$ins->fetch(PDO::FETCH_OBJ);
    return $datos->juego;
}

function hacer_jugando($juego=null){
    $juego=$juego?:juego_actual();
    mostrar_opciones($juego);
}

function hacer_esperando($primera_vez=false){
    if(!$primera_vez){
        if($juego=juego_actual()){ //!QAcod if=
            $_SESSION['hacer']='jugando';
            mostrar_opciones($juego);
            return;
        }else{
            poner_logo();
            echo <<<HTML
            <h2>{$_SESSION['jugador']}. Puntos={$_SESSION['puntos']} <small> (t={$_SESSION['terminal']})</small></h2>
HTML;
        }
    }
    echo <<<HTML
        <h2>esperando a que inicie el juego <img src=..\imagenes\mini_loading.gif></h2>
        <h2><a href='./?hacer=empezar'>INTENTAR AHORA</a></h2>
HTML;
}

function hacer_ingresar(){
    poner_logo();
	$nombre=trim(strtoupper($_SESSION['ingresar_nombre']));
	if($nombre=='GINA'){
		echo "<div class=error>solo Gina se puede llamar Gina</div>";
		hacer_iniciar();
	}else{
        $db=abrir_db();
        $ins=$db->prepare("insert into jugadores (jugador, terminal) values (:jugador, :terminal)");
        try{
            $ins->execute(array(':jugador'=>$nombre,':terminal'=>$_SESSION['terminal']));
            $_SESSION['jugador']=$nombre;
            $_SESSION['puntos']=0;
            $_SESSION['hacer']='esperar';
            echo <<<HTML
            <h1>ingresado el jugador número {$db->lastInsertId()}: {$nombre}</h1>
HTML;
            hacer_esperando(true);
        }catch(Exception $err){
            echo <<<HTML
            <h1>el nombre {$nombre} ya fue elegido por otra persona</h1>
HTML;
            if($err->getCode()!=23000){
                echo <<<HTML
                <p>{$err->getCode()}: {$err->getMessage()} 
HTML;
            }
            hacer_iniciar();
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
    unset($_SESSION['hacer']);
    foreach($_SESSION as $k=>$v){
        unset($_SESSION[$k]);
    }
    mostrar_opciones(2);
}

?>