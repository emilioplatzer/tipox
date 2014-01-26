"use strict";

window.addEventListener('load',function(){
    var colocador=new Colocador();
    colocador.colocar({
        destino:document.body,
        contenido:{
            tipox:'div', nodes:[
                {tipox:'div', style:{textAlign:'center'}, nodes:[
                    {tipox:'img', src:'imagenes/santa.jpg', style:{'float':'left', marginRight:'10px'}},
                    {tipox:'a', href:'podio.php', nodes:[
                        {tipox:'img', src:'imagenes/arbol.gif', style:{'float':'right', marginRight:'10px'}}
                    ]},
                    {tipox:'h1', id:'titulo', nodes:'Bienvenidos los juegos de Navidad'},
                    {tipox:'button', eventos:{click:continuar_juego}, nodes:[ 
                        {tipox:'img', id:'imagen_boton', src:'imagenes/reloj.png'}, 
                        {tipox:'b', id:'texto_boton', nodes:'EMPEZAR AHORA'}
                    ]},
                ]},
                {tipox:'div', nodes:[
                    {tipox:'br'},
                    {tipox:'span', id:'label_jugadores', nodes:'presentes: '},
                    {tipox:'span', id:'jugadores', nodes:'calculando...'}
                ]},
                {tipox:'div', id:'juego'}
            ]
        },
        reemplazar:true
    });
    mirar_estado_juego(500);
});

var mensaje_anterior="no hay";

function mirar_estado_juego(en_cuanto){
    setTimeout(function(){
        enviarPaquete({
            destino:'servir.php',
            datos:{hacer:'quienes'},
            codificador:estoMismo,
            cuandoOk:function(mensaje){
                var json_mensaje=JSON.stringify(mensaje);
                if(json_mensaje!=mensaje_anterior){
                    var mensaje_anterior=json_mensaje;
                    var colocador=new Colocador();
                    colocador.colocar({
                        destino:jugadores,
                        reemplazar:true,
                        contenido:[/*{tipox:'span', className:'cantidad_jugadores', 
                            nodes:mensaje.jugadores.length
                        }*/].concat(
                            mensaje.jugadores.map(function(r){ 
                                // return {tipox:'span', nodes:r.jugador, className:mensaje.datos.estado<>2 || r.jugada<>mensaje.datos.correcta?'':'acerto'};
                                return {
                                    tipox:'span', 
                                    nodes:[
                                        r.jugador, 
                                        { tipox:'span', 
                                            className:'que_jugo', 
                                            nodes:mensaje.datos.estado==2?r.jugada||'X':'',
                                            dataset:{jugador:r.jugador},
                                            eventos:{click:inactivar_jugador}
                                        }
                                    ],
                                    className:'jugador'+
                                        (mensaje.datos.estado==2?(r.jugada==mensaje.datos.correcta?' acerto':(r.jugada?' erro':'')):
                                            (mensaje.datos.estado==1?(r.activo==1?(r.jugada?'':' falta'):' inactivo'):'')
                                        )+
                                        (mensaje.empezado=='no' && r.terminal>mensaje.nuevos_desde?' nuevo':''),
                                    title:(mensaje.datos.estado==2?r.jugada:'')
                                };
                            })
                        )
                    });
                    if(mensaje.empezado=='si'){
                        label_jugadores.innerText='jugaron: ';
                        titulo.innerText='Jugando en Navidad';
                        var jugando=mensaje.datos.estado==1;
                        if(jugando){
                            texto_boton.innerText='PARAR';
                            imagen_boton.src='imagenes/reloj2.png';
                        }else{
                            texto_boton.innerText='SEGUIR';
                            imagen_boton.src='imagenes/parar.png';
                        }
                        colocador.colocar({
                            destino:juego,
                            contenido:[
                                {tipox:'img', src:'imagenes/'+(jugando?mensaje.datos.imagen:mensaje.datos.imagenok), className:'ilustracion_principal'}, 
                                {tipox:'div', className:'pregunta', nodes:[
                                    {tipox:'span', className:'numero_pregunta', nodes:mensaje.datos.juego+': '},
                                    mensaje.datos.descripcion
                                ]},
                                {tipox:'div', nodes:mensaje.opciones.map(function(r){
                                    return {
                                        tipox:'div', 
                                        className:'opcion'+(!jugando && r.opcion==mensaje.datos.correcta?' correcta':(mensaje.datos.estado==2?' incorrecta':'')), 
                                        nodes:[
                                            {tipox:'span', className:'numero_opcion', nodes:r.opcion+': '}, 
                                            r.texto, 
                                            {tipox:'span', className:'cuantos', nodes:(mensaje.datos.estado==2?r.cuantos:'')}
                                        ]
                                        , title:(mensaje.datos.estado==2?r.quienes:'')
                                    }
                                })},
                                {tipox:'div', nodes:(mensaje.datos.estado==2?mensaje.datos.descripcionrta:''), className:'aclaracion'}
                            ],
                            reemplazar:true
                        });
                    }else{
                    }
                }
                mirar_estado_juego();
            },
            cuandoFalla:function(mensaje,lugar){
                jugadores.innerText=mensaje+' ('+lugar+')';
                jugadores.className='falla';
                mirar_estado_juego();
            }
        });
    },en_cuanto||1000);
}

function continuar_juego(evento){
    enviarPaquete({
        destino:'servir.php',
        datos:{ hacer:'avanzar_juego'},
        codificador:estoMismo,
        cuandoOk:function(){
            // mirar_estado_juego(500);
        },
        cuandoFalla:function(mensaje){
            this.title=mensaje;
        }
    });
}

function inactivar_jugador(){
    enviarPaquete({
        destino:'servir.php',
        datos:{ hacer:'inactivar_jugador', jugador:this.dataset.jugador},
        codificador:estoMismo,
        cuandoOk:function(){
        },
        cuandoFalla:function(mensaje){
            this.title=mensaje;
        }
    });
    sacar=this.parentNode;
    sacar.parentNode.removeChild(sacar);
}