// demo_tablas.js

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
    for(var i=0; i<2000; i++){
        filas.push([i, numero_a_letras(i), i.toString(2), numero_a_letras(i).length, numero_a_letras(numero_a_letras(i).length),numero_a_letras(numero_a_letras(i).length).length, numero_a_letras(i).length==numero_a_letras(numero_a_letras(i).length).length?'punto fijo':null,geringoso(numero_a_letras(i))]);
    }
    colocador.colocar({contenido:{tipox:'div', nodes:{tipox:'tabla', filas:filas}}});
});
