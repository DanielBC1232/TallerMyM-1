import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { FaList } from "react-icons/fa6";
import { IoIosReturnLeft } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";

// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const ListaTrabajadores = ({ formData, trigger }) => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const getTrabajadores = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/trabajadores/obtener-trabajadores/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDatos(data);
      } catch (error) {
        console.error("Error al obtener trabajadores:", error);

        if (error.response) {
          const { status } = error.response;

          if (status === 401) {
            Swal.fire("Advertencia", "Operación no autorizada", "warning");
            window.location.reload();
          } else if (status === 403) {
            Swal.fire("Autenticación", "Sesión expirada", "warning");
            localStorage.clear();
            window.location.href = "/login";
          } else {
            Swal.fire("Error", "Error al cargar los trabajadores", "error");
          }
        } else {
          Swal.fire("Error", "Problema de conexión con el servidor", "error");
        }
      }
    };

    getTrabajadores();
  }, [formData, trigger]);

  return (
    <div className="p-4 bg-darkest rounded-4 shadow-sm">
      <h4 className="text-center text-success">Listado Trabajadores</h4>
      <hr className="text-success" />
      <div className="px-4 d-flex justify-content-between my-2">
        <Link to={`/trabajadores-admin`} className="btn btn-secondary text-white rounded-5 d-flex align-items-center justify-content-center gap-1" style={{ width: "120px" }}>
          <IoIosReturnLeft size={25} />Regresar
        </Link>
        <Link to="/Lista-Ausencias" className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1" style={{ width: "140px" }}>
          <FaList size={17} /> Ausencias</Link>
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Cédula</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((trabajador, index) => (
            <tr key={index}>
              <td>{trabajador.nombreCompleto}</td>
              <td>{trabajador.cedula}</td>
              <td>
                <Link
                  to={`/Ausencias-Agregar/${trabajador.idTrabajador}`} // implementar backend
                  className="btn btn-outline-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1" style={{ width: "200px" }}>
                  <IoMdAdd size={25} />Registrar Ausencia
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>



    </div>
  );
};

export default ListaTrabajadores;
