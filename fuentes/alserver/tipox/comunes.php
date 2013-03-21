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

function comienzaCon( $str, $sub ) {
   return ( substr( $str, 0, strlen( $sub ) ) === $sub );
}

function terminaCon( $str, $sub ) {
   return ( substr( $str, strlen( $str ) - strlen( $sub ) ) === $sub );
}

?>