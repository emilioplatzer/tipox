"use strict";

window.controlDependencias={
    necesarios:[
        'Decimal'
    ]
}
    

function Sumadores(){
    this.acumuladores=[];
    this.acumuladores.push({});
    this.cantidadSumas=0;
}

Sumadores.prototype.iniciar=function(campo, valor){
    if(!this.iniciados){
        this.iniciados={};
    }
    if(this.acumuladores.length!=1) throw new Error('iniciando Sumadores fuera de orden');
    if(campo in this.iniciados) throw new Error('no se puede iniciar dos veces un campo ('+campo+') en el sumador');
    this.iniciados[campo]=true;
    this.acumuladores[0][campo]=new Decimal(0);
}

Sumadores.prototype.sumar=function(campo, valor){
    if(!this.iniciados) throw new Error('no hay campos iniciados en el sumador');
    if(!(campo in this.iniciados)) throw new Error('no esta iniciado el campo '+campo+' en el sumador');
    this.acumuladores[0][campo]=this.acumuladores[0][campo].add(valor);
    this.cantidadSumas++;
}

Sumadores.prototype.subtotalizar=function(){
    var rta={};
    var ultimo_nivel=false;
    if(this.acumuladores.length==1){
        this.acumuladores.push({});
        ultimo_nivel=true;
    }
    for(var campo in this.acumuladores[0]){ 
        if(ultimo_nivel){
            this.acumuladores[1][campo]=new Decimal(0);
        }
        this.acumuladores[1][campo]=(ultimo_nivel?new Decimal(0):this.acumuladores[1][campo]).add(this.acumuladores[0][campo]);
        rta[campo]=this.acumuladores[0][campo].toString();
        this.acumuladores[0][campo]=new Decimal(0);
    }
    this.cantidadSumas=0;
    return rta;
}

Sumadores.prototype.totalizar=function(){
    this.acumuladores.shift();
    if(this.cantidadSumas) throw new Error('no se puede totalizar sin subtotalizar antes');
    return this.subtotalizar();
}
