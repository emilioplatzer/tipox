// Por $Author$ Revisión $Revision$ del $Date$
"use strict";

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
        var debugging=true;
        //var debugging=false;
        return err.message+(debugging?' '+err.stack:'');
    }
}

function cambiandole(destino,cambios,borrando,borrar_si_es_este_valor){
"use strict";
    if(destino instanceof Object && !(destino instanceof Date)){
        var respuesta={};
        for(var campo in destino){
            var cambio=cambios[campo];
            if(!(campo in cambios)){
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

function estoMismo(estoMismoDevuelvo){
    return estoMismoDevuelvo;
}