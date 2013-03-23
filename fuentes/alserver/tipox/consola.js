// Por $Author$ Revisión $Revision$ del $Date$

Aplicacion.prototype.paginas.tdd={ 
    labelMenu:{tipox:'span', className:'TDD_menu', innerText:'T.D.D.'},
    filtro:function(app){ return app.entornoDesarrollo },
    nodes:["Pruebas internas de funcionamiento ",
        {tipox:'funcion', id:'probarTodo', funcion:'probarTodo', className:'TDD_resultados'},
        {tipox:'div', id:'TDD_zona_de_pruebas'}
    ]
};

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
    probador.probarTodo();
}

Probador.prototype.probarTodo=function(){
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
        var elementoFuncionCasos=document.getElementById(idModulo+'_casos');
        if(!elementoFuncionCasos){
            this.pendientesPorModulos[idModulo]=0;
            this.app.grab('probarTodo',
                {tipox:'div', classList:['TDD_modulo'], id:idModulo, nodes:[
                    {tipox:'div', classList:['TDD_modulo_titulo','TDD_prueba_pendiente'], id:idModulo+'_titulo', innerText:caso.modulo, eventos:{click:'toggleDisplayAbajo'}},
                    {tipox:'div', id:idModulo+'_casos', style:{display:'none'}}
                ]}
            );
            elementoFuncionCasos=document.getElementById(idModulo+'_casos');
        }
        var elementoFuncionTitulo=document.getElementById(idModulo+'_titulo');
        var idCaso='TDD_caso:'+i;
        var clase=caso.ignorado?'TDD_prueba_ignorada':'TDD_prueba_pendiente';
        var tituloCaso=[caso.caso];
        var ticket;
        if(caso.ignorado && caso.ignorado.substr && caso.ignorado.substr(0,1)=='#' && this.app.tracUrl){  
            ticket={tipox:'a', href:this.app.tracUrl+'/ticket/'+caso.ignorado.substr(1), innerText:caso.ignorado};
            tituloCaso.push(ticket);
        }
        var nodosInternos=[{tipox:'div', classList:['TDD_caso_titulo',clase], id:idCaso+'_titulo', nodes:tituloCaso}];
        if(caso.aclaracionSiFalla){
            nodosInternos.push({tipox:'div', className:'TDD_aclaracion', id:idCaso+'_aclaracion', nodes:caso.aclaracionSiFalla});
        }
        this.app.grab(elementoFuncionCasos,
            {tipox:'div', className:'TDD_caso', id:idCaso, nodes:nodosInternos}
        );
        if(caso.ignorado){  
            elementoFuncionTitulo.classList.remove('TDD_prueba_pendiente');
            elementoFuncionTitulo.classList.add('TDD_prueba_ignorada');
            if(ticket){
                this.app.grab(elementoFuncionTitulo,[ticket,' ']);
                // this.app.grab(elementoFuncionTitulo,[{tipox:'a', href:this.tracUrl+'/ticket/'+caso.ignorado.substr(1), innerText:caso.ignorado},' ']);
            }
        }else{
            this.pendientesPorModulos[idModulo]++;
        }
        var elementoCaso=document.getElementById(idModulo);
    }
    this.probarUnCaso(0,100);
    if(this.casosDePrueba[0].caso=='así se ven lo errores en los casos de prueba fallidos'){
        document.getElementById('TDD_caso:0').parentNode.style.display='none';
    }
}

Probador.prototype.probarUnCaso=function(desde,cuantos){
    for(var i=desde; i<desde+cuantos && i<this.casosDePrueba.length; i++){
        var caso=this.casosDePrueba[i];
        if(!caso.ignorado){
            var idModulo='TDD_modulo:'+caso.modulo;
            var idCaso='TDD_caso:'+i;
            var esto=null;
            var estos=[this.app,window];
            for(var i_esto=0;i_esto<estos.length;i_esto++){
                if(caso.funcion in estos[i_esto]){
                    esto=estos[i_esto];
                    break;
                }
            }
            var obtenido=null;
            var errorObtenido=null;
            if(!esto){
                this.app.lanzarExcepcion("no existe la función "+caso.funcion+" o no se encuentra en los lugares probables");
            }
            if(caso.relanzarExcepcionSiHay){
                obtenido=esto[caso.funcion].apply(esto,caso.entrada);
            }else{
                try{
                    obtenido=esto[caso.funcion].apply(esto,caso.entrada);
                }catch(err){
                    errorObtenido=err.message||'Recibida excepción sin message';
                }
            }
            var app=this.app;
            var este=this;
            if(obtenido instanceof Futuro){
                obtenido.luego(function(respuesta,app){
                    este.compararObtenido(respuesta,null,caso,idCaso);
                }).alFallar(function(mensaje,app){
                    este.compararObtenido(null,mensaje,caso,idCaso);
                });
            }else{
                este.compararObtenido(obtenido,errorObtenido,caso,idCaso);
            }
            this.pendientesPorModulos[idModulo]--;
            if(this.pendientesPorModulos[idModulo]==0){
                var elementoFuncionTitulo=document.getElementById(idModulo+'_titulo');
                if(elementoFuncionTitulo.classList.contains('TDD_prueba_pendiente')){
                    elementoFuncionTitulo.classList.remove('TDD_prueba_pendiente');
                    elementoFuncionTitulo.classList.add('TDD_prueba_ok');
                }
            }
        }
    }
    desde+=cuantos;
    var este=this;
    if(desde<this.casosDePrueba.length){
        setTimeout(function(){ este.probarUnCaso(desde,cuantos); },100);
    }
}

