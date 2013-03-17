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
        var obtenido=this[caso.tipox].apply(this,caso.entrada);
        cantidadPruebas++;
        if(!(caso.tipox in cantidadPruebasPorModulos)){
            cantidadPruebasPorModulos[caso.tipox]=0;
        }
        cantidadPruebasPorModulos[caso.tipox]++;
        if(JSON.stringify(obtenido)!=JSON.stringify(caso.salida)){
            errores++;
            this.grab('probarTodo',{tipox:'div', className:'TDD_error', nodes:[
                {tipox:'div',className:'TDD_caso_titulo', nodes:['caso ',caso.caso]},
                {tipox:'pre',className:'TDD_resultado', nodes:['se esperaba:',JSON.stringify(caso.salida)]},
                {tipox:'pre',className:'TDD_resultado', nodes:['se obtuvo:  ',JSON.stringify(obtenido)]},
            ]});
        }
    }
}

Aplicacion.prototype.casosDePrueba=[];
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
