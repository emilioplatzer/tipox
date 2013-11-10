﻿// Por $Author: emilioplatzer@gmail.com $ Revisión $Revision: 127 $ del $Date: 2013-10-27 12:53:15 -0300 (dom 27 de oct de 2013) $
"use strict";

Probador.prototype.registradorCasosPrueba.push(function(){
    this.colocador=new Colocador();
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
});