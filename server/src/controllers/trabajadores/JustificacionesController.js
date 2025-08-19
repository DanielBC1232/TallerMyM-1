// controllers/trabajadores/justificacionController.js
import { Justificacion, JustificacionRepository } from '../../models/trabajadores/justificaciones.js';

const justificacionRepo = new JustificacionRepository();

// Operaciones CRUD
const insertJustificacion = async (req, res) => {
  try {
    const { idAusencia, motivo, estado } = req.body;
    const newJustificacion = new Justificacion(idAusencia, motivo, estado);

    await justificacionRepo.insertJustificacion(newJustificacion);
    res.status(201).json(newJustificacion);
  } catch (error) {
    console.error("Error al insertar justificación:", error);
    res.status(500).json({ error: "Error al insertar justificación" });
  }
};

const updateJustificacion = async (req, res) => {
  try {
    const idJustificacion = req.params.idJustificacion;
    const datosActualizados = req.body;
    const actualizacionExitosa = await justificacionRepo.updateJustificacion(idJustificacion, datosActualizados);

    if (!actualizacionExitosa) {
      res.status(404).json({ error: "Justificación no encontrada o no se pudo actualizar" });
    } else {
      res.status(200).json({ message: "Justificación actualizada exitosamente" });
    }
  } catch (error) {
    console.error("Error al actualizar justificación:", error);
    res.status(500).json({ error: "Error al actualizar justificación" });
  }
};

const deleteJustificacion = async (req, res) => {
  try {
    const idJustificacion = req.params.idJustificacion;
    const actualizacionExitosa = await justificacionRepo.deleteJustificacion(idJustificacion);

    if (!actualizacionExitosa) {
      res.status(404).json({ error: "Justificación no encontrada o no se pudo eliminar" });
    } else {
      res.status(200).json({ message: "Justificación eliminada exitosamente" });
    }
  } catch (error) {
    console.error("Error al eliminar justificación:", error);
    res.status(500).json({ error: "Error al eliminar justificación" });
  }
};

// Métodos Get
const obtenerJustificaciones = async (req, res) => {
  try {
    const justificaciones = await justificacionRepo.getJustificaciones();
    res.status(200).json(justificaciones);
  } catch (error) {
    console.error("Error al obtener justificaciones:", error);
    res.status(500).json({ error: "Error al obtener justificaciones" });
  }
};

const obtenerJustificacionPorId = async (req, res) => {
  try {
    const { idJustificacion } = req.params;

    if (!idJustificacion) {
      return res.status(400).json({ error: "El ID de justificación es requerido" });
    }

    const justificacion = await justificacionRepo.getJustificacionPorId(idJustificacion);

    if (!justificacion || justificacion.length === 0) {
      res.status(404).json({ error: "Justificación no encontrada" });
    } else {
      res.status(200).json(justificacion[0]);
    }
  } catch (error) {
    console.error("Error al obtener justificación por ID:", error);
    res.status(500).json({ error: "Error al obtener justificación por ID" });
  }
};

const obtenerJustificacionPorAusencia = async (req, res) => {
  try {
    const { idAusencia } = req.params;

    if (!idAusencia) {
      return res.status(400).json({ error: "El ID de ausencia es requerido" });
    }

    const justificacion = await justificacionRepo.getJustificacionPorAusencia(idAusencia);
    
    if (!justificacion || justificacion.length === 0) {
      res.status(404).json({ error: "Justificación no encontrada para esta ausencia" });
    } else {
      res.status(200).json(justificacion[0]);
    }
  } catch (error) {
    console.error("Error al obtener justificación por ausencia:", error);
    res.status(500).json({ error: "Error al obtener justificación por ausencia" });
  }
};

// Exports en formato ESM
export {
  insertJustificacion,
  updateJustificacion,
  deleteJustificacion,
  obtenerJustificaciones,
  obtenerJustificacionPorId,
  obtenerJustificacionPorAusencia
};
