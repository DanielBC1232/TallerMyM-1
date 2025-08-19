import sql from 'mssql';
import { connectDB } from '../../config/database.js';
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../services/jwtUtils.js';
import { enviarCorreoVerificacion } from '../../config/mailerConfig.js';

export class Usuario {
  constructor(username, email, cedula, password, idRol) {
    this.idUsuario = 0; // Se generará automáticamente en la BD
    this.username = username;
    this.email = email;
    this.cedula = cedula;
    this.password = password; // Se recomienda almacenar un hash en lugar del texto plano
    this.idRol = idRol;
    this.failedLoginAttempts = 0;
    this.isLocked = 0;
    this.resetToken = null;
    this.resetTokenExpiry = null;
    this.lastLogin = null;
    this.lastPasswordChange = null;
  }
}

export class UsuarioRepository {

  //Generar token
  async generateToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 8; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  // hash sha1
  async sha1Hash(plainText) {
    return await crypto.createHash("sha1").update(plainText).digest("hex");
  }

  async iniciarSesion(email, password) {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query(`
        SELECT 
          idUsuario, username, email, cedula, password, idRol, isLocked, failedLoginAttempts 
        FROM USUARIO 
        WHERE email = @email
      `);

    const usuario = result.recordset[0];

    if (!usuario) {
      return { statusCode: 401, message: "Credenciales no validas" };
    }

    // Si la cuenta está bloqueada
    if (usuario.isLocked === true) {
      return { statusCode: 423, message: "La cuenta esta bloqueada" };
    }

    // Compara la contraseña proporcionada con la almacenada (encriptada)
    const hashInput = await this.sha1Hash(password);

    if (hashInput === usuario.password) {
      // Si las credenciales son correctas y la cuenta no está bloqueada

      // Actualizamos la fecha de último login y reestablecemos los intentos fallidos
      await pool
        .request()
        .input("idUsuario", sql.Int, usuario.idUsuario)
        .query(`
          UPDATE USUARIO
          SET lastLogin = GETDATE(),
              failedLoginAttempts = 5
          WHERE idUsuario = @idUsuario
        `);

      // Creamos el token JWT
      const { idUsuario, username, email, cedula, idRol } = usuario;
      const token = jwt.sign(
        { idUsuario, username, email, cedula, idRol },
        JWT_SECRET,
        { expiresIn: "2h" } // El token expira en 2 horas
      );

      return {
        statusCode: 200,
        data: {
          idUsuario,
          username,
          email,
          cedula,
          idRol,
          token  //JWT generado
        }
      };
    } else {
      // Si las credenciales son incorrectas, actualizamos los intentos fallidos
      if (usuario.idRol === 2) {
        await pool
          .request()
          .input("idUsuario", sql.Int, usuario.idUsuario)
          .query(`
            UPDATE USUARIO
            SET failedLoginAttempts = failedLoginAttempts - 1,
                isLocked = CASE WHEN failedLoginAttempts - 1 <= 0 THEN 1 ELSE isLocked END
            WHERE idUsuario = @idUsuario
          `);
      }
      return { statusCode: 401, message: "Credenciales no validas" };
    }
  }

  async existeCorreo(email) {
    try {
      const pool = await connectDB();
      const result = await pool
        .request()
        .input("email", sql.NVarChar(100), email)
        .query("SELECT 1 FROM USUARIO WHERE email = @email");

      return result.recordset.length > 0;
    } catch (error) {
      console.error("Error al verificar el correo:", error);
      throw new Error("Error al verificar existencia de correo");
    }
  }

  async existeCedula(cedula) {
    try {
      const pool = await connectDB();
      const result = await pool
        .request()
        .input("cedula", sql.VarChar(500), cedula)
        .query("SELECT 1 FROM USUARIO WHERE cedula = @cedula");
      return result.recordset.length > 0;
    } catch (error) {
      console.error("Error al verificar el correo:", error);
      throw new Error("Error al verificar existencia de correo");
    }
  }

  // Insertar nuevos usuarios
  async insertUser(username, email, cedula, password) {
    try {
      const existeCorreo = await this.existeCorreo(email);
    if (existeCorreo) {
        const conflict = new Error("Ya existe un usuario con este correo");
        conflict.status = 409;
        conflict.reason = "email_exists";
        throw conflict;
    }

    const existeCedula = await this.existeCedula(cedula);
    if (existeCedula) {
        const conflict = new Error("Ya existe un usuario con esta cédula");
        conflict.status = 409;
        conflict.reason = "cedula_exists";
        throw conflict;
    }

      // Hashear la contraseña
      const hashedPassword = await this.sha1Hash(password);

      const pool = await connectDB();
      await pool
        .request()
        .input("username", sql.NVarChar(50), username)
        .input("email", sql.NVarChar(100), email)
        .input("cedula", sql.VarChar(50), cedula)
        .input("password", sql.NVarChar(255), hashedPassword)
        .query(`INSERT INTO USUARIO (username, email, cedula, password)
        VALUES (@username, @email, @cedula, @password)`);
    } catch (error) {
      console.error("Error en insert:", error);
      throw new Error("Error al insertar usuario");
    }
  }

