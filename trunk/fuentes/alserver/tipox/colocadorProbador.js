// Por $Author: emilioplatzer@gmail.com $ Revisión $Revision: 88 $ del $Date: 2013-09-07 15:58:38 -0300 (sáb 07 de sep de 2013) $
"use strict";

function hacerExpandidor(elementoTitulo, elementoExpandible, valorInicial){
    elementoTitulo.expandidor={
        expandible:elementoExpandible,
        mostrar:!valorInicial,
        titulo:elementoTitulo,
        cambiar:function(cambio){
            if(cambio===null || cambio===undefined){
                this.mostrar=!this.mostrar;
            }else{
                this.mostrar=cambio;
            }
            this.expandible.style.display=this.mostrar?'':'none';
            this.titulo.classList.add('expandidor_'+(this.mostrar?'contraer':'expandir'));
            this.titulo.classList.remove('expandidor_'+(this.mostrar?'expandir':'contraer'));
        }
    }
    elementoTitulo.expandidor.cambiar();
    elementoTitulo.onclick=function(){
        this.expandidor.cambiar();
    }
}

function FlujoColocadorProbador(){
    var preparado=false;
    var elementoResultados;
    this.colocador=new Colocador();
    var preparar=function(){
        elementoResultados=document.getElementById('TDD_resultados')||
            this.colocador.colocar({destino:document.body,contenido:{tipox:'div', className:'TDD_resultados'}});
        preparado=true;
    }
    var prioridadEstados={   
        ok:1,
        ignorada:2,
        comenzada:3,
        pendiente:6,
        en_espera:8,
        fallida:9
    }
    var cambiarEstadoElemento=function(estado,elemento){
        if(!!elemento.dataset.estadoTdd){
            elemento.classList.remove('TDD_estado_'+elemento.dataset.estadoTdd);
        }
        elemento.classList.add('TDD_estado_'+estado);
        elemento.dataset.estadoTdd=estado;
    }
    var cambiarEstado=function(estado,elementoCasoTitulo,elementoModuloTitulo){
        cambiarEstadoElemento(estado,elementoCasoTitulo);
        if(!('hijos' in elementoModuloTitulo)){
            elementoModuloTitulo.hijos={};
        }
        elementoModuloTitulo.hijos[elementoCasoTitulo.id]=estado;
        var estadoMaxPrioridad='ok';
        for(var hijo in elementoModuloTitulo.hijos){
            var estadoHijo=elementoModuloTitulo.hijos[hijo];
            if(prioridadEstados[estadoMaxPrioridad]<prioridadEstados[estadoHijo]){
                estadoMaxPrioridad=estadoHijo;
            }
        }
        cambiarEstadoElemento(estadoMaxPrioridad,elementoModuloTitulo);
    }
    this.agregarNodos=function(destino,nodo,cruzEn,profundidad){
        if('nodes' in nodo){
            var esto=this;
            var raizMas=cruzEn;
            var listarNodos=function(){
                var tabla=esto.colocador.colocar({destino:destino,contenido:{tipox:'table'}});
                for(var idNodo in nodo.nodes) if(nodo.nodes.hasOwnProperty(idNodo)){
                    var fila=esto.colocador.colocar({destino:tabla,contenido:{
                        tipox:'tr', nodes:[
                            {tipox:'td', classList:['TDD_label_lista'], nodes:idNodo},
                            {tipox:'td', className:'TDD_contenido'}
                        ]
                    }});
                    esto.agregarNodos(fila.childNodes[fila.childNodes.length-1], nodo.nodes[idNodo], fila.childNodes[0], (Number(profundidad)||0)+1);
                }
                hacerExpandidor(cruzEn,tabla,!!nodo.tieneError);
            }
            if(Number(profundidad||0)<55){
                listarNodos();
            }else{
                raizMas.onclick=listarNodos;
            }
        }else{
            var tabla=this.colocador.colocar({destino:destino, contenido:{tipox:'table'}});
            for(var idAtributo in nodo) if(nodo.hasOwnProperty(idAtributo)){
                if(idAtributo!='tieneError'){
                    var mostrar=nodo[idAtributo];
                    var clase='JSON_'+typeof(mostrar);
                    if(mostrar===null){
                        mostrar='null';
                        clase='JSON_null';
                    }else if(mostrar===''){
                        mostrar="''";
                        clase='JSON_emptyString';
                    }
                    if(clase=='JSON_object'){
                        mostrar=JSON.stringify(mostrar);
                    }
                    this.colocador.colocar({destino:tabla, contenido:{tipox:'tr', nodes:[
                        {tipox:'td', className:'TDD_label_nodo', nodes:idAtributo},
                        {tipox:'td', className:'TDD_'+idAtributo, nodes:[{tipox:'pre', className:clase, innerText:mostrar}]}
                    ]}});
                }
            };
        }
    }
    this.enviar=function(mensaje){
        if(!preparado){
            preparar.call(this);
        }
        var idModulo='TDD_modulo:'+mensaje.modulo;
        var elementoModulo=document.getElementById(idModulo);
        var nuevo=false;
        if(!elementoModulo){
            elementoModulo=this.colocador.colocar({
                destino:elementoResultados,
                contenido:{
                    tipox:'div', classList:['TDD_modulo','TDD_estado_pendiente'], id:idModulo, dataset:{estadoTdd:'pendiente'}, nodes:[
                        {tipox:'div', 
                            classList:['TDD_modulo_titulo'], 
                            id:idModulo+'_titulo', 
                            innerText:mensaje.modulo
                        },
                        {tipox:'div', id:idModulo+'_casos'/*, style:{display:'none'}*/}
                    ]
                }
            });
            nuevo=true;
        }
        var elementoModuloCasos=document.getElementById(idModulo+'_casos');
        var elementoModuloTitulo=document.getElementById(idModulo+'_titulo');
        if(nuevo){
            hacerExpandidor(elementoModuloTitulo,elementoModuloCasos,false);
        }
        var idCaso='TDD_caso:'+mensaje.caso;
        var tituloCaso=[mensaje.caso];
        if(mensaje.ticket){
            var ticket={tipox:'a', href:this.app.tracUrl+'/ticket/'+mensaje.ignorado.substr(1), innerText:mensaje.ignorado};
            tituloCaso.push(ticket);
            this.app.colocador.colocar({destino:elementoModuloTitulo, contenido:[' ',ticket]});
        }
        var elementoCaso=document.getElementById(idCaso)||this.colocador.colocar({
            destino:elementoModuloCasos,
            contenido:{
                tipox:'div', classList:['TDD_caso'], id:idCaso, dataset:{estadoTdd:mensaje.estado},
                nodes:[{
                    tipox:'div', 
                    id:idCaso+'_titulo', 
                    classList:[],
                    nodes:tituloCaso
                }]
            }
        });
        var elementoCasoTitulo=document.getElementById(idCaso+'_titulo')
        cambiarEstado(mensaje.estado,elementoCaso,elementoModulo);
        if(mensaje.resultado){
            if(mensaje.resultado.tieneError){
                if(!elementoModuloTitulo.expandidor.mostrar){
                    elementoModuloTitulo.expandidor.cambiar();
                }
            }
            this.agregarNodos(elementoCaso,mensaje.resultado,elementoCasoTitulo);
        }
    }
}
