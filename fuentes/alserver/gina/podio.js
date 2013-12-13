window.addEventListener('load',function(){
    var colocador=new Colocador();
    colocador.colocar({
        destino:document.body,
        contenido:{tipox:'div', nodes:[
            {tipox:'div', className:'ala_izquierda', nodes:[
                {tipox:'table', className:'tabla_podio', nodes:[
                    {tipox:'tr', nodes:[
                        {tipox:'td', className:'podio_nombres', nodes:'Gina', id:'quienes2', rowSpan:2},
                        {tipox:'td', className:'podio_nombres', nodes:'Miranda', id:'quienes1'},
                        {tipox:'td', className:'podio_nombres', nodes:'Martina Joaquina Babina', id:'quienes3', rowSpan:3}
                    ]},
                    {tipox:'tr', nodes:[
                        {tipox:'td', className:'podio_numeros', nodes:"1"},
                    ]},
                    {tipox:'tr', nodes:[
                        {tipox:'td', className:'podio_numeros', nodes:"2"},
                        {tipox:'td', className:'podio_numeros', nodes:"", rowSpan:2},
                    ]},
                    {tipox:'tr', nodes:[
                        {tipox:'td', className:'podio_numeros', nodes:""},
                        {tipox:'td', className:'podio_numeros', nodes:"3"},
                    ]},
                ]}
            ]},
            {tipox:'div', className:'ala_derecha', nodes:[
            ]}
        ]},
        reemplazar:true
    });
    // mirar_estado_juego(500);
});

function mirar_estado_juego(en_cuanto){
    setTimeout(function(){
        enviarPaquete({
            destino:'servir.php',
            datos:{hacer:'quienes'},
            codificador:estoMismo,
            cuandoOk:function(mensaje){
                var colocador=new Colocador();
                colocador.colocar({
                    destino:jugadores,
                    reemplazar:true,
                    contenido:mensaje.jugadores.map(function(r){ 
                        // return {tipox:'span', nodes:r.jugador, className:mensaje.datos.estado<>2 || r.jugada<>mensaje.datos.correcta?'':'acerto'};
                        return {
                            tipox:'span', 
                            nodes:r.jugador, 
                            className:'jugador'+(mensaje.datos.estado!=2 || r.jugada!=mensaje.datos.correcta?'':' acerto'),
                            title:(mensaje.datos.estado==2?r.jugada:'')
                        };
                    })
                });
                if(mensaje.empezado=='si'){
                    label_jugadores.innerText='jugaron: ';
                    titulo.innerText='Jugando en el cumple de Gina';
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
                                    className:'opcion'+(!jugando && r.opcion==mensaje.datos.correcta?' correcta':''), 
                                    nodes:[
                                        {tipox:'span', className:'numero_opcion', nodes:r.opcion+': '}, 
                                        r.texto, 
                                        {tipox:'span', className:'cuantos', nodes:(mensaje.datos.estado==2?r.cuantos:'')}
                                    ]
                                    , title:(mensaje.datos.estado==2?r.quienes:'')
                                }
                            })}
                        ],
                        reemplazar:true
                    });
                }else{
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
        cuandoFalla:function(){
            // mirar_estado_juego(500);
        }
    });
}