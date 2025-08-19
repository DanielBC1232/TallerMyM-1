import sql from 'mssql';
import { connectDB } from '../../config/database.js';

export class Notificaciones {
    constructor(idNotificacion, titulo, cuerpo, fecha, modulo, tipo, estado) {
        this.idNotificacion = idNotificacion;
        this.titulo = titulo;
        this.cuerpo = cuerpo;
        this.fecha = fecha;
        this.modulo = modulo;
        this.tipo = tipo;
        this.estado = estado;
    }
}

export class NotificacionesRepository {

    //obtener notificaciones
    async getNotificaciones(modulo) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input('modulo', sql.VarChar, modulo)
                .query(`SELECT * FROM NOTIFICACIONES
                    WHERE modulo = @modulo`);
            return result.recordset; // Devuelve el array de notificaciones
        } catch (error) {
            console.error('M-Error al obtener notificaciones:', error);
            throw new Error('M-Error al obtener notificaciones:');
        }
    }

    async EliminarNotificacion(idNotificacion) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input('idNotificacion', sql.Int, idNotificacion)
                .query(`DELETE FROM NOTIFICACIONES
                    WHERE idNotificacion = @idNotificacion`);
            return result.rowsAffected; // Devuelve el número de filas afectadas
        } catch (error) {
            console.error('M-Error al eliminar notificacion:', error);
            throw new Error('M-Error al eliminar notificacion:');
        }
    }
}