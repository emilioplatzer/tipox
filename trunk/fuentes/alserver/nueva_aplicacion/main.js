// Por $Author: emilioplatzer@gmail.com $ Revisión $Revision: 23 $ del $Date: 2013-03-18 01:49:46 -0300 (lun 18 de mar de 2013) $
"use strict";

Aplicacion.prototype.paginas.intr={ 
        labelMenu:'Introducción',
        nodes:["Para hacer una nueva aplicación",
            "Las instrucciones principales son: ",
            {tipox: 'lista', tagList:'ol', tagElement:'li', elementos:[
              "Copie el contenido de la carpeta nueva_aplicacion en una nueva carpeta que esté al mismo nivel (respecto de la raíz)",
              "Cambie la introducción y agregue o quite páginas y funciones acá", 
              ]}
        ]
    };

var app=new Aplicacion();
Aplicacion.run(app);
