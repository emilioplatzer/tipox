/*-- UTF-8:Sí (sin bom) */
/*SQLITE:BORRAR BASE DE DATOS*/
/*TIENE:SCHEMA*/
drop schema if exists tipox cascade;
--DB*/
/*OTRA*/
/*TIENE:SCHEMA*/
create schema tipox;
--DB*/
/*OTRA*/
/*POSTGRESQL*/
set search_path to tipox,public;
--DB*/
/*OTRA*/
create table usuarios(
    usuario text primary key,
    password text,
    activo boolean,
    ultima_modificacion date
);
/*OTRA*/ insert into usuarios(usuario, password, activo) values ('abel','a8767d311fc64a301610072902926593',true); -- clave 1
/*OTRA*/ insert into usuarios(usuario, password, activo) values ('cain','4dc3669e9aab29046eb613f8eeb4896f',false); -- clave 2
/*OTRA*/ insert into usuarios(usuario, password, activo) values ('altrue',null,false); -- sin clave, esta para verificar que no reemplaze true
/*OTRA*/
/*POSTGRESQL*/
CREATE OR REPLACE FUNCTION poner_ultima_modificacion() RETURNS TRIGGER 
  LANGUAGE plpgsql AS
$BODY$
BEGIN
    new.ultima_modificacion=current_timestamp;
    RETURN new;
END;
$BODY$;
--DB*/
/*OTRA*/
/*POSTGRESQL*/
CREATE TRIGGER usuarios_um
    BEFORE UPDATE OR INSERT ON usuarios
    FOR EACH ROW
    EXECUTE PROCEDURE poner_ultima_modificacion();
--DB*/
