<?php
session_start();

require_once "les_paroles.php";

date_default_timezone_set('America/Buenos_Aires');

if(@$_REQUEST['hacer']){
	foreach($_REQUEST as $k=>$v){
		$_SESSION[$_REQUEST['hacer'].'_'.$k]=$v;
	}
	$_SESSION['hacer']=$_REQUEST['hacer'];
	header('Location: index.php');
	die();
}

$hacer=@$_SESSION['hacer']?:'iniciar';
$funcion="hacer_$hacer";

if(!function_exists($funcion)){
	$hacer='iniciar';
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
	<img id=logo src=gina.png style='float:left'>
	<h1 id=titulo>Festejando el cumple de <span id=quien_cumple>Gina</span></h1>
	<div class=limpiar>
HTML;

// echo json_encode($_SESSION);

$funcion();

function hacer_iniciar(){
	echo <<<HTML
		<form method=post>
		<p>Para jugar necesitás ingresar tu nombre</p>
		<p><label for=nombre>nombre </label><input name=nombre id=nombre>
		<p><input type=submit value=ingresar name=hacer>
		</form>
HTML;
}

function hacer_ingresar(){
	$nombre=trim(strtoupper($_SESSION['ingresar_nombre']));
	if($nombre=='GINA'){
		echo "<div class=error>solo Gina se puede llamar Gina</div>";
		hacer_iniciar();
	}else{
        $db=abrir_db();
        $ins=$db->prepare("insert into jugadores (jugador, sessionid) values (:jugador, :sessionid)");
        try{
            $ins->execute(array(':jugador'=>$nombre,':sessionid'=>session_id()));
            echo <<<HTML
            <h1>ingresado el jugador número {$db->lastInsertId()}: {$nombre}</h1>
            <h2>esperando a que inicie el primer juego <img src=..\imagenes\mini_loading.gif></h2>
            <h2><a href='./?hacer=empezar'>INTENTAR AHORA</a></h2>
HTML;
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
    $db = new PDO("mysql:host={$parametros_db['host']};port=xxx;dbname={$parametros_db['database']}", $parametros_db['usuario'], $parametros_db['clave']);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // Set Errorhandling to Exception
    return $db;
}

function hacer_crear_db(){
    $db=abrir_db();
    $sentencias=file_get_contents('creacion_db.sql');
    foreach(explode('/*OTRA*/',$sentencias) as $sentencia){
        try{
            $db->query($sentencia);
            echo "<BR>".$sentencia." <b>ok</b>";
        }catch(Exception $err){
            echo "<BR>".$err->getMessage();
            echo "<BR>".$sentencia;
            echo "<BR>interrumpido";
            return;
        }
    }
    unset($_SESSION['hacer']);
}
?>