Probador.prototype.compararObtenido=function(obtenidoOk,errorObtenido,caso,idCaso){
    this.cantidadPruebas++;
    if(!(caso.modulo in this.cantidadPruebasPorModulos)){
        this.cantidadPruebasPorModulos[caso.modulo]=0;
    }
    this.cantidadPruebasPorModulos[caso.modulo]++;
    var esperado=caso.salida||caso.salidaMinima||caso.salidaDom;
    var visualizacionBidireccional=!('salidaDom' in caso);
    var controlBidireccional=true;
    var obtenido=obtenidoOk;
    if(obtenido && obtenido.mock){
        obtenido={dato:obtenidoOk.dato, mock:obtenidoOk.mock.obtenido, error:errorObtenido||null};
        esperado={dato:esperado       , mock:obtenidoOk.mock.esperado, error:caso.error   ||null};
    }else if(errorObtenido || caso.error){
        obtenido={dato:obtenidoOk||null, error:errorObtenido||null};
        esperado={dato:esperado  ||null, error:caso.error   ||null};
    }else{
        controlBidireccional='salida' in caso;
    }
    var mostrarCampos=function(objeto){
        var rta;
        try{
            rta=JSON.stringify(objeto);
        }catch(err){
            var rta=objeto.toString();
            for(var atributo in objeto){
                try{
                    rta+=', '+atributo+objeto[atributo];
                }catch(err2){
                }
            }
        }
        return rta;
    }
    var nodoBonito=function(esperado,obtenido,claseEsperado,claseObtenido){
        return {tipox:'table', nodes:[
                {tipox:'tr', nodes:[{tipox:'td', className:claseEsperado, nodes:[{tipox:'pre', innerText:mostrarCampos(esperado)}]}]},
                {tipox:'tr', nodes:[{tipox:'td', className:claseObtenido, nodes:[{tipox:'pre', innerText:mostrarCampos(obtenido)}]}]},
        ]};
    }
    var compararBonito=function(esperado,obtenido){
        var rta={tieneError:false};
        if(
            (typeof(esperado)=='object'?
                (typeof(obtenido)!='object' 
                    || (esperado===null)!==(obtenido===null) 
                    || (esperado===undefined)!==(obtenido===undefined) 
                    || (esperado instanceof Array)!==(obtenido instanceof Array)
                ):
                esperado!==obtenido
            )
        ){
            rta.tieneError=true;
            rta.bonito=nodoBonito(esperado, obtenido,'TDD_esperado','TDD_obtenido');
        }else if(typeof(esperado)!='object'){
            rta.bonito={tipox:'div', className:'TDD_iguales', innerText:JSON.stringify(esperado)};
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
                var rtaInterna=compararBonito(esperado[campo],valorObtenido);
                definirClaseContenedor(esperado[campo]);
                nodes.push({tipox:'table', className:'TDD_elemento', nodes:[{tipox:'tr',nodes:[
                    {tipox:'td', className:'TDD_label', innerText:campo},
                    nodoArray,
                    {tipox:'td', className:claseContenido, nodes:rtaInterna.bonito}
                ]}]});
                rta.tieneError=rta.tieneError||rtaInterna.tieneError;
            }
            if(visualizacionBidireccional){
                for(var campo in obtenido) if(obtenido.hasOwnProperty(campo)){
                    if(!(campo in esperado)){
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
                            {tipox:'td', className:claseContenido, nodes:nodoBonito(undefined,obtenido[campo],'TDD_esperado',claseObtenido)}
                        ]}]});
                    }
                }
            }
            rta.bonito={tipox:'div', nodes:nodes};
        }
        return rta;
    };
    var resultado=compararBonito(esperado,obtenido);
    var idModulo='TDD_modulo:'+caso.modulo;
    var elementoFuncionTitulo=document.getElementById(idModulo+'_titulo');
    var elementoCasoTitulo=document.getElementById(idCaso+'_titulo');
    var elementoCaso=document.getElementById(idCaso);
    elementoCasoTitulo.classList.remove('TDD_prueba_ignorada');
    elementoCasoTitulo.classList.remove('TDD_prueba_pendiente');
    if(resultado.tieneError || this.app.hoyString<=caso.mostarAunqueNoFalleHasta){
        app.grab(idCaso,{tipox:'div', className:'TDD_error', nodes:[
            {tipox:'table',className:'TDD_resultado', nodes:[{tipox:'tr',nodes:[
                {tipox:'td',className:'TDD_label_esperado_obtenido', nodes:['esperado',{tipox:'br'},'obtenido']},
                {tipox:'td',className:'TDD_contenido', nodes:resultado.bonito}
            ]}]},
        ]});
    }
    if(resultado.tieneError){
        elementoFuncionTitulo.classList.remove('TDD_prueba_ignorada');
        elementoFuncionTitulo.classList.remove('TDD_prueba_pendiente');
        elementoFuncionTitulo.classList.add('TDD_prueba_fallida');
        elementoCasoTitulo.classList.add('TDD_prueba_fallida');
        document.getElementById(idModulo+'_casos').style.display=null;
        this.errores++;
    }else{
        elementoCasoTitulo.classList.add('TDD_prueba_ok');
    }
};

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
    mostarAunqueNoFalleHasta:'2099-12-31',
    caso:'Se puede pedir que muestre el resultado aunque sea correcto especificando en el caso la propiedad mostarAunqueNoFalleHasta',
    entrada:[{un_dato:'uno', lista:['elemento1', 'elemento2'], dato_agregado:'agregado'}],
    salidaMinima:{un_dato:'uno', lista:['elemento1', 'elemento2']}
});
Aplicacion.prototype.casosDePrueba.push({
    modulo:'asi_se_ven_los_ok',
    funcion:'lanzarExcepcion',
    caso:'así se ven cuando no coincide el texto de la excepción',
    entrada:["texto de la excepcion"],
    error:"texto de la excepcion"
});

