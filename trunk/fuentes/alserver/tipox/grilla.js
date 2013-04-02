// Por $Author$ Revisión $Revision$ del $Date$
"use strict";

Aplicacion.prototype.eventos.grilla_preparar_contenedor=function(evento,tabla,opciones){
    var futuro=this.prepararTabla(tabla.dataset.tabla).luego(function(mensaje,app){
        var ubicarElemento=function(clase){
            var elementos=tabla.querySelectorAll(clase);
            if(!elementos.length){
                app.lanzarExcepcion("La tabla "+tabla.id+" no tiene la estructura completa (clase "+clase+")");
            }
            return elementos[0];
        }
        var home=ubicarElemento('.grilla_cont_td_home');
        var encabezado=ubicarElemento('.grilla_cont_td_encabezados');
        var tabla_interna={tipox:'table',className:'grilla_tabla_int', nodes:{tipox:'tr', id:tabla.id+'_tr_h'}};
        app.grab(home, tabla_interna);
        tabla_interna.nodes.id=tabla.id+'_tr_e';
        app.grab(encabezado,tabla_interna);
        var campos=app.drTabla[tabla.dataset.tabla].campos;
        for(var nombreCampo in campos){
            var defCampo=campos[nombreCampo];
            app.grab(tabla.id+(defCampo.esPk?'_tr_h':'_tr_e'), {tipox:'th', nodes:defCampo.titulo||nombreCampo});
        }
        if(opciones && opciones.probando){
            return {documento:document};
        }
    });
    if(opciones && opciones.probando){
        return futuro;
    }
}

Aplicacion.prototype.creadores.grilla_boton_leer={tipo:'tipox', descripcion:'grilla funcional con ABM', creador:{
    translate:function(definicion){
        return cambiandole(definicion,{tipox:'button', innerText:'ver', title:'traer los datos de la base'});
    }
}};

Aplicacion.prototype.creadores.grilla={tipo:'tipox', descripcion:'grilla funcional con ABM', creador:{
    translate:function(definicion){
        var id=definicion.id||this.app.nuevoIdDom('tabla');
        var rta=cambiandole(definicion,{tipox:'div', className:'grilla_div', id:id, nodes:[
            {tipox:'table', id:id+'_cont', className:'grilla_cont_tabla', dataset:{tabla:definicion.tabla}, 
             ongrab:Aplicacion.prototype.grilla_preparar_contenedor,
             nodes:[
                {tipox:'caption', nodes:[{tipox:'grilla_boton_leer'}, {tipox:'span', className:'grilla_titulo_tabla', innerText:definicion.tabla}]},
                {tipox:'tr', className:'grilla_cont_tr_encabezados', nodes:[
                    {tipox:'td', className:'grilla_cont_td_home'},
                    {tipox:'td', className:'grilla_cont_td_encabezados'},
                ]},
                {tipox:'tr', className:'grilla_cont_tr_datos', nodes:[
                    {tipox:'td', className:'grilla_cont_td_lateral'},
                    {tipox:'td', className:'grilla_cont_td_datos'},
                ]}
            ]}
        ]});
        delete rta.tabla;
        delete rta.despliegue;
        return rta;
    }
}}
