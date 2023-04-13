import {pool} from '../database/conexion.js';

const obtenerFacturas = async (req, res) => {
  try {
    const result = await pool.query('select factura.id, clientes.identificacion as identificacion_cliente, clientes.nombres as nombre_cliente, cajero.nombres as nombre_cajero, factura.totalpagar ,factura.fecha from factura, clientes, cajero where factura.id_cliente = clientes.id  and factura.id_cajero = cajero.id');
    let facturas = result.rows.map((factura)=>{
      return{
        "factura_id": factura.id,
        "identificacion_cliente": factura.identificacion_cliente,
        "nombre_cliente": factura.nombre_cliente,
        "nombre_cajero": factura.nombre_cajero,
        "totalPagar": factura.totalpagar == null ? 0 : factura.totalpagar,
        "fecha": factura.fecha.toLocaleString()
      }
    })
    res.json(facturas);
  } catch (error) {
    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }
};

const obtenerFactura = async (req, res) => {
  try {
    const result = await pool.query('select factura.id, clientes.identificacion as identificacion_cliente, clientes.nombres as nombre_cliente, cajero.nombres as nombre_cajero, factura.totalpagar factura.fecha from factura, clientes, cajero where factura.id_cliente = clientes.id  and factura.id_cajero = cajero.id and factura.id = $1', [req.params.id]);    
    
    if(result.rows.length<= 0){
      return res.json({
        'mensaje': 'la factura no esta registrada'
      });
    }
    const productos = await pool.query("select * from detalle_factura where id_factura = $1", [req.params.id])

    let facturas = result.rows.map((factura)=>{
      return{
        "factura_id": factura.id,
        "identificacion_cliente": factura.identificacion_cliente,
        "nombre_cliente": factura.nombre_cliente,
        "nombre_cajero": factura.nombre_cajero,
        "totalPagar": factura.totalpagar == null ? 0 : factura.totalpagar,
        "fecha": factura.fecha.toLocaleString()
      }
    })

    res.json({
      "DATOS ": facturas,
      "productos" : productos.rows
    });
  } catch (error) {

    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }
};

const obtenerFacturasCliente = async (req, res) => {
  try {
    const result = await pool.query('select factura.id, clientes.identificacion as identificacion_cliente, clientes.nombres as nombre_cliente, cajero.nombres as nombre_cajero, factura.totalpagar, factura.fecha from factura, clientes, cajero where factura.id_cliente = clientes.id  and factura.id_cajero = cajero.id and clientes.identificacion = $1', [req.params.id]);
    
    if(result.rows.length<= 0){
      return res.json({
        'mensaje': 'el usuario no presente facturas con el supermercado'
      });
    }

    let facturas = result.rows.map((factura)=>{
      return{
        "factura_id": factura.id,
        "identificacion_cliente": factura.identificacion_cliente,
        "nombre_cliente": factura.nombre_cliente,
        "nombre_cajero": factura.nombre_cajero,
        "totalPagar": factura.totalpagar == null ? 0 : factura.totalpagar,
        "fecha": factura.fecha.toLocaleString()
      }
    })

    res.json(facturas);

  } catch (error) {

    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }
};

const insertarFactura = async (req, res) => {
  const {idfactura, identificacionCliente, idCajero} = req.body;
  const date = new Date();

  if(idfactura == null || identificacionCliente == null || idCajero == null){
    if (identificacion == null || nombres == null || direccion == null || telefono == null || correo == null){
      return res.status(400).json({
        mensaje: "llenar todos los campos",
      });
    }
  }

  try {
    const id = await pool.query('SELECT id FROM clientes WHERE identificacion = $1', [identificacionCliente]);
    if(id.rows.length <=0){
      return res.status(404).json({
        'mensaje': 'usuario no se encuentra registrado'
      });
    }
  
    const result = await pool.query('INSERT INTO factura (id, id_cliente, id_cajero, fecha) VALUES ($1, $2, $3, $4)', [idfactura, id.rows[0].id, idCajero, date]);
    if(result.rowsAffected<=0){
      return res.status(404).json({
        'mensaje': 'factura no insertada'
      });
    }
    
    res.status(200).json({
      'mensaje': 'FACTURA REGISTRADA'
    });

  } catch (error) {
    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }

};

const actualizarFactura = async (req, res) => {
  const {identificacionCliente, idCajero} = req.body;

  if(identificacionCliente == null || idCajero == null){
    return res.status(400).json({
      mensaje: "llenar todos los campos",
    });
    
  }

  try {
    const id = await pool.query('SELECT id FROM clientes WHERE identificacion = $1', [identificacionCliente]);
    if(id.rows.length <=0){
      return res.status(404).json({
        'mensaje': 'usuario no se encuentra registrado'
      });
    }

    const result = await pool.query('UPDATE factura SET id_cliente = $1, id_cajero = $2 WHERE id = $3', [id.rows[0].id, idCajero, req.params.id]);
  
    if(result.rowCount<=0){
      return res.status(404).json({
        'mensaje': 'factura no insertado'
      });
    }
  
    res.status(200).json({
      'mensaje': 'FACTURA ACTUALIZADA'
    });

  } catch (error) {
    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }
};

const actualizarPago = async (req, res) => {

  try {
    const productos = await pool.query('SELECT total FROM detalle_factura WHERE id_factura = $1', [req.params.id]);

    if(productos.rows.length <=0){
      return res.status(404).json({
        'mensaje': 'factura no se encuentra registrada'
      });
    }

    let total= 0;

    productos.rows.forEach((valor)=>{
      total += valor.total;
    })

    const result = await pool.query('UPDATE factura SET totalpagar = $1 WHERE id = $2', [total, req.params.id]);
  
    if(result.rowCount<=0){
      return res.status(404).json({
        'mensaje': 'factura no insertado'
      });
    }
  
    res.status(200).json({
      'mensaje': 'FACTURA ACTUALIZADA'
    });

  } catch (error) {
    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }
};

const eliminarFactura = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM factura WHERE id = $1", [req.params.id]);

    if(result.rowCount<=0){
      return res.status(404).json({
        'mensaje': 'error al eliminar factura'
      });
    }

    res.status(200).json({
      'mensaje': 'FACTURA ELIMINADA'
    });

  } catch (error) {
    res.status(500).json({
      'mensaje': 'error interno 🚨📢🚩❌‼'
    });
  }
};

export {
  obtenerFacturas,
  obtenerFactura,
  obtenerFacturasCliente,
  insertarFactura,
  actualizarFactura,
  actualizarPago,
  eliminarFactura,
};
