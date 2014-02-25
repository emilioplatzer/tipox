"use strict";
// <script src="js/h5utils.js"></script></head>
// <section id="wrapper">
// <div id="carbonads-container"><div class="carbonad"><div id="azcarbon"></div><script type="text/javascript">var z = document.createElement("script"); z.type = "text/javascript"; z.async = true; z.src = "http://engine.carbonads.com/z/14060/azcarbon_2_1_0_VERT"; var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(z, s);</script></div></div>
// <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>

function doscifras(x){
    if(x.length<2){
        return '0'+x;
    }
    return x;
}

var dondetedeje_campos={
    timestamp       :{tipo:'timestamp'},
    accuracy        :{                },
    altitude        :{                },
    altitudeAccuracy:{                },
    heading         :{                },
    latitude        :{tipo:'numerico' },
    longitude       :{tipo:'numerico' },
    speed           :{                },
    momento         :{tipo:'fecha'    ,editable:true},
    numero          :{tipo:'entero'   ,editable:true},
    activo          :{tipo:'bool'     ,editable:true},
    texto           :{tipo:'texto'    ,editable:true}
}

function success(position) {
    fin_carga();
    var posiciones=JSON.parse(localStorage['lasposiciones']||'[]');
    var ahora=new Date();
    var nuevo_registro={};
    for(var n_campo in dondetedeje_campos){
        if(n_campo=='timestamp'){
            nuevo_registro.timestamp=position.timestamp;
        }else if(n_campo in position.coords){
            nuevo_registro[n_campo]=position.coords[n_campo];
        }else{
            nuevo_registro[n_campo]=null;
        }
    }
    posiciones.push(nuevo_registro);
    localStorage.setItem('lasposiciones',JSON.stringify(posiciones));
    incidente('registrada la posición actual '+ahora.getHours()+':'+doscifras(ahora.getMinutes()),true);
}

function mostrar(){
  var mapcanvas = document.createElement('div');
  mapcanvas.id = 'mapcanvas';
  mapcanvas.style.height = '400px';
  mapcanvas.style.width = '560px';
  document.querySelector('article').appendChild(mapcanvas);
  var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  var myOptions = {
    zoom: 15,
    center: latlng,
    mapTypeControl: false,
    navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);
  var marker = new google.maps.Marker({
      position: latlng, 
      map: map, 
      title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
  });
}

function ProveedorDondeTeDeje(){
    this.traerDatos=function(params){
        try{
            var datos={
                campos:dondetedeje_campos,
                titulo:"Puntos registrados",
                filas:JSON.parse(localStorage['lasposiciones']||'[]')
            }
            params.cuandoOk(datos);
        }catch(err){
            params.cuandoFalla(err);
        }
    }
}

function fin_carga(){
    if(document.getElementById('incidentes')){
        return;
    }
    document.body.innerHTML='';
    var incidentes=document.createElement('div');
    incidentes.id='incidentes';
    document.body.appendChild(incidentes);
    var resultado=document.createElement('div');
    resultado.id='resultado';
    document.body.appendChild(resultado);
    var grilla=new Grilla2();
    grilla.proveedor=new ProveedorDondeTeDeje();
    grilla.colocarRepositorio();
    grilla.obtenerDatos();
}

function incidente(msg,normal){
    fin_carga()
    var s = document.getElementById('incidentes');
    var i=document.createElement('div');
    i.textContent=(!normal?'ERROR ':'')+(!msg?'':(msg.message?msg.message:''+msg));
    s.appendChild(i);
}

var registro_hash={
    actual:{
        nombre:'agregar posición actual',
        funcion:function(){
            navigator.geolocation.getCurrentPosition(success, incidente);
        }
    }
}

function boton_hash(hash){
    var proceso=registro_hash[hash];
    var nuevo_boton=document.createElement('button');
    nuevo_boton.textContent=proceso.nombre;
    nuevo_boton.onclick=function(){
        location.hash='#!'+hash;
    }
    return nuevo_boton
}

if(navigator.geolocation){
    fin_carga();
    resultado.appendChild(boton_hash('actual'));
}else{
    incidente('no se encuentra el soporte de geolocalización');
}

function hacer_segun_hash(){
    if(location.hash.substr(0,2)=='#!'){
        var nuevoHash=location.hash.substr(2);
        if(registro_hash[nuevoHash]){
            registro_hash[nuevoHash].funcion();
        }
    }
}

window.addEventListener('hashchange',hacer_segun_hash);
window.addEventListener('load',hacer_segun_hash);