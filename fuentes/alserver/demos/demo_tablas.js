// demo_tablas.js

window.addEventListener('load',function(){
    var colocador=new Colocador();
    var filas=[];
    for(var i=0; i<2000; i++){
        filas.push([i, numero_a_letras(i), i.toString(2), numero_a_letras(i).length, numero_a_letras(numero_a_letras(i).length),numero_a_letras(numero_a_letras(i).length).length, numero_a_letras(i).length==numero_a_letras(numero_a_letras(i).length).length?'punto fijo':null]);
    }
    colocador.colocar({contenido:{tipox:'div', nodes:{tipox:'tabla', filas:filas}}});
});
