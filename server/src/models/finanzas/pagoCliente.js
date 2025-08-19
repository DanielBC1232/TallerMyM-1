import sql from 'mssql';
import { connectDB } from '../../config/database.js';

export class PagoCliente {
    constructor(idPago, monto, dineroVuelto, metodoPago, subtotal, iva, total, fecha, idVenta) {
        this.idPago = idPago;
        this.monto = monto;
        this.dineroVuelto = dineroVuelto
        this.metodoPago = metodoPago;
        this.subtotal = subtotal;
        this.iva = iva;
        this.total = total;
        this.fecha = fecha;
        this.idVenta = idVenta;
    }
}

export class PagoClienteRepository {

    insertPagoCliente = async (monto, dineroVuelto, metodoPago, subtotal, iva, total, idVenta) => {
        try {
            const pool = await connectDB();
            const existePago = await pool
                .request()
                .input('idVenta', sql.Int, idVenta)
                .query('SELECT COUNT(*) AS total FROM PAGO_CLIENTE WHERE idVenta = @idVenta');

            const Total = existePago.recordset[0].total;

            if (Total > 0) {
                return 409; // Indica que ya existe un pago para esta venta
            }

            const result = await pool
                .request()
                .input('monto', sql.Int, monto)
                .input('dineroVuelto', sql.Decimal(10, 2), dineroVuelto)
                .input('metodoPago', sql.NVarChar, metodoPago)
                .input('subtotal', sql.Decimal(10, 2), subtotal)
                .input('iva', sql.Decimal(10, 2), iva)
                .input('total', sql.Decimal(10, 2), total)
                .input('idVenta', sql.Int, idVenta)
                .query(`INSERT INTO PAGO_CLIENTE (monto, dineroVuelto, metodoPago, subtotal, iva, total, idVenta)
                        VALUES (@monto, @dineroVuelto, @metodoPago, @subtotal, @iva, @total, @idVenta)`);
            return result.rowsAffected[0];
        } catch (error) {
            console.error("Error en insertar pago:", error);
            throw new Error("Error en insertar pago");
        }
    };

    async getPagoClienteById(idVenta) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input('idVenta', sql.Int, idVenta)
                .query(`SELECT * FROM PAGO_CLIENTE WHERE idVenta = @idVenta`);
            return result.recordset[0]; // Devuelve el numero de filas afectadas
        } catch (error) {
            console.error('Error en obtener pago:', error);
            throw new Error('Error en obtener pago');
        }
    }

}

