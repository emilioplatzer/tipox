// Por $Author$ Revisión $Revision$ del $Date$
"use strict";

Aplicacion.prototype.paginas.tdd={ 
    labelMenu:{tipox:'span', className:'TDD_menu', innerText:'T.D.D.'},
    filtro:function(app){ return app.entornoDesarrollo },
    nodes:["Pruebas internas de funcionamiento ",
        {tipox:'funcion', id:'probarTodo', funcion:'probarTodo', className:'TDD_resultados'},
        {tipox:'div', id:'TDD_zona_de_pruebas'}
    ]
};

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

Aplicacion.prototype.eventos.toggleDisplayAbajo=function(evento,elemento){
    var hermano=elemento.nextSibling;
    hermano.style.display=hermano.style.display?null:'none';
}

function Probador(app){
    this.app=app;
    this.casosDePrueba=app.casosDePrueba;
    this.cantidadPruebas=0;
    this.cantidadPruebasPorModulos={};
    this.pendientesPorModulos={};
    this.errores=0;
}

Aplicacion.prototype.probarTodo=function(){
    var probador=new Probador(this);
    probador.cualesProbar={
        'programar descargar. Comando D. exitoso':true,
        //'ver cómo la grilla indica que hay una tabla_inexistente':true,
        //'ver los datos de la grilla':true
    };
    delete probador.cualesProbar; // NUNCA BORRAR. COMENTAR PARA ACTIVAR
    if("capturar la excepción y mostrarla en debug directo"){
        try{
            probador.probarTodo();
        }catch(err){
            debugDirecto(descripcionError(err));
            debugDirecto(err.stack);
        }
    }else{
        probador.probarTodo();
    }
    if(probador.cualesProbar){
        this.grab(document.body,{
            tipox:'div', 
            className:'advertencia_importante',
            innerText:'¡Atención! Solo se está probando algún caso. Antes de hacer commit activar la línea delete probador.cualesProbar'
        });
    }
}

Probador.prototype.probarTodo=function(){
    this.casosPendientes=[]; // para hacer la cola de los que faltan ejecutar
    this.casosExistentes={}; // para controlar duplicados
    this.elementosBloqueados={}; // para controlar que no se ejecuten dos pruebas que necesitan los mismos elementos (con su id)
    for(var i in this.casosDePrueba) if(this.casosDePrueba.hasOwnProperty(i)){
        var caso=this.casosDePrueba[i];
        if(!('funcion' in caso)){
            caso.funcion=caso.tipox;
        }
        if(!('funcion' in caso)){
            this.lanzarExcepcion('falta la funcion en el caso de prueba');
        }
        if(!('modulo' in caso)){
            caso.modulo=caso.tipox+' HAY QUE PONER EL NOMBRE DEL MÓDULO (en el atributo modulo del caso de prueba)';
        }
        var idModulo='TDD_modulo:'+caso.modulo;
        var elementoModuloCasos=document.getElementById(idModulo+'_casos');
        if(!elementoModuloCasos){
            this.pendientesPorModulos[idModulo]=0;
            this.app.grab('probarTodo',
                {tipox:'div', classList:['TDD_modulo'], id:idModulo, nodes:[
                    {tipox:'div', 
                        classList:['TDD_modulo_titulo','TDD_prueba_pendiente'], 
                        dataset:{clasePrueba:'TDD_prueba_pendiente'},
                        id:idModulo+'_titulo', 
                        innerText:caso.modulo, 
                        eventos:{click:'toggleDisplayAbajo'}
                    },
                    {tipox:'div', id:idModulo+'_casos', style:{display:'none'}}
                ]}
            );
            elementoModuloCasos=document.getElementById(idModulo+'_casos');
        }
        var elementoModuloTitulo=document.getElementById(idModulo+'_titulo');
        var idCaso='TDD_caso:'+caso.caso;
        var clase=caso.ignorado?'TDD_prueba_ignorada':'TDD_prueba_pendiente';
        var tituloCaso=[caso.caso];
        var ticket;
        if(caso.ignorado && caso.ignorado.substr && caso.ignorado.substr(0,1)=='#' && this.app.tracUrl){  
            ticket={tipox:'a', href:this.app.tracUrl+'/ticket/'+caso.ignorado.substr(1), innerText:caso.ignorado};
            tituloCaso.push(ticket);
        }
        var nodosInternos=[{tipox:'div', classList:['TDD_caso_titulo',clase], id:idCaso+'_titulo', nodes:tituloCaso, dataset:{clasePrueba:clase}}];
        if(caso.aclaracionSiFalla){
            nodosInternos.push({tipox:'div', className:'TDD_aclaracion', id:idCaso+'_aclaracion', nodes:caso.aclaracionSiFalla});
        }
        this.app.grab(elementoModuloCasos,
            {tipox:'div', className:'TDD_caso', id:idCaso, nodes:nodosInternos}
        );
        if(caso.ignorado){  
            if(ticket){
                this.app.grab(elementoModuloTitulo,[ticket,' ']);
                // this.app.grab(elementoModuloTitulo,[{tipox:'a', href:this.tracUrl+'/ticket/'+caso.ignorado.substr(1), innerText:caso.ignorado},' ']);
            }
            this.cambioEstado(caso,'TDD_prueba_ignorada');
        }else if(!this.cualesProbar || this.cualesProbar[caso.caso]){
            this.pendientesPorModulos[idModulo]++;
            this.casosPendientes.push(caso);
        }
        if(caso.caso in this.casosExistentes){
            this.app.lanzarExcepcion('Nombre de caso de prueba duplicado '+caso.caso);
        }
        this.casosExistentes[caso.caso]={};
        var elementoCaso=document.getElementById(idModulo);
    }
    this.probarVariosCasos(100);
    document.getElementById('TDD_caso:así se ven lo errores en los casos de prueba fallidos').parentNode.style.display='none';
}

