"use strict";

window.controlDependencias={
    necesarios:[
        'Decimal',
        'is_function',
    ]
}
    

function Acumuladores(){
    this.acumuladores=[];
    this.acumuladores.push({});
    this.cantidadAcumuladas=0;
}

function Acumulador(){
}

Acumuladores.prototype.acumuladoresRegistrados={};

Acumuladores.prototype.iniciar=function(campo, operacion){
    if(!this.iniciados){
        this.iniciados={};
    }
    if(this.acumuladores.length!=1) throw new Error('iniciando Acumuladores fuera de orden'); // !QAparam
    if(campo in this.iniciados) throw new Error('no se puede iniciar dos veces un campo ('+campo+') en el acumulador'); // !QAparam
    if(!(operacion in this.acumuladoresRegistrados)) throw new Error('operacion ('+operacion+') no permitda en un acumulador'); // !QAparam
    if(!is_function(this.acumuladoresRegistrados[operacion])) throw new Error('la operacion ('+operacion+') debe ser un acumulador'); // !QAparam
    this.iniciados[campo]={operacion:operacion};
    this.acumuladores[0][campo]=new this.acumuladoresRegistrados[operacion]();
}

Acumuladores.prototype.acumular=function(campo, valor){
    if(!this.iniciados) throw new Error('no hay campos iniciados en el acumulador');
    if(!(campo in this.iniciados)) throw new Error('no esta iniciado el campo '+campo+' en el acumulador');
    this.acumuladores[0][campo].acumular(valor);
    if(valor!==null && valor!==undefined){
        this.cantidadAcumuladas++;
    }
}

Acumuladores.prototype.valorString=function(campo){
    if(!this.iniciados) throw new Error('no hay campos iniciados en el acumulador');
    if(!(campo in this.iniciados)) throw new Error('no esta iniciado el campo '+campo+' en el acumulador');
    return this.acumuladores[0][campo].valorString();
}

Acumuladores.prototype.subtotalizar=function(){
    var rta={};
    var ultimo_nivel=false;
    if(this.acumuladores.length==1){
        var acumuladorVacio={};
        for(var campo in this.acumuladores[0]){
            acumuladorVacio[campo]=new this.acumuladoresRegistrados[this.iniciados[campo].operacion]();
        }
        this.acumuladores.push(acumuladorVacio);
        ultimo_nivel=true;
    }
    for(var campo in this.acumuladores[0]){ 
        /*
        if(ultimo_nivel){
            this.acumuladores[1][campo]=this.acumuladoresRegistrados[this.iniciados[campo].operacion]();
        }
        */
        this.acumuladores[1][campo].acumularAcumulador(this.acumuladores[0][campo]);
        rta[campo]=this.acumuladores[0][campo].valorString();
        this.acumuladores[0][campo]=new this.acumuladoresRegistrados[this.iniciados[campo].operacion]();
    }
    this.cantidadAcumuladas=0;
    return rta;
}

Acumuladores.prototype.totalizar=function(){
    this.acumuladores.shift();
    if(this.cantidadAcumuladas) throw new Error('no se puede totalizar sin subtotalizar antes');
    return this.subtotalizar();
}

/////////////// sumar
Acumuladores.prototype.acumuladoresRegistrados.sumar=function(){
    this.valor=new Decimal(0);
}

Acumuladores.prototype.acumuladoresRegistrados.sumar.prototype=Object.create(Acumulador.prototype);

Acumuladores.prototype.acumuladoresRegistrados.sumar.prototype.acumular=function(valor){
    if(valor===null || valor===undefined){
    }else{
        this.valor=this.valor.add(valor);
    }
}

Acumuladores.prototype.acumuladoresRegistrados.sumar.prototype.acumularAcumulador=function(otro){
    this.valor=this.valor.add(otro.valor);
}

Acumuladores.prototype.acumuladoresRegistrados.sumar.prototype.valorString=function(valor){
    return this.valor.toString();
}

/////////////// contar
Acumuladores.prototype.acumuladoresRegistrados.contar=function(){
    this.valor={no_nulos:0, nulos:0, cuales:{}};
}

Acumuladores.prototype.acumuladoresRegistrados.contar.prototype=Object.create(Acumulador.prototype);

Acumuladores.prototype.acumuladoresRegistrados.contar.prototype.acumular=function(valor){
    if(valor===null || valor===undefined){
        this.valor.nulos++;
    }else{
        this.valor.no_nulos++;
        this.valor.cuales[valor]=(this.valor.cuales[valor]||0)+1;
    }
}

Acumuladores.prototype.acumuladoresRegistrados.contar.prototype.acumularAcumulador=function(otro){
    this.valor.no_nulos+=otro.valor.no_nulos;
    this.valor.nulos+=otro.valor.nulos;
    for(var valor in otro.valor.cuales) if(otro.valor.cuales.hasOwnProperty(valor)){
        this.valor.cuales[valor]=(this.valor.cuales[valor]||0)+otro.valor.cuales[valor];
    }
}

Acumuladores.prototype.acumuladoresRegistrados.contar.prototype.valorString=function(valor){
    var distintos=Object.keys(this.valor.cuales).length; 
    return distintos+(distintos!=this.valor.no_nulos && this.valor.nulos>0?'/'+this.valor.no_nulos:''); 
}
