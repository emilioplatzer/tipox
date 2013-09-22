// Por $Author: emilioplatzer@gmail.com $ Revisión $Revision: 88 $ del $Date: 2013-09-07 15:58:38 -0300 (sáb 07 de sep de 2013) $
"use strict";


// Aplicacion.prototype.eventos.toggleDisplayAbajo=function(evento,elemento){
    // var hermano=elemento.nextSibling;
    // hermano.style.display=hermano.style.display?null:'none';
// }

function FlujoColocadorProbador(){
    var preparado=false;
    var elementoResultados;
    this.colocador=new Colocador();
    var preparar=function(){
        elementoResultados=document.getElementById('TDD_resultados')||
            this.colocador.colocar({destino:document.body,contenido:{tipox:'div', className:'TDD_resultados'}});
        preparado=true;
    }
    this.enviar=function(mensaje){
        if(!preparado){
            preparar.call(this);
        }
        var idModulo='TDD_modulo:'+mensaje.modulo;
        var elementoModulo=document.getElementById(idModulo)||
            this.colocador.colocar({
                destino:elementoResultados,
                contenido:{
                    tipox:'div', className:'TDD_modulo', id:idModulo, nodes:[
                        {tipox:'div', 
                            classList:['TDD_modulo_titulo','TDD_prueba_pendiente'], 
                            dataset:{clasePrueba:'TDD_prueba_pendiente'},
                            id:idModulo+'_titulo', 
                            innerText:mensaje.modulo, 
                            eventos:{click:'toggleDisplayAbajo'}
                        },
                        {tipox:'div', id:idModulo+'_casos', style:{display:'none'}}
                    ]
                }
            });
        var elementoModuloCasos=document.getElementById(idModulo+'_casos');
        var elementoModuloTitulo=document.getElementById(idModulo+'_titulo');
        var idCaso='TDD_caso:'+mensaje.caso;
        var tituloCaso=[mensaje.caso];
        if(mensaje.ticket){
            var ticket={tipox:'a', href:this.app.tracUrl+'/ticket/'+mensaje.ignorado.substr(1), innerText:mensaje.ignorado};
            tituloCaso.push(ticket);
            this.app.colocador.colocar({destino:elementoModuloTitulo, contenido:[' ',ticket]});
        }
        var elementoCaso=this.colocador.colocar({
            destino:elementoModuloCasos,
            contenido:{
                tipox:'div', classList:['TDD_caso', 'TDD_estado_'+mensaje.estado], id:idCaso, nodes:[{
                    tipox:'div', 
                    classList:['TDD_caso_titulo', 'TDD_estado_'+mensaje.estado], 
                    id:idCaso+'_titulo', 
                    dataset:{estadoTdd:mensaje.estado},
                    nodes:tituloCaso
                }]
            }
        });
        if(mensaje.errores){
            var nodoBonito=function(esperado,obtenido,claseEsperado,claseObtenido){
                return {tipox:'table', nodes:[
                        {tipox:'tr', nodes:[{tipox:'td', className:claseEsperado, nodes:[{tipox:'pre', innerText:esperado}]}]},
                        {tipox:'tr', nodes:[{tipox:'td', className:claseObtenido, nodes:[{tipox:'pre', innerText:obtenido}]}]},
                ]};
            }
            // elementoCaso=document.getElementById(idCaso);
            this.colocador.colocar({
                destino:elementoCaso,
                contenido:{
                    tipox:'div', className:'TDD_error', nodes:[]
                }
            });
        }
    }
}

Probador.prototype.compararObtenidoX=function(obtenidoOk,errorObtenido,caso,idCaso,salvarEntrada,appMock){
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
        app.colocar(idCaso,{tipox:'div', className:'TDD_error', nodes:[
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

Probador.prototype.MostrarNoEsperabaNadaX=function(){
    this.vacio='vacio';
}

Probador.prototype.prioridadEstadosX={   
    TDD_prueba_ok:1,
    TDD_prueba_ignorada:2,
    TDD_prueba_comenzada:3,
    TDD_prueba_pendiente:6,
    TDD_prueba_en_espera:8,
    TDD_prueba_fallida:9
}

Probador.prototype.cambioEstadoX=function(caso,nombreClase){
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

Probador.prototype.cambioEstadoDeUnoX=function(elemento,nombreClase){
    if(!!elemento.dataset.clasePrueba){
        elemento.classList.remove(elemento.dataset.clasePrueba);
    }
    elemento.classList.add(nombreClase);
    elemento.dataset.clasePrueba=nombreClase;
}

Aplicacion.prototype.cargarCasosDePruebaX=function(){
    Aplicacion.prototype.casosDePrueba=[];
    for(var i=0; i<Aplicacion.prototype.paraCargarCasosDePrueba.length; i++){
        Aplicacion.prototype.paraCargarCasosDePrueba[i]();
    }
}

Aplicacion.prototype.appMockX=function(definicion){
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

Aplicacion.prototype.probarEventoX=function(definicion){
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

Aplicacion.prototype.probarFuncionModificadoraAppX=function(definicion){
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

Aplicacion.prototype.pruebaGrabSimpleX=function(definicion){
    this.colocar(TDD_zona_de_pruebas,{tipox:'div', id:'TDD_zona_de_pruebas_simple', nodes:definicion});
    var rta=TDD_zona_de_pruebas_simple.innerHTML;
    TDD_zona_de_pruebas.removeChild(TDD_zona_de_pruebas_simple);
    return rta;
}

Aplicacion.prototype.pruebaTraduccionX=function(definicion){
    var creador=this.domCreator(definicion.tipox);
    return creador.translate(definicion);
}

