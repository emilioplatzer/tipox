// Por $Author$ Revisión $Revision$ del $Date$
"use strict";

function Colocador(){
    this.app=app_global;
}

Colocador.prototype.creadorElementoDOM={
    nuevo:function(tagName){ return document.createElement(tagName); },
    asignarAtributos:function(destino,contenido,futuro){
        for(var atributo in contenido) if(contenido.hasOwnProperty(atributo)){
            var valor=contenido[atributo];
            switch(atributo){
            case 'tipox': 
            case 'nodes': 
                break;
            case 'eventos': 
                for(var id_evento in contenido.eventos) if(contenido.eventos.hasOwnProperty(id_evento)){
                    var manejador=contenido.eventos[id_evento];
                    if(typeof manejador=='string'){
                        var app=this.app;
                        destino.addEventListener(id_evento,function(evento){
                            if("registro excepciones"){
                                try{
                                    return app.eventos[contenido.eventos[id_evento]].call(app,evento,this);
                                }catch(err){
                                    app.lanzarExcepcion(err,this);
                                }
                            }else{
                                return app.eventos[contenido.eventos[id_evento]].call(app,evento,this);
                            }
                        });
                    }else{
                        destino.addEventListener(id_evento,manejador);
                    }
                }
                break;
            default:
                var app=this.app;
                if(atributo in this.atributosEspeciales && !('sufijoValor' in this.atributosEspeciales[atributo])){
                    var defEspecial;
                    defEspecial=this.atributosEspeciales[atributo];
                    defEspecial.asignar(destino,valor);
                }else if(valor instanceof Array){
                    app.assert(atributo in destino, atributo+' no esta en '+destino.tagName+' para asignar '+JSON.stringify(valor));
                    if(atributo=='innerText'){
                        throw new Error("el innerText solo puede recibir strings");
                    }
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
                    if(destino[atributo]!=valor){
                        if(atributo in this.atributosEspeciales){ 
                            destino[atributo]=valor+this.atributosEspeciales[atributo].sufijoValor;
                        }
                    }
                }
            }
        }
    },
    atributosEspeciales:{
        width:{sufijoValor:'px'},
        ongrab:{
            asignar:function(elementoDestino, valor){
                if(!(valor instanceof Function)){
                    var mensaje="valor debe ser instanceof Function en "+elementoDestino.id;
                    console.assert(valor instanceof Function, mensaje);
                    throw new Error(mensaje);
                }
                elementoDestino.ongrab=valor;
            }
        }
    }
}

Colocador.prototype.CreadorElementoRow=cambiandole(
    Colocador.prototype.creadorElementoDOM, 
    {nuevo:function(tagName, contenido, destino){
        var fila=destino.insertRow(-1);
        fila.colocado=true;
        return fila;
    }}
);

Colocador.prototype.CreadorElementoCell=cambiandole(
    Colocador.prototype.creadorElementoDOM, 
    {nuevo:function(tagName, contenido, destino){
        var celda=destino.insertCell(-1);
        celda.colocado=true;
        return celda;
    }}
);

if(window.chromatizador && (chromatizador.agregados.defineProperty || chromatizador.agregados.objectCreate)){
    Colocador.prototype.creadorElementoDOM.atributosEspeciales.classList={
        asignar:function(elementoDestino, valor){
            chromatizador.agregarClassList(elementoDestino);
            for(var i=0; i<valor.length; i++){
                if(!elementoDestino.classList.add){
                    var x=elementoDestino.classList;
                    alert('no lo tiene. Tiene '+x);
                    // alert('no lo tiene. tiene '+elementoDestino.classList);
                }
                elementoDestino.classList.add(valor[i]);
            }
        }
    }
    Colocador.prototype.creadorElementoDOM.atributosEspeciales.dataset={
        asignar:function(elementoDestino, valor){
            chromatizador.agregarDataset(elementoDestino);
            for(var att in valor) if(valor.hasOwnProperty(att)){
                elementoDestino.dataset[att]=valor[att];
            }
        }
    }
}

