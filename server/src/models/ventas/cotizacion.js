import sql from 'mssql';
import { connectDB } from '../../config/database.js';

export class Cotizacion {
    constructor(idCotizacion, montoTotal, montoManoObra, tiempoEstimado, detalles, fecha, idCliente) {
        this.idCotizacion = idCotizacion;
        this.montoTotal = montoTotal;
        this.montoManoObra = montoManoObra;
        this.tiempoEstimado = tiempoEstimado;
        this.detalles = detalles;
        this.idCliente = idCliente;
    }
}

export class CotizacionRepository {
    // Método para insertar cotización
    async insertCotizacion(montoTotal, montoManoObra, tiempoEstimado, detalles, idCliente) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input('montoTotal', sql.Float, montoTotal)
                .input('montoManoObra', sql.Float, montoManoObra)
                .input('tiempoEstimado', sql.VarChar, tiempoEstimado)
                .input('detalles', sql.VarChar, detalles)
                .input('idCliente', sql.Int, idCliente)
                .query(`
                    INSERT INTO COTIZACION 
                    (montoTotal, montoManoObra, tiempoEstimado, detalles, idCliente)
                    VALUES 
                    (@montoTotal, @montoManoObra, @tiempoEstimado, @detalles, @idCliente)
                `);
            return result.rowsAffected[0]; // Devuelve el número de filas afectadas
        } catch (error) {
            console.error('Error en insertar cotizacion:', error);
            throw new Error('Error en insertar cotizacion');
        }
    }

    // Obtener listado
    async getCotizacion() {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .query(`
                    SELECT TOP 10
                    CO.idCotizacion, CO.montoTotal, CO.montoManoObra, CO.tiempoEstimado, CO.detalles, CO.fecha, CO.idCliente AS CO_idCliente,
                    CL.idCliente as idCliente, CL.nombre, CL.apellido
                    FROM COTIZACION CO
                    INNER JOIN CLIENTE CL on CO.idCliente = CL.idCliente
                    ORDER BY fecha DESC`);
            return result.recordset; // Devuelve el listado (15 más recientes)
        } catch (error) {
            console.error('Error en obtener cotizacion:', error);
            throw new Error('Error en obtener cotizacion');
        }
    }

    // Obtener listado por ID
    async getCotizacionById(idCotizacion) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input('idCotizacion', sql.Float, idCotizacion)
                .query(`
                    SELECT
                    CO.idCotizacion, CO.montoTotal, CO.montoManoObra, CO.tiempoEstimado, CO.detalles, CO.fecha,
                    CL.idCliente as idCliente, CL.nombre + ' ' + CL.apellido as nombreCliente
                    FROM COTIZACION CO
                    INNER JOIN CLIENTE CL on CO.idCliente = CL.idCliente
                    WHERE idCotizacion = @idCotizacion`);
            return result.recordset[0]; // Devuelve el registro
        } catch (error) {
            console.error('Error en obtener cotizacion:', error);
            throw new Error('Error en obtener cotizacion');
        }
    }

    async updateCotizacion(idCotizacion, montoTotal, montoManoObra, tiempoEstimado, detalles) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input('idCotizacion', sql.Int, idCotizacion)
                .input('montoTotal', sql.Float, montoTotal)
                .input('montoManoObra', sql.Float, montoManoObra)
                .input('tiempoEstimado', sql.VarChar, tiempoEstimado)
                .input('detalles', sql.VarChar, detalles)
                .query(`
                    UPDATE COTIZACION
                    SET montoTotal = @montoTotal,
                        montoManoObra = @montoManoObra,
                        tiempoEstimado = @tiempoEstimado,
                        detalles = @detalles
                    WHERE idCotizacion = @idCotizacion`);
            return result.rowsAffected[0]; // Devuelve el número de filas afectadas
        } catch (error) {
            console.error('Error en insertar cotizacion:', error);
            throw new Error('Error en insertar cotizacion');
        }
    }

    // Eliminar
    async deleteCotizacion(idCotizacion) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input('idCotizacion', sql.Int, idCotizacion)
                .query(`DELETE FROM COTIZACION WHERE idCotizacion = @idCotizacion`);
            return result.rowsAffected;
        } catch (error) {
            console.error('Error en eliminar cotizacion:', error);
            throw new Error('Error en eliminar cotizacion');
        }
    }
}
