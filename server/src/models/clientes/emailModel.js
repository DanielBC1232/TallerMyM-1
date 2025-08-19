import sql from 'mssql';
import { connectDB } from '../../config/database.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuración reusable del transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

class EmailModel {
  static async obtenerClientePorId(idCliente) {
    try {
      const pool = await connectDB();
      const result = await pool.request()
        .input('idCliente', sql.Int, idCliente)
        .query('SELECT nombre, apellido, correo FROM CLIENTE WHERE idCliente = @idCliente');

      return result.recordset[0];
    } catch (error) {
      console.error('Error al obtener cliente por ID:', error);
      throw error;
    }
  }

  static async enviarCorreo(destinatario, asunto, contenido) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: destinatario,
      subject: asunto,
      html: contenido
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Correo enviado a: ${destinatario}`);
    } catch (error) {
      console.error('Error al enviar correo:', error);
      throw error;
    }
  }
}

export default EmailModel;