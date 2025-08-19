import express from 'express';
import * as ordenController from '../../controllers/flujo/ordenController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

// Ruta para agregar orden
router.post("/agregar-orden/",authMiddleware, ordenController.insertOrden);

// Ruta para obtener lista de ordenes segun su estado
router.get("/obtener-ordenes/:id",authMiddleware, ordenController.getOrdenesByStatus);

// Ruta para obtener orden por ID
router.get("/obtener-orden/:id",authMiddleware, ordenController.getOrdenById);

// Ruta para actualizar orden - cancelar orden (parametro = 0)
router.put("/actualizar-fase-orden/",authMiddleware, ordenController.siguienteFase);

// Ruta para actualizar orden
router.put("/actualizar-orden/",authMiddleware, ordenController.updateOrden);

// Exporta el router usando Module ES
export default router;