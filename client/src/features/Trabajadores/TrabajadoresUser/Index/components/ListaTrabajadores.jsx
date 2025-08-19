import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const ListaTrabajadores = ({ formData, trigger }) => {

  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTrabajadores = async () => {
      try {
        setLoading(true);
        setError(null);

        const cedula = localStorage.getItem("cedula");
        const { data } = await axios.post(
          `${BASE_URL}/trabajadores/trabajador/cedula`, // sin slash final
          { cedula },
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
        setError("Error al cargar los trabajadores");

        if (error.response) {
          const { status } = error.response;

          if (status === 401) {
            Swal.fire("Sesión expirada", "Por favor inicie sesión nuevamente", "warning");
            localStorage.removeItem("token");
            window.location.href = "/login";
            return;
          }

          if (status === 403) {
            Swal.fire("Acceso denegado", "No tiene permisos para ver los trabajadores", "error");
            return;
          }
        }

        Swal.fire("Error", "No se pudieron cargar los trabajadores", "error");

      } finally {
        setLoading(false);
      }
    };

    getTrabajadores();
  }, [formData, trigger]);

  return (
    <div className="">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Cédula</th>
            <th>Salario</th>
            <th>Seguro Social</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{datos.nombreCompleto}</td>
            <td>{datos.cedula}</td>
            <td>{"₡ " + datos.salario}</td>
            <td>{datos.seguroSocial}</td>
            <td>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ListaTrabajadores;
