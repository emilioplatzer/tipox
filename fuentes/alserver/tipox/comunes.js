// Por $Author$ Revisión $Revision$ del $Date$
"use strict";

function trim(esto) {
"use strict";
    if(esto==null || esto==undefined || typeof esto!="string"){
        return esto;
    }
    return esto.replace(/^\s+|\s+$/g, '');  
}

function descripciones_de_error(err){
"use strict";
    /* usado para mostrar el mensaje de error de cualquier excepción */
    var mensaje=' '+(err.description||'')+' '+(err.message||'')+' '+(err.type_error||'');
    if(!trim(mensaje)){
        mensaje=JSON.stringify(err);
    }
    return mensaje;
}

function cambiandole(destino,cambios,borrando,borrar_si_es_este_valor){
"use strict";
    if(destino instanceof Object && !(destino instanceof Date)){
        var respuesta={};
        for(var campo in destino){
            var cambio=cambios[campo];
            if(cambio==undefined){
                respuesta[campo]=destino[campo];
            }else if(borrando && cambio===borrar_si_es_este_valor){
            }else{
                respuesta[campo]=cambiandole(destino[campo],cambio,borrando,borrar_si_es_este_valor);
            }
        }
        for(var campo in cambios){
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
