create function stock_Producto() returns trigger
as 
$$
begin
	UPDATE producto  SET producto.stock  = producto.stock + new.CANTIDAD  WHERE id = new.id_producto;
return new; 
end
$$
language plpgsql

create trigger stockProductos after insert on detalle_factura
for each row 
execute procedure stock_Producto();

INSERT INTO detalle_factura  (id_factura , id_producto, nombre, cantidad, precio_unitario, total) VALUES (4, 2, 'chocolate tolima 350G', 5, 2500, 10000);

select factura.id, clientes.identificacion as identificacion_cliente, clientes.nombres as nombre_cliente, cajero.nombres as nombre_cajero, factura.fecha from factura, clientes, cajero where factura.id_cliente = clientes.id  and factura.id_cajero = cajero.id and factura.id = 5;
select * from detalle_factura where id_factura = 4;

select detalle_factura.id_factura, detalle_factura.id_producto , detalle_factura.nombre , detalle_factura.cantidad , detalle_factura.precio_unitario , detalle_factura.total, factura.fecha from detalle_factura, factura where detalle_factura.id_factura = factura.id AND detalle_factura.id_factura = 4 order by factura.fecha desc; 

SELECT total FROM detalle_factura WHERE id_factura = 4

