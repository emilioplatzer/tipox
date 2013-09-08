// compatibilidad.js
"use strict";

var compatibilidad={
    agregarAddEventListener:function(base){
        base.addEventListener=function(nombreEvento,funcion){
            base.attachEvent('on'+nombreEvento,funcion);
        }
    },
    agregarInnerText:function(){
        if('Element' in window){
            Object.defineProperty(Element.prototype, "innerText", {
                get: function() { return this.textContent; },
                set: function(y) { this.textContent=y; }
            });
        }
    },
    agregarDateToISOString:function(){
        // Obtenido de https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FDate%2FtoISOString 
      ( function() {
        function pad(number) {
          var r = String(number);
          if ( r.length === 1 ) {
            r = '0' + r;
          }
          return r;
        }
        Date.prototype.toISOString = function() {
          return this.getUTCFullYear()
            + '-' + pad( this.getUTCMonth() + 1 )
            + '-' + pad( this.getUTCDate() )
            + 'T' + pad( this.getUTCHours() )
            + ':' + pad( this.getUTCMinutes() )
            + ':' + pad( this.getUTCSeconds() )
            + '.' + String( (this.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 )
            + 'Z';
        };
      }() );
    },
    agregarObjectCreate:function(){
        Object.prototype.create2=function(objetoBase){
            function F(){}
            return function(o){
                if(arguments.length!=1){
                    throw new Error('Falta parametro obligatorio de Object.create');
                }
                F.prototype = o;
                return new F()
            }
        }
        Object.prototype.create=function(objetoBase){
            var f=function(){};
            f.prototype=objetoBase.prototype;
            var o=new f();
            return o;
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
        if(elementoSpan.innerText===undefined){
            this.agregarInnerText();
        }
        if(!Date.prototype.toISOString){
            this.agregarDateToISOString();
        }
        if(!Object.create || true){
            this.agregarObjectCreate();
        }
    }
}

compatibilidad.mejorar();