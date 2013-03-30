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

var app=new Aplicacion();
Aplicacion.run(app).luego(function(){
    // setTimeout(MostrarControlCompatibilidad,1000);
});
    