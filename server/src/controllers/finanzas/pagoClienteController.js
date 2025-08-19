import { PagoClienteRepository } from '../../models/finanzas/pagoCliente.js';

// Crear una instancia de VentaRepository
const PagoClienteRepo = new PagoClienteRepository();

const insertPagoCliente = async (req, res) => {
    try {
        const { monto, dineroVuelto, metodoPago, subtotal, iva, total, idVenta } = req.body;

        // Llamar al método del modelo para insertar el pago
        const pagoInsertado = await PagoClienteRepo.insertPagoCliente(monto, dineroVuelto, metodoPago, subtotal, iva, total, idVenta);

        // Si el modelo devuelve 409, significa que ya hay un pago registrado
        if (pagoInsertado === 409) {
            return res.status(409).json({ message: "Esta venta ya tiene un pago registrado." });
        }

        res.status(201).json({ message: "Pago registrado correctamente", rowsAffected: pagoInsertado });
    } catch (error) {
        console.error("Error al registrar pago:", error);
        res.status(500).json({ error: "Error al registrar pago" });
    }
};

const getPagoClienteById = async (req, res) => {
    try {
        // Requerir parámetros desde el cuerpo de la solicitud
        const id = parseInt(req.params.id);

        // Usar el método de inserción del repositorio
        const pago = await PagoClienteRepo.getPagoClienteById(id);

        // Enviar la respuesta
        res.status(200).json(pago);
    } catch (error) {
        console.error("Error al obtener pago:", error);
        res.status(500).json({ error: "Error al obtener pago" });
    }
};

export { insertPagoCliente, getPagoClienteById };