import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();

// Carga el archivo .env correspondiente según el entorno
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const SERVER_NAME = process.env.SERVER_NAME;
const DATABASE = process.env.DATABASE;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const TRUSTED_CONNECTION = process.env.TRUSTED_CONNECTION;

if (!SERVER_NAME || !DATABASE || !USER || !PASSWORD) {
    throw new Error('Faltan variables de entorno necesarias para la conexión a la base de datos.');
}

const dbConfig = {
    server: SERVER_NAME,
    database: DATABASE,
    user: USER,
    password: PASSWORD,
    options: {
        trustedConnection: TRUSTED_CONNECTION,
        trustServerCertificate: true
    }
};

// Función de conexión
async function connectDB() {
    try {
        const pool = await sql.connect(dbConfig);
        console.log('Conectado a la base de datos');
        return pool;
    } catch (error) {
        console.error('Error al conectar a la BD:', error);
        throw error;
    }
}

export { connectDB };