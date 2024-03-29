﻿// Por $Author$ Revisión $Revision$ del $Date$
"use strict";

window.controlDependencias={
    necesario:[ 'is_string', 'is_function' ]
}

// Aplicacion.prototype.eventos.toggleDisplayAbajo=function(evento,elemento){
    // var hermano=elemento.nextSibling;
    // hermano.style.display=hermano.style.display?null:'none';
// }

function FlujoDirectoProbador(){
    var listoParaEnviar=false;
    var preparado=false;
    var destino;
    var mensajesPendientes;
    var agregarMensaje;
    var maxProfundidadPredeterminada=10;
    var preparar=function(){
        destino=document.getElementById('debugDirecto');
        listoParaEnviar=true;
        if(!destino){
            destino=document.createElement('div');
            destino.id='debugDirecto';
            if(!document.body){
                mensajesPendientes=[];
                listoParaEnviar=false;
                window.addEventListener('load',function(){
                    document.body.appendChild(destino);
                    for(var i_mensajesPendientes=0; i_mensajesPendientes<mensajesPendientes.length; i_mensajesPendientes++){
                        agregarMensaje(destino,mensajesPendientes[i_mensajesPendientes]);
                    }
                    mensajesPendientes=false;
                    listoParaEnviar=true;
                });
            }else{
                document.body.appendChild(destino);
            }
        }
        var ponerValorEn=function(destino,mensaje,maxProfundidad,profundidad){
            var mensajeString;
            if(typeof mensaje == 'object' && !(mensaje instanceof Date)){
                if(profundidad>=maxProfundidad){
                    var boton=document.createElement('button');
                    boton.innerText='+';
                    // boton.datosPonerValorEn=mensaje;
                    boton.addEventListener('click',function(){
                        ponerValorEn(destino,mensaje,maxProfundidad+maxProfundidadPredeterminada,profundidad);
                        this.style.display='none';
                    });
                    destino.appendChild(boton);
                }else{
                    var tabla=document.createElement('table');
                    var fila;
                    var celda;
                    var celdaMargen;
                    if(mensaje instanceof Array){
                        fila=tabla.insertRow(-1);
                        celdaMargen=fila.insertCell(-1);
                        celdaMargen.className='JSON_Array_Margin';
                        celdaMargen.innerText=' ';
                        tabla.className='JSON_Array_Table';
                    }else{
                        tabla.className='JSON_Object';
                    }
                    var cantidad=0;
                    for(var i in mensaje) if(mensaje.hasOwnProperty(i)){
                        fila=tabla.insertRow(-1);
                        celda=fila.insertCell(-1);
                        celda.innerText=i;
                        celda.className='JSON_index';
                        celda=fila.insertCell(-1);
                        ponerValorEn(celda,mensaje[i],maxProfundidad,profundidad+1);
                        cantidad++;
                    }
                    if(celdaMargen){
                        celdaMargen.rowSpan=cantidad+1;
                    }
                    destino.appendChild(tabla);
                }
            }else{
                try{
                    mensajeString=JSON.stringify(mensaje);
                    if(mensaje===undefined){
                        destino.innerText='undefined';
                        destino.className='JSON_undefined';
                    }else if(mensaje===null){
                        destino.innerText='null';
                        destino.className='JSON_null';
                    }else{
                        destino.innerText=mensajeString;
                        destino.className='JSON_'+typeof mensaje;
                    }
                }catch(err){
                    destino.innerText=mensajeString;
                }
            }
        }
        agregarMensaje=function(mensaje){
            var nuevo_div=document.createElement('div');
            ponerValorEn(nuevo_div,mensaje,maxProfundidadPredeterminada,0);
            destino.appendChild(nuevo_div);
        }
        preparado=true;
    }
    this.enviar=function(mensaje){
        if(!preparado){
            preparar();
        }
        if(listoParaEnviar){
            agregarMensaje(mensaje);
        }else{
            mensajesPendientes.push(mensaje);
        }
    }
}

function Probador(){
    this.casosDePrueba=[];
    this.cantidadPruebas=0;
    this.cantidadPruebasPorModulos={};
    this.pendientesPorModulos={};
    this.errores=0;
    this.mensajes=new FlujoDirectoProbador();
    this.app=app_global;
}

Probador.prototype.probarTodo=function(params){
    if(params.sinTryCatch){
        this.correrPruebas(params);
    }else{
        try{
            this.correrPruebas(params);
        }catch(err){
            this.mensajes.enviar({
                error:descripcionError(err),
                stack:err.stack
            });
        }
    }
    if(params.soloProbar){
        this.mensajes.enviar({
            clase:'advertencia_importante',
            texto:'¡Atención! Solo se están probando algunos casos.'
        });
    }
}

Probador.prototype.correrPruebas=function(params){
    this.casosPendientes=[]; // para hacer la cola de los que faltan ejecutar
    this.casosExistentes={}; // para controlar duplicados
    this.elementosBloqueados={}; // para controlar que no se ejecuten dos pruebas que necesitan los mismos elementos (con su id)
    for(var i in this.casosDePrueba) if(this.casosDePrueba.hasOwnProperty(i)){
        var caso=this.casosDePrueba[i];
        this.registrarCaso(caso,params);
    }
    this.probarVariosCasos(20);
    // document.getElementById('TDD_caso:así se ven lo errores en los casos de prueba fallidos').parentNode.style.display='none';
}

