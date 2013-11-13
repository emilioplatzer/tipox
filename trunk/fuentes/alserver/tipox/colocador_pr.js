// Por $Author: emilioplatzer@gmail.com $ Revisión $Revision: 127 $ del $Date: 2013-10-27 12:53:15 -0300 (dom 27 de oct de 2013) $
"use strict";

Probador.prototype.registradorCasosPrueba.push(function(){
    this.colocador=new Colocador();
    this.colocador.controlarTodo=true;
    this.colocadorEficiente=new Colocador();
    this.colocadorEficiente.controlarTodo=false;
    this.casoPredeterminado={funcion:'colocar', modulo:'Colocador'};
    this.agregarCaso({ 
        caso:'elemento que se recicla',
        elementos:[
            {tipox:'div', id:'id_prueba_destino', nodes:[
                {tipox:'div', id:'id_prueba_colocando1', innerText:'este dato'}
            ]}
        ],
        objetoThis:this.colocador,
        entrada:[{destino:'id_prueba_destino', contenido:{tipox:'div', id:'id_prueba_colocando1'}, reciclar:true}], 
        esperado:{respuesta:new ArgumentoEspecialAsimetrico({id:'id_prueba_colocando1', innerText:'este dato'})}
    });
    this.agregarCaso({ 
        caso:'elemento que quiere reciclarse pero está en otro lugar del DOM',
        elementos:[
            {tipox:'div', id:'id_prueba_destino'},
            {tipox:'div', id:'id_prueba_destino_incorrecto', nodes:[
                {tipox:'div', id:'id_prueba_colocando', innerText:'este dato'}
            ]},
        ],
        objetoThis:this.colocador,
        entrada:[{destino:'id_prueba_destino', contenido:{tipox:'div', id:'id_prueba_colocando'}, reciclar:true}], 
        esperado:{error:'el elemento id_prueba_colocando existe en otro lugar del DOM en id_prueba_destino_incorrecto'}
    });
    this.agregarCaso({ 
        caso:'opcion devolver del colocar',
        elementos:[
            {tipox:'div', id:'id_prueba_destino'},
        ],
        objetoThis:this.colocador,
        entrada:[{
            destino:'id_prueba_destino', 
            contenido:{tipox:'div', id:'id_prueba_externo', nodes:[{tipox:'div', id:'id_prueba_interno', innerText:'esto'}]}, 
            devolver:'id_prueba_interno'
        }], 
        esperado:{respuesta:new ArgumentoEspecialAsimetrico({id:'id_prueba_interno', innerText:'esto'})}
    });
    this.agregarCaso({ 
        caso:'intento de devolver un id no colocado',
        elementos:[
            {tipox:'div', id:'id_prueba_destino'},
        ],
        objetoThis:this.colocador,
        entrada:[{
            destino:'id_prueba_destino', 
            contenido:{tipox:'div', id:'id_prueba_externo', nodes:[{tipox:'div', id:'id_prueba_interno2', innerText:'esto'}]}, 
            devolver:'id_prueba_inexistente'
        }], 
        esperado:{error:'no se puede devolver id_prueba_inexistente porque no fue colocado con el colocador'}
    });
    this.agregarCaso({ 
        caso:'intento de devolver un id colocado en otro lado',
        elementos:[
            {tipox:'div', id:'id_prueba_destino'},
            {tipox:'div', id:'id_otro_lado'},
        ],
        objetoThis:this.colocador,
        entrada:[{
            destino:'id_prueba_destino', 
            contenido:{tipox:'div', id:'id_prueba_externo', nodes:[{tipox:'div', id:'id_prueba_interno2', innerText:'esto'}]}, 
            devolver:'id_otro_lado'
        }], 
        esperado:{error:'no se puede devolver id_otro_lado porque no fue colocado con el colocador'}
    });
    this.agregarCaso({ 
        caso:'intento de crear un id duplicado',
        elementos:[
            {tipox:'div', id:'id_prueba_destino'},
            {tipox:'div', id:'id_existente'},
        ],
        objetoThis:this.colocador,
        entrada:[{
            destino:'id_prueba_destino', 
            contenido:{tipox:'div', id:'id_existente'}
        }], 
        esperado:{error:'no se puede colocar id_existente porque hay existe un elemento con ese id'}
    });
    this.agregarCaso({ 
        caso:'intento de crear un id duplicado no falla si no se controla todo',
        elementos:[
            {tipox:'div', id:'id_prueba_destino'},
            {tipox:'div', id:'id_existente'},
        ],
        objetoThis:this.colocadorEficiente,
        entrada:[{
            destino:'id_prueba_destino', 
            contenido:{tipox:'div', id:'id_existente', innerText:'8'}
        }], 
        esperado:{respuesta:new ArgumentoEspecialAsimetrico({tagName:'DIV', id:'id_existente', innerText:'8'})}
    });
});
