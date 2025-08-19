import sql from 'mssql';
import { connectDB } from '../../config/database.js';

export class Devolucion {
    constructor(idDevolucion, monto, fecha, motivo, idVenta) {
        this.idDevolucion = idDevolucion;
        this.monto = monto;
        this.motivo = motivo;
        this.fecha = fecha;
        this.idVenta = idVenta;
    }
}

export class DevolucionRepository {

    async insertDevolucion(monto, motivo, idVenta) {
        try {
            const pool = await connectDB();

            // verificar que no exista ya una devolucion para la venta
            const checkDevolucion = await pool
                .request()
                .input('idVenta', sql.Int, idVenta)
                .query(`SELECT COUNT(*) AS total FROM DEVOLUCION WHERE idVenta = @idVenta`);
            if (checkDevolucion.recordset[0].total > 0) {
                return { error: true, status: 409, message: "Esta venta ya tiene una devolución registrada." };
            }

            // Verificar que exista al menos un pago de cliente para la venta
            const checkPago = await pool
                .request()
                .input('idVenta', sql.Int, idVenta)
                .query(`SELECT COUNT(*) AS total FROM PAGO_CLIENTE WHERE idVenta = @idVenta`);
            if (checkPago.recordset[0].total === 0) {
                return { error: true, status: 400, message: "No se puede registrar devolución sin un pago de cliente." };
            }

            // insertar la devolucion si las validaciones son correctas
            const result = await pool
                .request()
                .input('monto', sql.Decimal(10, 2), monto)
                .input('motivo', sql.NVarChar, motivo)
                .input('idVenta', sql.Int, idVenta)
                .query(`INSERT INTO DEVOLUCION(monto, motivo, idVenta)
                        VALUES(@monto, @motivo, @idVenta)`);
            return { error: false, rowsAffected: result.rowsAffected[0] };
        } catch (error) {
            console.error('Error en insertar devolucion:', error);
            throw new Error('Error en insertar devolucion');
        }
    }

    async getDevolucionById(idVenta) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input('idVenta', sql.Int, idVenta)
                .query(`SELECT * FROM DEVOLUCION WHERE idVenta = @idVenta`);
            return result.recordset[0]; // Devuelve el número de filas afectadas
        } catch (error) {
            console.error('Error en obtener devolucion:', error);
            throw new Error('Error en obtener devolucion');
        }
    }

}