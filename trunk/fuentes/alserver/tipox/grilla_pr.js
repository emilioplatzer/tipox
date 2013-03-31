// Por $Author$ Revisión $Revision$ del $Date$

Aplicacion.prototype.casosDePrueba.push({
    modulo:'grillas',
    funcion:'pruebaTraduccion',
    caso:'grilla simple basada en tabla',
    entrada:[{tipox:'grilla', tabla:'prueba_tabla_comun'}],
    salida:{tipox:'div', id:'id1', className:'grilla_div', nodes:[
        {tipox:'table', className:'grilla_tabla', dataset:{tabla:'prueba_tabla_comun'}, nodes:[
            {tipox:'caption', nodes:[{tipox:'grilla_boton_leer'}, {tipox:'grilla_titulo_tabla', innerText:"prueba_tabla_comun"}]},
            {tipox:'thead', nodes:[
                {tipox:'tr', nodes:[
                    {tipox:'th', nodes:"id"},
                    {tipox:'th', nodes:"nombre"},
                    {tipox:'th', nodes:"importe"},
                    {tipox:'th', nodes:{"tipox":"span", "nodes":["A",{"tipox":"small", "innerText":"ctv"}]}},
                    {tipox:'th', nodes:"cantidad"},
                    {tipox:'th', nodes:"fecha"},
                ]}
            ]}
        ]}
    ]},
});

