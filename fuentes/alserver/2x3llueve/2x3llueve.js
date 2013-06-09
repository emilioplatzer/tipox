
var estructura=
	{ panel_izq1:      {className:'zona', conDivRotado:{orientacion:'i', tamannio:16}}
	, panel_izq2:      {className:'zona', conDivRotado:{orientacion:'i', tamannio:16}}
	, panel_izq_puntos:{className:'zona', conDivRotado:{orientacion:'i', tamannio:10}}
	, panel_izq_cuenta:{className:'zona', conDivRotado:{orientacion:'i', tamannio:28}}
	, panel_der1:      {className:'zona', conDivRotado:{orientacion:'d', tamannio:16}}
	, panel_der2:      {className:'zona', conDivRotado:{orientacion:'d', tamannio:16}}
	, panel_der_puntos:{className:'zona', conDivRotado:{orientacion:'d', tamannio:10}}
	, panel_der_cuenta:{className:'zona', conDivRotado:{orientacion:'d', tamannio:28}}
	, conCanvas: function(miembro, className){
		"use strict";
		var canvas=document.createElement('canvas');
		canvas.className=className;
		this[miembro].elemento.appendChild(canvas);
		this[miembro].canvas=canvas;
		canvas.style.width=this[miembro].elemento.clientWidth-11+'px';
		canvas.style.height=this[miembro].elemento.clientHeight-11+'px';
	  }
	, conSVG: function(miembro, orientacion){
		"use strict";
		var recta=orientacion=='i'?"<path id='recta_i' d='M20 20 L 20 80'>":"<path id='recta_d' d='M80 80 L 80 20'>";
		this[miembro].elemento.innerHTML="<svg className=panel viewBox='0 0 100 100'><defs>"+recta+"</defs><text><textPath xlink:href='#recta_"+orientacion+"'>36</textPath></text></svg>";
		this[miembro].contenido=this[miembro].elemento.childNodes[0].childNodes[1].childNodes[0];
	  }
	, conDivRotado: function(miembro, params){
		"use strict";
		var div_rotado=document.createElement('div');
		var div_interno=document.createElement('div');
		div_rotado.className='panel rotacion_'+params.orientacion;
		// div.innerText='36%';
		div_interno.className='contenido';
		params.tamannio*=4;
		div_interno.innerText=params.tamannio+'%'; 
		div_interno.style.fontSize=params.tamannio+'px';
		div_interno.style.height=params.tamannio+'px';
		div_interno.style.marginTop=-(params.tamannio/2)+'px';
		div_rotado.appendChild(div_interno);
		this[miembro].elemento.appendChild(div_rotado);
		this[miembro].div=div_interno;
	  }
	}

