"use strict";

if(window.controlDependencias){
    throw new Error("controlDependencias debe instalarse antes que los demas .js");
}

Object.defineProperty(window,'controlDependencias',{ 
    get: function(){ return true; }, 
    set: function(value){ 
        for(var sector in {deseables:true, necesarios:true}){
            (value[sector]||[]).forEach(function(n_propiedad){
                if(!(n_propiedad in window)){
                    throw new Error("Falta la dependencia "+n_propiedad);
                }
            });
        }
    }
}); 

if(window.controlParametros){
    throw new Error("controlParametros debe instalarse antes que los demas .js");
}

Object.defineProperty(window,'controlParametros',{ 
    set:function(params){
        var keys=Object.keys(params);
        if(keys.length>3) throw new Error('controlParametros solo puede recibir un parametro {parametros:... def_params:... ignorar_prototype}');
        if(keys[0]!='parametros') throw new Error('controlParametros tiene que recibir primero parametros');
        if(keys[1]!='def_params') throw new Error('controlParametros tiene que recibir segundo def_params');
        if(keys.length>2 && keys[2]!='ignorar_prototype') throw new Error('controlParametros tiene que recibir tercero ignorar_prototype');
        for(var nombre_param in params.parametros){
            if(!(nombre_param in params.def_params) && (!params.ignorar_prototype || params.parametros.hasOwnProperty(nombre_param))){
                throw new Error('sobra el parametro '+nombre_param);
            }
        }
        for(var nombre_param in params.def_params){
            var def_param=params.def_params[nombre_param];
            if(nombre_param in params.parametros){
                if(def_param.validar && !(def_param.validar.call(this,params.parametros[nombre_param]))){
                    throw new Error('valor inválido para el parámetro '+nombre_param+': '+params.parametros[nombre_param]);
                }
                if(def_param.estructuraElementos){
                    for(var clave in params.parametros[nombre_param]) if(params.parametros[nombre_param].hasOwnProperty(clave)){
                        window.controlParametros={
                            parametros:params.parametros[nombre_param][clave],
                            def_params:def_param.estructuraElementos
                        };
                    }
                }
            }else{
                if(def_param.obligatorio){
                    throw new Error('falta el parametro '+nombre_param);
                }
            }
            if('predeterminado' in def_param){
                throw new Error('no se pueden especificar valores predeterminados en un control '+nombre_param);
            }
        }
    }
});

window.addEventListener('error',function(evento){
    alert(evento.error.stack);
});

/*
window.onerror=function(evento){
    alert(descripcionError(evento));
}
*/