import "rsuite/dist/rsuite.min.css";
import './styles/app.css';
import './styles/tables.css';
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// Rutas para Inventario

import Detalles from "./features/inventario/pages/Detalles";
import IndexInventario from "./features/inventario/pages/index";
import Editar from "./features/inventario/pages/Editar";
import Agregar from "./features/inventario/pages/Agregar";
import Solicitudes from "./features/inventario/pages/Solicitudes";
import HistorialSolicitudes from "./features/inventario/pages/HistorialSolicitudes.jsx";

// Rutas para Ventas
import IndexVentas from './features/ventas/pages/index.jsx';
import IndexCotizacion from "./features/ventas/pages/IndexCotizacion.jsx";
import EditarCotizacion from "./features/ventas/pages/EditarCotizarcion.jsx";
import Venta from "./features/ventas/pages/Venta.jsx";

// Rutas para Finanzas
import GastosOperativos from "./features/finanzas/pages/GastosOperativos.jsx";
import Dashboard from "./features/finanzas/pages/Dashboard.jsx";
import Reportes from "./features/finanzas/pages/Reportes.jsx";

// Rutas para Flujo
import IndexFlujo from "./features/flujo/pages/Index.jsx";
import DetallesOrden from "./features/flujo/pages/Detalles.jsx";
import EditarOrden from "./features/flujo/pages/Editar.jsx";

//Trabajadores
//Admin-TRABAJADORES
import IndexTrabajadoresAdmin from "./features/Trabajadores/TrabajadoresAdmin/Index/pages/IndexTrabAdmin.jsx";
//amonestaciones
import IndexAmonestaciones from "./features/Trabajadores/TrabajadoresAdmin/Amonestaciones/pages/IndexAmonest.jsx";
import ListaAmonestaciones from "./features/Trabajadores/TrabajadoresAdmin/Amonestaciones/pages/ListaAmonest.jsx";
import AgregarAmonestacion from "./features/Trabajadores/TrabajadoresAdmin/Amonestaciones/pages/AgregarAmonestacion.jsx";
import EditarAmonestacion from "./features/Trabajadores/TrabajadoresAdmin/Amonestaciones/pages/EditarAmonestacion.jsx";
//Ausencias
import IndexAusencia from "./features/Trabajadores/TrabajadoresAdmin/Ausencias/pages/IndexAusencias.jsx";
import AgregarAusencia from "./features/Trabajadores/TrabajadoresAdmin/Ausencias/pages/AgregarAusencia.jsx";
import EditarAusencia from "./features/Trabajadores/TrabajadoresAdmin/Ausencias/pages/EditarAusencia.jsx";
import ListaAusencias from "./features/Trabajadores/TrabajadoresAdmin/Ausencias/pages/ListaAusencias.jsx";

//Aprobar-rechazar Vacaciones
import IndexVacaciones from "./features/Trabajadores/TrabajadoresAdmin/Vacaciones/pages/IndexVacaciones.jsx";
import EditarVacaciones from "./features/Trabajadores/TrabajadoresAdmin/Vacaciones/pages/Editar-aprobar-rechVacaciones.jsx";

//Empleados-TRABAJADORES----
import IndexTrabajadoresUser from "./features/Trabajadores/TrabajadoresUser/Index/pages/IndexTrabUser.jsx";
import SolicitarVacaciones from "./features/Trabajadores/TrabajadoresUser/Index/pages/SolicitarVacacaciones.jsx";
import UserVacaciones from "./features/Trabajadores/TrabajadoresUser/Vacaciones/UserVacaciones.jsx";
import HistorialAmonestaciones from "./features/Trabajadores/TrabajadoresUser/Amonestaciones/HistorialAmonestaciones.jsx";

// Rutas para Clientes
import IndexClientes from "./features/clientes/pages/IndexClientes.jsx";
import EditarCliente from "./features/clientes/pages/EditarCliente.jsx";

// Rutas para Vehículos
import IndexVehiculos from "./features/vehiculos/pages/IndexVehiculos.jsx";
import EditarVehiculo from "./features/vehiculos/pages/EditarVehiculo.jsx";

// Rutas Módulo Administrativo
import IndexUsuarios from "./features/admininstracion/pages/IndexUsuarios.jsx";
import EditarUsuario from "./features/admininstracion/pages/EditarUsuario.jsx";
import Login from "./components/Login.jsx";
import CambiarContrasena from "./components/CambiarContrasena.jsx";
import VerificarCorreo from "./components/EnviarCorreoRecuperacion.jsx";
import { Error } from "./components/Error.jsx";

