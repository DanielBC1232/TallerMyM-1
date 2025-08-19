import express from 'express';
import * as notificacionesController from '../../controllers/notificaciones/notificacionesController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post("/obtener-notificaciones/",authMiddleware, notificacionesController.getNotificaciones);
router.delete("/eliminar-notificacion/:id",authMiddleware, notificacionesController.EliminarNotificacion);

export default router;