-- UTF-8:Sí (sin bom)
/*TIENE:SCHEMA*/
drop schema if exists tests cascade;
--DB*/
/*OTRA*/
/*TIENE:SCHEMA*/
create schema tests;
--DB*/
/*OTRA*/
/*POSTGRESQL*/
set search_path to tests,tipox,public;
--DB*/
/*OTRA*/
create table prueba_tabla_comun(
    id serial primary key,
    nombre text,
    importe numeric,
    activo boolean,
    cantidad integer,
    ultima_modificacion date default current_timestamp
);
/*OTRA*/insert into prueba_tabla_comun(nombre, importe, activo, cantidad, ultima_modificacion) values ('uno' ,null,true ,-9,  '2001-01-01');
/*OTRA*/insert into prueba_tabla_comun(nombre, importe, activo, cantidad, ultima_modificacion) values ('dos' ,0.11,false, 1  ,'2001-01-01');
/*OTRA*/insert into prueba_tabla_comun(nombre, importe, activo, cantidad, ultima_modificacion) values ('año' ,2000,null ,null,'2001-01-01');
/*OTRA*/
/*POSTGRESQL*/
CREATE TRIGGER prueba_tabla_comun_um
    BEFORE UPDATE OR INSERT ON prueba_tabla_comun
    FOR EACH ROW
    EXECUTE PROCEDURE tipox.poner_ultima_modificacion();
--DB*/
