<?php
include "../tipox/app_base.php";
require_once "../extensiones/dr_sqlite.php";

class AplicacionAgenda extends AplicacionBase{
    function proceso_control_instalacion($params){
        return $this->respuestaOk(array('estadoInstalacion'=>'completa'));
    }
}

$app=new AplicacionAgenda();
$app->atenderPeticion();

?>