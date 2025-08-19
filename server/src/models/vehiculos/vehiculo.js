import sql from 'mssql';
import { connectDB } from '../../config/database.js';

class Vehiculo {
  constructor(placaVehiculo, modeloVehiculo, marcaVehiculo, annoVehiculo, tipoVehiculo, estado, idCliente) {

    this.idVehiculo = 0;
    this.placaVehiculo = placaVehiculo;
    this.modeloVehiculo = modeloVehiculo;
    this.marcaVehiculo = marcaVehiculo;
    this.annoVehiculo = annoVehiculo;
    this.tipoVehiculo = tipoVehiculo;
    this.estado = estado;
    this.idCliente = idCliente;
  }
}
//------------
class VehiculoRepository {

  // Función para verificar si el vehículo ya existe en la base de datos
  async checkIfVehiculoExists(placaVehiculo) {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("placaVehiculo", sql.VarChar, placaVehiculo)
      .query("SELECT COUNT(*) AS count FROM CLIENTE_VEHICULO WHERE placaVehiculo = @placaVehiculo");

    return result.recordset[0].count > 0; // Si count > 0, el vehículo ya existe
  }

  // Insertar nuevos vehículos
  async insert(placaVehiculo, modeloVehiculo, marcaVehiculo, annoVehiculo, tipoVehiculo, idCliente) {
    try {
      // Si no existe, procedemos con la inserción
      const pool = await connectDB();
      await pool
        .request()
        .input("placaVehiculo", sql.VarChar, placaVehiculo)
        .input("modeloVehiculo", sql.VarChar, modeloVehiculo)
        .input("marcaVehiculo", sql.VarChar, marcaVehiculo)
        .input("annoVehiculo", sql.Int, parseInt(annoVehiculo))
        .input("tipoVehiculo", sql.VarChar, tipoVehiculo)
        .input("idCliente", sql.Int, parseInt(idCliente))
        .query(`
        INSERT INTO CLIENTE_VEHICULO (placaVehiculo, modeloVehiculo, marcaVehiculo, annoVehiculo, tipoVehiculo, idCliente)
        VALUES (@placaVehiculo, @modeloVehiculo, @marcaVehiculo, @annoVehiculo, @tipoVehiculo, @idCliente)
      `);

      console.log("Vehículo insertado exitosamente");
    } catch (error) {
      console.error("Error en insert:", error);
      if (error.statusCode === 409) {
        // Manejo del error 409 (conflicto de placa)
        throw { statusCode: 409, message: error.message };
      }
      throw new Error("Error al insertar el vehículo");
    }
  }

  // Actualizar cliente
  async updateVehiculo(idVehiculo, datosActualizados) {
  try {
    const pool = await connectDB();

    const { placaVehiculo, modeloVehiculo, marcaVehiculo, annoVehiculo, tipoVehiculo, idCliente } = datosActualizados;

    const result = await pool
      .request()
      .input("idVehiculo", sql.Int, idVehiculo)
      .input("placaVehiculo", sql.VarChar, placaVehiculo)
      .input("modeloVehiculo", sql.VarChar, modeloVehiculo)
      .input("marcaVehiculo", sql.VarChar, marcaVehiculo)
      .input("annoVehiculo", sql.Int, annoVehiculo)
      .input("tipoVehiculo", sql.VarChar, tipoVehiculo)
      .input("idCliente", sql.Int, idCliente)
      .query(`
        UPDATE CLIENTE_VEHICULO
        SET placaVehiculo = @placaVehiculo, modeloVehiculo = @modeloVehiculo, marcaVehiculo = @marcaVehiculo,
        annoVehiculo = @annoVehiculo, tipoVehiculo = @tipoVehiculo, idCliente = @idCliente WHERE idVehiculo = @idVehiculo`);
    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error("Error al actualizar el vehiculo:", error);
    throw new Error("Error al actualizar el vehiculo");
  }
}

  // Eliminar cliente
  async deleteVehiculo(idVehiculo) {
  try {

    const pool = await connectDB();
    console.log("Conexión establecida con la base de datos.");

    const result = await pool
      .request()
      .input("idVehiculo", sql.Int, idVehiculo)
      .query(`UPDATE CLIENTE_VEHICULO SET estado = 0 WHERE idVehiculo = @idVehiculo`);

    console.log("Resultado de la eliminación:", result);
    console.log("Filas afectadas:", result.rowsAffected[0]);

    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error("Error al eliminar vehiculo:", error);
    throw new Error("Error al eliminar vehiculo");
  }
}
  //----CED
  //select todos
  async getAll() {
  try {
    const pool = await connectDB();
    const result = await pool.request()
      .query(`SELECT 
        CV.idVehiculo,
        CV.placaVehiculo,
        CV.modeloVehiculo,
        CV.marcaVehiculo,
        CV.annoVehiculo,
        CV.tipoVehiculo,
        C.nombre +' '+C.apellido as nombreCliente
      FROM CLIENTE_VEHICULO CV 
      INNER JOIN CLIENTE C ON C.idCliente = CV.idCliente
      WHERE CV.estado = 1`);
    return result.recordset;
  } catch (error) {
    console.error("Error al obtener todos los clientes:", error);
    throw new Error("Error al obtener clientes");
  }
}

  // Buscar por ID cliente // Select-Flujo
  async getVehiculosPorCliente(idCliente) {
  try {
    const pool = await connectDB();
    const result = await pool.request()
      .input("idCliente", sql.Int, idCliente)
      .query(`SELECT idVehiculo, modeloVehiculo, marcaVehiculo, annoVehiculo FROM CLIENTE_VEHICULO
        WHERE idCliente = @idCliente
        AND estado = 1`);
    return result.recordset;
  } catch (error) {
    console.error("Error al obtener los vehiculos:", error);
    throw new Error("Error al obtener vehiculos");
  }
}

  // Buscar por ID cliente // Select-Flujo
  async getVehiculosPorIdVehiculo(idVehiculo) {
  try {
    const pool = await connectDB();
    const result = await pool.request()
      .input("idVehiculo", sql.Int, idVehiculo).query(`SELECT idVehiculo,placaVehiculo, modeloVehiculo, marcaVehiculo, annoVehiculo,tipoVehiculo,"idCliente"
        FROM CLIENTE_VEHICULO WHERE idVehiculo = @idVehiculo
        AND estado = 1`);
    return result.recordset;
  } catch (error) {
    console.error("Error al obtener los vehiculos:", error);
    throw new Error("Error al obtener vehiculos");
  }
}

  // Obtener cliente por cédula
  async getByPlaca(placaVehiculo) {
  try {
    const pool = await connectDB();
    const result = await pool.request().input("placaVehiculo", sql.VarChar(10), placaVehiculo)
      .query("SELECT * FROM CLIENTE_VEHICULO WHERE placaVehiculo = @placaVehiculo AND estado = 1");
    return result.recordset;

  } catch (error) {
    console.error("Error al consultar el vehiculo:", error);
    throw new Error("Error al consultar el vehiculo");
  }
}
}

export { Vehiculo, VehiculoRepository };