Probador.prototype.registrarCaso=function(caso,params){
    window.controlParametros={parametros:caso, def_params:{
        funcion:   {obligatorio:true, validar:is_string, uso:'función que se va a probar'},
        modulo:    {obligatorio:true, validar:is_string, uso:'nombre del módulo'},
        caso:      {validar:is_string, uso:'nombre del caso (si no se especifica se usa el nombre de la función con sus parámetros)'},
        entrada:   {uso:'Parámetros de entrada de la función que se va a probar'},
        esperado:  {uso:'Valores esperados', controlar:{
            resultado: {uso:'lo devuelto por la función'}
        }},
        objetoThis:{uso:'Objeto al que se le aplicará la función'},
        constructorThis:{validar:is_function, uso:'función que se llamará para construir el objeto this'},
        elementos: {uso:'Elementos que deben exisitir en el DOM para que se pueda correr la prueba'},
        ignorado:  {uso:'Indica si el caso debe ignorarse, se puede especificar un número de ticket'},
        mostrarAunqueNoFalleHasta:{uso:'Muestra el resultado de la prueba aunque no falle hasta la fecha especificada'},
        aclaracionSiFalla:{uso:'Texto qué debe mostrar si falla la prueba'}
        // elementos:{uso:''}
    }};
    if('objetoThis' in caso && 'constructorThis' in caso) throw new Error('no se puede especificar simultaneamente objetoThis y constructorThis');
    if(!(caso.modulo in this.pendientesPorModulos)){
        this.pendientesPorModulos[caso.modulo]=0;
    }
    if(!caso.caso){
        var cadenaParametros=JSON.stringify(caso.entrada);
        caso.caso=caso.funcion+'('+cadenaParametros.substr(1,cadenaParametros.length-2)+')';
    }
    var pendiente=!caso.ignorado && (!params.soloProbar || params.soloProbar[caso.caso])
    var mensaje={
        modulo:caso.modulo, 
        caso:caso.caso, 
        estado:caso.ignorado?'ignorada':(pendiente?'pendiente':'salteada')
    }
    var tituloCaso=[caso.caso];
    if(caso.ignorado && caso.ignorado.substr && caso.ignorado.substr(0,1)=='#' && this.app.tracUrl){  
        mensaje.ticket=caso.ignorado;
    }
    this.mensajes.enviar(mensaje);
    // FALTA:
    // var nodosInternos=[{tipox:'div', classList:['TDD_caso_titulo',clase], id:idCaso+'_titulo', nodes:tituloCaso, dataset:{clasePrueba:clase}}];
    // if(caso.aclaracionSiFalla){
        // nodosInternos.push({tipox:'div', className:'TDD_aclaracion', id:idCaso+'_aclaracion', nodes:caso.aclaracionSiFalla});
    // }
    if(mensaje.estado=='pendiente'){
        this.pendientesPorModulos[caso.modulo]++;
        this.casosPendientes.push(caso);
    }
    if(caso.caso in this.casosExistentes){
        this.app.lanzarExcepcion('Nombre de caso de prueba duplicado '+caso.caso);
    }
    this.casosExistentes[caso.caso]={};
}

Probador.prototype.probarVariosCasos=function(cuantos){
    var procesarHasta=(new Date()).getTime()+500;
    var seguirProcesando=cuantos;
    while(this.casosPendientes.length && seguirProcesando && (new Date()).getTime()<procesarHasta){
        var caso=this.casosPendientes.shift();
        var hayBloqueados=false;
        if(caso.elementos){
            // alertarUnaVez('va a procesar elementos ');
            for(var elemento in caso.elementos) if(caso.elementos.hasOwnProperty(elemento)){
                if(document.getElementById(caso.elementos[elemento].id||elemento) || this.elementosBloqueados[caso.elementos[elemento].id||elemento]){
                    hayBloqueados=true;
                    // alertarUnaVez('hay elementos bloqueados ('+caso.elementos[elemento].id+'||'+elemento+'), '+JSON.stringify(this.elementosBloqueados)+' / '+JSON.stringify(caso.elementos));
                    break;
                }
            }
        }
        if(hayBloqueados){
            this.mensajes.enviar({modulo:caso.modulo, caso:caso.caso, estado:'en_espera'});
            this.casosPendientes.push(caso);
        }else{
            // alertarUnaVez('va a probar el caso ',caso.elementos);
            this.probarElCaso(caso);
        }
        seguirProcesando--;
    }
    var este=this;
    if(this.casosPendientes.length){
        // alertarUnaVez('quedan '+this.casosPendientes.length+' casos pendientes');
        setTimeout(function(){ este.probarVariosCasos(cuantos); },100);
    }
}

function ArgumentoEspecial(){
}

function ArgumentoEspecialMonovalente(){
}

function ArgumentoEspecialRegExp(regexp){
    this.compatible=function(obtenido){
        return obtenido.match(regexp);
    }
    this.mostrarEsperado=function(){
        // alert('mostrarEsperado '+"/"+regexp.source+"/"+(regexp.global?'g':'')+(regexp.ignoreCase?'i':'')+(regexp.multiline?'m':''));
        return "/"+regexp.source+"/"+(regexp.global?'g':'')+(regexp.ignoreCase?'i':'')+(regexp.multiline?'m':'')
    }
    this.mostrarIguales=function(obtenido){
        // alert('mostrar Iguales '+this.mostrarEsperado()+' ~ '+JSON.stringify(obtenido));
        return this.mostrarEsperado()+' ~ '+JSON.stringify(obtenido);
    }
}
ArgumentoEspecialRegExp.prototype=Object.create(ArgumentoEspecialMonovalente.prototype);

/*
function ArgumentoEspecialElemento(definicion){
    this.compatible=function(obtenido){
        return obtenido.id;
    }
    this.mostrarEsperado=function(){
        // alert('mostrarEsperado '+"/"+regexp.source+"/"+(regexp.global?'g':'')+(regexp.ignoreCase?'i':'')+(regexp.multiline?'m':''));
        return "/"+regexp.source+"/"+(regexp.global?'g':'')+(regexp.ignoreCase?'i':'')+(regexp.multiline?'m':'')
    }
    this.mostrarIguales=function(obtenido){
        // alert('mostrar Iguales '+this.mostrarEsperado()+' ~ '+JSON.stringify(obtenido));
        return this.mostrarEsperado()+' ~ '+JSON.stringify(obtenido);
    }
}
ArgumentoEspecialElemento.prototype=Object.create(ArgumentoEspecialMonovalente.prototype);
*/

function ArgumentoEspecialColeccion(){
}

function ArgumentoEspecialAsincronico(canal){
}

function ArgumentoEspecialAsimetrico(camposMinimos){
    this.camposMinimos=camposMinimos;
    this.mostrarSobrantes=false;
}
ArgumentoEspecialAsimetrico.prototype=Object.create(ArgumentoEspecialColeccion.prototype);

function ArgumentoEspecialIgnorarSobrantes(camposMinimos){
    this.camposMinimos=camposMinimos;
    this.mostrarSobrantes=true;
}
ArgumentoEspecialIgnorarSobrantes.prototype=Object.create(ArgumentoEspecialColeccion.prototype);

