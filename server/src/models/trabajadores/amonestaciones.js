import sql from 'mssql';
import { connectDB } from '../../config/database.js';

export class Amonestacion {
    constructor(idTrabajador, fechaAmonestacion, tipoAmonestacion, motivo, accionTomada) {
        this.idTrabajador = idTrabajador;
        this.fechaAmonestacion = fechaAmonestacion;
        this.tipoAmonestacion = tipoAmonestacion;
        this.motivo = motivo;
        this.accionTomada = accionTomada;
    }
}

export class AmonestacionRepository {
    // Insertar nueva amonestación
    async InsertAmonestacion(amonestacion) {
        console.log(amonestacion);
        try {
            const pool = await connectDB();
            await pool
                .request()
                .input("idTrabajador", sql.Int, amonestacion.idTrabajador)
                .input("fechaAmonestacion", sql.Date, amonestacion.fechaAmonestacion)
                .input("tipoAmonestacion", sql.VarChar(50), amonestacion.tipoAmonestacion)
                .input("motivo", sql.VarChar(255), amonestacion.motivo)
                .input("accionTomada", sql.VarChar(255), amonestacion.accionTomada)
                .query(`
                    INSERT INTO AMONESTACIONES (
                        idTrabajador, 
                        fechaAmonestacion, 
                        tipoAmonestacion, 
                        motivo, 
                        accionTomada
                    )
                    VALUES (
                        @idTrabajador, 
                        @fechaAmonestacion, 
                        @tipoAmonestacion, 
                        @motivo, 
                        @accionTomada
                    )
                `);
        } catch (error) {
            console.error("Error al insertar amonestación:", error);
            throw new Error("Error al insertar amonestación");
        }
    }

    // Actualizar amonestación
    async UpdateAmonestacion(idAmonestacion, datosActualizados) {
        try {
            const pool = await connectDB();
            const {
                idTrabajador,
                fechaAmonestacion,
                tipoAmonestacion,
                motivo,
                accionTomada
            } = datosActualizados;
            const fechaSQL = fechaAmonestacion ? new Date(fechaAmonestacion) : null;
            const result = await pool
                .request()
                .input("idAmonestacion", sql.Int, idAmonestacion)
                .input("idTrabajador", sql.Int, idTrabajador)
                .input("fechaAmonestacion", sql.Date, fechaSQL)
                .input("tipoAmonestacion", sql.VarChar(50), tipoAmonestacion)
                .input("motivo", sql.VarChar(255), motivo)
                .input("accionTomada", sql.VarChar(255), accionTomada)
                .query(`
                    UPDATE AMONESTACIONES
                    SET 
                        idTrabajador = @idTrabajador,
                        fechaAmonestacion = @fechaAmonestacion,
                        tipoAmonestacion = @tipoAmonestacion,
                        motivo = @motivo,
                        accionTomada = @accionTomada
                    WHERE idAmonestacion = @idAmonestacion
                `);
            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error("Error al actualizar amonestación:", error);
            throw new Error("Error al actualizar amonestación");
        }
    }

    // Eliminar amonestación
    async DeleteAmonestacion(idAmonestacion) {
        try {
            const pool = await connectDB();

            const result = await pool
                .request()
                .input("idAmonestacion", sql.Int, idAmonestacion)
                .query(`DELETE FROM AMONESTACIONES WHERE idAmonestacion = @idAmonestacion`);

            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error("Error al eliminar amonestación:", error);
            throw new Error("Error al eliminar amonestación");
        }
    }

    // Obtener todas las amonestaciones
    async getAmonestaciones() {
        try {
            const pool = await connectDB();
            const result = await pool.request().query(`
                SELECT 
                    a.idAmonestacion,
                    a.idTrabajador,
                    a.fechaAmonestacion,
                    a.tipoAmonestacion,
                    a.motivo,
                    a.accionTomada,
                    a.fechaRegistro,
                    t.nombreCompleto AS nombreTrabajador
                FROM AMONESTACIONES a JOIN Trabajador t ON a.idTrabajador = t.idTrabajador
            `);
            return result.recordset;
        } catch (error) {
            console.error("Error al obtener amonestaciones:", error);
            throw new Error("Error al obtener amonestaciones");
        }
    }

    // Obtener amonestación por ID
    async getAmonestacionPorId(idAmonestacion) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input("idAmonestacion", sql.Int, idAmonestacion)
                .query(`
                    SELECT 
                        idAmonestacion,
                        idTrabajador,
                        fechaAmonestacion,
                        tipoAmonestacion,
                        motivo,
                        accionTomada
                    FROM AMONESTACIONES
                    WHERE idAmonestacion = @idAmonestacion
                `);
            return result.recordset[0];
        } catch (error) {
            console.error("Error al obtener amonestación por ID:", error);
            throw new Error("Error al obtener amonestación por ID");
        }
    }

    //Obtener amonestaciones por cédula de trabajador
    async getAmonestacionesPorCedula(cedula) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input("cedula", sql.VarChar(20), cedula)
                .query(`
                    SELECT 
                        a.idAmonestacion,
                        a.idTrabajador,
                        a.fechaAmonestacion,
                        a.tipoAmonestacion,
                        a.motivo,
                        a.accionTomada,
                        t.nombreCompleto AS nombreTrabajador
                    FROM AMONESTACIONES a 
                    JOIN Trabajador t ON a.idTrabajador = t.idTrabajador
                    WHERE t.cedula = @cedula
                    ORDER BY a.fechaAmonestacion DESC
                `);
            return result.recordset;
        } catch (error) {
            console.error("Error al obtener amonestaciones por cédula:", error);
            throw new Error("Error al obtener amonestaciones por cédula");
        }
    }
}
