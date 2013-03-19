<?php
date_default_timezone_set("America/Buenos_Aires"); 

require_once "comunes.php";

class ExceptionTipox extends Exception{
}

class AplicacionBase{
    // parte manejo de procesos
    private $db;
    private $configuracion;
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
        }catch(Exception $err){
            $this->cerrarBaseDeDatos(false);
            $rta=array('tipox'=>'rtaError', 'mensaje'=>$err->getMessage());
        }
        echo json_encode($rta);
    }
    function peticionVacia(){
    }
    function peticionErronea($mensaje){
        $this->peticionVacia();
    }
    function respuestaOk($respuesta){
        return array('tipox'=>'rtaOk','respuesta'=>$respuesta);
    }
    function respuestaError($mensaje){
        return array('tipox'=>'rtaError','mensaje'=>$mensaje);
    }
    // configuración interna de la aplicación
    function leerConfiguracion(){
        if(!$this->configuracion){
            $this->configuracion=json_decode(file_get_contents('configuracion_global.json')); 
            if(!$this->configuracion){
                throw new ExceptionTipox('No se pudo leer la configuracion_global.json '.json_last_error());
            }
            $configuracionLocal=json_decode(file_get_contents('configuracion_local.json'));
            if(!$configuracionLocal){
                throw new ExceptionTipox('No se pudo leer la configuracion_local.json '.json_last_error());
            }
            cambiarRecursivamente($this->configuracion,$configuracionLocal);
        }
        return $this->respuestaOk('base de datos instalada');
    }
    function baseDeDatos(){
        if(!$this->db){
            file_put_contents('todos_los_sql.sql',"/* BASE ABIERTA */\n",FILE_APPEND);
            $this->leerConfiguracion();
            $pdo=$this->configuracion->pdo;
            $this->db=new PDO($pdo->dsn,$pdo->username,$pdo->password,$pdo->driver_options);
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
        file_put_contents('todos_los_sql.sql',"$sentencia;\n",FILE_APPEND);
        $db=$this->baseDeDatos();
        $sentencia=$db->prepare($sentencia);
        $sentencia->execute($parametros);
        return $sentencia;
    }
    function proceso_instalarBaseDeDatos(){
        $db=$this->baseDeDatos();
        if(file_exists('instalado.flag.no')){
            $sentencias_instalacion=file_get_contents('sentencias_instalacion.sql');
            foreach(explode('/*OTRA*/',$sentencias_instalacion) as $sentencia){
                if(substr($this->tipoDb->dsn,0,7)=='sqlite:'){
                    $sentencia=preg_replace(array('/\btrue\b/','/\bfalse\b/'),array(1,0),$sentencia);
                }
                if(trim($sentencia)){
                    $this->ejecutarSql($sentencia);
                }
            }
            rename('instalado.flag.no','instalado.flag.si');
        }else{
            throw new ExceptionTipox('No se puede instalar porque no esta instalado.flag.no');
        }
        return "instalada";
    }
    function proceso_control_instalacion(){
        if(!file_exists('configuracion_local.json')){
            return $this->respuestaError('no existe la configuracion_local.json'); // se puede crear con un json vacío. Así: {}
        }
        $db=$this->baseDeDatos();
        if(!$db){
            return $this->respuestaError('base de datos no inexistente');
        }
        try{
            $sentencia=$this->ejecutarSql('select count(*) as cantidad from usuarios');
            $fila=$sentencia->fetchObject();
            if(!$fila->cantidad){
                return $this->respuestaError('no hay usuarios en la tabla de usuarios');
            }
        }catch(Exception $err){
            return $this->respuestaError('no se puede acceder a la tabla usuarios');
        }
        return $this->respuestaOk(array('estadoInstalacion'=>'completa'));
    }
    // procesos default:
    function proceso_entrada($params){
        $db=$this->baseDeDatos();
        $sentencia=$db->prepare($this->configuracion->sql->validar_usuario);
        $sentencia->execute(array(':usuario'=>$params->usuario,':password'=>$params->password));
        $datos_usuario=$sentencia->fetchObject();
        if(!$datos_usuario){
            return array('tipox'=>'rtaError','mensaje'=>'el usuario o la clave no corresponden a un usuario activo');
        }else if(!$datos_usuario->activo){
            return array('tipox'=>'rtaError','mensaje'=>'el usuario '.json_encode($params->usuario).' no esta activo');
        }
        return $this->respuestaOk($datos_usuario);
    }
}

?>