import { DevolucionRepository } from '../../models/finanzas/devolucion.js';

// Crear una instancia de VentaRepository
const DevolucionRepo = new DevolucionRepository();

const insertDevolucion = async (req, res) => {
    try {
        const { monto, motivo, idVenta } = req.body;
        const resultado = await DevolucionRepo.insertDevolucion(monto, motivo, idVenta);

        if (resultado.error) {
            return res.status(resultado.status).json({ message: resultado.message });
        }

        res.status(200).json({ message: "Devolución registrada correctamente", rowsAffected: resultado.rowsAffected });
    } catch (error) {
        console.error("Error al registrar devolución:", error);
        res.status(500).json({ error: "Error al registrar devolución" });
    }
};

const getDevolucionById = async (req, res) => {
    try {
        // Requerir parámetros desde el cuerpo de la solicitud
        const id = parseInt(req.params.id);

        // Usar el método de inserción del repositorio
        const devolucion = await DevolucionRepo.getDevolucionById(id);

        if (devolucion) {
            // Enviar la respuesta
            res.status(200).json(devolucion);
        } else if (!devolucion) {
            res.status(200)
        }

    } catch (error) {
        console.error("C-Error al obtener devolucion:", error);
        res.status(500).json({ error: "C-Error al obtener devolucion" });
    }
};

export { insertDevolucion, getDevolucionById };