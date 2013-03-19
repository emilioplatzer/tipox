// Por $Author$ Revisión $Revision$ del $Date$

Aplicacion.prototype.paginas.tdd={ 
    labelMenu:{tipox:'span', className:'TDD_menu', innerText:'T.D.D.'},
    filtro:function(app){ return app.entornoDesarrollo },
    nodes:["Pruebas internas de funcionamiento ",
        {tipox:'funcion', id:'probarTodo', funcion:'probarTodo', className:'TDD_resultados'}
    ]
};

Aplicacion.prototype.eventos.toggleDisplayAbajo=function(app,evento,elemento){
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
        var idFuncion='TDD_funcion:'+caso.tipox;
        var elementoFuncionCasos=document.getElementById(idFuncion+'_casos');
        if(!elementoFuncionCasos){
            this.pendientesPorModulos[idFuncion]=0;
            this.app.grab('probarTodo',
                {tipox:'div', classList:['TDD_funcion'], id:idFuncion, nodes:[
                    {tipox:'div', classList:['TDD_funcion_titulo','TDD_prueba_pendiente'], id:idFuncion+'_titulo', innerText:caso.tipox, eventos:{click:'toggleDisplayAbajo'}},
                    {tipox:'div', id:idFuncion+'_casos', style:{display:'none'}}
                ]}
            );
            elementoFuncionCasos=document.getElementById(idFuncion+'_casos');
        }
        var elementoFuncionTitulo=document.getElementById(idFuncion+'_titulo');
        var idCaso='TDD_caso:'+i;
        var clase=caso.ignorado?'TDD_prueba_ignorada':'TDD_prueba_pendiente';
        var nodosInternos=[{tipox:'div', classList:['TDD_caso_titulo',clase], id:idCaso+'_titulo', innerText:caso.caso}];
        if(caso.aclaracionSiFalla){
            nodosInternos.push({tipox:'div', className:'TDD_aclaracion', id:idCaso+'_aclaracion', nodes:caso.aclaracionSiFalla});
        }
        this.app.grab(elementoFuncionCasos,
            {tipox:'div', className:'TDD_caso', id:idCaso, nodes:nodosInternos}
        );
        if(caso.ignorado){  
            elementoFuncionTitulo.classList.remove('TDD_prueba_pendiente');
            elementoFuncionTitulo.classList.add('TDD_prueba_ignorada');
        }else{
            this.pendientesPorModulos[idFuncion]++;
        }
        var elementoCaso=document.getElementById(idFuncion);
    }
    this.probarUnCaso(0,1);
}

