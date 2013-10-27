// Por $Author$ Revisión $Revision$ del $Date$
"use strict";

window.addEventListener('load',function(){
    var colocador=new Colocador();
    colocador.colocar({
        destino:document.body,
        contenido:{
            tipox:'div', nodes:[
                {tipox:'h1', id:'debug_html', nodes:["Demo de casos de prueba ", {tipox:'small', nodes:["(del framework ", {tipox:'logo_tipox'}, ")."]}]}
            ]
        },
        reemplazar:true
    });
    colocador.colocar({destino:document.body, contenido:{tipox:'div', id:'debug_probador', /*style:'border:solid 1px brown',*/ innerText:'pruebas'}});
    var probador=new Probador();
    probador.agregarCasosEjemplo();
    probador.agregarCasosRegistrados();
    probador.probarTodo({sinTryCatch:true});
    document.getElementById('debug_html').onclick=function(){
        var ta=document.createElement('textarea');
        document.body.appendChild(ta);
        ta.value=document.body.innerHTML;
    }
});
