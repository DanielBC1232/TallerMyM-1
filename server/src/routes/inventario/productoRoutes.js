import express from 'express';
import { getAllProductos, getMinMax, getProductoById, addProducto, updateProducto, deleteProducto } from "../../controllers/inventario/productoController.js";
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post("/",authMiddleware, getAllProductos);
router.get("/precios",authMiddleware, getMinMax);
router.get("/:id",authMiddleware, getProductoById);
router.post("/agregar-producto/",authMiddleware, addProducto);
router.put("/actualizar-producto/",authMiddleware, updateProducto);
router.delete("/eliminar-producto/:id",authMiddleware, deleteProducto);

export default router;