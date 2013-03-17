create table usuarios(
    usuario text primary key,
    clave text,
    activo boolean
);
/*OTRA*/ insert into usuarios(usuario, clave, activo) values ('abel','a8767d311fc64a301610072902926593',true); -- clave 1
/*OTRA*/ insert into usuarios(usuario, clave, activo) values ('cain','4dc3669e9aab29046eb613f8eeb4896f',false); -- clave 2