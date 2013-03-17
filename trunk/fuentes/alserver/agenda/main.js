// Por $Author$ Revisión $Revision$ del $Date$
"use strict";

Aplicacion.prototype.paginasSinUsuario={tipox:'aplicacion', id:'menu', paginas:{
    intr:{ 
        labelMenu:'Introducción',
        nodes:["Agenda mínima. Esta es una prueba de concepto, una agenda funcional mínima basada en una sola tabla. ",
            "Las principales características son: ",
            {tipox: 'lista', tagList:'ol', tagElement:'li', elementos:[
              "Funciona off line, aún cuando no haya conexión. ",
              "Está limitado a navegadores que implementan un conjunto avanzado de HTML5 y no avisa cuando se usa un navegador que no las implementa", 
              "Está implementado casi en su totalidad en Javascript y SQL (y un soporte mínimo de PHP)."
              ]}
        ]
    },
    entrar:{
        labelMenu:'entrar',
        nodes:[
            {tipox:'h2', innerText:"Entrada"},
            {tipox:'formulario_simple', nodes:[
                {tipox:'parametro', id:'usuario', aclaracion:'probablemente el mail donde recibió el aviso'},
                {tipox:'parametro', id:'contraseña', type:'password'},
                {tipox:'parametro_boton', id:'entrar', eventos:{click:'entrar_aplicacion'}}
            ]}
        ]
    },
    info:{
        labelMenu:[{tipox:'span', className:'i_logo', innerText:'i'}],
        nodes:[
            {tipox:'p', nodes:['Especificaciones técnicas ']},
            {tipox:'p', nodes:['framework: ',{tipox:'tipox_logo'}]},
            {tipox:'p', nodes:[
                "para hacer sugerencias o reportar errores sobre este programa entrar a: ", 
                {tipox:'a', href:'https://code.google.com/p/tipox/issues/entry', innerText:'"New Issues"'},
                ' (se necesita tener una cuenta en gmail para poder acceder)'
            ]}
        ]
    }}
}

Aplicacion.prototype.paginas={};

var app=new Aplicacion();
Aplicacion.run(app).luego(function(){
    Almacen.adaptarAplicacion(app);
    app.mostrarPaginaActual();
});
