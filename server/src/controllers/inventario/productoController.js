import { ProductoRepository } from "../../models/inventario/producto.js";

const ProductoRepo = new ProductoRepository();

// Obtener todos los productos - filtros y paginacion
export const getAllProductos = async (req, res) => {
    try {
        //console.log(req.body);
        const { nombre, marca, categoria, stock, rangoPrecio } = req.body;

        const producto = await ProductoRepo.getAll(nombre, marca, categoria, stock, rangoPrecio); // Get
        //validaciones
        res.json(producto);
    }
    catch (error) {
        res.status(500).json({ error: "C-Error al obtener los productos" });
    }
};

// Obtener un producto por ID
export const getProductoById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        // Verificar si el ID es válido
        if (isNaN(id)) {
            return res.status(400).json({ error: "El parámetro id debe ser un número válido" });
        }
        const producto = await ProductoRepo.findById(id);
        // Si no se encuentra el producto, se detiene la ejecución con return
        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        // Si se encuentra el producto, se responde con JSON
        return res.json(producto);
    }
    catch (error) {
        console.error("Error en obtener producto por id:", error);
        return res.status(500).json({ error: "Error al obtener el producto" });
    }
};

// Registrar nuevo producto
export const addProducto = async (req, res) => {
    try {
        // Obtener los datos del cuerpo de la solicitud
        const { nombre, marca, descripcion, precio, stock, fechaIngreso, ubicacionAlmacen, proveedor, categoria, vehiculosCompatibles, tipo, img, stockMinimo } = req.body;
        // Llamar al método insertProducto para insertar el nuevo producto en la base de datos
        const nuevoProducto = await ProductoRepo.insertProducto(nombre, marca, descripcion, precio, stock, fechaIngreso, ubicacionAlmacen, proveedor, categoria, vehiculosCompatibles, tipo, img, stockMinimo);
        // Respuesta exitosa con el producto insertado
        res.status(201).json({
            message: "Producto insertado exitosamente",
            producto: nuevoProducto,
        });
        // Manejo de errores
    }
    catch (error) {
        console.error("Error al insertar producto:", error);
        res.status(500).json({ error: "Error al insertar el producto" });
    }
};

// Actualizar un producto
export const updateProducto = async (req, res) => {
    try {
        // Obtener los datos del cuerpo de la solicitud
        const { idproducto, nombre, marca, descripcion, precio, stock, fechaIngreso, ubicacionAlmacen, proveedor, categoria, vehiculosCompatibles, tipo, img, stockMinimo, porcentajeDescuento: porcentajeDescuentoStr } = req.body;

        //parse a porcentaje INT a decimales FLOAT
        const porcentajeDescuento = parseFloat(porcentajeDescuentoStr) / 100 || 0;

        // Llamar al metodo update Producto
        const actualizarProducto = await ProductoRepo.updateProducto(idproducto, nombre, marca, descripcion, precio, stock, fechaIngreso, ubicacionAlmacen, proveedor, categoria, vehiculosCompatibles, tipo, img, porcentajeDescuento, stockMinimo);
        // Respuesta exitosa con el producto actualizado
        res.status(201).json({
            message: "Producto actualizado exitosamente",
            producto: actualizarProducto,
        });
        // Manejo de errores
    }
    catch (error) {
        console.error("Controller - Error al actualizar producto:", error);
        res.status(500).json({ error: "Controller - Error al actualizar el producto" });
    }
};

// Eliminar producto
export const deleteProducto = async (req, res) => {
    try {
        const id = parseInt(req.params.id); // Parametro
        // Verificamos si el producto existe o id valido
        const producto = await ProductoRepo.findById(id);
        if (!producto) {
            res.status(404).json({ error: "Controller - Producto no encontrado" }); // Si no existe o no se encontro con id
        }
        // Llama el metodo de borrado
        await ProductoRepo.deleteProducto(id);
        // Respuesta exitosa
        res.status(200).json({ message: "Controller - Producto eliminado exitosamente" });
    }
    catch (error) {
        //Manejo de errores
        console.error("Controller - Error al eliminar producto:", error);
        res.status(500).json({ error: "Controller - Error al eliminar el producto" });
    }
};

export const getMinMax = async (_req, res) => {
    try {
        const producto = await ProductoRepo.getMinMax();
        if (!producto) {
            return res.status(404).json({ error: "No se encontraron datos de precios" });
        }
        res.json(producto[0]);
    } catch (error) {
        console.error("Error en getMinMax:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};