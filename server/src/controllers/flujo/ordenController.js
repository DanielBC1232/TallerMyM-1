import { OrdenRepository } from '../../models/flujo/orden.js';

// Crear una instancia de ordenRepository
const OrdenRepo = new OrdenRepository();

//insertar nueva orden
const insertOrden = async (req, res) => {
    try {
        // Requerir parámetros desde el cuerpo de la solicitud
        const { tiempoEstimado, idVehiculo, idTrabajador, idCliente, descripcion } = req.body;

        // Usar el método de inserción del repositorio
        const orden = await OrdenRepo.insertOrden(tiempoEstimado, idVehiculo, idTrabajador, idCliente, descripcion);

        // Enviar la respuesta
        res.status(201).json({ message: "Orden insertado correctamente", rowsAffected: orden });
    } catch (error) {
        console.error("Error al insertar orden:", error);
        res.status(500).json({ error: "Error al insertar orden" });
    }
};

//Listar por columna
const getOrdenesByStatus = async (req, res) => {
    try {

        const id = parseInt(req.params.id);

        // Usar el método de listado del repositorio
        const orden = await OrdenRepo.getOrdenesByStatus(id);

        // Enviar la respuesta
        res.status(200).json(orden);
    } catch (error) {
        console.error("Error al obtener orden:", error);
        res.status(500).json({ error: "Error al obtener orden" });
    }
};

//obtener por ID (preload detalles y editar)
const getOrdenById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Usar el método de obtener orden por ID
        const orden = await OrdenRepo.getOrdenById(id);

        // Enviar la respuesta
        res.status(200).json(orden);
    } catch (error) {
        console.error("Error al obtener orden", error);
        res.status(500).json({ error: "Error al obtener orden" });
    }
};

//pasar a la siguiente fase // cancelar orden
const siguienteFase = async (req, res) => {
    try {
        // Requerir parámetros desde el cuerpo de la solicitud
        const { idOrden, estadoOrden } = req.body;

        // Usar el método de actualizar del repositorio
        const orden = await OrdenRepo.siguienteFase(idOrden, estadoOrden + 1);

        // Enviar la respuesta
        res.status(200).json({ message: "Orden actualizado correctamente", rowsAffected: orden });
    } catch (error) {
        console.error("Error al actualizar orden:", error);
        res.status(500).json({ error: "Error al actualizar orden" });
    }
};

const updateOrden = async (req, res) => {
    try {
        // Requerir parámetros desde el cuerpo de la solicitud
        const { idOrden, tiempoEstimado, idTrabajador, idVehiculo, descripcion, estadoAtrasado } = req.body;

        // Usar el método de actualizar del repositorio
        const orden = await OrdenRepo.updateOrden(idOrden, tiempoEstimado, idTrabajador, idVehiculo, descripcion, estadoAtrasado);

        // Enviar la respuesta
        res.status(200).json({ message: "Orden actualizado correctamente", rowsAffected: orden });
    } catch (error) {
        console.error("Error al actualizar orden:", error);
        res.status(500).json({ error: "Error al actualizar orden" });
    }
};


export { insertOrden, getOrdenesByStatus, getOrdenById, siguienteFase, updateOrden };
