import sql from 'mssql';
import { connectDB } from '../../config/database.js';

export class Cliente {
  constructor(nombre, apellido, cedula, correo, telefono, fechaRegistro, estado) {
    this.idCliente = 0;
    this.nombre = nombre;
    this.apellido = apellido;
    this.cedula = cedula;
    this.correo = correo;
    this.telefono = telefono;
    this.fechaRegistro = fechaRegistro;
    this.estado = estado;
  }
}
//------------
export class ClienteRepository {

  async cedulaExiste(cedula) {
    try {
      const pool = await connectDB();
      const result = await pool
        .request()
        .input("cedula", sql.VarChar, cedula)
        .query(`SELECT 1 FROM CLIENTE WHERE cedula = @cedula`);

      return result.recordset.length > 0;
    } catch (error) {
      console.error("Error al verificar cédula:", error);
      throw new Error("Error al verificar cédula");
    }
  }

  // Insertar nuevos clientes
  async insert(nombre, apellido, cedula, correo, telefono) {
    try {
      const existe = await this.cedulaExiste(cedula);
      if (existe) {
        const conflict = new Error("Ya existe un cliente con esa cédula");
        conflict.status = 409;
        throw conflict;
      }

      const pool = await connectDB();
      await pool
        .request()
        .input("nombre", sql.VarChar, nombre)
        .input("apellido", sql.VarChar, apellido)
        .input("cedula", sql.VarChar, cedula)
        .input("correo", sql.VarChar, correo)
        .input("telefono", sql.VarChar, telefono)
        .query(`
          INSERT INTO CLIENTE (nombre, apellido, cedula, correo, telefono, fechaRegistro)
          VALUES (@nombre, @apellido, @cedula, @correo, @telefono, GETDATE())
        `);

      console.log("Cliente insertado exitosamente");
    } catch (error) {
      if (error.status === 409) throw error;
      console.error("Error en insert:", error);
      throw new Error("Error al insertar cliente");
    }
  }

  // Actualizar cliente
  async updateCliente(cedula, datosActualizados) {
    try {
      const existe = await this.cedulaExiste(cedula);
      if (!existe) {
        const conflict = new Error("No se encontró cliente con esa cédula");
        conflict.status = 409;
        throw conflict;
      }

      const pool = await connectDB();
      const { id, nombre, apellido, correo, telefono } = datosActualizados;

      const result = await pool
        .request()
        .input("idCliente", sql.Int, id)
        .input("cedula", sql.VarChar, cedula)
        .input("nombre", sql.VarChar, nombre)
        .input("apellido", sql.VarChar, apellido)
        .input("correo", sql.VarChar, correo)
        .input("telefono", sql.VarChar, telefono)
        .query(`
          UPDATE CLIENTE
          SET nombre = @nombre, apellido = @apellido, correo = @correo, telefono = @telefono
          WHERE cedula = @cedula
        `);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      if (error.status === 409) throw error;
      console.error("Error al actualizar cliente:", error);
      throw new Error("Error al actualizar cliente");
    }
  }


  // Eliminar cliente
  async deleteCliente(cedula) {
    try {
      const pool = await connectDB();
      console.log("Conexión establecida con la base de datos.");

      const result = await pool
        .request()
        .input("cedula", sql.VarChar, cedula)
        .query(`UPDATE CLIENTE SET estado = 0 WHERE cedula = @cedula`);

      console.log("Resultado de la eliminación:", result);
      console.log("Filas afectadas:", result.rowsAffected[0]);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      throw new Error("Error al eliminar cliente");
    }
  }

  //select todos
  async getAll() {
    try {
      const pool = await connectDB();
      const result = await pool.request().query("SELECT * FROM CLIENTE WHERE estado = 1");
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener todos los clientes:", error);
      throw new Error("Error al obtener clientes");
    }
  }

  // Obtener cliente por cédula
  async getByCedula(cedula) {
    try {
      const pool = await connectDB();
      const result = await pool
        .request()
        .input("cedula", sql.VarChar, cedula)
        .query("SELECT * FROM CLIENTE WHERE cedula = @cedula AND estado = 1");

      return result.recordset;

    } catch (error) {
      console.error("Error al consultar cliente:", error);
      throw new Error("Error al consultar cliente");
    }
  }

  // Obtener clientes
  async getClientesInactivos() {
    try {
      const pool = await connectDB();
      const result = await pool
        .request()
        .query(`SELECT
          idCliente, 
          nombre +' '+ apellido as nombreCliente,
          correo,
          telefono
          FROM CLIENTE WHERE estado = 0
          `);

      return result.recordset || [];

    } catch (error) {
      console.error("Error al consultar cliente:", error);
      throw new Error("Error al consultar cliente");
    }
  }

}