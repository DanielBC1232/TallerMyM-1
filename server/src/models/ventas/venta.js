import sql from 'mssql';
import { connectDB } from '../../config/database.js';

export class Venta {
    constructor(idVenta, fechaVenta, montoTotal, detalles, idOrden, ventaConsumada) {
        this.idVenta = idVenta;
        this.fechaVenta = fechaVenta;
        this.montoTotal = montoTotal;
        this.detalles = detalles;
        this.idOrden = idOrden;
        this.ventaConsumada = ventaConsumada;
    }
}

export class VentaRepository {

    // Método para insertar venta
    async insertVenta(idOrden, detalles) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input('idOrden', sql.Int, idOrden)
                .input('detalles', sql.NVarChar, detalles)
                .execute(`SP_INSERT_VENTA`);
            return result.rowsAffected[0]; // Devuelve el número de filas afectadas
        } catch (error) {
            console.error('Error en insertar venta:', error);
            throw new Error('Error en insertar venta');
        }
    }

    //obtener listado
    async getVentas(nombreCliente, codigoOrden) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input('codigoOrden', sql.VarChar, codigoOrden || null)
                .input('nombreCliente', sql.VarChar, nombreCliente || null)
                .execute(`SP_GET_VENTAS`);
            return result.recordset; // Devuelve el listado
        } catch (error) {
            console.error('Error en obtener venta:', error);
            throw new Error('Error en obtener venta');
        }
    }

    //obtener Venta por ID
    async getVentaById(idVenta) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input('idVenta', sql.Int, idVenta)
                .execute(`SP_GET_VENTA`);
            return result.recordset[0]; // Devuelve el registro
        } catch (error) {
            console.error('Error en obtener venta:', error);
            throw new Error('Error en obtener venta');
        }
    }

    //Agregar producto a venta
    async agregarProducto(idVenta, idProducto, cantidad) {
        const pool = await connectDB();
        try {
            //Primero verificar si el producto ya existe en la venta
            const existeProducto = await pool
                .request()
                .input('idVenta', sql.Int, idVenta)
                .input('idProducto', sql.Int, idProducto)
                .query(`SELECT * FROM PRODUCTO_POR_VENTA WHERE idVenta = @idVenta AND idProducto = @idProducto`);
            //Si existe, actualizar la cantidad
            if (existeProducto.recordset.length > 0) {
                // Si el producto ya existe, actualizar la cantidad
                const productoVenta = existeProducto.recordset[0];
                const nuevaCantidad = productoVenta.cantidad + cantidad;

                return await this.actualizarProductoVenta(productoVenta.idProductoVenta, idProducto, nuevaCantidad);
            }
        } catch (error) {
            console.error('M-Error al verificar producto en venta:', error);
        }
        //Si no existe, insertar el producto en la venta
        try {
            const result = await pool
                .request()
                .input('idVenta', sql.Int, idVenta)
                .input('idProducto', sql.Int, idProducto)
                .input('cantidad', sql.Int, cantidad)
                .execute('SP_INSERTAR_PRODUCTO_VENTA');
            return result.rowsAffected;

        } catch (error) {
            console.error('M-Error en insertar producto', error);
            throw new Error('M-Error en insertar producto');
        }
    }

    //Obtener productos de venta
    async getProductosVenta(idVenta) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input('idVenta', sql.Int, idVenta)
                .execute('SP_GET_PRODUCTOS_VENTA');
            return result.recordset;

        } catch (error) {
            console.error('M-Error en obtener productos', error);
            throw new Error('M-Error en obtener productos');
        }
    }

    //Actualizar la cantidad de un producto en una venta
    async actualizarProductoVenta(idProductoVenta, idProducto, cantidad, tipo) {
        // Si es servicio, siempre cantidad = 1
        if (tipo === 'servicio') {
            cantidad = 1;
        }
        // Validar cantidad
        if (cantidad == null) {
            cantidad = 0;
        } else if (cantidad < 0) {
            cantidad = 0;
        }
        if (cantidad === 0) {
            cantidad = 1; // Si es 0, cambiar a 1
        }
        if (cantidad > 100) {
            cantidad = 99;
        }
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input('idProductoVenta', sql.Int, idProductoVenta)
                .input('idProducto', sql.Int, idProducto)
                .input('cantidad', sql.Int, cantidad)
                .query(`
                UPDATE PRODUCTO_POR_VENTA
                SET cantidad = @cantidad
                WHERE idProductoVenta = @idProductoVenta
                AND idProducto = @idProducto;
            `);

            const filasAfectadas = result.rowsAffected[0];
            console.log(`Filas afectadas: ${filasAfectadas}`);
            return filasAfectadas;
        } catch (error) {
            console.error('Error en actualizar producto:', error);
            throw new Error('Error en actualizar producto');
        }
    }


    //Eliminar
    async deleteProductoVenta(idProductoVenta, idProducto, cantidad) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input('idProductoVenta', sql.Int, idProductoVenta)
                .input('idProducto', sql.Int, idProducto)
                .input('cantidad', sql.Int, cantidad)
                .execute(`SP_DELETE_PRODUCTO_VENTA`);
            const filasAfectadas = result.recordset[0]?.filasAfectadas || 0;

            return filasAfectadas;
        } catch (error) {
            console.error('Error en eliminar producto:', error);
            throw new Error('Error en eliminar producto');
        }
    }

    // existePago
    async existePago(idVenta) {
        try {
            const pool = await connectDB();

            const resultPago = await pool
                .request()
                .input('idVenta', sql.Int, idVenta)
                .query(`SELECT 1 FROM PAGO_CLIENTE WHERE idVenta = @idVenta`);

            const existe = resultPago.recordset.length > 0;

            if (existe) {//si hay pago efectuado cambiar el estado de venta a consumado
                await pool
                    .request()
                    .input('idVenta', sql.Int, idVenta)
                    .query(`UPDATE VENTA SET ventaConsumada = 1 WHERE idVenta = @idVenta`);
            }
            return existe;//retornar el existe boleano

        } catch (error) {
            console.error('Error al verificar pago:', error);
            throw new Error('Error al verificar pago');
        }
    }
}