import { VentaRepository } from '../../models/ventas/venta.js';

// Crear una instancia de VentaRepository
const VentaRepo = new VentaRepository();

const insertVenta = async (req, res) => {
    try {
        // Requerir parámetros desde el cuerpo de la solicitud
        const { idOrden, detalles } = req.body;

        // Usar el método de inserción del repositorio
        const venta = await VentaRepo.insertVenta(idOrden, detalles);

        // Enviar la respuesta
        res.status(201).json({ message: "Venta insertada correctamente", rowsAffected: venta });
    } catch (error) {
        console.error("Error al insertar venta:", error);
        res.status(500).json({ error: "Error al insertar venta" });
    }
};

const getVentas = async (req, res) => {
    try {
        const { nombreCliente, codigoOrden } = req.body;

        // Usar el método de listado del repositorio
        const venta = await VentaRepo.getVentas(nombreCliente, codigoOrden);

        // Enviar la respuesta
        res.status(200).json(venta);
    } catch (error) {
        console.error("Error al obtener ventas:", error);
        res.status(500).json({ error: "Error al obtener ventas" });
    }
};

const getVentaById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Usar el método de listado del repositorio
        const venta = await VentaRepo.getVentaById(id);

        // Enviar la respuesta
        res.status(200).json(venta);
    } catch (error) {
        console.error("Error al obtener venta:", error);
        res.status(500).json({ error: "Error al obtener venta" });
    }
};

const agregarProducto = async (req, res) => {
    try {
        // Requerir parámetros desde el cuerpo de la solicitud
        const { idVenta, idProducto, cantidad } = req.body;

        const venta = await VentaRepo.agregarProducto(idVenta, idProducto, cantidad);

        // Enviar la respuesta
        res.status(201).json({ message: "Producto agregado correctamente", rowsAffected: venta });
    } catch (error) {
        console.error("C-Error al agregar producto:", error);
        res.status(500).json({ error: "C-Error al agregar producto" });
    }
};

const getProductosVenta = async (req, res) => {
    try {
        // Requerir parámetros desde el cuerpo de la solicitud
        const idVenta = parseInt(req.params.id);

        const venta = await VentaRepo.getProductosVenta(idVenta);
        // Enviar la respuesta
        res.status(200).json(venta);
    } catch (error) {
        console.error("C-Error al obtener productos:", error);
        res.status(500).json({ error: "C-Error al obtener productos:" });
    }
};

const deleteProductoVenta = async (req, res) => {
    try {
        const { idProductoVenta, idProducto, cantidad } = req.body;

        const rowsAffected = await VentaRepo.deleteProductoVenta(idProductoVenta, idProducto, cantidad);
        console.log(rowsAffected);

        if (rowsAffected > 0) {
            res.status(200).json({ message: "Producto eliminado de venta correctamente" });
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error("Error eliminando producto:", error);
        res.status(500).json({ error: "Error eliminando producto" });
    }
};

const existePago = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const respuesta = await VentaRepo.existePago(id);

        res.status(200).send(respuesta);

    } catch (error) {
        console.error("Error en obtener dato:", error);
        res.status(500).json({ error: "Error en obtener dato" });
    }
};

const actualizarProductoVenta = async (req, res) => {
    try {
        const { idProductoVenta, idProducto, cantidad, tipo } = req.body;
        const rowsAffected = await VentaRepo.actualizarProductoVenta(idProductoVenta, idProducto, cantidad, tipo);

        if (rowsAffected > 0) {
            res.status(200).json({ message: "Producto actualizado correctamente" });
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error("Error actualizando producto:", error);
        res.status(500).json({ error: "Error actualizando producto" });
    }
}

export { insertVenta, getVentas, getVentaById, agregarProducto, getProductosVenta, deleteProductoVenta, existePago, actualizarProductoVenta };