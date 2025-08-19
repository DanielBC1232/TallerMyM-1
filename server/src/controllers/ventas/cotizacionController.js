import { CotizacionRepository } from '../../models/ventas/cotizacion.js';

// Crear una instancia de CotizacionRepository
const CotizacionRepo = new CotizacionRepository();

const insertCotizacion = async (req, res) => {
    try {
        // Requerir parámetros desde el cuerpo de la solicitud
        const { montoTotal, montoManoObra, tiempoEstimado, detalles, idCliente } = req.body;

        // Usar el método de inserción del repositorio
        const cotizacion = await CotizacionRepo.insertCotizacion(montoTotal, montoManoObra, tiempoEstimado, detalles, idCliente);

        // Enviar la respuesta
        res.status(200).json({ message: "Cotización insertada correctamente", rowsAffected: cotizacion });
    } catch (error) {
        console.error("Error al insertar cotización:", error);
        res.status(500).json({ error: "Error al insertar cotización" });
    }
};

const getCotizacion = async (_req, res) => {
    try {
        // Usar el método de listado del repositorio
        const cotizacion = await CotizacionRepo.getCotizacion();

        // Enviar la respuesta
        res.status(200).json(cotizacion);
    } catch (error) {
        console.error("Error al obtener cotizaciones:", error);
        res.status(500).json({ error: "Error al obtener cotizaciones" });
    }
};

const getCotizacionById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Usar el método de listado del repositorio
        const cotizacion = await CotizacionRepo.getCotizacionById(id);

        // Enviar la respuesta
        res.status(200).json(cotizacion);
    } catch (error) {
        console.error("Error al obtener cotización por ID:", error);
        res.status(500).json({ error: "Error al obtener cotización por ID" });
    }
};

const updateCotizacion = async (req, res) => {
    try {
        // Requerir parámetros desde el cuerpo de la solicitud
        const { idCotizacion, montoTotal, montoManoObra, tiempoEstimado, detalles } = req.body;

        // Usar el método de actualizar del repositorio
        const cotizacion = await CotizacionRepo.updateCotizacion(idCotizacion, montoTotal, montoManoObra, tiempoEstimado, detalles);

        // Enviar la respuesta
        res.status(200).json({ message: "Cotización actualizada correctamente", rowsAffected: cotizacion });
    } catch (error) {
        console.error("Error al actualizar cotización:", error);
        res.status(500).json({ error: "Error al actualizar cotización" });
    }
};

const deleteCotizacion = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (!id) {
            return res.status(400).json({ error: "ID de cotización no proporcionado" });
        }

        const rowsAffected = await CotizacionRepo.deleteCotizacion(id);
        if (rowsAffected > 0) {
            res.status(200).json({ message: "Cotización eliminada correctamente" });
        } else {
            res.status(404).json({ error: "Cotización no encontrada" });
        }
    } catch (error) {
        console.error("Error eliminando cotización:", error);
        res.status(500).json({ error: "Error eliminando cotización" });
    }
};

export { insertCotizacion, getCotizacion, getCotizacionById, updateCotizacion, deleteCotizacion };