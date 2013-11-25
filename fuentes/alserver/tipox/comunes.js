// Por $Author$ Revisión $Revision$ del $Date$
"use strict";

var CONTROLARTODO=true;

function trim(esto) {
"use strict";
    if(esto==null || esto==undefined || typeof esto!="string"){
        return esto;
    }
    return esto.replace(/^\s+|\s+$/g, '');  
}

function descripcionError(err){
"use strict";
    /* usado para mostrar el mensaje de error de cualquier excepción */
    if(typeof(err)=='string'){
        return err;
    }else{
        //var debugging=true;
        var debugging=false;
        return err.message+(debugging?' '+err.stack:'');
    }
}

function cambiandole(destino,cambios,borrando,borrar_si_es_este_valor){
"use strict";
    if(destino instanceof Object && !(destino instanceof Date) && !(destino instanceof Function)){
        var respuesta={};
        for(var campo in destino) if(destino.hasOwnProperty(campo)){
            var cambio=cambios[campo];
            if(!(campo in cambios)){
                respuesta[campo]=destino[campo];
            }else if(borrando && cambio===borrar_si_es_este_valor){
            }else{
                respuesta[campo]=cambiandole(destino[campo],cambio,borrando,borrar_si_es_este_valor);
            }
        }
        for(var campo in cambios) if(cambios.hasOwnProperty(campo)){
            var cambio=cambios[campo];
            if(!(campo in destino) && (!borrando || !(cambio===borrar_si_es_este_valor))){
                respuesta[campo]=cambio;
            }
        }
        return respuesta;
    }else{
        if(cambios==undefined){
            return destino;
        }else{
            return cambios;
        }
    }
}

function estoMismo(estoMismoDevuelvo){
    return estoMismoDevuelvo;
}

function iterable(indice, objeto_o_lista_o_arreglo){
    return objeto_o_lista_o_arreglo.hasOwnProperty(indice) &&
        (!(objeto_o_lista_o_arreglo instanceof HTMLCollection 
           || objeto_o_lista_o_arreglo instanceof NodeList
           || 'TouchList' in window && objeto_o_lista_o_arreglo instanceof TouchList
           ) || !isNaN(indice));
}

function array_keys(objeto_asociativo) {
"use strict";
    var rta=[];
    for (var clave in objeto_asociativo) if(iterable(clave,objeto_asociativo)){
        rta.push(clave);
    }
    return rta;
}

function array_map(objeto_asociativo,aplicar,esto){
"use strict";
    var rta=[];
    var funcion;
    if(typeof aplicar=='string'){
        funcion=function(dato){
            return dato[aplicar];
        }
    }else{  
        funcion=aplicar;
    }
    for (var clave in objeto_asociativo) if(iterable(clave,objeto_asociativo)){
        rta.push(funcion.call(esto,objeto_asociativo[clave],clave));
    }
    return rta;
}

function coalesce(){
    for(var i=0; i<arguments.length; i++){
        if(arguments[i]!==null && arguments[i]!==undefined){
            return arguments[i];
        }
    }
    return undefined;
}

function obtener_top_global(elemento){
"use strict";
    var posicion_global = 0;
    while( elemento != null ) {
        posicion_global += elemento.offsetTop;
        elemento = elemento.offsetParent;
    }
    return posicion_global;
}

function obtener_left_global(elemento){
"use strict";
    var posicion_global = 0;
    while( elemento != null ) {
        posicion_global += elemento.offsetLeft;
        elemento = elemento.offsetParent;
    }
    return posicion_global;
}

function buscarPadre(elemento,caracterizador){
    var funcionDetencion=caracterizador;
    while(elemento.parentNode && !funcionDetencion(elemento.parentNode)){ 
        elemento=elemento.parentNode;
    }
    return elemento.parentNode;
}

function fechaAmd(cadenaAnnoMesDia){
    return new Date(cadenaAnnoMesDia);
}

function alertarUnaVez(mensaje,mostrarCondicionalmente){
    if(mostrarCondicionalmente!==false){
        if(!alertarUnaVez.alertas){
            alertarUnaVez.alertas={};
        }
        if(!alertarUnaVez.alertas[mensaje]){
            alert(mensaje);
            alertarUnaVez.alertas[mensaje]=1;
        }else{
            alertarUnaVez.alertas[mensaje]++;
        }
    }
}