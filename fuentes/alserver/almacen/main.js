// Por $Author$ Revisión $Revision$ del $Date$
"use strict";
var antes={tipox:"app_alternativa", 'default':'menu', id:'alfa', 
    'menu':[
        {tipox:'app_menu_principal', 'for':'menu', elementos:{intr:'Introducción', entrar:'Entrar', info:[{tipox:'span', className:'i_logo', innerText:'i'}]}},
        {tipox:'section', className:'div_aplicacion', nodes:[
            {tipox:'app_alternativa', 'default':'intr', id:'menu', 
                intr:["Este es el armario virtual de ", "FULANO DE TAL", ". Acá subimos la información para que otros la bajen. Las ",
                    {tipox: 'b', innerText: 'ventajas'}, ' son ',
                    {tipox: 'lista', tagList:'ol', tagElement:'li', elementos:[
                      "De este modo no le llenamos la casilla de correo al destinatario que no ocupa lugar en su cuenta ni en su PC hasta que no decide bajar el archivo. ",
                      "En el caso de múltiples destinos el archivo se sube una sola vez",
                      "El sistema informa si el archivo fue bajado o no por el destinatario",
                      'El archivo se puede "retirar" si el destinatario no lo bajó todavía'
                      ]}
                ],
                entrar:[
                    {tipox:'h2', innerText:"Entrada"},
                    {tipox:'formulario_simple', nodes:[
                        {tipox:'parametro', id:'usuario', aclaracion:'probablemente el mail donde recibió el aviso'},
                        {tipox:'parametro', id:'contraseña', type:'password'},
                        {tipox:'parametro_boton', id:'entrar'}
                    ]}
                ]
            }]
        }
    ],
    'about':[
        {tipox:'h1', nodes:['About ',{tipox:'tipox_logo'}]},
        {tipox:'p', nodes:[
            "code ", {tipox:'a', href:'https://code.google.com/p/tipox', innerText:'code.google.com/p/tipox'}
        ]}
    ]
}

Aplicacion.prototype.paginasSinUsuario={tipox:'aplicacion', id:'menu', paginas:{
    intr:{ 
        labelMenu:'Introducción',
        nodes:["Este es el armario virtual de ", "FULANO DE TAL", ". Acá subimos la información para que otros la bajen. Las ",
            {tipox: 'b', innerText: 'ventajas'}, ' son ',
            {tipox: 'lista', tagList:'ol', tagElement:'li', elementos:[
              "De este modo no le llenamos la casilla de correo al destinatario que no ocupa lugar en su cuenta ni en su PC hasta que no decide bajar el archivo. ",
              "En el caso de múltiples destinos el archivo se sube una sola vez",
              "El sistema informa si el archivo fue bajado o no por el destinatario",
              'El archivo se puede "retirar" si el destinatario no lo bajó todavía'
              ]}
        ]
    },
    entrar:{
        labelMenu:'entrar',
        nodes:[
            {tipox:'h2', innerText:"Entrada"},
            {tipox:'formulario_simple', nodes:[
                {tipox:'parametro', id:'usuario', aclaracion:'probablemente el mail donde recibió el aviso'},
                {tipox:'parametro', id:'contraseña', type:'password'},
                {tipox:'parametro_boton', id:'entrar'}
            ]}
        ]
    },
    info:{
        labelMenu:[{tipox:'span', className:'i_logo', innerText:'i'}],
        nodes:[
            {tipox:'p', nodes:['Especificaciones técnicas ']},
            {tipox:'p', nodes:['framework: ',{tipox:'tipox_logo'}]},
            {tipox:'p', nodes:[
                "fuentes: ", {tipox:'a', href:'https://code.google.com/p/tipox', innerText:'code.google.com/p/tipox'}
            ]}
        ]
    }}
}

Aplicacion.prototype.paginas={};

Aplicacion.run(new Aplicacion());
