import { GastoOperativoRepository } from '../../models/finanzas/gastoOperativo.js';

// Crear una instancia de VentaRepository
const GastoOperativoRepo = new GastoOperativoRepository();

const insertGastoOperativo = async (req, res) => {
    try {
        const { tipoGasto, monto, detalle, proveedor } = req.body;
        const resultado = await GastoOperativoRepo.insertGastoOperativo(tipoGasto, monto, detalle, proveedor);

        return res.status(201).json(resultado);
    } catch (error) {
        console.error("Error al registrar devolución:", error);
        res.status(500).json({ error: "Error al registrar devolución" });
    }
};

const getGastoOperativos = async (_req, res) => {
    try {

        // Usar el método de inserción del repositorio
        const GastoOperativo = await GastoOperativoRepo.getGastosOperativos();

        if (GastoOperativo) {
            // Enviar la respuesta
            res.status(200).json(GastoOperativo);
        } else if (!GastoOperativo) {
            res.status(200)
        }

    } catch (error) {
        console.error("C-Error al obtener GastoOperativo:", error);
        res.status(500).json({ error: "C-Error al obtener GastoOperativo" });
    }
};

export { insertGastoOperativo, getGastoOperativos };