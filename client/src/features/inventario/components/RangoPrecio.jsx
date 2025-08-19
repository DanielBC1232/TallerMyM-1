import React, { useState, useEffect } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';

//URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

export default function RangoPrecio({ value, onChange }) {
  const [precios, setPrecios] = useState([]);
  const [localValue, setLocalValue] = useState([0, 999999]);
  const navigate = useNavigate();

  useEffect(() => {
    // Traer min y max de precios desde la API
    async function obtenerPrecios() {
      try {
        const response = await axios.get(`${BASE_URL}/productos/precios`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT en el header
          }
        });
        setPrecios(response.data);
      } catch (error) {
        if (error.response) {
          // Manejo de respuestas HTTP
          if (error.response.status === 401) {
            Swal.fire({
              icon: "warning",
              title: "Advertencia",
              text: "Operacion no Autorizada",
              showConfirmButton: false,
            });
            navigate(0); // Redirige a la página de login si no está autorizado
          }
          else if (error.response.status === 403) {
            Swal.fire({
              icon: "warning",
              title: "Autenticación",
              text: "Sesión expirada",
              showConfirmButton: false,
            });
            localStorage.clear();
            navigate("/login"); // Redirige a login si la sesión ha expirado
          } else {
            console.error("Error obteniendo precios:", error);
          }
        } else {
          console.error("Error desconocido", error);
        }
      }
    }

    obtenerPrecios();
  }, []);


  // actualiza los valores
  useEffect(() => {
    if (precios.precioMin !== undefined && precios.precioMax !== undefined) {
      // establece el valor del slider con los valores obtenidos
      setLocalValue([precios.precioMin, precios.precioMax]);
    }
  }, [precios]);

  // actualiza el valor cuando el slider cambia
  const handleSliderChange = (newValue) => {
    setLocalValue(newValue);
    if (onChange) {
      onChange({ target: { name: "rangoPrecio", value: newValue } });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between">
        <span className="text-white">Min:
          <p>₡ {localValue[0]}</p>
        </span>
        <div className="mx-5"></div>
        <span className="text-white">Max:
          <p>₡ {localValue[1]}</p>
        </span>

      </div>
      <div className="slider-container">
        <RangeSlider
          name="rangoPrecio"
          min={precios.precioMin || 0} // Usar precioMin
          max={precios.precioMax || 9999999} // Usar precioMax
          value={localValue}
          onInput={handleSliderChange}
        />
      </div>
    </div>
  );
}
