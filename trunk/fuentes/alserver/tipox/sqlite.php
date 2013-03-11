<?php
try{
    $peticion=json_decode($_REQUEST['paquete']);
    $rta=array('tipox'=>'error','mensaje'=>'error sqlite: mensaje vacio '.json_encode($peticion));
    if(isset($peticion->probar)){
        switch($peticion->probar){
        case 'existencia':
            $db=abrirBase();
            if($db){
                $rta=array('tipox'=>'rtaOk','respuesta'=>'sqlite instalado ok');
            }else{
                $rta=array('tipox'=>'error','mensaje'=>'error sqlite no especifico');
            }
            break;
        case 'operatividad':
            $db=abrirBase();
            $db->exec('DROP TABLE IF EXISTS prueba_sqlite;');
            $db->exec('CREATE TABLE prueba_sqlite ( ejemplo text primary key, valor numeric);');
            $db->exec("INSERT INTO prueba_sqlite (ejemplo, valor) VALUES ('uno', 1);");
            $st=$db->prepare("INSERT INTO prueba_sqlite (ejemplo, valor) VALUES (:ejemplo, :valor);");
            $st->execute(array(':ejemplo'=>'dos',':valor'=>2));
            $re=$db->query("SELECT sum(valor) as suma FROM prueba_sqlite");
            $fila=$re->fetchObject();
            $obtenido=$fila->suma;
            if($obtenido==3){
                $rta=array('tipox'=>'rtaOk','respuesta'=>'sqlite operando ok');
            }else{
                $rta=array('tipox'=>'error','mensaje'=>'sqlite operando mal obtuvo '.$obtenido);
            }
            break;
        }
    }
}catch(Exception $err){
    $rta=array('tipox'=>'error','mensaje'=>'error sqlite: '.$err->getMessage());
}
echo json_encode($rta);

function abrirBase(){
    $db=new PDO('sqlite:la_base_prueba.db'); 
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $db;
}
?>