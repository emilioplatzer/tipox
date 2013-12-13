// Por $Author: emilioplatzer@gmail.com $ Revisión $Revision: 140 $ del $Date: 2013-11-24 23:34:24 -0300 (dom 24 de nov de 2013) $
"use strict";

var controlar=app_global.controlador.controlar;

function enviarPaquete(params){
    var enviarPaqueteThis=this;
    controlar(params,{
        destino:{obligatorio:true, uso:'url o .php que recibe la petición'},
        datos:{validar:is_object, uso:'los datos que se envían a través de $_REQUEST'},
        cuandoOk:{obligatorio:true, uso:'función que debe ejecutarse al recibir y decodificar los datos en forma correcta'},
        cuandoFalla:{predeterminado:function(x,y){ alert(x+' ('+y+')'); }, uso:'función que debe ejecutarse al ocurrir un error de cualquier tipo'},
        decodificador:{predeterminado:JSON.parse, uso:'función que debe aplicarse a los datos retornados así como vienen del servidor en responseText'},
        codificador:{predeterminado:JSON.stringify, uso:'función que debe aplicarse a los datos que serán enviados como parámetro'},
        sincronico:{predeterminado:false, uso:'sincrónico o asincrónico'},
    });
    var peticion=new XMLHttpRequest();
    var ifDebug=function(x){ return x; };
    peticion.onreadystatechange=function(){
        switch(peticion.readyState) {
        case 4: 
            try{
                var rta = peticion.responseText;
                if(peticion.status!=200){
                    params.cuandoFalla('Error de status '+peticion.status+' '+peticion.statusText,1);
                }else if(rta){
                    try{
                        var obtenido;
                        obtenido=params.decodificador.call(enviarPaqueteThis,rta);
                        try{
                            params.cuandoOk(obtenido);
                        }catch(err_llamador){
                            params.cuandoFalla(descripcionError(err_llamador)+' al procesar la recepcion de la peticion AJAX',2);
                        }
                    }catch(err_json){
                        params.cuandoFalla('ERROR PARSEANDO EL JSON '+':'+descripcionError(err_json)+' => '+ifDebug(rta),3);
                    }
                }else{
                    params.cuandoFalla('ERROR sin respuesta en la peticion AJAX',4);
                }
            }catch(err){
                params.cuandoFalla('ERROR en el proceso de transmision AJAX '+descripcionError(err),5);
            }
        }
    }
    try{
        peticion.open('POST', params.destino, !params.sincronico); // !sincronico);
        peticion.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        var parametros=Object.keys(params.datos).map(function(key){ 
            return encodeURIComponent(key)+'='+encodeURIComponent(params.codificador.call(enviarPaqueteThis,params.datos[key]));
        }).join('&');
        peticion.send(parametros);
    }catch(err){
        params.cuandoFalla(descripcionError(err),6);
    }
}
