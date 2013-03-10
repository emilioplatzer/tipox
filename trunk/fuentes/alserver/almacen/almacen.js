// Por $Author$ Revisión $Revision$ del $Date$
"use strict";

var Almacen={};

Almacen.adaptarAplicacion=function(app){
    app.paginas.paginas.misArchivos={
        labelMenu:'mis archivos',
        nodes:[
            {tipox:'h1', innerText:'mis archivos'},
            {tipox:'p', innerText:'acá están'},
        ]
    }
}
