drop table if exists jugada;
/*OTRA*/
drop table if exists control;
/*OTRA*/
drop table if exists opciones;
/*OTRA*/
drop table if exists juegos;
/*OTRA*/
drop table if exists jugadores;
/*OTRA*/
drop table if exists sessionid;
/*OTRA*/
create table sessionid(
    terminal mediumint auto_increment primary key,
    sessionid varchar(100)
) engine=innodb;
/*OTRA*/
create table jugadores(
    jugador varchar(20) primary key,
    terminal mediumint,
    numero mediumint auto_increment unique key,
    foreign key (terminal) references sessionid(terminal)
) engine=innodb;
/*OTRA*/
create table juegos(
    juego integer primary key,
    imagen varchar(200),
    descripcion varchar(1000)
);
/*OTRA*/
create table opciones(
    juego integer,
    opcion varchar(1),
    texto varchar(1000),
    correcta integer,
    primary key (juego, opcion),
    foreign key (juego) references juegos (juego)
);
/*OTRA*/
create table control(
    juego integer,
    activo integer,
    foreign key (juego) references juegos (juego)
);
/*OTRA*/
create table jugadas(
    juego integer,
    jugador varchar(20),
    opcion varchar(1),
    primary key (juego,jugador),
    foreign key (juego) references juegos (juego)
);
/*OTRA*/
insert into control(juego) values (null);