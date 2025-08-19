import sql from 'mssql';
import { connectDB } from '../../config/database.js';

export class Ausencia {
  constructor(idTrabajador, fechaAusencia, justificada) {
    this.idTrabajador = idTrabajador;
    this.fechaAusencia = fechaAusencia;
    this.justificada = justificada;
  }
}

export class AusenciaRepository {
  // Insertar ausencia

  async insertAusencia(idTrabajador, fechaAusencia, justificada) {
    try {
      const pool = await connectDB();
      const idTrabajadorInt=parseInt(idTrabajador,10);
      if (isNaN(idTrabajadorInt)) {
        throw new Error("El ID del trabajador debe ser un número entero válido");
      }
      const result = await pool
        .request()
        .input("idTrabajador", sql.Int, idTrabajadorInt)
        .input("fechaAusencia", sql.Date, fechaAusencia)
        .input("justificada", sql.Bit, justificada)
        .query(`
          INSERT INTO AUSENCIAS (idTrabajador, fechaAusencia, justificada)
          VALUES (@idTrabajador, @fechaAusencia, @justificada)
        `);

      console.log("Ausencia insertada exitosamente");
      return result.rowsAffected[0];
    } catch (error) {
      console.error("Error al insertar ausencia:", error);
      throw new Error("Error al insertar ausencia");
    }
  }

  // Actualizar ausencia
  async updateAusencia(idAusencia, datosActualizados) {
    try {
      const pool = await connectDB();

      const { idTrabajador, fechaAusencia, justificada } = datosActualizados;

      const result = await pool
        .request()
        .input("idAusencia", sql.Int, idAusencia)
        .input("idTrabajador", sql.Int, idTrabajador)
        .input("fechaAusencia", sql.Date, fechaAusencia)
        .input("justificada", sql.Bit, justificada)
        .query(`
          UPDATE AUSENCIAS
          SET idTrabajador = @idTrabajador,
              fechaAusencia = @fechaAusencia,
              justificada = @justificada
          WHERE idAusencia = @idAusencia
        `);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error("Error al actualizar ausencia:", error);
      throw new Error("Error al actualizar ausencia");
    }
  }

  // Eliminar ausencia
  async deleteAusencia(idAusencia) {
    try {
      const pool = await connectDB();

      const result = await pool
        .request()
        .input("idAusencia", sql.Int, idAusencia)
        .query(`DELETE FROM AUSENCIAS WHERE idAusencia = @idAusencia`);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error("Error al eliminar ausencia:", error);
      throw new Error("Error al eliminar ausencia");
    }
  }

  // Obtener todas las ausencias
  async getAusencias() {
    try {
      const pool = await connectDB();
      const result = await pool.request().query(`
        SELECT 
        a.idAusencia, 
        a.idTrabajador, 
        a.fechaAusencia, 
        a.justificada,
        t.nombreCompleto as nombreTrabajador
        FROM AUSENCIAS a JOIN TRABAJADOR t ON a.idTrabajador = t.idTrabajador
      `);
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener ausencias:", error);
      throw new Error("Error al obtener ausencias");
    }
  }

  // Obtener ausencia por ID
  async getAusenciaPorId(idAusencia) {
    try {
      const pool = await connectDB();
      const result = await pool
        .request()
        .input("idAusencia", sql.Int, idAusencia)
        .query(`
          SELECT idAusencia, idTrabajador, fechaAusencia, justificada
          FROM AUSENCIAS
          WHERE idAusencia = @idAusencia
        `);
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener ausencia por ID:", error);
      throw new Error("Error al obtener ausencia por ID");
    }
  }

  // Obtener ausencias por trabajador
  async getAusenciasPorTrabajador(idTrabajador) {
    try {
      const pool = await connectDB();
      const result = await pool
        .request()
        .input("idTrabajador", sql.Int, idTrabajador)
        .query(`
          SELECT idAusencia, idTrabajador, fechaAusencia, justificada
          FROM AUSENCIAS
          WHERE idTrabajador = @idTrabajador
        `);
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener ausencias por trabajador:", error);
      throw new Error("Error al obtener ausencias por trabajador");
    }
  }
}
