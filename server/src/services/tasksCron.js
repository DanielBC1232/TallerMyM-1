import { CronJob } from 'cron';
import { connectDB } from '../config/database.js';

// Ejecuta cada 30 minutos
const job = new CronJob('0 * * * *', async () => {
    try {
        const pool = await connectDB();

        console.log('[CRON] Ejecutando SP_UPDATE_ESTADO_CLIENTE...');
        await pool.request().execute('SP_UPDATE_ESTADO_CLIENTE');

        //---------------

        console.log('[CRON] Ejecutando SP_NOTIFICACION_PAGO_ATRASADO...');
        await pool.request().execute('SP_NOTIFICACION_PAGO_ATRASADO');

        //---------------

        console.log('[CRON] Ejecutando SP_BLOQUEO_INACTIVIDAD...');
        await pool.request().execute('SP_BLOQUEO_INACTIVIDAD');

        //---------------

        console.log('[CRON] Ejecutando ACTUALIZAR_ORDENES_ATRASADAS...');
        await pool.request().execute('ACTUALIZAR_ORDENES_ATRASADAS');

        console.log('[CRON] - Ejecuciones exitosas');
    } catch (error) {
        console.error('[CRON] - Error:', error.message);
    }
});

job.start();