Aplicacion.prototype.casosDePrueba.push({
    modulo:'control interno del sistema',
    funcion:'enviarPaquete',
    caso:'control de que el sistema esté instalado',
    aclaracionSiFalla:['se puede instalar poniendo directamente ',{tipox:'a', href:'app.php?proceso=instalarBaseDeDatos', innerText:'app.php?proceso=instalarBaseDeDatos'}],
    entrada:[{proceso:'control_instalacion',sincronico:true,paquete:{}}],
    salidaMinima:{estadoInstalacion:'completa'}
});

Aplicacion.prototype.casosDePrueba.push({
    modulo:'control de usuarios',
    funcion:'enviarPaquete',
    caso:'entrada al sistema exitosa',
    entrada:[{proceso:'entrada',sincronico:true,paquete:{usuario:'abel',password:hex_md5('abel'+'clave1')}}],
    salidaMinima:{activo:true}
});
Aplicacion.prototype.casosDePrueba.push({
    modulo:'control de usuarios',
    funcion:'enviarPaquete',
    caso:'entrada al sistema fallida por clave erronea',
    entrada:[{proceso:'entrada',sincronico:true,paquete:{usuario:'abel',password:hex_md5('abel'+'clave2')}}],
    error:'el usuario o la clave no corresponden a un usuario activo'
});
Aplicacion.prototype.casosDePrueba.push({
    modulo:'control de usuarios',
    funcion:'enviarPaquete',
    caso:'entrada al sistema fallida por usuario inexistente',
    entrada:[{proceso:'entrada',sincronico:true,paquete:{usuario:'beto',password:hex_md5('beto')}}],
    error:'el usuario o la clave no corresponden a un usuario activo'
});
Aplicacion.prototype.casosDePrueba.push({
    modulo:'control de usuarios',
    funcion:'enviarPaquete',
    caso:'entrada al sistema fallida por usuario inactivo',
    entrada:[{proceso:'entrada',sincronico:true,paquete:{usuario:'cain',password:hex_md5('cain'+'clave2')}}],
    error:'el usuario "cain" no esta activo'
});
Aplicacion.prototype.casosDePrueba.push({
    modulo:'control de usuarios',
    funcion:'probarEvento',
    caso:'entrada al sistema errónea a través del evento entrada',
    entrada:[{
        nombre:'entrar_aplicacion',
        elementos:{
            usuario:{tipox:'input', type:'text', value:'abel'}, 
            password:{tipox:'input', type:'password', value:'clave2'},
            resultado:{tipox:'div'},
            boton_entrar:{tipox:'input', type:'button', disabled:'disabled'}
        },
        mocks:[{ 
            funcion:'enviarPaquete', 
            argumentos:[{proceso:'entrada', paquete:{usuario:'abel', password:hex_md5('abel'+'clave2')}}], 
            futuro:{recibirError:"clave errónea"}
        },{ 
            miembro:'esAplicacion', 
            valor:true
        }]
    }],
    salidaDom:{
        resultado:{innerText:'clave errónea', className:'resultado_error'}, 
        boton_entrar:{disabled:false}
    }
});
Aplicacion.prototype.casosDePrueba.push({
    modulo:'control de usuarios',
    funcion:'probarEvento',
    caso:'entrada al sistema exitosa a través del evento entrada',
    // relanzarExcepcionSiHay:true,
    entrada:[{
        nombre:'entrar_aplicacion',
        elementos:{
            usuario:{tipox:'input', type:'text', value:'abel'}, 
            password:{tipox:'input', type:'password', value:'clave1'},
            resultado:{tipox:'div'},
            boton_entrar:{tipox:'input', type:'button', disabled:'disabled'}
        },
        mocks:[{ 
            funcion:'enviarPaquete', 
            argumentos:[{proceso:'entrada', paquete:{usuario:'abel', password:hex_md5('abel'+'clave1')}}], 
            futuro:{recibirListo:{activo:true}}
        },{ 
            funcion:'cambiarUrl', 
            argumentos:['{"menu":"donde_entra"}'], 
            retornar:null
        },{ 
            miembro:'esAplicacion', 
            valor:true
        },{ 
            miembro:'urlBienvenida', 
            valor:'{"menu":"donde_entra"}'
        }]
    }],
    salidaDom:{
        resultado:{innerText:'Validado. Entrando...', className:'resultado_ok'}, 
        boton_entrar:{disabled:true}
    }
});

