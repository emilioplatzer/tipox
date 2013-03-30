// Por $Author$ Revisión $Revision$ del $Date$
"use strict";

Aplicacion.prototype.paginas.intr={ 
    labelMenu:'Introducción',
    nodes:["Agenda mínima. Esta es una prueba de concepto, una agenda funcional mínima basada en una sola tabla. ",
        "Las principales características son: ",
        {tipox: 'lista', tagList:'ol', tagElement:'li', elementos:[
          "Funciona off line, aún cuando no haya conexión. ",
          "Está limitado a navegadores que implementan un conjunto avanzado de HTML5 y no avisa cuando se usa un navegador que no las implementa", 
          "Está implementado casi en su totalidad en Javascript y SQL (y un soporte mínimo de PHP)."
          ]},
        {tipox:'div', id:'resultadoModernizr'}
    ]
};

Aplicacion.prototype.paginas.agenda={ 
    labelMenu:'Agenda',
    nodes:[
        "agenda",
        {tipox:'funcion', funcion:'traerAgenda', id:'zona_agenda'}
    ]
};

Aplicacion.prototype.traerAgenda=function(){
    return this.accesoDb({hacer:'select',from:'agenda',where:true}).luego(function(respuesta,app){
        app.grab(zona_agenda,{tipox:'tabla', filas:respuesta});
    }).alFallar(function(mensaje,app){
        app.grab(zona_agenda,"no se pueden leer los datos de la agenda: "+mensaje);
    });
}

var app=new Aplicacion();
Aplicacion.run(app).luego(function(){
    // setTimeout(MostrarControlCompatibilidad,1000);
});
    