import bcrypt from 'bcrypt'
import {pool} from '../database/conexion.js';

const obtenerCajeros = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cajero');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }
};

const obtenerCajero = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cajero WHERE identificacion = $1 OR id = $1', [req.params.id]);
    
    if(result.rows.length<= 0){
      return res.json({
        'mensaje': 'el cajero no esta registrado'
      });
    }

    res.json(result.rows);
  } catch (error) {

    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }
};

const insertarCajero = async (req, res) => {
  const {identificacion, nombres, direccion, telefono, correo, contraseña} = req.body;
  const saltRounds = 10;

  if(identificacion == null || nombres == null || direccion == null || telefono == null || correo == null || contraseña == null){
    return res.status(400).json({
      mensaje: "llenar todos los campos",
    });
  }

  const hast = bcrypt.hashSync(contraseña, saltRounds);

  try {
    const result = await pool.query('INSERT INTO cajero (identificacion, nombres, direccion, correo, telefono, contraseña) VALUES ($1, $2, $3, $4, $5, $6)', [identificacion, nombres, direccion, correo, telefono, hast]);
    if(result.rowsAffected<=0){
      return res.status(404).json({
        'mensaje': 'cajero no insertado'
      });
    }
  
    res.status(200).json({
      'mensaje': 'CAJERO REGISTRADO'
    });
    
  } catch (error) {
    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }

};

const actualizarCajero = async (req, res) => {
  const {identificacion, nombres, direccion, telefono, correo, contraseña, contraseñaActua} = req.body;
  const saltRounds = 10;
  let result;

  if(identificacion == null || nombres == null || direccion == null || telefono == null || correo == null){
    return res.status(400).json({
      mensaje: "llenar todos los campos",
    });
  }

  if(contraseña == null){
    result = await pool.query('UPDATE cajero SET identificacion = $1, nombres = $2, direccion = $3, correo = $4, telefono = $5 WHERE id = $6', [identificacion, nombres, direccion, correo, telefono, req.params.id]);
  }else{

    const boolContraseña = await pool.query('SELECT contraseña FROM cajero WHERE id = $1', [req.params.id]);

    if(bcrypt.compareSync(contraseñaActua, boolContraseña.rows[0].contraseña)){

      const hast = bcrypt.hashSync(contraseña, saltRounds);
      result = await pool.query('UPDATE cajero SET identificacion = $1, nombres = $2, direccion = $3, correo = $4, telefono = $5, contraseña = $6 WHERE id = $7', [identificacion, nombres, direccion, correo, telefono, hast, req.params.id]);

      if(result.rowCount<=0){
        return res.status(404).json({
          'mensaje': 'cajero no insertado'
        });
      }

    }else{
      return res.status(404).json({
        'mensaje': 'CONTRASEÑA ACTUAL NO COINCIDE CON LA ALMACENADA EN LA BASE DE DATOS'
      });
    }
  }

  res.status(200).json({
    'mensaje': 'CAJERO ACTUALIZADO'
  });

};

const eliminarCajero = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM cajero WHERE id = $1 OR identificacion = $1", [req.params.id]);

    if(result.rowCount<=0){
      return res.status(404).json({
        'mensaje': 'error al eliminar el cajero'
      });
    }

    res.status(200).json({
      'mensaje': 'CAJERO ELIMINADO'
    });

  } catch (error) {
    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }
};

export {
  obtenerCajeros,
  obtenerCajero,
  insertarCajero,
  actualizarCajero,
  eliminarCajero,
};
