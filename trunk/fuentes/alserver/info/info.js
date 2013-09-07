// Por $Author: emilioplatzer@gmail.com $ Revisión $Revision: 23 $ del $Date: 2013-03-18 01:49:46 -0300 (lun 18 de mar de 2013) $
"use strict";

// Aplicacion.prototype.nombreAplicacion='poner';

var app=new Aplicacion();
app.grab(document.body,{tipox:div, elementos:[
    {tipox:'h1', elementos:"Framework tipox"},
    {tipox:'p', elementos:"Un nuevo intento de ordenar el desarrollo HTML5"},
    {tipox:'p', elementos:"Vamos a ver si ahora se pueden separar un poco las cosas"},
]});    
Aplicacion.run(app);
