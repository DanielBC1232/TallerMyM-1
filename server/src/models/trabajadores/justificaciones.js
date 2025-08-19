import sql from 'mssql';
import { connectDB } from '../../config/database.js';

export class Justificacion {
  constructor(idAusencia, motivo, estado = 'Pendiente') {
    this.idAusencia = idAusencia;
    this.motivo = motivo;
    this.estado = estado;
  }
}

export class JustificacionRepository {
  // Insertar nueva justificación
  async insertJustificacion(justificacion) {
    try {
      const pool = await connectDB();
      await pool
        .request()
        .input("idAusencia", sql.Int, justificacion.idAusencia)
        .input("motivo", sql.VarChar(255), justificacion.motivo)
        .input("estado", sql.VarChar(20), justificacion.estado)
        .query(`
          INSERT INTO JUSTIFICACIONES_AUSENCIA (
            idAusencia, 
            motivo, 
            estado
          )
          VALUES (
            @idAusencia, 
            @motivo, 
            @estado
          )
        `);
    } catch (error) {
      console.error("Error al insertar justificación:", error);
      throw new Error("Error al insertar justificación");
    }
  }

  // Actualizar justificación
  async updateJustificacion(idJustificacion, datosActualizados) {
    try {
      const pool = await connectDB();
      const { motivo, estado } = datosActualizados;

      const result = await pool
        .request()
        .input("idJustificacion", sql.Int, idJustificacion)
        .input("motivo", sql.VarChar(255), motivo)
        .input("estado", sql.VarChar(20), estado)
        .query(`
          UPDATE JUSTIFICACIONES_AUSENCIA
          SET 
            motivo = @motivo,
            estado = @estado
          WHERE idJustificacion = @idJustificacion
        `);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error("Error al actualizar justificación:", error);
      throw new Error("Error al actualizar justificación");
    }
  }

  // Eliminar justificación
  async deleteJustificacion(idJustificacion) {
    try {
      const pool = await connectDB();
      const result = await pool
        .request()
        .input("idJustificacion", sql.Int, idJustificacion)
        .query(`DELETE FROM JUSTIFICACIONES_AUSENCIA WHERE idJustificacion = @idJustificacion`);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error("Error al eliminar justificación:", error);
      throw new Error("Error al eliminar justificación");
    }
  }

  // Obtener todas las justificaciones
  async getJustificaciones() {
    try {
      const pool = await connectDB();
      const result = await pool.request().query(`
        SELECT 
          idJustificacion,
          idAusencia,
          motivo,
          fechaJustificacion,
          estado
        FROM JUSTIFICACIONES_AUSENCIA
      `);
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener justificaciones:", error);
      throw new Error("Error al obtener justificaciones");
    }
  }

  // Obtener justificación por ID
  async getJustificacionPorId(idJustificacion) {
    try {
      const pool = await connectDB();
      const result = await pool
        .request()
        .input("idJustificacion", sql.Int, idJustificacion)
        .query(`
          SELECT 
            idJustificacion,
            idAusencia,
            motivo,
            fechaJustificacion,
            estado
          FROM JUSTIFICACIONES_AUSENCIA
          WHERE idJustificacion = @idJustificacion
        `);
      return result.recordset[0];
    } catch (error) {
      console.error("Error al obtener justificación por ID:", error);
      throw new Error("Error al obtener justificación por ID");
    }
  }

  // Obtener justificación por ausencia
  async getJustificacionPorAusencia(idAusencia) {
    try {
      const pool = await connectDB();
      const result = await pool
        .request()
        .input("idAusencia", sql.Int, idAusencia)
        .query(`
          SELECT 
            idJustificacion,
            idAusencia,
            motivo,
            fechaJustificacion,
            estado
          FROM JUSTIFICACIONES_AUSENCIA
          WHERE idAusencia = @idAusencia
        `);
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener justificación por ausencia:", error);
      throw new Error("Error al obtener justificación por ausencia");
    }
  }
}
