import express from 'express';
import { getAllProveedor, getProveedorById } from "../../controllers/inventario/proveedorController.js";
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get("/",authMiddleware, getAllProveedor); // GET /api/categorias
router.get("/:id",authMiddleware, getProveedorById); // GET /api/categorias/:id

export default router;