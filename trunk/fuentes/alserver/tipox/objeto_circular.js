
"use strict";

/*
Colocador.prototype.creadores.jsonStringify={
    tipo:'tipox',
    descripcion:'Muestra un objeto circular en formato JSON',
    creador:{
        
    }
}
*/

JSON.stringifyCircular=function(valor,vistos){
    vistos=vistos||[];
    var estabaEn=vistos.indexOf(valor);
    if(valor instanceof Object && valor!==null && (estabaEn>=0 || vistos.length>5)){
        return String.fromCharCode((estabaEn<=19?estabaEn:19)+9313);
    }else{
        // var nuevoVistos=vistos.concat([valor]);
        vistos.push(valor);
        var nuevoVistos=vistos
        if(valor instanceof Array){
            return '['+valor.map(function(v,i){ return JSON.stringifyCircular(v,nuevoVistos);}).join(',')+']';
        }else if(valor instanceof Object && !(valor instanceof Date) && !(valor instanceof Function) && (!valor.toJSON)){
            return '{'+Object.keys(valor).map(function(k){ return JSON.stringify(k)+':'+JSON.stringifyCircular(valor[k],nuevoVistos)}).join(',')+'}';
            return '{'+Object.keys(valor).map(function(k){ return JSON.stringify(k)+':'+valor[k]/* +JSON.stringifyCircular(valor[k],nuevoVistos)*/}).join(',')+'}';
        }else{
            return JSON.stringify(valor);
        }
    }
}