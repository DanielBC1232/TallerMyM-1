import EmailModel from '../../models/clientes/emailModel.js';

const emailController = {
    enviarCorreoCliente: async (req, res) => {
        try {
            const { idCliente } = req.params;
            const { asunto, contenido } = req.body;

            // 1. Obtener datos del cliente
            const cliente = await EmailModel.obtenerClientePorId(idCliente);
            if (!cliente) {
                return res.status(404).json({
                    success: false,
                    message: 'Cliente no encontrado'
                });
            }

            // 2. Enviar correo
            await EmailModel.enviarCorreo(cliente.correo, asunto, contenido);

            res.json({
                success: true,
                message: 'Correo enviado correctamente',
                data: {
                    destinatario: cliente.correo,
                    nombre: `${cliente.nombre} ${cliente.apellido}`
                }
            });

        } catch (error) {
            console.error('Error en emailController:', error);
            res.status(500).json({
                success: false,
                message: 'Error al enviar el correo',
                error: error.message
            });
        }
    }
};

export default emailController;