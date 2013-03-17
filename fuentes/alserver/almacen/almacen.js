// Por $Author$ Revisión $Revision$ del $Date$
"use strict";

var Almacen={};

Aplicacion.prototype.creadores.static_ajax={tipo:'tipox', descripcion:'para probar cosas a través del ajax', creador:{
    nuevo:function(definicion){
        return document.createElement('span');
    },
    asignarAtributos:function(destino,definicion,futuro){
        var nuevoId='static_ajax:'+definicion.label;
        destino.id=nuevoId;
        destino.ongrab=function(app){
            var elementoDestino=this;
            app.enviarPaquete(definicion.params).luego(function(respuesta,app){
                app.grab(elementoDestino,respuesta,futuro);
            }).alFallar(function(mensaje,app){
                app.grab(elementoDestino,{tipox:'span', className:'mensaje_error', nodes:mensaje},futuro);
            });
        }
    }
}};

Aplicacion.prototype.creadores.auto_test={tipo:'tipox', descripcion:'para probar cosas a través del ajax', creador:{
    translate:function(definicion){
        var nuevo={tipox:'div', nodes:[ 
            definicion.label, 
            ': ',
            {tipox:'static_ajax', params:definicion.probar}
        ]};
        return nuevo;
    }
}};

Almacen.adaptarAplicacion=function(app){
    var info=app.paginas.paginas.info;
    delete app.paginas.paginas.info;
    app.paginas.paginas.misArchivos={
        labelMenu:'mis archivos',
        nodes:[
            {tipox:'h1', innerText:'mis archivos'},
            {tipox:'p', innerText:'acá están'},
        ]
    }
    app.paginas.paginas.salir={
        labelMenu:'salir',
        nodes:[
            {tipox:'h1', innerText:'mis archivos'},
            {tipox:'p', innerText:'acá están'},
        ]
    }
    app.paginas.paginas.entrar.ocultar=true;
    app.paginas.paginas.info=info;
    info.nodes.push({tipox:'div',nodes:[
        {tipox:'p', className:'titulo', innerText:"auto tests"},
        {tipox:'auto_test', label:'SQLite presente', probar:{destino:'../tipox/sqlite.php', paquete:{probar:'existencia'}}},
        {tipox:'auto_test', label:'SQLite funcionando', probar:{destino:'../tipox/sqlite.php', paquete:{probar:'operatividad'}}},
    ]});
}
