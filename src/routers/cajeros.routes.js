import  Router from "express";
import { actualizarCajero, eliminarCajero, insertarCajero, obtenerCajero, obtenerCajeros } from "../controllers/cajeros.controller.js";

const router = Router();

router.get('/cajeros', obtenerCajeros);

router.get('/cajeros/:id', obtenerCajero);

router.post('/cajeros', insertarCajero);

router.delete('/cajeros/:id', eliminarCajero);

router.put('/cajeros/:id', actualizarCajero);

export default router;