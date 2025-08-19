import express from "express";
import * as clienteController from "../../controllers/clientes/clienteController.js";
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

// Ruta para registrar un cliente (pública)
router.post("/registrar", clienteController.insertCliente);

// Rutas protegidas con el middleware de autenticación
router.put('/editar/:cedula', authMiddleware, clienteController.actualizarCliente);
router.delete('/eliminar/:cedula', authMiddleware, clienteController.eliminarCliente);

// Rutas protegidas para obtener información de clientes
router.get("/obtener-clientes", authMiddleware, clienteController.obtenerTodosLosClientes);
router.get("/obtener-clientes-inactivos", authMiddleware, clienteController.getClientesInactivos);
router.get("/:cedula", authMiddleware, clienteController.obtenerClientePorCedula);

export default router;
