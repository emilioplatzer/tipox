﻿// grilla2lucap.js
// UTF-8:BOM
"use strict";

window.controlDependencias={
    deseables:[
        'controlParametros'
    ],
    necesarios:[
        'is_string',
        'is_array',
        'is_dom_element',
        'Sumadores'
    ]
}

function Grilla2(){
    this.secuenciaInterna++;
    this.secuencia=this.secuenciaInterna;
}

Grilla2.prototype.formatos={
    fecha:function(texto){
        if(texto){
            var fecha=new Date(texto);
            var hoy=new Date();
            var rta=(fecha.getUTCDate()<10?"<span class=transparente>0</span>":"")+fecha.getUTCDate()+'/'+(fecha.getUTCMonth()+1);
            rta+="<small ";
            if(fecha.getUTCFullYear()==hoy.getUTCFullYear()){
                rta+="class=anno_actual";
            }
            rta+=">/"+fecha.getUTCFullYear()+"</small></span></span>";
            if(fecha.getUTCFullYear()==hoy.getUTCFullYear() && fecha.getUTCMonth()==hoy.getUTCMonth()){
                if(fecha.getUTCDate()==hoy.getUTCDate()){
                    rta="dds_hoy'>"+rta;
                }else{
                    rta="dds_"+fecha.getUTCDay()+"'>"+rta;
                }
            }else{
                rta="'>"+rta;
            }
            rta="<span><span class='fecha "+rta;
            return rta;
        }else{
            return '';
        }
    },
    entero:function(texto){
        return Grilla2.prototype.formatos.numerico(texto,0);
    },
    numerico:function(texto,decimales){
        if(texto){
            if(decimales===undefined){
                decimales=2;
            }
            var rta=texto.split('.');
            var parte_entera=rta[0];
            var parte_decimal=rta[1]||'';
            if(parte_decimal.length<decimales){
                parte_decimal+=new Array(decimales+1-parte_decimal.length).join('0');
            }
            var proximo_separador=parte_entera.length-3;
            parte_entera=parte_entera.split("");
            while(proximo_separador>0){
                parte_entera.splice(proximo_separador,0,"</span><span class=grupo_mil>");
                proximo_separador-=3;
            }
            return "<span "+(parte_entera[0]=='-'?'class=negativo':'')+"><span>"+parte_entera.join('')+"</span>"+(parte_decimal?'<small>.'+parte_decimal+"<small>":'')+'</span>';
        }else{
            return '';
        }
    }
}

Grilla2.prototype.secuenciaInterna=1;

Object.defineProperty(Grilla2.prototype, "proveedor", {
    set: function(proveedor){
        window.controlParametros={
            parametro:proveedor,
            def_params:{},
            functiones:{
            }
        }
        this.prov=proveedor;
    }
});

Grilla2.prototype.agregarElemento=function(params,recursivo){
    window.controlParametros={
        parametro:params,
        definicion:{
            tagName:{validar:is_string, obligatorio:true, uso:'tipo de elemento'},
            destino:{validar:is_dom_element, uso:'donde agregarlo'},
            clase:{validar:is_string, uso:'nombre que se usará para el id, para la clase y para el miembro this'},
            dentro:{validar:is_array, uso:'si dentro de ese elemento debe crear otros'}
        }
    };
    if(recursivo){
        window.controlParametros={
            parametro:recursivo,
            definicion:{
                destino:{validar:is_dom_element, uso:'donde agregarlo'},
            }
        };
        if('destino' in recursivo) params.destino=recursivo.destino;
    }
    if(!('destino' in params)) params.destino=document.body;
    if(!('dentro' in params)) params.dentro=[];
    if(params.clase in this) throw new Error('no puede haber '+params.clase+' en el this[Grilla2]');
    var nuevo_elemento=document.createElement(params.tagName);
    nuevo_elemento.className='g2_'+params.clase;
    nuevo_elemento.id='g2_'+params.clase+'_'+this.secuencia;
    this[params.clase]=nuevo_elemento;
    params.destino.appendChild(this[params.clase]);
    params.dentro.forEach(function(valor){
        return this.agregarElemento(valor,{destino:nuevo_elemento});
    },this);
}