Probador.prototype.probarElCaso=function(caso){
    this.mensajes.enviar({modulo:caso.modulo, caso:caso.caso, estado:'comenzada'});
    if(caso.elementos){
        var zona_de_pruebas=this.colocador.colocar({
            contenido:{tipox:'div', id:'TDD_zona_de_pruebas'}, 
            reciclar:true
        });
        var zona_de_prueba=this.colocador.colocar({
            destino:'TDD_zona_de_pruebas', 
            contenido:{tipox:'div', id:'TDD_zona_'+caso.caso, className:'TDD_una_prueba'}, 
            reciclar:true
        });
        for(var elemento in caso.elementos) if(caso.elementos.hasOwnProperty(elemento)){
            this.elementosBloqueados[caso.elementos[elemento].id||elemento]=true;
            var defElemento=caso.elementos[elemento];
            if(defElemento){
                this.colocador.colocar({destino:'TDD_zona_'+caso.caso, contenido:cambiandole({id:elemento},defElemento)});
            }
        }
    }
    var esto;
    if('constructorThis' in caso){
        esto=new caso.constructorThis();
        if(!esto) throw new Error('el constructorThis no construye un objeto');
    }else if('objetoThis' in caso){
        esto=caso.objetoThis;
        if(!esto) throw new Error('el objetoThis no es un objeto');
    }else{
        esto=window;
    }
    var esperado=cambiandole(caso.esperado,{});
    if(esto===window){
        if(caso.miembros){
            app.lanzarExcepcion("no se puede poner miembros en un caso con esto=window en caso:"+caso.caso);
        }
    }else{
        if(caso.miembros){
            for(var nombreMiembro in caso.miembros) if(caso.miembros.hasOwnProperty(nombreMiembro)){
                var valorMiembro=caso.miembros[nombreMiembro]
                if(valorMiembro instanceof ArgumentoEspecialAsincronico){
                    caso.asincronico=true;
                    esto[nombreMiembro]=function(recibidoAsincronicamente){
                        obtenido.asincronico[valorMiembro.canal]=recibidoAsincronicamente;
                    }
                }else{
                    esto[nombreMiembro]=valorMiembro;
                }
            }
        }
        if(!('objetoThis' in esperado)){
            esperado.This=this.textoDeCampos(esto);
        }
    }
    var parametros=[];
    if(caso.entrada){
        for(var i_parametro=0; i_parametro<caso.entrada.length; i_parametro++){
            var valorParametro=caso.entrada[i_parametro]
            if(valorParametro instanceof ArgumentoEspecialAsincronico){
                caso.asincronico=true;
                parametros.push(function(recibidoAsincronicamente){
                    obtenido.asincronico[valorParametro.canal]=recibidoAsincronicamente;
                    this.compararObtenido(caso,esperado,obtenido);
                });
            }else{
                parametros.push(valorParametro);
            }
        }
    }
    if(caso.preparar){
        caso.preparar.call(esto);
    }
    if(caso.mocks){
        this.app.lanzarExcepcion("revisar si esto es siempre lo que quiero al crear un mock");
        esto=this.app.appMock(caso);
        esto[caso.funcion]=this.app[caso.funcion];
        esto.domCreator=this.app.domCreator;
        esto.creadores=this.app.creadores;
    }
    var obtenido={};
    esperado.entrada=esperado.entrada||this.textoDeCampos(caso.entrada);
    var correrCaso=function(){
        if(!esto){
            this.app.lanzarExcepcion("no se puede probar sin 'entradaThis' en caso:"+caso.caso);
        }
        obtenido.This=esto;
        if(esperado.documento){
            obtenido.documento=document;
        }
        if(!(caso.funcion in esto)) throw new Error('no existe la funcion "'+caso.funcion+'" en el objeto');
        if(!is_function(esto[caso.funcion])) throw new Error('"'+caso.funcion+'" no es una funcion en el objeto');
        obtenido.respuesta=esto[caso.funcion].apply(esto,parametros);
    }
    if(caso.relanzarExcepcionSiHay){
        correrCaso();
        var paraPonerBreakPointAca=caso.caso;
    }else{
        try{
            correrCaso();
        }catch(err){
            obtenido.error=err.message;
        }
    }
    if(!caso.asincronico){
        this.compararObtenido(caso,esperado,obtenido);
    }
}

Probador.prototype.cadenaParaMostrar=function(valor){
    if(valor instanceof Date){
        return valor.toString();
    }else if(valor instanceof Probador.prototype.MostrarNoEsperabaNada){
        return 'valor esperado no especificado';
    }else if(valor instanceof RegExp){
        return "/"+valor.source+"/"+(valor.global?'g':'')+(valor.ignoreCase?'i':'')+(valor.multiline?'m':'');
    }else if(typeof valor == 'function'){
        return valor.toString();
    }else{
        return JSON.stringify(valor);
    }
}

Probador.prototype.textoDeCampos=function(objeto){
    var rta;
    try{
        rta=this.cadenaParaMostrar(objeto);
    }catch(err){
        var rta={};
        for(var atributo in objeto) if(objeto.hasOwnProperty(atributo)){
            try{
                rta[atributo]=objeto[atributo].toString();
            }catch(err2){
            }
        }
        rta='/* '+objeto.toString()+' */'+JSON.stringify(rta);
    }
    return rta;
}

