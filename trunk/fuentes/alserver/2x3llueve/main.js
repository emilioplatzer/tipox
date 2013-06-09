// Por $Author: emilioplatzer@gmail.com $ Revisión $Revision: 84 $ del $Date: 2013-06-08 18:15:35 -0300 (sáb 08 de jun de 2013) $
"use strict";

Aplicacion.prototype.nombreAplicacion='2×3 llueve';

Aplicacion.prototype.paginas.intr={ 
    labelMenu:'Introducción',
    nodes:["2×3 llueve es un juego didáctico que trata de emular los programas de televisión de preguntas y respuestas donde los participantes tienen que contestar primero",
        {tipox:'div', id:'resultadoModernizr'}
    ]
};

delete Aplicacion.prototype.paginas.entrar;

Aplicacion.prototype.paginas.jugar={ 
    labelMenu:'Jugar',
    nodes:[
        "este es el juego",
    ]
};

Aplicacion.prototype.sinBaseDeDatos=true;

var app=new Aplicacion();
Aplicacion.run(app);
