"use strict";

function Aplicacion(){
    this.paginaActual='default';
}

Aplicacion.prototype.paginas={
    'default':{tipox:'h1', innerText:'¡en preparación!'},
    'tipox':{tipox:'p', innerText:'tipox versión $Revision'},
};

Aplicacion.prototype.creatorElementoDOM=function(tipox){
    return {
        nuevo:function(tagName){ return document.createElement(tagName); },
        asignarAtributos:function(destino,definicion){
            for(var atributo in definicion) if(definicion.hasOwnProperty(atributo)){
                var valor=definicion[atributo];
                if(atributo!='tipox'){
                    if(atributo instanceof Object){
                        this.asignarAtributos(destino[atributo],valor);
                    }else{
                        destino[atributo]=valor;
                    }
                }
            }
        }
    }
}

Aplicacion.prototype.grab=function(elemento,definicion){
    var nuevoElemento;
    if(definicion===null || definicion===undefined){
        return;
    }else if(typeof(definicion)=='string'){
        nuevoElemento=document.createTextNode(definicion);
    }else if(definicion instanceof Array){
        for(var i=0; i<definicion.length; i++){
            this.grab(elemento,definicion[i]);
        }
        return; 
    }else{
        var creador=this.domCreator(definicion.tipox);
        if('translate' in creador){
            definicion=creador.translate(definicion);
            creador=creador.creador();
        }
        nuevoElemento=creador.nuevo(definicion.tipox);
        creador.asignarAtributos(nuevoElemento,definicion);
        this.grab(nuevoElemento,definicion.nodes);
    }
    elemento.appendChild(nuevoElemento);
}

Aplicacion.prototype.nuevaExcepcion=function(mensaje){
    this.grab(document.body,{tipox:'div', className:'debug_excepcion', innerText:mensaje});
    throw new Error(mensaje);
}

Aplicacion.prototype.domCreator=function(tipox){
    if(tipox in this.creadores){
        return this.creadores[tipox].creador();
    }
    this.nuevaExcepcion('no existe el tipox '+tipox);
}

