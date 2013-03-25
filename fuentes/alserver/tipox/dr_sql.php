<?php

class Dr_sql{
    const TABLA='tabla (el objeto de que representa el nombre de una tabla)';
    function arreglarSentencia($sentencia){
        return $sentencia;
    }
    function adaptarBool(&$valorQueDebeTransformarseEnBooleano){
    }
    function ejecutar($db,$sentencia,$parametros,$logTodo,$logError){
        $sentenciaArreglada=$db->dr->arreglarSentencia($sentencia);
        if($logTodo){
            $mensajeParaLoguear=$this->mensajeParaLoguear($sentencia,$sentenciaArreglada,$parametros);
            $logTodo->loguearDirecto($mensajeParaLoguear);
        }
        try{
            $cursor=$this->ejecutarSentencia($db,$sentenciaArreglada,$parametros);
        }catch(Exception $err){
            if($logError){
                $mensajeParaLoguear=$this->mensajeParaLoguear($sentencia,$sentenciaArreglada,$parametros).
                    "\n-- Exception ".$err->getMessage();
                $logError->loguearDirecto($mensajeParaLoguear);
            }
            throw $err;
        }
        return $cursor;
    }
    function ejecutarSentencia($db,$sentenciaArreglada,$parametros){
        $cursor=$db->prepare($sentenciaArreglada);
        $cursor->execute($parametros);
        return $cursor;
    }
    function mensajeParaLoguear($sentencia,$sentenciaArreglada,$parametros){
        $mensaje=$sentencia;
        if($sentencia!=$sentenciaArreglada){
            $mensaje.="\n/* ARREGLADA\n".$sentenciaArreglada."\n*/";
        }
        $mensaje.="\n--: ".json_encode($parametros);
        return $mensaje;
    }
    function quote($objeto,$tipo_de_objeto){
        if(!preg_match("/^\\w+$/",$objeto)){
            throw new Exception("caracteres invalidos en el nombre de objeto de la base ".$objeto);
        }
        return $objeto;
    }
}

?>