"use strict";

function Aplicacion(){
    this.paginaActual='default';
}

Aplicacion.prototype.paginas={
    'default':{tipox:'h1', innerText:'¡en preparación!'},
    'tipox':{tipox:'p', innerText:'tipox versión $Revision'},
};

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
    if(definicion===null || definicion===undefined){
        return;
    }else if(typeof(definicion)=='string'){
        nuevoElemento=document.createTextNode(definicion);
    }else if(definicion instanceof Array){
        for(var i=0; i<definicion.length; i++){
            this.grab(elemento,definicion[i]);
        }
        return; 
    }else{
        var tipox=definicion.tipox;
        var creador=this.domCreator(tipox);
        nuevoElemento=creador.nuevo(tipox);
        creador.asignarAtributos(nuevoElemento,definicion);
        this.grab(nuevoElemento,definicion.nodes);
    }
    elemento.appendChild(nuevoElemento);
}

Aplicacion.prototype.contenidoPaginaActual=function(){
    return this.paginas[this.paginaActual];
}

Aplicacion.prototype.mostrarPaginaActual=function(){
    document.body.innerHTML=''; 
    this.grab(document.body,this.contenidoPaginaActual());
}

Aplicacion.prototype.controlarParametros=function(){}

Aplicacion.run=function(app){
    app.controlarParametros({app:app},{app:{validar:function(app){ return app instanceof Aplicacion; }}});
    window.addEventListener('load',function(){
        app.mostrarPaginaActual();
    });    
}
