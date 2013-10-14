function numero_a_letras(numero,params){
    if(params /*&& params.plural*/){
        var texto=numero_a_letras(numero);
        var str=''+numero;
        if(numero==1){
            return (params.femenino?'una ':'un ')+params.singular;
        }else if(str.substr(str.length-1,1)==1){
            return (params.femenino?texto.substr(0,texto.length-1)+'a ':texto.substr(0,texto.length-3)+(str.substr(str.length-2,1)==2?'ún ':'un '))+params.plural;
        }else{
            return texto+(texto.substr(texto.length-3,3)=='nes'?' de ':' ')+params.plural;
        }
    }else{
        var num=Number(numero);
        if(num<0){
            return 'menos '+numero_a_letras(-num);
        }
        var texto=numero_a_letras.textos[numero];
        if(texto){
            return texto;
        }else{
            var i_porcion=numero_a_letras.porciones.length-1;
            while(i_porcion && num<numero_a_letras.porciones[i_porcion].corte) i_porcion--;
            var prefijo='';
            var porcion=numero_a_letras.porciones[i_porcion];
            var corte=porcion.corte;
            var digito=Math.floor(num/corte);
            var resto=num % corte;
            if(digito==1 && resto>0 && porcion.cuandoNoRedondo){
                prefijo=porcion.cuandoNoRedondo;
            }else{
                if(corte>=1000){
                    prefijo=digito==1?porcion.textoUno:(digito==21?'veintiún':numero_a_letras(digito))+' '+porcion.textoVarios;
                }else{
                    prefijo=numero_a_letras.textos[digito*corte]+(porcion.sufijo||'');
                }
            }
            if(resto){
                return prefijo+' '+numero_a_letras(resto);
            }else{
                return prefijo;
            }
        }
    }
}

numero_a_letras.porciones=[
    {corte:1},
    {corte:10, sufijo:' y'},
    {corte:100, cuandoNoRedondo:'ciento'},
    {corte:1000, textoUno:'mil', textoVarios:'mil'},
    {corte:1000000, textoUno:'un millón', textoVarios:'millones'},
    {corte:1000000000000, textoUno:'un billón', textoVarios:'billones'}];

// 45 > 10 = p[1]

numero_a_letras.textos={
    '0':'cero'         ,
    '1':'uno'          ,
    '2':'dos'          ,
    '3':'tres'         ,
    '4':'cuatro'       ,
    '5':'cinco'        ,
    '6':'seis'         ,
    '7':'siete'        ,
    '8':'ocho'         ,
    '9':'nueve'        ,
   '10':'diez'         ,
   '11':'once'         ,
   '12':'doce'         ,
   '13':'trece'        ,
   '14':'catorce'      ,
   '15':'quince'       ,
   '16':'dieciseis'    ,
   '17':'diecisiete'   ,
   '18':'dieciocho'    ,
   '19':'diecinueve'   ,
   '20':'veinte'       ,
   '21':'veintiuno'    ,
   '22':'veintidos'    ,
   '23':'veintitres'   ,
   '24':'veinticuatro' ,
   '25':'veinticinco'  ,
   '26':'veintiseis'   ,
   '27':'veintisiete'  ,
   '28':'veintiocho'   ,
   '29':'veintinueve'  ,
   '30':'treinta'      ,
   '40':'cuarenta'     ,
   '50':'cincuenta'    ,
   '60':'sesenta'      ,
   '70':'setenta'      ,
   '80':'ochenta'      ,
   '90':'noventa'      ,
  '100':'cien'         ,
  '200':'doscientos'   ,
  '300':'trescientos'  ,
  '400':'cuatrocientos',
  '500':'quinientos'   ,
  '600':'seiscientos'  ,
  '700':'setecientos'  ,
  '800':'ochocientos'  ,
  '900':'novecientos'  ,
 '1000':'mil'          
};

Probador.prototype.registradorCasosPrueba.push(function(){
    this.casoPredeterminado={funcion:'numero_a_letras', modulo:'números simples'};
    this.agregarCaso({ entrada:[      1], esperado:{respuesta:'uno'}});
    this.agregarCaso({ entrada:[     21], esperado:{respuesta:'veintiuno'}});
    this.agregarCaso({ entrada:[     45], esperado:{respuesta:'cuarenta y cinco'}});
    this.agregarCaso({ entrada:[    108], esperado:{respuesta:'ciento ocho'     }});
    this.agregarCaso({ entrada:[   1010], esperado:{respuesta:'mil diez'        }});
    this.agregarCaso({ entrada:[   1239], esperado:{respuesta:'mil doscientos treinta y nueve'}});
    this.agregarCaso({ entrada:[  21239], esperado:{respuesta:'veintiún mil doscientos treinta y nueve'}});
    this.agregarCaso({ entrada:[ 234928], esperado:{respuesta:'doscientos treinta y cuatro mil novecientos veintiocho'}});
    this.agregarCaso({ entrada:[1000002], esperado:{respuesta:'un millón dos'}});
    this.agregarCaso({ entrada:[3001000], esperado:{respuesta:'tres millones mil'}});
    this.agregarCaso({ entrada:[21000000], esperado:{respuesta:'veintiún millones'}});
    this.agregarCaso({ entrada:[21100000], esperado:{respuesta:'veintiún millones cien mil'}});
    this.agregarCaso({ entrada:[876543210987654272], esperado:{respuesta:'ochocientos setenta y seis mil quinientos cuarenta y tres billones doscientos diez mil novecientos ochenta y siete millones seiscientos cincuenta y cuatro mil doscientos setenta y dos'}});
    this.agregarCaso({ entrada:[900000001, {singular:'peso', plural:'pesos'}], esperado:{respuesta:'novecientos millones un pesos'}});
    this.agregarCaso({ entrada:[800000000900000000, {singular:'peso', plural:'pesos'}], esperado:{respuesta:'ochocientos mil billones novecientos millones de pesos'}});
    this.casoPredeterminado={funcion:'numero_a_letras', modulo:'números con unidad de medida'};
    this.agregarCaso({ entrada:[1, {singular:'peso', plural:'pesos'}], esperado:{respuesta:'un peso'}});
    this.agregarCaso({ entrada:[2, {singular:'peso', plural:'pesos'}], esperado:{respuesta:'dos pesos'}});
    this.agregarCaso({ entrada:[21, {singular:'peso', plural:'pesos'}], esperado:{respuesta:'veintiún pesos'}});
    this.agregarCaso({ entrada:[0, {singular:'peso', plural:'pesos'}], esperado:{respuesta:'cero pesos'}});
    this.agregarCaso({ entrada:[1, {singular:'manzana', plural:'manzanas', femenino:true}], esperado:{respuesta:'una manzana'}});
    this.casoPredeterminado={funcion:'numero_a_letras', modulo:'números negativos'};
    this.agregarCaso({ entrada:[-1043], esperado:{respuesta:'menos mil cuarenta y tres'}});
});
