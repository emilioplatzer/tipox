// Por $Author: emilioplatzer@gmail.com $ Revisión $Revision: 127 $ del $Date: 2013-10-27 12:53:15 -0300 (dom 27 de oct de 2013) $
"use strict";

Probador.prototype.registradorCasosPrueba.push(function(){
    this.colocador=new Colocador();
    this.casoPredeterminado={funcion:'colocar', modulo:'Colocador'};
    this.agregarCaso({ 
        caso:'elemento que se recicla',
        elementos:[
            {tipox:'div', id:'id_prueba_destino'},
            {tipox:'div', id:'id_prueba_colocando', innerText:'este dato'},
        ],
        objetoThis:this.colocador,
        entrada:[{destino:'id_prueba_destino', contenido:{tipox:'div', id:'id_prueba_colocando'}, reciclar:true}], 
        esperado:{respuesta:new ArgumentoEspecialAsimetrico({id:'id_prueba_colocando', innerText:'este dato'})}
    });
});
