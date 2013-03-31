// Por $Author$ Revisión $Revision$ del $Date$

Aplicacion.prototype.casosDePrueba.push({
    modulo:'grillas',
    funcion:'pruebaTraduccion',
    caso:'grilla simple basada en tabla',
    entrada:[{tipox:'grilla', tabla:'prueba_tabla_comun', id:'id2', despliegue:'simple'}],
    salida:{tipox:'div', id:'id2', className:'grilla_div', ongrab:Aplicacion.prototype.grilla_preparar_contenedor, nodes:[
        {tipox:'table', className:'grilla_cont_tabla', dataset:{tabla:'prueba_tabla_comun'}, nodes:[
            {tipox:'caption', nodes:[{tipox:'grilla_boton_leer'}, {tipox:'span', className:'grilla_titulo_tabla', innerText:"prueba_tabla_comun"}]},
            {tipox:'tr', className:'grilla_contr_tr_encabezados', nodes:[
                {tipox:'td', className:'grilla_cont_td_home'},
                {tipox:'td', className:'grilla_cont_td_encabezados'},
            ]},
            {tipox:'tr', className:'grilla_contr_tr_datos', nodes:[
                {tipox:'td', className:'grilla_cont_td_lateral'},
                {tipox:'td', className:'grilla_cont_td_datos'},
            ]}
        ]}
    ]},
});

Aplicacion.prototype.casosDePrueba.push({
    modulo:'grillas',
    funcion:'pruebaTraduccion',
    caso:'grilla simple basada en tabla',
    entrada:[{tipox:'grilla', tabla:'prueba_tabla_comun', id:'id2', despliegue:'simple'}],
    salida:{tipox:'div', id:'id2', className:'grilla_div', ongrab:Aplicacion.prototype.grilla_preparar_contenedor, nodes:[
        {tipox:'table', className:'grilla_cont_tabla', dataset:{tabla:'prueba_tabla_comun'}, nodes:[
            {tipox:'caption', nodes:[{tipox:'grilla_boton_leer'}, {tipox:'span', className:'grilla_titulo_tabla', innerText:"prueba_tabla_comun"}]},
            {tipox:'tr', className:'grilla_contr_tr_encabezados', nodes:[
                {tipox:'td', className:'grilla_cont_td_home'},
                {tipox:'td', className:'grilla_cont_td_encabezados'},
            ]},
            {tipox:'tr', className:'grilla_contr_tr_datos', nodes:[
                {tipox:'td', className:'grilla_cont_td_lateral'},
                {tipox:'td', className:'grilla_cont_td_datos'},
            ]}
        ]}
    ]},
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