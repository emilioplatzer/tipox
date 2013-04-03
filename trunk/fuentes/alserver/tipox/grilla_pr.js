﻿// Por $Author$ Revisión $Revision$ del $Date$

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
        sinMock:true,
        idDestino:'id3_cont',
        incluirDocumentoEnSalida:true
    }],
    salidaDom:{documento:{
        id3:{localName:'div', childNodes:[
            {localName:'table', childNodes:[
                {localName:'caption'},
                {localName:'tr', childNodes:[
                    {localName:'td', className:'grilla_cont_td_home', childNodes:[
                        {localName:'table', className:'grilla_tabla_int', childNodes:[{localName:'tr', childNodes:[
                            {localName:'th', innerText:'id'}
                        ]}]}
                    ]},
                    {localName:'td', className:'grilla_cont_td_encabezados', childNodes:[
                        {localName:'table', className:'grilla_tabla_int', childNodes:[{localName:'tr', childNodes:[
                            {localName:'th', innerText:"nombre"},
                            {localName:'th', innerText:"importe"},
                            {localName:'th', childNodes:[{textContent:"A"},{localName:"small", innerText:"ctv"}]},
                            {localName:'th', innerText:"cantidad"},
                            {localName:'th', innerText:"fecha"},
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
    relanzarExcepcionSiHay:true,
    elementos:{
        id3:{tipox:'grilla', tabla:'prueba_tabla_comun'}
    },
    entrada:[{
        nombre:'grilla_ver',
        debugGrab:true,
        sinMock:true,
        idDestino:'id3',
        incluirDocumentoEnSalida:true
    }],
    salidaDom:{documento:{
        id3_cont_td_l:{localName:'td', childNodes:[{localName:'table', childNodes:[
                {localName:'tr', childNodes:[{localName:'td', innerText:'1', className:'tipo_serial'}]},
                {localName:'tr', childNodes:[{localName:'td', innerText:'2', className:'tipo_serial'}]},
                {localName:'tr', childNodes:[{localName:'td', innerText:'3', className:'tipo_serial'}]},
        ]}]},
        id3_cont_td_d:{localName:'td', childNodes:[{localName:'table', childNodes:[
                {localName:'tr', childNodes:[
                    {localName:'td', innerText:'uno', className:'tipo_texto'},
                    {localName:'td', innerText:'', className:'tipo_decimal'},
                    {localName:'td', innerText:'Sí', className:'tipo_logico'},
                    {localName:'td', innerText:'-9', className:'tipo_entero'},
                    {localName:'td', innerText:'31/12/2001', className:'tipo_fecha'},
                ]},
                {localName:'tr', childNodes:[
                    {localName:'td', innerText:'dos', className:'tipo_texto'},
                    {localName:'td', innerText:'0.11', className:'tipo_decimal'},
                    {localName:'td', innerText:'no', className:'tipo_logico'},
                    {localName:'td', innerText:'1', className:'tipo_entero'},
                    {localName:'td', innerText:'', className:'tipo_fecha'},
                ]},
                {localName:'tr', childNodes:[
                    {localName:'td', innerText:'año', className:'tipo_texto'},
                    {localName:'td', innerText:'2000', className:'tipo_decimal'},
                    {localName:'td', innerText:'', className:'tipo_logico'},
                    {localName:'td', innerText:'', className:'tipo_entero'},
                    {localName:'td', innerText:'6/5/1991', className:'tipo_fecha'},
                ]},
        ]}]},
    }}
});
