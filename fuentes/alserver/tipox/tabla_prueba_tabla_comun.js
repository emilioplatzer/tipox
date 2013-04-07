tabla.prueba_tabla_comun=
{ "esquema":"tests",
  "campos":{
    "id":      {"tipo":"serial" ,"caracteres":4, "esPk":true},
    "nombre":  {"tipo":"texto"  ,"ancho":120},
    "importe": {"tipo":"decimal"},
    "activo":  {"tipo":"logico" , "titulo":["A",{"tipox":"small", "innerText":"ctv"}]},
    "cantidad":{"tipo":"entero" },
    "fecha":   {"tipo":"fecha"  }
  }
}