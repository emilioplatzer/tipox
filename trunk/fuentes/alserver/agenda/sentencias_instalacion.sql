-- UTF-8:Sí (sin bom)
/*TIENE:SCHEMA*/
drop schema if exists agenda cascade;
--DB*/
/*OTRA*/
/*TIENE:SCHEMA*/
create schema agenda;
--DB*/
/*OTRA*/
/*POSTGRESQL*/
set search_path to agenda,tipox,public;
--DB*/
/*OTRA*/
create table agenda(
    id_agenda serial primary key,
    nombre text,
    apellido text,
    telefono text,
    ultima_modificacion date default current_timestamp
);
/*OTRA*/insert into agenda(nombre, telefono, ultima_modificacion) values ('Bomberos','100','2001-01-01');
/*OTRA*/insert into agenda(nombre, telefono, ultima_modificacion) values ('Policía','911','2001-01-01');
/*OTRA*/insert into agenda(nombre, telefono, ultima_modificacion) values ('Defensa civil','103','2001-01-01');
/*OTRA*/insert into agenda(nombre, telefono, ultima_modificacion, apellido) values ('SAME','107','2001-01-01', 'Emergencias Médicas');
/*OTRA*/
/*POSTGRESQL*/
CREATE TRIGGER agenda_um
    BEFORE UPDATE OR INSERT ON agenda
    FOR EACH ROW
    EXECUTE PROCEDURE tipox.poner_ultima_modificacion();
--DB*/
/*OTRA*/
update agenda set apellido=null where telefono='107';