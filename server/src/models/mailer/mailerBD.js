import { connectDB } from '../../config/database.js';
import { enviarCorreo } from "../../config/mailerConfig.js";

//cambios entre listo, en proceso, finalizado, por cobrar(venta)
async function cambioEstadoOrden() {
    try {
        const pool = await connectDB();
        const result = await pool.request().query(`
            SELECT
                O.idOrden,
                C.nombre +' '+ C.apellido as nombreCliente,
                C.correo,
                O.codigoOrden,
                CV.marcaVehiculo +' '+ CV.modeloVehiculo +' '+ CAST(CV.annoVehiculo as varchar(4)) as vehiculo,
                O.estadoOrden,
                O.estadoCorreoNotificacion
            FROM ORDEN O
            INNER JOIN CLIENTE C ON C.idCliente = O.idCliente
            INNER JOIN CLIENTE_VEHICULO CV ON CV.idVehiculo = O.idVehiculo
            WHERE O.estadoCorreoNotificacion IS NULL OR O.estadoCorreoNotificacion != O.estadoOrden
        `);

        for (let row of result.recordset) {
            await enviarCorreo(row.nombreCliente, row.correo, row.codigoOrden, row.vehiculo, row.estadoOrden);

            // Marcar como procesado para evitar enviar spam o correos duplicados
            //si estado de orden y estado de correo son iguales no envia correo, si son diferentes si envia correo.
            await pool.request().query(`
                UPDATE ORDEN 
                SET estadoCorreoNotificacion = ${row.estadoOrden} 
                WHERE idOrden = ${row.idOrden}
              `);
        }
    } catch (err) {
        console.error("Error procesando cambios:", err);
    }
}

export { cambioEstadoOrden };
