<?php

function cambiarRecursivamente($objetoBase, $objetoConCambios){
    foreach($objetoConCambios as $clave=>$valor){
        if(!isset($objetoBase->{$clave})){
            $objetoBase->{$clave}=$valor;
        }else{
            $valorAnterior=$objetoBase->{$clave};
            if(is_array($valorAnterior)){
                $objetoBase->{$clave}=array_merge($valorAnterior,(array) $valor);
            }else if(is_object($valorAnterior)){
                cambiarRecursivamente($objetoBase->{$clave},$valor);
            }else{
                $objetoBase->{$clave}=$valor;
            }
        }
    }
}

?>