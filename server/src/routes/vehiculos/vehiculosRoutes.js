import express from "express";
import * as vehiculoController from "../../controllers/vehiculos/vehiculoController.js";//
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

//CRUD
router.post("/registrar",authMiddleware, vehiculoController.insertarVehiculo);

router.put("/editar/:idVehiculo",authMiddleware, vehiculoController.actualizarVehiculo);

router.delete("/eliminar/:idVehiculo",authMiddleware, vehiculoController.eliminarVehiculo);

//Obtener
router.get("/cliente-vehiculos/:idCliente",authMiddleware, vehiculoController.getVehiculosPorCliente);
router.get("/ObtenerVehiculos",authMiddleware, vehiculoController.obtenerTodosLosVehiculos);
router.get("/ObtenerVehiculo/:placaVehiculo",authMiddleware, vehiculoController.obtenerVehiculoPorPlaca);
router.get("/ObteneridVehiculo/:idVehiculo",authMiddleware, vehiculoController.obtenerVehiculoPoridVehiculo);

export default router;