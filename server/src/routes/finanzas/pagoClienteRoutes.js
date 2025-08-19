import express from 'express';
import * as pagoClienteController from '../../controllers/finanzas/pagoClienteController.js';
import authMiddleware from '../../middleware/authMiddleware.js';


const router = express.Router();

router.post("/registrar-pago/", authMiddleware, pagoClienteController.insertPagoCliente);
router.get("/obtener-pago/:id", authMiddleware, pagoClienteController.getPagoClienteById);

export default router;