Probador.prototype.probarUnCaso=function(desde,cuantos){
    for(var i=desde; i<desde+cuantos && i<this.casosDePrueba.length; i++){
        var caso=this.casosDePrueba[i];
        if(!caso.ignorado){
            var idFuncion='TDD_funcion:'+caso.tipox;
            var idCaso='TDD_caso:'+i;
            var esto=caso.tipox in this.app?this.app:window;
            var obtenido=esto[caso.tipox].apply(esto,caso.entrada);
            var app=this.app;
            var este=this;
            if(obtenido instanceof Futuro){
                obtenido.luego(function(respuesta,app){
                    este.compararObtenido(respuesta,caso,idCaso);
                }).alFallar(function(mensaje,app){
                    este.compararObtenido({tipox:'falla', mensaje:mensaje},caso,idCaso);
                });
            }else{
                este.compararObtenido(obtenido,caso,idCaso);
            }
            this.pendientesPorModulos[idFuncion]--;
            if(this.pendientesPorModulos[idFuncion]==0){
                var elementoFuncionTitulo=document.getElementById(idFuncion+'_titulo');
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

Probador.prototype.compararObtenido=function(obtenido,caso,idCaso){
    this.cantidadPruebas++;
    if(!(caso.tipox in this.cantidadPruebasPorModulos)){
        this.cantidadPruebasPorModulos[caso.tipox]=0;
    }
    this.cantidadPruebasPorModulos[caso.tipox]++;
    var esperado=caso.salida||caso.salidaMinima;
    var bidireccional='salida' in caso;
    var nodoBonito=function(esperado,obtenido,claseEsperado,claseObtenido){
        return {tipox:'table', nodes:[
                {tipox:'tr', nodes:[{tipox:'td', className:claseEsperado, innerText:JSON.stringify(esperado)}]},
                {tipox:'tr', nodes:[{tipox:'td', className:claseObtenido, innerText:JSON.stringify(obtenido)}]},
        ]};
    }
    var compararBonito=function(esperado,obtenido){
        var rta={tieneError:false};
        if(typeof(esperado)=='object'?(typeof(obtenido)!='object' || (esperado===null)!==(obtenido===null) || (esperado===undefined)!==(obtenido===undefined) || (esperado instanceof Array)!==(obtenido instanceof Array)):esperado!==obtenido){
            rta.tieneError=true;
            rta.bonito=nodoBonito(esperado, obtenido,'TDD_esperado','TDD_obtenido');
        }else if(typeof(esperado)!='object'){
            rta.bonito={tipox:'div', className:'TDD_iguales', innerText:JSON.stringify(esperado)};
        }else{
            var nodes=[];
            for(var campo in esperado) if(esperado.hasOwnProperty(campo)){
                var rtaInterna=compararBonito(esperado[campo],obtenido[campo]);
                nodes.push({tipox:'table', className:'TDD_elemento', nodes:[{tipox:'tr',nodes:[
                    {tipox:'td', className:'TDD_label', innerText:campo},
                    {tipox:'td', nodes:rtaInterna.bonito}
                ]}]});
                rta.tieneError=rta.tieneError||rtaInterna.tieneError;
            }
            for(var campo in obtenido) if(obtenido.hasOwnProperty(campo)){
                if(!(campo in esperado)){
                    var claseObtenido;
                    if(bidireccional){
                        rta.tieneError=true;
                        claseObtenido='TDD_obtenido';
                    }else{
                        claseObtenido='TDD_obtenido_sobrante';
                    }
                    nodes.push({tipox:'table', className:'TDD_elemento', nodes:[{tipox:'tr',nodes:[
                        {tipox:'td', className:'TDD_label', innerText:campo},
                        {tipox:'td', nodes:nodoBonito(undefined,obtenido[campo],'TDD_esperado',claseObtenido)}
                    ]}]});
                }
            }
            rta.bonito={tipox:'div', nodes:nodes};
        }
        return rta;
    };
    var resultado=compararBonito(esperado,obtenido);
    var idFuncion='TDD_funcion:'+caso.tipox;
    var elementoFuncionTitulo=document.getElementById(idFuncion+'_titulo');
    var elementoCasoTitulo=document.getElementById(idCaso+'_titulo');
    var elementoCaso=document.getElementById(idCaso);
    elementoCasoTitulo.classList.remove('TDD_prueba_ignorada');
    elementoCasoTitulo.classList.remove('TDD_prueba_pendiente');
    if(resultado.tieneError){
        elementoFuncionTitulo.classList.remove('TDD_prueba_ignorada');
        elementoFuncionTitulo.classList.remove('TDD_prueba_pendiente');
        elementoFuncionTitulo.classList.add('TDD_prueba_fallida');
        elementoCasoTitulo.classList.add('TDD_prueba_fallida');
        document.getElementById(idFuncion+'_casos').style.display=null;
        this.errores++;
        app.grab(idCaso,{tipox:'div', className:'TDD_error', nodes:[
            {tipox:'table',className:'TDD_resultado', nodes:[{tipox:'tr',nodes:[
                {tipox:'td',className:'TDD_label_esperado_obtenido', nodes:['esperado',{tipox:'br'},'obtenido']},
                {tipox:'td', nodes:resultado.bonito}
            ]}]},
        ]});
    }else{
        elementoCasoTitulo.classList.add('TDD_prueba_ok');
    }
};

Aplicacion.prototype.casosDePrueba=[];
Aplicacion.prototype.casosDePrueba.push({
    tipox:'asi_se_ven_los_errores',
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

Aplicacion.prototype.asi_se_ven_los_ignorados=function(){
    this.lanzarExcepcion('Esto nunca debe ejecutarse porque es un ejemplo');
}

Aplicacion.prototype.asi_se_ven_los_errores=function(esto){
    return esto;
}

Aplicacion.prototype.asi_se_ven_los_ok=function(esto){
    return esto;
}

Aplicacion.prototype.casosDePrueba.push({
    tipox:'asi_se_ven_los_ignorados',
    caso:'Los casos de prueba ignorados se ven así',
    ignorado:true,
    entrada:[{iguales:'este es',abajo:'solo en obtenido',distinto:'obtenido'}],
    salida:{iguales:'este es',arriba:'solo en esperado',distinto:'esperado'}
});

Aplicacion.prototype.casosDePrueba.push({
    tipox:'asi_se_ven_los_ok',
    caso:'Se puede comparar en forma exacta usando el campo "salida"',
    entrada:[{iguales:'este es',este_tambien:7}],
    salida:{iguales:'este es',este_tambien:7}
});
Aplicacion.prototype.casosDePrueba.push({
    tipox:'asi_se_ven_los_ok',
    caso:'Se puede comparar de modo de que estén ciertos campos pero no controlar si sobran (para eso se usa "salidaMinima")',
    entrada:[{iguales:'sí', este_sobra:'en lo esperado no está, pero no molesta'}],
    salidaMinima:{iguales:'sí'}
});

Aplicacion.prototype.casosDePrueba.push({
    tipox:'asi_se_ven_los_ok',
    caso:'Se puede comparar de modo de que estén ciertos campos pero no controlar si sobran (para eso se usa "salidaMinima")',
    entrada:[{iguales:'sí', este_sobra:'en lo esperado no está, pero no molesta'}],
    salidaMinima:{iguales:'sí'}
});

Aplicacion.prototype.casosDePrueba.push({
    tipox:'enviarPaquete',
    caso:'control de que el sistema esté instalado',
    aclaracionSiFalla:['se puede instalar poniendo directamente ',{tipox:'a', href:'app.php?proceso=instalarBaseDeDatos', innerText:'app.php?proceso=instalarBaseDeDatos'}],
    entrada:[{proceso:'control_instalacion',sincronico:true,paquete:{}}],
    salidaMinima:{estadoInstalacion:'completa'}
});
Aplicacion.prototype.casosDePrueba.push({
    tipox:'enviarPaquete',
    caso:'entrada al sistema exitosa',
    entrada:[{proceso:'entrada',sincronico:true,paquete:{usuario:'abel',password:hex_md5('abel'+'clave1')}}],
    salidaMinima:{activo:true}
});
Aplicacion.prototype.casosDePrueba.push({
    tipox:'enviarPaquete',
    caso:'entrada al sistema fallida por clave erronea',
    entrada:[{proceso:'entrada',sincronico:true,paquete:{usuario:'abel',password:hex_md5('abel'+'clave2')}}],
    salidaMinima:{tipox:'falla',mensaje:'el usuario o la clave no corresponden a un usuario activo'}
});
Aplicacion.prototype.casosDePrueba.push({
    tipox:'enviarPaquete',
    caso:'entrada al sistema fallida por usuario inexistente',
    entrada:[{proceso:'entrada',sincronico:true,paquete:{usuario:'beto',password:hex_md5('beto')}}],
    salidaMinima:{tipox:'falla',mensaje:'el usuario o la clave no corresponden a un usuario activo'}
});
Aplicacion.prototype.casosDePrueba.push({
    tipox:'enviarPaquete',
    caso:'entrada al sistema fallida por usuario inactivo',
    entrada:[{proceso:'entrada',sincronico:true,paquete:{usuario:'cain',password:hex_md5('cain'+'clave2')}}],
    salidaMinima:{tipox:'falla',mensaje:'el usuario "cain" no esta activo'}
});

Aplicacion.prototype.pruebaTraduccion=function(definicion){
    var creador=this.creadores[definicion.tipox].creador;
    return creador.translate(definicion);
}

Aplicacion.prototype.casosDePrueba.push({
    tipox:'pruebaTraduccion',
    caso:'traducir el tipox:lista',
    entrada:[{tipox:'lista', tagList:'ol(1)', tagElement:'li(2)', elementos:['uno', 'dos', {esto:{queda:{}}}]}],
    salida:{tipox:'ol(1)',nodes:[{tipox:'li(2)', nodes:'uno'}, {tipox:'li(2)', nodes:'dos'}, {tipox:'li(2)', nodes:{esto:{queda:{}}}}]}
});
