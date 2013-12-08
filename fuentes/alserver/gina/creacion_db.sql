drop table if exists jugadores;
/*OTRA*/
create table jugadores(
    jugador varchar(20) primary key,
    sessionid varchar(100),
    numero mediumint auto_increment unique key
);
/*OTRA*/
insert into jugadores(jugador, sessionid) values ('otro','xxxxx');