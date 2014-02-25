// grilla2lucap.js
// UTF-8:BOM
"use strict";

window.controlDependencias={
    deseables:[
        'controlParametros'
    ],
    necesarios:[
        'is_string',
        'is_array',
        'is_function',
        'is_dom_element',
        'Acumuladores',
        'rutaImagenes'
    ]
}

if(window.rutaImagenes===undefined) window.rutaImagenes='./'; // !QApred

function Grilla2(){
    this.secuenciaInterna++;
    this.secuencia=this.secuenciaInterna;
}

Grilla2.prototype.tiposCampos={};
Grilla2.prototype.tiposCampos.Generico=function(){};
Grilla2.prototype.tiposCampos.Generico.prototype.iniciarElemento=function(elemento,valorDeLaBase){ elemento.innerHTML=''; elemento.valor=valorDeLaBase; };
Grilla2.prototype.tiposCampos.Generico.prototype.desplegarElemento=function(elemento){ if(elemento.valor===null){elemento.innerHTML='';}else{elemento.textContent=elemento.valor; }};
Grilla2.prototype.tiposCampos.Generico.prototype.focoElemento=function(elemento){};
Grilla2.prototype.tiposCampos.Generico.prototype.finEdicionElemento=function(elemento){ this.iniciarElemento(elemento, elemento.textContent); };
Grilla2.prototype.tiposCampos.Generico.prototype.valorBase=function(elemento){ return elemento.valor; };
Grilla2.prototype.tiposCampos.texto=function(){};
Grilla2.prototype.tiposCampos.texto.prototype=Object.create(Grilla2.prototype.tiposCampos.Generico.prototype);
Grilla2.prototype.tiposCampos.fecha=function(){};
Grilla2.prototype.tiposCampos.fecha.prototype=Object.create(Grilla2.prototype.tiposCampos.Generico.prototype);
Grilla2.prototype.tiposCampos.fecha.prototype.iniciarElemento=function(elemento,valorDeLaBase,opciones){ 
    if(valorDeLaBase){
        if(!opciones) opciones={}; // !QApred
        if(opciones.hora===undefined) opciones.hora=true; // !QApred
        var hoy=new Date();
        var fecha;
        if(opciones.construirDesde=='timestamp'){
            window.controlarParametros={parametros:{timestsamp:valorDeLaBase},def_params:{timestamp:function(x){ return !isNaN(x); }}};
            fecha=new Date(valorDeLaBase);
        }else{
            fecha=new Date(Date.parse(valorDeLaBase)+(hoy.getTimezoneOffset())*60000);
        }
        elemento.valor=fecha;
    }else{
        elemento.valor=null;
    }
};
Grilla2.prototype.tiposCampos.fecha.prototype.finEdicionElemento=function(elemento,opciones){ 
    if(elemento.textContent){
        if(!opciones) opciones={}; // !QApred
        if(opciones.hora===undefined) opciones.hora=true; // !QApred
        var hoy=new Date();
        var partes=elemento.textContent.split(/[-/]/g);
        var fecha=new Date(partes[2]||hoy.getFullYear(),(partes[1]-1),partes[0]);
        elemento.valor=fecha;
    }else{
        elemento.valor=null;
    }
};
Grilla2.prototype.tiposCampos.fecha.prototype.desplegarElemento=function(elemento,opciones){ 
    if(elemento.valor){
        if(!opciones) opciones={}; // !QApred
        if(opciones.hora===undefined) opciones.hora=true; // !QApred
        var hoy=new Date();
        var fecha=elemento.valor;
        var rta=(fecha.getUTCDate()<10?"<span class=transparente>0</span>":"")+fecha.getUTCDate()+'/'+(fecha.getUTCMonth()+1);
        rta+="<small ";
        var la_hora=fecha.toTimeString();
        var hora_cero=la_hora.substr(0,8)=='00:00:00';
        if(!opciones.hora){
            rta+=hora_cero?'':'title="'+la_hora+'"';
        }
        if(fecha.getUTCFullYear()==hoy.getUTCFullYear()){
            rta+="class=anno_actual";
        }
        rta+=">/"+fecha.getUTCFullYear()+"</small></span>";
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
        if(opciones.hora && !hora_cero){
            rta+=" <span title='"+la_hora+"' class='hora"+(hora_cero?' transparente':'')+"'> "+la_hora.substr(0,5)+"</span>";
        }
        rta+="</span>";
        elemento.innerHTML=rta;
    }else{
        elemento.innerHTML='';
    }
};
Grilla2.prototype.tiposCampos.fecha.prototype.focoElemento=function(elemento){ 
    elemento.textContent=elemento.textContent;
    elemento.focus();
}
Grilla2.prototype.tiposCampos.fecha.prototype.valorBase=function(elemento){ return elemento.valor?new Date(elemento.valor.getTime()-elemento.valor.getTimezoneOffset()*60000).toISOString().substr(0,10):null; };
Grilla2.prototype.tiposCampos.timestamp=function(){};
Grilla2.prototype.tiposCampos.timestamp.prototype=Object.create(Grilla2.prototype.tiposCampos.fecha.prototype);
Grilla2.prototype.tiposCampos.timestamp.prototype.iniciarElemento=function(elemento,valorDeLaBase){ 
    Grilla2.prototype.tiposCampos.fecha.prototype.iniciarElemento.call(this,elemento,valorDeLaBase,{construirDesde:'timestamp'});
}
Grilla2.prototype.tiposCampos.bool=function(){};
Grilla2.prototype.tiposCampos.bool.prototype=Object.create(Grilla2.prototype.tiposCampos.Generico.prototype);
Grilla2.prototype.tiposCampos.bool.prototype.formasConocidas={
    n:false, N:false, f:false, F:false, '0':false,
    s:true, S:true, y:true, Y:true, t:true, T:true, '1':true,
    '':null
}
Grilla2.prototype.tiposCampos.bool.prototype.iniciarElemento=function(elemento,valorDeLaBase){ 
    if(typeof valorDeLaBase=='string'){
        elemento.valor=this.formasConocidas[trim(valorDeLaBase).substr(0,1)];
    }else if(valorDeLaBase===null || valorDeLaBase===undefined){
        elemento.valor=null;
    }else{
        elemento.valor=!!valorDeLaBase;
    }
};
Grilla2.prototype.tiposCampos.bool.prototype.desplegarElemento=function(elemento){ 
    if(elemento.valor===null){
        elemento.innerHTML='';
    }else if(elemento.valor===false){
        elemento.innerHTML='<span class=falso>no</span>';
    }else{
        elemento.innerHTML='<span class=verdadero>S&iacute;</span>';
    }
};
Grilla2.prototype.tiposCampos.bool.prototype.focoElemento=function(elemento){ 
    if(elemento.valor===null){
        elemento.innerHTML='';
    }else if(elemento.valor===false){
        elemento.innerHTML='<span class=falso>N</span>';
    }else{
        elemento.innerHTML='<span class=verdadero>S</span>';
    }
};
Grilla2.prototype.tiposCampos.numerico=function(){};
Grilla2.prototype.tiposCampos.numerico.prototype=Object.create(Grilla2.prototype.tiposCampos.Generico.prototype);
Grilla2.prototype.tiposCampos.numerico.prototype.iniciarElemento=function(elemento,valorDeLaBase){ 
    if(valorDeLaBase===null || valorDeLaBase===undefined){
        elemento.valor=null;
    }else if(typeof valorDeLaBase=='string'){
        if(trim(valorDeLaBase)===''){
            elemento.valor=null;
        }else{
            elemento.valor=Number(valorDeLaBase);
            if(elemento.valor===NaN){
                elemento.valor=null;
            }
        }
    }else{
        elemento.valor=valorDeLaBase;
    }
};
Grilla2.prototype.tiposCampos.numerico.prototype.desplegarElemento=function(elemento,opciones){ 
    if(elemento.valor===null){
        elemento.innerHTML='';
    }else{
        if(!opciones) opciones={}; // !QApred
        if(!opciones.decimales && opciones.decimales!==0) opciones.decimales=2; // !QApred
        var rta=elemento.valor.toString().split('.');
        var parte_entera=rta[0];
        var parte_decimal=rta[1]||'';
        if(parte_decimal.length<opciones.decimales){
            parte_decimal+=new Array(opciones.decimales+1-parte_decimal.length).join('0');
        }
        var proximo_separador=parte_entera.length-3;
        parte_entera=parte_entera.split("");
        while(proximo_separador>0){
            parte_entera.splice(proximo_separador,0,"</span><span class=grupo_mil>");
            proximo_separador-=3;
        }
        elemento.innerHTML="<span "+(parte_entera[0]=='-'?'class=negativo':'')+"><span>"+parte_entera.join('')+"</span>"+(parte_decimal?'<small>.'+parte_decimal+"<small>":'')+'</span>';
    }
};
Grilla2.prototype.tiposCampos.entero=function(){};
Grilla2.prototype.tiposCampos.entero.prototype=Object.create(Grilla2.prototype.tiposCampos.numerico.prototype);
Grilla2.prototype.tiposCampos.entero.prototype.desplegarElemento=function(elemento,valorDeLaBase){ 
    Grilla2.prototype.tiposCampos.numerico.prototype.desplegarElemento.call(this,elemento,{decimales:0});
}
Grilla2.prototype.tiposCampos.HTML=function(){};
Grilla2.prototype.tiposCampos.HTML.prototype=Object.create(Grilla2.prototype.tiposCampos.Generico.prototype);
Grilla2.prototype.tiposCampos.HTML.prototype.iniciarElemento=function(elemento,valorDeLaBase){ 
    elemento.valor=valorDeLaBase;
}
Grilla2.prototype.tiposCampos.HTML.prototype.desplegarElemento=function(elemento){ 
    elemento.innerHTML=elemento.valor;
}

