import express from 'express';
import { getAllSolicitud, addSolicitud, updateSolicitud, getHistorialSolicitudes } from "../../controllers/inventario/solicitudController.js";
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get("/solicitud",authMiddleware, getAllSolicitud);
router.post("/agregar-solicitud",authMiddleware, addSolicitud);
router.put("/procesar-solicitud",authMiddleware, updateSolicitud);
router.get("/solicitud-calificadas",authMiddleware, getAllSolicitud);
router.get("/historial-solicitudes",authMiddleware, getHistorialSolicitudes);

export default router;