import sql from 'mssql';
import { connectDB } from '../../config/database.js';
import { cambioEstadoOrden } from '../mailer/mailerBD.js';

export class Orden {
    constructor(idOrden, codigoOrden, estadoOrden, fechaIngreso, tiempoEstimado, estadoAtrasado, idVehiculo, descripcion, idTrabajador, idCliente) {
        this.idOrden = idOrden;
        this.codigoOrden = codigoOrden;
        this.estadoOrden = estadoOrden;
        this.fechaIngreso = fechaIngreso;
        this.tiempoEstimado = tiempoEstimado;
        this.estadoAtrasado = estadoAtrasado;
        this.idVehiculo = idVehiculo;
        this.descripcion = descripcion;
        this.idTrabajador = idTrabajador;
        this.idCliente = idCliente;
    }
}

export class OrdenRepository {

    // Método para insertar Orden
    async insertOrden(tiempoEstimado, idVehiculo, idTrabajador, idCliente, descripcion) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input('tiempoEstimado', sql.DateTime, tiempoEstimado)
                .input('idVehiculo', sql.Int, idVehiculo)
                .input('idTrabajador', sql.Int, idTrabajador)
                .input('idCliente', sql.Int, idCliente)
                .input('descripcion', sql.NVarChar, descripcion)
                .execute(`SP_INSERTAR_ORDEN`);
            return result.rowsAffected[0]; // Devuelve el número de filas afectadas
        } catch (error) {
            console.error('Error en generar una nueva orden', error);
            throw new Error('Error en generar una nueva orden');
        }
    }

    // Obtener listado de Orden - By estado (columna 1-Pendiente, 2-En proceso, 3-Listo)
    async getOrdenesByStatus(estadoOrden) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input('estadoOrden', sql.Int, estadoOrden)
                .execute(`SP_GET_ORDENES`);
            return result.recordset;
        } catch (error) {
            console.error('Error en obtener ordenes:', error);
            throw new Error('Error en obtener ordenes');
        }
    }

    // Obtener oden por ID
    async getOrdenById(idOrden) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input('idOrden', sql.Int, idOrden)
                .execute(`GET_ORDEN`);
            return result.recordset[0]; // Devuelve el registro
        } catch (error) {
            console.error('Error en obtener orden:', error);
            throw new Error('Error en obtener orden');
        }
    }

    //Siguiente fase - Tambien se usa para cancelar orden si el estado es 0
    async siguienteFase(idOrden, estadoOrden) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input('idOrden', sql.Int, idOrden)
                .input('estadoOrden', sql.Int, estadoOrden)
                .query(`UPDATE ORDEN
                    SET estadoOrden = @estadoOrden
                    WHERE idOrden = @idOrden`);
            const resultadoSQL = result.rowsAffected[0];

            if (resultadoSQL > 0) {
                cambioEstadoOrden();
            }
            return resultadoSQL;  // Devuelve el número de filas afectadas
        } catch (error) {
            console.error('Error en actualizar orden:', error);
            throw new Error('Error en actualizar orden');
        }
    }

    // Actualizar Orden
    async updateOrden(idOrden, tiempoEstimado, idTrabajador, idVehiculo, descripcion, estadoAtrasado) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input('idOrden', sql.Int, idOrden)
                .input('tiempoEstimado', sql.DateTime, tiempoEstimado)
                .input('idTrabajador', sql.Int, idTrabajador)
                .input('idVehiculo', sql.Int, idVehiculo)
                .input('descripcion', sql.NVarChar(2048), descripcion)
                .input('estadoAtrasado', sql.Bit, estadoAtrasado)
                .query(`
                    UPDATE ORDEN
                    SET tiempoEstimado = @tiempoEstimado,
                        idTrabajador = @idTrabajador,
                        idVehiculo = @idVehiculo,
                        descripcion = @descripcion,
                        estadoAtrasado = @estadoAtrasado
                    WHERE idOrden = @idOrden`);
            return result.rowsAffected[0]; // Devuelve el número de filas afectadas
        } catch (error) {
            console.error('Error en actualizar orden:', error);
            throw new Error('Error en actualizar orden');
        }
    }
}