Grilla2.prototype.colocarRepositorio=function(){
    this.agregarElemento({tagName:'div', clase:'englobador', dentro:[
        {tagName:'div', clase:'statusBar', dentro:[
            {tagName:'pre', clase:'statusBarText'},
            {tagName:'img', clase:'statusBarImg'}
        ]},
        {tagName:'div', clase:'destino'},
    ]});
    this.statusBarText.textContent='iniciando...';
    this.statusBarImg.src='imagenes/cargando.png';
    this.statusBarImg.classList.add('girando');
}

Grilla2.prototype.ejecutarSecuencia=function(secuencia,continua,cuandoFalla){
    var ahora=new Date();
    if(!continua){
        this.statusBarText.empezo=ahora.getTime();
    }
    var esto=this;
    for(var leyenda in secuencia){
        // this.statusBarText.textContent=leyenda;
        this.statusBarText.textContent+=(ahora.getTime()-this.statusBarText.empezo)/1000+'\n'+leyenda;
        var accion=secuencia[leyenda];
        break;
    }
    delete secuencia[leyenda];
    if(accion){
        setTimeout(function(){
            try{
                accion.call(esto);
                esto.ejecutarSecuencia(secuencia,true,cuandoFalla);
            }catch(err){
                cuandoFalla(err);
            }
        },0);
    }else{
        // this.statusBar.style.visibility='hidden';
        this.statusBarImg.style.display='none';
    }
}

Grilla2.prototype.colocarSumas=function(params){
    var tr=this.cuerpo.insertRow(-1);
    tr.className='grupo_pie'+(params.momento||'');
    if(params.momento){
        var valores=this.sumadores.totalizar();
    }else{
        var valores=this.sumadores.subtotalizar();
    }
    for(var n_campo in params.iterarEn){
        var def_campo=this.datos.campos[n_campo];
        if(!def_campo.invisible){
            var td=tr.insertCell(-1);
            if(def_campo.sumar){
                var valor=valores[n_campo];
                if(def_campo.formato){
                    td.innerHTML=def_campo.formato(valor);
                }else{
                    td.textContent=valor;
                }
            }
        }
    }
}

Grilla2.prototype.colocarFilas=function(maximo){
    var ultima_llamada=maximo<0;
    if(!('cantidadFilasColocadas' in this)){
        this.cantidadFilasColocadas=0;
        this.grupoActual=null; // GEN
    }
    this.datos.filas.every(function(fila, i){
        if(i>=this.cantidadFilasColocadas){
            if('grupo' in fila){ // GEN
                if(this.grupoActual!==fila.grupo){
                    if(this.grupoActual){
                        this.colocarSumas({iterarEn:fila});
                    }
                    this.grupoActual=fila.grupo;
                    var tr=this.cuerpo.insertRow(-1);
                    tr.className='grupo';
                    var td=tr.insertCell(-1);
                    td.textContent=this.grupoActual;
                    td.colSpan=999;
                }
            }
            var tr=this.cuerpo.insertRow(-1);
            tr.className='paridad0'; // LUC
            if(fila.mov_visto=='N' || fila.asi_visto=='N'){
                tr.className='paridadNR';
            }
            for(var n_campo in fila){
                var def_campo=this.datos.campos[n_campo];
                if(!def_campo.invisible){
                    var td=tr.insertCell(-1);
                    var valor=fila[n_campo];
                    if(def_campo.sumar && valor){
                        this.sumadores.sumar(n_campo,valor);
                        if(def_campo.acumulado=='SUM' && valor){
                            valor=this.sumadores.valorString(n_campo);
                        }
                    }
                    if(def_campo.formato){
                        td.innerHTML=def_campo.formato(valor);
                    }else{
                        td.textContent=valor;
                    }
                    if(def_campo.style){
                        td.style.cssText=def_campo.style;
                    }
                }
            }
            maximo--;
            this.cantidadFilasColocadas=i+1;
        }
        if(!maximo){
            return false;
        }
        if(maximo<0){
        }
        return true;
    },this);
    if(this.grupoActual && ultima_llamada){
        this.colocarSumas({iterarEn:this.datos.filas[0]});
        this.colocarSumas({iterarEn:this.datos.filas[0], momento:'final'});
    }
}

