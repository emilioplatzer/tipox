// demo_tablas.js
"use strict";

function geringoso(frase){
    //return frase.replace(/(([aeiou]))/ig,'$1p$2');
    return frase.toLowerCase().
            replace('á','a').
            replace('é','e').
            replace('í','i').
            replace('ó','o').
            replace('ú','u').
            replace('ü','u').
            replace(/(([aeiouáéíóúü])([b-df-hj-np-tv-zñ]?(\b|(?=[b-df-hj-np-tv-z]))))/ig,'$1p$2');
}

Probador.prototype.registradorCasosPrueba.push(function(){
    this.casoPredeterminado={funcion:'geringoso', modulo:'Geringoso'};
    this.agregarCaso({entrada:['hola'], esperado:{respuesta:'hopolapa'}});
    this.agregarCaso({entrada:['dos'], esperado:{respuesta:'dospo'}});
    this.agregarCaso({entrada:['tan parcos'], esperado:{respuesta:'tanpa parpacospo'}});
    // this.agregarCaso({entrada:['Hola, ¿cómo estás?'], esperado:{respuesta:'hopolapa, ¿copomopo epestapas?'}});
    this.agregarCaso({entrada:['Hola, ¿cómo estás?'], esperado:{respuesta:'hopolapa, ¿copomopo espetaspa?'}});
    // this.agregarCaso({entrada:['Yo estoy bien, ¿y tú?'], esperado:{respuesta:'yopo epestópoy bipiepen, ¿y tupu?'}});
    this.agregarCaso({entrada:['Yo estoy bien, ¿y tú?'], esperado:{respuesta:'yopo espetoypo bienpe, ¿y tupu?'}});
    // this.agregarCaso({entrada:['También, gracias.'], esperado:{respuesta:'tapambiepen, grapacipiapas'}});
    this.agregarCaso({entrada:['También, gracias.'], esperado:{respuesta:'tampabienpe, grapaciaspa.'}});
    // this.agregarCaso({entrada:['Eso ya lo sabía'], esperado:{respuesta:'epesopo yapa lopo sapabipiapa'}});
    this.agregarCaso({entrada:['Eso ya lo sabía'], esperado:{respuesta:'epesopo yapa lopo sapabiapa'}});
});

window.addEventListener('load',function(){
    var colocador=new Colocador();
    var filas=[];
    filas.push(['núm','número en letras','binario','largo NeL','NeL^2','largo NeL^2','punto fijo', 'geringoso','md5'  ,'filtered md5']);
    filas.push(['(e)','texto'           ,'(b)'    ,'(e)'      ,'texto','(e)'        ,'texto'     , 'texto'    ,'texto','texto']);
    for(var i=0; i<2000; i++){
        var bin=i.toString(2);
        filas.push([i.toString(), numero_a_letras(i), bin, numero_a_letras(i).length, numero_a_letras(numero_a_letras(i).length),
            numero_a_letras(numero_a_letras(i).length).length, 
            numero_a_letras(i).length==numero_a_letras(numero_a_letras(i).length).length?'punto fijo':null,
            geringoso(numero_a_letras(i)),hex_md5(i+""),
            hex_md5(i+"").split('').filter(function(value,index){ return bin[index % bin.length]=='1';}).join('') 
        ]);
    }
    var tabla=colocador.colocar({contenido:{tipox:'div', nodes:{tipox:'tabla', id:'esta_tabla', className:'tabla_fija', filas:filas}}, devolver:'esta_tabla'});
    tituladorSuperior(tabla);
});

