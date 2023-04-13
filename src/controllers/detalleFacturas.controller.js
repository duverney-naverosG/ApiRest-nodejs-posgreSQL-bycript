import {pool} from '../database/conexion.js';

const obtenerDetalleFacturas = async (req, res) => {
  const {fecha} = req.body;
  try {
    const result = await pool.query('select detalle_factura.id_factura, detalle_factura.id_producto , detalle_factura.nombre , detalle_factura.cantidad , detalle_factura.precio_unitario , detalle_factura.total, factura.fecha from detalle_factura, factura where detalle_factura.id_factura = factura.id AND FACTURA.fecha <= $1 order by factura.fecha desc',[fecha]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }
};

const obtenerDetalleFactura = async (req, res) => {
  try {
    const result = await pool.query('select detalle_factura.id_factura, detalle_factura.id_producto , detalle_factura.nombre , detalle_factura.cantidad , detalle_factura.precio_unitario , detalle_factura.total, factura.fecha from detalle_factura, factura where detalle_factura.id_factura = factura.id AND detalle_factura.id_factura = $1 order by factura.fecha desc', [req.params.id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }
};

const insertarDetalleFactura = async (req, res) => {
  const {id_factura, id_producto, cantidad} = req.body;

  if (id_factura == null || id_producto == null || cantidad == null){
    return res.status(400).json({
      mensaje: "llenar todos los campos",
    });
  }

  try {
    const producto = await pool.query("SELECT * FROM producto WHERE id_producto = $1", [id_producto]);

    if(producto.rows[0].stock <= 0){
      return res.status(404).json({
        'mensaje': 'producto agotado'
      });

    }else if(producto.rows[0].stock < cantidad){
      return res.status(404).json({
        'mensaje': `producto insuficiente, solo quedan ${producto.rows[0].stock}`
      })

    }else{
      const result = await pool.query('INSERT INTO detalle_Factura (id_factura, id_producto, nombre, cantidad, precio_unitario, total) VALUES ($1, $2, $3, $4, $5, $6)', [id_factura, id_producto, producto.rows[0].nombre ,cantidad, producto.rows[0].precio, producto.rows[0].precio * cantidad]);
      if(result.rowsAffected<=0){
        return res.status(404).json({
          'mensaje': 'producto no insertado'
        });
      }
  
      res.status(200).json({
        'mensaje': 'PRODUCTO INSERTADO'
      });
    }
  } catch (error) {
    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });  
  }
};

const actualizarDetalleFactura = async (req, res) => {
  const {id_factura, cantidad, id_producto} = req.body;
  let {cantidadAnterior} = req.body;
  
  if (id_factura == null || cantidad == null || id_producto == null || cantidadAnterior == null){
    return res.status(400).json({
      mensaje: "llenar todos los campos",
    });
  }

  if(cantidad != 0){
    cantidadAnterior -= cantidad;
  }

  try {
    const factura = await pool.query("SELECT totalpagar FROM factura WHERE id = $1", [id_factura]);

    if(factura.rows[0].totalpagar != null){
      return res.json({
        'mensaje': 'factura ya cancelada, no se puede actualizar'
      });
    }else{
      const producto = await pool.query("SELECT * FROM producto WHERE id_producto = $1", [id_producto]);

      if(producto.rows[0].stock <= 0){
        return res.status(404).json({
          'mensaje': 'producto agotado'
        });

      }else if(producto.rows[0].stock < cantidad){
        return res.status(404).json({
          'mensaje': `producto insuficiente, solo quedan ${producto.rows[0].stock}`
        })

      }else{
        const result = await pool.query('UPDATE detalle_Factura SET id_producto = $1, nombre = $2, cantidad = $3 , precio_unitario = $4, total = $5 WHERE id = $6 ', [id_producto, producto.rows[0].nombre ,cantidad, producto.rows[0].precio, producto.rows[0].precio * cantidad, req.params.id]);
        if(result.rowCount<=0){
          return res.status(404).json({
            'mensaje': 'producto no insertado'
          });
        }

        await pool.query("UPDATE producto SET stock = producto.stock + $1 WHERE id_producto = $2", [cantidadAnterior, id_producto])
  
        res.status(200).json({
          'mensaje': 'PRODUCTO ACTUALIZADO'
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    }); 
  }
};

const eliminarDetalleFactura = async (req, res) => {

  const {id_factura, cantidad, id_producto} = req.body;

  try {

    const factura = await pool.query("SELECT totalpagar FROM factura WHERE id = $1", [id_factura]);

    if(factura.rows[0].totalpagar != null){
      return res.json({
        'mensaje': 'factura ya cancelada, no se puede eliminar'
      });
    }else{
      const result = await pool.query("DELETE FROM detalle_factura WHERE id = $1", [req.params.id]);

      if(result.rowCount<=0){
        return res.status(404).json({
          'mensaje': 'error al eliminar el producto'
        });
      }

      await pool.query("UPDATE producto SET stock = producto.stock + $1 WHERE id_producto = $2", [cantidad, id_producto])

      res.status(200).json({
        'mensaje': 'PRODUCTO ELIMINADO'
      });
    }
    

  } catch (error) {
    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }
};

export {
  obtenerDetalleFacturas,
  obtenerDetalleFactura,
  insertarDetalleFactura,
  actualizarDetalleFactura,
  eliminarDetalleFactura,
};
