<?php
class ValidadorParametros{
    var $params;
    var $errores=array();
    function __construct($params){
        $this->params=$params;
    }
    function informar_error($mensaje){
        $this->errores[]=$mensaje;
    }
    function lanzar_excepcion($mensaje){
        throw new Exception($mensaje."[en ".($this->params['contexto'])."]");
    }
    function validar($definicion_params,$params){
        if(!$params){
            $this->informar_error("falta la defininci&oacute;n de los par&aacute;metros ");
        }
        foreach($params as $parametro=>$definicion){
            if(!@$definicion_params[$parametro]){
                $this->informar_error("sobra un par&aacute;metro en la definici&oacute;n (".htmlentities($parametro).") ");
            }
        }
        foreach($definicion_params as $parametro=>$definicion){
            if((@$definicion['obligatorio']) && !isset($params[$parametro])){
                $this->informar_error("falta el par&aacute;metro obligatorio en la definici&oacute;n (".htmlentities($parametro).") ");
            }
            if(isset($params[$parametro])){
                $valor=$params[$parametro];
                if(isset($definicion['validar']) && !$definicion['validar']($valor)){
                    $this->informar_error("par&aacute;metro inv&aacute;lido en la definici&oacute;n (".htmlentities($parametro)." no cumple {$definicion['validar']}) ");
                }
            }
        }
        if(count($this->errores)){
            $this->lanzar_excepcion(implode(', ',$this->errores));
        }
    }
}
?>