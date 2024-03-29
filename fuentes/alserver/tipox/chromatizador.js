﻿// chromatizador.js
"use strict";

var chromatizador={
    agregarAddEventListener:function(base){
        base.addEventListener=function(nombreEvento,funcion){
            this.attachEvent('on'+nombreEvento,funcion);
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
            f.prototype=objetoBase;
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
    agregarDefineProperty:function(){
        //basado en: http://johndyer.name/native-browser-get-set-properties-in-javascript/
        Object.defineProperty=function(destino, propiedad, definicion){
            if(destino.__defineGetter__){
                destino.__defineGetter__(propiedad, definicion.get);
                destino.__defineSetter__(propiedad, definicion.set);
            }else{
                // IE6-7
                // must be a real DOM object (to have attachEvent) and must be attached to document (for onpropertychange to fire)
                var onPropertyChange = function (e) {
                    if (event.propertyName == propiedad) {
                        // temporarily remove the event so it doesn't fire again and create a loop
                        destino.detachEvent("onpropertychange", onPropertyChange);
                        // get the changed value, run it through the set function
                        var newValue = definicion.set.apply(destino,destino[propiedad]);
                        // restore the get function
                        destino[propiedad] = newValue;
                        destino[propiedad].toString = newValue.toString();
                        // restore the event
                        destino.attachEvent("onpropertychange", onPropertyChange);
                    }
                };
                var actualValue=definicion.get.apply(destino);
                destino[propiedad] = actualValue;
                destino[propiedad].toString = actualValue.toString();
                try{
                    destino.attachEvent("onpropertychange", onPropertyChange);
                }catch(err){
                    throw new Error('tratando de attachEvent("onpropertychange") a '+JSON.stringify(destino)+': '+err.message+'/'+err.stack);
                }
            }
        }
    },
    agregarClassList:function(destino){
        destino.classListum={
            padre:{},
            contains:function(clase){
                var arreglo=this.padre.className?this.padre.className.split(' '):[];
                for(var i=0; i<arreglo.length; i++){
                    if(clase==arreglo[i]){
                        return true;
                    }
                }
                return false;
            },
            add:function(clase){
                var arreglo=this.padre.className?this.padre.className.split(' '):[];
                for(var i=0; i<arreglo.length; i++){
                    if(clase==arreglo[i]){
                        return ;
                    }
                }
                arreglo.push(clase);
                this.padre.className=arreglo.join(' ');
            },
            remove:function(clase){
                var arreglo=this.padre.className?this.padre.className.split(' '):[];
                for(var i=0; i<arreglo.length; i++){
                    while(i<arreglo.length && clase==arreglo[i]){
                        arreglo.splice(i,1);
                    }
                }
                this.padre.className=arreglo.join(' ')||null;
            }
        }
        Object.defineProperty(destino,"classList", {
            get:function(){ 
                this.classListum.padre=this;
                return this.classListum;
            },
            set:function(val){
                this.classListum.padre=this;
                this.classListum = val;
            }
        });
},
    agregarDataset:function(destino){
        Object.defineProperty(destino,"dataset",{
            get:function(){
                if(!('datasetum' in this)){
                    this.datasetum={};
                }
                return this.datasetum;
            },
            set:function(val){
                if(!('datasetum' in this)){
                    this.datasetum={};
                }
                this.datasetum = val;
            }
        });
    },
    agregarJSON:function(){
        /*
            json2.js
            2013-05-26

            Public Domain.

            NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

            See http://www.JSON.org/js.html


            This code should be minified before deployment.
            See http://javascript.crockford.com/jsmin.html

            USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
            NOT CONTROL.


            This file creates a global JSON object containing two methods: stringify
            and parse.

                JSON.stringify(value, replacer, space)
                    value       any JavaScript value, usually an object or array.

                    replacer    an optional parameter that determines how object
                                values are stringified for objects. It can be a
                                function or an array of strings.

                    space       an optional parameter that specifies the indentation
                                of nested structures. If it is omitted, the text will
                                be packed without extra whitespace. If it is a number,
                                it will specify the number of spaces to indent at each
                                level. If it is a string (such as '\t' or '&nbsp;'),
                                it contains the characters used to indent at each level.

                    This method produces a JSON text from a JavaScript value.

                    When an object value is found, if the object contains a toJSON
                    method, its toJSON method will be called and the result will be
                    stringified. A toJSON method does not serialize: it returns the
                    value represented by the name/value pair that should be serialized,
                    or undefined if nothing should be serialized. The toJSON method
                    will be passed the key associated with the value, and this will be
                    bound to the value

                    For example, this would serialize Dates as ISO strings.

                        Date.prototype.toJSON = function (key) {
                            function f(n) {
                                // Format integers to have at least two digits.
                                return n < 10 ? '0' + n : n;
                            }

                            return this.getUTCFullYear()   + '-' +
                                 f(this.getUTCMonth() + 1) + '-' +
                                 f(this.getUTCDate())      + 'T' +
                                 f(this.getUTCHours())     + ':' +
                                 f(this.getUTCMinutes())   + ':' +
                                 f(this.getUTCSeconds())   + 'Z';
                        };

                    You can provide an optional replacer method. It will be passed the
                    key and value of each member, with this bound to the containing
                    object. The value that is returned from your method will be
                    serialized. If your method returns undefined, then the member will
                    be excluded from the serialization.

                    If the replacer parameter is an array of strings, then it will be
                    used to select the members to be serialized. It filters the results
                    such that only members with keys listed in the replacer array are
                    stringified.

                    Values that do not have JSON representations, such as undefined or
                    functions, will not be serialized. Such values in objects will be
                    dropped; in arrays they will be replaced with null. You can use
                    a replacer function to replace those with JSON values.
                    JSON.stringify(undefined) returns undefined.

                    The optional space parameter produces a stringification of the
                    value that is filled with line breaks and indentation to make it
                    easier to read.

                    If the space parameter is a non-empty string, then that string will
                    be used for indentation. If the space parameter is a number, then
                    the indentation will be that many spaces.

                    Example:

                    text = JSON.stringify(['e', {pluribus: 'unum'}]);
                    // text is '["e",{"pluribus":"unum"}]'


                    text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
                    // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

                    text = JSON.stringify([new Date()], function (key, value) {
                        return this[key] instanceof Date ?
                            'Date(' + this[key] + ')' : value;
                    });
                    // text is '["Date(---current time---)"]'


                JSON.parse(text, reviver)
                    This method parses a JSON text to produce an object or array.
                    It can throw a SyntaxError exception.

                    The optional reviver parameter is a function that can filter and
                    transform the results. It receives each of the keys and values,
                    and its return value is used instead of the original value.
                    If it returns what it received, then the structure is not modified.
                    If it returns undefined then the member is deleted.

                    Example:

                    // Parse the text. Values that look like ISO date strings will
                    // be converted to Date objects.

                    myData = JSON.parse(text, function (key, value) {
                        var a;
                        if (typeof value === 'string') {
                            a =
        /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                            if (a) {
                                return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                                    +a[5], +a[6]));
                            }
                        }
                        return value;
                    });

                    myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                        var d;
                        if (typeof value === 'string' &&
                                value.slice(0, 5) === 'Date(' &&
                                value.slice(-1) === ')') {
                            d = new Date(value.slice(5, -1));
                            if (d) {
                                return d;
                            }
                        }
                        return value;
                    });


            This is a reference implementation. You are free to copy, modify, or
            redistribute.
        */

        /*jslint evil: true, regexp: true */

        /*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
            call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
            getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
            lastIndex, length, parse, prototype, push, replace, slice, stringify,
            test, toJSON, toString, valueOf
        */


        // Create a JSON object only if one does not already exist. We create the
        // methods in a closure to avoid creating global variables.

        if (typeof JSON !== 'object') {
            JSON = {};
        }

        (function () {
            'use strict';

            function f(n) {
                // Format integers to have at least two digits.
                return n < 10 ? '0' + n : n;
            }

            if (typeof Date.prototype.toJSON !== 'function') {

                Date.prototype.toJSON = function () {

                    return isFinite(this.valueOf())
                        ? this.getUTCFullYear()     + '-' +
                            f(this.getUTCMonth() + 1) + '-' +
                            f(this.getUTCDate())      + 'T' +
                            f(this.getUTCHours())     + ':' +
                            f(this.getUTCMinutes())   + ':' +
                            f(this.getUTCSeconds())   + 'Z'
                        : null;
                };

                String.prototype.toJSON      =
                    Number.prototype.toJSON  =
                    Boolean.prototype.toJSON = function () {
                        return this.valueOf();
                    };
            }

            var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                gap,
                indent,
                meta = {    // table of character substitutions
                    '\b': '\\b',
                    '\t': '\\t',
                    '\n': '\\n',
                    '\f': '\\f',
                    '\r': '\\r',
                    '"' : '\\"',
                    '\\': '\\\\'
                },
                rep;


            function quote(string) {

        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.

                escapable.lastIndex = 0;
                return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                    var c = meta[a];
                    return typeof c === 'string'
                        ? c
                        : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                }) + '"' : '"' + string + '"';
            }


            function str(key, holder) {

        // Produce a string from holder[key].

                var i,          // The loop counter.
                    k,          // The member key.
                    v,          // The member value.
                    length,
                    mind = gap,
                    partial,
                    value = holder[key];

        // If the value has a toJSON method, call it to obtain a replacement value.

                if (value && typeof value === 'object' &&
                        typeof value.toJSON === 'function') {
                    value = value.toJSON(key);
                }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.

                if (typeof rep === 'function') {
                    value = rep.call(holder, key, value);
                }

        // What happens next depends on the value's type.

                switch (typeof value) {
                case 'string':
                    return quote(value);

                case 'number':

        // JSON numbers must be finite. Encode non-finite numbers as null.

                    return isFinite(value) ? String(value) : 'null';

                case 'boolean':
                case 'null':

        // If the value is a boolean or null, convert it to a string. Note:
        // typeof null does not produce 'null'. The case is included here in
        // the remote chance that this gets fixed someday.

                    return String(value);

        // If the type is 'object', we might be dealing with an object or an array or
        // null.

                case 'object':

        // Due to a specification blunder in ECMAScript, typeof null is 'object',
        // so watch out for that case.

                    if (!value) {
                        return 'null';
                    }

        // Make an array to hold the partial results of stringifying this object value.

                    gap += indent;
                    partial = [];

        // Is the value an array?

                    if (Object.prototype.toString.apply(value) === '[object Array]') {

        // The value is an array. Stringify every element. Use null as a placeholder
        // for non-JSON values.

                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }

        // Join all of the elements together, separated with commas, and wrap them in
        // brackets.

                        v = partial.length === 0
                            ? '[]'
                            : gap
                            ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                            : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }

        // If the replacer is an array, use it to select the members to be stringified.

                    if (rep && typeof rep === 'object') {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            if (typeof rep[i] === 'string') {
                                k = rep[i];
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    } else {

        // Otherwise, iterate through all of the keys in the object.

                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    }

        // Join all of the member texts together, separated with commas,
        // and wrap them in braces.

                    v = partial.length === 0
                        ? '{}'
                        : gap
                        ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                        : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
                }
            }

        // If the JSON object does not yet have a stringify method, give it one.

            if (typeof JSON.stringify !== 'function') {
                JSON.stringify = function (value, replacer, space) {

        // The stringify method takes a value and an optional replacer, and an optional
        // space parameter, and returns a JSON text. The replacer can be a function
        // that can replace values, or an array of strings that will select the keys.
        // A default replacer method can be provided. Use of the space parameter can
        // produce text that is more easily readable.

                    var i;
                    gap = '';
                    indent = '';

        // If the space parameter is a number, make an indent string containing that
        // many spaces.

                    if (typeof space === 'number') {
                        for (i = 0; i < space; i += 1) {
                            indent += ' ';
                        }

        // If the space parameter is a string, it will be used as the indent string.

                    } else if (typeof space === 'string') {
                        indent = space;
                    }

        // If there is a replacer, it must be a function or an array.
        // Otherwise, throw an error.

                    rep = replacer;
                    if (replacer && typeof replacer !== 'function' &&
                            (typeof replacer !== 'object' ||
                            typeof replacer.length !== 'number')) {
                        throw new Error('JSON.stringify');
                    }

        // Make a fake root object containing our value under the key of ''.
        // Return the result of stringifying the value.

                    return str('', {'': value});
                };
            }


        // If the JSON object does not yet have a parse method, give it one.

            if (typeof JSON.parse !== 'function') {
                JSON.parse = function (text, reviver) {

        // The parse method takes a text and an optional reviver function, and returns
        // a JavaScript value if the text is a valid JSON text.

                    var j;

                    function walk(holder, key) {

        // The walk method is used to recursively walk the resulting structure so
        // that modifications can be made.

                        var k, v, value = holder[key];
                        if (value && typeof value === 'object') {
                            for (k in value) {
                                if (Object.prototype.hasOwnProperty.call(value, k)) {
                                    v = walk(value, k);
                                    if (v !== undefined) {
                                        value[k] = v;
                                    } else {
                                        delete value[k];
                                    }
                                }
                            }
                        }
                        return reviver.call(holder, key, value);
                    }


        // Parsing happens in four stages. In the first stage, we replace certain
        // Unicode characters with escape sequences. JavaScript handles many characters
        // incorrectly, either silently deleting them, or treating them as line endings.

                    text = String(text);
                    cx.lastIndex = 0;
                    if (cx.test(text)) {
                        text = text.replace(cx, function (a) {
                            return '\\u' +
                                ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                        });
                    }

        // In the second stage, we run the text against regular expressions that look
        // for non-JSON patterns. We are especially concerned with '()' and 'new'
        // because they can cause invocation, and '=' because it can cause mutation.
        // But just to be safe, we want to reject all unexpected forms.

        // We split the second stage into 4 regexp operations in order to work around
        // crippling inefficiencies in IE's and Safari's regexp engines. First we
        // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
        // replace all simple value tokens with ']' characters. Third, we delete all
        // open brackets that follow a colon or comma or that begin the text. Finally,
        // we look to see that the remaining characters are only whitespace or ']' or
        // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

                    if (/^[\],:{}\s]*$/
                            .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                                .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                                .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

        // In the third stage we use the eval function to compile the text into a
        // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
        // in JavaScript: it can begin a block or an object literal. We wrap the text
        // in parens to eliminate the ambiguity.

                        j = eval('(' + text + ')');

        // In the optional fourth stage, we recursively walk the new structure, passing
        // each name/value pair to a reviver function for possible transformation.

                        return typeof reviver === 'function'
                            ? walk({'': j}, '')
                            : j;
                    }

        // If the text is not JSON parseable, then a SyntaxError is thrown.

                    throw new SyntaxError('JSON.parse');
                };
            }
        }());
    },
    agregados:{
    },
    chromatizar:function(){
        var elementoSpan=document.createElement('span');
        if(!window.addEventListener){ // IE8
            this.agregarAddEventListener(window);
        }
        if(!window.Element){ // IE6 
            this.agregados.Element=true;
            window.Element=Object;
        }
        if(!window.JSON){ // IE6 
            this.agregarJSON();
        }
        if(!Object.defineProperty){ // IE6
            this.agregados.defineProperty=true;
            this.agregarDefineProperty(); 
        }
        if(!elementoSpan.addEventListener){ // IE8
            this.agregarAddEventListener(Element.prototype);
        }
        if(elementoSpan.innerText===undefined){ // FireFox
            this.agregarInnerText();
        }
        if(!Date.prototype.toISOString){ // IE8
            this.agregarDateToISOString();
        }
        if(!Object.create){ // IE8
            this.agregados.objectCreate=true;
            this.agregarObjectCreate();
        }
        if(isNaN(fechaAmd('2001-12-31').getTime()) || true){ // Safari
            this.mejorarFechaAmd();
        }
        if(!Array.prototype.map){ // IE8
            this.agregarArrayMap();
        }
        if(!elementoSpan.classList){ // IE8
            if(!this.agregados.defineProperty){ //IE6
                this.agregarClassList(Element.prototype);
            }
        }
        if(!elementoSpan.dataset){ // IE8
            if(!this.agregados.defineProperty){
                this.agregarDataset(Element.prototype);
            }
        }
    }
}

chromatizador.chromatizar();
