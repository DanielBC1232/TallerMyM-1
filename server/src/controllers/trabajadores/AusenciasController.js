import { AusenciaRepository } from "../../models/trabajadores/ausencia.js";

const ausenciaRepo = new AusenciaRepository();

// Operaciones CRUD
const insertAusencia = async (req, res) => {
  try {
    const { idTrabajador, fechaAusencia, justificada } = req.body;
    const newAusencia = await ausenciaRepo.insertAusencia(idTrabajador,fechaAusencia,justificada);

    res.status(201).json({message: "Trabajador insertado correctamente",rowsAffected: newAusencia});
  } catch (error) {
    console.error("Error al insertar ausenciaCONTROLLER:", error);
    res
      .status(500)
      .json({ error: "Error al insertar ausenciaausenciaCONTROLLER" });
  }
};

const updateAusencia = async (req, res) => {
  try {
    const { idAusencia } = req.params;
    const datosActualizados = req.body;
    const actualizacionExitosa = await ausenciaRepo.updateAusencia(
      idAusencia,
      datosActualizados
    );

    if (!actualizacionExitosa) {
      res
        .status(404)
        .json({ error: "Ausencia no encontrada o no se pudo actualizar" });
    } else {
      res.status(200).json({ message: "Ausencia actualizada exitosamente" });
    }
  } catch (error) {
    console.error("Error al actualizar ausencia:", error);
    res.status(500).json({ error: "Error al actualizar ausencia" });
  }
};

const deleteAusencia = async (req, res) => {
  try {
    const { idAusencia } = req.params;
    const eliminacionExitosa = await ausenciaRepo.deleteAusencia(idAusencia);

    if (!eliminacionExitosa) {
      res
        .status(404)
        .json({ error: "Ausencia no encontrada o no se pudo eliminar" });
    } else {
      res.status(200).json({ message: "Ausencia eliminada exitosamente" });
    }
  } catch (error) {
    console.error("Error al eliminar ausencia:", error);
    res.status(500).json({ error: "Error al eliminar ausencia" });
  }
};

// Métodos GET--inner
const obtenerAusencias = async (req, res) => {
  try {
    const ausencias = await ausenciaRepo.getAusencias();
    res.status(200).json(ausencias);
  } catch (error) {
    console.error("Error al obtener ausencias:", error);
    res.status(500).json({ error: "Error al obtener ausencias" });
  }
};

const obtenerAusenciaPorId = async (req, res) => {
  try {
    const { idAusencia } = req.params;

    if (!idAusencia) {
      return res.status(400).json({ error: "El ID de ausencia es requerido" });
    }

    const ausencia = await ausenciaRepo.getAusenciaPorId(idAusencia);

    if (!ausencia || ausencia.length === 0) {
      res.status(404).json({ error: "Ausencia no encontrada" });
    } else {
      res.status(200).json(ausencia[0]);
    }
  } catch (error) {
    console.error("Error al obtener ausencia por ID:", error);
    res.status(500).json({ error: "Error al obtener ausencia por ID" });
  }
};

const obtenerAusenciasPorTrabajador = async (req, res) => {
  try {
    const { idTrabajador } = req.params;

    if (!idTrabajador) {
      return res
        .status(400)
        .json({ error: "El ID de trabajador es requerido" });
    }

    const ausencias = await ausenciaRepo.getAusenciasPorTrabajador(
      idTrabajador
    );
    res.status(200).json(ausencias);
  } catch (error) {
    console.error("Error al obtener ausencias por trabajador:", error);
    res
      .status(500)
      .json({ error: "Error al obtener ausencias por trabajador" });
  }
};

// Exportación al final
export {
  insertAusencia,
  updateAusencia,
  deleteAusencia,
  obtenerAusencias,
  obtenerAusenciaPorId,
  obtenerAusenciasPorTrabajador,
};
