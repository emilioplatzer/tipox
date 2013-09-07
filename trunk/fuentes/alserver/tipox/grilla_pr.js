// Por $Author$ Revisión $Revision$ del $Date$
"use strict";

Aplicacion.prototype.paraCargarCasosDePrueba.push(function(){
//////////////////// CASOS DE PRUEBA /////////////////////
Aplicacion.prototype.casosDePrueba.push({
    modulo:'grillas',
    funcion:'pruebaTraduccion',
    caso:'grilla simple basada en tabla',
    // mostrarAunqueNoFalleHasta:'2013-04-01',
    entrada:[{tipox:'grilla', tabla:'prueba_tabla_comun', id:'id2'}],
    salida:{tipox:'div', id:'id2', className:'grilla_div', nodes:[
        {tipox:'table', id:'id2_cont', className:'grilla_cont_tabla', ongrab:Aplicacion.prototype.eventos.grilla_preparar_contenedor, dataset:{tabla:'prueba_tabla_comun'}, nodes:[
            {tipox:'caption', nodes:[{tipox:'grilla_boton_leer'}, {tipox:'span', className:'grilla_titulo_tabla', innerText:"prueba_tabla_comun"}]},
            {tipox:'tr', className:'grilla_cont_tr_encabezados', nodes:[
                {tipox:'td', className:'grilla_cont_td_home'},
                {tipox:'td', className:'grilla_cont_td_encabezados'},
            ]},
            {tipox:'tr', className:'grilla_cont_tr_datos', nodes:[
                {tipox:'td', id:'id2_cont_td_l', className:'grilla_cont_td_lateral'},
                {tipox:'td', id:'id2_cont_td_d', className:'grilla_cont_td_datos'},
            ]}
        ]}
    ]},
});

var CH0=Aplicacion.prototype.grillas.anchoCero;
var CH1=Aplicacion.prototype.grillas.anchoPorCaracter;

Aplicacion.prototype.casosDePrueba.push({
    modulo:'grillas',
    funcion:'probarEvento',
    caso:'preparar las columnas de la grilla',
    // mostrarAunqueNoFalleHasta:'2013-04-01',
    relanzarExcepcionSiHay:true,
    elementos:{
        id3:{tipox:'grilla', tabla:'prueba_tabla_comun'}
    },
    entrada:[{
        nombre:'grilla_preparar_contenedor',
        debugGrab:true,
        idDestino:'id3_cont',
        incluirDocumentoEnSalida:true,
        sinMock:true
    }],
    salidaDom:{documento:{
        id3:{localName:'div', childNodes:[
            {localName:'table', childNodes:[
                {localName:'caption'},
                {localName:'tr', childNodes:[
                    {localName:'td', className:'grilla_cont_td_home', childNodes:[
                        {localName:'table', className:'grilla_tabla_int', childNodes:[{localName:'tr', childNodes:[
                            {localName:'th', style:{width:CH0+4*CH1+'px'}, innerText:'id'}
                        ]}]}
                    ]},
                    {localName:'td', className:'grilla_cont_td_encabezados', childNodes:[
                        {localName:'table', className:'grilla_tabla_int', childNodes:[{localName:'tr', childNodes:[
                            {localName:'th', style:{width:'120px'}, innerText:"nombre"},
                            {localName:'th', style:{width:CH0+10*CH1+'px'}, innerText:"importe"},
                            {localName:'th', style:{width:CH0+ 2*CH1+'px'}, childNodes:[{textContent:"A"},{localName:"small", innerText:"ctv"}]},
                            {localName:'th', style:{width:CH0+ 8*CH1+'px'}, innerText:"cantidad"},
                            {localName:'th', style:{width:CH0+10*CH1+'px'}, innerText:"fecha"},
                        ]}]}
                    ]},
                ]},
                {localName:'tr', className:'grilla_cont_tr_datos', childNodes:[
                    {localName:'td', className:'grilla_cont_td_lateral'},
                    {localName:'td', className:'grilla_cont_td_datos'},
                ]}
            ]}
        ]},
    }}
});

Aplicacion.prototype.casosDePrueba.push({
    modulo:'grillas',
    funcion:'probarEvento',
    caso:'ver los datos de la grilla',
    // mostrarAunqueNoFalleHasta:'2013-04-01',
    // ignorado:'sin ticket aún',
    // relanzarExcepcionSiHay:true,
    elementos:{
        id3:{tipox:'grilla', tabla:'prueba_tabla_comun', datum:'prueba_tabla_comun', title:'todo bien'},
        idd:{tipox:'div', innerText:'ver si esto se cambia con el preparar'}
    },
    preparar:function(){
        this.colocar(id3_cont_td_l,{tipox:'div', innerText:'esto debe borrarse'});
        this.colocar(id3_cont_td_d,{tipox:'div', innerText:'esto también'});
        idd.innerText='ok el preparar';
    },
    entrada:[{
        nombre:'grilla_ver',
        debugGrab:true,
        sinMock:true,
        idDestino:'id3',
        incluirDocumentoEnSalida:true
    }],
    salidaDom:{documento:{
        id3:{title:'todo bien'},
        idd:{innerText:'ok el preparar'},
        id3_cont_td_l:{localName:'td', childNodes:[{localName:'table', childNodes:[
                {localName:'tr', childNodes:[{localName:'td', datum:'id', style:{width:CH0+4*CH1+'px'}, innerText:'1', className:'tipo_serial'}]},
                {localName:'tr', childNodes:[{localName:'td', datum:'id', innerText:'2', className:'tipo_serial'}]},
                {localName:'tr', childNodes:[{localName:'td', datum:'id', innerText:'3', className:'tipo_serial'}]},
        ]}]},
        id3_cont_td_d:{localName:'td', childNodes:[{localName:'table', childElementCount:3, childNodes:[
                {localName:'tr', datum:'0', childNodes:[
                    {localName:'td', datum:'nombre'  , style:{width:'120px'}, innerText:'uno', className:'tipo_texto'},
                    {localName:'td', datum:'importe' , style:{width:CH0+10*CH1+'px'},innerText:'', className:'tipo_decimal'},
                    {localName:'td', datum:'activo'  , style:{width:CH0+ 2*CH1+'px'},innerText:'Sí', className:'tipo_logico'},
                    {localName:'td', datum:'cantidad', style:{width:CH0+ 8*CH1+'px'},innerText:'-9', className:'tipo_entero'},
                    {localName:'td', datum:'fecha'   , style:{width:CH0+10*CH1+'px'},innerText:'31/12/2001', className:'tipo_fecha'},
                ]},
                {localName:'tr', datum:'1', childNodes:[
                    {localName:'td', datum:'nombre'  ,innerText:'dos', className:'tipo_texto'},
                    {localName:'td', datum:'importe' ,innerText:'0.11', className:'tipo_decimal'},
                    {localName:'td', datum:'activo'  ,innerText:'no', className:'tipo_logico'},
                    {localName:'td', datum:'cantidad',innerText:'1', className:'tipo_entero'},
                    {localName:'td', datum:'fecha'   ,innerText:'', className:'tipo_fecha'},
                ]},
                {localName:'tr', datum:'2', childNodes:[
                    {localName:'td', datum:'nombre'  ,innerText:'año', className:'tipo_texto'},
                    {localName:'td', datum:'importe' ,innerText:'2000', className:'tipo_decimal'},
                    {localName:'td', datum:'activo'  ,innerText:'', className:'tipo_logico'},
                    {localName:'td', datum:'cantidad',innerText:'', className:'tipo_entero'},
                    {localName:'td', datum:'fecha'   ,innerText:'6/5/1991', className:'tipo_fecha'},
                ]},
        ]}]},
    }}
});

Aplicacion.prototype.casosDePrueba.push({
    modulo:'grillas',
    funcion:'probarEvento',
    caso:'ver cómo la grilla indica que hay una tabla_inexistente',
    // mostrarAunqueNoFalleHasta:'2013-04-01',
    // ignorado:'sin ticket aún',
    relanzarExcepcionSiHay:true,
    elementos:{
        id4:{tipox:'grilla', tabla:'tabla_inexistente'}
    },
    entrada:[{
        nombre:'grilla_ver',
        debugGrab:true,
        sinMock:true,
        idDestino:'id4',
        incluirDocumentoEnSalida:true
    }],
    salidaDom:{documento:{
        id4:{
            style:{backgroundImage:new RegExp('^url\\(.*/imagenes/error\.png\\)$')}, 
            title:/^problemas al leer la tabla tabla_inexistente/
        },
    }}
});
//////////////////// FIN-CASOS DE PRUEBA /////////////////////
});