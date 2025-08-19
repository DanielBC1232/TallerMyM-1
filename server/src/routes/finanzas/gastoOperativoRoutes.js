import express from 'express';
import * as gastoOperativoController from '../../controllers/finanzas/gastoOperativoController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post("/agregar-gasto-operativo/", authMiddleware, gastoOperativoController.insertGastoOperativo);
router.get("/obtener-gastos-operativos/", authMiddleware, gastoOperativoController.getGastoOperativos);

export default router;