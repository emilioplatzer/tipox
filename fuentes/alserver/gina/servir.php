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
    $datos=datos_actuales(false);
    if(!$datos->estado){
        $cursor=$db->prepare("select * from jugadores, (select max(terminal) as max_terminal from jugadores) x order by jugador");
        $cursor->execute();
        $jugadores=$cursor->fetchAll(PDO::FETCH_OBJ);
        echo json_encode(array('empezado'=>'no', 'jugadores'=>$jugadores, 'datos'=>array(), 'nuevos_desde'=>@$_SESSION['nuevos_desde']?:0));
        if(count($jugadores)){
            $_SESSION['nuevos_desde']=$jugadores[0]->max_terminal;
        }
    }else{
        $cursor=$db->prepare(<<<SQL
            select u.jugador, u.activo, j.jugada, j.juego, u.terminal
              from jugadores u left join jugadas j on u.jugador=j.jugador and juego=:juego 
              where u.activo=1 or j.jugada is not null
              order by u.jugador
SQL
        );
        $cursor->execute(array(':juego'=>$datos->juego));
        $jugadores=$cursor->fetchAll(PDO::FETCH_OBJ);
        $cursor=$db->prepare(<<<SQL
            select o.juego, o.opcion, o.texto, count(j.jugada) as cuantos, GROUP_CONCAT(jugador) as quienes
              from opciones o left join jugadas j on j.juego=o.juego and j.jugada=o.opcion
              where o.juego=:juego 
              group by o.juego, o.opcion, o.texto
              order by o.juego, o.opcion
SQL
        );
        $cursor->execute(array(':juego'=>$datos->juego));
        $opciones=$cursor->fetchAll(PDO::FETCH_OBJ);
        echo json_encode(array('empezado'=>'si', 'jugadores'=>$jugadores, 'opciones'=>$opciones, 'datos'=>$datos));
    }
}

function hacer_avanzar_juego(){
    $db=abrir_db();
    $datos=datos_actuales(false);
    loguear(null,'por hacer avanzar '.json_encode($datos));
    if(!$datos->estado){
        $cursor=$db->prepare("update control set juego=1, estado=1");
    }else if($datos->estado==1){
        $cursor=$db->prepare("update control set estado=2");
    }else{
        $cursor=$db->prepare("update control c set estado=1, juego=(select min(j.juego) from juegos j where j.juego>c.juego)");
    }
    $cursor->execute();
    echo json_encode("ok");
}

function hacer_podio(){
    $db=abrir_db();
    $cursor=$db->prepare(<<<SQL
        SELECT jugador, aciertos, CASE
                WHEN @prevVal = aciertos THEN @curRank
                WHEN @prevVal := aciertos THEN @curRank := @curRank + 1
            END as posicion
          FROM (
            SELECT u.jugador, count(p.correcta) as aciertos
              FROM jugadores u
                LEFT JOIN jugadas j ON u.jugador=j.jugador
                LEFT JOIN juegos p ON p.juego=j.juego AND p.correcta=j.jugada
              GROUP BY u.jugador
            ) x, (SELECT @curRank := 0, @prevVal := null) r
          ORDER BY 2 desc, 1
SQL
    );
    $cursor->execute();
    echo json_encode(array('jugadores'=>$cursor->fetchAll(PDO::FETCH_OBJ)));
    
}

function hacer_inactivar_jugador(){
    $db=abrir_db();
    $cursor=$db->prepare("update jugadores set activo=0 where jugador=:jugador");
    $cursor->execute(array(':jugador'=>$_REQUEST['jugador']));
    echo json_encode("ok");
}
?>