  async updateUsuario(idUsuario, username, email, idRol, password) {
    try {
      const pool = await connectDB();

      if (password && password.trim() !== "") {
        // Hashear la contraseña
        var hashedPassword = await this.sha1Hash(password);
      }

      const result = await pool
        .request()
        .input("idUsuario", sql.Int, idUsuario)
        .input("username", sql.NVarChar(50), username)
        .input("email", sql.NVarChar(100), email)
        .input("idRol", sql.Int, idRol)
        .input("password", sql.NVarChar(255), hashedPassword)
        .execute(`SP_ACTUALIZAR_USUARIO`);
      return result.rowsAffected[0];
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw new Error("Error al actualizar usuario");
    }
  }

  // Eliminar usuario
  async cambiarEstadoUsuario(idUsuario, isLocked) {
    try {
      const pool = await connectDB();
      const result = await pool
        .request()
        .input("idUsuario", sql.Int, idUsuario)
        .input("isLocked", sql.Bit, isLocked)
        .query(`UPDATE USUARIO SET isLocked = @isLocked, failedLoginAttempts = 5 WHERE idUsuario = @idUsuario AND idRol = 2`);
      return result.rowsAffected[0];
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw new Error("Error al eliminar usuario");
    }
  }

  //select todos
  async getAll() {
    try {
      const pool = await connectDB();
      const result = await pool.request()
        .query(`SELECT 
        U.idUsuario,
        U.username,
        U.email,
        U.cedula,
        U.idRol,
        U.isLocked,
        u.lastPasswordChange,
        R.nombreRol as rol
        FROM USUARIO U
        INNER JOIN ROLES R ON U.idRol = R.idRol
        ORDER BY U.isLocked ASC`);
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener todos los usuarios:", error);
      throw new Error("Error al obtener usuarios");
    }
  }

  //select uno por ID
  async getOneByID(idUsuario) {
    try {
      const pool = await connectDB();
      const result = await pool
        .request()
        .input("idUsuario", sql.Int, idUsuario)
        .query(`SELECT
        idUsuario,
        username,
        email,
        cedula,
        idRol
        FROM USUARIO WHERE idUsuario = @idUsuario`);
      return result.recordset[0];
    } catch (error) {
      console.error("Error al obtener el usuario por ID:", error);
      throw new Error("Error al obtener usuario");
    }
  }

  // Verificar/enviar correo con token generado (recuperacion de contrasena)
  async enviarCorreoToken(email) {
    try {
      const resetToken = await this.generateToken();//Generar token
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);//tiempo de expiracion

      const pool = await connectDB();
      const result = await pool
        .request()
        .input("email", sql.NVarChar(100), email)
        .input("resetToken", sql.NVarChar(100), resetToken)
        .input("resetTokenExpiry", sql.DateTime, resetTokenExpiry)
        .query(`
          UPDATE USUARIO
          SET resetToken = @resetToken,
              resetTokenExpiry = @resetTokenExpiry
          WHERE email = @email
        `);
      if (result.rowsAffected[0] > 0) {
        await enviarCorreoVerificacion(email, resetToken);
      }
      return result.rowsAffected[0];

    } catch (error) {
      console.error("Error al verificar el correo:", error);
      throw new Error("Error al verificar existencia de correo");
    }
  }

  // Verificar token (recuperacion de contrasena) - cuando el usuario ingresa el token
  async verificarToken(email, token) {
    try {

      const pool = await connectDB();
      const result = await pool
        .request()
        .input("email", sql.NVarChar(100), email)
        .input("resetToken", sql.NVarChar(100), token)
        .query(`
          SELECT * FROM USUARIO
          WHERE resetToken = @resetToken AND resetTokenExpiry > GETDATE()
        `);
      return result.recordset[0];
    } catch (error) {
      console.error("Error al verificar el correo:", error);
      throw new Error("Error al verificar existencia de correo");
    }
  }

  // Cambiar contrasena
  async updateContrasena(email, password) {
    try {
      const pool = await connectDB();

      if (password && password.trim() !== "") {
        // Hashear la contraseña
        var hashedPassword = await this.sha1Hash(password);
      }

      const result = await pool
        .request()
        .input("email", sql.NVarChar(100), email)
        .input("password", sql.NVarChar(255), hashedPassword)
        .query(`
          UPDATE USUARIO
          SET password = @password,
              resetToken = NULL,
              resetTokenExpiry = NULL,
              lastPasswordChange = GETDATE()
          WHERE email = @email
        `);
      return result.rowsAffected[0];
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw new Error("Error al actualizar usuario");
    }
  }

}