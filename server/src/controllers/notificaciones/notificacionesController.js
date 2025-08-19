import { NotificacionesRepository } from "../../models/notificaciones/notificaciones.js";

const notiRepo = new NotificacionesRepository();

const getNotificaciones = async (req, res) => {
    try {
        // Requerir parámetros desde el cuerpo de la solicitud
        const { modulo } = req.body;

        // Usar el método de inserción del repositorio
        const noti = await notiRepo.getNotificaciones(modulo);
        // Enviar la respuesta
        res.status(200).json(noti);
    } catch (error) {
        console.error("C-Error al obtener Notificaciones:", error);
        res.status(500).json({ error: "C-Error al obtener Notificaciones" });
    }
}

const EliminarNotificacion = async (req, res) => {
    try {
        // Requerir parámetros desde el cuerpo de la solicitud
        const id = req.params.id;

        // Usar el método de inserción del repositorio
        const noti = await notiRepo.EliminarNotificacion(parseInt(id));
        // Enviar la respuesta
        res.status(200).json(noti);
    } catch (error) {
        console.error("C-Error al eliminar Notificacion:", error);
        res.status(500).json({ error: "C-Error al eliminar Notificacion" });
    }
}


export { getNotificaciones, EliminarNotificacion }