Aplicacion.prototype.appMock=function(definicion){
    var mock={};
    var rtaMock={obtenido:{}, esperado:{}};
    var app=this;
    for(var paso=0; paso<definicion.mocks.length; paso++){
        var defMock=definicion.mocks[paso];
        if('funcion' in defMock){
            rtaMock.esperado[defMock.funcion]={argumentos:defMock.argumentos, invocaciones:defMock.invocaciones||1};
            rtaMock.obtenido[defMock.funcion]={invocaciones:0};
            mock[defMock.funcion]=function(defMock){
                return function(){
                    var args_obtenidos=[];
                    for(var ia=0; ia<arguments.length; ia++){
                        args_obtenidos.push(arguments[ia]);
                    }
                    rtaMock.obtenido[defMock.funcion].argumentos=args_obtenidos;
                    rtaMock.obtenido[defMock.funcion].invocaciones++;
                    if(defMock.futuro){
                        var futuro=app.newFuturo();
                        for(var aplicar in defMock.futuro){
                            futuro[aplicar](defMock.futuro[aplicar]);
                        }
                        return futuro;
                    }else{
                        return defMock.retornar;
                    }
                }
            }(defMock);
        }else{
            mock[definicion.mocks[paso].miembro]=definicion.mocks[paso].valor;
        }
    }
    mock.mock=rtaMock;
    return mock;
}

Aplicacion.prototype.probarEvento=function(definicion){
    TDD_zona_de_pruebas.innerHTML='';
    this.grab(TDD_zona_de_pruebas,cambiandole(definicion.elementos,{indexadoPor:'id'}));
    var funcionEvento=this.eventos[definicion.nombre];
    var mock=this.appMock(definicion);
    funcionEvento.call(mock,definicion.evento,document.getElementById(definicion.idDestino));
    mock.dato=document;
    return mock;
}

Aplicacion.prototype.pruebaGrabSimple=function(definicion){
    TDD_zona_de_pruebas.innerHTML='';
    this.grab(TDD_zona_de_pruebas,definicion);
    return TDD_zona_de_pruebas.innerHTML;
}

Aplicacion.prototype.pruebaTraduccion=function(definicion){
    var creador=this.creadores[definicion.tipox].creador;
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
