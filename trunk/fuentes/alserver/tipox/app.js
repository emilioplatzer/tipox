"use strict";

function Aplicacion(){
}

Aplicacion.prototype.domCreator=function(tipox){
    return {
        nuevo:function(tagName){ return document.createElement(tagName); },
        asignarAtributos:function(destino,definicion){
            for(var atributo in definicion) if(definicion.hasOwnProperty(atributo)){
                var valor=definicion[atributo];
                if(atributo!='tipox'){
                    if(atributo instanceof Object){
                        this.asignarAtributos(destino[atributo],valor);
                    }else{
                        destino[atributo]=valor;
                    }
                }
            }
        }
    }
}

Aplicacion.prototype.grab=function(elemento,definicion){
    var nuevoElemento;
    if(typeof(definicion)=='string'){
        nuevoElemento=document.createTextNode(definicion);
    }else{
        var tipox=definicion.tipox;
        var creador=this.domCreator(tipox);
        nuevoElemento=creador.nuevo(tipox);
        creador.asignarAtributos(nuevoElemento,definicion);
    }
    elemento.appendChild(nuevoElemento);
}

Aplicacion.prototype.mostrarPaginaActual=function(){
    this.grab(document.body,{tipox:'h1', innerText:'¡en preparación!'});
}

Aplicacion.prototype.controlarParametros=function(){}

Aplicacion.run=function(app){
    app.controlarParametros({app:app},{app:{validar:function(app){ return app instanceof Aplicacion; }}});
    window.addEventListener('load',function(){
        app.mostrarPaginaActual();
    });    
}
