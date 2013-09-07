"use strict";

Aplicacion.prototype.creadores.juego_estructura={tipo:'tipox', descripcion:'juego basado en estructura', creador:{
    translate:function(definicion){
        return {tipox:'div', id:'el_juego', eventos
    }
}};

function crear_estructura(estructura){
	"use strict";
	for(var miembro in estructura){ if(estructura.hasOwnProperty(miembro)){
		var definicion=estructura[miembro];
		if(!es_funcion(definicion)){
			var elemento=document.createElement('div');
			elemento.id=miembro;
			definicion.elemento=elemento;
			document.body.appendChild(elemento);
			for(var atributo in definicion){ if(definicion.hasOwnProperty(atributo)){
				var valor=definicion[atributo];
				if(elemento.hasOwnProperty(atributo)){
					elemento[atributo]=valor;
				}else if(es_funcion(estructura[atributo])){
					estructura[atributo](miembro,valor);
				}
			}}
		}
	}}
}

function es_funcion(obj){
	"use strict";
	return !!(obj && obj.constructor && obj.call && obj.apply);
};