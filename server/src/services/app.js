import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import './tasksCron.js';
import path from 'path';
import { fileURLToPath } from 'url';

import imgRoutes from '../routes/inventario/imgRoutes.js';
import categoriaRoutes from '../routes/inventario/categoriaRoutes.js';
import marcaRoutes from '../routes/inventario/marcaRoutes.js';
import proveedorRoute from '../routes/inventario/proveedorRoute.js';
import vehiculosCompatiblesRoutes from '../routes/inventario/vehiculosCompatiblesRoutes.js';
import productoRoutes from '../routes/inventario/productoRoutes.js';
import solicitudRoutes from '../routes/inventario/solicitudRoutes.js';
import ordenRoutes from '../routes/flujo/ordenRoutes.js';
import cotizacionRoutes from '../routes/ventas/cotizacionRoutes.js';
import trabajadoresRoutes from '../routes/trabajadores/trabajadoresRoutes.js';
import ventasRoutes from '../routes/ventas/ventasRoutes.js';
import notificacionesRoutes from '../routes/notificaciones/notificacionesRoutes.js';
import ClienteRoutes from '../routes/clientes/clienteRoutes.js';
import VehiculoRoute from '../routes/vehiculos/vehiculosRoutes.js';
import pagoClienteRoutes from '../routes/finanzas/pagoClienteRoutes.js';
import devolucionRoutes from '../routes/finanzas/devolucionRoutes.js';
import AdministrativoRoute from '../routes/administrativo/AdminRoutes.js';
import gastoOperativoRoutes from '../routes/finanzas/gastoOperativoRoutes.js';
import reportesRoutes from '../routes/reportes/reportesRoutes.js';
import dashboardRoutes from '../routes/finanzas/dashboardRoutes.js';
import { connectDB } from '../config/database.js';

dotenv.config({
    path: `.env.${process.env.NODE_ENV}` // Carga el archivo .env según el entorno
});

const app = express();

// Obtener __dirname en un entorno de módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Ruta absoluta a la carpeta 'client/dist'
const clientDistPath = path.resolve(__dirname, '../../../client/dist');

// Servir archivos estáticos desde 'client/dist'
app.use(express.static(clientDistPath));

// Configurar CORS antes de las rutas
/*
const allowedOrigins = [process.env.REACT_URL, 'http://localhost:5173'];
app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origen (p.ej. tools de prueba)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));
*/

// Cualquier origen -> no seguro
app.use(cors({
  origin: true, // Esto permite cualquier origen
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));




// Analizar peticiones JSON
app.use(express.json());

// Conectar a la base de datos
connectDB()
  .then(() => console.log('Conectado a la base de datos'))
  .catch(err => console.error('Error en la conexión:', err));

//* Rutas Inventario
app.use("/categorias", categoriaRoutes);
app.use("/marcas", marcaRoutes);
app.use("/proveedor", proveedorRoute);
app.use("/vehiculos-compatibles", vehiculosCompatiblesRoutes);
app.use("/productos", productoRoutes);
app.use("/img", imgRoutes);
app.use("/inventario", solicitudRoutes);

//Rutas notificaciones
app.use("/notificaciones", notificacionesRoutes);

//Rutas Ventas
app.use("/cotizacion", cotizacionRoutes);
app.use("/ventas", ventasRoutes);

//Finanzas
app.use("/finanzas", pagoClienteRoutes);
app.use("/finanzas", devolucionRoutes);
app.use("/finanzas", gastoOperativoRoutes);
app.use("/finanzas", dashboardRoutes);
//trabajadores
app.use("/trabajadores", trabajadoresRoutes);

//Ruta modulo de clientes
app.use("/clientes", ClienteRoutes);
//Ruta modulo Vehiculos
app.use("/vehiculos", VehiculoRoute);
//Ruta modulo Administrativo
app.use("/admin", AdministrativoRoute);
//Ruta flujo-ordenes
app.use("/flujo", ordenRoutes);
//reportes
app.use("/reportes", reportesRoutes);


// Servir archivos estáticos del frontend
app.use(express.static(clientDistPath));
// Enrutamiento SPA: todas las rutas no api sirven index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
