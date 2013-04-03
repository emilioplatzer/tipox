﻿// Por $Author$ Revisión $Revision$ del $Date$
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
        var zonas={h:{esPk:true, destino:ubicarElemento('.grilla_cont_td_home')}, e:{esPk:false, destino:ubicarElemento('.grilla_cont_td_encabezados')}};
        var campos=app.drTabla[tabla.dataset.tabla].campos;
        for(var zona in zonas){
            var celdas=[];
            for(var nombreCampo in campos){
                var defCampo=campos[nombreCampo];
                if(!!defCampo.esPk===zonas[zona].esPk){
                    celdas.push({tipox:'th', nodes:defCampo.titulo||nombreCampo});
                }
            }
            app.grab(zonas[zona].destino,{tipox:'table',className:'grilla_tabla_int', nodes:{tipox:'tr', id:tabla.id+'_tr_'+zona, nodes:celdas}});
        }
        if(opciones && opciones.probando){
            return {documento:document};
        }
    });
    return futuro;
    if(opciones && opciones.probando){
        return futuro;
    }
}

Aplicacion.prototype.creadores.grilla_boton_leer={tipo:'tipox', descripcion:'grilla funcional con ABM', creador:{
    translate:function(definicion){
        return cambiandole(definicion,{tipox:'button', innerText:'ver', title:'traer los datos de la base', eventos:{click:'grilla_ver'}});
    }
}};

Aplicacion.prototype.creadores.grilla={tipo:'tipox', descripcion:'grilla funcional con ABM', creador:{
    translate:function(definicion){
        var id=definicion.id||this.app.nuevoIdDom('tabla');
        var rta=cambiandole(definicion,{tipox:'div', className:'grilla_div', id:id, nodes:[
            {tipox:'table', id:id+'_cont', className:'grilla_cont_tabla', dataset:{tabla:definicion.tabla}, 
             ongrab:Aplicacion.prototype.eventos.grilla_preparar_contenedor,
             nodes:[
                {tipox:'caption', nodes:[{tipox:'grilla_boton_leer'}, {tipox:'span', className:'grilla_titulo_tabla', innerText:definicion.tabla}]},
                {tipox:'tr', className:'grilla_cont_tr_encabezados', nodes:[
                    {tipox:'td', className:'grilla_cont_td_home'},
                    {tipox:'td', className:'grilla_cont_td_encabezados'},
                ]},
                {tipox:'tr', className:'grilla_cont_tr_datos', nodes:[
                    {tipox:'td', id:id+'_cont_td_l', className:'grilla_cont_td_lateral'},
                    {tipox:'td', id:id+'_cont_td_d', className:'grilla_cont_td_datos'},
                ]}
            ]}
        ]});
        delete rta.tabla;
        delete rta.despliegue;
        return rta;
    }
}}

Aplicacion.prototype.eventos.grilla_ver=function(evento,elemento,opciones){
    var elementoTabla=elemento.parentNode.parentNode.parentNode.querySelectorAll('.grilla_cont_tabla')[0];
    var futuro=this.accesoDb({hacer:'select', from:elementoTabla.dataset.tabla, where:true}).luego(function(respuesta,app){
        var ubicarElemento=function(clase){
            var elementos=elementoTabla.querySelectorAll(clase);
            if(!elementos.length){
                app.lanzarExcepcion("La tabla "+elementoTabla.id+" no tiene la estructura completa (clase "+clase+")");
            }
            return elementos[0];
        }
        var zonas={h:{esPk:true, destino:ubicarElemento('.grilla_cont_td_lateral')}, e:{esPk:false, destino:ubicarElemento('.grilla_cont_td_datos')}};
        var campos=app.drTabla[elementoTabla.dataset.tabla].campos;
        for(var zona in zonas){
            var filas=[];
            for(var i_fila in respuesta) if(respuesta.hasOwnProperty(i_fila)){
                var fila=respuesta[i_fila];
                var celdas=[];
                for(var nombreCampo in campos){
                    var defCampo=campos[nombreCampo];
                    if(!!defCampo.esPk===zonas[zona].esPk){
                        celdas.push({tipox:'td', innerText:defCampo.innerText(fila[nombreCampo]), className:'tipo_'+defCampo.tipo});
                    }
                }
                filas.push({tipox:'tr', id:elementoTabla.id+'_tr_'+zona, nodes:celdas});
            }
            app.grab(zonas[zona].destino,{tipox:'table',className:'grilla_tabla_int', nodes:filas});
        }
        if(opciones && opciones.probando){
            return {documento:document};
        }
    });
    return futuro;
    if(opciones && opciones.probando){
        return futuro;
    }
}