import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Text } from "rsuite";

// URL BASE
export const BASE_URL = import.meta.env.VITE_API_URL;

const Pago = () => {
  const { idVenta } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null); // Inicializa con null

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/finanzas/obtener-pago/${idVenta}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT en los encabezados
          }
        });
        setFormData(data); // Asigna el objeto recibido en lugar de un arreglo
        //console.log(data);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            Swal.fire({
              icon: "warning",
              title: "Advertencia",
              text: "Operación no Autorizada",
              showConfirmButton: false,
            });
            navigate("/login"); // Redirigir al login si el token es inválido o no hay sesión activa
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
          }
        } else {
          console.error("Error de conexión", error);
        }
      }

    };
    obtenerDatos(); // Llamar a la función para obtener los datos
  }, [idVenta]);

  if (!formData) {
    return <div></div>; // No muestra nada si no hay resultados
  }

  // Verifica si formData tiene datos
  if (!formData.monto) {
    return <div></div>; // No muestra nada si no hay resultados
  }


  return (
    <div className="mt-3 d-flex flex-column gap-3">
      <span>
        <Text size="xl" className="text-white">Monto pagado:</Text>
        <Text size="xl" muted>{formData.monto}</Text>
      </span>
      <span>
        <Text size="xl" className="text-white">Dinero vuelto:</Text>
        <Text size="xl" muted>{formData.dineroVuelto}</Text>
      </span>
      <span>
        <Text size="xl" className="text-white">Metodo de pago:</Text>
        <Text size="xl" muted>{formData.metodoPago}</Text>
      </span>
      <span>
        <Text size="xl" className="text-white">Fecha:</Text>
        <Text size="xl" muted>{formData.fecha.split("T")[0]}</Text>
      </span>
    </div>
  );
};

export default Pago;
