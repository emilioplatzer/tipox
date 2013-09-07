// compatibilidad.js
"use strict";

var compatibilidad={
    agregarAddEventListener:function(base){
        base.addEventListener=function(nombreEvento,funcion){
            base.attachEvent('on'+nombreEvento,funcion);
        }
    },
    mejorar:function(){
        var elementoSpan=document.createElement('span');
        if(!window.addEventListener){
            this.agregarAddEventListener(window);
        }
        if(!elementoSpan.addEventListener){
            this.agregarAddEventListener(Element.prototype);
        }
        var innerTextModificable=elementoSpan.innerText!==undefined;
        if(!innerTextModificable){
            if('Element' in window){
                Object.defineProperty(Element.prototype, "innerText", {
                    get: function() { return this.textContent; },
                    set: function(y) { this.textContent=y; }
                });
            }
        }
    }
}

compatibilidad.mejorar();