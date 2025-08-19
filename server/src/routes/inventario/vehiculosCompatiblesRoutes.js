import express from 'express';
import { getAllVehiculos, getVehiculoById } from "../../controllers/inventario/vehiculosCompatiblesController.js";
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get("/",authMiddleware, getAllVehiculos);
router.get("/:id",authMiddleware, getVehiculoById);

export default router;