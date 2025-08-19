import express from 'express';
import * as cotizacionController from '../../controllers/ventas/cotizacionController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

// Ruta para agregar cotización
router.post("/agregar-cotizacion/",authMiddleware, cotizacionController.insertCotizacion);
router.get("/obtener-cotizaciones",authMiddleware, cotizacionController.getCotizacion);
router.get("/obtener-cotizacion/:id",authMiddleware, cotizacionController.getCotizacionById);
router.put("/actualizar-cotizacion/",authMiddleware, cotizacionController.updateCotizacion);
router.delete("/eliminar-cotizacion/:id",authMiddleware, cotizacionController.deleteCotizacion);

// Exporta el router usando Module ES
export default router;