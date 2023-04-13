import  Router from "express";
import { actualizarCliente, eliminarCliente, insertarCliente, obtenerCliente, obtenerClientes } from "../controllers/clientes.controller.js";

const router = Router();

router.get('/clientes', obtenerClientes);

router.get('/clientes/:id', obtenerCliente);

router.post('/clientes', insertarCliente);

router.delete('/clientes/:id', eliminarCliente);

router.put('/clientes/:id', actualizarCliente);

export default router;