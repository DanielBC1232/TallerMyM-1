//import React from "react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { IoIosReturnLeft } from "react-icons/io";
import { IoDocumentText } from "react-icons/io5";

// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const ListaTrabajadores = ({ formData, trigger }) => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const getTrabajadores = async () => {
      try {
        const { data, status } = await axios.get(
          `${BASE_URL}/trabajadores/obtener-trabajadores/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (status === 200) {
          setDatos(data);
        } else {
          Swal.fire({
            icon: "error",
            title: "No se pudo obtener la lista de trabajadores",
            showConfirmButton: false,
          });
        }
      } catch (error) {
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
            console.error("Error al obtener trabajadores:", error);
            Swal.fire("Error", "Hubo un error al obtener los trabajadores", "error");
          }
        } else {
          console.error("Error de red:", error);
          Swal.fire("Error", "Problema de conexión con el servidor", "error");
        }
      }
    };

    getTrabajadores();
  }, [formData, trigger]);

  return (
    <div className="p-4 rounded-4 bg-darkest" style={{ minHeight: "88vh" }}>

      <div className="mb-3 d-flex gap-3 justify-content-between px-4">
        <Link to={`/trabajadores-admin`} style={{ width: "120px" }}
          className="btn btn-secondary rounded-5 d-flex align-items-center justify-content-center gap-1">
          <IoIosReturnLeft size={25} />Volver
        </Link>
        <Link style={{ width: "120px" }} to="/amonestaciones-lista" className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1">
        <IoDocumentText size={20}/>Historial
        </Link>
      </div>
      <table className="table table-hover table-striped shadow-sm">
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Cédula</th>
            <th className="d-flex justify-content-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((trabajador, index) => (
            <tr key={index}>
              <td>{trabajador.nombreCompleto}</td>
              <td>{trabajador.cedula}</td>
              <td>
                <div className="d-flex justify-content-center">
                  <Link
                    to={`/amonestaciones-agregar/${trabajador.idTrabajador}`} // implementar backend
                    className="btn text-white btn-outline-success rounded-5 d-flex align-items-center justify-content-center gap-1" style={{ width: "200px" }}>
                    <FaPlus size={15} />Generar Amonestacion
                  </Link></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaTrabajadores;