var juego=
	{ puntos:
	  { izquierda: 0
	  , derecha: 0
	  }
	, modo_izq: 'tablas'
	, ronda:0
	, estado: 'intervalo'
	, mostrar_puntos_1:function(elemento,mis_puntos,tus_puntos){
		"use strict";
		var leyenda="⇩ "+mis_puntos+" ⇧ "+tus_puntos;
		elemento.innerText=leyenda;
	  }
	, mostrar_puntos:function(){
		"use strict";
		this.mostrar_puntos_1(estructura.panel_izq_puntos.div,juego.puntos.izquierda, juego.puntos.derecha);
		this.mostrar_puntos_1(estructura.panel_der_puntos.div,juego.puntos.derecha, juego.puntos.izquierda);
	  }
	, blanquear:function(){
		"use strict";
		for(var miembro in estructura){ if(estructura.hasOwnProperty(miembro)){
			var div_interno=estructura[miembro].div;
			if(div_interno){
				div_interno.innerText='';
				div_interno.style.backgroundColor='inherit';
			}
			var elemento=estructura[miembro].elemento;
			if(elemento){
				elemento.style.backgroundColor='inherit';
				elemento.style.borderColor='';
				elemento.style.color='inherit';
			}
		}}
		this.mostrar_puntos();
	  }
	, reiniciar:function(){
		"use strict";
		alert(window.innerWidth+"x"+window.innerHeight);
		estructura.esperando=document.getElementById('esperando');
		this.blanquear();
		this.lanzar_mano();
	  }
	, lanzar_mano:function(){
		estructura.esperando.style.visibility='visible';
		this.estado='esperando';
		this.blanquear();
		this.timer=setTimeout('juego.mostrar_cuenta();',2000);
	  }
	, digito_al_azar:function(){
		"use strict";
		var op=Math.floor(Math.random()*10);
		if(op>5){ return op; }
		op=Math.floor(Math.random()*10);
		if(op>2){ return op; }
		op=Math.floor(Math.random()*11);
		return op; 
	  }
	, elegir_resultado_incorrecto:function(){
		"use strict";
		var resultado_incorrecto=this.resultado_correcto;
		while(resultado_incorrecto==this.resultado_correcto || resultado_incorrecto<0 || resultado_incorrecto>100){
			switch(Math.floor(Math.random()*7)){
				case 0: 
				case 1:
				case 2: resultado_incorrecto=(this.op1+Math.floor(Math.random()*3-1))*(this.op2+Math.floor(Math.random()*3-1)); break;
				case 3: 
				case 4: resultado_incorrecto=(this.digito_al_azar())*(this.digito_al_azar()); break;
				case 5: resultado_incorrecto=(this.resultado_correcto%10*10)+Math.floor(this.resultado_correcto/10); break;
				case 6: resultado_incorrecto=this.resultado_correcto+Math.floor(Math.random()*3-1)*10+Math.floor(Math.random()*5-2); break;
			}
		}
		return resultado_incorrecto;
	  }
	, marcar_resultado:function(color, delta_puntos,elemento){
		"use strict";
		var jugador=elemento.getAttribute('jugador');
		if(juego.estado=='jugando'){
			elemento.style.backgroundColor=color;
			juego.estado='mostrando';
			juego.puntos[jugador]=juego.puntos[jugador]+delta_puntos;
			if(juego.puntos[jugador]<0){
				juego.puntos[jugador]=0;
			}
			this.mostrar_puntos();
			this.fin_mano();
		}else if(juego.estado=='mostrando'){
			elemento.style.backgroundColor=color;
			elemento.style.backgroundColor='yellow';
			elemento.style.borderColor=color;
			elemento.style.color=color;
		}
	  }
	, marcar_gano:function(){
		"use strict";
		juego.marcar_resultado('GreenYellow',+1,this);
	  }
	, marcar_perdio:function(){
		"use strict";
		juego.marcar_resultado('OrangeRed',-1,this);
	  }
	, poner_opciones:function(un_panel, otro_panel, jugador){
		"use strict";
		if(Math.random()<0.5){
			var x=otro_panel;
			otro_panel=un_panel;
			un_panel=x;
		}
		un_panel.elemento.setAttribute('jugador',jugador);
		otro_panel.elemento.setAttribute('jugador',jugador);
		// var nombre_evento='onmousedown';
		var isiPad = navigator.userAgent.match(/iPad/i) != null;
		var nombre_evento=isiPad?'ontouchstart':'onmousedown';
		if(this.otro_resultado_incorrecto){
			un_panel.div.innerText=this.otro_resultado_incorrecto;
			un_panel.elemento[nombre_evento]=this.marcar_perdio;
		}else{
			un_panel.div.innerText=this.resultado_correcto;
			un_panel.elemento[nombre_evento]=this.marcar_gano;
		}
		otro_panel.div.innerText=this.resultado_incorrecto;
		otro_panel.elemento[nombre_evento]=this.marcar_perdio;
	  }
	, mostrar_cuenta:function(){
		"use strict";
		estructura.esperando.style.visibility='hidden';
		this.op1=this.digito_al_azar();
		this.op2=this.digito_al_azar();
		this.cuenta=this.op1+'×'+this.op2;
		this.resultado_correcto=this.op1*this.op2;
		this.ronda++;
		estructura.panel_der_cuenta.div.innerText=this.cuenta;
		this.resultado_incorrecto=this.elegir_resultado_incorrecto();
		if(Math.random()>0.75){
			this.otro_resultado_incorrecto=this.elegir_resultado_incorrecto();
			if(this.otro_resultado_incorrecto==this.resultado_incorrecto){
				this.otro_resultado_incorrecto=null;
				this.restar_en_timeout=1;
			}else{
				this.restar_en_timeout=0;
			}
		}else{
			this.otro_resultado_incorrecto=null;
			this.restar_en_timeout=1;
		}
		this.poner_opciones(estructura.panel_der1,estructura.panel_der2,"derecha");
		juego.resultado_der_HTML="<span class=resultado>"+estructura.panel_der_cuenta.div.innerHTML+"="+this.resultado_correcto+"</span>";
		if(juego.modo_izq=='tablas'){
			estructura.panel_izq_cuenta.div.innerHTML=this.cuenta;
			this.poner_opciones(estructura.panel_izq1,estructura.panel_izq2,"izquierda");
			juego.resultado_izq_HTML="<span class=resultado>"+estructura.panel_izq_cuenta.div.innerHTML+"="+this.resultado_correcto+"</span>";
		}
		this.resultado_correcto=Math.floor(Math.random()*10)+1;
		this.cuenta=" <img src='nums/nubes_"+this.resultado_correcto+".png' style='z-index:100'> ";
		this.resultado_incorrecto=Math.floor(Math.random()*9)+1;
		if(this.resultado_incorrecto>=this.resultado_correcto){
			this.resultado_incorrecto++;
		}
		this.otro_resultado_incorrecto=null;
		if(juego.modo_izq!='tablas'){
			estructura.panel_izq_cuenta.div.innerHTML=this.cuenta;
			this.poner_opciones(estructura.panel_izq1,estructura.panel_izq2,"izquierda");
			juego.resultado_izq_HTML="<span class=resultado>"+estructura.panel_izq_cuenta.div.innerHTML+"="+this.resultado_correcto+"</span>";
		}
		this.estado='jugando';
		this.timer=setTimeout('juego.fin_mano()',6000);
	  }
	, cambiar_modo_izq:function(){
		if(this.modo_izq=='tablas'){
			estructura.esperando.src='contarNubes.png';
			this.modo_izq='contar';
		}else{
			estructura.esperando.src='2x3llueve.png';
			this.modo_izq='tablas';
		}
	  }
	, fin_mano:function(){
		"use strict";
		clearTimeout(this.timer);
		if(this.estado=='jugando'){
			juego.puntos.derecha-=this.restar_en_timeout;
			if(juego.puntos.derecha<0){
				juego.puntos.derecha=0;
			}
			juego.puntos.izquierda-=this.restar_en_timeout;
			if(juego.puntos.izquierda<0){
				juego.puntos.izquierda=0;
			}
			this.mostrar_puntos();
		}
		this.estado='mostrando';
		this.timer=setTimeout('juego.lanzar_mano()',3000);
		estructura.panel_izq_cuenta.div.innerHTML=juego.resultado_izq_HTML;
		estructura.panel_der_cuenta.div.innerHTML=juego.resultado_der_HTML;
	  }
	}
