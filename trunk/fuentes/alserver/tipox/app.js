// Por $Author$ Revisión $Revision$ del $Date$
"use strict";

function Aplicacion(){
    this.cursorActual=[];
    this.cursorNuevo=[];
    this.jsCargados={};
    this.autoIdDom=0;
    this.entornoDesarrollo=true;
}

Aplicacion.prototype.paginas={};
Aplicacion.prototype.paginas.intr={ 
    labelMenu:'Introducción',
    nodes:'¡en preparación!'
};
Aplicacion.prototype.paginas.info={
    labelMenu:[{tipox:'span', className:'i_logo', innerText:'i'}],
    nodes:[
        {tipox:'p', nodes:['Especificaciones técnicas ']},
        {tipox:'p', nodes:['framework: ',{tipox:'tipox_logo'}]},
        {tipox:'p', nodes:[
            "para hacer sugerencias o reportar errores sobre este programa entrar a: ", 
            {tipox:'a', href:'https://code.google.com/p/tipox/issues/entry', innerText:'"New Issues"'},
            ' (se necesita tener una cuenta en gmail para poder acceder)'
        ]}
    ]
};
Aplicacion.prototype.paginas.entrar={
    labelMenu:'entrar',
    nodes:[
        {tipox:'h2', innerText:"Entrada"},
        {tipox:'formulario_simple', nodes:[
            {tipox:'parametro', id:'usuario', aclaracion:'probablemente el mail donde recibió el aviso'},
            {tipox:'parametro', id:'password', label:'contraseña', type:'password'},
            {tipox:'parametro_boton', id:'entrar', eventos:{click:'entrar_aplicacion'}}
        ]}
    ]
};

Aplicacion.prototype.eventos={};

Aplicacion.prototype.creadorElementoDOM={
    nuevo:function(tagName){ return document.createElement(tagName); },
    asignarAtributos:function(destino,definicion,futuro){
        for(var atributo in definicion) if(definicion.hasOwnProperty(atributo)){
            var valor=definicion[atributo];
            switch(atributo){
            case 'tipox': 
            case 'nodes': 
                break;
            case 'eventos': 
                for(var id_evento in definicion.eventos) if(definicion.eventos.hasOwnProperty(id_evento)){
                    var app=this.app;
                    destino.addEventListener(id_evento,function(evento){return app.eventos[definicion.eventos[id_evento]](app,evento,this);});
                }
                break;
            default:
                var app=this.app;
                if(valor instanceof Array){
                    app.assert(atributo in destino, atributo+' no esta en '+destino.tagName+' para asignar '+JSON.stringify(valor));
                    var agregadores={add:true, push:true};
                    var pude=false;
                    for(var agregador in agregadores){
                        if(agregador in destino[atributo]){
                            for(var i=0; i<valor.length; i++){
                                destino[atributo][agregador](valor[i]);
                            }
                            pude=true;
                            break;
                        }
                    }
                    if(!pude){
                        app.lanzarExcepcion('No esta definida la manera de agregar elementos de arreglo al atributo '+atributo);
                    }
                }else if(valor instanceof Object){
                    app.assert(atributo in destino, atributo+' no esta en '+destino.tagName+' para asignar '+JSON.stringify(valor));
                    this.asignarAtributos(destino[atributo],valor,futuro);
                }else{
                    destino[atributo]=valor;
                }
            }
        }
    }
}

Aplicacion.prototype.grab=function(elemento,definicion,futuro){
    var elementoDestino;
    var grabExterno=!futuro;
    if(grabExterno){
        futuro=this.newFuturo();
    }
    if(typeof(elemento)=='string'){
        elementoDestino=document.getElementById(elemento);
        if(!elementoDestino){
            this.lanzarExcepcion('No existe el elemento con id '+elemento);
        }
    }else{
        elementoDestino=elemento;
    }
    var nuevoElemento;
    if(definicion===null || definicion===undefined){
    }else if(typeof(definicion)=='string'){
        nuevoElemento=document.createTextNode(definicion);
    }else if(definicion instanceof Array){
        for(var i=0; i<definicion.length; i++){
            this.grab(elementoDestino,definicion[i],futuro);
        }
    }else{
        var creador=this.domCreator(definicion.tipox);
        if('translate' in creador){
            var definicion_traducida=creador.translate(definicion);
            this.grab(elementoDestino,definicion_traducida,futuro);
        }else{
            nuevoElemento=creador.nuevo(definicion.tipox);
            creador.asignarAtributos(nuevoElemento,definicion,futuro);
            this.grab(nuevoElemento,definicion.nodes,futuro);
        }
    }
    if(nuevoElemento){
        elementoDestino.appendChild(nuevoElemento);
        if('ongrab' in nuevoElemento){
            futuro.luego(function(respuesta,app){
                nuevoElemento.ongrab(app);
            });
        }
    }
    if(grabExterno){
        futuro.recibirListo(null);
    }
}

