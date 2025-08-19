import sql from 'mssql';
import { connectDB } from '../../config/database.js';

export class ProductoServicio {
    constructor(idProducto, nombre, marca, descripcion, precio, stock, fechaIngreso, ubicacionAlmacen, proveedor, categoria, vehiculosCompatibles, tipo, img, porcentajeDescuento, stockMinimo, estado) {
        this.idProducto = idProducto;
        this.nombre = nombre;
        this.marca = marca;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.fechaIngreso = fechaIngreso;
        this.ubicacionAlmacen = ubicacionAlmacen;
        this.proveedor = proveedor;
        this.categoria = categoria;
        this.vehiculosCompatibles = vehiculosCompatibles;
        this.tipo = tipo;
        this.img = img;
        this.porcentajeDescuento = porcentajeDescuento;
        this.stockMinimo = stockMinimo;
        this.estado = estado;
    }
}

export class ProductoRepository {
    // Obtener todos los productos
    async getAll(nombre, marca, categoria, stock, rangoPrecio) {
        try {
            const precioMin = (rangoPrecio && rangoPrecio[0]) || null;
            const precioMax = (rangoPrecio && rangoPrecio[1]) || null;
            const pool = await connectDB();
            // llamada al procedimiento almacenado
            const result = await pool
                .request()
                .input('nombre', sql.VarChar(50), nombre || null)
                .input('marca', sql.VarChar(50), marca || null)
                .input('categoria', sql.VarChar(50), categoria || null)
                .input('stock', sql.Int, stock || null)
                .input('precioMin', sql.Decimal(18, 2), precioMin)
                .input('precioMax', sql.Decimal(18, 2), precioMax)
                .execute('SP_FILTRO_PRODUCTOS');  // Ejecutar el procedimiento
            // Retorno de los resultados
            return result.recordset;
        }
        catch (error) {
            console.error("M-Error en getAll:", error);
            throw new Error("M-Error al obtener productos");
        }
    }

    async findById(idProducto) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input("idProducto", sql.Int, idProducto) // Parametros
                .query(`SELECT
                    idproducto,
                    nombre,
                    marca,
                    descripcion,
                    precio,
                    stock,
                    fechaIngreso,
                    ubicacionAlmacen,
                    proveedor,
                    categoria,
                    vehiculosCompatibles,
                    tipo,
                    img,
                    porcentajeDescuento*100 as porcentajeDescuento,
                    stockMinimo
                    FROM PRODUCTO_SERVICIO WHERE idProducto = @idProducto
                    AND estado = 1`); // Consulta SQL
            return result.recordset.length > 0 ? result.recordset[0] : null;
        }
        catch (error) {
            console.error(" Error en findById:", error);
            throw new Error("Error al obtener producto por ID");
        }
    }
    // Insertar producto
    async insertProducto(nombre, marca, descripcion, precio, stock, fechaIngreso, ubicacionAlmacen, proveedor, categoria, vehiculosCompatibles, tipo, img, stockMinimo) {
        try {
            const pool = await connectDB();
            const result = await pool
                //PARAMETROS
                .request()
                .input("nombre", sql.VarChar, nombre)
                .input("marca", sql.VarChar, marca)
                .input("descripcion", sql.NVarChar, descripcion)
                .input("precio", sql.Decimal(10, 2), precio)
                .input("stock", sql.Int, stock)
                .input("fechaIngreso", sql.Date, fechaIngreso)
                .input("ubicacionAlmacen", sql.VarChar, ubicacionAlmacen)
                .input("proveedor", sql.VarChar, proveedor)
                .input("categoria", sql.VarChar, categoria)
                .input("vehiculosCompatibles", sql.NVarChar, vehiculosCompatibles)
                .input("tipo", sql.VarChar, tipo)
                .input("img", sql.VarChar, img || null)
                .input("stockMinimo", sql.Int, stockMinimo || 1)
                .query(`
                    INSERT INTO PRODUCTO_SERVICIO
                    (nombre, marca, descripcion, precio, stock, fechaIngreso, ubicacionAlmacen,
                    proveedor, categoria, vehiculosCompatibles, tipo, img, porcentajeDescuento,stockMinimo)
                    VALUES
                    (@nombre, @marca, @descripcion, @precio, @stock, @fechaIngreso, @ubicacionAlmacen,
                    @proveedor, @categoria, @vehiculosCompatibles, @tipo, @img, 0,@stockMinimo)`);
            return result.rowsAffected[0];
        }
        catch (error) {
            console.error("Error en insertar producto o servicio:", error);
            throw new Error("Error al insertar producto o servicio");
        }
    }
    // Actualizar producto
    async updateProducto(idProducto, nombre, marca, descripcion, precio, stock, fechaIngreso, ubicacionAlmacen, proveedor, categoria, vehiculosCompatibles, tipo, img, porcentajeDescuento, stockMinimo) {
        try {
            const pool = await connectDB();
            const result = await pool.request()
                .input("idProducto", sql.Int, idProducto)
                .input("nombre", sql.VarChar, nombre)
                .input("marca", sql.VarChar, marca)
                .input("descripcion", sql.NVarChar, descripcion)
                .input("precio", sql.Decimal(10, 2), precio)
                .input("stock", sql.Int, stock)
                .input("fechaIngreso", sql.Date, fechaIngreso)
                .input("ubicacionAlmacen", sql.VarChar, ubicacionAlmacen)
                .input("proveedor", sql.VarChar, proveedor)
                .input("categoria", sql.VarChar, categoria)
                .input("vehiculosCompatibles", sql.NVarChar, vehiculosCompatibles)
                .input("tipo", sql.VarChar, tipo)
                .input("img", sql.NVarChar, img || null)
                .input("porcentajeDescuento", sql.Decimal(10, 2), porcentajeDescuento || 0)
                .input("stockMinimo", sql.Int, stockMinimo || 1)
                .query(`
                    UPDATE PRODUCTO_SERVICIO SET
                        nombre = @nombre,
                        marca = @marca,
                        descripcion = @descripcion,
                        precio = @precio,
                        stock = @stock,
                        fechaIngreso = @fechaIngreso,
                        ubicacionAlmacen = @ubicacionAlmacen,
                        proveedor = @proveedor,
                        categoria = @categoria,
                        vehiculosCompatibles = @vehiculosCompatibles,
                        tipo = @tipo,
                        img = @img,
                        porcentajeDescuento = @porcentajeDescuento,
                        stockMinimo = @stockMinimo
                    WHERE idProducto = @idProducto
                    AND estado = 1
                `);
            console.log("Filas afectadas:", result.rowsAffected[0]);
            return result.rowsAffected[0];
        }
        catch (error) {
            console.error("Server - Error en actualizar producto o servicio:", error);
            throw new Error("Server - Error en actualizar producto o servicio");
        }
    }
    // Eliminar un producto
    async deleteProducto(idProducto) {
        try {
            const pool = await connectDB();
            await pool.request().input("idProducto", sql.Int, idProducto)
                .query(`
                UPDATE PRODUCTO_SERVICIO
                SET estado = 0
                WHERE idProducto = @idProducto`);
        }
        catch (error) {
            console.error("Error en delete:", error);
            throw new Error("Error al eliminar el producto");
        }
    }

    async getMinMax() {
        try {
            const pool = await connectDB();
            const result = await pool.request().query(`
                SELECT MIN(precio) AS precioMin, MAX(precio) AS precioMax
                FROM PRODUCTO_SERVICIO WHERE estado = 1`);
            return result.recordset;
        } catch (error) {
            console.error("Error en obtener:", error);
            throw new Error(error);
        }
    }
}