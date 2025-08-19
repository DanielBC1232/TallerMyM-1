import { VehiculoRepository } from "../../models/inventario/vehiculosCompatibles.js";

const vehiculosRepo = new VehiculoRepository();

// Obtener todos los Vehiculos
export const getAllVehiculos = async (_req, res) => {
    try {
        const vehiculo = await vehiculosRepo.getAll(); // Get
        //validaciones
        res.json(vehiculo);
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener los vehiculos" });
    }
};

// Obtener un vehiculo por ID
export const getVehiculoById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const vehiculo = await vehiculosRepo.findById(id); // Get
        // Validaciones - return
        if (!vehiculo) {
            res.status(404).json({ error: "Vehiculo no encontrado" }); // Return
        }
        res.json(vehiculo); //Return exitoso
    }
    catch (error) {
        console.error("Error en getVehiculoById:", error);
        res.status(500).json({ error: "Error al obtener el vehiculo" });
    }
};