Aplicacion.prototype.cantidadExcepciones=10;

Aplicacion.prototype.lanzarExcepcion=function(mensaje){
    this.cantidadExcepciones--;
    if(this.cantidadExcepciones>0){
        this.grab(document.body,{tipox:'div', className:'debug_excepcion', innerText:mensaje});
    }
    throw new Error(mensaje);
}

Aplicacion.prototype.domCreator=function(tipox){
    if(tipox in this.creadores){
        var creador=this.creadores[tipox].creador;
        creador.app=this;
        return creador;
    }
    this.lanzarExcepcion('no existe el tipox '+tipox);
}

Aplicacion.prototype.creadores={
    "a":{tipo:'HTML4', descripcion:"Defines a hyperlink", creador:Aplicacion.prototype.creadorElementoDOM},
    "abbr":{tipo:'HTML4', descripcion:"Defines an abbreviation", creador:Aplicacion.prototype.creadorElementoDOM},
    "acronym":{tipo:'HTML4', descripcion:"Not supported in HTML5. Defines an acronym", creador:Aplicacion.prototype.creadorElementoDOM},
    "address":{tipo:'HTML4', descripcion:"Defines contact information for the author/owner of a document", creador:Aplicacion.prototype.creadorElementoDOM},
    "applet":{tipo:'HTML4', descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Defines an embedded applet", creador:Aplicacion.prototype.creadorElementoDOM},
    "area":{tipo:'HTML4', descripcion:"Defines an area inside an image-map", creador:Aplicacion.prototype.creadorElementoDOM},
    "article":{tipo:'HTML5', descripcion:"Defines an article", creador:Aplicacion.prototype.creadorElementoDOM},
    "aside":{tipo:'HTML5', descripcion:"Defines content aside from the page content", creador:Aplicacion.prototype.creadorElementoDOM},
    "audio":{tipo:'HTML5', descripcion:"Defines sound content", creador:Aplicacion.prototype.creadorElementoDOM},
    "b":{tipo:'HTML4', descripcion:"Defines bold text", creador:Aplicacion.prototype.creadorElementoDOM},
    "base":{tipo:'HTML4', descripcion:"Specifies the base URL/target for all relative URLs in a document", creador:Aplicacion.prototype.creadorElementoDOM},
    "basefont":{tipo:'HTML4', descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Specifies a default color, size, and font for all text in a document", creador:Aplicacion.prototype.creadorElementoDOM},
    "bdi":{tipo:'HTML5', descripcion:"Isolates a part of text that might be formatted in a different direction from other text outside it", creador:Aplicacion.prototype.creadorElementoDOM},
    "bdo":{tipo:'HTML4', descripcion:"Overrides the current text direction", creador:Aplicacion.prototype.creadorElementoDOM},
    "big":{tipo:'HTML4', descripcion:"Not supported in HTML5. Defines big text", creador:Aplicacion.prototype.creadorElementoDOM},
    "blockquote":{tipo:'HTML4', descripcion:"Defines a section that is quoted from another source", creador:Aplicacion.prototype.creadorElementoDOM},
    "body":{tipo:'HTML4', descripcion:"Defines the document's body", creador:Aplicacion.prototype.creadorElementoDOM},
    "br":{tipo:'HTML4', descripcion:"Defines a single line break", creador:Aplicacion.prototype.creadorElementoDOM},
    "button":{tipo:'HTML4', descripcion:"Defines a clickable button", creador:Aplicacion.prototype.creadorElementoDOM},
    "canvas":{tipo:'HTML5', descripcion:"Used to draw graphics, on the fly, via scripting (usually JavaScript)", creador:Aplicacion.prototype.creadorElementoDOM},
    "caption":{tipo:'HTML4', descripcion:"Defines a table caption", creador:Aplicacion.prototype.creadorElementoDOM},
    "center":{tipo:'HTML4', descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Defines centered text", creador:Aplicacion.prototype.creadorElementoDOM},
    "cite":{tipo:'HTML4', descripcion:"Defines the title of a work", creador:Aplicacion.prototype.creadorElementoDOM},
    "code":{tipo:'HTML4', descripcion:"Defines a piece of computer code", creador:Aplicacion.prototype.creadorElementoDOM},
    "col":{tipo:'HTML4', descripcion:"Specifies column properties for each column within a <colgroup> element ", creador:Aplicacion.prototype.creadorElementoDOM},
    "colgroup":{tipo:'HTML4', descripcion:"Specifies a group of one or more columns in a table for formatting", creador:Aplicacion.prototype.creadorElementoDOM},
    "command":{tipo:'HTML5', descripcion:"Defines a command button that a user can invoke", creador:Aplicacion.prototype.creadorElementoDOM},
    "datalist":{tipo:'HTML5', descripcion:"Specifies a list of pre-defined options for input controls", creador:Aplicacion.prototype.creadorElementoDOM},
    "dd":{tipo:'HTML4', descripcion:"Defines a description of an item in a definition list", creador:Aplicacion.prototype.creadorElementoDOM},
    "del":{tipo:'HTML4', descripcion:"Defines text that has been deleted from a document", creador:Aplicacion.prototype.creadorElementoDOM},
    "details":{tipo:'HTML5', descripcion:"Defines additional details that the user can view or hide", creador:Aplicacion.prototype.creadorElementoDOM},
    "dfn":{tipo:'HTML4', descripcion:"Defines a definition term", creador:Aplicacion.prototype.creadorElementoDOM},
    "dialog":{tipo:'HTML5', descripcion:"Defines a dialog box or window", creador:Aplicacion.prototype.creadorElementoDOM},
    "dir":{tipo:'HTML4', descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Defines a directory list", creador:Aplicacion.prototype.creadorElementoDOM},
    "div":{tipo:'HTML4', descripcion:"Defines a section in a document", creador:Aplicacion.prototype.creadorElementoDOM},
    "dl":{tipo:'HTML4', descripcion:"Defines a definition list", creador:Aplicacion.prototype.creadorElementoDOM},
    "dt":{tipo:'HTML4', descripcion:"Defines a term (an item) in a definition list", creador:Aplicacion.prototype.creadorElementoDOM},
    "em":{tipo:'HTML4', descripcion:"Defines emphasized text ", creador:Aplicacion.prototype.creadorElementoDOM},
    "embed":{tipo:'HTML5', descripcion:"Defines a container for an external (non-HTML) application", creador:Aplicacion.prototype.creadorElementoDOM},
    "fieldset":{tipo:'HTML4', descripcion:"Groups related elements in a form", creador:Aplicacion.prototype.creadorElementoDOM},
    "figcaption":{tipo:'HTML5', descripcion:"Defines a caption for a <figure> element", creador:Aplicacion.prototype.creadorElementoDOM},
    "figure":{tipo:'HTML5', descripcion:"Specifies self-contained content", creador:Aplicacion.prototype.creadorElementoDOM},
    "font":{tipo:'HTML4', descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Defines font, color, and size for text", creador:Aplicacion.prototype.creadorElementoDOM},
    "footer":{tipo:'HTML5', descripcion:"Defines a footer for a document or section", creador:Aplicacion.prototype.creadorElementoDOM},
    "form":{tipo:'HTML4', descripcion:"Defines an HTML form for user input", creador:Aplicacion.prototype.creadorElementoDOM},
    "frame":{tipo:'HTML4', descripcion:"Not supported in HTML5. Defines a window (a frame) in a frameset", creador:Aplicacion.prototype.creadorElementoDOM},
    "frameset":{tipo:'HTML4', descripcion:"Not supported in HTML5. Defines a set of frames", creador:Aplicacion.prototype.creadorElementoDOM},
    "h1":{tipo:'HTML4', descripcion:" Defines HTML headings level 1", creador:Aplicacion.prototype.creadorElementoDOM},
    "h2":{tipo:'HTML4', descripcion:" Defines HTML headings level 2", creador:Aplicacion.prototype.creadorElementoDOM},
    "h3":{tipo:'HTML4', descripcion:" Defines HTML headings level 3", creador:Aplicacion.prototype.creadorElementoDOM},
    "h4":{tipo:'HTML4', descripcion:" Defines HTML headings level 4", creador:Aplicacion.prototype.creadorElementoDOM},
    "h5":{tipo:'HTML4', descripcion:" Defines HTML headings level 5", creador:Aplicacion.prototype.creadorElementoDOM},
    "h6":{tipo:'HTML4', descripcion:" Defines HTML headings level 6", creador:Aplicacion.prototype.creadorElementoDOM},
    "head":{tipo:'HTML4', descripcion:"Defines information about the document", creador:Aplicacion.prototype.creadorElementoDOM},
    "header":{tipo:'HTML5', descripcion:"Defines a header for a document or section", creador:Aplicacion.prototype.creadorElementoDOM},
    "hgroup":{tipo:'HTML5', descripcion:"Groups heading ( <h1> to <h6>) elements", creador:Aplicacion.prototype.creadorElementoDOM},
    "hr":{tipo:'HTML4', descripcion:" Defines a thematic change in the content", creador:Aplicacion.prototype.creadorElementoDOM},
    "html":{tipo:'HTML4', descripcion:"Defines the root of an HTML document", creador:Aplicacion.prototype.creadorElementoDOM},
    "i":{tipo:'HTML4', descripcion:"Defines a part of text in an alternate voice or mood", creador:Aplicacion.prototype.creadorElementoDOM},
    "iframe":{tipo:'HTML4', descripcion:"Defines an inline frame", creador:Aplicacion.prototype.creadorElementoDOM},
    "img":{tipo:'HTML4', descripcion:"Defines an image", creador:Aplicacion.prototype.creadorElementoDOM},
    "input":{tipo:'HTML4', descripcion:"Defines an input control", creador:Aplicacion.prototype.creadorElementoDOM},
    "ins":{tipo:'HTML4', descripcion:"Defines a text that has been inserted into a document", creador:Aplicacion.prototype.creadorElementoDOM},
    "kbd":{tipo:'HTML4', descripcion:"Defines keyboard input", creador:Aplicacion.prototype.creadorElementoDOM},
    "keygen":{tipo:'HTML5', descripcion:"Defines a key-pair generator field (for forms)", creador:Aplicacion.prototype.creadorElementoDOM},
    "label":{tipo:'HTML4', descripcion:"Defines a label for an <input> element", creador:Aplicacion.prototype.creadorElementoDOM},
    "legend":{tipo:'HTML4', descripcion:"Defines a caption for a <fieldset>, <figure>, or <details> element", creador:Aplicacion.prototype.creadorElementoDOM},
    "li":{tipo:'HTML4', descripcion:"Defines a list item", creador:Aplicacion.prototype.creadorElementoDOM},
    "link":{tipo:'HTML4', descripcion:"Defines the relationship between a document and an external resource (most used to link to style sheets)", creador:Aplicacion.prototype.creadorElementoDOM},
    "map":{tipo:'HTML4', descripcion:"Defines a client-side image-map", creador:Aplicacion.prototype.creadorElementoDOM},
    "mark":{tipo:'HTML5', descripcion:"Defines marked/highlighted text", creador:Aplicacion.prototype.creadorElementoDOM},
    "menu":{tipo:'HTML4', descripcion:"Defines a list/menu of commands", creador:Aplicacion.prototype.creadorElementoDOM},
    "meta":{tipo:'HTML4', descripcion:"Defines metadata about an HTML document", creador:Aplicacion.prototype.creadorElementoDOM},
    "meter":{tipo:'HTML5', descripcion:"Defines a scalar measurement within a known range (a gauge)", creador:Aplicacion.prototype.creadorElementoDOM},
    "nav":{tipo:'HTML5', descripcion:"Defines navigation links", creador:Aplicacion.prototype.creadorElementoDOM},
    "noframes":{tipo:'HTML4', descripcion:"Not supported in HTML5. Defines an alternate content for users that do not support frames", creador:Aplicacion.prototype.creadorElementoDOM},
    "noscript":{tipo:'HTML4', descripcion:"Defines an alternate content for users that do not support client-side scripts", creador:Aplicacion.prototype.creadorElementoDOM},
    "object":{tipo:'HTML4', descripcion:"Defines an embedded object", creador:Aplicacion.prototype.creadorElementoDOM},
    "ol":{tipo:'HTML4', descripcion:"Defines an ordered list", creador:Aplicacion.prototype.creadorElementoDOM},
    "optgroup":{tipo:'HTML4', descripcion:"Defines a group of related options in a drop-down list", creador:Aplicacion.prototype.creadorElementoDOM},
    "option":{tipo:'HTML4', descripcion:"Defines an option in a drop-down list", creador:Aplicacion.prototype.creadorElementoDOM},
    "output":{tipo:'HTML5', descripcion:"Defines the result of a calculation", creador:Aplicacion.prototype.creadorElementoDOM},
    "p":{tipo:'HTML4', descripcion:"Defines a paragraph", creador:Aplicacion.prototype.creadorElementoDOM},
    "param":{tipo:'HTML4', descripcion:"Defines a parameter for an object", creador:Aplicacion.prototype.creadorElementoDOM},
    "pre":{tipo:'HTML4', descripcion:"Defines preformatted text", creador:Aplicacion.prototype.creadorElementoDOM},
    "progress":{tipo:'HTML5', descripcion:"Represents the progress of a task", creador:Aplicacion.prototype.creadorElementoDOM},
    "q":{tipo:'HTML4', descripcion:"Defines a short quotation", creador:Aplicacion.prototype.creadorElementoDOM},
    "rp":{tipo:'HTML5', descripcion:"Defines what to show in browsers that do not support ruby annotations", creador:Aplicacion.prototype.creadorElementoDOM},
    "rt":{tipo:'HTML5', descripcion:"Defines an explanation/pronunciation of characters (for East Asian typography)", creador:Aplicacion.prototype.creadorElementoDOM},
    "ruby":{tipo:'HTML5', descripcion:"Defines a ruby annotation (for East Asian typography)", creador:Aplicacion.prototype.creadorElementoDOM},
    "s":{tipo:'HTML4', descripcion:"Defines text that is no longer correct", creador:Aplicacion.prototype.creadorElementoDOM},
    "samp":{tipo:'HTML4', descripcion:"Defines sample output from a computer program", creador:Aplicacion.prototype.creadorElementoDOM},
    "script":{tipo:'HTML4', descripcion:"Defines a client-side script", creador:Aplicacion.prototype.creadorElementoDOM},
    "section":{tipo:'HTML5', descripcion:"Defines a section in a document", creador:Aplicacion.prototype.creadorElementoDOM},
    "select":{tipo:'HTML4', descripcion:"Defines a drop-down list", creador:Aplicacion.prototype.creadorElementoDOM},
    "small":{tipo:'HTML4', descripcion:"Defines smaller text", creador:Aplicacion.prototype.creadorElementoDOM},
    "source":{tipo:'HTML5', descripcion:"Defines multiple media resources for media elements (<video> and <audio>)", creador:Aplicacion.prototype.creadorElementoDOM},
    "span":{tipo:'HTML4', descripcion:"Defines a section in a document", creador:Aplicacion.prototype.creadorElementoDOM},
    "strike":{tipo:'HTML4', descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Defines strikethrough text", creador:Aplicacion.prototype.creadorElementoDOM},
    "strong":{tipo:'HTML4', descripcion:"Defines important text", creador:Aplicacion.prototype.creadorElementoDOM},
    "style":{tipo:'HTML4', descripcion:"Defines style information for a document", creador:Aplicacion.prototype.creadorElementoDOM},
    "sub":{tipo:'HTML4', descripcion:"Defines subscripted text", creador:Aplicacion.prototype.creadorElementoDOM},
    "summary":{tipo:'HTML5', descripcion:"Defines a visible heading for a <details> element", creador:Aplicacion.prototype.creadorElementoDOM},
    "sup":{tipo:'HTML4', descripcion:"Defines superscripted text", creador:Aplicacion.prototype.creadorElementoDOM},
    "table":{tipo:'HTML4', descripcion:"Defines a table", creador:Aplicacion.prototype.creadorElementoDOM},
    "tbody":{tipo:'HTML4', descripcion:"Groups the body content in a table", creador:Aplicacion.prototype.creadorElementoDOM},
    "td":{tipo:'HTML4', descripcion:"Defines a cell in a table", creador:Aplicacion.prototype.creadorElementoDOM},
    "textarea":{tipo:'HTML4', descripcion:"Defines a multiline input control (text area)", creador:Aplicacion.prototype.creadorElementoDOM},
    "tfoot":{tipo:'HTML4', descripcion:"Groups the footer content in a table", creador:Aplicacion.prototype.creadorElementoDOM},
    "th":{tipo:'HTML4', descripcion:"Defines a header cell in a table", creador:Aplicacion.prototype.creadorElementoDOM},
    "thead":{tipo:'HTML4', descripcion:"Groups the header content in a table", creador:Aplicacion.prototype.creadorElementoDOM},
    "time":{tipo:'HTML5', descripcion:"Defines a date/time", creador:Aplicacion.prototype.creadorElementoDOM},
    "title":{tipo:'HTML4', descripcion:"Defines a title for the document", creador:Aplicacion.prototype.creadorElementoDOM},
    "tr":{tipo:'HTML4', descripcion:"Defines a row in a table", creador:Aplicacion.prototype.creadorElementoDOM},
    "track":{tipo:'HTML5', descripcion:"Defines text tracks for media elements (<video> and <audio>)", creador:Aplicacion.prototype.creadorElementoDOM},
    "tt":{tipo:'HTML4', descripcion:"Not supported in HTML5. Defines teletype text", creador:Aplicacion.prototype.creadorElementoDOM},
    "u":{tipo:'HTML4', descripcion:"Defines text that should be stylistically different from normal text", creador:Aplicacion.prototype.creadorElementoDOM},
    "ul":{tipo:'HTML4', descripcion:"Defines an unordered list", creador:Aplicacion.prototype.creadorElementoDOM},
    "var":{tipo:'HTML4', descripcion:"Defines a variable", creador:Aplicacion.prototype.creadorElementoDOM},
    "video":{tipo:'HTML5', descripcion:"Defines a video or movie", creador:Aplicacion.prototype.creadorElementoDOM},
    "wbr":{tipo:'HTML5', descripcion:"Defines a possible line-break", creador:Aplicacion.prototype.creadorElementoDOM}
};

Aplicacion.prototype.creadores.tipox_logo={tipo:'tipox', descripcion:'el logo de tipox', creador:{
    translate:function(definicion){
        return {tipox:'a', className:'tipox_logo', innerText:'tipox', href:'//tipox.net'};
    }
}}

Aplicacion.prototype.creadores.app_vinculo={tipo:'tipox', descripcion:'vínculo que cambia a una página interna', creador:{
    translate:function(definicion){
        return cambiandole(definicion, {tipox:'a', className:(definicion.className||'app_vinculo'), href:'#!'+JSON.stringify(definicion.destino), destino:null},true,null);
    },
}}

Aplicacion.prototype.creadores.lista={tipo:'tipox', descripcion:'lista genérica <tagList> de elementos <tagElement> ', creador:{
    translate:function(definicion){
        var nuevo=cambiandole(definicion, {tipox:definicion.tagList});
        delete nuevo.elementos;
        nuevo.nodes=[];
        for(var i in definicion.elementos) if(definicion.elementos.hasOwnProperty(i)){
            nuevo.nodes.push({tipox:definicion.tagElement, nodes:definicion.elementos[i]});
        }
        return nuevo;
    },
}}

Aplicacion.prototype.nuevoIdDom=function(){
    return 'DOM_autoid'+(this.autoIdDom++);
}

Aplicacion.prototype.creadores.funcion={tipo:'tipox', descripcion:'muestra la corrida de una función sobre la app', creador:{
    nuevo:function(tipox){
        return document.createElement('div');
    },
    asignarAtributos:function(destino,definicion,futuro){
        var nuevoId=definicion.id||this.app.nuevoIdDom();
        destino.id=nuevoId;
        destino.className=definicion.className||'destino_funcion';
        this.app.assert('funcion' in definicion,'falta definicion.funcion');
        destino.ongrab=function(app){
            app[definicion.funcion].apply(app,definicion.parametros||[]);
        }
    },
}};

Aplicacion.prototype.creadores.app_menu_principal={tipo:'tipox', descripcion:'menú principal', creador:{
    translate:function(definicion){
        var nuevo=cambiandole(definicion, {tipox:'header', className:'app_menu_principal'});
        delete nuevo.elementos;
        nuevo.nodes=[];
        for(var i in definicion.elementos) if(definicion.elementos.hasOwnProperty(i)){
            var destino={};
            destino[definicion['for']]=i;
            nuevo.nodes.push({tipox:'app_vinculo', className:'app_elemento_menu_principal', destino:destino, nodes:definicion.elementos[i]});
        }
        return nuevo;
    },
}}

Aplicacion.prototype.assert=function(revisar,mensaje){
    if(!revisar){
        this.lanzarExcepcion('Falló un assert con '+mensaje);
    }
}

Aplicacion.prototype.creadores.app_alternativa={tipo:'tipox', descripcion:'menú principal', creador:{
    nuevo:function(tipox){
        var nuevo=document.createElement('div');
        nuevo.className='app_alternativa';
        return nuevo;
    },
    asignarAtributos:function(nuevoElemento,definicion,futuro){
        this.app.assert(!definicion.nodes, '!definicion.nodes en app_alternativa');
        nuevoElemento.id=definicion.id;
        var alternativa=this.app.cursorActual[definicion.id]||definicion['default'];
        this.app.cursorNuevo[definicion.id]=alternativa;
        this.app.grab(nuevoElemento,definicion[alternativa],futuro);
    },
}}

///////////////// FORMULARIOS ////////////////////

Aplicacion.prototype.creadores.formulario_simple={tipo:'tipox', descripcion:'formulario simple basado en una tabla de 3 columnas, label, input, aclaraciones', creador:{
    translate:function(definicion){
        var nuevo=cambiandole(definicion, {tipox:'form', className:'form_simple3'});
        var tabla={tipox:'table'};
        nuevo.nodes=tabla;
        tabla.nodes=definicion.nodes;
        return nuevo;
    },
}}

Aplicacion.prototype.creadores.parametro={tipo:'tipox', descripcion:'parámetro de formulario simple con autolabel', creador:{
    translate:function(definicion){
        var input=cambiandole(definicion, {tipox:definicion.tipox_parametro||'input', name:definicion.name||definicion.id, label:null, aclaracion:null, tipox_parametro:null},null);
        var label={tipox:'label', 'forHTML':definicion.id, nodes:('label' in definicion?definicion.label:input.name)};
        var nuevo={tipox:'tr', nodes:[
            {tipox:'td', nodes:label},
            {tipox:'td', nodes:input}
        ]};
        if('aclaracion' in definicion){
            nuevo.nodes.push({tipox:'td', nodes:definicion.aclaracion});
        }
        return nuevo;
    },
}}

Aplicacion.prototype.creadores.parametro_boton={tipo:'tipox', descripcion:'botón para el formulario simple encolumnado a segunda columna', creador:{
    translate:function(definicion){
        return cambiandole(definicion, {tipox:'parametro', tipox_parametro:'button', type:'button', label:'', innerText:!('nodes' in definicion) && !('innerText' in definicion)?definicion.id:definicion.innerText});
    },
}}

///////////////// fin-FORMULARIOS //////////////////
Aplicacion.prototype.creadores.aplicacion={tipo:'tipox', descripcion:'estructura de pantallas/procesos de la aplicación', creador:{
    translate:function(definicion){
        var menu={tipox:'app_menu_principal', 'for':definicion.id, elementos:{}};
        var secciones={tipox:'app_alternativa', 'default':'intr', id:definicion.id};
        var divSecciones={tipox:'section', className:'div_aplicacion', nodes:secciones};
        for(var id in definicion.paginas){
            var estaSeccion=definicion.paginas[id];
            if(id!='tipox' && !estaSeccion.ocultar){
                menu.elementos[id]=estaSeccion.labelMenu||id;
                secciones[id]=estaSeccion.nodes;
            }
        }
        return [menu, divSecciones];
    },
}}

Aplicacion.prototype.contenidoPaginaActual=function(){
    return {tipox:'aplicacion', id:'menu', paginas:this.paginas};
}

Aplicacion.prototype.mostrarPaginaActual=function(){
    document.body.innerHTML=''; 
    this.grab(document.body,this.contenidoPaginaActual());
}

Aplicacion.prototype.jsRequeridos=[];

Aplicacion.prototype.eventos.entrar_aplicacion=function(app,evento){
    app.enviarPaquete({proceso:'entrada',paquete:{usuario:usuario.value.toLowerCase(),password:usuario.value.toLowerCase()+hex_md5(password.value)}}).luego(function(respuesta){
        alert('ok '+JSON.stringify(respuesta));
    }).alFallar(function(mensaje){
        alert('fallo '+mensaje);
    });
}

Aplicacion.prototype.cargarJsRequeridos=function(){
    var cargoAlguno=false;
    this.mapLuego(this.jsRequeridos.slice(0),this.requiereJs,function(respuesta){
        cargoAlguno=cargoAlguno || respuesta.recienCargado;
    }).luego(function(){
        if(cargoAlguno){
            Almacen.adaptarAplicacion(this);
            this.mostrarPaginaActual();
            alert('carga ok alguno');
        }
    }).alFallar(function(mensaje){
        alert('ERROR CARGANDO requeridos '+mensaje);
    });
}

Aplicacion.prototype.validarUsuario=function(){
}

////////////////////////// Futuros //////////////////////////

var Futuro=function(app){
    this.app=app;
    this.luegos=[];
    this.manejadoresError=[];
}

Aplicacion.prototype.newFuturo=function(){
    return new Futuro(this);
}

Futuro.prototype.sincronizar=function(){
    if('respuesta' in this){
        while(this.luegos.length>0){
            var hacer=this.luegos.shift();
            hacer(this.respuesta,this.app);
        }
    }
    if('mensajeError' in this){
        while(this.manejadoresError.length>0){
            var hacer=this.manejadoresError.shift();
            hacer(this.mensajeError,this.app);
        }
    }
}

Futuro.prototype.recibirListo=function(respuesta){
    this.respuesta=respuesta;
    this.sincronizar();
}

Futuro.prototype.recibirError=function(mensajeError){
    this.mensajeError=mensajeError;
    this.sincronizar();
}

Futuro.prototype.luego=function(hacer){
    this.luegos.push(hacer);
    this.sincronizar();
    return this;
}

Futuro.prototype.alFallar=function(hacer){
    this.manejadoresError.push(hacer);
    this.sincronizar();
    return this;
}

Aplicacion.prototype.mapLuego=function(arreglo,funcionParaCadaElemento,funcionParaElLuego){
    var futuro=this.newFuturo();
    if(arreglo.length==0){
        futuro.recibirListo(null);
    }else{
        var elementoActual=arreglo.shift();
        funcionParaCadaElemento.call(this,elementoActual).luego(function(respuesta,app){
            funcionParaElLuego(respuesta,app);
            app.mapLuego(arreglo,funcionParaCadaElemento,funcionParaElLuego).luego(function(respuesta,app){
                futuro.recibirListo(null);
            });
        });
    }
    return futuro;
}

Aplicacion.prototype.requiereJs=function(nombreJs){
    var futuro=this.newFuturo();
    if(!this.jsCargados[nombreJs]){
        var s = document.createElement("script");
        s.src = nombreJs+'.js';
        s.onload = function () {
            futuro.recibirListo({recienCargado:true});
        }
        document.getElementsByTagName("head")[0].appendChild(s);
        this.jsCargados[nombreJs]=true;
    }else{
        futuro.recibirListo({recienCargado:false});
    }
    return futuro;
}

Aplicacion.prototype.enviarPaquete=function(params){
    var peticion=new XMLHttpRequest();
    var futuro=this.newFuturo();
    var ifDebug=function(x){ return x; };
    peticion.onreadystatechange=function(){
        switch(peticion.readyState) {
        case 4: 
            try{
                var rta = peticion.responseText;
                if(peticion.status!=200){
                    futuro.recibirError('Error de status '+peticion.status+' '+peticion.statusText);
                }else if(rta){
                    try{
                        var obtenido;
                        if(params.tipoRta=='texto'){
                            obtenido={tipox:'rtaOk', respuesta:rta};
                        }else{
                            obtenido=JSON.parse(rta);
                        }
                        if(obtenido.tipox=='rtaOk'){
                            try{
                                futuro.recibirListo(obtenido.respuesta);
                            }catch(err_llamador){
                                futuro.recibirError(descripciones_de_error(err_llamador)+' al procesar la recepcion de la peticion AJAX');
                            }
                        }else if('tipox' in obtenido){
                            futuro.recibirError(obtenido.mensaje);
                        }else{
                            futuro.recibirError('ERROR la respuesta recibida no es tipox '+ifDebug(rta));
                        }
                    }catch(err_json){
                        futuro.recibirError('ERROR PARSEANDO EL JSON '+':'+descripciones_de_error(err_json)+' => '+ifDebug(rta));
                    }
                }else{
                    futuro.recibirError('ERROR sin respuesta en la peticion AJAX');
                }
            }catch(err){
                futuro.recibirError('ERROR en el proceso de transmision AJAX '+descripciones_de_error(err),6);
            }
        }
    }
    try{
        peticion.open('POST', params.destino||'app.php', !params.sincronico); // !sincronico);
        peticion.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        var parametros='';
        var parametrosTipo={paquete:JSON.stringify, proceso:estoMismo};
        var separador='';
        for(var nombreParametro in parametrosTipo) if(parametrosTipo.hasOwnProperty(nombreParametro)){
            if(nombreParametro in params){
                parametros+=separador+nombreParametro+'='+encodeURIComponent(parametrosTipo[nombreParametro](params[nombreParametro]));
                separador='&';
            }
        }
        peticion.send(parametros);
    }catch(err){
        futuro.recibirError(descripciones_de_error(err));
    }
    return futuro;
}

Aplicacion.prototype.cambiarPaginaLocationHash=function(){
    this.validarUsuario();
    if(location.hash.substr(0,2)==='#!'){
        var hash=location.hash.substr(2);
        if(hash[0]=='%'){
            hash=decodeURI(hash);
        }
        var nuevoDestino=JSON.parse(hash);
    }else{
        var nuevoDestino={};
    }
    this.cursorActual=nuevoDestino;
    this.mostrarPaginaActual();
}

Aplicacion.prototype.controlarParametros=function(){}

Aplicacion.run=function(app){
    app.controlarParametros({app:app},{app:{validar:function(app){ return app instanceof Aplicacion; }}});
    var futuro=app.newFuturo();
    window.addEventListener('load',function(){
        app.cambiarPaginaLocationHash();
        futuro.recibirListo(true);
    });    
    window.addEventListener("hashchange", function(){
        app.cambiarPaginaLocationHash();
    }
    , false);
    return futuro;
}