Colocador.prototype.colocacionesDirectas={
    TR:{metodo:'insertRow', parametro:-1},
    TD:{metodo:'insertCell', parametro:-1}
}

Colocador.prototype.colocar=function(params){
    this.app.controlador.controlar(params,{
        contenido: {obligatorio:true, uso:'el contenido en formato tipox con el que se creará un Elemento que debe colocarse en el destino'},
        destino:   {predeterminado:document.body, uso:'el id o elemento destino donde se colocará el elemento nuevo'},
        ubicacion: {uso:'lugar donde debe ubicarse el elemento (si no se especifica va al final, si se especifica va delante del elemento especificado)'},
        reemplazar:{uso:'de existir el elemento destino indica si debe ser reemplazado su contenido'},
        reciclar:  {uso:'de existir el elemento se deja el que está'},
        futuro:    {uso:'OBSOLTETO no usar'}
    });
    var elementoDestino;
    if(typeof(params.destino)=='string'){
        elementoDestino=document.getElementById(params.destino);
        if(!elementoDestino){
            this.app.lanzarExcepcion('No existe el elemento con id '+params.destino);
        }
    }else{
        elementoDestino=params.destino;
    }
    if(params.reciclar && params.contenido.id){
        var existe=document.getElementById(params.contenido.id);
        if(existe){
            if(existe.parentNode===elementoDestino){
                return existe;
            }else{
                this.app.lanzarExcepcion('el elemento '+params.contenido.id+' existe en otro lugar del DOM en '+existe.parentNode.id);
            }
        }
    }
    var futuro=params.futuro;
    if(params.externo && this.app.newFuturo){
        futuro=this.app.newFuturo();
    }
    if(params.reemplazar){
        if(params.reciclar){
            this.app.lanzarExcepcion('No se puede reemplazar y reciclar a la vez');
        }
        elementoDestino.innerHTML='';
    }
    var nuevoElemento;
    var elementoAgregado;
    if(params.contenido===null || params.contenido===undefined){
    }else if(typeof(params.contenido)!='object'){
        nuevoElemento=document.createTextNode(params.contenido);
    }else if(params.contenido instanceof Array){
        for(var i=0; i<params.contenido.length; i++){
            this.colocar({destino:elementoDestino,contenido:params.contenido[i],ubicacion:params.ubicacion,futuro:futuro});
        }
    }else if(params.contenido.indexadoPor){
        for(var indice in params.contenido) if(params.contenido.hasOwnProperty(indice)){
            if(indice!='indexadoPor'){
                var atributosAdicionales={};
                atributosAdicionales[params.contenido.indexadoPor]=indice;
                this.colocar({destino:elementoDestino,contenido:cambiandole(params.contenido[indice],atributosAdicionales),ubicacion:params.ubicacion,futuro:futuro});
            }
        }
    }else{
        var creador=this.domCreator(params.contenido.tipox);
        if('translate' in creador){
            var contenido_traducido=creador.translate(params.contenido);
            elementoAgregado=this.colocar({destino:elementoDestino,contenido:contenido_traducido,ubicacion:params.ubicacion,futuro:futuro});
        }else{
            nuevoElemento=creador.nuevo(params.contenido.tipox,params.contenido,elementoDestino);
            creador.asignarAtributos(nuevoElemento,params.contenido,futuro);
            this.colocar({destino:nuevoElemento,contenido:params.contenido.nodes,futuro:futuro});
        }
    }
    if(nuevoElemento){
        if(!nuevoElemento.colocado){
            if(!params.ubicacion){
                elementoDestino.appendChild(nuevoElemento);
            }else{
                elementoDestino.insertBefore(nuevoElemento,params.ubicacion||null);
            }
        }
        elementoAgregado=nuevoElemento;
        if('ongrab' in nuevoElemento){
            console.assert(nuevoElemento.ongrab instanceof Function);
            futuro.luego("ongrab",
                function(respuesta,app){
                    return nuevoElemento.ongrab.call(app,app.eventoVacio,nuevoElemento);
                }
            );
        }
    }
    if(elementoAgregado && params.atributosAdicionales){
        for(var atributo in params.atributosAdicionales) if(params.atributosAdicionales.hasOwnProperty(atributo)){
            elementoAgregado[atributo]=params.atributosAdicionales[atributo];
        }
    }
    if(params.externo && this.newFuturo){
        futuro.recibirListo(null);
    }
    return elementoAgregado;
}