Grilla2.prototype.obtenerDatos=function(){
    this.statusBarText.textContent='leyendo...';
    var grilla=this;
    grilla.statusBarImg.src='imagenes/cargando.png';
    grilla.statusBarImg.className='girando';
    var ahora=new Date();
    this.statusBarText.empezo=ahora.getTime();
    var cuandoFalla=function(el_error){ // si dio error
        grilla.statusBarText.textContent+='\nERROR. '+el_error;
        grilla.statusBarImg.src='imagenes/error_carga.png';
        grilla.statusBarImg.className='movedizo';
    };
    this.prov.traerDatos({
        cuandoOk:function(obtenido){
            grilla.datos=obtenido;
            grilla.ejecutarSecuencia({
                'calculando el ancho de las columnas...':function(){
                    var primera_fila=this.datos.filas[0];
                    this.anchos={};
                    this.anchoTotal=0;
                    this.cantidadColumnas=0;
                    this.cantidadColumnasVisibles=0;
                    this.sumadores=new Sumadores();
                    for(var n_campo in primera_fila){
                        var def_campo=this.datos.campos[n_campo];
                        this.datos.campos[n_campo]=def_campo||{};
                        if(n_campo.substr(0,3)=='pk_'){ // GEN
                            this.datos.campos[n_campo].invisible=true;
                        }
                        if(def_campo.es_fecha){
                            def_campo.formato=this.formatos.fecha;
                        }
                        if(def_campo.es_numerico){
                            def_campo.formato=this.formatos.numerico;
                        }
                        if(def_campo.es_entero){
                            def_campo.formato=this.formatos.entero;
                        }
                        if(def_campo.es_html_inyectado){
                            def_campo.formato=estoMismo;
                        }
                        this.anchos[n_campo]=0;
                        if(def_campo.sumar){
                            this.sumadores.iniciar(n_campo);
                        }
                    }
                    this.datos.filas.forEach(function(fila){
                        for(var n_campo in fila){
                            var valor=fila[n_campo]+"";
                            this.anchos[n_campo]=Math.max(this.anchos[n_campo],valor.length);
                        }
                    },this);
                    for(var n_campo in primera_fila){
                        this.anchoTotal+=this.anchos[n_campo];
                        this.cantidadColumnas++;
                        if(!this.datos.campos[n_campo].invisible){
                            this.cantidadColumnasVisibles++;
                        }
                    }
                },
                'colocando los títulos...':function(){
                    this.agregarElemento({tagName:'table',clase:'tabla',destino:this.destino,dentro:[
                        {tagName:'caption', clase:'caption'},
                        {tagName:'colgroup', clase:'columnas'},
                        {tagName:'thead', clase:'encabezado', dentro:[
                            {tagName:'tr', clase:'filaTitulos'}
                        ]},
                        {tagName:'tbody', clase:'cuerpo'}
                    ]});
                    this.tabla.caption.innerHTML='<span class="botonera_tabla" al_copiar=""><img src="imagenes/empezar_a_ocultar_columna.png" title="Empezar a ocultar columnas con un click" onclick="Toggle_EliminarColumnas(this)"><img src="imagenes/tabla_ordenable.png" title="Forzar la tabla para que sea ordenable" onclick="HacerOrdenables(this)"></span> ';
                    this.tabla.caption.appendChild(document.createTextNode(this.datos.titulo));
                    this.tabla.classList.add('tabla_resultados'); // LUC
                    this.tabla.width=(this.anchoTotal+this.cantidadColumnas)+'em';
                    for(var n_campo in this.anchos){
                        var def_campo=this.datos.campos[n_campo];
                        if(!def_campo.invisible){
                            var col=document.createElement('col');
                            this.columnas.appendChild(col);
                            var ancho=def_campo.ancho||Math.max(Math.min(this.anchos[n_campo],50),4)+'em';
                            col.style.width=ancho;
                            var celda=document.createElement('th');
                            celda.textContent=def_campo.titulo||n_campo;
                            if('tituloHTML' in def_campo){
                                celda.innerHTML=def_campo.tituloHTML;
                            }
                            this.filaTitulos.appendChild(celda);
                        }
                    }
                },
                'colocando las primeras filas...':function(){
                    this.colocarFilas(100);
                },
                'colocando el resto de las filas...':function(){
                    this.colocarFilas(-1);
                },
                'listo':function(){
                }
            },true,cuandoFalla);
        },
        cuandoFalla:cuandoFalla
    });
}
