import {pool} from '../database/conexion.js';

const obtenerClientes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }
  
};

const obtenerCliente = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes WHERE identificacion = $1', [req.params.id]);
    
    if(result.rows.length<= 0){
      return res.json({
        'mensaje': 'el usuario no esta registrado'
      });
    }

    res.json(result.rows);
  } catch (error) {

    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }
};

const insertarCliente = async (req, res) => {
  const {identificacion, nombres, direccion, telefono, correo} = req.body;

  if (identificacion == null || nombres == null || direccion == null || telefono == null || correo == null){
    return res.status(400).json({
      mensaje: "llenar todos los campos",
    });
  }

  try {
    const result = await pool.query('INSERT INTO clientes (identificacion, nombres, direccion, telefono, correo) VALUES ($1, $2, $3, $4, $5)', [identificacion, nombres, direccion, telefono, correo]);
    if(result.rowsAffected<=0){
      return res.status(404).json({
        'mensaje': 'usuario no insertado'
      });
    }
  
    res.status(200).json({
      'mensaje': 'USUARIO REGISTRADO'
    });

  } catch (error) {
    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }
};

const actualizarCliente = async (req, res) => {
  const {identificacion, nombres, direccion, telefono, correo} = req.body;

  if (identificacion == null || nombres == null || direccion == null || telefono == null || correo == null){
    return res.status(400).json({
      mensaje: "llenar todos los campos",
    });
  }

  try {
    const result = await pool.query('UPDATE clientes SET identificacion = $1, nombres = $2, direccion = $3, telefono = $4 , correo = $5 WHERE id = $6', [identificacion, nombres, direccion, telefono, correo, req.params.id]);
  
    if(result.rowCount<=0){
      return res.status(404).json({
        'mensaje': 'usuario no insertado'
      });
    }
  
    res.status(200).json({
      'mensaje': 'USUARIO ACTUALIZADO'
    });
  } catch (error) {
    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }

};

const eliminarCliente = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM clientes WHERE id = $1 OR identificacion = $1", [req.params.id]);

    if(result.rowCount<=0){
      return res.status(404).json({
        'mensaje': 'error al eliminar el cliente'
      });
    }

    res.status(200).json({
      'mensaje': 'USUARIO ELIMINADO'
    });

  } catch (error) {
    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }
};

export {
  obtenerClientes,
  obtenerCliente,
  insertarCliente,
  actualizarCliente,
  eliminarCliente,
};
