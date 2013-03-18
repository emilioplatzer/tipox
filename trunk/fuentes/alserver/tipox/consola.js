// Por $Author$ Revisión $Revision$ del $Date$

Aplicacion.prototype.paginas.tdd={ 
    labelMenu:{tipox:'span', className:'TDD_menu', innerText:'T.D.D.'},
    filtro:function(app){ return app.entornoDesarrollo },
    nodes:["Pruebas internas de funcionamiento ",
        {tipox:'funcion', id:'probarTodo', funcion:'probarTodo', className:'TDD_resultados'}
    ]
};

Aplicacion.prototype.probarTodo=function(){
    var cantidadPruebas=0;
    var cantidadPruebasPorModulos={};
    var errores=0;
    for(var i in this.casosDePrueba) if(this.casosDePrueba.hasOwnProperty(i)){
        var caso=this.casosDePrueba[i];
        var esto=caso.tipox in this?this:window;
        var obtenido=esto[caso.tipox].apply(esto,caso.entrada);
        var app=this;
        var compararObtenido=function(obtenido){
            cantidadPruebas++;
            if(!(caso.tipox in cantidadPruebasPorModulos)){
                cantidadPruebasPorModulos[caso.tipox]=0;
            }
            cantidadPruebasPorModulos[caso.tipox]++;
            var esperado=caso.salida||caso.salidaMinima;
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
                    rta.bonito={tipox:'div', nodes:nodes};
                }
                return rta;
            };
            var resultado=compararBonito(esperado,obtenido);
            if(resultado.tieneError){
                errores++;
                app.grab('probarTodo',{tipox:'div', className:'TDD_error', nodes:[
                    {tipox:'div',className:'TDD_caso_titulo', nodes:['caso ',caso.caso]},
                    {tipox:'table',className:'TDD_resultado', nodes:[{tipox:'tr',nodes:[
                        {tipox:'td',className:'TDD_label_esperado_obtenido', nodes:['esperado',{tipox:'br'},'obtenido']},
                        {tipox:'td', nodes:resultado.bonito}
                    ]}]},
                ]});
            }
        };
        if(obtenido instanceof Aplicacion.prototype.Futuro){
            obtenido.luego(function(respuesta,app){
                compararObtenido(respuesta);
            }).alFallar(function(mensaje,app){
                compararObtenido({tipox:'rtaError', mensaje:mensaje});
            });
        }else{
            compararObtenido(obtenido);
        }
    }
}

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
    entrada:[{proceso:'entrada',paquete:{usuario:'abel',password:hex_md5('abel'+'clave1')}}],
    salidaMinima:{tipox:'rtaOk'}
});
Aplicacion.prototype.casosDePrueba.push({
    tipox:'enviarPaquete',
    caso:'entrada al sistema fallida por clave erronea',
    entrada:[{proceso:'entrada',paquete:{usuario:'abel',password:hex_md5('abel'+'clave2')}}],
    salidaMinima:{tipox:'rtaError'}
});
Aplicacion.prototype.casosDePrueba.push({
    tipox:'enviarPaquete',
    caso:'entrada al sistema fallida por usuario inexistente',
    entrada:{proceso:'entrada',paquete:{usuario:'beto',password:hex_md5('beto')}},
    salidaMinima:{tipox:'rtaError'}
});
Aplicacion.prototype.casosDePrueba.push({
    tipox:'enviarPaquete',
    caso:'entrada al sistema fallida por usuario inactivo',
    entrada:[{proceso:'entrada',paquete:{usuario:'cain',password:hex_md5('cain'+'clave2')}}],
    salidaMinima:{tipox:'rtaError',mensaje:'error inactivo'}
});
