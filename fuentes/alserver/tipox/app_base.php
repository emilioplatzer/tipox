<?php
date_default_timezone_set("America/Buenos_Aires"); 

require_once "comunes.php";
require_once "dr_pgsql.php";

class ExceptionTipox extends Exception{
}

class AplicacionBase{
    // parte manejo de procesos
    protected $db;
    protected $configuracion;
    var $ahora;
    var $hoy;
    function __construct(){
        $this->ahora=new DateTime();
        $this->hoy=new DateTime($this->ahora->format('Y-m-d'));
    }
    function atenderPeticion(){
        try{
            if(!isset($_REQUEST['proceso'])){
                $rta=$this->peticionVacia();
            }else if(!isset($_REQUEST['tipopr'])){
                $nombreProceso='proceso_'.$_REQUEST['proceso'];
                if(method_exists($this,$nombreProceso)){
                    if(isset($_REQUEST['paquete'])){
                        $params=json_decode($_REQUEST['paquete']);
                    }else{
                        $params=(object)array();
                    }
                    $rta=$this->$nombreProceso($params);
                }else{
                    $rta=$this->peticionErronea('No existe el nombre del proceso php '.$nombreProceso);
                }
            }
            $this->cerrarBaseDeDatos(true);
        }catch(PDOException $err){
            //$rta=$this->respuestaError(utf8_decode($err->getMessage()));
            $rta=$this->respuestaError(utf8_encode($err->getMessage()));
        }catch(Exception $err){
            $rta=$this->respuestaError($err->getMessage());
            $this->cerrarBaseDeDatos(false);
        }
        echo json_encode($rta);
    }
    function peticionVacia($mensaje){
        return $this->respuestaError($mensaje?:'peticion vacia');
    }
    function peticionErronea($mensaje){
        $this->peticionVacia($mensaje);
    }
    function respuestaOk($respuesta){
        return array('tipox'=>'rtaOk','respuesta'=>$respuesta);
    }
    function respuestaError($mensaje){
        return array('tipox'=>'rtaError','mensaje'=>$mensaje);
    }
    // configuraci�n interna de la aplicaci�n
    function leerConfiguracion(){
        if(!$this->configuracion){
            // Nunca cambiar una configuraci�n ac�. Cambiarla en configuracion_global.json de la aplicacion o configuracion_local.json de la instancia
            $this->configuracion=json_decode(<<<JSON
              {
                "loguear_sql":{
                    "todo":{
                        "hasta":"2001-01-01",
                        "donde":"../logs/todos_los_sql.sql"
                    },
                    "error":{
                        "hasta":"2099-01-01",
                        "donde":"../logs/sqls_con_error.sql"
                    }
                },
                "entorno":"desarrollo"
              }
JSON
            );
            $configuracionGlobal=json_decode(file_get_contents('configuracion_global.json')); 
            if(!$configuracionGlobal){
                throw new ExceptionTipox('No se pudo leer la configuracion_global.json '.json_last_error());
            }
            cambiarRecursivamente($this->configuracion,$configuracionGlobal);
            $configuracionLocal=json_decode(file_get_contents('configuracion_local.json'));
            if(!$configuracionLocal){
                throw new ExceptionTipox('No se pudo leer la configuracion_local.json '.json_last_error());
            }
            cambiarRecursivamente($this->configuracion,$configuracionLocal);
        }
    }
    function loguearSql($mensaje, $razonParaLoguear){
        $this->loguear(
            $this->configuracion->loguear_sql->{$razonParaLoguear}->hasta,
            "$mensaje\n",
            $this->configuracion->loguear_sql->{$razonParaLoguear}->donde
        );
    }
    function baseDeDatos(){
        if(!$this->db){
            $this->leerConfiguracion();
            $this->loguearSql("/* BASE ABIERTA */",'todo');
            $pdo=$this->configuracion->pdo;
            $this->db=new PDO($pdo->dsn,$pdo->username,$pdo->password,$pdo->driver_options);
            $nombres=explode(':',$pdo->dsn);
            $dirverDb='Dr_'.$nombres[0];
            $this->db->dr=new $dirverDb($pdo);
            $this->tipoDb=$pdo;
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->db->beginTransaction();
            if(isset($pdo->sql_preparativas)){
                foreach($pdo->sql_preparativas as $sentencia){
                    $this->ejecutarSql($sentencia);
                }
            }
        }
        return $this->db;
    }
    function cerrarBaseDeDatos($commit){
        if($this->db && $this->db->inTransaction()){
            if($commit){
                $this->db->commit();
            }else{
                $this->db->rollBack();
            }
        }
    }
    function ejecutarSql($sentencia,$parametros=NULL){
        $db=$this->baseDeDatos();
        $app=$this;
        $logTodo=$this->hoy<=$this->configuracion->loguear_sql->todo->hasta?function($mensaje) use ($app){
            $app->loguear($app->configuracion->loguear_sql->todo->hasta,$mensaje,$app->configuracion->loguear_sql->todo->donde);
        }:null;
        $logError=$this->hoy<=$this->configuracion->loguear_sql->error->hasta?function($mensaje) use ($app){
            $app->loguear($app->configuracion->loguear_sql->error->hasta,$mensaje,$app->configuracion->loguear_sql->error->donde);
        }:null;
        $cursor=$db->dr->ejecutar($db,$sentencia,$parametros,$logTodo,$logError);
        return $cursor;
    }
    function loguear($hasta_fecha,$mensaje,$archivo=null,$masInfo=true){
        if($this->hoy<=new DateTime($hasta_fecha)){
            $archivo=$archivo?:'../logs/log.txt';
            file_put_contents($archivo,$mensaje."\n",FILE_APPEND);
            $trace=debug_backtrace();
            if($masInfo){
                file_put_contents($archivo,"--> {$trace[0]['line']}: {$trace[0]['file']}\n",FILE_APPEND);
                $ahora=new DateTime();
                file_put_contents($archivo,"-- # ".$ahora->format(DATE_W3C)."\n",FILE_APPEND);
            }
        }
    }
    function proceso_instalarBaseDeDatos(){
        $db=$this->baseDeDatos();
        if(file_exists('instalado.flag.no')){
            $sentencias_instalacion=file_get_contents('../tipox/sentencias_instalacion.sql').
                "\n/*OTRA*/\n".file_get_contents('../tipox/sentencias_instalacion_tests.sql').
                "\n/*OTRA*/\n".file_get_contents('sentencias_instalacion.sql');
            foreach(explode('/*OTRA*/',$sentencias_instalacion) as $sentencia){
                if(trim($sentencia)){
                    $this->ejecutarSql($sentencia);
                }
            }
            rename('instalado.flag.no','instalado.flag.si');
        }else{
            throw new ExceptionTipox('No se puede instalar porque no esta instalado.flag.no');
        }
        return $this->respuestaOk("instalada");
    }
    function verificar_existencia_tabla($nombreTabla, $queHayaRegistros=false){
        try{
            $sentencia=$this->ejecutarSql("select count(*) as cantidad from {$nombreTabla}");
            $fila=$sentencia->fetchObject();
            if($queHayaRegistros && !$fila->cantidad){
                return $this->respuestaError("no hay registros en la tabla {$nombreTabla}");
            }
        }catch(Exception $err){
            return $this->respuestaError("no se puede acceder a la tabla {$nombreTabla}");
        }
        return false;
    }
    function proceso_control_instalacion($params){
        $rtaError=false;
        if($params->tipo=='tdd'){
            $db=$this->baseDeDatos();
            $this->ejecutarSql('/*POSTGRESQL*/set search_path to tests,public--DB*/');
            $rtaError=$this->verificar_existencia_tabla('prueba_tabla_comun');
        }else{
            if(!file_exists('configuracion_local.json')){
                return $this->respuestaError('no existe la configuracion_local.json'); // se puede crear con un json vac�o. As�: {}
            }
            $db=$this->baseDeDatos();
            if(!$db){
                return $this->respuestaError('base de datos no inexistente');
            }
            $rtaError=$this->verificar_existencia_tabla('usuarios',true);
        }
        if($rtaError){
            return $rtaError;
        }
        return $this->respuestaOk(array('estadoInstalacion'=>'completa'));
    }
    function proceso_acceso_db($params){
        $db=$this->baseDeDatos();
        if(!isset($params->where)){
            return $this->respuestaError("el acceso a datos debe tener una clausula where");
        }
        if(!isset($params->order_by)){
            return $this->respuestaError("el acceso a datos debe tener una clausula order by");
        }
        if(!count($params->order_by)){
            return $this->respuestaError("la clausula order by debe tener al menos un campo");
        }
        $this->assert(is_string($params->from),' from debe ser un nombre de tabla');
        if($params->hacer=='select'){
            $sentencia="SELECT * ".
                " FROM ".$db->dr->quote($params->from,Dr_sql::TABLA).
                " ORDER BY ".implode(", ",array_map(function($campo) use ($db){ return $db->dr->quote($campo,Dr_sql::CAMPO); },$params->order_by));
            $cursor=$this->ejecutarSql($sentencia);
            return $this->respuestaOk($cursor->fetchAll(PDO::FETCH_CLASS));
        }else{
            return $this->respuestaError("no esta definido como hacer ".$params->hacer." en el acceso a datos");
        }
    }
    function lanzarExcepcion($mensaje){
        throw new Exception($mensaje);
    }
    function assert($condicion, $mensaje){
        if(!$condicion){
            $this->lanzarExcepcion($mensaje);
        }
    }
    // procesos default:
    function proceso_entrada($params){
        $db=$this->baseDeDatos();
        // NO USAR ejecutarSql para que no se loguee
        $cursor=$db->prepare($this->configuracion->sql->validar_usuario);
        $cursor->execute(array(':usuario'=>$params->usuario,':password'=>$params->password));
        $datos_usuario=$cursor->fetchObject();
        if(!$datos_usuario){
            return $this->respuestaError('el usuario o la clave no corresponden a un usuario activo');
        }else{
            $this->db->dr->adaptarBool($datos_usuario->activo);
            if(!$datos_usuario->activo){
                return $this->respuestaError('el usuario '.json_encode($params->usuario).' no esta activo');
            }
        }
        return $this->respuestaOk($datos_usuario);
    }
}

?>