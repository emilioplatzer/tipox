<?php
require_once "comunes.php";

class ExceptionTipox extends Exception{
}

class AplicacionBase{
    // parte manejo de procesos
    private $db;
    private $configuracion;
    function atenderPeticion(){
        if(!isset($_REQUEST['proceso'])){
            $rta=$this->peticionVacia();
        }else if(!isset($_REQUEST['tipopr'])){
            $rta=$nombreProceso='proceso_'.$_REQUEST['proceso'];
            if(method_exists($this,$nombreProceso)){
                $rta=$this->$nombreProceso();
            }else{
                $rta=$this->peticionErronea('No existe el nombre del proceso php '.$nombreProceso);
            }
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
            $this->leerConfiguracion();
            $pdo=$this->configuracion->pdo;
            $this->db=new PDO($pdo->dsn,$pdo->username,$pdo->password,$pdo->driver_options);
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        return $this->db;
    }
    function ejecutarSql($sentencia,$parametros=NULL){
        $db=$this->baseDeDatos();
        $sentencia=$db->prepare($sentencia);
        $sentencia->execute($parametros);
    }
    function proceso_instalarBaseDeDatos(){
        $db=$this->baseDeDatos();
        if(file_exists('pendiente_de_instalacion.json')){
            $sentencias_instalacion=file_get_contents('sentencias_instalacion.sql');
            foreach(explode('/*OTRA*/',$sentencias_instalacion) as $sentencia){
                if(trim($sentencia)){
                    $this->ejecutarSql($sentencia);
                }
            }
            rename('pendiente_de_instalacion.json','instalado.json');
        }else{
            throw new ExceptionTipox('No se puede instalar porque no esta pendiente_de_instalacion.json');
        }
    }
    // procesos default:
    function proceso_entrada(){
        $db=$this->baseDeDatos();
        $sentencia=$db->prepare($this->configuracion->sql->validar_usuario);
        $sentencia->execute(array(':usuario'=>$this->argumentos->usuario,':password'=>$this->argumentos->password));
        $datos_usuario=$sentencia->fecthObject();
        if(!$datos_usuario){
            return array('tipox'=>'rtaError','mensaje'=>'el usuario o la clave no corresponden a un usuario activo');
        }else if(!$datos_usuario->activo){
            return array('tipox'=>'rtaError','mensaje'=>'el usuario '.json_encode($this->argumentos->usuario).' no esta activo');
        }
        return $this->respuestaOk($datos_usuario);
    }
}

?>