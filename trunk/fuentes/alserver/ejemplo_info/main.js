// Por $Author Revisión $Revision del $Date

Aplicacion.prototype.mostrarPaginaActual=function(){
    document.body.innerHTML='';
    this.grab(document.body,{tipox:'h1', innerText:'Primer página de Ejemplo'});
    this.grab(document.body,"próximamente");
}

Aplicacion.run(new Aplicacion());
