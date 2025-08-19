import express from 'express';
import { getAllCategorias, getCategoriaById } from "../../controllers/inventario/categoriaController.js";
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get("/",authMiddleware, getAllCategorias); // GET /categorias
router.get("/:id",authMiddleware, getCategoriaById); // GET /categorias/:id

export default router;