import { useState, useEffect } from "react";
import axios from "axios";
import Orden from "./Orden";

// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const ColPendiente = () => {
  const [datos, setDatos] = useState([]);
  useEffect(() => {
    const getOrdenes = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/flujo/obtener-ordenes/${1}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT aquí
            }
          }
        );
        setDatos(data);
      } catch (error) {
        console.error("Error al obtener Ordenes:", error);
        let message = "Error al obtener las órdenes";
        if (error.response) {
          const { status } = error.response;
          if (status === 401) {
            message = "Operación no autorizada, por favor inicie sesión";
          } else if (status === 403) {
            message = "Sesión expirada, por favor inicie sesión nuevamente";
          } else if (status === 404) {
            message = "No se encontró el recurso solicitado";
          } else if (status === 500) {
            message = "Error interno del servidor, por favor intente más tarde";
          }
        } else {
          message = "Error desconocido, por favor intente más tarde";
        }

        Swal.fire({
          icon: "error",
          title: message,
          showConfirmButton: false,
          timer: 1500,
        });
      }

    };
    getOrdenes();
  }, []);

  return (
    <div>
      {datos.length === 0 ? (
        <div className="alert alert-success text-center" role="alert">
          <h5 className="alert-heading">Sin Ordenes</h5>
          <p>No se encontraron órdenes Pendientes.</p>
        </div>
      ) : (
        <Orden datos={datos} />
      )}
    </div>
  );
};
export default ColPendiente;
