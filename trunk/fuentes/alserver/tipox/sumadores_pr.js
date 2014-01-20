"use strict";

Probador.prototype.registradorCasosPrueba.push(function(){
    this.casoPredeterminado={modulo:'Sumadores'};
    var sumadorEsteAquel=function(){
        var s=new Sumadores();
        s.iniciar('este');
        s.iniciar('aquel');
        return s;
    }
    this.agregarCaso({ 
        caso:'suma normal y subtotalizar',
        constructorThis:function(){ var s=sumadorEsteAquel(); s.sumar('este',3); return s; },
        funcion:'subtotalizar',
        entrada:[], 
        esperado:{
            respuesta:{este:'3', aquel:'0'},
            objetoThis:new ArgumentoEspecialIgnorarSobrantes({
                acumuladores:[new ArgumentoEspecialIgnorarSobrantes({}), new ArgumentoEspecialIgnorarSobrantes({})],
            })
        }
    });
    this.agregarCaso({ 
        caso:'suma normal con decimales y subtotalizar, totalizar',
        constructorThis:function(){ var s=sumadorEsteAquel(); s.sumar('este',3); s.sumar('aquel','0.1'); s.sumar('aquel','0.2'); s.subtotalizar(); return s; },
        funcion:'totalizar',
        entrada:[], 
        esperado:{
            respuesta:{este:'3', aquel:'0.3'},
            objetoThis:new ArgumentoEspecialIgnorarSobrantes({
                acumuladores:[new ArgumentoEspecialIgnorarSobrantes({}), new ArgumentoEspecialIgnorarSobrantes({})],
            })
        }
    });
    this.agregarCaso({ 
        caso:'suma normal',
        objetoThis:sumadorEsteAquel(),
        funcion:'sumar',
        entrada:['este','3'], 
        esperado:{
            respuesta:undefined,
            objetoThis:new ArgumentoEspecialIgnorarSobrantes({
                acumuladores:[{este:new ArgumentoEspecialIgnorarSobrantes({}), aquel:new ArgumentoEspecialIgnorarSobrantes({})}],
            })
        }
    });
    this.agregarCaso({ 
        caso:'intento de suma de uno no registrado',
        objetoThis:sumadorEsteAquel(),
        funcion:'sumar',
        entrada:['uno que no esta',4], 
        esperado:{error:'no esta iniciado el campo uno que no esta en el sumador'}
    });
});
