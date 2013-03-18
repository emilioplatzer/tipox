// Por $Author$ Revisión $Revision$ del $Date$

Aplicacion.prototype.paginas.tdd={ 
    labelMenu:{tipox:'span', className:'TDD_menu', innerText:'T.D.D.'},
    filtro:function(app){ return app.entornoDesarrollo },
    nodes:["Pruebas internas de funcionamiento ",
        {tipox:'funcion', id:'probarTodo', funcion:'probarTodo', className:'TDD_resultados'}
    ]
};

function Probador(app){
    this.app=app;
    this.casosDePrueba=app.casosDePrueba;
    this.cantidadPruebas=0;
    this.cantidadPruebasPorModulos={};
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
        var elementoFuncion=document.getElementById(idFuncion);
        if(!elementoFuncion){
            this.app.grab('probarTodo',
                {tipox:'div', classList:['TDD_funcion'], id:idFuncion, nodes:[
                    {tipox:'div', classList:['TDD_funcion_titulo','TDD_prueba_pendiente'], id:idFuncion+'_titulo', innerText:caso.tipox}
                ]}
            );
            elementoFuncion=document.getElementById(idFuncion);
        }
        var idCaso='TDD_caso:'+i;
        this.app.grab(elementoFuncion,
            {tipox:'div', className:'TDD_caso', id:idCaso, nodes:[
                {tipox:'div', classList:['TDD_caso_titulo','TDD_prueba_pendiente'], id:idCaso+'_titulo', innerText:caso.caso}
            ]}
        );
        var elementoCaso=document.getElementById(idFuncion);
    }
    this.probarUnCaso(0,1);
}

Probador.prototype.probarUnCaso=function(desde,cuantos){
    for(var i=desde; i<desde+cuantos && i<this.casosDePrueba.length; i++){
        var caso=this.casosDePrueba[i];
        var idCaso='TDD_caso:'+i;
        var esto=caso.tipox in this.app?this.app:window;
        var obtenido=esto[caso.tipox].apply(esto,caso.entrada);
        var app=this.app;
        var este=this;
        if(obtenido instanceof Futuro){
            obtenido.luego(function(respuesta,app){
                este.compararObtenido(respuesta,caso,idCaso);
            }).alFallar(function(mensaje,app){
                este.compararObtenido({tipox:'rtaError', mensaje:mensaje},caso,idCaso);
            });
        }else{
            este.compararObtenido(obtenido,caso,idCaso);
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
    var compararBonito=function(esperado,obtenido){
        var rta={tieneError:false};
        if(typeof(esperado)=='object'?(typeof(obtenido)!='object' || (esperado===null)!==(obtenido===null) || (esperado===undefined)!==(obtenido===undefined) || (esperado instanceof Array)!==(obtenido instanceof Array)):esperado!==obtenido){
            rta.tieneError=true;
            rta.bonito={tipox:'table', nodes:[
                {tipox:'tr', nodes:[{tipox:'td', className:'TDD_esperado', innerText:JSON.stringify(esperado)}]},
                {tipox:'tr', nodes:[{tipox:'td', className:'TDD_obtenido', innerText:JSON.stringify(obtenido)}]},
            ]};
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
            if(bidireccional){
                for(var campo in obtenido) if(obtenido.hasOwnProperty(campo)){
                    if(!(campo in esperado)){
                        var rtaInterna=compararBonito(esperado[campo],obtenido[campo]);
                        nodes.push({tipox:'table', className:'TDD_elemento', nodes:[{tipox:'tr',nodes:[
                            {tipox:'td', className:'TDD_label', innerText:campo},
                            {tipox:'td', nodes:rtaInterna.bonito}
                        ]}]});
                        rta.tieneError=rta.tieneError||rtaInterna.tieneError;
                    }
                }
            }
            rta.bonito={tipox:'div', nodes:nodes};
        }
        return rta;
    };
    var resultado=compararBonito(esperado,obtenido);
    if(resultado.tieneError){
        this.errores++;
        app.grab(idCaso,{tipox:'div', className:'TDD_error', nodes:[
            {tipox:'table',className:'TDD_resultado', nodes:[{tipox:'tr',nodes:[
                {tipox:'td',className:'TDD_label_esperado_obtenido', nodes:['esperado',{tipox:'br'},'obtenido']},
                {tipox:'td', nodes:resultado.bonito}
            ]}]},
        ]});
    }
};

Aplicacion.prototype.casosDePrueba=[];
Aplicacion.prototype.casosDePrueba.push({
    tipox:'estoMismo',
    caso:'ejemplo para ver cómo se ven los casos de prueba',
    entrada:[{iguales:'este es',abajo:'solo en obtenido',distinto:'obtenido'}],
    salida:{iguales:'este es',arriba:'solo en esperado',distinto:'esperado'}
});
Aplicacion.prototype.casosDePrueba.push({
    tipox:'enviarPaquete',
    caso:'entrada al sistema exitosa',
    entrada:[{proceso:'entrada',sincronico:true,paquete:{usuario:'abel',password:hex_md5('abel'+'clave1')}}],
    salidaMinima:{tipox:'rtaOk'}
});
Aplicacion.prototype.casosDePrueba.push({
    tipox:'enviarPaquete',
    caso:'entrada al sistema fallida por clave erronea',
    entrada:[{proceso:'entrada',sincronico:true,paquete:{usuario:'abel',password:hex_md5('abel'+'clave2')}}],
    salidaMinima:{tipox:'rtaError',mensaje:'el usuario o la clave no corresponden a un usuario activo'}
});
Aplicacion.prototype.casosDePrueba.push({
    tipox:'enviarPaquete',
    caso:'entrada al sistema fallida por usuario inexistente',
    entrada:[{proceso:'entrada',sincronico:true,paquete:{usuario:'beto',password:hex_md5('beto')}}],
    salidaMinima:{tipox:'rtaError',mensaje:'el usuario o la clave no corresponden a un usuario activo'}
});
Aplicacion.prototype.casosDePrueba.push({
    tipox:'enviarPaquete',
    caso:'entrada al sistema fallida por usuario inactivo',
    entrada:[{proceso:'entrada',sincronico:true,paquete:{usuario:'cain',password:hex_md5('cain'+'clave2')}}],
    salidaMinima:{tipox:'rtaError',mensaje:'el usuario "cain" no esta activo'}
});