const App = () => {
  const location = useLocation();
  const hideHeaderRoutes = ["/login", "/cambiar-contrasena", "/verificar-correo"];// Definir las rutas en las que NO se debe mostrar el Header

  return (
    <div className="">

      {hideHeaderRoutes.includes(location.pathname) ? (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cambiar-contrasena" element={<CambiarContrasena />} />
          <Route path="/verificar-correo" element={<VerificarCorreo />} />
          <Route path="*" element={<Error />} />

        </Routes>
      ) : (
        <Header>
          <Routes>

            <Route
              path="/"
              element={
                localStorage.getItem("token")
                  ? <Navigate to="/flujo" replace />
                  : <Navigate to="/login" replace />
              }
            />
            {/* Rutas de Inventario */}
            <Route path="/inventario-agregar" element={<Agregar />} />
            <Route path="/inventario" element={<IndexInventario />} />
            <Route path="/inventario-detalles/:idProducto" element={<Detalles />} />
            <Route path="/inventario-editar/:idProducto" element={<Editar />} />
            <Route path="/solicitudes" element={<Solicitudes />} />
            <Route path="/historial-solicitudes" element={<HistorialSolicitudes />} />
            {/* Rutas de Flujo */}
            <Route path="/flujo" element={<IndexFlujo />} />
            <Route path="/flujo-detalles/:idOrden" element={<DetallesOrden />} />
            <Route path="/flujo-editar/:idOrden" element={<EditarOrden />} />
            {/* Rutas de Ventas */}
            <Route path="/ventas" element={<IndexVentas />} />
            <Route path="/cotizacion" element={<IndexCotizacion />} />
            <Route path="/cotizacion-editar/:idCotizacion" element={<EditarCotizacion />} />
            <Route path="/detalles/:idVenta" element={<Venta />} />
            {/* Rutas de Finanzas (protegidas) */}
            <Route path="/gastos-operativos" element={<PrivateRoute element={<GastosOperativos />} />} />
            <Route path="/Dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/Reportes" element={<PrivateRoute element={<Reportes />} />} />

            {/*TRABAJADORES*/}
            {/*--------ADMIN-TRABAJADORES-----------*/}
            {/*Trabajadores*/}
            <Route path="/trabajadores-admin" element={<IndexTrabajadoresAdmin />} />
            {/*Amonestaciones*/}
            <Route path="/index-amonestaciones" element={<IndexAmonestaciones />} />
            <Route path="/amonestaciones-lista" element={<ListaAmonestaciones />} />
            <Route path="/amonestaciones-agregar/:idTrabajador" element={<AgregarAmonestacion />} />
            <Route path="/amonestaciones-editar/:idAmonestacion" element={<EditarAmonestacion />} />
            {/*Ausencias*/}
            <Route path="/Ausencias-Index" element={<IndexAusencia />} />
            <Route path="/Lista-Ausencias" element={<ListaAusencias />} />
            <Route path="/Ausencias-Agregar/:idTrabajador" element={<AgregarAusencia />} />
            <Route path="/Ausencias-Editar/:idAusencia" element={<EditarAusencia />} />
            {/*Vacaciones*/}
            <Route path="/Vacaciones-Index" element={<IndexVacaciones />} />
            <Route path="/EditarVacaciones/:idVacaciones" element={<EditarVacaciones />} />

            {/*-------- USER TRABAJADORES--------*/}
            <Route path="/historial-amonestaciones" element={<HistorialAmonestaciones />} />
            <Route path="/vacaciones" element={<UserVacaciones />}></Route>
            <Route path="/trabajadores-user" element={<IndexTrabajadoresUser />} />
            {/*Solicitud-Vacaciones */}
            <Route path="/AddSolicitudVacacion" element={<SolicitarVacaciones />} />
            {/* Rutas de Clientes */}
            <Route path="/clientes" element={<IndexClientes />} />
            <Route path="/cliente-editar/:cedula" element={<EditarCliente />} />
            {/* Rutas de Vehiculos */}
            <Route path="/vehiculos" element={<IndexVehiculos />} />
            <Route path="/vehiculo-editar/:idVehiculo" element={<EditarVehiculo />} />
            {/* Rutas de Administracion (protegidas) */}
            <Route path="/administracion" element={<PrivateRoute element={<IndexUsuarios />} />} />
            <Route path="/usuario-editar/:idUsuario" element={<PrivateRoute element={<EditarUsuario />} />} />

            <Route path="*" element={<Error />} />


          </Routes>
        </Header>
      )}

    </div>
  );
};

export default App;