function tituladorSuperior(elementoTabla){
    if(!app_global.colocador){
        app_global.colocador=new Colocador();
    }
    var colocador=app_global.colocador;
    if(elementoTabla.tagName!='TABLE'){
        throw new Error('se esperaba una tabla');
    }
    elementoTabla.titSup={
        seccionTitulo:elementoTabla.tHead||elementoTabla.tBodies[0],
        filasEncabezado:2,
        columnasEncabezado:2,
    }
    var altura=0;
    for(var i=0; i<elementoTabla.titSup.filasEncabezado; i++){
        altura+=elementoTabla.titSup.seccionTitulo.rows[i].clientHeight;
    }
    var ancho=0;
    for(var i=0; i<elementoTabla.titSup.columnasEncabezado; i++){
        ancho+=elementoTabla.titSup.seccionTitulo.rows[0].cells[i].clientWidth;
    }
    elementoTabla.titSup.divEncabezadoSup=colocador.colocar({contenido:
        {tipox:'div',className:'tabla_cabezal_fijo', style:{height:altura, width:elementoTabla.clientWidth, visibility:'hidden'} }
    });
    elementoTabla.titSup.divEncabezadoLat=colocador.colocar({contenido:
        {tipox:'div',className:'tabla_cabezal_fijo', style:{height:elementoTabla.clientHeight, width:ancho, visibility:'hidden'} }
    });
    var optimizadoVertical=true;
    elementoTabla.titSup.divEncabezadoEsq=colocador.colocar({contenido:
        {tipox:'div',className:'tabla_cabezal_fijo', style:{height:altura, width:ancho, visibility:'hidden'} }
    });
    colocador.colocar({contenido:{tipox:'div', nodes:'espacio en blanco', style:{height:800}}});
    var top=obtener_top_global(elementoTabla);
    var left=obtener_left_global(elementoTabla);
    if(optimizadoVertical){
        elementoTabla.titSup.divEncabezadoLat.style.position='absolute';
        elementoTabla.titSup.divEncabezadoLat.style.top=top+'px';
    }
    window.addEventListener('scroll',function(){
        var visibilidadSup='hidden';
        if(top<window.pageYOffset && top+elementoTabla.scrollHeight-altura>window.pageYOffset){
            visibilidadSup='visible';
            elementoTabla.titSup.divEncabezadoSup.style.left=(left-window.pageXOffset)+'px';
        }
        elementoTabla.titSup.divEncabezadoSup.style.visibility=visibilidadSup;
        if(left<window.pageXOffset && left+elementoTabla.scrollWidth-ancho>window.pageXOffset){
            elementoTabla.titSup.divEncabezadoLat.style.visibility='visible';
            elementoTabla.titSup.divEncabezadoEsq.style.visibility=visibilidadSup;
            if(optimizadoVertical){
                elementoTabla.titSup.divEncabezadoLat.style.left=(window.pageXOffset)+'px';
            }else{
                elementoTabla.titSup.divEncabezadoLat.style.top=(top-window.pageYOffset)+'px';
            }
        }else{
            elementoTabla.titSup.divEncabezadoLat.style.visibility='hidden';
            elementoTabla.titSup.divEncabezadoEsq.style.visibility='hidden';
        }
    });
    ponerTextosEncabezados(elementoTabla);
}

function ponerTextosEncabezados(elementoTabla){
    var colocador=app_global.colocador;
    if(elementoTabla.titSup.titulando){
        var parar=(new Date()).getTime()+500;
        var cilcarPoniendoTexto=function(destino, horizontal){
            while((new Date()).getTime()<parar && elementoTabla.titSup.titulando.cual<elementoTabla.titSup.titulando.max){ 
                for(var i=0; i<elementoTabla.titSup.filasEncabezado; i++){
                    var celda=horizontal?
                        elementoTabla.titSup.seccionTitulo.rows[i].cells[elementoTabla.titSup.titulando.cual]:
                        elementoTabla.rows[elementoTabla.titSup.titulando.cual].cells[i];
                    colocador.colocar({
                        destino:destino,
                        contenido:{
                            tipox:'div', 
                            className:'celda_cabezal_fijo',
                            style:{width:celda.clientWidth-4, height:celda.clientHeight, top:celda.offsetTop, left:celda.offsetLeft, position:'absolute'},
                            innerHTML:celda.innerHTML
                        }
                    });
                }
                elementoTabla.titSup.titulando.cual++;
            }
            return elementoTabla.titSup.titulando.cual>=elementoTabla.titSup.titulando.max;
        }
        if(elementoTabla.titSup.titulando.modo=='arriba'){
            if(cilcarPoniendoTexto(elementoTabla.titSup.divEncabezadoSup, true)){
                elementoTabla.titSup.titulando={modo:'esquina', cual:0, max:elementoTabla.titSup.columnasEncabezado};
            }
        }else if(elementoTabla.titSup.titulando.modo=='esquina'){
            if(cilcarPoniendoTexto(elementoTabla.titSup.divEncabezadoEsq, true)){
                elementoTabla.titSup.titulando={modo:'lateral', cual:0, max:elementoTabla.rows.length};
            }
        }else{
            if(cilcarPoniendoTexto(elementoTabla.titSup.divEncabezadoLat, false)){
                elementoTabla.titSup.titulando=false;
            }
        }
    }else{
        elementoTabla.titSup.titulando={modo:'arriba', cual:0, max:elementoTabla.titSup.seccionTitulo.rows[0].cells.length};
    }
    if(elementoTabla.titSup.titulando){
        setTimeout(function(){ ponerTextosEncabezados(elementoTabla); },200);
    }
}