// Por $Author: emilioplatzer@gmail.com $ Revisión $Revision: 23 $ del $Date: 2013-03-18 01:49:46 -0300 (lun 18 de mar de 2013) $
"use strict";

window.addEventListener('load',function(){
    var colocador=new Colocador();
    colocador.colocar({
        destino:document.body,
        contenido:{
            tipox:'div', nodes:[
                {tipox:'h1', nodes:["Demo de casos de prueba ", {tipox:'small', nodes:["(del framework ", {tipox:'logo_tipox'}, ")."]}]}
            ]
        },
        reemplazar:true
    });
    var probador=new Probador();
    probador.agregarCasosEjemplo();
    probador.probarTodo({sinTryCatch:true});
});
