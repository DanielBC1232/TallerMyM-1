import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Text } from "rsuite";

// URL BASE
export const BASE_URL = import.meta.env.VITE_API_URL;

const Devolucion = () => {
  const { idVenta } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null); // Inicializa con null para esperar la respuesta

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/finanzas/obtener-devolucion/${idVenta}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT
          }
        });
        setFormData(data); // Asigna los datos recibidos
        // console.log(data);
      } catch (error) {
        if (error.response) {
          // Manejo de respuestas HTTP de error
          if (error.response.status === 401) {
            Swal.fire({
              icon: "warning",
              title: "Advertencia",
              text: "Operacion no Autorizada",
              showConfirmButton: false,
            });
            // Puedes redirigir al login si la sesión no es válida
            navigate("/login");
          } else if (error.response.status === 403) {
            Swal.fire({
              icon: "warning",
              title: "Autenticación",
              text: "Sesión expirada",
              showConfirmButton: false,
            });
            localStorage.clear();
            navigate("/login"); // Redirigir al login si la sesión ha expirado
          } else {
            console.error("Error al obtener los datos:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un error al obtener los datos",
              showConfirmButton: false,
            });
          }
        } else {
          console.error("Error al obtener los datos:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error desconocido, por favor intente nuevamente",
            showConfirmButton: false,
          });
        }
      }
    };

    obtenerDatos(); // Llamar la función para obtener los datos
  }, [idVenta]);

  // Si no hay datos o el monto es nulo, no renderiza nada
  if (!formData) {
    return <div></div>;
  }
  if (!formData.monto) {
    return <div></div>;
  }

  return (
    <div className="mt-3 d-flex flex-column gap-3">
      <span>
        <Text size="xl" className="text-white">Monto reembolsado:</Text>
        <Text size="xl" muted>{formData.monto}</Text>
      </span>
      <span>
        <Text size="xl" className="text-white">Fecha de devolucion:</Text>
        <Text size="xl" muted>{formData.fecha.split("T")[0]}</Text> {/* Solo muestra la fecha sin hora */}
      </span>
      <span>
        <Text size="xl" className="text-white">Motivo:</Text>
        <Text size="xl" muted>{formData.motivo || "No hay observaciones"}</Text>
      </span>
    </div>
  );
};

export default Devolucion;
