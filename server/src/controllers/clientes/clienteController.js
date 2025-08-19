import { Cliente, ClienteRepository } from "../../models/clientes/cliente.js";

const clienteRepo = new ClienteRepository();

// Insertar un cliente
const insertCliente = async (req, res) => {
    try {
        const { nombre, apellido, cedula, correo, telefono } = req.body;

        await clienteRepo.insert(nombre, apellido, cedula, correo, telefono);
        res.status(201).json();
    } catch (error) {
        if (error.status === 409) {
            return res.status(409).json({ error: error.message });
        }
        console.error("Error al insertar cliente:", error);
        res.status(500).json({ error: "Error al insertar el cliente" });
    }
};

// Actualizar cliente
const actualizarCliente = async (req, res) => {
    try {
        const cedula = req.params.cedula;
        const datosActualizados = req.body;

        const actualizacionExitosa = await clienteRepo.updateCliente(cedula, datosActualizados);

        if (!actualizacionExitosa) {
            return res.status(404).json({ error: "Cliente no encontrado o no se pudo actualizar" });
        }

        res.status(200).json({ message: "Datos del cliente actualizados exitosamente" });
    } catch (error) {
        if (error.status === 409) {
            return res.status(409).json({ error: error.message });
        }
        console.error("Error al actualizar cliente:", error);
        res.status(500).json({ error: "Error al actualizar los datos del cliente" });
    }
};

// Eliminar cliente
const eliminarCliente = async (req, res) => {
    try {
        const cedula = req.params.cedula;
        const clienteEliminado = await clienteRepo.deleteCliente(cedula);

        if (!clienteEliminado) {
            res.status(404).json({ error: "Cliente no encontrado o no se pudo eliminar" });
        } else {
            res.status(200).json({ message: "Cliente eliminado exitosamente" });
        }
    } catch (error) {
        console.error("Error al eliminar cliente:", error);
        res.status(500).json({ error: "Error al eliminar cliente" });
    }
};

// Obtener todos los clientes
const obtenerTodosLosClientes = async (req, res) => {
    try {
        // Usar el método getAll del repositorio
        const clientes = await clienteRepo.getAll();

        res.status(200).json(clientes);
    } catch (error) {
        console.error("Error al obtener todos los clientes:", error);
        res.status(500).json({ error: "Error al obtener todos los clientes" });
    }
};

// Obtener un cliente por cédula
const obtenerClientePorCedula = async (req, res) => {
    try {
        const { cedula } = req.params; // Obtener la cédula del parámetro de la ruta

        if (!cedula) {
            return res.status(400).json({ error: "La cédula es requerida" });
        }

        const cliente = await clienteRepo.getByCedula(cedula);

        if (!cliente || cliente.length === 0) {
            res.status(404).json({ error: "Cliente no encontrado" });
        } else {
            res.status(200).json(cliente[0]); // Devuelve el primer cliente encontrado
        }
    } catch (error) {
        console.error("Error al obtener cliente por cédula:", error);
        res.status(500).json({ error: "Error al obtener cliente por cédula" });
    }
};
//-----IGNORARF Obtener Historial de Órdenes de Cliente
const getHistorialOrdenesByCedula = async (req, res) => {
    try {
        const cedula = req.params.cedula;
        const historialOrdenes = await clienteRepo.getHistorialOrdenesByCedula(cedula);

        if (!historialOrdenes || historialOrdenes.length === 0) {
            res.status(404).json({ error: "No se encontraron (backendControll) órdenes para este cliente" });
            return;
        }
        res.json(historialOrdenes);
    } catch (error) {
        console.error("Error en getHistorialOrdenesByCedula:", error);
        res.status(500).json({ error: "Error al obtener el historial de órdenes" });
    }
};

// Obtener todos los clientes
const getClientesInactivos = async (_req, res) => {
    try {
        const clientes = await clienteRepo.getClientesInactivos();
        if (!clientes || clientes.length === 0) {
            return res.status(404).json({ error: "No hay clientes inactivos" });
        }
        res.status(200).json(clientes);
    } catch (error) {
        console.error("Error al obtener clientes inactivos:", error);
        res.status(500).json({ error: "Error al obtener los clientes inactivos" });
    }
};

export {
    insertCliente,
    obtenerTodosLosClientes,
    obtenerClientePorCedula,
    getHistorialOrdenesByCedula,
    actualizarCliente,
    eliminarCliente,
    getClientesInactivos
};