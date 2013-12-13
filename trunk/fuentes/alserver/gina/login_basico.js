window.addEventListener('load',function(){
    var colocador=new Colocador();
    colocador.colocar({
        destino:document.body,
        contenido:{tipox:'form', action:'servir.php', method:'post', nodes:[
            {tipox:'table', nodes:[
                {tipox:'tr', nodes:[
                    {tipox:'td', nodes:'usuario'},
                    {tipox:'td', nodes:[{tipox:'input', name:'usuario'}]}
                ]},
                {tipox:'tr', nodes:[
                    {tipox:'td', nodes:'clave'},
                    {tipox:'td', nodes:[{tipox:'input', name:'clave', type:'password'}]}
                ]},
                {tipox:'tr', nodes:[
                    {tipox:'td', nodes:''},
                    {tipox:'td', nodes:[{tipox:'input', name:'hacer', value:'entrar', type:'submit'}]}
                ]},
            ]}
        ]}
    });
});
