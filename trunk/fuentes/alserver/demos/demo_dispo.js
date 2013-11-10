// Por $Author$ Revisión $Revision: 23 $ del $Date$
"use strict";
var colocador;

var NUM={claseElemento:'revisar_num'};
var TXT={claseElemento:'revisar_txt'};

var revisar={
    outerWidth:NUM, 
    outerHeight:NUM, 
    innerWidth:NUM, 
    innerHeight:NUM, 
    navigator:{
        userAgent:TXT
    },
    screen:{
        availTop:NUM,
        availLeft:NUM,
        availWidth:NUM,
        availHeight:NUM,
        width:NUM,
        height:NUM,
        pixelDeph:NUM
    },
    document:{
        width:NUM,
        height:NUM,
        body:{
            clientWidth:NUM,
            clientHeight:NUM,
            offsetWidth:NUM,
            offsetHeight:NUM,
            scrollWidth:NUM,
            scrollHeight:NUM
        }
    }
};

var MARGEN_T=2000;

var ahora=1;

function mostrarRevisar(revisar, destino, objetivo, sufijoId){
    if(!sufijoId){
        ahora=new Date().getTime();
    }
    var tabla=colocador.colocar({destino:destino, contenido:{tipox:'table', className:'resultados', id:'tabla'+JSON.stringify(sufijoID)}});
    for(var campo in revisar){
        var def=revisar[campo];
        var id=(sufijoId||[]).concat([campo]);
        var id_json=JSON.stringify(id);
        var celda=document.getElementById(id_json);
        if(!celda){
            var fila=colocador.colocar({destino:tabla, contenido:{tipox:'tr', nodes:[
                {tipox:'td', className:'label', nodes:campo}, 
                {tipox:'td', classList:[], id:id_json}
            ]}});
            // celda=fila.cells[fila.cells.length-1];
            celda=document.getElementById(id_json);
        }
        if(def.claseElemento){
            if(!celda.ultimaModificacion){
                celda.classList.add(def.claseElemento);
                celda.ultimaModificacion=ahora;
            }else{
                celda.classList.remove('revisar_modificado');
                if(celda.innerText!=objetivo[campo] || celda.ultimaModificacion+MARGEN_T>ahora){
                    celda.classList.add('revisar_modificado');
                    if(celda.innerText!=objetivo[campo]){
                        celda.ultimaModificacion=ahora;
                    }
                }
            }
            celda.innerText=objetivo[campo];
        }else{
            mostrarRevisar(def, celda, objetivo[campo], id);
        }
    }
}

window.addEventListener('load',function(){
    colocador=new Colocador();
    var mostrar=function(){
        var destino=document.getElementById('muestra');
        // destino.innerHTML='';
        mostrarRevisar(revisar,destino, window);
    };
    colocador.colocar({
        destino:document.body,
        contenido:[
            {tipox:'div', nodes:[
                {tipox:'h1', id:'debug_html', nodes:["Demo dispo ", {tipox:'small', nodes:["(del framework ", {tipox:'logo_tipox'}, ")."]}]}
            ]},
            {tipox:'div', nodes:[
                'para ver la configuración y características de cada dispositivo ', 
                {tipox:'button', nodes:['refrescar'], eventos:{click:mostrar}}
            ]},
            {tipox:'div', id:'muestra'}
        ],
        reemplazar:true
    });
    mostrar();
});
