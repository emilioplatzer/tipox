"use strict";

Probador.prototype.registradorCasosPrueba.push(function(){
    this.casoPredeterminado={modulo:'Acumuladores'};
    var sumadorEsteAquel=function(){
        var s=new Acumuladores();
        s.iniciar('este','sumar');
        s.iniciar('aquel','sumar');
        return s;
    }
    this.agregarCaso({ 
        caso:'suma normal y subtotalizar',
        constructorThis:function(){ var s=sumadorEsteAquel(); s.acumular('este',3); return s; },
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
        constructorThis:function(){ var s=sumadorEsteAquel(); s.acumular('este',3); s.acumular('aquel','0.1'); s.acumular('aquel','0.2'); s.subtotalizar(); return s; },
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
        funcion:'acumular',
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
        funcion:'acumular',
        entrada:['uno que no esta',4], 
        esperado:{error:'no esta iniciado el campo uno que no esta en el acumulador'}
    });
    this.agregarCaso({ 
        caso:'contar texto',
        constructorThis:function(){ 
            var s=new Acumuladores();
            s.iniciar('texto','contar'); 
            s.acumular('texto','A'); 
            s.acumular('texto','B'); 
            s.acumular('texto','A'); 
            s.subtotalizar(); 
            s.acumular('texto','D'); 
            s.acumular('texto','C'); 
            s.acumular('texto','D'); 
            s.subtotalizar(); 
            return s; 
        },
        funcion:'totalizar',
        entrada:[], 
        esperado:{
            respuesta:{texto:'4/6'},
            objetoThis:new ArgumentoEspecialIgnorarSobrantes({
                acumuladores:[new ArgumentoEspecialIgnorarSobrantes({}), new ArgumentoEspecialIgnorarSobrantes({})],
            })
        }
    });
});
