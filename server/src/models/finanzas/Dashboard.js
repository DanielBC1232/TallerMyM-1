import sql from 'mssql';
import { connectDB } from '../../config/database.js';

export class DashboardRepository {

    async getGananciaMes() {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .execute(`SP_GET_GANANCIAS_MESES`);
            return result.recordset[0];
        } catch (error) {
            console.error('Error en obtener datos de ganancia mensual', error);
            throw new Error('Error en obtener datos de ganancia mensual');
        }
    }

    async getGananciasMes() {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .query(`SELECT total, fecha FROM PAGO_CLIENTE`);
            return result.recordset;
        } catch (error) {
            console.error('Error en obtener datos de ganancias', error);
            throw new Error('Error en obtener datos de ganancias');
        }
    }

    async getGastoMes() {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .execute(`SP_GET_GASTOS_MESES`);
            return result.recordset[0];
        } catch (error) {
            console.error('Error en obtener datos de gasto mensual', error);
            throw new Error('Error en obtener datos de gasto mensual');
        }
    }

    async getGastosMes() {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .query(`SELECT monto, fecha FROM GASTO_OPERATIVO`);
            return result.recordset;
        } catch (error) {
            console.error('Error en obtener datos de gastos', error);
            throw new Error('Error en obtener datos de gastos');
        }
    }

    async getTopVentas() {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .execute(`SP_TOP_VENTAS`);
            return result.recordset;
        } catch (error) {
            console.error('Error en obtener datos de top ventas', error);
            throw new Error('Error en obtener datos de top ventas');
        }
    }
}