Probador.prototype.compararObtenido=function(caso,esperado,obtenido){
    this.cantidadPruebas++;
    if(!(caso.modulo in this.cantidadPruebasPorModulos)){
        this.cantidadPruebasPorModulos[caso.modulo]=0;
    }
    this.cantidadPruebasPorModulos[caso.modulo]++;
    obtenido.entrada=this.textoDeCampos(caso.entrada);
    if(obtenido.This===window){
        delete obtenido.This;
    }else if('objetoThis' in esperado){
        obtenido.objetoThis=obtenido.This;
        delete obtenido.This;
    }else{
        obtenido.This=this.textoDeCampos(obtenido.This);
    }
    var controlBidireccional=true;
    // if('mocks' in caso && !(obtenidoOk||{}).mock){
        // obtenidoOk={mock:appMock.mock,dato:obtenidoOk};
    // }
    var probador=this;
    var controlandoDom=true;
    var considerarArray={
        '[object NodeList]':true,
        '[object DOMTokenList]':true
    };
    var compararProfundo=function(esperado,obtenido){
        var recorridoBidireccional=true;
        var controlBidireccional=true;
        var rta={}; // solo se ponen si se necesita: tieneError:false, tieneAdvertencias:false
        if( typeof esperado =='object'?(
                esperado instanceof ArgumentoEspecialMonovalente?(
                    !esperado.compatible(obtenido)
                ):(
                    typeof obtenido !='object' ||
                        (esperado===null)!==(obtenido===null) ||
                        (esperado===undefined)!==(obtenido===undefined) ||
                        (esperado instanceof Array)!==(obtenido instanceof Array || controlandoDom && !!considerarArray[({}).toString.call(obtenido)]) ||
                        (esperado instanceof Date)!==(esperado instanceof Date) ||
                        (esperado instanceof ArgumentoEspecialMonovalente) && !esperado.compatible(obtenido) || 
                        (esperado instanceof Date) && esperado.toString()!=obtenido.toString()
                )
            ):esperado!==obtenido
        ){
            if(!caso.ignorarDiferenciaDeTiposNumericos || isNaN(esperado) || isNaN(obtenido) || esperado!=obtenido){
                rta.tieneError=true;
            }else{
                rta.tieneAdvertencias=true;
            }
            if(typeof esperado =='object' && esperado instanceof ArgumentoEspecialMonovalente){
                rta.esperado=esperado.mostrarEsperado();
            }else{
                rta.esperado=esperado;
            }
            rta.obtenido=obtenido;
        }else if(typeof(esperado)=='object' && esperado instanceof ArgumentoEspecialMonovalente){
            rta.iguales=esperado.mostrarIguales(obtenido);
        }else if(typeof(esperado)!='object' || esperado==null && obtenido==null || esperado instanceof Date || esperado instanceof RegExp){
            rta.iguales=obtenido; // probador.cadenaParaMostrar(obtenido);
        }else{
            rta.nodes={};
            var nodoArray;
            var claseContenido;
            var definirClaseContenedor=function(elemento){
                if(elemento instanceof Array){
                    nodoArray={tipox:'td',className:'TDD_array',innerText:' '};
                    claseContenido='';
                }else{
                    nodoArray=null;
                    claseContenido='TDD_contenido';
                }
            }
            if(esperado instanceof ArgumentoEspecialColeccion){
                recorridoBidireccional=esperado.mostrarSobrantes;
                controlBidireccional=false;
                esperado=esperado.camposMinimos;
            }
            for(var campo in esperado) if(esperado.hasOwnProperty(campo)){
                var valorObtenido=valorObtenido=obtenido[campo];
                var valorEsperado=esperado[campo];
                var rtaInterna=compararProfundo(valorEsperado,valorObtenido);
                rta.nodes[campo]=rtaInterna;
                if(rtaInterna.tieneError){
                    rta.tieneError=true;
                }else if(rtaInterna.tieneAdvertencias){
                    rta.tieneAdvertencias=true;
                }
            }
            var visualizacionBidireccionalIgnorandoVacios=false;
            if(recorridoBidireccional){
                for(var campo in obtenido) if(obtenido.hasOwnProperty(campo)){
                    if(!(campo in esperado) && (!visualizacionBidireccionalIgnorandoVacios || !!obtenido[campo])){
                        if(controlBidireccional){
                            rta.tieneError=true;
                        }
                        rta.nodes[campo]={sobrante:obtenido[campo]};
                    }
                }
            }
            if(esperado instanceof Array){
                rta.conjunto='Array';
                if(esperado.length!=obtenido.length){
                    rta.nodes.length=compararProfundo(esperado.length, obtenido.length);
                }
            }
            if(rta.tieneError && rta.tieneAdvertencias){
                delete rta.tieneAdvertencias;
            }
        }
        return rta;
    };
    var resultado=compararProfundo(esperado,obtenido,true);
    this.pendientesPorModulos[caso.modulo]--;
    if(resultado.tieneError){
        this.errores++;
    }
    if(caso.elementos){
        for(var elemento in caso.elementos) if(caso.elementos.hasOwnProperty(elemento)){
            this.elementosBloqueados[caso.elementos[elemento].id||elemento]=false;
        }
        var zonaDePrueba=document.getElementById('TDD_zona_'+caso.caso);
        if(zonaDePrueba){
            zonaDePrueba.parentNode.removeChild(zonaDePrueba);
        }
    }
    var mensaje={modulo:caso.modulo, caso:caso.caso, estado:resultado.tieneError?'fallida':resultado.tieneAdvertencias?'advertida':'ok', resultado:resultado}
    if(this.app.hoyString<=caso.mostrarAunqueNoFalleHasta){
        mensaje.mostrar=true;
    }
    if(caso.modulo=='asi_se_ven_los_errores'){
        mensaje.ocultarAunqueError=true;
    }
    this.mensajes.enviar(mensaje);
}

Probador.prototype.MostrarNoEsperabaNada=function(){ 
    this.vacio='vacio';
}

var ArgumentoEspecialParaMock=function(definicion){
    this.id=definicion.id;
}

ArgumentoEspecialParaMock.stringify=function(clave, valor){
    if(valor instanceof HTMLElement){
    
        return JSON.stringify(new ArgumentoEspecialParaMock({id:valor.id}));
    }
    return valor;
}

ArgumentoEspecialParaMock.prototype.compatible=function(valor){
    var rta=valor instanceof HTMLElement && this.id==valor.id;
    return rta;
}

// Aplicacion.prototype.pruebaGrabSimple=function(definicion){
    // this.colocar(TDD_zona_de_pruebas,{tipox:'div', id:'TDD_zona_de_pruebas_simple', nodes:definicion});
    // var rta=TDD_zona_de_pruebas_simple.innerHTML;
    // TDD_zona_de_pruebas.removeChild(TDD_zona_de_pruebas_simple);
    // return rta;
// }

// Aplicacion.prototype.pruebaTraduccion=function(definicion){
    // var creador=this.domCreator(definicion.tipox);
    // return creador.translate(definicion);
// }

// Aplicacion.prototype.paraCargarCasosDePrueba=[];

Probador.prototype.agregarCaso=function(caso){
    this.casosDePrueba.push(cambiandole(this.casoPredeterminado,caso));
}

Probador.prototype.registradorCasosPrueba=[];

Probador.prototype.agregarCasosRegistrados=function(){
    this.casoPredeterminado={};
    for(var i=0; i<this.registradorCasosPrueba.length; i++){
        this.registradorCasosPrueba[i].call(this);
        this.casoPredeterminado={};
    }
}

