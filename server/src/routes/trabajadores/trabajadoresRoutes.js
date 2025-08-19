import express from 'express';
import * as trabajadorController from '../../controllers/trabajadores/trabajadoresController.js';
import * as SolicitudController from '../../controllers/trabajadores/SolicitudController.js';
import * as AmonestacionController from '../../controllers/trabajadores/AmonestacionesController.js';
import * as AusenciaController from '../../controllers/trabajadores/AusenciasController.js';
import * as JustificacionController from '../../controllers/trabajadores/JustificacionesController.js';
import authMiddleware from '../../middleware/authMiddleware.js';


const router = express.Router();
//TRABAJADORES
// Rutas CRUD Trabajadores
router.post("/agregar-trabajador/",authMiddleware, trabajadorController.insertTrabajador);
router.put("/actualizar-trabajador/",authMiddleware, trabajadorController.updateTrabajador);
router.delete("/eliminar-trabajador/:id",authMiddleware, trabajadorController.deleteTrabajador);
//Rutas Obtener
router.get("/obtener-trabajadores",authMiddleware, trabajadorController.getTrabajadores);
router.get("/obtener-trabajador/:id",authMiddleware, trabajadorController.getTrabajadorById);
router.post("/trabajador/cedula/", authMiddleware, trabajadorController.getTrabajadorByCedula);


//TRABAJAORES-VACACIONES
// Rutas CRUD Vacaciones
router.post("/Solicitud-Vacaciones",authMiddleware, SolicitudController.InsertSolicitudVacaciones);
router.put("/Edit-Vacaciones/:idVacaciones",authMiddleware, SolicitudController.UpdateSolicitudVacaciones);
router.delete("/Elim-Vacaciones/:idVacaciones",authMiddleware, SolicitudController.DeleteSolicitudVacaciones);
//Rutas Get
router.get("/obteneTrabajadoresMenu",authMiddleware, trabajadorController.obtenerTrabajadoresMenuDesplegable);
router.get("/obtenerSolicitudVacaciones",authMiddleware, SolicitudController.ObtenerVacacionesGest);
router.get("/obtenerSolicitudVacacion/:idVacaciones",authMiddleware, SolicitudController.ObtenerVacacionxID);
//aprobar y rechazar
router.put("/Aprob-Vacaciones/:idVacaciones",authMiddleware, SolicitudController.AprobarSolicitudVacaciones);
router.put("/Rechazar-Vacaciones/:idVacaciones",authMiddleware, SolicitudController.RechazarSolicitudVacaciones);
// Rutas para obtener las solicitudes de vacaciones por cedula
router.get("/ObtenerVacacioneCedula/:cedula", authMiddleware, SolicitudController.ObtenerVacacionesPorCedula);

// AMONESATACIONES--
// Operaciones CRUD
router.post("/Insert-Amonestacion",authMiddleware, AmonestacionController.InsertAmonestacion);
router.put("/Edit-Amonestacion/:idAmonestacion",authMiddleware, AmonestacionController.UpdateAmonestacion);
router.delete("/Elim-Amonestacion/:idAmonestacion",authMiddleware, AmonestacionController.DeleteAmonestacion);
// Rutas Get
router.get("/obtenerAmonestaciones",authMiddleware, AmonestacionController.ObtenerAmonestaciones);
router.get("/obtenerAmonestacion/:idAmonestacion",authMiddleware, AmonestacionController.ObtenerAmonestacionxID);
router.get("/historialAmonestaciones/:cedula",authMiddleware, AmonestacionController.ObtenerAmonestacionesPorCedula);

// AUSENCIAS--
// Operaciones CRUD
router.post("/insert-ausencia",authMiddleware, AusenciaController.insertAusencia);
router.put("/update-ausencia/:idAusencia",authMiddleware, AusenciaController.updateAusencia);
router.delete("/delete-ausencia/:idAusencia",authMiddleware, AusenciaController.deleteAusencia);
// Rutas Get
router.get("/obtener-ausencias",authMiddleware, AusenciaController.obtenerAusencias);
router.get("/obtener-ausencia/:idAusencia",authMiddleware, AusenciaController.obtenerAusenciaPorId);
router.get("/obtener-ausencias-trabajador/:idTrabajador",authMiddleware, AusenciaController.obtenerAusenciasPorTrabajador);


// JUSTIFICACIONES
// Operaciones CRUD
router.post("/insert-justificacion",authMiddleware, JustificacionController.insertJustificacion);
router.put("/update-justificacion/:idJustificacion",authMiddleware, JustificacionController.updateJustificacion);
router.delete("/delete-justificacion/:idJustificacion",authMiddleware, JustificacionController.deleteJustificacion);
// Rutas Get
router.get("/obtener-justificaciones",authMiddleware, JustificacionController.obtenerJustificaciones);
router.get("/obtener-justificacion/:idJustificacion",authMiddleware, JustificacionController.obtenerJustificacionPorId);
router.get("/obtener-justificacion-ausencia/:idAusencia",authMiddleware, JustificacionController.obtenerJustificacionPorAusencia);


//REPORTES--
//Reporte de trabajadores mas eficientes
router.get("/trabajadores-eficientes",authMiddleware, trabajadorController.getTrabajadoresEficientes);

// Exporta el router usando Module ES
export default router;