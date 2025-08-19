import express from "express";
import * as emailController from "../../controllers/clientes/emailController.js";

const router = express.Router();

// POST /api/email/cliente/:idCliente
router.post('/cliente/:idCliente', emailController.enviarCorreoCliente);

export default router;