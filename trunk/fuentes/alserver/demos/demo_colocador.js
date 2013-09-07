﻿// Por $Author: emilioplatzer@gmail.com $ Revisión $Revision: 23 $ del $Date: 2013-03-18 01:49:46 -0300 (lun 18 de mar de 2013) $
"use strict";

window.addEventListener('load',function(){
    var colocador=new Colocador();
    colocador.colocar({
        destino:document.body,
        contenido:{
            tipox:'div', nodes:[
                {tipox:'h1', nodes:["Colocador de html-JSONeados dentro del DOM ", {tipox:'small', nodes:["(vía el framework ", {tipox:'logo_tipox'}, ")"]}]},
                {tipox:'p', nodes:"Un nuevo intento de ordenar el desarrollo HTML5"},
                {tipox:'p', nodes:"Vamos a ver si ahora se pueden separar un poco las cosas"},
            ]
        },
        reemplazar:true
    });
});