Grilla2.prototype.secuenciaInterna=1;

Object.defineProperty(Grilla2.prototype, "proveedor", {
    set: function(proveedor){
        window.controlParametros={
            parametros:proveedor,
            def_params:{
                traerDatos:{validar:is_function, uso:'trae todos los datos de la grilla'},
                estiloFila:{validar:is_function, uso:'determina el estilo de la fila en función de los datos'},
                grabar:{validar:is_function, uso:'graba el valor en la base de datos'}
            },
        }
        this.prov=proveedor;
        if(!this.prov.estiloFila) this.prov.estiloFila=function(fila){ return ''; } // !QApred
    }
});

Grilla2.prototype.agregarElemento=function(params,recursivo){
    window.controlParametros={
        parametros:params,
        def_params:{
            tagName:{validar:is_string, obligatorio:true, uso:'tipo de elemento'},
            destino:{validar:is_dom_element, uso:'donde agregarlo'},
            clase:{validar:is_string, uso:'nombre que se usará para el id, para la clase y para el miembro this'},
            dentro:{validar:is_array, uso:'si dentro de ese elemento debe crear otros'}
        }
    };
    if(recursivo){
        window.controlParametros={
            parametros:recursivo,
            def_params:{
                destino:{validar:is_dom_element, uso:'donde agregarlo'},
            }
        };
        if('destino' in recursivo) params.destino=recursivo.destino; // !AQpred
    }
    if(!('destino' in params)) params.destino=document.body; // !AQpred
    if(!('dentro' in params)) params.dentro=[]; // !AQpred
    if(params.clase in this) throw new Error('no puede haber '+params.clase+' en el this[Grilla2]'); // !AQparam
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
    this.statusBarImg.src=rutaImagenes+'cargando.png';
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
        this.statusBarText.textContent+=' ~ '+(ahora.getTime()-this.statusBarText.empezo)/1000+'\n'+leyenda;
        var accion=secuencia[leyenda];
        break;
    }
    delete secuencia[leyenda];
    if(accion){
        setTimeout(function(){
            try{
                ahora=new Date();
                esto.statusBarText.textContent+=' '+(ahora.getTime()-esto.statusBarText.empezo)/1000;
                accion.call(esto);
                ahora=new Date();
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
        var valores=this.acumuladores.totalizar();
    }else{
        var valores=this.acumuladores.subtotalizar();
    }
    for(var n_campo in params.iterarEn){
        var def_campo=this.datos.campos[n_campo];
        if(!def_campo.invisible){
            var td=tr.insertCell(-1);
            if(def_campo.acumular){
                var valor=valores[n_campo];
                def_campo.campeador.iniciarElemento(td,valor);
                def_campo.campeador.desplegarElemento(td);
            }
        }
    }
}

Grilla2.prototype.colocarFilas=function(maximo){
    var grilla=this;
    var ultima_llamada=maximo<0;
    if(!('cantidadFilasColocadas' in this)){
        this.cantidadFilasColocadas=0;
        this.grupoActual=null;
    }
    this.datos.filas.every(function(fila, i){
        if(i>=this.cantidadFilasColocadas){
            if(this.datos.campoAgrupador && this.datos.campoAgrupador in fila){
                if(this.grupoActual!==fila[this.datos.campoAgrupador]){
                    if(this.grupoActual){
                        this.colocarSumas({iterarEn:fila});
                    }
                    this.grupoActual=fila[this.datos.campoAgrupador];
                    var tr=this.cuerpo.insertRow(-1);
                    tr.className='grupo';
                    var td=tr.insertCell(-1);
                    td.textContent=this.grupoActual;
                    td.colSpan=999;
                }
            }
            var tr=this.cuerpo.insertRow(-1);
            tr.className=this.prov.estiloFila(fila);
            tr.filaDatos=fila;
            for(var n_campo in fila){
                var def_campo=this.datos.campos[n_campo];
                if(!def_campo.invisible){
                    var td=tr.insertCell(-1);
                    var valor=fila[n_campo];
                    td.valorOriginal=valor;
                    td.nombre_campo=n_campo;
                    if(def_campo.acumular && valor){
                        this.acumuladores.acumular(n_campo,valor);
                        if(def_campo.mostrar=='acumulado' && valor){
                            valor=this.acumuladores.valorString(n_campo);
                        }
                    }
                    def_campo.campeador.iniciarElemento(td,valor);
                    def_campo.campeador.desplegarElemento(td);
                    if(def_campo.style){
                        td.style.cssText=def_campo.style;
                    }
                    if(def_campo.editable){
                        td.defCampo=def_campo;
                        // alert('aca');
                        td.contentEditable=true;
                        td.onfocus=function(){
                            this.style.textOverflow='clip';
                            this.defCampo.campeador.focoElemento(this);
                        }
                        td.onblur=function(){
                            this.defCampo.campeador.finEdicionElemento(this,this.textContent);
                            this.defCampo.campeador.desplegarElemento(this);
                            grilla.prov.grabar(this.defCampo.campeador.valorBase(this),this.nombre_campo,fila,this,grilla);
                        }
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
    grilla.statusBarImg.src=rutaImagenes+'cargando.png';
    grilla.statusBarImg.className='girando';
    var ahora=new Date();
    this.statusBarText.empezo=ahora.getTime();
    var cuandoFalla=function(el_error){ // si dio error
        grilla.statusBarText.textContent+='\nERROR. '+el_error;
        grilla.statusBarImg.src=rutaImagenes+'error_carga.png';
        grilla.statusBarImg.className='movedizo';
    };
    this.prov.traerDatos({
        cuandoOk:function(obtenido){
            grilla.datos=obtenido;
            window.controlParametros={
                parametros:obtenido,
                def_params:{
                    campos:{
                        validar:is_object, 
                        estructuraElementos:{
                            tipo:{validar:function(tipo){ return tipo in grilla.tiposCampos; }, uso:'el tipo de datos'},
                            editable:{validar:function(b){ return typeof b=='boolean'; }},
                            invisible:{validar:function(b){ return typeof b=='boolean'; }},
                            decimales:{validar:function(decimales){ return !isNaN(decimales); }},
                            tituloHTML:{uso:'titulo en HTML'},
                            ancho:{uso:'ancho en EM de la columna'},
                            style:{validar:is_string, uso:'el texto CSS que tiene que tener cada celda'},
                            mostrar:{validar:is_string, uso:'indica qué mostrar en casos alternativos, ej:acumulado'},
                            acumular:{validar:function(acumulador){ return acumulador in Acumuladores.prototype.acumuladoresRegistrados; }},
                        },
                        uso:'definición de los campos (o columnas) de la grilla'
                    },
                    filas:{validar:is_array, uso:'las filas con los datos de la grilla'},
                    titulo:{validar:is_string, uso:'título de la grilla'},
                    campoAgrupador:{validar:function(campo){ return campo in obtenido.campos; }, uso:'nombre del campo que se usa como agrupador, si hay'},
                    demora:{uso:'calcula la demora neta de proceso en el servidor'}
                }
            }
            grilla.ejecutarSecuencia({
                'calculando el ancho de las columnas...':function(){
                    var primera_fila=this.datos.filas[0];
                    this.anchos={};
                    this.anchoTotal=0;
                    this.cantidadColumnas=0;
                    this.cantidadColumnasVisibles=0;
                    this.acumuladores=new Acumuladores();
                    for(var n_campo in primera_fila){
                        var def_campo=this.datos.campos[n_campo]||{};
                        this.datos.campos[n_campo]=def_campo;
                        def_campo.campeador=new (this.tiposCampos[def_campo.tipo]||this.tiposCampos.Generico);
                        if(n_campo.substr(0,3)=='pk_'){ // GEN
                            this.datos.campos[n_campo].invisible=true;
                        }
                        this.anchos[n_campo]=0;
                        if(def_campo.acumular){
                            this.acumuladores.iniciar(n_campo,def_campo.acumular);
                        }
                    }
                    this.datos.filas.forEach(function(fila){
                        for(var n_campo in fila){
                            var valor=fila[n_campo]+"";
                            this.anchos[n_campo]=Math.max(this.anchos[n_campo],valor.length);
                        }
                    },this);
                    for(var n_campo in primera_fila){
                        this.anchos[n_campo]=(this.anchos[n_campo]+4)/2;
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
                    this.tabla.caption.innerHTML='<span class="botonera_tabla" al_copiar=""><img src="'+rutaImagenes+'empezar_a_ocultar_columna.png" title="Empezar a ocultar columnas con un click" onclick="Toggle_EliminarColumnas(this)"><img src="'+rutaImagenes+'tabla_ordenable.png" title="Forzar la tabla para que sea ordenable" onclick="HacerOrdenables(this)"></span> ';
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
                'completando el título de las columnas...':function(){
                    for(var i_fila=0; i_fila<this.tabla.tHead.rows.length; i_fila++){
                        var row=this.tabla.tHead.rows[i_fila];
                        for(var i_celda=0; i_celda<row.cells.length; i_celda++){
                            var celda=row.cells[i_celda];
                            if(celda.offsetWidth<celda.scrollWidth && !celda.title){
                                celda.title=celda.textContent;
                            }
                        }
                    }
                },
                'listo':function(){
                }
            },true,cuandoFalla);
        },
        cuandoFalla:cuandoFalla
    });
}
