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
    if(!Modernizr.classList){
        destino.__defineGetter__("classList", function(){
            this.classListum.padre=this;
            return this.classListum;
        });
        destino.__defineSetter__("classList", function(val){
            this.classListum.padre=this;
            this.classListum = val;
        });
        destino.classListum={
            padre:{},
            contains:function(clase){
                var arreglo=(this.padre.className||'').split(' ');
                for(var i=0; i<arreglo.length; i++){
                    if(clase==arreglo[i]){
                        return true;
                    }
                }
                return false;
            },
            add:function(clase){
                var arreglo=(this.padre.className||'').split(' ');
                for(var i=0; i<arreglo.length; i++){
                    if(clase==arreglo[i]){
                        return ;
                    }
                }
                arreglo.push(clase);
                this.padre.className=arreglo.join(' ')||null;
            },
            remove:function(clase){
                var arreglo=(this.padre.className||'').split(' ');
                for(var i=0; i<arreglo.length; i++){
                    while(i<arreglo.length && clase==arreglo[i]){
                        arreglo.splice(i,1);
                    }
                }
               this. padre.className=arreglo.join(' ')||null;
            }
        }
    }
}

compatibilidad.dataset=function(destino){
    if(!Modernizr.dataset){
        destino.__defineGetter__("dataset", function(){
            if(!('datasetum' in this)){
                this.datasetum={};
            }
            return this.datasetum;
        });
        destino.__defineSetter__("dataset", function(val){
            if(!('datasetum' in this)){
                this.datasetum={};
            }
            this.datasetum = val;
        });
    }
}

if(Modernizr.dataset && window.Aplicacion && window.Aplicacion.prototype.casosDePrueba){
Aplicacion.prototype.casosDePrueba.push({
    modulo:'creación de elementos del DOM a través de objetos tipox',
    funcion:'pruebaGrabSimple',
    caso:'prueba de dataset comprobado con innerHTML',
    entrada:[{tipox:'div', id:'id1', dataset:{uno:'uno', otroAtributoInterno:'otro'}}],
    salida:/<div id="id1" data-uno="uno" data-otro-?atributo-?interno="otro"><\/div>/
});
}

// -------------- activar compatibilidad con navegadores viejos  ---------------------
if(!Modernizr.classList /* || true*/){
    compatibilidad.classList(HTMLElement.prototype);
}

if(!Modernizr.dataset /*|| true*/){
    compatibilidad.dataset(HTMLElement.prototype);
}
