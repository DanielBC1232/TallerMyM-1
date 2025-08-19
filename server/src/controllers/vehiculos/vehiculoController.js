import { Vehiculo, VehiculoRepository } from "../../models/vehiculos/vehiculo.js";

const VehiculoRepo = new VehiculoRepository();

// Insertar un vehiculo
const insertarVehiculo = async (req, res) => {
  try {
    const { placaVehiculo, modeloVehiculo, marcaVehiculo, annoVehiculo, tipoVehiculo, idCliente } = req.body;

    // Verificar si la placa ya existe
    const vehiculoExistente = await VehiculoRepo.checkIfVehiculoExists(placaVehiculo);
    if (vehiculoExistente) {
      return res.status(409).json({ error: "La placa del vehículo ya está registrada" });
    }
    
    // Insertar en la base de datos
    await VehiculoRepo.insert(placaVehiculo, modeloVehiculo, marcaVehiculo, annoVehiculo, tipoVehiculo, idCliente);
    res.status(201).json();
  } catch (error) {
    console.error("Error al insertar vehiculo:", error);
    res.status(500).json({ error: "Error al insertar el vehículo" });
  }
};

//-----------------------------------------------
// Actualizar vehiculo

const actualizarVehiculo = async (req, res) => {
  try {
    const idVehiculo = req.params.idVehiculo;
    const datosActualizados = req.body;
    const actualizacionExitosa = await VehiculoRepo.updateVehiculo(idVehiculo, datosActualizados);

    if (!actualizacionExitosa) {
      res.status(404).json({ error: "Vehiculo no encontrado o no se pudo actualizar" });
    } else {
      res.status(200).json({ message: "Datos del vehiculo actualizados exitosamente" });
    }
  } catch (error) {
    console.error("Error al actualizar vehiculo:", error);
    res.status(500).json({ error: "Error al actualizar los datos del vehiculo" });
  }
};

// Eliminar vehiculo
const eliminarVehiculo = async (req, res) => {
  try {
    const idVehiculo = parseInt(req.params.idVehiculo);
    const vehiculoEliminado = await VehiculoRepo.deleteVehiculo(idVehiculo);

    if (!vehiculoEliminado) {
      res.status(404).json({ error: "Vehiculo no encontrado o no se pudo eliminar" });
    } else {
      res.status(200).json({ message: "Vehiculo eliminado exitosamente" });
    }
  } catch (error) {
    console.error("Error al eliminar Vehiculo:", error);
    res.status(500).json({ error: "Error al eliminar Vehiculo" });
  }
};

// Obtener todos los vehiculos
const obtenerTodosLosVehiculos = async (req, res) => {
  try {
    // Usar el método getAll del repositorio
    const vehiculos = await VehiculoRepo.getAll();

    res.status(200).json(vehiculos);
  } catch (error) {
    console.error("Error al obtener todos los vehiculos:", error);
    res.status(500).json({ error: "Error al obtener todos los vehiculos" });
  }
};

// Obtener vehiculos por cliente
const getVehiculosPorCliente = async (req, res) => {
  try {
    // Usar el método getVehiculosPorCliente del repositorio
    const idCliente = parseInt(req.params.idCliente);

    const vehiculos = await VehiculoRepo.getVehiculosPorCliente(idCliente);

    res.status(200).json(vehiculos);
  } catch (error) {
    console.error("Error al obtener los vehiculos del cliente:", error);
    res.status(500).json({ error: "Error al obtener los vehiculos del cliente" });
  }
};

// Obtener un vehiculo por idVehiculo
const obtenerVehiculoPoridVehiculo = async (req, res) => {
  try {
    const { idVehiculo } = req.params; // Obtener el ID del vehículo del parámetro de la ruta

    if (!idVehiculo) {
      return res.status(400).json({ error: "El ID del vehículo es requerido" });
    }

    const vehiculo = await VehiculoRepo.getVehiculosPorIdVehiculo(parseInt(idVehiculo));

    if (!vehiculo || vehiculo.length === 0) {
      res.status(404).json({ error: "Vehículo no encontrado" });
    } else {
      res.status(200).json(vehiculo[0]); // Devuelve el primer vehículo encontrado
    }
  } catch (error) {
    console.error("Error al obtener vehículo por ID:", error);
    res.status(500).json({ error: "Error al obtener vehículo por ID" });
  }
};

// Obtener un vehiculo por placa
const obtenerVehiculoPorPlaca = async (req, res) => {
  try {
    const { placaVehiculo } = req.params; // Obtener la placa del parámetro de la ruta

    if (!placaVehiculo) {
      return res.status(400).json({ error: "La placa es requerida" });
    }

    const vehiculo = await VehiculoRepo.getByPlaca(placaVehiculo);

    if (!vehiculo || vehiculo.length === 0) {
      res.status(404).json({ error: "Vehículo no encontrado" });
    } else {
      res.status(200).json(vehiculo[0]); // Devuelve el primer vehículo encontrado
    }
  } catch (error) {
    console.error("Error al obtener vehículo por placa:", error);
    res.status(500).json({ error: "Error al obtener vehículo por placa" });
  }
};

export {
  insertarVehiculo,
  actualizarVehiculo,
  eliminarVehiculo,
  obtenerTodosLosVehiculos,
  obtenerVehiculoPorPlaca,
  obtenerVehiculoPoridVehiculo,
  getVehiculosPorCliente
};