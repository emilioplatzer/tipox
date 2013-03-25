<?php
require_once "../tipox/dr_sql.php";

class Dr_sqlite extends Dr_sql{
    var $dsn;
    function __construct($pdo){
        parent::__construct($pdo);
        $this->dsn=$pdo->dsn;
    }
    function arreglarSentencia($sentencia){
        if(strpos($sentencia,'/*SQLITE:BORRAR BASE DE DATOS*/')!==false){
            $nombres=explode(':',$this->dsn);
            $sentencia='/*SQLITE:BORRAR BASE DE DATOS*/'.$nombres[1];
        }else{
            $sentencia=preg_replace(array('/\btrue\b/i','/\bfalse\b/i','/\bserial primary key\b/i'),array(1,0,'integer primary key'),$sentencia);
            $sentencia=str_replace(array('/*POSTGRESQL*/','/*TIENE:SCHEMA*/'),array('/*POSTGRESQL  ','/*TIENE:SCHEMA  '),$sentencia);
        }
        return $sentencia;
    }
    function ejecutarSentencia($db,$sentenciaArreglada,$parametros){
        // if($sentenciaArreglada=='/*SQLITE:BORRAR BASE DE DATOS*/'){
        if(comienzaCon($sentenciaArreglada,'/*SQLITE:BORRAR BASE DE DATOS*/')){
            $nombres=explode(':',$this->dsn);
            unlink($nombres[1]);
            $base_borrada=new PDO($this->dsn);
            return null;
        }else{
            return parent::ejecutarSentencia($db,$sentenciaArreglada,$parametros);
        }
    }
    function adaptarBool(&$valorQueDebeTransformarseEnBooleano){
        $valorQueDebeTransformarseEnBooleano=!!$valorQueDebeTransformarseEnBooleano;
    }
}

?>