import {pool} from '../database/conexion.js';

const obtenerProductos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM producto');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }
};

const obtenerProducto = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM producto WHERE id_producto = $1',[req.params.id]);
    if(result.rows.length<= 0){
      return res.json({
        'mensaje': 'el producto no esta registrado'
      });
    }

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }
};

const insertarProductos = async (req, res) => {
  const {nombre, precio, stock, imagen} = req.body;
  if(nombre == null || precio == null || stock == null){
    return res.status(400).json({
       mensaje: "llenar todos los campos",
    });
  }

  try {
    const result = await pool.query('INSERT INTO producto (nombre, precio, stock, imagen) VALUES ($1, $2, $3, $4)', [nombre, precio, stock, imagen]);
    if(result.rowsAffected<=0){
      return res.status(404).json({
        'mensaje': 'producto no insertado'
      });
    }
    
    res.status(200).json({
      'mensaje': 'PRODUCTO REGISTRADO'
    });

  } catch (error) {
    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }
};

const actualizarProductos = async (req, res) => {
  const {nombre, precio, stock, imagen} = req.body;
  if(nombre == null || precio == null || stock == null){
    return res.status(400).json({
      mensaje: "llenar todos los campos",
    });
  }
  
  try {
    const result = await pool.query('UPDATE producto SET nombre = $1, precio = $2, stock = $3, imagen = $4 WHERE id_producto = $5', [nombre, precio, stock, imagen, req.params.id]);
    if(result.rowCount<=0){
      return res.status(404).json({
        'mensaje': 'producto no actualizado'
      });
    }
    
    res.status(200).json({
      'mensaje': 'PRODUCTO ACTUALIZADO'
    });

  } catch (error) {
    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }
};

const eliminarProductos = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM producto WHERE id_producto = $1", [req.params.id]);

    if(result.rowCount<=0){
      return res.status(404).json({
        'mensaje': 'error al eliminar el producto'
      });
    }

    res.status(200).json({
      'mensaje': 'PRODUCTO ELIMINADO'
    });

  } catch (error) {
    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }
};

export {
  obtenerProductos,
  obtenerProducto,
  insertarProductos,
  actualizarProductos,
  eliminarProductos,
};
