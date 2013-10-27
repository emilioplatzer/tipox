// Por $Author$ Revisión $Revision$ del $Date$
"use strict";

window.addEventListener('load',function(){
    var colocador=new Colocador();
    colocador.colocar({
        destino:document.body,
        contenido:{
            tipox:'div', nodes:[
                {tipox:'h1', nodes:["Colocador de html-JSONeados dentro del DOM ", {tipox:'small', nodes:["(vía el framework ", {tipox:'logo_tipox'}, ")"]}]},
                {tipox:'p', innerText:"Un nuevo intento de ordenar el desarrollo HTML5"},
                {tipox:'p', nodes:"Vamos a ver si ahora se pueden separar un poco las cosas"},
            ]
        },
        reemplazar:true
    });
});
