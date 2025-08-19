
import { Amonestacion, AmonestacionRepository } from "../../models/trabajadores/amonestaciones.js";
const amonestacionRepo = new AmonestacionRepository();

// Operaciones CRUD
const InsertAmonestacion = async (req, res) => {
  try {
    const { idTrabajador, fechaAmonestacion, tipoAmonestacion, motivo, accionTomada } = req.body;
    const newAmonestacion = new Amonestacion(idTrabajador, fechaAmonestacion, tipoAmonestacion, motivo, accionTomada);

    await amonestacionRepo.InsertAmonestacion(newAmonestacion);
    res.status(201).json(newAmonestacion);
  } catch (error) {
    console.error("Error al insertar amonestación:", error);
    res.status(500).json({ error: "Error al insertar amonestación" });
  }
};

const UpdateAmonestacion = async (req, res) => {
  try {
    const idAmonestacion = req.params.idAmonestacion;
    const datosActualizados = req.body;
    const actualizacionExitosa = await amonestacionRepo.UpdateAmonestacion(idAmonestacion, datosActualizados);

    if (!actualizacionExitosa) {
      res.status(404).json({ error: "Amonestación no encontrada o no se pudo actualizar" });
    } else {
      res.status(200).json({ message: "Amonestación actualizada exitosamente" });
    }
  } catch (error) {
    console.error("Error al actualizar amonestación:", error);
    res.status(500).json({ error: "Error al actualizar amonestación" });
  }
};

const DeleteAmonestacion = async (req, res) => {
  try {
    const idAmonestacion = req.params.idAmonestacion;
    const actualizacionExitosa = await amonestacionRepo.DeleteAmonestacion(idAmonestacion);

    if (!actualizacionExitosa) {
      res.status(404).json({ error: "Amonestación no encontrada o no se pudo eliminar" });
    } else {
      res.status(200).json({ message: "Amonestación eliminada exitosamente" });
    }
  } catch (error) {
    console.error("Error al eliminar amonestación:", error);
    res.status(500).json({ error: "Error al eliminar amonestación" });
  }
};

// Métodos Get--------contiene ejemplo inner
const ObtenerAmonestaciones = async (req, res) => {
  try {
    const amonestaciones = await amonestacionRepo.getAmonestaciones();
    res.status(200).json(amonestaciones);
  } catch (error) {
    console.error("Error al obtener amonestaciones:", error);
    res.status(500).json({ error: "Error al obtener amonestaciones" });
  }
};

const ObtenerAmonestacionxID = async (req, res) => {
  try {
    const idAmonestacion = parseInt(req.params.idAmonestacion);

    const amonestacion = await amonestacionRepo.getAmonestacionPorId(idAmonestacion);
    
    if(!amonestacion){
      res.status(400)
    };      
    res.status(200).json(amonestacion)
  } catch (error) {
    console.error("Error al obtener amonestación por ID:", error);
    res.status(500).json({ error: "Error al obtener amonestación por ID" });
  }
};

//Obtener amonestaciones por cedula
const ObtenerAmonestacionesPorCedula = async (req, res) => {
  try {
    const cedula = req.params.cedula;
    const amonestaciones = await amonestacionRepo.getAmonestacionesPorCedula(cedula);
    
    if (!amonestaciones || amonestaciones.length === 0) {
      return res.status(404).json({ message: "No se encontraron amonestaciones para esta cédula" });
    }
    
    res.status(200).json(amonestaciones);
  } catch (error) {
    console.error("Error al obtener amonestaciones por cédula:", error);
    res.status(500).json({ error: "Error al obtener amonestaciones por cédula" });
  }
}

export {
  InsertAmonestacion,
  UpdateAmonestacion,
  DeleteAmonestacion,
  ObtenerAmonestaciones,
  ObtenerAmonestacionxID,
  ObtenerAmonestacionesPorCedula
};
