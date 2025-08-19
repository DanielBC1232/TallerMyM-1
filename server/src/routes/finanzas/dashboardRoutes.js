import express from 'express';
import * as dashboardController from '../../controllers/finanzas/dashboardController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

// Rutas protegidas con el middleware de autenticación
router.get("/obtener-ganancia-mes", authMiddleware, dashboardController.getGananciaMes);
router.get("/obtener-gasto-mes", authMiddleware, dashboardController.getGastoMes);

router.get("/obtener-ganancias-mes", authMiddleware, dashboardController.getGananciasMes);
router.get("/obtener-gastos-mes", authMiddleware, dashboardController.getGastosMes);

router.get("/obtener-top-ventas", authMiddleware, dashboardController.getTopVentas);

export default router;
