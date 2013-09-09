// chromatizador.js
"use strict";

var chromatizador={
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
    mejorarFechaAmd:function(){
        window.fechaAmd=function(fechaAnnoMesDia){
            if(typeof fechaAnnoMesDia == 'string'){
                var partes=fechaAnnoMesDia.match(/(\d+)/g);
                partes.map(Number);
                if(partes.lenght>1){
                    partes[1]--;
                }
                if(partes.length==3){
                    return new Date(partes[0],partes[1],partes[2]);
                }else{
                    throw new Error("Cantidad invalida de argumentos en fechaAmd");
                }
            }else{
                throw new Error("Argumento invalido en fechaAmd");
            }
        }
    },
    agregarArrayMap:function(){
      // Obtenido en: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
      Array.prototype.map = function(callback, thisArg) {
        var T, A, k;
        if (this == null) {
          throw new TypeError(" this is null or not defined");
        }
        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);
        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;
        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
          throw new TypeError(callback + " is not a function");
        }
        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (thisArg) {
          T = thisArg;
        }
        // 6. Let A be a new array created as if by the expression new Array(len) where Array is
        // the standard built-in constructor with that name and len is the value of len.
        A = new Array(len);
        // 7. Let k be 0
        k = 0;
        // 8. Repeat, while k < len
        while(k < len) {
          var kValue, mappedValue;
          // a. Let Pk be ToString(k).
          //   This is implicit for LHS operands of the in operator
          // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
          //   This step can be combined with c
          // c. If kPresent is true, then
          if (k in O) {
            // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
            kValue = O[ k ];
            // ii. Let mappedValue be the result of calling the Call internal method of callback
            // with T as the this value and argument list containing kValue, k, and O.
            mappedValue = callback.call(T, kValue, k, O);
            // iii. Call the DefineOwnProperty internal method of A with arguments
            // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
            // and false.
            // In browsers that support Object.defineProperty, use the following:
            // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });
            // For best browser support, use the following:
            A[ k ] = mappedValue;
          }
          // d. Increase k by 1.
          k++;
        }
        // 9. return A
        return A;
      };      
    },
    chromatizar:function(){
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
        if(!Object.create){
            this.agregarObjectCreate();
        }
        if(isNaN(fechaAmd('2001-12-31').getTime()) || true){
            this.mejorarFechaAmd();
        }
        if(!Array.prototype.map){
            this.agregarArrayMap();
        }
    }
}

chromatizador.chromatizar();