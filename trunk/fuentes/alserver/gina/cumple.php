<!doctype html>
<html>
<head><title>Gina cumple años y lo festejamos hoy</title>
</head>
<body>
<?php 
date_default_timezone_set('America/Buenos_Aires');
if(date('Y-m-d',time())<='2013-12-13'){
?>
<p><b>Hoy festejamos el cumple de Gina</b></p>
<p>Estoy conectado a tavés de:</p>
<ol>
<li><a href=http://lata.com.ar>internet</a></li>
<li><a href=http://192.168.0.200>el WiFi de la casa de Gina</a></li>
<li id=li3><a href='#' onclick='li4.style.display=""; li3.style.display="none";'>no sé cómo me conecté</a></li>
<li id=li4 style='display:none'>yo tampoco sé, probá alguna de esas dos opciones</li>
<?php 
}else{
?>
<p><b>El viernes 13 festejamos el cumple de Gina</p></b>
<p>La pasamos bárbaro y jugamos a unos juegos muy divertidos</p>
<?php 
}
?>
