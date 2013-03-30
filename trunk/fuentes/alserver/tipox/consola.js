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
    if("capturar la excepción y mostrarla en debug directo"){
        try{
            probador.probarTodo();
        }catch(err){
            debugDirecto(descripcionError(err));
            // debugDirecto(err.stack);
        }
    }else{
        probador.probarTodo();
    }
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
        var elementoModuloCasos=document.getElementById(idModulo+'_casos');
        if(!elementoModuloCasos){
            this.pendientesPorModulos[idModulo]=0;
            this.app.grab('probarTodo',
                {tipox:'div', classList:['TDD_modulo'], id:idModulo, nodes:[
                    {tipox:'div', classList:['TDD_modulo_titulo','TDD_prueba_pendiente'], id:idModulo+'_titulo', innerText:caso.modulo, eventos:{click:'toggleDisplayAbajo'}},
                    {tipox:'div', id:idModulo+'_casos', style:{display:'none'}}
                ]}
            );
            elementoModuloCasos=document.getElementById(idModulo+'_casos');
        }
        var elementoModuloTitulo=document.getElementById(idModulo+'_titulo');
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
        this.app.grab(elementoModuloCasos,
            {tipox:'div', className:'TDD_caso', id:idCaso, nodes:nodosInternos}
        );
        compatibilidad.classList(elementoModuloTitulo);
        if(caso.ignorado){  
            elementoModuloTitulo.classList.remove('TDD_prueba_pendiente');
            elementoModuloTitulo.classList.add('TDD_prueba_ignorada');
            if(ticket){
                this.app.grab(elementoModuloTitulo,[ticket,' ']);
                // this.app.grab(elementoModuloTitulo,[{tipox:'a', href:this.tracUrl+'/ticket/'+caso.ignorado.substr(1), innerText:caso.ignorado},' ']);
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
    var procesarHasta=(new Date()).getTime()+500;
    for(var i=desde; i<desde+cuantos && i<this.casosDePrueba.length && (new Date()).getTime()<procesarHasta; i++){
        var caso=this.casosDePrueba[i];
        if(!caso.ignorado){
            var idModulo='TDD_modulo:'+caso.modulo;
            var idCaso='TDD_caso:'+i;
            var esto=null;
            var estos=[this.app,window,caso.entrada[0]];
            for(var i_esto=0;i_esto<estos.length;i_esto++){
                if(caso.funcion in estos[i_esto]){
                    esto=estos[i_esto];
                    break;
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
            }
            if(caso.relanzarExcepcionSiHay){
                correrCaso();
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
                obtenido.luego(function(caso,idCaso,salvarEntrada){
                    return function(respuesta,app){
                        este.compararObtenido(respuesta,null,caso,idCaso,salvarEntrada);
                    }
                }(caso,idCaso,salvarEntrada)).alFallar(function(caso,idCaso,salvarEntrada){
                    return function(mensaje,app){
                        este.compararObtenido(null,mensaje,caso,idCaso,salvarEntrada);
                   }
                }(caso,idCaso,salvarEntrada));
            }else{
                este.compararObtenido(obtenido,errorObtenido,caso,idCaso,salvarEntrada);
            }
            /*
            var elementoModuloTitulo=document.getElementById(idModulo+'_titulo');
            if(elementoModuloTitulo.classList.contains('TDD_prueba_ok')){
                elementoModuloTitulo.classList.remove('TDD_prueba_ok');
                elementoModuloTitulo.classList.add('TDD_prueba_pendiente');
            }
            */
        }
    }
    desde=i;
    var este=this;
    if(desde<this.casosDePrueba.length){
        setTimeout(function(){ este.probarUnCaso(desde,cuantos); },100);
    }
}

Probador.prototype.mostrarCampos=function(objeto){
    var rta;
    try{
        rta=JSON.stringify(objeto);
    }catch(err){
        var rta={};
        for(var atributo in objeto){
            try{
                rta[atributo]=objeto[atributo].toString();
            }catch(err2){
            }
        }
        rta=rta='/* '+objeto.toString()+' */'+JSON.stringify(rta);
    }
    return rta;
}

Probador.prototype.compararObtenido=function(obtenidoOk,errorObtenido,caso,idCaso,salvarEntrada){
    this.cantidadPruebas++;
    if(!(caso.modulo in this.cantidadPruebasPorModulos)){
        this.cantidadPruebasPorModulos[caso.modulo]=0;
    }
    this.cantidadPruebasPorModulos[caso.modulo]++;
    var entradaDespuesDeCorrer=this.mostrarCampos(caso.entrada);
    var esperado=caso.salida||caso.salidaMinima||caso.salidaDom;
    var visualizacionBidireccional=!('salidaDom' in caso);
    var controlBidireccional=true;
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
    }else{
        controlBidireccional='salida' in caso;
    }
    var probador=this;
    var nodoBonito=function(esperado,obtenido,claseEsperado,claseObtenido){
        return {tipox:'table', nodes:[
                {tipox:'tr', nodes:[{tipox:'td', className:claseEsperado, nodes:[{tipox:'pre', innerText:probador.mostrarCampos(esperado)}]}]},
                {tipox:'tr', nodes:[{tipox:'td', className:claseObtenido, nodes:[{tipox:'pre', innerText:probador.mostrarCampos(obtenido)}]}]},
        ]};
    }
    var capturarTiposEspecialesParaComparar=function(dato){
        if(dato instanceof Date){
            dato="₮Date="+dato.toString();
        }else if(typeof(dato)=='string' && dato[0]=="₮"){
            dato="“"+dato;
        }
        return dato;
    }
    var compararBonito=function(esperado,obtenido){
        esperado=capturarTiposEspecialesParaComparar(esperado);
        obtenido=capturarTiposEspecialesParaComparar(obtenido);
        var rta={tieneError:false, tieneAdvertencias:false};
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
            rta.tieneError=!caso.ignorarDiferenciaDeTiposNumericos || isNaN(esperado) || isNaN(obtenido) || esperado!=obtenido;
            rta.tieneAdvertencias=true;
            rta.bonito=nodoBonito(esperado, obtenido,'TDD_esperado',rta.tieneError?'TDD_obtenido':'TDD_obtenido_sobrante');
        }else if(typeof(esperado)!='object' || esperado==null && obtenido==null){
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
                rta.tieneAdvertencias=rta.tieneAdvertencias||rtaInterna.tieneAdvertencias;
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
    var elementoModuloTitulo=document.getElementById(idModulo+'_titulo');
    var elementoCasoTitulo=document.getElementById(idCaso+'_titulo');
    var elementoCaso=document.getElementById(idCaso);
    compatibilidad.classList(elementoCasoTitulo);
    elementoCasoTitulo.classList.remove('TDD_prueba_ignorada');
    elementoCasoTitulo.classList.remove('TDD_prueba_pendiente');
    if(resultado.tieneError || this.app.hoyString<=caso.mostarAunqueNoFalleHasta || resultado.tieneAdvertencias){
        app.grab(idCaso,{tipox:'div', className:'TDD_error', nodes:[
            {tipox:'table',className:'TDD_resultado', nodes:[{tipox:'tr',nodes:[
                {tipox:'td',className:'TDD_label_esperado_obtenido', nodes:['esperado',{tipox:'br'},'obtenido']},
                {tipox:'td',className:'TDD_contenido', nodes:resultado.bonito}
            ]}]},
        ]});
    }
    this.pendientesPorModulos[idModulo]--;
    if(resultado.tieneError){
        elementoModuloTitulo.classList.remove('TDD_prueba_ignorada');
        elementoModuloTitulo.classList.remove('TDD_prueba_pendiente');
        elementoModuloTitulo.classList.add('TDD_prueba_fallida');
        elementoCasoTitulo.classList.add('TDD_prueba_fallida');
        document.getElementById(idModulo+'_casos').style.display=null;
        this.errores++;
    }else{
        if(this.pendientesPorModulos[idModulo]==0){
            if(elementoModuloTitulo.classList.contains('TDD_prueba_pendiente')){
                elementoModuloTitulo.classList.remove('TDD_prueba_pendiente');
                elementoModuloTitulo.classList.add('TDD_prueba_ok');
            }
        }
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
    caso:'así se ve cuando coincide el texto de la excepción',
    entrada:["texto de la excepcion"],
    error:"texto de la excepcion"
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
    entrada:[{
        nombre:'entrar_aplicacion',
        elementos:{
            usuario:{tipox:'input', type:'text', value:'abel'}, 
            password:{tipox:'input', type:'password', value:'clave2'},
            resultado:{tipox:'div'},
            boton_entrar:{tipox:'input', type:'button', disabled:'disabled'}
        },
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
    entrada:[{
        nombre:'entrar_aplicacion',
        elementos:{
            usuario:{tipox:'input', type:'text', value:'abel'}, 
            password:{tipox:'input', type:'password', value:'clave1'},
            resultado:{tipox:'div'},
            boton_entrar:{tipox:'input', type:'button', disabled:'disabled'}
        },
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

Aplicacion.prototype.appMock=function(definicion){
    var mock={esAplicacion:true};
    var rtaMock={obtenido:{}, esperado:{}};
    var app=this;
    if('mocks' in definicion){
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
    }
    mock.mock=rtaMock;
    return mock;
}

Aplicacion.prototype.probarEvento=function(definicion){
    TDD_zona_de_pruebas.innerHTML='';
    this.grab(TDD_zona_de_pruebas,cambiandole(definicion.elementos,{indexadoPor:'id'}));
    var funcionEvento=this.eventos[definicion.nombre];
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
    caso:'creación de elemento del DOM con style',
    entrada:[{tipox:'p', style:{width:200, backgroundColor:'#333'}}],
    salida:'<p style="width: 200px; background-color: rgb(51, 51, 51);"></p>'
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

Aplicacion.prototype.aplicarFuncion=function(hacer,parametros){
    return hacer.apply(app,parametros)
}

Aplicacion.prototype.casosDePrueba.push({
    modulo:'objeto Futuro',
    funcion:'aplicarFuncion',
    caso:'caso simple llega el dato después del luego',
    entrada:[function(){
        var futuro=this.newFuturo();
        var rta='todavía no recibí nada';
        futuro.luego(function(mensaje,app){
            rta=mensaje;
        });
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
        futuro.luego(function(mensaje,app){
            rta=mensaje;
        });
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
        futuro.luego(function(mensaje,app){
            return mensaje+' paso A';
        }).luego(function(mensaje,app){
            rta=mensaje+' paso B';
        });
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
        futuro.luego(function(mensaje,app){
            return mensaje+' paso A';
        }).luego(function(mensaje,app){
            var f2=app.newFuturo();
            f2.tengo=mensaje;
            // setTimeout(function(){ f2.recibirListo(mensaje+' recibido');}, 100);
            rescate_f2=f2;
            return f2;
        }).luego(function(mensaje,app){
            return mensaje+' paso C';
        });
        futuro.luego(function(mensaje,app){
            rta=mensaje+' paso D';
        });
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
        futuro.luego(function(mensaje,app){
            f2=app.newFuturo();
            f2.luego(function(mensaje,app){
                return mensaje+' paso A';
            });
            return f2;
        });
        futuro.recibirListo('Y');
        futuro.luego(function(mensaje,app){
            rta=JSON.stringify(mensaje)+' paso B';
        });
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
        futuro.luego(function(mensaje,app){
            return mensaje+' paso A';
        }).luego(function(mensaje,app){
            return mensaje+' paso B';
        }).luego(function(mensaje,app){
            throw new Error(mensaje+' paso C');
        }).alFallar(function(mensaje,app){
            rta=mensaje+' recibido como error';
        }).luego(function(mensaje,app){
            rta=mensaje+' paso D';
        }).alFallar(function(mensaje,app){
            rta=mensaje+' segundo error';
        });
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
        futuro.luego(function(mensaje,app){
            return mensaje+' paso A';
        }).alFallar(function(mensaje,app){
            return mensaje+' recuperado';
        }).luego(function(mensaje,app){
            rta=mensaje+' paso B';
        }).alFallar(function(mensaje,app){
            rta=mensaje+' segundo error';
        });
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
    entrada:[{hacer:'select',from:'prueba_tabla_comun',where:true}],
    mostarAunqueNoFalleHasta:'2013-03-30',
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
