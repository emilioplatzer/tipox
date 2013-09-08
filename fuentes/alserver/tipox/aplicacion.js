﻿// Por $Author$ Revisión $Revision$ del $Date$
"use strict";

function Aplicacion(){
    this.esAplicacion=true;
    this.controlador={
        controlar:function(){}
    }
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
