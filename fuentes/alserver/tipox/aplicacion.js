// Por $Author$ Revisión $Revision$ del $Date$
"use strict";

function Aplicacion(){
    this.esAplicacion=true;
    var este=this;
    this.controlador={
        controlar:function(params,def_params){
            for(var nombre_param in params) if(params.hasOwnProperty(nombre_param)){
                if(!(nombre_param in def_params)){
                    este.lanzarExcepcion('sobra el parámetro '+nombre_param);
                }
            }
            for(var nombre_param in def_params) if(def_params.hasOwnProperty(nombre_param)){
                var def_param=def_params[nombre_param];
                if(def_param.obligatorio && !(nombre_param in params)){
                    este.lanzarExcepcion('falta el parámetro '+nombre_param);
                }
                if(def_param.validar && !(def_param.validar.call(this,params[nombre_param]))){
                    este.lanzarExcepcion('valor inválido para el parámetro '+nombre_param);
                }
                if('predeterminado' in def_param && !(nombre_param in params)){
                    params[nombre_param]=def_param.predeterminado;
                }
            }
        }
    };
    var d=new Date();
    var d2=d.toISOString();
    var d3=d2.substr(0,'2099-12-31'.length)
    this.hoyString=d3;
    this.hoyString=new Date().toISOString().substr(0,'2099-12-31'.length);
}

Aplicacion.prototype.currentTimeStamp=function(){
    return new Date().toISOString();
}

Aplicacion.prototype.assert=function(revisar,mensaje){
    if(!revisar){
        this.lanzarExcepcion('Falló un assert con '+mensaje);
    }
}

Aplicacion.prototype.lanzarExcepcion=function(mensaje){
    throw new Error(mensaje);
}

Aplicacion.prototype.nuevo={};

Aplicacion.prototype.run=function(){
}

var app_global=new Aplicacion();
