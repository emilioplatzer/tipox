window.addEventListener('load',function(){
    var colocador=new Colocador();
    colocador.colocar({
        destino:document.body,
        contenido:{tipox:'div', nodes:[
            {tipox:'div', className:'ala_izquierda', nodes:[
                {tipox:'table', className:'tabla_podio', nodes:[
                    {tipox:'tr', nodes:[
                        {tipox:'td', className:'podio_nombres', nodes:'', id:'quienes2', rowSpan:2},
                        {tipox:'td', className:'podio_nombres', nodes:'', id:'quienes1'},
                        {tipox:'td', className:'podio_nombres', nodes:'', id:'quienes3', rowSpan:3}
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
                    contenido:{tipox:'table', className:'ganadores', nodes:
                        [{tipox:'tr', nodes:[
                            {tipox:'th', nodes:'pos'},
                            {tipox:'th', nodes:'jugador'},
                            {tipox:'th', nodes:'puntos'}
                        ]}].concat(
                        mensaje.jugadores.map(function(r){ 
                            // return {tipox:'span', nodes:r.jugador, className:mensaje.datos.estado<>2 || r.jugada<>mensaje.datos.correcta?'':'acerto'};
                            return {tipox:'tr', nodes:[
                                {tipox:'td', nodes:r.posicion},
                                {tipox:'td', nodes:r.jugador},
                                {tipox:'td', nodes:r.aciertos}
                            ]};
                        }))
                    }
                });
                var posicion=0;
                var puntos=0;
                for(var i=0; i<mensaje.jugadores.length; i++){
                    var jugador=mensaje.jugadores[i];
                    if(jugador.aciertos!=puntos){
                        puntos=jugador.aciertos;
                        posicion++;
                        if(posicion>3){
                            break;
                        }
                    }
                    var donde_poner_el_nombre=document.getElementById('quienes'+posicion);
                    donde_poner_el_nombre.innerText+=' '+jugador.jugador;
                }
                // mirar_estado_juego();
            },
            cuandoFalla:function(mensaje,lugar){
                ganadores.innerText=mensaje+' ('+lugar+')';
                ganadores.className='falla';
                // mirar_estado_juego();
            }
        });
    },en_cuanto||1000);
}

