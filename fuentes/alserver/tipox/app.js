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
        var tipox=definicion.tipox;
        var creador=this.domCreator(tipox);
        nuevoElemento=creador.nuevo(tipox);
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
    "a":{nuevo:false, descripcion:"Defines a hyperlink", creador:Aplicacion.prototype.creatorElementoDOM},
    "abbr":{nuevo:false, descripcion:"Defines an abbreviation", creador:Aplicacion.prototype.creatorElementoDOM},
    "acronym":{nuevo:false, descripcion:"Not supported in HTML5. Defines an acronym", creador:Aplicacion.prototype.creatorElementoDOM},
    "address":{nuevo:false, descripcion:"Defines contact information for the author/owner of a document", creador:Aplicacion.prototype.creatorElementoDOM},
    "applet":{nuevo:false, descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Defines an embedded applet", creador:Aplicacion.prototype.creatorElementoDOM},
    "area":{nuevo:false, descripcion:"Defines an area inside an image-map", creador:Aplicacion.prototype.creatorElementoDOM},
    "article":{nuevo:true, descripcion:"Defines an article", creador:Aplicacion.prototype.creatorElementoDOM},
    "aside":{nuevo:true, descripcion:"Defines content aside from the page content", creador:Aplicacion.prototype.creatorElementoDOM},
    "audio":{nuevo:true, descripcion:"Defines sound content", creador:Aplicacion.prototype.creatorElementoDOM},
    "b":{nuevo:false, descripcion:"Defines bold text", creador:Aplicacion.prototype.creatorElementoDOM},
    "base":{nuevo:false, descripcion:"Specifies the base URL/target for all relative URLs in a document", creador:Aplicacion.prototype.creatorElementoDOM},
    "basefont":{nuevo:false, descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Specifies a default color, size, and font for all text in a document", creador:Aplicacion.prototype.creatorElementoDOM},
    "bdi":{nuevo:true, descripcion:"Isolates a part of text that might be formatted in a different direction from other text outside it", creador:Aplicacion.prototype.creatorElementoDOM},
    "bdo":{nuevo:false, descripcion:"Overrides the current text direction", creador:Aplicacion.prototype.creatorElementoDOM},
    "big":{nuevo:false, descripcion:"Not supported in HTML5. Defines big text", creador:Aplicacion.prototype.creatorElementoDOM},
    "blockquote":{nuevo:false, descripcion:"Defines a section that is quoted from another source", creador:Aplicacion.prototype.creatorElementoDOM},
    "body":{nuevo:false, descripcion:"Defines the document's body", creador:Aplicacion.prototype.creatorElementoDOM},
    "br":{nuevo:false, descripcion:"Defines a single line break", creador:Aplicacion.prototype.creatorElementoDOM},
    "button":{nuevo:false, descripcion:"Defines a clickable button", creador:Aplicacion.prototype.creatorElementoDOM},
    "canvas":{nuevo:true, descripcion:"Used to draw graphics, on the fly, via scripting (usually JavaScript)", creador:Aplicacion.prototype.creatorElementoDOM},
    "caption":{nuevo:false, descripcion:"Defines a table caption", creador:Aplicacion.prototype.creatorElementoDOM},
    "center":{nuevo:false, descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Defines centered text", creador:Aplicacion.prototype.creatorElementoDOM},
    "cite":{nuevo:false, descripcion:"Defines the title of a work", creador:Aplicacion.prototype.creatorElementoDOM},
    "code":{nuevo:false, descripcion:"Defines a piece of computer code", creador:Aplicacion.prototype.creatorElementoDOM},
    "col":{nuevo:false, descripcion:"Specifies column properties for each column within a <colgroup> element ", creador:Aplicacion.prototype.creatorElementoDOM},
    "colgroup":{nuevo:false, descripcion:"Specifies a group of one or more columns in a table for formatting", creador:Aplicacion.prototype.creatorElementoDOM},
    "command":{nuevo:true, descripcion:"Defines a command button that a user can invoke", creador:Aplicacion.prototype.creatorElementoDOM},
    "datalist":{nuevo:true, descripcion:"Specifies a list of pre-defined options for input controls", creador:Aplicacion.prototype.creatorElementoDOM},
    "dd":{nuevo:false, descripcion:"Defines a description of an item in a definition list", creador:Aplicacion.prototype.creatorElementoDOM},
    "del":{nuevo:false, descripcion:"Defines text that has been deleted from a document", creador:Aplicacion.prototype.creatorElementoDOM},
    "details":{nuevo:true, descripcion:"Defines additional details that the user can view or hide", creador:Aplicacion.prototype.creatorElementoDOM},
    "dfn":{nuevo:false, descripcion:"Defines a definition term", creador:Aplicacion.prototype.creatorElementoDOM},
    "dialog":{nuevo:true, descripcion:"Defines a dialog box or window", creador:Aplicacion.prototype.creatorElementoDOM},
    "dir":{nuevo:false, descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Defines a directory list", creador:Aplicacion.prototype.creatorElementoDOM},
    "div":{nuevo:false, descripcion:"Defines a section in a document", creador:Aplicacion.prototype.creatorElementoDOM},
    "dl":{nuevo:false, descripcion:"Defines a definition list", creador:Aplicacion.prototype.creatorElementoDOM},
    "dt":{nuevo:false, descripcion:"Defines a term (an item) in a definition list", creador:Aplicacion.prototype.creatorElementoDOM},
    "em":{nuevo:false, descripcion:"Defines emphasized text ", creador:Aplicacion.prototype.creatorElementoDOM},
    "embed":{nuevo:true, descripcion:"Defines a container for an external (non-HTML) application", creador:Aplicacion.prototype.creatorElementoDOM},
    "fieldset":{nuevo:false, descripcion:"Groups related elements in a form", creador:Aplicacion.prototype.creatorElementoDOM},
    "figcaption":{nuevo:true, descripcion:"Defines a caption for a <figure> element", creador:Aplicacion.prototype.creatorElementoDOM},
    "figure":{nuevo:true, descripcion:"Specifies self-contained content", creador:Aplicacion.prototype.creatorElementoDOM},
    "font":{nuevo:false, descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Defines font, color, and size for text", creador:Aplicacion.prototype.creatorElementoDOM},
    "footer":{nuevo:true, descripcion:"Defines a footer for a document or section", creador:Aplicacion.prototype.creatorElementoDOM},
    "form":{nuevo:false, descripcion:"Defines an HTML form for user input", creador:Aplicacion.prototype.creatorElementoDOM},
    "frame":{nuevo:false, descripcion:"Not supported in HTML5. Defines a window (a frame) in a frameset", creador:Aplicacion.prototype.creatorElementoDOM},
    "frameset":{nuevo:false, descripcion:"Not supported in HTML5. Defines a set of frames", creador:Aplicacion.prototype.creatorElementoDOM},
    "h1":{nuevo:false, descripcion:" Defines HTML headings level 1", creador:Aplicacion.prototype.creatorElementoDOM},
    "h2":{nuevo:false, descripcion:" Defines HTML headings level 2", creador:Aplicacion.prototype.creatorElementoDOM},
    "h3":{nuevo:false, descripcion:" Defines HTML headings level 3", creador:Aplicacion.prototype.creatorElementoDOM},
    "h4":{nuevo:false, descripcion:" Defines HTML headings level 4", creador:Aplicacion.prototype.creatorElementoDOM},
    "h5":{nuevo:false, descripcion:" Defines HTML headings level 5", creador:Aplicacion.prototype.creatorElementoDOM},
    "h6":{nuevo:false, descripcion:" Defines HTML headings level 6", creador:Aplicacion.prototype.creatorElementoDOM},
    "head":{nuevo:false, descripcion:"Defines information about the document", creador:Aplicacion.prototype.creatorElementoDOM},
    "header":{nuevo:true, descripcion:"Defines a header for a document or section", creador:Aplicacion.prototype.creatorElementoDOM},
    "hgroup":{nuevo:true, descripcion:"Groups heading ( <h1> to <h6>) elements", creador:Aplicacion.prototype.creatorElementoDOM},
    "hr":{nuevo:false, descripcion:" Defines a thematic change in the content", creador:Aplicacion.prototype.creatorElementoDOM},
    "html":{nuevo:false, descripcion:"Defines the root of an HTML document", creador:Aplicacion.prototype.creatorElementoDOM},
    "i":{nuevo:false, descripcion:"Defines a part of text in an alternate voice or mood", creador:Aplicacion.prototype.creatorElementoDOM},
    "iframe":{nuevo:false, descripcion:"Defines an inline frame", creador:Aplicacion.prototype.creatorElementoDOM},
    "img":{nuevo:false, descripcion:"Defines an image", creador:Aplicacion.prototype.creatorElementoDOM},
    "input":{nuevo:false, descripcion:"Defines an input control", creador:Aplicacion.prototype.creatorElementoDOM},
    "ins":{nuevo:false, descripcion:"Defines a text that has been inserted into a document", creador:Aplicacion.prototype.creatorElementoDOM},
    "kbd":{nuevo:false, descripcion:"Defines keyboard input", creador:Aplicacion.prototype.creatorElementoDOM},
    "keygen":{nuevo:true, descripcion:"Defines a key-pair generator field (for forms)", creador:Aplicacion.prototype.creatorElementoDOM},
    "label":{nuevo:false, descripcion:"Defines a label for an <input> element", creador:Aplicacion.prototype.creatorElementoDOM},
    "legend":{nuevo:false, descripcion:"Defines a caption for a <fieldset>, <figure>, or <details> element", creador:Aplicacion.prototype.creatorElementoDOM},
    "li":{nuevo:false, descripcion:"Defines a list item", creador:Aplicacion.prototype.creatorElementoDOM},
    "link":{nuevo:false, descripcion:"Defines the relationship between a document and an external resource (most used to link to style sheets)", creador:Aplicacion.prototype.creatorElementoDOM},
    "map":{nuevo:false, descripcion:"Defines a client-side image-map", creador:Aplicacion.prototype.creatorElementoDOM},
    "mark":{nuevo:true, descripcion:"Defines marked/highlighted text", creador:Aplicacion.prototype.creatorElementoDOM},
    "menu":{nuevo:false, descripcion:"Defines a list/menu of commands", creador:Aplicacion.prototype.creatorElementoDOM},
    "meta":{nuevo:false, descripcion:"Defines metadata about an HTML document", creador:Aplicacion.prototype.creatorElementoDOM},
    "meter":{nuevo:true, descripcion:"Defines a scalar measurement within a known range (a gauge)", creador:Aplicacion.prototype.creatorElementoDOM},
    "nav":{nuevo:true, descripcion:"Defines navigation links", creador:Aplicacion.prototype.creatorElementoDOM},
    "noframes":{nuevo:false, descripcion:"Not supported in HTML5. Defines an alternate content for users that do not support frames", creador:Aplicacion.prototype.creatorElementoDOM},
    "noscript":{nuevo:false, descripcion:"Defines an alternate content for users that do not support client-side scripts", creador:Aplicacion.prototype.creatorElementoDOM},
    "object":{nuevo:false, descripcion:"Defines an embedded object", creador:Aplicacion.prototype.creatorElementoDOM},
    "ol":{nuevo:false, descripcion:"Defines an ordered list", creador:Aplicacion.prototype.creatorElementoDOM},
    "optgroup":{nuevo:false, descripcion:"Defines a group of related options in a drop-down list", creador:Aplicacion.prototype.creatorElementoDOM},
    "option":{nuevo:false, descripcion:"Defines an option in a drop-down list", creador:Aplicacion.prototype.creatorElementoDOM},
    "output":{nuevo:true, descripcion:"Defines the result of a calculation", creador:Aplicacion.prototype.creatorElementoDOM},
    "p":{nuevo:false, descripcion:"Defines a paragraph", creador:Aplicacion.prototype.creatorElementoDOM},
    "param":{nuevo:false, descripcion:"Defines a parameter for an object", creador:Aplicacion.prototype.creatorElementoDOM},
    "pre":{nuevo:false, descripcion:"Defines preformatted text", creador:Aplicacion.prototype.creatorElementoDOM},
    "progress":{nuevo:true, descripcion:"Represents the progress of a task", creador:Aplicacion.prototype.creatorElementoDOM},
    "q":{nuevo:false, descripcion:"Defines a short quotation", creador:Aplicacion.prototype.creatorElementoDOM},
    "rp":{nuevo:true, descripcion:"Defines what to show in browsers that do not support ruby annotations", creador:Aplicacion.prototype.creatorElementoDOM},
    "rt":{nuevo:true, descripcion:"Defines an explanation/pronunciation of characters (for East Asian typography)", creador:Aplicacion.prototype.creatorElementoDOM},
    "ruby":{nuevo:true, descripcion:"Defines a ruby annotation (for East Asian typography)", creador:Aplicacion.prototype.creatorElementoDOM},
    "s":{nuevo:false, descripcion:"Defines text that is no longer correct", creador:Aplicacion.prototype.creatorElementoDOM},
    "samp":{nuevo:false, descripcion:"Defines sample output from a computer program", creador:Aplicacion.prototype.creatorElementoDOM},
    "script":{nuevo:false, descripcion:"Defines a client-side script", creador:Aplicacion.prototype.creatorElementoDOM},
    "section":{nuevo:true, descripcion:"Defines a section in a document", creador:Aplicacion.prototype.creatorElementoDOM},
    "select":{nuevo:false, descripcion:"Defines a drop-down list", creador:Aplicacion.prototype.creatorElementoDOM},
    "small":{nuevo:false, descripcion:"Defines smaller text", creador:Aplicacion.prototype.creatorElementoDOM},
    "source":{nuevo:true, descripcion:"Defines multiple media resources for media elements (<video> and <audio>)", creador:Aplicacion.prototype.creatorElementoDOM},
    "span":{nuevo:false, descripcion:"Defines a section in a document", creador:Aplicacion.prototype.creatorElementoDOM},
    "strike":{nuevo:false, descripcion:"Not supported in HTML5. Deprecated in HTML 4.01. Defines strikethrough text", creador:Aplicacion.prototype.creatorElementoDOM},
    "strong":{nuevo:false, descripcion:"Defines important text", creador:Aplicacion.prototype.creatorElementoDOM},
    "style":{nuevo:false, descripcion:"Defines style information for a document", creador:Aplicacion.prototype.creatorElementoDOM},
    "sub":{nuevo:false, descripcion:"Defines subscripted text", creador:Aplicacion.prototype.creatorElementoDOM},
    "summary":{nuevo:true, descripcion:"Defines a visible heading for a <details> element", creador:Aplicacion.prototype.creatorElementoDOM},
    "sup":{nuevo:false, descripcion:"Defines superscripted text", creador:Aplicacion.prototype.creatorElementoDOM},
    "table":{nuevo:false, descripcion:"Defines a table", creador:Aplicacion.prototype.creatorElementoDOM},
    "tbody":{nuevo:false, descripcion:"Groups the body content in a table", creador:Aplicacion.prototype.creatorElementoDOM},
    "td":{nuevo:false, descripcion:"Defines a cell in a table", creador:Aplicacion.prototype.creatorElementoDOM},
    "textarea":{nuevo:false, descripcion:"Defines a multiline input control (text area)", creador:Aplicacion.prototype.creatorElementoDOM},
    "tfoot":{nuevo:false, descripcion:"Groups the footer content in a table", creador:Aplicacion.prototype.creatorElementoDOM},
    "th":{nuevo:false, descripcion:"Defines a header cell in a table", creador:Aplicacion.prototype.creatorElementoDOM},
    "thead":{nuevo:false, descripcion:"Groups the header content in a table", creador:Aplicacion.prototype.creatorElementoDOM},
    "time":{nuevo:true, descripcion:"Defines a date/time", creador:Aplicacion.prototype.creatorElementoDOM},
    "title":{nuevo:false, descripcion:"Defines a title for the document", creador:Aplicacion.prototype.creatorElementoDOM},
    "tr":{nuevo:false, descripcion:"Defines a row in a table", creador:Aplicacion.prototype.creatorElementoDOM},
    "track":{nuevo:true, descripcion:"Defines text tracks for media elements (<video> and <audio>)", creador:Aplicacion.prototype.creatorElementoDOM},
    "tt":{nuevo:false, descripcion:"Not supported in HTML5. Defines teletype text", creador:Aplicacion.prototype.creatorElementoDOM},
    "u":{nuevo:false, descripcion:"Defines text that should be stylistically different from normal text", creador:Aplicacion.prototype.creatorElementoDOM},
    "ul":{nuevo:false, descripcion:"Defines an unordered list", creador:Aplicacion.prototype.creatorElementoDOM},
    "var":{nuevo:false, descripcion:"Defines a variable", creador:Aplicacion.prototype.creatorElementoDOM},
    "video":{nuevo:true, descripcion:"Defines a video or movie", creador:Aplicacion.prototype.creatorElementoDOM},
    "wbr":{nuevo:true, descripcion:"Defines a possible line-break", creador:Aplicacion.prototype.creatorElementoDOM}
};

Aplicacion.prototype.contenidoPaginaActual=function(){
    return this.paginas[this.paginaActual];
}

Aplicacion.prototype.mostrarPaginaActual=function(){
    document.body.innerHTML=''; 
    this.grab(document.body,this.contenidoPaginaActual());
}

Aplicacion.prototype.controlarParametros=function(){}

Aplicacion.run=function(app){
    app.controlarParametros({app:app},{app:{validar:function(app){ return app instanceof Aplicacion; }}});
    window.addEventListener('load',function(){
        app.mostrarPaginaActual();
    });    
}
