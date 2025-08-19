import express from 'express';
import { getAllMarcas, getMarcaById } from "../../controllers/inventario/marcaController.js";
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get("/",authMiddleware, getAllMarcas); // GET /marca
router.get("/:id",authMiddleware, getMarcaById); // GET /marca/:id

export default router;