import { ProveedorRepository } from "../../models/inventario/proveedor.js";

const proveedorRepo = new ProveedorRepository();

// Obtener todos los proveedores
export const getAllProveedor = async (_req, res) => {
    try {
        const proveedor = await proveedorRepo.getAll(); // Get
        //validaciones
        res.json(proveedor);
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener los proveedores" });
    }
};

// Obtener un proveedor por ID
export const getProveedorById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const proveedor = await proveedorRepo.findById(id); // Get
        // Validaciones - return
        if (!proveedor) {
            res.status(404).json({ error: "Proveedor no encontrado" }); // Return
        }
        res.json(proveedor); //Return exitoso
    }
    catch (error) {
        console.error("Error en getProveedorById:", error);
        res.status(500).json({ error: "Error al obtener el proveedor" });
    }
};