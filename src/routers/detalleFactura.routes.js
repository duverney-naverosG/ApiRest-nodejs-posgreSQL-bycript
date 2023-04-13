import  Router from "express";
import { actualizarDetalleFactura, eliminarDetalleFactura, insertarDetalleFactura, obtenerDetalleFactura, obtenerDetalleFacturas } from "../controllers/detalleFacturas.controller.js";

const router = Router();

router.get('/detalleFactura', obtenerDetalleFacturas);

router.get('/detalleFactura/:id', obtenerDetalleFactura);

router.post('/detalleFactura', insertarDetalleFactura);

router.delete('/detalleFactura/:id', eliminarDetalleFactura);

router.put('/detalleFactura/:id', actualizarDetalleFactura);

export default router;