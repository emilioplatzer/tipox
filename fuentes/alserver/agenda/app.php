<?php
include "../tipox/app_base.php";
require_once "../extensiones/dr_sqlite.php";

class AplicacionAgenda extends AplicacionBase{
}

$app=new AplicacionAgenda();
$app->atenderPeticion();

?>