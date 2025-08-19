import React, { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Text } from "rsuite";
import '../styles/tables.css';
// Iconos
import { IoPersonCircle } from "react-icons/io5";
import { FaCar } from "react-icons/fa";
import { MdCarRepair } from "react-icons/md";
import { MdPerson } from "react-icons/md";
import { RiShoppingBagFill } from "react-icons/ri";
import { TbShoppingBagSearch } from "react-icons/tb";
import { MdInventory } from "react-icons/md";
import { LuMailSearch } from "react-icons/lu";
import { AiFillDashboard } from "react-icons/ai";
import { MdAdminPanelSettings } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { BsPersonGear } from "react-icons/bs";
import { MdOutlineAttachMoney } from "react-icons/md";
import { IoIosCheckbox } from "react-icons/io";
import { FaPlane } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";

//Iconos
const Header = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const idRol = localStorage.getItem('idRol');
  return (
    <div className={`wrapper ${sidebarCollapsed ? "collapsed" : ""}`}>
      <nav id="sidebar" className="sidebar border border-3 border-light border-top-0 border-bottom-0 border-start-0">
        <div className="">
          <Link className="sidebar-brand" to="/flujo">Taller MyM</Link>
          {/* icono *** */}
          <hr className="text-success mx-3 m-0"></hr>
          <ul className="sidebar-nav">
            {/* Flujo */}
            <li className="sidebar-header">Flujo de Trabajo</li>
            <li className="sidebar-item">
              <NavLink className="sidebar-link" to="/flujo">
                {({ isActive }) => (
                  <span className={isActive ? 'text-success' : ''}>
                    <MdCarRepair className={isActive ? 'text-success' : ''} size={25} /> Órdenes
                  </span>
                )}
              </NavLink>
            </li>

            {/* Clientes */}
            <li className="sidebar-header">Clientes</li>
            <li className="sidebar-item">
              <NavLink className="sidebar-link" to="/clientes">
                {({ isActive }) => (
                  <span className={isActive ? 'text-success' : ''}>
                    <MdPerson className={isActive ? 'text-success' : ''} size={20} /> Lista de clientes
                  </span>
                )}
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink className="sidebar-link" to="/vehiculos">
                {({ isActive }) => (
                  <span className={isActive ? 'text-success' : ''}>
                    <FaCar className={isActive ? 'text-success' : ''} size={20} />Vehículos
                  </span>
                )}
              </NavLink>
            </li>

            {/* Ventas */}
            <li className="sidebar-header">Ventas</li>
            <li className="sidebar-item">
              <NavLink className="sidebar-link" to="/ventas">
                {({ isActive }) => (
                  <span className={isActive ? 'text-success' : ''}>
                    <RiShoppingBagFill className={isActive ? 'text-success' : ''} size={20} />Lista de ventas
                  </span>
                )}
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink className="sidebar-link" to="/cotizacion">
                {({ isActive }) => (
                  <span className={isActive ? 'text-success' : ''}>
                    <TbShoppingBagSearch className={isActive ? 'text-success' : ''} size={20} />Cotizar
                  </span>
                )}
              </NavLink>
            </li>

            {/* Inventario */}
            <li className="sidebar-header">Inventario</li>
            <li className="sidebar-item">
              <NavLink className="sidebar-link" to="/inventario">
                {({ isActive }) => (
                  <span className={isActive ? 'text-success' : ''}>
                    <MdInventory className={isActive ? 'text-success' : ''} size={20} />Catálogo de Inventario
                  </span>
                )}
              </NavLink>
            </li>

            {idRol != 1 && (
              <>
                <li className="sidebar-item">
                  <NavLink className="sidebar-link" to="/solicitudes">
                    {({ isActive }) => (
                      <span className={isActive ? 'text-success' : ''}>
                        <LuMailSearch className={isActive ? 'text-success' : ''} size={20} />Solicitudes de repuestos
                      </span>
                    )}
                  </NavLink>
                </li>
              </>
            )}

            {idRol != 1 && (
              <>
                <li className="sidebar-header">Mi Perfil</li>
                <li className="sidebar-item">
                  <NavLink className="sidebar-link" to="/trabajadores-user">
                    {({ isActive }) => (
                      <span className={isActive ? 'text-success' : ''}>
                        <BsPersonGear className={isActive ? 'text-success' : ''} size={20} /> {localStorage.getItem("username")}
                      </span>
                    )}
                  </NavLink>
                </li>
                <li className="sidebar-item">
                  <NavLink className="sidebar-link" to='/vacaciones'>
                    {({ isActive }) => (
                      <span className={isActive ? 'text-success' : ''}>
                        <FaPlane className={isActive ? 'text-success' : ''} size={20} />Vacaciones
                      </span>
                    )}
                  </NavLink>
                </li>
                <li className="sidebar-item">
                  <NavLink className="sidebar-link" to='/historial-amonestaciones'>
                    {({ isActive }) => (
                      <span className={isActive ? 'text-success' : ''}>
                        <IoDocumentText className={isActive ? 'text-success' : ''} size={20} />Amonestaciones
                      </span>
                    )}
                  </NavLink>
                </li>
              </>
            )}
            {/* Administracion */}
            <div>
              {idRol != 2 && (
                <>
                  <li className="sidebar-header">Administración</li>
                  <li className="sidebar-item">
                    <NavLink className="sidebar-link" to="/Dashboard">
                      {({ isActive }) => (
                        <span className={isActive ? 'text-success' : ''}>
                          <AiFillDashboard className={isActive ? 'text-success' : ''} size={20} />Dashboard
                        </span>
                      )}
                    </NavLink>
                  </li>
                  <li className="sidebar-item">
                    <NavLink className="sidebar-link" to="/administracion">
                      {({ isActive }) => (
                        <span className={isActive ? 'text-success' : ''}>
                          <MdAdminPanelSettings className={isActive ? 'text-success' : ''} size={20} />Administración
                        </span>
                      )}
                    </NavLink>
                  </li>
                  <li className="sidebar-item">
                    <NavLink className="sidebar-link" to="/gastos-operativos">
                      {({ isActive }) => (
                        <span className={isActive ? 'text-success' : ''}>
                          <MdOutlineAttachMoney className={isActive ? 'text-success' : ''} size={20} />Gastos Operativos
                        </span>
                      )}
                    </NavLink>
                  </li>
                  <li className="sidebar-item">
                    <NavLink className="sidebar-link" to="/solicitudes">
                      {({ isActive }) => (
                        <span className={isActive ? 'text-success' : ''}>
                          <IoIosCheckbox className={isActive ? 'text-success' : ''} size={20} />Solicitudes de Repuestos
                        </span>
                      )}
                    </NavLink>
                  </li>
                  <li className="sidebar-item">
                    <NavLink className="sidebar-link" to="/Reportes">
                      {({ isActive }) => (
                        <span className={isActive ? 'text-success' : ''}>
                          <TbReportAnalytics className={isActive ? 'text-success' : ''} size={20} />Reportes
                        </span>
                      )}
                    </NavLink>
                  </li>
                  {/* Trabajadores - Administracion */}
                  <li className="sidebar-item">
                    <NavLink className="sidebar-link" to="/trabajadores-admin">
                      {({ isActive }) => (
                        <span className={isActive ? 'text-success' : ''}>
                          <BsPersonGear className={isActive ? 'text-success' : ''} size={20} /> Empleados
                        </span>
                      )}
                    </NavLink>
                  </li>
                </>
              )}
            </div>

          </ul>
        </div>
      </nav>

      <div className="main">
        <nav className="navbar navbar-expand bg-darkest-secondary border border-3 border-light border-top-0 border-end-0 border-start-0">
          <div className="navbar-collapse collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle text-white d-flex align-items-center justify-content-center gap-1" role="button" id="userDropdown" data-bs-toggle="dropdown">
                  <IoPersonCircle size="20" className="me-2 text-success" />{localStorage.getItem("username")}
                </a>
                <div className="dropdown-menu dropdown-menu-end border-0 shadow-sm" aria-labelledby="userDropdown">
                  <button id="logout-option" className="dropdown-item custom-logout" onClick={handleLogout}>
                    <Text size='md'>Cerrar Sesión</Text>
                  </button>
                </div>
              </li>
            </ul>
          </div>

        </nav>
        <div className="content-wrapper p-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Header;
