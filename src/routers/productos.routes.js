import  Router from "express";
import { actualizarProductos, eliminarProductos, insertarProductos, obtenerProducto, obtenerProductos } from "../controllers/productos.controller.js";

const router = Router();

router.get('/productos', obtenerProductos);

router.get('/productos/:id', obtenerProducto);

router.post('/productos', insertarProductos);

router.delete('/productos/:id', eliminarProductos);

router.put('/productos/:id', actualizarProductos);

export default router;