import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Select from "react-select";
import axios from "axios";

//URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const SelectVehiculos = ({ value, onChange }) => {
  const [opciones, setOpciones] = useState([]);
  const navigate = useNavigate();

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: '#fff',
      borderColor: state.isFocused ? '#86b7fe' : '#ced4da',
      borderRadius: '1.75rem', // similar a rounded-5
      minHeight: '38px',
      boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(13,110,253,.25)' : 'none',
      '&:hover': {
        borderColor: '#86b7fe',
      },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '1rem',
      zIndex: 9999,
    }),
    option: (base, { isFocused, isSelected, isDisabled }) => ({
      ...base,
      backgroundColor: isDisabled
        ? '#e9ecef'
        : isSelected
        ? '#0d6efd'
        : isFocused
        ? '#e2e6ea'
        : '#fff',
      color: isSelected ? '#fff' : '#212529',
      cursor: isDisabled ? 'not-allowed' : 'default',
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#e9ecef',
      borderRadius: '1rem',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#495057',
      fontWeight: 500,
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#6c757d',
      ':hover': {
        backgroundColor: '#ced4da',
        color: '#000',
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: '#6c757d',
    }),
  };


  useEffect(() => {
    const obtenerVehiculos = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/vehiculos-compatibles`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT en el header
          }
        });
        const opcionesFormateadas = data.map((vehiculo) => ({
          value: vehiculo.modelo,
          label: vehiculo.modelo,
        }));
        setOpciones(opcionesFormateadas);
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
            console.error("Error obteniendo los vehículos:", error);
          }
        } else {
          console.error("Error desconocido", error);
        }
      }
    };

    obtenerVehiculos();
  }, []);


  const handleChange = (selectedOptions) => {
    // Si no se selecciona nada, pasamos un arreglo vacío
    onChange({
      target: {
        name: "vehiculosCompatibles", // El nombre del campo que se actualiza
        value: selectedOptions ? selectedOptions.map(option => option.value) : [], // Solo guardamos el modelo
      },
    });
  };

  return (
    <div>
      <Select
        id="vehiculosCompatibles"
        className="custom-select"
        classNamePrefix="select"
        isMulti
        options={opciones}
        value={opciones.filter((opcion) => value.includes(opcion.value))} // Filtramos las opciones seleccionadas
        onChange={handleChange}
        placeholder="Seleccione..."
        noOptionsMessage={() => "No hay vehículos disponibles"}
        maxMenuHeight={185}
        styles={customSelectStyles}
      />
    </div>
  );
};

export default SelectVehiculos;
