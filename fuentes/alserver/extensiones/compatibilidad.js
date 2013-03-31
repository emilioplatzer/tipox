"use strict";
function MostrarControlCompatibilidad(elementoId){
    var explicarEn=document.getElementById(elementoId);
    if(!explicarEn){
        explicarEn=document.createElement('div');
        explicarEn.className='Normalizr_incompatibilidades';
        document.body.appendChild(explicarEn);
    }
    var agregarParrafo=function(mensaje){
        var parrafoConIncompatibilidad=document.createElement('p');
        parrafoConIncompatibilidad.innerText=mensaje;
        explicarEn.appendChild(parrafoConIncompatibilidad);
    }
    var r=/^eh$/ig;
    if(!('test' in r)){
        agregarParrafo("!('test' in r)");
    }
    if(!r.test){
        agregarParrafo("!r.test");
    }
    if(!r.test('Eh')){
        agregarParrafo("!r.test(Eh)");
    }
    if(!(r instanceof RegExp)){
        agregarParrafo("!(r instanceof RegExp)");
    }
    if(!(typeof(r)=='object')){
        agregarParrafo("!(typeof(r)=='object') typeof(r)=="+typeof(r));
    }
    for(var prueba in Modernizr){
        if(Modernizr[prueba]===false){
            agregarParrafo('!Modernizr.'+prueba);
        }
    }
}

function debugDirecto(mensaje){
    var destino=document.getElementById('debugDirecto');
    var agregarMensaje=function(destino,mensaje){
        var nuevo_p=document.createElement('p');
        nuevo_p.innerText=mensaje;
        destino.appendChild(nuevo_p);
    }
    if(!destino){
        var destino=document.createElement('div');
        destino.id='debugDirecto';
        if(!document.body){
            window.addEventListener('load',function(){
                document.body.appendChild(destino);
                agregarMensaje(destino,mensaje);
            });
        }else{
            document.body.appendChild(destino);
            agregarMensaje(destino,mensaje);
        }
    }else{
        agregarMensaje(destino,mensaje);
    }
}

var compatibilidad={};

compatibilidad.classList=function(destino){
    if(!Modernizr.classlist){
        destino.classList={
            contains:function(clase){
                var arreglo=destino.className.split(' ');
                for(var i=0; i<arreglo.length; i++){
                    if(clase==arreglo[i]){
                        return true;
                    }
                }
                return false;
            },
            add:function(clase){
                var arreglo=destino.className.split(' ');
                for(var i=0; i<arreglo.length; i++){
                    if(clase==arreglo[i]){
                        return ;
                    }
                }
                arreglo.push(clase);
                destino.className=arreglo.join(' ');
            },
            remove:function(clase){
                var arreglo=destino.className.split(' ');
                for(var i=0; i<arreglo.length; i++){
                    while(i<arreglo.length && clase==arreglo[i]){
                        arreglo.splice(i,1);
                    }
                }
                destino.className=arreglo.join(' ');
            }
        }
    }
}
