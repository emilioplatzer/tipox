// Por $Author: emilioplatzer@gmail.com $ Revisión $Revision: 140 $ del $Date: 2013-11-24 23:34:24 -0300 (dom 24 de nov de 2013) $
"use strict";

window.controlDependencias={
    deseables:[
        'controlParametros'
    ],
    necesarios:[
        'is_object'
    ]
}

function enviarPaquete(params){
    var enviarPaqueteThis=this;
    window.controlParametros={parametros:params,
        def_params:{
            destino:{obligatorio:true, uso:'url o .php que recibe la petición'},
            datos:{validar:is_object, uso:'los datos que se envían a través de $_REQUEST'},
            cuandoOk:{obligatorio:true, uso:'función que debe ejecutarse al recibir y decodificar los datos en forma correcta'},
            cuandoFalla:{uso:'función que debe ejecutarse al ocurrir un error de cualquier tipo'},
            decodificador:{uso:'"XML" ó función que debe aplicarse a los datos retornados así como vienen del servidor en responseText'},
            codificador:{uso:'función que debe aplicarse a los datos que serán enviados como parámetro'},
            sincronico:{uso:'sincrónico o asincrónico'}
        }
    };
    if(!('cuandoFalla' in params)) params.cuandoFalla=function(x,y){ alert(x+' ('+y+')'); };
    if(!('codificador' in params)) params.codificador=function(x){ return x; };
    if(!('sincronico' in params)) params.sincronico=false;
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
                        if(params.decodificador){
                            if(params.decodificador=='XML'){
                                obtenido=peticion.responseXML;
                                if(!obtenido){
                                    throw new Error('No hay respuesta XML valida: '+rta);
                                }
                            }else{
                                try{
                                    obtenido=params.decodificador.call(enviarPaqueteThis,rta);
                                }catch(err){
                                    throw new Error('Error decodificando la respuesta: '+descripcionError(err)+' / '+rta.substr(0,100));
                                }
                            }
                        }else{
                            obtenido=rta;
                        }
                        try{
                            params.cuandoOk(obtenido);
                        }catch(err_llamador){
                            params.cuandoFalla(descripcionError(err_llamador)+' al procesar la recepcion de la peticion AJAX',2);
                        }
                    }catch(err){
                        params.cuandoFalla(descripcionError(err)+' => '+ifDebug(rta),3);
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


;(function() {
    var viejo_enviarPaquete=enviarPaquete;
    window.enviarPaquete=function(params){
        if('relojEn' in params){
            if(!params.relojEn){
                throw new Error('falta el parámetro especial relojEn');
            }
            if(params.relojEn.reloj){
                params.relojEn.parentNode.removeChild(params.relojEn.reloj);
            }
            var reloj=document.createElement('img');
            reloj.style.position='absolute';
            reloj.style.left=obtener_left_global(params.relojEn)+'px';
            reloj.style.top=obtener_top_global(params.relojEn)+'px';
            reloj.src=window.rutaImagenes+'cargando.png';
            reloj.className='girando';
            params.relojEn.parentNode.appendChild(reloj);
            params.relojEn.reloj=reloj;
            return viejo_enviarPaquete(cambiandole(params,{
                relojEn:null,
                cuandoOk:function(respuesta){
                    var rta=params.cuandoOk(respuesta);
                    if(params.relojEn.reloj===reloj){
                        reloj.src=window.rutaImagenes+'tilde.png';
                        reloj.className='desapareciendo';
                        setTimeout(function(){
                            if(params.relojEn.reloj===reloj){
                                params.relojEn.parentNode.removeChild(reloj);
                                params.relojEn.reloj=null;
                            }
                        },3000);
                    }
                    return rta;
                },
                cuandoFalla:function(mensaje){
                    if(params.relojEn.reloj===reloj){
                        reloj.src=window.rutaImagenes+'mini_error.png';
                        reloj.className='';
                        reloj.title=mensaje;
                        reloj.className='desapareciendo20';
                        setTimeout(function(){
                            if(params.relojEn.reloj===reloj){
                                params.relojEn.parentNode.removeChild(reloj);
                                params.relojEn.reloj=null;
                            }
                        },20000);
                    }
                    if(params.cuandoFalla){
                        return params.cuandoFalla(mensaje);
                    }
                }
            },true,null));
        }else{
            return viejo_enviarPaquete.apply(this,arguments);
        }
    };
})();