Aplicacion.prototype.creadores={
    "a":{tipo:'HTML4', descripcion:"Defines a hyperlink", creador:Aplicacion.prototype.creatorElementoDOM},
    "abbr":{tipo:'HTML4', descripcion:"Defines an abbreviation", creador:Aplicacion.prototype.creatorElementoDOM},
    "acronym":{tipo:'HTML4', descripcion:"Not supported in HTML5. Defines an acronym", creador:Aplicacion.prototype.creatorElementoDOM},
    "address":{tipo:'HTML4', descripcion:"Defines contact information for the author/owner of a document", creador:Aplicacion.prototype.creatorElementoDOM},
    "applet":{tipo:'HTML4', descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Defines an embedded applet", creador:Aplicacion.prototype.creatorElementoDOM},
    "area":{tipo:'HTML4', descripcion:"Defines an area inside an image-map", creador:Aplicacion.prototype.creatorElementoDOM},
    "article":{tipo:'HTML5', descripcion:"Defines an article", creador:Aplicacion.prototype.creatorElementoDOM},
    "aside":{tipo:'HTML5', descripcion:"Defines content aside from the page content", creador:Aplicacion.prototype.creatorElementoDOM},
    "audio":{tipo:'HTML5', descripcion:"Defines sound content", creador:Aplicacion.prototype.creatorElementoDOM},
    "b":{tipo:'HTML4', descripcion:"Defines bold text", creador:Aplicacion.prototype.creatorElementoDOM},
    "base":{tipo:'HTML4', descripcion:"Specifies the base URL/target for all relative URLs in a document", creador:Aplicacion.prototype.creatorElementoDOM},
    "basefont":{tipo:'HTML4', descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Specifies a default color, size, and font for all text in a document", creador:Aplicacion.prototype.creatorElementoDOM},
    "bdi":{tipo:'HTML5', descripcion:"Isolates a part of text that might be formatted in a different direction from other text outside it", creador:Aplicacion.prototype.creatorElementoDOM},
    "bdo":{tipo:'HTML4', descripcion:"Overrides the current text direction", creador:Aplicacion.prototype.creatorElementoDOM},
    "big":{tipo:'HTML4', descripcion:"Not supported in HTML5. Defines big text", creador:Aplicacion.prototype.creatorElementoDOM},
    "blockquote":{tipo:'HTML4', descripcion:"Defines a section that is quoted from another source", creador:Aplicacion.prototype.creatorElementoDOM},
    "body":{tipo:'HTML4', descripcion:"Defines the document's body", creador:Aplicacion.prototype.creatorElementoDOM},
    "br":{tipo:'HTML4', descripcion:"Defines a single line break", creador:Aplicacion.prototype.creatorElementoDOM},
    "button":{tipo:'HTML4', descripcion:"Defines a clickable button", creador:Aplicacion.prototype.creatorElementoDOM},
    "canvas":{tipo:'HTML5', descripcion:"Used to draw graphics, on the fly, via scripting (usually JavaScript)", creador:Aplicacion.prototype.creatorElementoDOM},
    "caption":{tipo:'HTML4', descripcion:"Defines a table caption", creador:Aplicacion.prototype.creatorElementoDOM},
    "center":{tipo:'HTML4', descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Defines centered text", creador:Aplicacion.prototype.creatorElementoDOM},
    "cite":{tipo:'HTML4', descripcion:"Defines the title of a work", creador:Aplicacion.prototype.creatorElementoDOM},
    "code":{tipo:'HTML4', descripcion:"Defines a piece of computer code", creador:Aplicacion.prototype.creatorElementoDOM},
    "col":{tipo:'HTML4', descripcion:"Specifies column properties for each column within a <colgroup> element ", creador:Aplicacion.prototype.creatorElementoDOM},
    "colgroup":{tipo:'HTML4', descripcion:"Specifies a group of one or more columns in a table for formatting", creador:Aplicacion.prototype.creatorElementoDOM},
    "command":{tipo:'HTML5', descripcion:"Defines a command button that a user can invoke", creador:Aplicacion.prototype.creatorElementoDOM},
    "datalist":{tipo:'HTML5', descripcion:"Specifies a list of pre-defined options for input controls", creador:Aplicacion.prototype.creatorElementoDOM},
    "dd":{tipo:'HTML4', descripcion:"Defines a description of an item in a definition list", creador:Aplicacion.prototype.creatorElementoDOM},
    "del":{tipo:'HTML4', descripcion:"Defines text that has been deleted from a document", creador:Aplicacion.prototype.creatorElementoDOM},
    "details":{tipo:'HTML5', descripcion:"Defines additional details that the user can view or hide", creador:Aplicacion.prototype.creatorElementoDOM},
    "dfn":{tipo:'HTML4', descripcion:"Defines a definition term", creador:Aplicacion.prototype.creatorElementoDOM},
    "dialog":{tipo:'HTML5', descripcion:"Defines a dialog box or window", creador:Aplicacion.prototype.creatorElementoDOM},
    "dir":{tipo:'HTML4', descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Defines a directory list", creador:Aplicacion.prototype.creatorElementoDOM},
    "div":{tipo:'HTML4', descripcion:"Defines a section in a document", creador:Aplicacion.prototype.creatorElementoDOM},
    "dl":{tipo:'HTML4', descripcion:"Defines a definition list", creador:Aplicacion.prototype.creatorElementoDOM},
    "dt":{tipo:'HTML4', descripcion:"Defines a term (an item) in a definition list", creador:Aplicacion.prototype.creatorElementoDOM},
    "em":{tipo:'HTML4', descripcion:"Defines emphasized text ", creador:Aplicacion.prototype.creatorElementoDOM},
    "embed":{tipo:'HTML5', descripcion:"Defines a container for an external (non-HTML) application", creador:Aplicacion.prototype.creatorElementoDOM},
    "fieldset":{tipo:'HTML4', descripcion:"Groups related elements in a form", creador:Aplicacion.prototype.creatorElementoDOM},
    "figcaption":{tipo:'HTML5', descripcion:"Defines a caption for a <figure> element", creador:Aplicacion.prototype.creatorElementoDOM},
    "figure":{tipo:'HTML5', descripcion:"Specifies self-contained content", creador:Aplicacion.prototype.creatorElementoDOM},
    "font":{tipo:'HTML4', descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Defines font, color, and size for text", creador:Aplicacion.prototype.creatorElementoDOM},
    "footer":{tipo:'HTML5', descripcion:"Defines a footer for a document or section", creador:Aplicacion.prototype.creatorElementoDOM},
    "form":{tipo:'HTML4', descripcion:"Defines an HTML form for user input", creador:Aplicacion.prototype.creatorElementoDOM},
    "frame":{tipo:'HTML4', descripcion:"Not supported in HTML5. Defines a window (a frame) in a frameset", creador:Aplicacion.prototype.creatorElementoDOM},
    "frameset":{tipo:'HTML4', descripcion:"Not supported in HTML5. Defines a set of frames", creador:Aplicacion.prototype.creatorElementoDOM},
    "h1":{tipo:'HTML4', descripcion:" Defines HTML headings level 1", creador:Aplicacion.prototype.creatorElementoDOM},
    "h2":{tipo:'HTML4', descripcion:" Defines HTML headings level 2", creador:Aplicacion.prototype.creatorElementoDOM},
    "h3":{tipo:'HTML4', descripcion:" Defines HTML headings level 3", creador:Aplicacion.prototype.creatorElementoDOM},
    "h4":{tipo:'HTML4', descripcion:" Defines HTML headings level 4", creador:Aplicacion.prototype.creatorElementoDOM},
    "h5":{tipo:'HTML4', descripcion:" Defines HTML headings level 5", creador:Aplicacion.prototype.creatorElementoDOM},
    "h6":{tipo:'HTML4', descripcion:" Defines HTML headings level 6", creador:Aplicacion.prototype.creatorElementoDOM},
    "head":{tipo:'HTML4', descripcion:"Defines information about the document", creador:Aplicacion.prototype.creatorElementoDOM},
    "header":{tipo:'HTML5', descripcion:"Defines a header for a document or section", creador:Aplicacion.prototype.creatorElementoDOM},
    "hgroup":{tipo:'HTML5', descripcion:"Groups heading ( <h1> to <h6>) elements", creador:Aplicacion.prototype.creatorElementoDOM},
    "hr":{tipo:'HTML4', descripcion:" Defines a thematic change in the content", creador:Aplicacion.prototype.creatorElementoDOM},
    "html":{tipo:'HTML4', descripcion:"Defines the root of an HTML document", creador:Aplicacion.prototype.creatorElementoDOM},
    "i":{tipo:'HTML4', descripcion:"Defines a part of text in an alternate voice or mood", creador:Aplicacion.prototype.creatorElementoDOM},
    "iframe":{tipo:'HTML4', descripcion:"Defines an inline frame", creador:Aplicacion.prototype.creatorElementoDOM},
    "img":{tipo:'HTML4', descripcion:"Defines an image", creador:Aplicacion.prototype.creatorElementoDOM},
    "input":{tipo:'HTML4', descripcion:"Defines an input control", creador:Aplicacion.prototype.creatorElementoDOM},
    "ins":{tipo:'HTML4', descripcion:"Defines a text that has been inserted into a document", creador:Aplicacion.prototype.creatorElementoDOM},
    "kbd":{tipo:'HTML4', descripcion:"Defines keyboard input", creador:Aplicacion.prototype.creatorElementoDOM},
    "keygen":{tipo:'HTML5', descripcion:"Defines a key-pair generator field (for forms)", creador:Aplicacion.prototype.creatorElementoDOM},
    "label":{tipo:'HTML4', descripcion:"Defines a label for an <input> element", creador:Aplicacion.prototype.creatorElementoDOM},
    "legend":{tipo:'HTML4', descripcion:"Defines a caption for a <fieldset>, <figure>, or <details> element", creador:Aplicacion.prototype.creatorElementoDOM},
    "li":{tipo:'HTML4', descripcion:"Defines a list item", creador:Aplicacion.prototype.creatorElementoDOM},
    "link":{tipo:'HTML4', descripcion:"Defines the relationship between a document and an external resource (most used to link to style sheets)", creador:Aplicacion.prototype.creatorElementoDOM},
    "map":{tipo:'HTML4', descripcion:"Defines a client-side image-map", creador:Aplicacion.prototype.creatorElementoDOM},
    "mark":{tipo:'HTML5', descripcion:"Defines marked/highlighted text", creador:Aplicacion.prototype.creatorElementoDOM},
    "menu":{tipo:'HTML4', descripcion:"Defines a list/menu of commands", creador:Aplicacion.prototype.creatorElementoDOM},
    "meta":{tipo:'HTML4', descripcion:"Defines metadata about an HTML document", creador:Aplicacion.prototype.creatorElementoDOM},
    "meter":{tipo:'HTML5', descripcion:"Defines a scalar measurement within a known range (a gauge)", creador:Aplicacion.prototype.creatorElementoDOM},
    "nav":{tipo:'HTML5', descripcion:"Defines navigation links", creador:Aplicacion.prototype.creatorElementoDOM},
    "noframes":{tipo:'HTML4', descripcion:"Not supported in HTML5. Defines an alternate content for users that do not support frames", creador:Aplicacion.prototype.creatorElementoDOM},
    "noscript":{tipo:'HTML4', descripcion:"Defines an alternate content for users that do not support client-side scripts", creador:Aplicacion.prototype.creatorElementoDOM},
    "object":{tipo:'HTML4', descripcion:"Defines an embedded object", creador:Aplicacion.prototype.creatorElementoDOM},
    "ol":{tipo:'HTML4', descripcion:"Defines an ordered list", creador:Aplicacion.prototype.creatorElementoDOM},
    "optgroup":{tipo:'HTML4', descripcion:"Defines a group of related options in a drop-down list", creador:Aplicacion.prototype.creatorElementoDOM},
    "option":{tipo:'HTML4', descripcion:"Defines an option in a drop-down list", creador:Aplicacion.prototype.creatorElementoDOM},
    "output":{tipo:'HTML5', descripcion:"Defines the result of a calculation", creador:Aplicacion.prototype.creatorElementoDOM},
    "p":{tipo:'HTML4', descripcion:"Defines a paragraph", creador:Aplicacion.prototype.creatorElementoDOM},
    "param":{tipo:'HTML4', descripcion:"Defines a parameter for an object", creador:Aplicacion.prototype.creatorElementoDOM},
    "pre":{tipo:'HTML4', descripcion:"Defines preformatted text", creador:Aplicacion.prototype.creatorElementoDOM},
    "progress":{tipo:'HTML5', descripcion:"Represents the progress of a task", creador:Aplicacion.prototype.creatorElementoDOM},
    "q":{tipo:'HTML4', descripcion:"Defines a short quotation", creador:Aplicacion.prototype.creatorElementoDOM},
    "rp":{tipo:'HTML5', descripcion:"Defines what to show in browsers that do not support ruby annotations", creador:Aplicacion.prototype.creatorElementoDOM},
    "rt":{tipo:'HTML5', descripcion:"Defines an explanation/pronunciation of characters (for East Asian typography)", creador:Aplicacion.prototype.creatorElementoDOM},
    "ruby":{tipo:'HTML5', descripcion:"Defines a ruby annotation (for East Asian typography)", creador:Aplicacion.prototype.creatorElementoDOM},
    "s":{tipo:'HTML4', descripcion:"Defines text that is no longer correct", creador:Aplicacion.prototype.creatorElementoDOM},
    "samp":{tipo:'HTML4', descripcion:"Defines sample output from a computer program", creador:Aplicacion.prototype.creatorElementoDOM},
    "script":{tipo:'HTML4', descripcion:"Defines a client-side script", creador:Aplicacion.prototype.creatorElementoDOM},
    "section":{tipo:'HTML5', descripcion:"Defines a section in a document", creador:Aplicacion.prototype.creatorElementoDOM},
    "select":{tipo:'HTML4', descripcion:"Defines a drop-down list", creador:Aplicacion.prototype.creatorElementoDOM},
    "small":{tipo:'HTML4', descripcion:"Defines smaller text", creador:Aplicacion.prototype.creatorElementoDOM},
    "source":{tipo:'HTML5', descripcion:"Defines multiple media resources for media elements (<video> and <audio>)", creador:Aplicacion.prototype.creatorElementoDOM},
    "span":{tipo:'HTML4', descripcion:"Defines a section in a document", creador:Aplicacion.prototype.creatorElementoDOM},
    "strike":{tipo:'HTML4', descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Defines strikethrough text", creador:Aplicacion.prototype.creatorElementoDOM},
    "strong":{tipo:'HTML4', descripcion:"Defines important text", creador:Aplicacion.prototype.creatorElementoDOM},
    "style":{tipo:'HTML4', descripcion:"Defines style information for a document", creador:Aplicacion.prototype.creatorElementoDOM},
    "sub":{tipo:'HTML4', descripcion:"Defines subscripted text", creador:Aplicacion.prototype.creatorElementoDOM},
    "summary":{tipo:'HTML5', descripcion:"Defines a visible heading for a <details> element", creador:Aplicacion.prototype.creatorElementoDOM},
    "sup":{tipo:'HTML4', descripcion:"Defines superscripted text", creador:Aplicacion.prototype.creatorElementoDOM},
    "table":{tipo:'HTML4', descripcion:"Defines a table", creador:Aplicacion.prototype.creatorElementoDOM},
    "tbody":{tipo:'HTML4', descripcion:"Groups the body content in a table", creador:Aplicacion.prototype.creatorElementoDOM},
    "td":{tipo:'HTML4', descripcion:"Defines a cell in a table", creador:Aplicacion.prototype.creatorElementoDOM},
    "textarea":{tipo:'HTML4', descripcion:"Defines a multiline input control (text area)", creador:Aplicacion.prototype.creatorElementoDOM},
    "tfoot":{tipo:'HTML4', descripcion:"Groups the footer content in a table", creador:Aplicacion.prototype.creatorElementoDOM},
    "th":{tipo:'HTML4', descripcion:"Defines a header cell in a table", creador:Aplicacion.prototype.creatorElementoDOM},
    "thead":{tipo:'HTML4', descripcion:"Groups the header content in a table", creador:Aplicacion.prototype.creatorElementoDOM},
    "time":{tipo:'HTML5', descripcion:"Defines a date/time", creador:Aplicacion.prototype.creatorElementoDOM},
    "title":{tipo:'HTML4', descripcion:"Defines a title for the document", creador:Aplicacion.prototype.creatorElementoDOM},
    "tr":{tipo:'HTML4', descripcion:"Defines a row in a table", creador:Aplicacion.prototype.creatorElementoDOM},
    "track":{tipo:'HTML5', descripcion:"Defines text tracks for media elements (<video> and <audio>)", creador:Aplicacion.prototype.creatorElementoDOM},
    "tt":{tipo:'HTML4', descripcion:"Not supported in HTML5. Defines teletype text", creador:Aplicacion.prototype.creatorElementoDOM},
    "u":{tipo:'HTML4', descripcion:"Defines text that should be stylistically different from normal text", creador:Aplicacion.prototype.creatorElementoDOM},
    "ul":{tipo:'HTML4', descripcion:"Defines an unordered list", creador:Aplicacion.prototype.creatorElementoDOM},
    "var":{tipo:'HTML4', descripcion:"Defines a variable", creador:Aplicacion.prototype.creatorElementoDOM},
    "video":{tipo:'HTML5', descripcion:"Defines a video or movie", creador:Aplicacion.prototype.creatorElementoDOM},
    "wbr":{tipo:'HTML5', descripcion:"Defines a possible line-break", creador:Aplicacion.prototype.creatorElementoDOM}
};

Aplicacion.prototype.creadores.tipox_logo={tipo:'tipox', descripcion:'el logo de tipox', creador:function(){
    return {
        translate:function(definicion){
            return {tipox:'a', className:'tipox_logo', innerText:'tipox', href:'tipox.net'};
        },
        creador:Aplicacion.prototype.creatorElementoDOM
    }
}}

Aplicacion.prototype.creadores.app_vinculo={tipo:'tipox_logo', descripcion:'vínculo que cambia a una página interna', creador:function(){
    return {
        translate:function(definicion){
            return cambiandole(definicion, {tipox:'a', className:'app_vinculo', href:'#!'+JSON.stringify(definicion.destino)});
        },
        creador:Aplicacion.prototype.creatorElementoDOM
    }
}}

Aplicacion.prototype.contenidoPaginaActual=function(){
    return this.paginas[this.paginaActual];
}

Aplicacion.prototype.mostrarPaginaActual=function(){
    document.body.innerHTML=''; 
    this.grab(document.body,this.contenidoPaginaActual());
}

Aplicacion.prototype.cambiarPaginaLocationHash=function(){
    if(location.hash.substr(0,2)==='#!'){
        var nuevoDestino=JSON.parse(location.hash.substr(2));
    }else{
        var nuevoDestino='default';
    }
    this.paginaActual=nuevoDestino;
    this.mostrarPaginaActual();
}

Aplicacion.prototype.controlarParametros=function(){}

Aplicacion.run=function(app){
    app.controlarParametros({app:app},{app:{validar:function(app){ return app instanceof Aplicacion; }}});
    window.addEventListener('load',function(){
        app.cambiarPaginaLocationHash();
    });    
    window.addEventListener("hashchange", function(){
        app.cambiarPaginaLocationHash();
    }
    , false);
}
