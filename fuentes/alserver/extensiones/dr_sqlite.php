<?php
require_once "../tipox/dr_sql.php";

class Dr_sqlite extends Dr_sql{
    function arreglarSentencia($sentencia){
        $sentencia=preg_replace(array('/\btrue\b/','/\bfalse\b/'),array(1,0),$sentencia);
        $sentencia=str_replace(array('/*POSTGRESQL*/','/*TIENE:SCHEMA*/'),array('/*POSTGRESQL  ','/*TIENE:SCHEMA  '),$sentencia);
        return $sentencia;
    }
    function adaptarBool(&$valorQueDebeTransformarseEnBooleano){
        $valorQueDebeTransformarseEnBooleano=!!$valorQueDebeTransformarseEnBooleano;
    }
}

?>