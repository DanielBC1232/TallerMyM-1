import sql from "mssql";
import { connectDB } from "../../config/database.js";

export class Trabajador {
  constructor(idTrabajador, nombreCompleto, cedula, salario, seguroSocial,estado) {
    this.idTrabajador = idTrabajador;
    this.nombreCompleto = nombreCompleto;
    this.cedula = cedula;
    this.salario = salario;
    this.seguroSocial = seguroSocial;
    this.estado = estado;
  }
}

export class TrabajadorRepository {
  // Método para insertar trabajador
  async insertTrabajador(nombreCompleto, cedula, salario, seguroSocial) {
    try {
      const pool = await connectDB();
      const result = await pool
        .request()
        .input("nombreCompleto", sql.VarChar, nombreCompleto)
        .input("cedula", sql.VarChar, cedula)
        .input("salario", sql.Decimal(10, 2), salario)
        .input("seguroSocial", sql.VarChar, seguroSocial).query(`
        INSERT INTO TRABAJADOR
        (nombreCompleto, cedula, salario, seguroSocial)
        VALUES
        (@nombreCompleto, @cedula, @salario, @seguroSocial)`);
      return result.rowsAffected[0]; // Devuelve el número de filas afectadas
    } catch (error) {
      console.error("Error en insertar trabajador:", error);
      throw new Error("Error en insertar trabajador");
    }
  }

  async findOne(cedula) {
    try {
      const pool = await connectDB();
      const result = await pool.request().input("cedula", sql.VarChar, cedula)
        .query(`
        SELECT * FROM TRABAJADOR
         WHERE cedula = @cedula AND estado = 1`);
      // Si no hay registros, result.recordset estara vacío
      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      console.error("Error al buscar trabajador:", error);
      throw new Error("Error al buscar trabajador");
    }
  }

  async getMenu() {
    try {
      const pool = await connectDB();
      const result = await pool
        .request()
        .query("SELECT idTrabajador,nombreCompleto FROM TRABAJADOR WHERE estado = 1");
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener todos los clientes:", error);
      throw new Error("Error al obtener clientes");
    }
  }

  // Obtener listado de trabajadores
  async getTrabajadores(nombreCompleto, cedula, salarioMin, salarioMax) {
    try {
      const pool = await connectDB();
      const result = await pool
        .request()
        .input("nombreCompleto", sql.VarChar, nombreCompleto || null)
        .input("cedula", sql.VarChar, cedula || null)
        .input("salarioMin", sql.Decimal(10, 2), salarioMin || null)
        .input("salarioMax", sql.Decimal(10, 2), salarioMax || null)
        .query(`SELECT * FROM TRABAJADOR WHERE estado = 1`);
      return result.recordset; // Devuelve el listado (todos los resultados)
    } catch (error) {
      console.error("Error en obtener trabajadores:", error);
      throw new Error("Error en obtener trabajadores");
    }
  }

  // Obtener listado de trabajadores innejoin nombre
  async getTrabxAmonest() {
    try {
      const pool = await connectDB();
      const result = await pool.request().query(`SELECT       
        a.idAmonestacion,
        a.idTrabajador,
        t.nombreCompleto AS nombreTrabajador,
        a.fechaAmonestacion,
        a.tipoAmonestacion,
        a.motivo,
        a.accionTomada
            FROM Amonestaciones a
            JOIN Trabajador t ON a.idTrabajador = t.idTrabajador
            WHERE t.estado = 1
            ORDER BY a.fechaAmonestacion DESC`);
      return result.recordset; // Devuelve el listado (todos los resultados)
    } catch (error) {
      console.error("Error en obtener trabajadores:", error);
      throw new Error("Error en obtener trabajadores");
    }
  }

  // Obtener trabajador por ID
  async getTrabajadorById(idTrabajador) {
    try {
      const pool = await connectDB();
      const result = await pool
        .request()
        .input("idTrabajador", sql.Int, idTrabajador)
        .query(`SELECT * FROM TRABAJADOR WHERE idTrabajador = @idTrabajador AND estado = 1`);
      return result.recordset[0]; // Devuelve el registro (el primero si existe)
    } catch (error) {
      console.error("Error en obtener trabajador:", error);
      throw new Error("Error en obtener trabajador");
    }
  }

  // Obtener trabajador por ID
  async getTrabajadorByCedula(cedula) {
    try {
      const pool = await connectDB();
      const result = await pool
        .request()
        .input("cedula", sql.VarChar(50), cedula)
        .query(`SELECT * FROM TRABAJADOR WHERE cedula = @cedula AND estado = 1`);
      return result.recordset[0]; // Devuelve el registro (el primero si existe)
    } catch (error) {
      console.error("Error en obtener trabajador:", error);
      throw new Error("Error en obtener trabajador");
    }
  }

  // Actualizar trabajador
  async updateTrabajador(idTrabajador, nombreCompleto, cedula, salario, seguroSocial) {
    try {
      const pool = await connectDB();
      const result = await pool
        .request()
        .input("idTrabajador", sql.Int, idTrabajador)
        .input("nombreCompleto", sql.VarChar, nombreCompleto)
        .input("cedula", sql.VarChar, cedula)
        .input("salario", sql.Decimal(10, 2), salario)
        .input("seguroSocial", sql.VarChar, seguroSocial).query(`
                UPDATE TRABAJADOR
                SET nombreCompleto = @nombreCompleto,
                    cedula = @cedula,
                    salario = @salario,
                    seguroSocial = @seguroSocial
                WHERE idTrabajador = @idTrabajador
                AND estado = 1`);
      return result.rowsAffected[0]; // Devuelve el número de filas afectadas
    } catch (error) {
      console.error("Error en actualizar trabajador:", error);
      throw new Error("Error en actualizar trabajador");
    }
  }

  // Eliminar trabajador
  async deleteTrabajador(idTrabajador) {
    try {
      const pool = await connectDB();
      const result = await pool
        .request()
        .input("idTrabajador", sql.Int, idTrabajador)
        .query(`UPDATE TRABAJADOR SET estado = 0
                WHERE idTrabajador = @idTrabajador`);
      return result.rowsAffected; // Devuelve el número de filas afectadas
    } catch (error) {
      console.error("Error en eliminar trabajador:", error);
      throw new Error("Error en eliminar trabajador");
    }
  }

  // Obtener listado de trabajadores
  async getTrabajadoresEficientes() {
    try {
      const pool = await connectDB();
      const result = await pool.request().query(`SELECT
            T.nombreCompleto,
            T.cedula,
            COUNT(O.idOrden) AS totalOrdenes
        FROM TRABAJADOR T
        INNER JOIN ORDEN O ON O.idTrabajador = T.idTrabajador
        WHERE 
            O.estadoOrden IN (3, 4) AND
            O.fechaIngreso >= DATEADD(DAY, -30, GETDATE())
        GROUP BY
            T.nombreCompleto,
            T.cedula
        ORDER BY
            totalOrdenes DESC`);
      return result.recordset; // Devuelve el listado (todos los resultados)
    } catch (error) {
      console.error("Error en obtener trabajadores:", error);
      throw new Error("Error en obtener trabajadores");
    }
  }
}
