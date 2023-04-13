import  Router from "express";
import { actualizarFactura, actualizarPago, eliminarFactura, insertarFactura, obtenerFactura, obtenerFacturas, obtenerFacturasCliente } from "../controllers/facturas.controller.js";

const router = Router();

router.get('/facturas', obtenerFacturas);

router.get('/facturas/:id', obtenerFactura);

router.get('/facturas/cliente/:id', obtenerFacturasCliente);

router.post('/facturas', insertarFactura);

router.delete('/facturas/:id', eliminarFactura);

router.put('/facturas/:id', actualizarFactura);

router.put('/facturas/pago/:id', actualizarPago);

export default router;