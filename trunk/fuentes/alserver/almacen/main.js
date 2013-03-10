// Por $Author $ Revisión $Revision $ del $Date $
"use strict";

Aplicacion.prototype.paginas={tipox:"app_alternativas", 
    'default':[
        {tipox:'app_menu_principal', elementos:{intr:'Introducción', entrar:'Entrar', info:'Info/ayuda'}},
        {tipox:'app_alternativas',
            intr:["Este es el armario virtual de ", "FULANO DE TAL", ". Acá subimos la información para que otros la bajen. Las ",
                {tipox: 'b', innerText: 'ventajas'}, ' son ',
                {tipox: 'lista', tagList:'ol', tagElement:'li', elementos:[
                  "De este modo no le llenamos la casilla de correo al destinatario que no ocupa lugar en su cuenta ni en su PC hasta que no decide bajar el archivo. ",
                  "En el caso de múltiples destinos el archivo se sube una sola vez",
                  'El archivo se puede "retirar" si el destinatario no lo bajó todavía'
                  ]}
            ],
            entrar:["Pantalla de entrada"]
        }
    ],
    'about':[
        {tipox:'h1', nodes:['About ',{tipox:'tipox_logo'}]},
        {tipox:'p', nodes:[
            "code ", {tipox:'a', href:'https://code.google.com/p/tipox', innerText:'code.google.com/p/tipox'}
        ]}
    ]
}

Aplicacion.run(new Aplicacion());
