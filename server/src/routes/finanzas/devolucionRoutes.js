import express from 'express';
import * as devolucionController from '../../controllers/finanzas/devolucionController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post("/registrar-devolucion/", authMiddleware, devolucionController.insertDevolucion);
router.get("/obtener-devolucion/:id", authMiddleware, devolucionController.getDevolucionById);

export default router;