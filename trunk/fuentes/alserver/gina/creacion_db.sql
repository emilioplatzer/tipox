drop table if exists jugadas;
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
    sessionid varchar(100),
    user_agent varchar(1000),
    ip varchar(16)
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
    correcta varchar(1),
    imagenok varchar(200),
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
    estado integer,
    foreign key (juego) references juegos (juego)
);
/*OTRA*/
create table jugadas(
    juego integer,
    jugador varchar(20),
    jugada varchar(1),
    primary key (juego,jugador),
    foreign key (juego) references juegos (juego)
);
/*OTRA*/
insert into control(juego) values (null);