Probador.prototype.agregarCasosEjemplo=function(){
    this.agregarCaso({
        modulo:'asi_se_ven_los_errores',
        funcion:'estoMismo',
        caso:'así se ven lo errores en los casos de prueba fallidos',
        entrada:[{
            iguales:'cuando el valor del campo del esperado y el obtenido coinciden se ve un solo dato',
            si_no_coinciden:'y abajo en rojo el obtenido',
            'si falta algun campo':{'en el esperado':'y muestra el obtenido'},
            'como se ve si el tipo no coincide':1,
            'si hay un cambio en un arreglo':[1,2,3],
            'y si la estructura no coincide':"{uno:1, dos:2}"
        }],
        esperado:{respuesta:{
            iguales:'cuando el valor del campo del esperado y el obtenido coinciden se ve un solo dato',
            si_no_coinciden:'el valor esperado se ve arriba',
            'si falta algun campo':{'en el obtenido':'muestra el esperado y'},
            'como se ve si el tipo no coincide':"1",
            'si hay un cambio en un arreglo':[1,null,3],
            'y si la estructura no coincide':{uno:1, dos:2}
        }}
    });
    this.agregarCaso({
        modulo:'asi_se_ven_los_errores',
        funcion:'splice',
        caso:'así se ve cuando una función modifica un dato interno',
        objetoThis:["uno", "dos", "tres", "cuatro"],
        entrada:[2,1,"3"],
        esperado:{respuesta:["tres"]}
    });
    this.agregarCaso({
        modulo:'asi_se_ven_los_errores',
        objetoThis:app_global,
        funcion:'lanzarExcepcion',
        caso:'así se ven los casos que lanzan excepciones cuando se esperaba un resultado',
        entrada:["texto de la excepcion no esperada"],
        esperado:{respuesta:{campo_esperado:'valor esperado', otro_campo:'otro valor esperado'}}
    });
    this.agregarCaso({
        modulo:'asi_se_ven_los_errores',
        funcion:'estoMismo',
        caso:'así se ven los casos donde se espera que lance una excepción pero no se lanza',
        entrada:["valor obtenido"],
        esperado:{
            error:"texto de la excepcion esperada"
        }
    });
    this.agregarCaso({
        modulo:'asi_se_ven_los_errores',
        objetoThis:app_global,
        funcion:'lanzarExcepcion',
        caso:'así se ven cuando no coincide el texto de la excepción',
        entrada:["texto de la excepcion obtenida"],
        esperado:{error:"texto de la excepcion esperada"}
    });
    this.agregarCaso({
        modulo:'asi_se_ven_los_errores',
        funcion:'estoMismo',
        mostrarAunqueNoFalleHasta:'2013-03-31',
        caso:'Hay un problema con las fechas porque el constructor de Date considera GMT0 pero al extraer usa el Locale',
        entrada:[{
            dia:fechaAmd('1991-06-05').getDate(),
            mostrar:fechaAmd('1991-06-05').toString(),
            mostrarUTC:fechaAmd('1991-06-05').toUTCString()
        }],
        esperado:{respuesta:{
            dia:5,
            mostrar:'1991-06-05 sin hora ni GMT',
            mostrarUTC:'1991-06-05 sin hora ni GMT'
        }}
    });
    this.agregarCaso({
        modulo:'asi_se_ven_los_ignorados',
        funcion:'estoMismo',
        caso:'Los casos de prueba ignorados se ven así',
        ignorado:true,
        entrada:[{iguales:'este es',abajo:'solo en obtenido',distinto:'obtenido'}],
        esperado:{respuesta:{iguales:'este es',arriba:'solo en esperado',distinto:'esperado'}}
    });
    this.agregarCaso({
        modulo:'asi_se_ven_los_ok',
        funcion:'estoMismo',
        caso:'Se puede comparar en forma exacta usando el campo "salida"',
        entrada:[{iguales:'este es',este_tambien:7}],
        esperado:{respuesta:{iguales:'este es',este_tambien:7}}
    });
    this.agregarCaso({
        modulo:'asi_se_ven_los_ok',
        funcion:'estoMismo',
        caso:'Se puede comparar de modo de que estén ciertos campos pero no controlar si sobran. Se usa "ArgumentoEspecialAsimetrico" cuando no se quieren ver los sobrantes',
        entrada:[{iguales:'sí', este_sobra:'en lo esperado no está, pero no molesta'}],
        esperado:{respuesta:new ArgumentoEspecialAsimetrico({iguales:'sí'})}
    });
    this.agregarCaso({
        modulo:'asi_se_ven_los_ok',
        funcion:'estoMismo',
        caso:'Se puede comparar de modo de que estén ciertos campos pero no controlar si sobran. Se usa "ArgumentoEspecialIgnorarSobrantes" cuando se quieren ver los sobrantes pero no marcarlos como error',
        entrada:[{iguales:'sí', este_sobra:'en lo esperado no está, pero no molesta'}],
        esperado:{respuesta:new ArgumentoEspecialIgnorarSobrantes({iguales:'sí'})}
    });
    this.agregarCaso({
        modulo:'asi_se_ven_los_ok',
        funcion:'estoMismo',
        mostrarAunqueNoFalleHasta:'2099-12-31',
        caso:'Se puede pedir que muestre el resultado aunque sea correcto especificando en el caso la propiedad mostrarAunqueNoFalleHasta',
        entrada:[{un_dato:'uno', lista:['elemento1', 'elemento2'], dato_agregado:'agregado'}],
        esperado:{respuesta:new ArgumentoEspecialIgnorarSobrantes({un_dato:'uno', lista:['elemento1', 'elemento2']})}
    });
    this.agregarCaso({
        modulo:'asi_se_ven_los_ok',
        objetoThis:app_global,
        funcion:'lanzarExcepcion',
        caso:'así se ve cuando coincide el texto de la excepción',
        entrada:["texto de la excepcion"],
        esperado:{error:"texto de la excepcion"}
    });
    this.agregarCaso({
        modulo:'asi_se_ven_los_errores',
        funcion:'estoMismo',
        mostrarAunqueNoFalleHasta:'2013-03-31',
        caso:'prueba de RegExp que falla',
        entrada:[{
            falla:'palabra más larga de lo esperada',
            anda:'palabra con prefijo'
        }],
        esperado:{respuesta:{
            falla:new ArgumentoEspecialRegExp(/^Palabra$/i),
            anda:new ArgumentoEspecialRegExp(/prefijo$/)
        }}
    });
    this.agregarCaso({
        modulo:'asi_se_ven_los_ok',
        funcion:'estoMismo',
        mostrarAunqueNoFalleHasta:'2013-03-31',
        caso:'prueba de RegExp',
        entrada:[{
            elemental:'palabra',
            simple:'palabra',
            conBarra:'uno/otro',
            conEspacioOpcional:'todojunto separado'
        }],
        esperado:{respuesta:{
            elemental:new ArgumentoEspecialRegExp(/palabra/),
            simple:new ArgumentoEspecialRegExp(/^Palabra$/i),
            conBarra:new ArgumentoEspecialRegExp(/^uno\/otro$/),
            conEspacioOpcional:new ArgumentoEspecialRegExp(/^todo ?junto ?separado$/)
        }}
    });
    this.agregarCaso({
        modulo:'asi_se_ven_los_ok',
        funcion:'estoMismo',
        mostrarAunqueNoFalleHasta:'2013-03-31',
        caso:'prueba de Fechas, hay que usar UTC',
        entrada:[{
            dia:fechaAmd('1991-06-05').getUTCDate()
        }],
        esperado:{respuesta:{
            dia:5
        }}
    });
    this.agregarCaso({
        modulo:'asi_se_ven_los_ok',
        funcion:'estoMismo',
        caso:'veo que el sort ordene bien',
        entrada:[[91,1,9,11,111].sort(function(a,b){return a-b})],
        esperado:{respuesta:[1,9,11,91,111]}
    });
    this.agregarCaso({
        modulo:'asi_se_ven_los_ok',
        funcion:'estoMismo',
        caso:'veo que el reverse dé vuelta',
        entrada:[[91,1,9,11,111].reverse()],
        esperado:{respuesta:[111,11,9,1,91]}
    });
    this.agregarCaso({
        modulo:'asi_se_ven_los_ok',
        funcion:'estoMismo',
        caso:'veo que el sort ordene al revés',
        entrada:[[91,1,9,11,111].sort(function(a,b){return b-a})],
        esperado:{respuesta:[111,91,11,9,1]}
    });
}
/*
Aplicacion.prototype.casosDePrueba.push({
    modulo:'control interno del sistema',
    funcion:'enviarPaquete',
    caso:'control de que el sistema esté instalado',
    aclaracionSiFalla:['se puede instalar poniendo directamente ',{tipox:'a', href:'app.php?proceso=instalarBaseDeDatos', innerText:'app.php?proceso=instalarBaseDeDatos'}],
    entrada:[{proceso:'control_instalacion',paquete:{tipo:'base'}}],
    salidaMinima:{estadoInstalacion:'completa'}
});

Aplicacion.prototype.casosDePrueba.push({
    modulo:'control interno del sistema',
    funcion:'enviarPaquete',
    caso:'control de que el sistema esté preparado para correr casos de prueba en la base',
    aclaracionSiFalla:['se puede instalar poniendo directamente ',{tipox:'a', href:'app.php?proceso=instalarBaseDeDatos', innerText:'app.php?proceso=instalarBaseDeDatos'}],
    entrada:[{proceso:'control_instalacion',paquete:{tipo:'tdd'}}],
    salidaMinima:{estadoInstalacion:'completa'}
});

if(Aplicacion.prototype.paginas.entrar){
    Aplicacion.prototype.casosDePrueba.push({
        modulo:'control de usuarios',
        funcion:'enviarPaquete',
        caso:'entrada al sistema exitosa',
        entrada:[{proceso:'entrada',paquete:{usuario:'abel',password:hex_md5('abel'+'clave1')}}],
        salidaMinima:{activo:true}
    });
    Aplicacion.prototype.casosDePrueba.push({
        modulo:'control de usuarios',
        funcion:'enviarPaquete',
        caso:'entrada al sistema fallida por clave erronea',
        entrada:[{proceso:'entrada',paquete:{usuario:'abel',password:hex_md5('abel'+'clave2')}}],
        error:'el usuario o la clave no corresponden a un usuario activo'
    });
    Aplicacion.prototype.casosDePrueba.push({
        modulo:'control de usuarios',
        funcion:'enviarPaquete',
        caso:'entrada al sistema fallida por usuario inexistente',
        entrada:[{proceso:'entrada',paquete:{usuario:'beto',password:hex_md5('beto')}}],
        error:'el usuario o la clave no corresponden a un usuario activo'
    });
    Aplicacion.prototype.casosDePrueba.push({
        modulo:'control de usuarios',
        funcion:'enviarPaquete',
        caso:'entrada al sistema fallida por usuario inactivo',
        entrada:[{proceso:'entrada',paquete:{usuario:'cain',password:hex_md5('cain'+'clave2')}}],
        error:'el usuario "cain" no esta activo'
    });
    Aplicacion.prototype.casosDePrueba.push({
        modulo:'control de usuarios',
        funcion:'probarEvento',
        caso:'entrada al sistema errónea a través del evento entrada',
        elementos:{
            usuario:{tipox:'input', type:'text', value:'abel'}, 
            password:{tipox:'input', type:'password', value:'clave2'},
            resultado:{tipox:'div'},
            boton_entrar:{tipox:'input', type:'button', disabled:'disabled'}
        },
        entrada:[{
            nombre:'entrar_aplicacion',
            incluirDocumentoEnSalida:true,
            mocks:[{ 
                funcion:'enviarPaquete', 
                argumentos:[{proceso:'entrada', paquete:{usuario:'abel', password:hex_md5('abel'+'clave2')}}], 
                futuro:{recibirError:"clave errónea"}
            }]
        }],
        salidaDom:{documento:{
            resultado:{innerText:'clave errónea', className:'resultado_error'}, 
            boton_entrar:{disabled:false}
        }}
    });
    Aplicacion.prototype.casosDePrueba.push({
        modulo:'control de usuarios',
        funcion:'probarEvento',
        caso:'entrada al sistema exitosa a través del evento entrada',
        // relanzarExcepcionSiHay:true,
        elementos:{
            usuario:{tipox:'input', type:'text', value:'abel'}, 
            password:{tipox:'input', type:'password', value:'clave1'},
            resultado:{tipox:'div'},
            boton_entrar:{tipox:'input', type:'button', disabled:'disabled'}
        },
        entrada:[{
            nombre:'entrar_aplicacion',
            incluirDocumentoEnSalida:true,
            mocks:[{ 
                funcion:'enviarPaquete', 
                argumentos:[{proceso:'entrada', paquete:{usuario:'abel', password:hex_md5('abel'+'clave1')}}], 
                futuro:{recibirListo:{activo:true}}
            },{ 
                funcion:'cambiarUrl', 
                argumentos:['{"menu":"donde_entra"}'], 
                retornar:null
            },{ 
                miembro:'urlBienvenida', 
                valor:'{"menu":"donde_entra"}'
            }]
        }],
        salidaDom:{documento:{
            resultado:{innerText:'Validado. Entrando...', className:'resultado_ok'}, 
            boton_entrar:{disabled:true}
        }}
    });
}

Aplicacion.prototype.casosDePrueba.push({
    modulo:'creación de elementos del DOM a través de objetos tipox',
    funcion:'pruebaTraduccion',
    caso:'traducir el tipox:lista',
    entrada:[{tipox:'lista', tagList:'ol(1)', tagElement:'li(2)', elementos:[
                'uno', 
                'dos', 
                {esto:{queda:{}}}
            ]}],
    salida:{tipox:'ol(1)',nodes:[
                {tipox:'li(2)', nodes:'uno'}, 
                {tipox:'li(2)', nodes:'dos'}, 
                {tipox:'li(2)', nodes:{esto:{queda:{}}}}
            ]}
});

Aplicacion.prototype.casosDePrueba.push({
    modulo:'creación de elementos del DOM a través de objetos tipox',
    funcion:'pruebaGrabSimple',
    caso:'caso de ejemplo',
    entrada:[{tipox:'p', id:'id.p', className:'la_clase', nodes:[ "texto libre ", {tipox:'span', className:'cita', innerText:"un span"}]}],
    salida:'<p id="id.p" class="la_clase">texto libre <span class="cita">un span</span></p>'
});

Aplicacion.prototype.casosDePrueba.push({
    modulo:'creación de elementos del DOM a través de objetos tipox',
    funcion:'pruebaGrabSimple',
    caso:'creación de elemento del DOM con style',
    entrada:[{tipox:'p', style:{width:200, backgroundColor:'#333'}}],
    salida:/<p style="width: 200px; background-color: rgb\(51, 51, 51\); ?"><\/p>/
});

Aplicacion.prototype.casosDePrueba.push({
    modulo:'creación de elementos del DOM a través de objetos tipox',
    funcion:'pruebaGrabSimple',
    caso:'los nodos internos indexado por id',
    entrada:[{tipox:'div', id:'id1', nodes:{indexadoPor:'id', id2:{tipox:'div', innerText:'texto 2'},id3:{tipox:'div', innerText:'texto 3'}}}],
    salida:'<div id="id1"><div id="id2">texto 2</div><div id="id3">texto 3</div></div>'
});

Aplicacion.prototype.casosDePrueba.push({
    modulo:'creación de elementos del DOM a través de objetos tipox',
    funcion:'pruebaGrabSimple',
    caso:'el innerText solo puede recibir strings',
    entrada:[{tipox:'div', id:'id1', innerText:[]}],
    error:'el innerText solo puede recibir strings'
});

var paraProbarTipoxTabla={
    objeto:{a:{b:"uno",c:"dos"},d:{e:{tipox:'button'},f:"cuatro"}}, 
    arreglo:[["uno","dos"],[{tipox:'button'},"cuatro"]]
};

for(var cual_paraProbarTipoxTabla in paraProbarTipoxTabla){
    var contenido_paraProbarTipoxTabla=paraProbarTipoxTabla[cual_paraProbarTipoxTabla];
Aplicacion.prototype.casosDePrueba.push({
    modulo:'creación de elementos del DOM a través de objetos tipox',
    funcion:'pruebaTraduccion',
    caso:'tabla simple (no tiene que importar si las filas están o no indexadas) basado en: '+cual_paraProbarTipoxTabla,
    entrada:[{tipox:'tabla', id:'id1', className:'esta', filas:contenido_paraProbarTipoxTabla}],
    salida:{tipox:'table', id:'id1', className:'esta', nodes:[
        {tipox:'tr', nodes:[
            {tipox:'td', nodes:"uno"},
            {tipox:'td', nodes:"dos"},
        ]},
        {tipox:'tr', nodes:[
            {tipox:'td', nodes:{tipox:'button'}},
            {tipox:'td', nodes:"cuatro"},
        ]}
    ]},
});
}

Aplicacion.prototype.casosDePrueba.push({
    modulo:'creación de elementos del DOM a través de objetos tipox',
    funcion:'aplicarFuncion',
    caso:'prueba de dataset directo del objeto',
    elementos:{}, // para que se cree el contenedor para después hacer el colocar
    entrada:[function(){
        var definicion={tipox:'div', id:'idds', dataset:{uno:'uno', otroAtributoInterno:'otro'}};
        return this.colocar('TDD_zona_'+'prueba de dataset directo del objeto',definicion);        
    },[]],
    salidaDom:{dataset:{uno:'uno', otroAtributoInterno:'otro'}}
});

Aplicacion.prototype.aplicarFuncion=function(hacer,parametros){
    return hacer.apply(this,parametros)
}

Aplicacion.prototype.casosDePrueba.push({
    modulo:'objeto Futuro',
    funcion:'aplicarFuncion',
    caso:'caso simple llega el dato después del luego',
    entrada:[function(){
        var futuro=this.newFuturo();
        var rta='todavía no recibí nada';
        futuro.luego("devuelve lo recibido",
            function(mensaje,app){
                rta=mensaje;
            }
        );
        futuro.recibirListo('ya lo recibí');
        return rta;
    },[]],
    salida:"ya lo recibí" 
});
Aplicacion.prototype.casosDePrueba.push({
    modulo:'objeto Futuro',
    funcion:'aplicarFuncion',
    caso:'caso simple llega el dato antes del luego',
    entrada:[function(){
        var futuro=this.newFuturo();
        var rta='todavía no recibí nada';
        futuro.recibirListo('ya lo recibí');
        futuro.luego("devuelve el mismo mensaje recibido",
            function(mensaje,app){
                rta=mensaje;
            }
        );
        return rta;
    },[]],
    salida:"ya lo recibí"
});
Aplicacion.prototype.casosDePrueba.push({
    modulo:'objeto Futuro',
    funcion:'aplicarFuncion',
    caso:'caso encadenado llega el dato después de varios luegos',
    entrada:[function(){
        var futuro=this.newFuturo();
        var rta='todavía no recibí nada';
        futuro.luego("agrega A", 
            function(mensaje,app){
                return mensaje+' paso A';
            }
        ).luego("agrega B",
            function(mensaje,app){
                rta=mensaje+' paso B';
            }
        );
        futuro.recibirListo('recibido');
        return rta;
    },[]],
    salida:"recibido paso A paso B" 
});
Aplicacion.prototype.casosDePrueba.push({
    modulo:'objeto Futuro',
    funcion:'aplicarFuncion',
    caso:'caso encadenado llega el dato después de varios luegos que devuelven futuros',
    entrada:[function(){
        var rescate_f2;
        var futuro=this.newFuturo();
        var rta='todavía no recibí nada';
        futuro.luego("agrega una A",
            function(mensaje,app){
                return mensaje+' paso A';
            }
        ).luego("prepara un futuro interno",
            function(mensaje,app){
                var f2=app.newFuturo();
                f2.tengo=mensaje;
                rescate_f2=f2;
                return f2;
            }
        ).luego("agrega la C a un futuro encadenado",
            function(mensaje,app){
                return mensaje+' paso C';
            }
        );
        futuro.luego("agrega la D",
            function(mensaje,app){
                rta=mensaje+' paso D';
            }
        );
        futuro.recibirListo('recibido');
        rescate_f2.recibirListo('x');
        return {primera_parte:rescate_f2.tengo, segunda_parte:rta};
    },[]],
    salida:{primera_parte:'recibido paso A', segunda_parte:'x paso C paso D'}
});

Aplicacion.prototype.casosDePrueba.push({
    modulo:'objeto Futuro',
    funcion:'aplicarFuncion',
    caso:'un futuro tiene un luego que ya devolvió un futuro y después llamo a un luego',
    entrada:[function(){
        var futuro=this.newFuturo();
        var f2;
        var rta='todavía no recibí nada';
        futuro.luego("prepara un futuro interno",
            function(mensaje,app){
                f2=app.newFuturo();
                f2.luego("agrega una A",
                    function(mensaje,app){
                        return mensaje+' paso A';
                    }
                );
                return f2;
            }
        );
        futuro.recibirListo('Y');
        futuro.luego("agrega una B después de recibir la Y",
            function(mensaje,app){
                rta=mensaje+' paso B';
            }
        );
        f2.recibirListo('x');
        return rta;
    },[]],
    salida:"x paso A paso B"
});

Aplicacion.prototype.casosDePrueba.push({
    modulo:'objeto Futuro',
    funcion:'aplicarFuncion',
    caso:'caso encadenado llega el dato, un luego lanza una excepción, es atrapada por un alFallar y no se sigue procesando',
    entrada:[function(){
        var rescate_f2;
        var futuro=this.newFuturo();
        var rta='todavía no recibí nada';
        futuro.luego("agrega una A",
            function(mensaje,app){
                return mensaje+' paso A';
            }
        ).luego("suma el paso B",
            function(mensaje,app){
                return mensaje+' paso B';
            }
        ).luego("lanza un error, para ver",
            function(mensaje,app){
                throw new Error(mensaje+' paso C');
            }
        ).alFallar("alfallar recibido entre C y D",
            function(mensaje,app){
                rta=mensaje+' recibido como error';
            }
        ).luego("paso D",
            function(mensaje,app){
                rta=mensaje+' paso D';
            }
        ).alFallar("segundo error",
            function(mensaje,app){
                rta=mensaje+' segundo error';
            }
        );
        futuro.recibirListo('listo');
        return rta;
    },[]],
    salida:"listo paso A paso B paso C recibido como error"
});

Aplicacion.prototype.casosDePrueba.push({
    modulo:'objeto Futuro',
    funcion:'aplicarFuncion',
    caso:'caso encadenado con un alFallar que recupera',
    entrada:[function(){
        var rescate_f2;
        var futuro=this.newFuturo();
        var rta='todavía no recibí nada';
        futuro.luego("paso A",
            function(mensaje,app){
                return mensaje+' paso A';
            }
        ).alFallar("recuperado",
            function(mensaje,app){
                return mensaje+' recuperado';
            }
        ).luego("paso B",
            function(mensaje,app){
                rta=mensaje+' paso B';
            }
        ).alFallar("segundo error",
            function(mensaje,app){
                rta=mensaje+' segundo error';
            }
        );
        futuro.recibirError('error');
        return rta;
    },[]],
    salida:"error recuperado paso B"
});

// Aplicacion.prototype.casosDePrueba=[];
if(!Aplicacion.prototype.sinBaseDeDatos){
    Aplicacion.prototype.casosDePrueba.push({
        modulo:'acceso a datos del servidor',
        funcion:'accesoDb',
        caso:'traer los datos de la prueba_tabla_comun',
        entrada:[{hacer:'select',from:'prueba_tabla_comun',where:true,order_by:true}],
        mostrarAunqueNoFalleHasta:'2013-03-31',
        salida:[
            {id:1,nombre:"uno",importe:null,activo:true ,cantidad:-9  ,fecha:fechaAmd('2001-12-31'),"ultima_modificacion":"2001-01-01"},
            {id:2,nombre:"dos",importe:0.11,activo:false,cantidad:1   ,fecha:null                  ,"ultima_modificacion":"2001-01-01"},
            {id:3,nombre:"año",importe:2000,activo:null ,cantidad:null,fecha:fechaAmd('1991-05-06'),"ultima_modificacion":"2001-01-01"}
        ]
    });

    Aplicacion.prototype.casosDePrueba.push({
        modulo:'acceso a datos del servidor',
        funcion:'accesoDb',
        caso:'para traer todos los datos (sin where) hay que poner where:true',
        entrada:[{hacer:'select',from:'prueba_tabla_comun'}],
        error:"el acceso a datos debe tener una clausula where"
    });
}
//////////////// FIN CASOS DE PRUEBA ////////////////////
});
*/