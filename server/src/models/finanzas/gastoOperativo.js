import sql from 'mssql';
import { connectDB } from '../../config/database.js';

export class GastoOperativo {
    constructor(idGastoOperativo, tipoGasto, monto, proveedor, detalle, fecha) {
        this.idGastoOperativo = idGastoOperativo;
        this.tipoGasto = tipoGasto;
        this.monto = monto;
        this.proveedor = proveedor
        this.detalle = detalle;
        this.fecha = fecha;
    }
}

export class GastoOperativoRepository {

    async insertGastoOperativo(tipoGasto, monto, detalle, proveedor) {
        try {
            const pool = await connectDB();
            // insertar Gasto Operativo
            const result = await pool
                .request()
                .input('tipoGasto', sql.VarChar, tipoGasto)
                .input('monto', sql.Decimal(10, 2), monto)
                .input('detalle', sql.VarChar, detalle)
                .input('proveedor', sql.VarChar, proveedor)
                .query(`INSERT INTO GASTO_OPERATIVO(tipoGasto,monto, detalle, proveedor)
                    VALUES(@tipoGasto,@monto, @detalle, @proveedor)`);
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Error en insertar Gasto Operativo:', error);
            throw new Error('Error en insertar Gasto Operativo');
        }
    }

    async getGastosOperativos() {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .query(`SELECT TOP 25 * FROM GASTO_OPERATIVO ORDER BY fecha DESC`);
            return result.recordset; // Devuelve el número de filas afectadas
        } catch (error) {
            console.error('Error en obtener GastoOperativo:', error);
            throw new Error('Error en obtener GastoOperativo');
        }
    }

}