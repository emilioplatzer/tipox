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

Object.defineProperty(window,'controlParametros',{ 
    set:function(params){
        for(var nombre_param in params.parametros){
            if(!(nombre_param in params.def_params)){
                throw new Error('sobra el parametro '+nombre_param);
            }
        }
        for(var nombre_param in params.def_params){
            var def_param=params.def_params[nombre_param];
            if(nombre_param in params.parametros){
                if(def_param.validar && !(def_param.validar.call(this,params.parametros[nombre_param]))){
                    throw new Error('valor inválido para el parámetro '+nombre_param);
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
