<?php
session_start();

date_default_timezone_set('America/Buenos_Aires');

require_once "les_paroles.php";

require_once "comunes.php";

$funcion_hacer="hacer_{$_REQUEST['hacer']}";

$funcion_hacer();

function hacer_entrar(){
    global $clave_basica;
    if($_REQUEST['clave']==$clave_basica){
        $_SESSION['super']='super';
        header('Location: super.php');
    }else{
        if(isset($_SESSION['super'])){
            unset($_SESSION['super']);
        }
        echo <<<HTML
            <h1>Clave o usuario incorrectos</h1>
            <a href=super.php>reintentar</a>
HTML;
    }
}

function hacer_quienes(){
    $db=abrir_db();
    $cursor=$db->prepare("select * from jugadores order by terminal");
    $cursor->execute();
    echo json_encode($cursor->fetchAll(PDO::FETCH_OBJ));
}
?>