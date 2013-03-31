// Por $Author$ Revisión $Revision$ del $Date$

Aplicacion.prototype.grilla_preparar_contenedor=function(idTabla){
    var elementos=document.querySelectorAll('.grilla_cont_td_home');
    if(!elementos){
        alert('no está el home en la grilla 1');
    }else if(!elementos.length){
        alert('no está el home en la grilla 2');
    }else{
        elementos[0].innerText='home';
    }
}

Aplicacion.prototype.creadores.grilla_boton_leer={tipo:'tipox', descripcion:'grilla funcional con ABM', creador:{
    translate:function(definicion){
        return cambiandole(definicion,{tipox:'span', title:'no implementado aún', innerText:'N/I/A'});
    }
}};

Aplicacion.prototype.creadores.grilla={tipo:'tipox', descripcion:'grilla funcional con ABM', creador:{
    translate:function(definicion){
        var rta=cambiandole(definicion,{tipox:'div', className:'grilla_div', nodes:[
            {tipox:'table', className:'grilla_cont_tabla', dataset:{tabla:definicion.tabla}, nodes:[
                {tipox:'caption', nodes:[{tipox:'grilla_boton_leer'}, {tipox:'span', className:'grilla_titulo_tabla', innerText:definicion.tabla}]},
                {tipox:'tr', className:'grilla_contr_tr_encabezados', nodes:[
                    {tipox:'td', className:'grilla_cont_td_home'},
                    {tipox:'td', className:'grilla_cont_td_encabezados'},
                ]},
                {tipox:'tr', className:'grilla_contr_tr_datos', nodes:[
                    {tipox:'td', className:'grilla_cont_td_lateral'},
                    {tipox:'td', className:'grilla_cont_td_datos'},
                ]}
            ]}
        ], ongrab:Aplicacion.prototype.grilla_preparar_contenedor
        });
        delete rta.tabla;
        delete rta.despliegue;
        return rta;
    }
}}
