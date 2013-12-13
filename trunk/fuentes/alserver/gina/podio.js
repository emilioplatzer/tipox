window.addEventListener('load',function(){
    var colocador=new Colocador();
    colocador.colocar({
        destino:document.body,
        contenido:{tipox:'div', nodes:[
            {tipox:'div', className:'ala_izquierda', nodes:[
                {tipox:'table', className:'tabla_podio', nodes:[
                    {tipox:'tr', nodes:[
                        {tipox:'td', className:'podio_nombres', nodes:'Miranda', id:'quienes2', rowSpan:2},
                        {tipox:'td', className:'podio_nombres', nodes:'Gina', id:'quienes1'},
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
            {tipox:'div', className:'ala_derecha', id:'ganadores', nodes:[
            ]}
        ]},
        reemplazar:true
    });
    mirar_estado_juego(500);
});

function mirar_estado_juego(en_cuanto){
    setTimeout(function(){
        enviarPaquete({
            destino:'servir.php',
            datos:{hacer:'podio'},
            codificador:estoMismo,
            cuandoOk:function(mensaje){
                var colocador=new Colocador();
                colocador.colocar({
                    destino:ganadores,
                    reemplazar:true,
                    contenido:{tipox:'table', nodes:
                        mensaje.jugadores.map(function(r){ 
                            // return {tipox:'span', nodes:r.jugador, className:mensaje.datos.estado<>2 || r.jugada<>mensaje.datos.correcta?'':'acerto'};
                            return {tipox:'tr', nodes:[
                                {tipox:'td', nodes:r.posicion},
                                {tipox:'td', nodes:r.jugador},
                                {tipox:'td', nodes:r.aciertos}
                            ]};
                        })
                    }
                });
                mirar_estado_juego();
            },
            cuandoFalla:function(mensaje,lugar){
                ganadores.innerText=mensaje+' ('+lugar+')';
                ganadores.className='falla';
                mirar_estado_juego();
            }
        });
    },en_cuanto||1000);
}

