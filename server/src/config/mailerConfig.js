import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'mymtaller.cr@gmail.com',
        pass: 'luou jfuw cxvi hwaq' //contrasena de aplicacion
        // SUB1RAB4JO%-             contrasena de correo
    },
    connectionTimeout: 10000, // Timeout para conexiones
    socketTimeout: 10000, // Timeout para el socket
    greetingTimeout: 5000, // Timeout para el saludo
    tls: {
        rejectUnauthorized: false
    }
});

// Función para enviar correo
async function enviarCorreo(nombreCliente, correo, codigoOrden, vehiculo, estadoOrden) {
    let nuevoEstado = '';
    switch (estadoOrden) {
        case 0:
            nuevoEstado = '"cancelado"';
            break;
        case 1:
            nuevoEstado = '"en espera"';
            break;
        case 2:
            nuevoEstado = '"en proceso"';
            break;
        case 3:
            nuevoEstado = '"listo"';
            break;
        default:
            nuevoEstado = '"cobro"';
            break;
    }

    const mailOptions = {
        from: 'mymtaller.cr@gmail.com', // Correo del sistema
        to: correo, // Correo del cliente
        subject: `Actualización de Estado de Orden`,
        text: `Saludos ${nombreCliente},\n\nSu orden de código ${codigoOrden} del vehículo ${vehiculo} ha cambiado al estado ${nuevoEstado}.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado a ${correo} sobre la orden ${codigoOrden}`);
    } catch (error) {
        console.error("Error enviando correo:", error);
    }
}

// Función para enviar correo
async function enviarCorreoVerificacion(email, token) {

    const mailOptions = {
        from: 'mymtaller.cr@gmail.com', // Correo del sistema
        to: email, // Correo del cliente
        subject: `Cambio de contraseña`,
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #2b2f32; padding: 20px;">
            <h2 style="color: #fff;">Saludos,</h2>
            <p style="color: #fff;">Su código de verificación es:</p>
            <hr style="border: 1px solid #1cbb8c;">
            <p style="font-size: 24px; font-weight: bold; color: #1cbb8c;">${token}</p>
            <hr style="border: 1px solid #1cbb8c;">
            <p style="color: #fff;">Este código expirará en <strong>1 hora</strong>.</p>
            <hr>
            <p style="font-size: 12px; color: #fff;">Este es un mensaje automático, no responda a este correo.</p>
        </div>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado sobre cambio de contraseña`);
    } catch (error) {
        console.error("Error enviando correo:", error);
    }
}

export { enviarCorreo, enviarCorreoVerificacion };