Aplicacion.prototype.paginas.info.nodes.push({tipox:'button', innerText:'Controlar Futuros', eventos:{click:'controlar_futuros'}});
Aplicacion.prototype.paginas.info.nodes.push({tipox:'div', id:'destinoControlFuturos', style:{display:'none'}});

Aplicacion.prototype.eventos.controlar_futuros=function(evento,elemento){
    var h2=document.createElement('h2');
    h2.innerText='control de futuros';
    destinoControlFuturos.appendChild(h2);
    destinoControlFuturos.style.display=null;
    for(var i=0; i<this.controlDeFuturos.length; i++){
        var futuro=this.controlDeFuturos[i];
        if(!futuro.recibirError && !futuro.recibirListo){
            var pre=document.createElement('pre');
            pre.innerText=futuro.stack;
            pre.style.borderBottom='1px dotted #6A6';
            destinoControlFuturos.appendChild(pre);
        }
    }
}

Probador.prototype.probarVariosCasos=function(cuantos){
    var procesarHasta=(new Date()).getTime()+500;
    var seguirProcesando=cuantos;
    while(this.casosPendientes.length && seguirProcesando && (new Date()).getTime()<procesarHasta){
        var caso=this.casosPendientes.shift();
        var hayBloqueados=false;
        if(caso.elementos){
            for(var elemento in caso.elementos){
                if(document.getElementById(elemento) || this.elementosBloqueados[elemento]){
                    hayBloqueados=true;
                    break;
                }
            }
        }
        if(hayBloqueados){
            this.cambioEstado(caso,'TDD_prueba_en_espera');
            this.casosPendientes.push(caso);
        }else{
            this.probarElCaso(caso);
        }
    }
    var este=this;
    if(this.casosPendientes.length){
        setTimeout(function(){ este.probarVariosCasos(cuantos); },100);
    }
}

