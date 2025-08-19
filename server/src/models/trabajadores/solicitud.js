import sql from 'mssql';
import { connectDB } from '../../config/database.js';

export class Solicitud {
    constructor(fechaInicio, fechaFin, idTrabajador, cedula) {

        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.idTrabajador = idTrabajador;
        this.cedula = cedula;
    }
}
//SOLICITUD DE VACACIONES
//Metodos CRUD
export class SolicitudRepository {
    // Insertar nuevos clientes
    async InsertSolicitud(fechaInicio, fechaFin, idTrabajador) {

        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input("fechaInicio", sql.Date, fechaInicio)
                .input("fechaFin", sql.Date, fechaFin)
                .input("idTrabajador", sql.Int, idTrabajador)
                .query(`
                    INSERT INTO VACACIONES (fechaInicio, fechaFin, idTrabajador)
                    VALUES (@fechaInicio, @fechaFin, @idTrabajador)
                `);
            return result.rowsAffected[0];

        } catch (error) {
            console.error("Error en insert:", error);
            throw new Error("Error al insertar solicitud");
        }
    }

    // Actualizar Solicitud
    async UpdateSolicitud(idVacaciones, datosActualizados) {
        try {
            const pool = await connectDB();

            const { solicitud, fechaInicio, fechaFin, motivoRechazo, idTrabajador } = datosActualizados;

            // Convertir fechas ISO a formato Date de SQL Server
            const fechaInicioSQL = fechaInicio ? new Date(fechaInicio) : null;
            const fechaFinSQL = fechaFin ? new Date(fechaFin) : null;

            const result = await pool
                .request()
                .input("idVacaciones", sql.Int, idVacaciones)
                .input("solicitud", sql.VarChar, solicitud)
                .input("fechaInicio", sql.Date, fechaInicioSQL)
                .input("fechaFin", sql.Date, fechaFinSQL)
                .input("motivoRechazo", sql.VarChar, motivoRechazo || null)
                .input("idTrabajador", sql.Int, idTrabajador)
                .query(`
                    UPDATE VACACIONES
                    SET solicitud = @solicitud,
                        fechaInicio = @fechaInicio,
                        fechaFin = @fechaFin,
                        motivoRechazo = @motivoRechazo,
                        idTrabajador = @idTrabajador
                    WHERE idVacaciones = @idVacaciones
                `);

            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error("Error al actualizar la solicitud:", error);
            throw new Error("Error al actualizar la solicitud");
        }
    }

    async DeleteSolicitud(idVacaciones) {
        try {
            const pool = await connectDB();


            const result = await pool
                .request()
                .input("idVacaciones", sql.Int, idVacaciones)

                .query(`DELETE VACACIONES  WHERE idVacaciones = @idVacaciones`);

            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error("Error al eliminar la solicitud:", error);
            throw new Error("Error al eliminar la solicitud");
        }
    }
    //--------

    //Aprobar y Rechazar Vacaciones
    // AprobarSolicitud

    async AprobarSolicitud(idVacaciones) {
        try {
            const pool = await connectDB();


            const result = await pool
                .request()
                .input("idVacaciones", sql.Int, idVacaciones)

                .query(`UPDATE VACACIONES SET solicitud = 'Aprobado', motivoRechazo = NULL
                    WHERE idVacaciones = @idVacaciones`);

            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error("Error al aprobar la solicitud:", error);
            throw new Error("Error al aprobar la solicitud");
        }
    }

    //Rechazar
    async RechazarSolicitud(idVacaciones, datosActualizados) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input("idVacaciones", sql.Int, idVacaciones)
                .input("motivoRechazo", sql.VarChar, datosActualizados)
                .query(`UPDATE VACACIONES SET solicitud = 'Rechazado', motivoRechazo = @motivoRechazo
                    WHERE idVacaciones = @idVacaciones`);
            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error("Error al rechazar la solicitud:", error);
            throw new Error("Error al rechazar la solicitud");
        }
    }

    //Metodos Get
    async getVacacionesGest() {
        try {
            const pool = await connectDB();
            const result = await pool.request().query(`
                SELECT 
                v.idVacaciones,
                v.solicitud,
                v.fechaInicio,
                v.fechaFin,
                v.motivoRechazo,
                v.idTrabajador,
                t.nombreCompleto as nombreTrabajador
                FROM VACACIONES v Join TRABAJADOR t ON v.idTrabajador = t.idTrabajador`);
            return result.recordset;
        } catch (error) {
            console.error("Error al obtener todas las solicitudes:", error);
            throw new Error("Error al obtener todas las solicitudes");
        }
    }

    //obtener idTrabajador por cedula
    async getIdTrabajadorByCedula(cedula) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input("cedula", sql.VarChar, cedula)
                .query(`SELECT idTrabajador FROM TRABAJADOR WHERE cedula = @cedula`);
            return result.recordset[0]?.idTrabajador || null; // Devuelve el idTrabajador o null si no se encuentra
        } catch (error) {
            console.error("Error al obtener el idTrabajador por cédula:", error);
            throw new Error("Error al obtener el idTrabajador por cédula");
        }
    }

    //Metodos Get vacaciones por cedula
    async getVacacionesCedula(cedula) {
        //obtener idTrabajador por cedula
        const idTrabajador = await this.getIdTrabajadorByCedula(cedula);
        if (!idTrabajador) {
            throw new Error("Trabajador no encontrado con la cédula proporcionada");
        }
        // Obtener las vacaciones del trabajador por idTrabajador
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input("idTrabajador", sql.Int, idTrabajador)
                .query(`
                    SELECT 
                    idVacaciones,
                    solicitud,
                    fechaInicio, 
                    fechaFin,
                    motivoRechazo,
                    idTrabajador
                    FROM VACACIONES 
                    WHERE idTrabajador = @idTrabajador`);
            return result.recordset;
        } catch (error) {
            console.error("Error al obtener las vacaciones por cédula:", error);
            throw new Error("Error al obtener las vacaciones por cédula");
        }
    }

    async getVacionPorIdVacacion(idVacaciones) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input("idVacaciones", sql.Int, idVacaciones)
                .query(`SELECT 
                idVacaciones,
                solicitud,
                fechaInicio, 
                fechaFin,
                motivoRechazo,
                idTrabajador
                  FROM VACACIONES 
                  WHERE idVacaciones = @idVacaciones`);
            console.log("Paso por el modelo")
            console.log(result);
            return result.recordset[0];
        } catch (error) {
            console.error("Error al obtener la solicitud:model", error);
            throw new Error("Error al obtener la solicitudmodel");
        }
    }
}