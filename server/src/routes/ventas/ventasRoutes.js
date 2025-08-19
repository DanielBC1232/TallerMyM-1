import express from 'express';
import * as ventasController from '../../controllers/ventas/ventasController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post("/registrar-venta/",authMiddleware, ventasController.insertVenta);
router.post("/obtener-ventas",authMiddleware, ventasController.getVentas);
router.get("/obtener-venta/:id",authMiddleware, ventasController.getVentaById);
router.post("/agregar-producto/",authMiddleware, ventasController.agregarProducto);
router.get("/obtener-productos-venta/:id",authMiddleware, ventasController.getProductosVenta);
router.post("/eliminar-producto-venta/",authMiddleware, ventasController.deleteProductoVenta);
router.get("/existe-pago/:id",authMiddleware, ventasController.existePago);
router.post("/actualizar-producto-venta/",authMiddleware, ventasController.actualizarProductoVenta);
// Exporta el router usando Module ES
export default router;