Colocador.prototype.domCreator=function(tipox){
    if(tipox in this.creadores){
        var creador=this.creadores[tipox].creador;
        creador.app=this.app;
        return creador;
    }
    this.app.lanzarExcepcion('no existe el tipox '+tipox);
}

Colocador.prototype.creadores={
    "a":{tipo:'HTML4', descripcion:"Defines a hyperlink", creador:Colocador.prototype.creadorElementoDOM},
    "abbr":{tipo:'HTML4', descripcion:"Defines an abbreviation", creador:Colocador.prototype.creadorElementoDOM},
    "acronym":{tipo:'HTML4', descripcion:"Not supported in HTML5. Defines an acronym", creador:Colocador.prototype.creadorElementoDOM},
    "address":{tipo:'HTML4', descripcion:"Defines contact information for the author/owner of a document", creador:Colocador.prototype.creadorElementoDOM},
    "applet":{tipo:'HTML4', descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Defines an embedded applet", creador:Colocador.prototype.creadorElementoDOM},
    "area":{tipo:'HTML4', descripcion:"Defines an area inside an image-map", creador:Colocador.prototype.creadorElementoDOM},
    "article":{tipo:'HTML5', descripcion:"Defines an article", creador:Colocador.prototype.creadorElementoDOM},
    "aside":{tipo:'HTML5', descripcion:"Defines content aside from the page content", creador:Colocador.prototype.creadorElementoDOM},
    "audio":{tipo:'HTML5', descripcion:"Defines sound content", creador:Colocador.prototype.creadorElementoDOM},
    "b":{tipo:'HTML4', descripcion:"Defines bold text", creador:Colocador.prototype.creadorElementoDOM},
    "base":{tipo:'HTML4', descripcion:"Specifies the base URL/target for all relative URLs in a document", creador:Colocador.prototype.creadorElementoDOM},
    "basefont":{tipo:'HTML4', descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Specifies a default color, size, and font for all text in a document", creador:Colocador.prototype.creadorElementoDOM},
    "bdi":{tipo:'HTML5', descripcion:"Isolates a part of text that might be formatted in a different direction from other text outside it", creador:Colocador.prototype.creadorElementoDOM},
    "bdo":{tipo:'HTML4', descripcion:"Overrides the current text direction", creador:Colocador.prototype.creadorElementoDOM},
    "big":{tipo:'HTML4', descripcion:"Not supported in HTML5. Defines big text", creador:Colocador.prototype.creadorElementoDOM},
    "blockquote":{tipo:'HTML4', descripcion:"Defines a section that is quoted from another source", creador:Colocador.prototype.creadorElementoDOM},
    "body":{tipo:'HTML4', descripcion:"Defines the document's body", creador:Colocador.prototype.creadorElementoDOM},
    "br":{tipo:'HTML4', descripcion:"Defines a single line break", creador:Colocador.prototype.creadorElementoDOM},
    "button":{tipo:'HTML4', descripcion:"Defines a clickable button", creador:Colocador.prototype.creadorElementoDOM},
    "canvas":{tipo:'HTML5', descripcion:"Used to draw graphics, on the fly, via scripting (usually JavaScript)", creador:Colocador.prototype.creadorElementoDOM},
    "caption":{tipo:'HTML4', descripcion:"Defines a table caption", creador:Colocador.prototype.creadorElementoDOM},
    "center":{tipo:'HTML4', descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Defines centered text", creador:Colocador.prototype.creadorElementoDOM},
    "cite":{tipo:'HTML4', descripcion:"Defines the title of a work", creador:Colocador.prototype.creadorElementoDOM},
    "code":{tipo:'HTML4', descripcion:"Defines a piece of computer code", creador:Colocador.prototype.creadorElementoDOM},
    "col":{tipo:'HTML4', descripcion:"Specifies column properties for each column within a <colgroup> element ", creador:Colocador.prototype.creadorElementoDOM},
    "colgroup":{tipo:'HTML4', descripcion:"Specifies a group of one or more columns in a table for formatting", creador:Colocador.prototype.creadorElementoDOM},
    "command":{tipo:'HTML5', descripcion:"Defines a command button that a user can invoke", creador:Colocador.prototype.creadorElementoDOM},
    "datalist":{tipo:'HTML5', descripcion:"Specifies a list of pre-defined options for input controls", creador:Colocador.prototype.creadorElementoDOM},
    "dd":{tipo:'HTML4', descripcion:"Defines a description of an item in a definition list", creador:Colocador.prototype.creadorElementoDOM},
    "del":{tipo:'HTML4', descripcion:"Defines text that has been deleted from a document", creador:Colocador.prototype.creadorElementoDOM},
    "details":{tipo:'HTML5', descripcion:"Defines additional details that the user can view or hide", creador:Colocador.prototype.creadorElementoDOM},
    "dfn":{tipo:'HTML4', descripcion:"Defines a definition term", creador:Colocador.prototype.creadorElementoDOM},
    "dialog":{tipo:'HTML5', descripcion:"Defines a dialog box or window", creador:Colocador.prototype.creadorElementoDOM},
    "dir":{tipo:'HTML4', descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Defines a directory list", creador:Colocador.prototype.creadorElementoDOM},
    "div":{tipo:'HTML4', descripcion:"Defines a section in a document", creador:Colocador.prototype.creadorElementoDOM},
    "dl":{tipo:'HTML4', descripcion:"Defines a definition list", creador:Colocador.prototype.creadorElementoDOM},
    "dt":{tipo:'HTML4', descripcion:"Defines a term (an item) in a definition list", creador:Colocador.prototype.creadorElementoDOM},
    "em":{tipo:'HTML4', descripcion:"Defines emphasized text ", creador:Colocador.prototype.creadorElementoDOM},
    "embed":{tipo:'HTML5', descripcion:"Defines a container for an external (non-HTML) application", creador:Colocador.prototype.creadorElementoDOM},
    "fieldset":{tipo:'HTML4', descripcion:"Groups related elements in a form", creador:Colocador.prototype.creadorElementoDOM},
    "figcaption":{tipo:'HTML5', descripcion:"Defines a caption for a <figure> element", creador:Colocador.prototype.creadorElementoDOM},
    "figure":{tipo:'HTML5', descripcion:"Specifies self-contained content", creador:Colocador.prototype.creadorElementoDOM},
    "font":{tipo:'HTML4', descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Defines font, color, and size for text", creador:Colocador.prototype.creadorElementoDOM},
    "footer":{tipo:'HTML5', descripcion:"Defines a footer for a document or section", creador:Colocador.prototype.creadorElementoDOM},
    "form":{tipo:'HTML4', descripcion:"Defines an HTML form for user input", creador:Colocador.prototype.creadorElementoDOM},
    "frame":{tipo:'HTML4', descripcion:"Not supported in HTML5. Defines a window (a frame) in a frameset", creador:Colocador.prototype.creadorElementoDOM},
    "frameset":{tipo:'HTML4', descripcion:"Not supported in HTML5. Defines a set of frames", creador:Colocador.prototype.creadorElementoDOM},
    "h1":{tipo:'HTML4', descripcion:" Defines HTML headings level 1", creador:Colocador.prototype.creadorElementoDOM},
    "h2":{tipo:'HTML4', descripcion:" Defines HTML headings level 2", creador:Colocador.prototype.creadorElementoDOM},
    "h3":{tipo:'HTML4', descripcion:" Defines HTML headings level 3", creador:Colocador.prototype.creadorElementoDOM},
    "h4":{tipo:'HTML4', descripcion:" Defines HTML headings level 4", creador:Colocador.prototype.creadorElementoDOM},
    "h5":{tipo:'HTML4', descripcion:" Defines HTML headings level 5", creador:Colocador.prototype.creadorElementoDOM},
    "h6":{tipo:'HTML4', descripcion:" Defines HTML headings level 6", creador:Colocador.prototype.creadorElementoDOM},
    "head":{tipo:'HTML4', descripcion:"Defines information about the document", creador:Colocador.prototype.creadorElementoDOM},
    "header":{tipo:'HTML5', descripcion:"Defines a header for a document or section", creador:Colocador.prototype.creadorElementoDOM},
    "hgroup":{tipo:'HTML5', descripcion:"Groups heading ( <h1> to <h6>) elements", creador:Colocador.prototype.creadorElementoDOM},
    "hr":{tipo:'HTML4', descripcion:" Defines a thematic change in the content", creador:Colocador.prototype.creadorElementoDOM},
    "html":{tipo:'HTML4', descripcion:"Defines the root of an HTML document", creador:Colocador.prototype.creadorElementoDOM},
    "i":{tipo:'HTML4', descripcion:"Defines a part of text in an alternate voice or mood", creador:Colocador.prototype.creadorElementoDOM},
    "iframe":{tipo:'HTML4', descripcion:"Defines an inline frame", creador:Colocador.prototype.creadorElementoDOM},
    "img":{tipo:'HTML4', descripcion:"Defines an image", creador:Colocador.prototype.creadorElementoDOM},
    "input":{tipo:'HTML4', descripcion:"Defines an input control", creador:Colocador.prototype.creadorElementoDOM},
    "ins":{tipo:'HTML4', descripcion:"Defines a text that has been inserted into a document", creador:Colocador.prototype.creadorElementoDOM},
    "kbd":{tipo:'HTML4', descripcion:"Defines keyboard input", creador:Colocador.prototype.creadorElementoDOM},
    "keygen":{tipo:'HTML5', descripcion:"Defines a key-pair generator field (for forms)", creador:Colocador.prototype.creadorElementoDOM},
    "label":{tipo:'HTML4', descripcion:"Defines a label for an <input> element", creador:Colocador.prototype.creadorElementoDOM},
    "legend":{tipo:'HTML4', descripcion:"Defines a caption for a <fieldset>, <figure>, or <details> element", creador:Colocador.prototype.creadorElementoDOM},
    "li":{tipo:'HTML4', descripcion:"Defines a list item", creador:Colocador.prototype.creadorElementoDOM},
    "link":{tipo:'HTML4', descripcion:"Defines the relationship between a document and an external resource (most used to link to style sheets)", creador:Colocador.prototype.creadorElementoDOM},
    "map":{tipo:'HTML4', descripcion:"Defines a client-side image-map", creador:Colocador.prototype.creadorElementoDOM},
    "mark":{tipo:'HTML5', descripcion:"Defines marked/highlighted text", creador:Colocador.prototype.creadorElementoDOM},
    "menu":{tipo:'HTML4', descripcion:"Defines a list/menu of commands", creador:Colocador.prototype.creadorElementoDOM},
    "meta":{tipo:'HTML4', descripcion:"Defines metadata about an HTML document", creador:Colocador.prototype.creadorElementoDOM},
    "meter":{tipo:'HTML5', descripcion:"Defines a scalar measurement within a known range (a gauge)", creador:Colocador.prototype.creadorElementoDOM},
    "nav":{tipo:'HTML5', descripcion:"Defines navigation links", creador:Colocador.prototype.creadorElementoDOM},
    "noframes":{tipo:'HTML4', descripcion:"Not supported in HTML5. Defines an alternate content for users that do not support frames", creador:Colocador.prototype.creadorElementoDOM},
    "noscript":{tipo:'HTML4', descripcion:"Defines an alternate content for users that do not support client-side scripts", creador:Colocador.prototype.creadorElementoDOM},
    "object":{tipo:'HTML4', descripcion:"Defines an embedded object", creador:Colocador.prototype.creadorElementoDOM},
    "ol":{tipo:'HTML4', descripcion:"Defines an ordered list", creador:Colocador.prototype.creadorElementoDOM},
    "optgroup":{tipo:'HTML4', descripcion:"Defines a group of related options in a drop-down list", creador:Colocador.prototype.creadorElementoDOM},
    "option":{tipo:'HTML4', descripcion:"Defines an option in a drop-down list", creador:Colocador.prototype.creadorElementoDOM},
    "output":{tipo:'HTML5', descripcion:"Defines the result of a calculation", creador:Colocador.prototype.creadorElementoDOM},
    "p":{tipo:'HTML4', descripcion:"Defines a paragraph", creador:Colocador.prototype.creadorElementoDOM},
    "param":{tipo:'HTML4', descripcion:"Defines a parameter for an object", creador:Colocador.prototype.creadorElementoDOM},
    "pre":{tipo:'HTML4', descripcion:"Defines preformatted text", creador:Colocador.prototype.creadorElementoDOM},
    "progress":{tipo:'HTML5', descripcion:"Represents the progress of a task", creador:Colocador.prototype.creadorElementoDOM},
    "q":{tipo:'HTML4', descripcion:"Defines a short quotation", creador:Colocador.prototype.creadorElementoDOM},
    "rp":{tipo:'HTML5', descripcion:"Defines what to show in browsers that do not support ruby annotations", creador:Colocador.prototype.creadorElementoDOM},
    "rt":{tipo:'HTML5', descripcion:"Defines an explanation/pronunciation of characters (for East Asian typography)", creador:Colocador.prototype.creadorElementoDOM},
    "ruby":{tipo:'HTML5', descripcion:"Defines a ruby annotation (for East Asian typography)", creador:Colocador.prototype.creadorElementoDOM},
    "s":{tipo:'HTML4', descripcion:"Defines text that is no longer correct", creador:Colocador.prototype.creadorElementoDOM},
    "samp":{tipo:'HTML4', descripcion:"Defines sample output from a computer program", creador:Colocador.prototype.creadorElementoDOM},
    "script":{tipo:'HTML4', descripcion:"Defines a client-side script", creador:Colocador.prototype.creadorElementoDOM},
    "section":{tipo:'HTML5', descripcion:"Defines a section in a document", creador:Colocador.prototype.creadorElementoDOM},
    "select":{tipo:'HTML4', descripcion:"Defines a drop-down list", creador:Colocador.prototype.creadorElementoDOM},
    "small":{tipo:'HTML4', descripcion:"Defines smaller text", creador:Colocador.prototype.creadorElementoDOM},
    "source":{tipo:'HTML5', descripcion:"Defines multiple media resources for media elements (<video> and <audio>)", creador:Colocador.prototype.creadorElementoDOM},
    "span":{tipo:'HTML4', descripcion:"Defines a section in a document", creador:Colocador.prototype.creadorElementoDOM},
    "strike":{tipo:'HTML4', descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Defines strikethrough text", creador:Colocador.prototype.creadorElementoDOM},
    "strong":{tipo:'HTML4', descripcion:"Defines important text", creador:Colocador.prototype.creadorElementoDOM},
    "style":{tipo:'HTML4', descripcion:"Defines style information for a document", creador:Colocador.prototype.creadorElementoDOM},
    "sub":{tipo:'HTML4', descripcion:"Defines subscripted text", creador:Colocador.prototype.creadorElementoDOM},
    "summary":{tipo:'HTML5', descripcion:"Defines a visible heading for a <details> element", creador:Colocador.prototype.creadorElementoDOM},
    "sup":{tipo:'HTML4', descripcion:"Defines superscripted text", creador:Colocador.prototype.creadorElementoDOM},
    "table":{tipo:'HTML4', descripcion:"Defines a table", creador:Colocador.prototype.creadorElementoDOM},
    "tbody":{tipo:'HTML4', descripcion:"Groups the body content in a table", creador:Colocador.prototype.creadorElementoDOM},
    "td":{tipo:'HTML4', descripcion:"Defines a cell in a table", creador:Colocador.prototype.CreadorElementoCell},
    "textarea":{tipo:'HTML4', descripcion:"Defines a multiline input control (text area)", creador:Colocador.prototype.creadorElementoDOM},
    "tfoot":{tipo:'HTML4', descripcion:"Groups the footer content in a table", creador:Colocador.prototype.creadorElementoDOM},
    "th":{tipo:'HTML4', descripcion:"Defines a header cell in a table", creador:Colocador.prototype.creadorElementoDOM},
    "thead":{tipo:'HTML4', descripcion:"Groups the header content in a table", creador:Colocador.prototype.creadorElementoDOM},
    "time":{tipo:'HTML5', descripcion:"Defines a date/time", creador:Colocador.prototype.creadorElementoDOM},
    "title":{tipo:'HTML4', descripcion:"Defines a title for the document", creador:Colocador.prototype.creadorElementoDOM},
    "tr":{tipo:'HTML4', descripcion:"Defines a row in a table", creador:Colocador.prototype.CreadorElementoRow},
    "track":{tipo:'HTML5', descripcion:"Defines text tracks for media elements (<video> and <audio>)", creador:Colocador.prototype.creadorElementoDOM},
    "tt":{tipo:'HTML4', descripcion:"Not supported in HTML5. Defines teletype text", creador:Colocador.prototype.creadorElementoDOM},
    "u":{tipo:'HTML4', descripcion:"Defines text that should be stylistically different from normal text", creador:Colocador.prototype.creadorElementoDOM},
    "ul":{tipo:'HTML4', descripcion:"Defines an unordered list", creador:Colocador.prototype.creadorElementoDOM},
    "var":{tipo:'HTML4', descripcion:"Defines a variable", creador:Colocador.prototype.creadorElementoDOM},
    "video":{tipo:'HTML5', descripcion:"Defines a video or movie", creador:Colocador.prototype.creadorElementoDOM},
    "wbr":{tipo:'HTML5', descripcion:"Defines a possible line-break", creador:Colocador.prototype.creadorElementoDOM}
};

Colocador.prototype.creadores.logo_tipox={tipo:'tipox', descripcion:'el logo de tipox', creador:{
    translate:function(contenido){
        return {
            tipox:'a', className:'logo_tipox', nodes:'tipox', href:'//tipox.net', 
            style:{fontFamily:'comic', fontStyle:'italic', fontWeight:'bold', textDecoration:'none', fontSize:'110%', color:'brown'}
        };
    }
}}

Colocador.prototype.creadores.lista={tipo:'tipox', descripcion:'lista genérica <tagList> de elementos <tagElement> ', creador:{
    translate:function(contenido){
        var nuevo=cambiandole(contenido, {tipox:contenido.tagList, tagList:null, tagElement:null}, true, null);
        delete nuevo.elementos;
        nuevo.nodes=[];
        for(var i in contenido.elementos) if(contenido.elementos.hasOwnProperty(i)){
            nuevo.nodes.push({tipox:contenido.tagElement, nodes:contenido.elementos[i]});
        }
        return nuevo;
    }
}};

Colocador.prototype.creadores.funcion={tipo:'tipox', descripcion:'muestra la corrida de una función sobre la app', creador:{
    nuevo:function(tipox,contenido){
        return document.createElement(contenido.tagName||'div');
    },
    asignarAtributos:function(destino,contenido,futuro){
        destino.id=contenido.id;
        destino.className=contenido.className||'destino_funcion';
        this.app.assert('funcion' in contenido,'falta contenido.funcion');
        destino.ongrab=function(){
            return this[contenido.funcion].apply(this,contenido.parametros||[]);
        }
    }
}}

Colocador.prototype.creadores.tabla={tipo:'tipox', descripcion:'tabla simple basada en filas de celdas', creador:{
    translate:function(contenido){
        var rta=cambiandole(contenido,{tipox:'table'});
        delete rta.filas;
        var nodesFilas=[];
        for(var i_fila in contenido.filas) if(contenido.filas.hasOwnProperty(i_fila)){
            var fila=contenido.filas[i_fila];
            var nodesCeldas=[];
            for(var i_celda in fila) if(fila.hasOwnProperty(i_celda)){
                var celda=fila[i_celda];
                nodesCeldas.push({tipox:'td', nodes:celda});
            }
            nodesFilas.push({tipox:'tr', nodes:nodesCeldas});
        }
        rta.nodes=nodesFilas;
        return rta;
    }
}}
