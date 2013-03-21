<!DOCTYPE html>
<html id="home" lang="es">
<head>
<meta charset=utf-8 />
<title>Ejemplo Tipox</title>
<link rel="stylesheet" href="../tipox/tipox.css" />
<script src="../tipox/app.js"></script>
<script src="../tipox/comunes.js"></script>
<script src="../tipox/consola.js"></script>
<?php
require_once "comunes.php";
incluirArchivosConExtension('.','.js');
incluirArchivosConExtension('../tercera','.js');
function incluirArchivosConExtension($carpeta,$extension){
    $d = dir($carpeta);
    if($d){
        while (false !== ($entry = $d->read())) {
            if(terminaCon($entry,$extension)){
                echo "<script src='{$carpeta}/{$entry}'></script>\n";
            }
        }
        $d->close();
    }
}
?>
</head>
<body>
cargando...
<br>
<img src='../imagenes/cargando.gif' alt='cargando...'>
</body>
</head>
</html>
