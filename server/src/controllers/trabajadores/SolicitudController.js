import { SolicitudRepository } from "../../models/trabajadores/solicitud.js";

const solicitudRepo = new SolicitudRepository();

//Solicitud de Vacaciones--
//Operaciones CRUD
const InsertSolicitudVacaciones = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, idTrabajador } = req.body;
    const newSolicitud = await solicitudRepo.InsertSolicitud(fechaInicio, fechaFin, idTrabajador);

    res.status(201).json({ message: "Vacaciones solicitadas correctamente", rowsAffected: newSolicitud });
  } catch (error) {
    console.error("Error al insertar solicitud controller:", error);
    res.status(500).json({ error: "Error al insertar solicitud controller" });
  }
};

const UpdateSolicitudVacaciones = async (req, res) => {
  try {
    const idVacaciones = req.params.idVacaciones;
    const datosActualizados = req.body;
    const actualizacionExitosa = await solicitudRepo.UpdateSolicitud(idVacaciones, datosActualizados);

    if (!actualizacionExitosa) {
      res.status(404).json({ error: "Solicitud de vacaciones no encontrada o no se pudo actualizar" });
    } else {
      res.status(200).json({ message: "Solicitud de vacaciones actualizada exitosamente" });
    }
  } catch (error) {
    console.error("Error al actualizar solicitud de vacaciones:", error);
    res.status(500).json({ error: "Error al actualizar la solicitud de vacaciones" });
  }
};

const DeleteSolicitudVacaciones = async (req, res) => {
  try {
    const idVacaciones = req.params.idVacaciones;
    const eliminacionExitosa = await solicitudRepo.DeleteSolicitud(idVacaciones);

    if (!eliminacionExitosa) {
      res.status(404).json({ error: "Solicitud de vacaciones no encontrada o no se pudo eliminar" });
    } else {
      res.status(200).json({ message: "Solicitud de vacaciones eliminada exitosamente" });
    }
  } catch (error) {
    console.error("Error al eliminar solicitud de vacaciones:", error);
    res.status(500).json({ error: "Error al eliminar la solicitud de vacaciones" });
  }
};

//Aprobar y Rechazar---
const AprobarSolicitudVacaciones = async (req, res) => {
  try {
    const idVacaciones = req.params.idVacaciones;
    const aprobacionExitosa = await solicitudRepo.AprobarSolicitud(idVacaciones);

    if (!aprobacionExitosa) {
      res.status(404).json({ error: "Solicitud de vacaciones no encontrada o no se pudo aprobar" });
    } else {
      res.status(200).json({ message: "Solicitud de vacaciones aprobada exitosamente" });
    }
  } catch (error) {
    console.error("Error al aprobar solicitud de vacaciones:", error);
    res.status(500).json({ error: "Error al aprobar la solicitud de vacaciones" });
  }
};

const RechazarSolicitudVacaciones = async (req, res) => {
  try {
    const idVacaciones = req.params.idVacaciones;
    const { motivoRechazo } = req.body;
    const rechazoExitoso = await solicitudRepo.RechazarSolicitud(idVacaciones, motivoRechazo);

    if (!rechazoExitoso) {
      res.status(404).json({ error: "Solicitud de vacaciones no encontrada o no se pudo rechazar" });
    } else {
      res.status(200).json({ message: "Solicitud de vacaciones rechazada exitosamente" });
    }
  } catch (error) {
    console.error("Error al rechazar solicitud de vacaciones:", error);
    res.status(500).json({ error: "Error al rechazar la solicitud de vacaciones" });
  }
};

//Metodos Get
//ObtenerVacaciones
const ObtenerVacacionesGest = async (req, res) => {
  try {
    const Vacaciones = await solicitudRepo.getVacacionesGest();

    res.status(200).json(Vacaciones);
  } catch (error) {
    console.error("Error al obtener todas las Solicitudes de Vacaciones:", error);
    res.status(500).json({ error: "Error al obtener todas las Solicitudes de Vacaciones" });
  }
};

//ObtenerVacacion
const ObtenerVacacionxID = async (req, res) => {
  try {
    const { idVacaciones } = req.params; // Obtener el ID de la solicitud de vacaciones


    const vacacion = await solicitudRepo.getVacionPorIdVacacion(idVacaciones);

    if (!vacacion) {
      res.status(400)
      console.log("Error400")
    };
    res.status(200).json(vacacion)
  } catch (error) {
    console.error("Error al obtener solicitud de vacaciones por ID:controller", error);
    res.status(500).json({ error: "Error al obtener solicitud de vacaciones por IDcontroller" });
  }
}
// Obtener vacaciones por cedula
const ObtenerVacacionesPorCedula = async (req, res) => {
  try {
    const cedula = req.params.cedula; // Obtener la cédula del trabajador desde los parámetros de la solicitud
    const vacaciones = await solicitudRepo.getVacacionesCedula(cedula); // Llamar al método del repositorio para obtener las vacaciones por cédula

    if (!vacaciones) {
      return res.status(404).json({ error: "No se encontraron vacaciones para esta cédula" });
    }
    
    res.status(200).json(vacaciones);
  } catch (error) {
    console.error("Error al obtener vacaciones por cédula:", error);
    res.status(500).json({ error: "Error al obtener vacaciones por cédula" });
  }
}

export {
  InsertSolicitudVacaciones,
  UpdateSolicitudVacaciones,
  DeleteSolicitudVacaciones,
  AprobarSolicitudVacaciones,
  RechazarSolicitudVacaciones,
  ObtenerVacacionesGest,
  ObtenerVacacionxID,
  ObtenerVacacionesPorCedula
};