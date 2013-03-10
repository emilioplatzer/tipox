// Por $Author Revisión $Revision del $Date

Aplicacion.prototype.paginas={
    'default':[
        {tipox:'h1', innerText:'Primer página de Ejemplo'},
        {tipox:'tipox_logo'},
        " quiere ser un framework para experimentar código hecho en su mayoría con JavaScript. "+
            "La idea es experimentar también con otras ideas como mantener el estado en la barra de direcciones.",
        {tipox:'footer', nodes:[ 'se puede ver un ejemplo de primer vínculo ', {tipox:'app_vinculo', innerText:'acá', destino:'about'}]},
    ],
    'about':[
        {tipox:'h1', nodes:['About ',{tipox:'tipox_logo'}]},
        {tipox:'p', nodes:[
            "code ", {tipox:'a', href:'https://code.google.com/p/tipox', innerText:'code.google.com/p/tipox'}
        ]}
    ]
}

Aplicacion.run(new Aplicacion());