Probador.prototype.probarElCaso=function(caso){
    this.cambioEstado(caso,'TDD_prueba_comenzada');
    if(caso.elementos){
        this.app.grab(TDD_zona_de_pruebas,{tipox:'div', id:'TDD_zona_'+caso.caso, className:'TDD_una_prueba'});
        for(var elemento in caso.elementos){
            this.elementosBloqueados[elemento]=true;
            var defElemento=caso.elementos[elemento];
            if(defElemento){
                this.app.grab('TDD_zona_'+caso.caso, cambiandole(defElemento,{id:elemento}));
            }
        }
    }
    if(caso.preparar){
        caso.preparar.call(this.app);
    }
    var idModulo='TDD_modulo:'+caso.modulo;
    var idCaso='TDD_caso:'+caso.caso;
    var esto=null;
    if('mocks' in caso){
        esto=this.app.appMock(caso);
        esto[caso.funcion]=this.app[caso.funcion];
        esto.domCreator=this.app.domCreator;
        esto.creadores=this.app.creadores;
    }else{
        var estos=[this.app,window,caso.entrada[0]];
        for(var i_esto=0;i_esto<estos.length;i_esto++){
            if(caso.funcion in estos[i_esto]){
                esto=estos[i_esto];
                break;
            }
        }
    }
    var obtenido=null;
    var errorObtenido=null;
    var salvarEntrada=this.mostrarCampos(caso.entrada);
    var correrCaso=function(){
        if(!esto){
            this.app.lanzarExcepcion("no existe la función "+caso.funcion+" o no se encuentra en los lugares probables");
        }
        if(esto==caso.entrada[0]){
            obtenido=esto[caso.funcion].apply(esto,caso.entrada.slice(1));
        }else{
            obtenido=esto[caso.funcion].apply(esto,caso.entrada);
        }
        if(caso.incluirDocumentoEnSalida){
            obtenido={documento:document, dato:obtenido};
        }
    }
    if(caso.relanzarExcepcionSiHay){
        correrCaso();
        var paraPonerBreakPointAca=caso.caso;
    }else{
        try{
            correrCaso();
        }catch(err){
            errorObtenido=err.message||'Recibida excepción sin message';
        }
    }
    var app=this.app;
    var este=this;
    if(obtenido instanceof Futuro){
        obtenido.luego("comparo lo obtenido (Listo) en el futuro en "+caso.caso,
            function(respuesta,app,futuro){
                este.compararObtenido(respuesta,null,caso,idCaso,salvarEntrada,esto);
            }
        ).alFallar("comparo lo obtenido (Falla) en el futuro en "+caso.caso,
            function(mensaje,app,futuro){
                este.compararObtenido(null,mensaje,caso,idCaso,salvarEntrada,esto);
            }
        );
    }else{
        este.compararObtenido(obtenido,errorObtenido,caso,idCaso,salvarEntrada,esto);
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

Probador.prototype.mostrarCampos=function(objeto){
    var rta;
    try{
        rta=this.cadenaParaMostrar(objeto);
    }catch(err){
        var rta={};
        for(var atributo in objeto){
            try{
                rta[atributo]=objeto[atributo].toString();
            }catch(err2){
            }
        }
        rta='/* '+objeto.toString()+' */'+JSON.stringify(rta);
    }
    return rta;
}

Probador.prototype.compararObtenido=function(obtenidoOk,errorObtenido,caso,idCaso,salvarEntrada,appMock){
    this.cantidadPruebas++;
    if(!(caso.modulo in this.cantidadPruebasPorModulos)){
        this.cantidadPruebasPorModulos[caso.modulo]=0;
    }
    this.cantidadPruebasPorModulos[caso.modulo]++;
    var entradaDespuesDeCorrer=this.mostrarCampos(caso.entrada);
    var esperado=coalesce(caso.salida,caso.salidaMinima,caso.salidaDom,caso.salidaDomAbundante);
    var visualizacionBidireccional=!('salidaDom' in caso);
    var visualizacionBidireccionalIgnorandoVacios=('salidaDomAbundante' in caso)
    var controlBidireccional=true;
    if('mocks' in caso && !(obtenidoOk||{}).mock){
        obtenidoOk={mock:appMock.mock,dato:obtenidoOk};
    }
    var obtenido=obtenidoOk;
    if(obtenido && obtenido.mock || errorObtenido || caso.error || salvarEntrada!=entradaDespuesDeCorrer){
        if(obtenidoOk && obtenidoOk.mock){
            obtenido={dato:obtenidoOk.dato};
        }else{
            obtenido={dato:obtenidoOk};
        }
        esperado={dato:esperado       };
        if(obtenidoOk && obtenidoOk.mock){
            obtenido.mock=obtenidoOk.mock.obtenido;
            esperado.mock=obtenidoOk.mock.esperado;
        }
        if(errorObtenido || caso.error){
            obtenido.dato=obtenido.dato||null;
            esperado.dato=esperado.dato||null;
            obtenido.error=errorObtenido||null;
            esperado.error=caso.error   ||null;
        }
        if(salvarEntrada!=entradaDespuesDeCorrer){
            obtenido.entrada_alterada=JSON.parse(entradaDespuesDeCorrer);
            esperado.entrada_alterada=JSON.parse(salvarEntrada);
        }
    }
    controlBidireccional='salida' in caso;
    var probador=this;
    var nodoBonito=function(esperado,obtenido,claseEsperado,claseObtenido){
        return {tipox:'table', nodes:[
                {tipox:'tr', nodes:[{tipox:'td', className:claseEsperado, nodes:[{tipox:'pre', innerText:probador.mostrarCampos(esperado)}]}]},
                {tipox:'tr', nodes:[{tipox:'td', className:claseObtenido, nodes:[{tipox:'pre', innerText:probador.mostrarCampos(obtenido)}]}]},
        ]};
    }
    var controlandoDom=true;
    var considerarArray={
        '[object NodeList]':true,
        '[object DOMTokenList]':true
    };
    var compararBonito=function(esperado,obtenido,bidireccional){
        var rta={tieneError:false, tieneAdvertencias:false};
        if( typeof esperado =='object'?(
                esperado instanceof RegExp?(
                    !esperado.test(obtenido)
                ):(
                    typeof obtenido !='object' ||
                        (esperado===null)!==(obtenido===null) ||
                        (esperado===undefined)!==(obtenido===undefined) ||
                        (esperado instanceof Array)!==(obtenido instanceof Array || controlandoDom && !!considerarArray[({}).toString.call(obtenido)]) ||
                        (esperado instanceof Date)!==(esperado instanceof Date) ||
                        (esperado instanceof ArgumentoEspecialParaMock) && !esperado.compatible(obtenido) || 
                        (esperado instanceof Date) && esperado.toString()!=obtenido.toString()
                )
            ):(
                typeof esperado =='function' && esperado instanceof RegExp?(
                    !esperado.test(obtenido)
                ):(
                    esperado!==obtenido
                )
            )
        ){
            if(({}).toString.call(obtenido)=='[object NodeList]'){
                var stop1=obtenido.length;
                var stop2=controlandoDom;
                var stop3=esperado instanceof Array;
                var stop4=obtenido.length===1;
                var stop5=(obtenido instanceof Array || controlandoDom && obtenido!==null && (obtenido.length || obtenido.length===0));
            }
            rta.tieneError=!caso.ignorarDiferenciaDeTiposNumericos || isNaN(esperado) || isNaN(obtenido) || esperado!=obtenido;
            rta.tieneAdvertencias=true;
            rta.bonito=nodoBonito(esperado, obtenido,'TDD_esperado',rta.tieneError?'TDD_obtenido':'TDD_obtenido_sobrante');
        }else if(typeof(esperado)=='object' && esperado instanceof ArgumentoEspecialParaMock){
            rta.bonito={tipox:'div', className:'TDD_iguales', innerText:probador.cadenaParaMostrar(esperado)};
        }else if(typeof(esperado)!='object' || esperado==null && obtenido==null || esperado instanceof Date || esperado instanceof RegExp){
            rta.bonito={tipox:'div', className:'TDD_iguales', innerText:probador.cadenaParaMostrar(obtenido)};
        }else{
            var nodes=[];
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
            for(var campo in esperado) if(esperado.hasOwnProperty(campo)){
                var valorObtenido=null;
                if(obtenido===document){
                    valorObtenido=document.getElementById(campo);
                }else{
                    valorObtenido=obtenido[campo];
                }
                var rtaInterna=compararBonito(esperado[campo],valorObtenido,bidireccional && campo!='documento');
                definirClaseContenedor(esperado[campo]);
                nodes.push({tipox:'table', className:'TDD_elemento', nodes:[{tipox:'tr',nodes:[
                    {tipox:'td', className:'TDD_label', innerText:campo},
                    nodoArray,
                    {tipox:'td', className:claseContenido, nodes:rtaInterna.bonito}
                ]}]});
                rta.tieneError=rta.tieneError||rtaInterna.tieneError;
                rta.tieneAdvertencias=rta.tieneAdvertencias||rtaInterna.tieneAdvertencias;
            }
            if(bidireccional){
                for(var campo in obtenido) if(obtenido.hasOwnProperty(campo)){
                    if(!(campo in esperado) && (!visualizacionBidireccionalIgnorandoVacios || !!obtenido[campo])){
                        var claseObtenido;
                        if(controlBidireccional){
                            rta.tieneError=true;
                            claseObtenido='TDD_obtenido';
                        }else{
                            claseObtenido='TDD_obtenido_sobrante';
                        }
                        definirClaseContenedor(obtenido[campo]);
                        nodes.push({tipox:'table', className:'TDD_elemento', nodes:[{tipox:'tr',nodes:[
                            {tipox:'td', className:'TDD_label', innerText:campo},
                            nodoArray,
                            {tipox:'td', className:claseContenido, nodes:nodoBonito(new probador.MostrarNoEsperabaNada(),obtenido[campo],'TDD_esperado_no_especificado',claseObtenido)}
                        ]}]});
                    }
                }
            }
            rta.bonito={tipox:'div', nodes:nodes};
        }
        return rta;
    };
    var resultado=compararBonito(esperado,obtenido,true);
    var idModulo='TDD_modulo:'+caso.modulo;
    var elementoModuloTitulo=document.getElementById(idModulo+'_titulo');
    var elementoCasoTitulo=document.getElementById(idCaso+'_titulo');
    var elementoCaso=document.getElementById(idCaso);
    if(resultado.tieneError || this.app.hoyString<=caso.mostrarAunqueNoFalleHasta || resultado.tieneAdvertencias){
        app.grab(idCaso,{tipox:'div', className:'TDD_error', nodes:[
            {tipox:'table',className:'TDD_resultado', nodes:[{tipox:'tr',nodes:[
                {tipox:'td',className:'TDD_label_esperado_obtenido', nodes:['esperado',{tipox:'br'},'obtenido']},
                {tipox:'td',className:'TDD_contenido', nodes:resultado.bonito}
            ]}]},
        ]});
    }
    this.pendientesPorModulos[idModulo]--;
    if(resultado.tieneError){
        this.cambioEstado(caso,'TDD_prueba_fallida');
        document.getElementById(idModulo+'_casos').style.display=null;
        this.errores++;
    }else{
        this.cambioEstado(caso,'TDD_prueba_ok');
    }
    if(caso.elementos){
        for(var elemento in caso.elementos){
            this.elementosBloqueados[elemento]=false;
        }
        var zonaDePrueba=document.getElementById('TDD_zona_'+caso.caso);
        if(zonaDePrueba){
            zonaDePrueba.parentNode.removeChild(zonaDePrueba);
        }
    }
};

Probador.prototype.MostrarNoEsperabaNada=function(){ 
    this.vacio='vacio';
}

Probador.prototype.prioridadEstados={   
    TDD_prueba_ok:1,
    TDD_prueba_ignorada:2,
    TDD_prueba_comenzada:3,
    TDD_prueba_pendiente:6,
    TDD_prueba_en_espera:8,
    TDD_prueba_fallida:9
}

Probador.prototype.cambioEstado=function(caso,nombreClase){
    var elementoTitulo=document.getElementById('TDD_modulo:'+caso.modulo+'_titulo');
    var elementoCaso  =document.getElementById('TDD_caso:'  +caso.caso  +'_titulo');
    this.cambioEstadoDeUno(elementoCaso,nombreClase);
    if(!('hijos' in elementoTitulo)){
        elementoTitulo.hijos={};
    }
    elementoTitulo.hijos[elementoCaso.id]=nombreClase;
    var maxPrioridad='TDD_prueba_ok';
    for(var hijo in elementoTitulo.hijos){
        var claseHijo=elementoTitulo.hijos[hijo];
        if(this.prioridadEstados[maxPrioridad]<this.prioridadEstados[claseHijo]){
            maxPrioridad=claseHijo;
        }
    }
    this.cambioEstadoDeUno(elementoTitulo,maxPrioridad);
}

Probador.prototype.cambioEstadoDeUno=function(elemento,nombreClase){
    if(!!elemento.dataset.clasePrueba){
        elemento.classList.remove(elemento.dataset.clasePrueba);
    }
    elemento.classList.add(nombreClase);
    elemento.dataset.clasePrueba=nombreClase;
}

Aplicacion.prototype.casosDePrueba=[];

Aplicacion.prototype.casosDePrueba.push({
    modulo:'asi_se_ven_los_errores',
    funcion:'estoMismo',
    caso:'así se ven lo errores en los casos de prueba fallidos',
    entrada:[{
        iguales:'cuando el valor del campo del esperado y el obtenido coinciden se ve un solo dato',
        si_no_coinciden:'y abajo en rojo el obtenido',
        'si falta algun campo':{'en el esperado':'y muestra el obtenido'},
        'como se ve si el tipo no coincide':1,
        'y si la estructura no coincide':"{uno:1, dos:2}"}],
    salida:{
        iguales:'cuando el valor del campo del esperado y el obtenido coinciden se ve un solo dato',
        si_no_coinciden:'el valor esperado se ve arriba',
        'si falta algun campo':{'en el obtenido':'muestra el esperado y'},
        'como se ve si el tipo no coincide':"1",
        'y si la estructura no coincide':{uno:1, dos:2}}
});
Aplicacion.prototype.casosDePrueba.push({
    modulo:'asi_se_ven_los_errores',
    funcion:'splice',
    caso:'así se ve cuando una función modifica un dato interno',
    entrada:[["uno", "dos", "tres", "cuatro"],2,1,"3"],
    salida:["tres"]
});
Aplicacion.prototype.casosDePrueba.push({
    modulo:'asi_se_ven_los_errores',
    funcion:'lanzarExcepcion',
    caso:'así se ven los casos que lanzan excepciones cuando se esperaba un resultado',
    entrada:["texto de la excepcion no esperada"],
    salida:{campo_esperado:'valor esperado', otro_campo:'otro valor esperado'}
});
Aplicacion.prototype.casosDePrueba.push({
    modulo:'asi_se_ven_los_errores',
    funcion:'estoMismo',
    caso:'así se ven los casos donde se espera que lance una excepción pero no se lanza',
    entrada:["valor obtenido"],
    error:"texto de la excepcion esperada"
});
Aplicacion.prototype.casosDePrueba.push({
    modulo:'asi_se_ven_los_errores',
    funcion:'lanzarExcepcion',
    caso:'así se ven cuando no coincide el texto de la excepción',
    entrada:["texto de la excepcion obtenida"],
    error:"texto de la excepcion esperada"
});
Aplicacion.prototype.casosDePrueba.push({
    modulo:'asi_se_ven_los_errores',
    funcion:'estoMismo',
    mostrarAunqueNoFalleHasta:'2013-03-31',
    caso:'Hay un problema con las fechas porque el constructor de Date considera GMT0 pero al extraer usa el Locale',
    entrada:[{
        dia:new Date('1991-06-05').getDate(),
        mostrar:new Date('1991-06-05').toString(),
        mostrarUTC:new Date('1991-06-05').toUTCString()
    }],
    salida:{
        dia:5,
        mostrar:'1991-06-05 sin hora ni GMT',
        mostrarUTC:'1991-06-05 sin hora ni GMT'
    }
});

Aplicacion.prototype.asi_se_ven_los_ignorados=function(){
    this.lanzarExcepcion('Esto nunca debe ejecutarse porque es un ejemplo');
}

Aplicacion.prototype.casosDePrueba.push({
    modulo:'asi_se_ven_los_ignorados',
    funcion:'estoMismo',
    caso:'Los casos de prueba ignorados se ven así',
    ignorado:true,
    entrada:[{iguales:'este es',abajo:'solo en obtenido',distinto:'obtenido'}],
    salida:{iguales:'este es',arriba:'solo en esperado',distinto:'esperado'}
});

Aplicacion.prototype.casosDePrueba.push({
    modulo:'asi_se_ven_los_ok',
    funcion:'estoMismo',
    caso:'Se puede comparar en forma exacta usando el campo "salida"',
    entrada:[{iguales:'este es',este_tambien:7}],
    salida:{iguales:'este es',este_tambien:7}
});
Aplicacion.prototype.casosDePrueba.push({
    modulo:'asi_se_ven_los_ok',
    funcion:'estoMismo',
    caso:'Se puede comparar de modo de que estén ciertos campos pero no controlar si sobran (para eso se usa "salidaMinima")',
    entrada:[{iguales:'sí', este_sobra:'en lo esperado no está, pero no molesta'}],
    salidaMinima:{iguales:'sí'}
});
Aplicacion.prototype.casosDePrueba.push({
    modulo:'asi_se_ven_los_ok',
    funcion:'estoMismo',
    mostrarAunqueNoFalleHasta:'2099-12-31',
    caso:'Se puede pedir que muestre el resultado aunque sea correcto especificando en el caso la propiedad mostrarAunqueNoFalleHasta',
    entrada:[{un_dato:'uno', lista:['elemento1', 'elemento2'], dato_agregado:'agregado'}],
    salidaMinima:{un_dato:'uno', lista:['elemento1', 'elemento2']}
});
Aplicacion.prototype.casosDePrueba.push({
    modulo:'asi_se_ven_los_ok',
    funcion:'lanzarExcepcion',
    caso:'así se ve cuando coincide el texto de la excepción',
    entrada:["texto de la excepcion"],
    error:"texto de la excepcion"
});

Aplicacion.prototype.casosDePrueba.push({
    modulo:'asi_se_ven_los_errores',
    funcion:'estoMismo',
    mostrarAunqueNoFalleHasta:'2013-03-31',
    caso:'prueba de RegExp que falla',
    entrada:[{
        simple:'palabra más larga de lo esperada',
        conBarra:'palabra con prefijo',
    }],
    salida:{
        simple:/^Palabra$/gi,
        conBarra:/^prefijo$/g,
    }
});
Aplicacion.prototype.casosDePrueba.push({
    modulo:'asi_se_ven_los_ok',
    funcion:'estoMismo',
    mostrarAunqueNoFalleHasta:'2013-03-31',
    caso:'prueba de RegExp',
    entrada:[{
        simple:'palabra',
        conBarra:'uno/otro',
        conEspacioOpcional:'todojunto separado',
    }],
    salida:{
        simple:/^Palabra$/i,
        conBarra:/^uno\/otro$/,
        conEspacioOpcional:/^todo ?junto ?separado$/
    }
});
Aplicacion.prototype.casosDePrueba.push({
    modulo:'asi_se_ven_los_ok',
    funcion:'estoMismo',
    mostrarAunqueNoFalleHasta:'2013-03-31',
    caso:'prueba de Fechas, hay que usar UTC',
    entrada:[{
        dia:new Date('1991-06-05').getUTCDate(),
    }],
    salida:{
        dia:5,
    }
});
Aplicacion.prototype.casosDePrueba.push({
    modulo:'asi_se_ven_los_ok',
    funcion:'estoMismo',
    caso:'veo que el sort ordene bien',
    entrada:[[91,1,9,11,111].sort(function(a,b){return a-b})],
    salida:[1,9,11,91,111]
});
Aplicacion.prototype.casosDePrueba.push({
    modulo:'asi_se_ven_los_ok',
    funcion:'estoMismo',
    caso:'veo que el reverse dé vuelta',
    entrada:[[91,1,9,11,111].reverse()],
    salida:[111,11,9,1,91]
});
Aplicacion.prototype.casosDePrueba.push({
    modulo:'asi_se_ven_los_ok',
    funcion:'estoMismo',
    caso:'veo que el sort ordene al revés',
    entrada:[[91,1,9,11,111].sort(function(a,b){return b-a})],
    salida:[111,91,11,9,1]
});

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

Aplicacion.prototype.appMock=function(definicion){
    var mock=definicion.mockBasadoEnAplicacion?new Aplicacion():{esAplicacion:true};
    var rtaMock={obtenido:{}, esperado:{}};
    var app=this;
    if('mocks' in definicion){
        for(var paso=0; paso<definicion.mocks.length; paso++){
            var defMock=definicion.mocks[paso];
            if('funcion' in defMock){
                if(defMock.llamadas){
                    rtaMock.esperado[defMock.funcion]={llamadas:[]};
                    rtaMock.obtenido[defMock.funcion]={llamadas:[]};
                    for(var iLlamada=0; iLlamada<defMock.llamadas.length; iLlamada++){
                        rtaMock.esperado[defMock.funcion].llamadas.push({argumentos:defMock.llamadas[iLlamada].argumentos, invocaciones:defMock.llamadas[iLlamada].invocaciones||1});
                        rtaMock.obtenido[defMock.funcion].llamadas.push({argumentos:defMock.llamadas[iLlamada].argumentos, invocaciones:0});
                    }
                }else{
                    rtaMock.esperado[defMock.funcion]={argumentos:defMock.argumentos, invocaciones:defMock.invocaciones||1};
                    rtaMock.obtenido[defMock.funcion]={invocaciones:0};
                }
                mock[defMock.funcion]=function(defMock){
                    return function(){
                        var defRta;
                        var args_obtenidos=[];
                        for(var ia=0; ia<arguments.length; ia++){
                            args_obtenidos.push(arguments[ia]);
                        }
                        if(defMock.llamadas){
                            var json_args_obtenidos=JSON.stringify(args_obtenidos,ArgumentoEspecialParaMock.stringify);
                            for(var ill=0; ill<defMock.llamadas.length; ill++){
                                var defLlamada=defMock.llamadas[ill];
                                if(json_args_obtenidos==JSON.stringify(defLlamada.argumentos)){
                                    break;
                                }
                            }
                            if(ill<defMock.llamadas.length){ // encontré
                                rtaMock.obtenido[defMock.funcion].llamadas[ill].invocaciones++;
                                defRta=defLlamada;
                            }else{
                                rtaMock.obtenido[defMock.funcion].llamadas.push({argumentos:args_obtenidos, invocaciones:1});
                                defRta={retornar:null};
                            }
                        }else{
                            rtaMock.obtenido[defMock.funcion].argumentos=args_obtenidos;
                            rtaMock.obtenido[defMock.funcion].invocaciones++;
                            defRta=defMock;
                        }
                        if(defRta.futuro){
                            var futuro=mock.newFuturo();
                            for(var aplicar in defRta.futuro){
                                futuro[aplicar](defRta.futuro[aplicar]);
                            }
                            return futuro;
                        }else{
                            return defRta.retornar;
                        }
                    }
                }(defMock);
            }else if('copiar' in defMock){
                mock[definicion.mocks[paso].copiar]=app[definicion.mocks[paso].copiar];
            }else{
                mock[definicion.mocks[paso].miembro]=definicion.mocks[paso].valor;
            }
        }
    }
    if(!('newFuturo' in mock)){
        mock.newFuturo=this.newFuturo;
    }
    mock.mock=rtaMock;
    return mock;
}

Aplicacion.prototype.probarEvento=function(definicion){
    var funcionEvento=this.eventos[definicion.nombre];
    if(definicion.sinMock){
        return funcionEvento.call(this,definicion.evento,document.getElementById(definicion.idDestino),{probando:true});
    }else{
        var mock=this.appMock(definicion);
        if('localStorage' in definicion){
            for(var clave_ls in definicion.localStorage){
                localStorage[clave_ls]=JSON.stringify(definicion.localStorage[clave_ls]);
            }
        }
        funcionEvento.call(mock,definicion.evento,document.getElementById(definicion.idDestino));
        mock.dato={};
        if(definicion.incluirDocumentoEnSalida){
            mock.dato.documento=document;
        }
        if('localStorage' in definicion){
            mock.dato.localStorage={};
            for(var clave_ls in definicion.localStorage){
                mock.dato.localStorage[clave_ls]=JSON.parse(localStorage[clave_ls]);
            }
        }
        return mock;
    }
}

Aplicacion.prototype.probarFuncionModificadoraApp=function(definicion){
    var mock=this.appMock(definicion);
    mock[definicion.funcion]=this[definicion.funcion];
    for(var variable in definicion.miembrosModificables){
        mock[variable]=JSON.parse(JSON.stringify(definicion.miembrosModificables[variable]));
    }
    mock[definicion.funcion].apply(mock,definicion.argumentos);
    var rta={};
    for(var variable in definicion.miembrosModificables){
        rta[variable]=mock[variable]; 
    }
    mock.dato=rta;
    return mock;
}

Aplicacion.prototype.pruebaGrabSimple=function(definicion){
    this.grab(TDD_zona_de_pruebas,{tipox:'div', id:'TDD_zona_de_pruebas_simple', nodes:definicion});
    var rta=TDD_zona_de_pruebas_simple.innerHTML;
    TDD_zona_de_pruebas.removeChild(TDD_zona_de_pruebas_simple);
    return rta;
}

Aplicacion.prototype.pruebaTraduccion=function(definicion){
    var creador=this.domCreator(definicion.tipox);
    return creador.translate(definicion);
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
    elementos:{}, // para que se cree el contenedor para después hacer el grab
    entrada:[function(){
        var definicion={tipox:'div', id:'idds', dataset:{uno:'uno', otroAtributoInterno:'otro'}};
        return this.grab('TDD_zona_'+'prueba de dataset directo del objeto',definicion);        
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

Aplicacion.prototype.casosDePrueba.push({
    modulo:'acceso a datos del servidor',
    funcion:'accesoDb',
    caso:'traer los datos de la prueba_tabla_comun',
    entrada:[{hacer:'select',from:'prueba_tabla_comun',where:true,order_by:true}],
    mostrarAunqueNoFalleHasta:'2013-03-31',
    salida:[
        {id:1,nombre:"uno",importe:null,activo:true ,cantidad:-9  ,fecha:new Date('2001-12-31'),"ultima_modificacion":"2001-01-01"},
        {id:2,nombre:"dos",importe:0.11,activo:false,cantidad:1   ,fecha:null                  ,"ultima_modificacion":"2001-01-01"},
        {id:3,nombre:"año",importe:2000,activo:null ,cantidad:null,fecha:new Date('1991-05-06'),"ultima_modificacion":"2001-01-01"}
    ]
});

Aplicacion.prototype.casosDePrueba.push({
    modulo:'acceso a datos del servidor',
    funcion:'accesoDb',
    caso:'para traer todos los datos (sin where) hay que poner where:true',
    entrada:[{hacer:'select',from:'prueba_tabla_comun'}],
    error:"el acceso a datos debe tener una clausula where"
});
