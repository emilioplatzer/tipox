<?php
session_start();

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
		echo <<<HTML
		<h1>ingresado el jugador número 2: {$nombre}</h1>
		<h2>esperando a que inicie el primer juego <img src=..\imagenes\mini_loading.gif></h2>
HTML;
	}
}


?>