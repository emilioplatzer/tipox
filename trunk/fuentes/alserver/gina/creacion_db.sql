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
create table jugada(
    juego integer,
    jugador varchar(20),
    opcion varchar(1),
    primary key (juego,jugador),
    foreign key (juego) references juegos (juego)
);
/*OTRA*/
insert into juegos(juego, imagen, descripcion) values (1, 'bob_esponja.jpg', 'en la popluar serie de televisión "bob esponja" ¿qué tipo de animal es Patricio?');
/*OTRA*/
insert into opciones(juego, opcion, texto) values (1, 'A', 'ardilla');
insert into opciones(juego, opcion, texto) values (1, 'B', 'calamar');
insert into opciones(juego, opcion, texto) values (1, 'C', 'cangrejo');
insert into opciones(juego, opcion, texto) values (1, 'D', 'estrella de mar');
/*OTRA*/
insert into juegos(juego, imagen, descripcion) values (2, 'victorius.jpg', 'en la no tan conocida serie de televisión "Victorius" ¿qué actriz interpreta a Tori Vega?');
/*OTRA*/
insert into opciones(juego, opcion, texto) values (2, 'A', 'Ariana Grande');
insert into opciones(juego, opcion, texto) values (2, 'B', 'Victoria Justice');
insert into opciones(juego, opcion, texto) values (2, 'C', 'Ellizabeth Gillies');
insert into opciones(juego, opcion, texto) values (2, 'D', 'Daniella Monet');
/*OTRA*/
insert into control(juego) values (null);