// Por $Author$ Revisión $Revision$ del $Date$

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
                {tipox:'td', className:'grilla_cont_td_lateral'},
                {tipox:'td', className:'grilla_cont_td_datos'},
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

/*
Aplicacion.prototype.casosDePrueba.push({
    modulo:'grillas',
    funcion:'pruebaTraduccion',
    caso:'grilla simple basada en tabla',
    entrada:[{tipox:'grilla', tabla:'prueba_tabla_comun'}],
    salida:{tipox:'div', id:'id1', className:'grilla_div', nodes:[
        {tipox:'table', className:'grilla_tabla_contenedor', dataset:{tabla:'prueba_tabla_comun'}, nodes:[
            {tipox:'caption', nodes:[{tipox:'grilla_boton_leer'}, {tipox:'grilla_titulo_tabla', innerText:"prueba_tabla_comun"}]},
            {tipox:'tr', className:'grilla_tr_encabezados', nodes:[
                {tipox:'td', className:'grilla_td_home', nodes:[
                    {tipox:'table', className:'grilla_tabla_interna', nodes:[
                        {tipox:'tr', nodes:[
                            {tipox:'th', nodes:"id"}
                        ]}
                    ]}
                ]},
                {tipox:'td', className:'grilla_td_home', nodes:[
                    {tipox:'table', className:'grilla_tabla_interna', nodes:[
                        {tipox:'tr', nodes:[
                            {tipox:'th', nodes:"nombre"},
                            {tipox:'th', nodes:"importe"},
                            {tipox:'th', nodes:{"tipox":"span", "nodes":["A",{"tipox":"small", "innerText":"ctv"}]}},
                            {tipox:'th', nodes:"cantidad"},
                            {tipox:'th', nodes:"fecha"},
                        ]}
                    ]}
                ]}
            ]}
        ]}
    ]},
});
*/