window.addEventListener('load',function(){
    var colocador=new Colocador();
    colocador.colocar({
        destino:document.body,
        contenido:{
            tipox:'div', nodes:[
                {tipox:'div', style:{textAlign:'center'}, nodes:[
                    {tipox:'img', src:'gina.PNG', style:{'float':'left', marginRight:'10px'}},
                    {tipox:'img', src:'imagenes/torta.jpg', style:{'float':'right', marginRight:'10px'}},
                    {tipox:'h1', nodes:'Bienvenidos al cumpleaños de Gina'},
                    {tipox:'button', nodes:[{tipox:'b', nodes:'EMPEZAR AHORA'}, {tipox:'img', src:'imagenes/reloj.png'}]},
                ]},
                {tipox:'div', nodes:[
                    {tipox:'span', nodes:'presentes: '},
                    {tipox:'span', id:'presentes', nodes:'todavía nadie'}
                ]}
            ]
        },
        reemplazar:true
    });
    var mirar=function(){
        setTimeout(function(){
            enviarPaquete({
                destino:'servir.php',
                datos:{hacer:'quienes'},
                codificador:estoMismo,
                cuandoOk:function(mensaje){
                    presentes.innerText=mensaje.map(function(r){ return r.jugador;}).join(', ');
                    presentes.className='ok';
                    mirar();
                },
                cuandoFalla:function(mensaje,lugar){
                    presentes.innerText=mensaje+' ('+lugar+')';
                    presentes.className='falla';
                    mirar();
                }
            });
        },1000);
    }
    mirar();
});