create table usuarios(
    usuario text primary key,
    password text,
    activo boolean
);
/*OTRA*/ insert into usuarios(usuario, password, activo) values ('abel','a8767d311fc64a301610072902926593',true); -- clave 1
/*OTRA*/ insert into usuarios(usuario, password, activo) values ('cain','4dc3669e9aab29046eb613f8eeb4896f',false); -- clave 2
/*OTRA*/ insert into usuarios(usuario, password, activo) values ('altrue',null,false); -- sin clave, está para verificar que no reemplaze true