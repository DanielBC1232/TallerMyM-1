import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';

// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const SelectClientes = ({ value, onChange }) => {
  const [opciones, setOpciones] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/clientes/obtener-clientes`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`, // Añadir el JWT en el header
            },
          }
        );

        const opcionesFormateadas = data.map((cliente) => ({
          value: cliente.idCliente,
          label: `${cliente.nombre} ${cliente.apellido}`, // Nombre + apellido
        }));
        setOpciones(opcionesFormateadas);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            Swal.fire({
              icon: "warning",
              title: "Advertencia",
              text: "Operación no Autorizada",
              showConfirmButton: false,
            });
            window.location.reload(); // Recarga la página si no está autorizado
          } else if (error.response.status === 403) {
            Swal.fire({
              icon: "warning",
              title: "Autenticación",
              text: "Sesión expirada",
              showConfirmButton: false,
            });
            localStorage.clear();
            window.location.href = "/login"; // Redirige al login si la sesión ha expirado
          } else {
            console.error("Error obteniendo los clientes:", error);
          }
        } else {
          console.error("Error de conexión:", error);
        }
      }

    };

    obtenerClientes();
  }, []);

  const handleChange = useCallback(
    (selectedOption) => {
      onChange({
        target: {
          name: "idCliente",
          value: selectedOption ? selectedOption.value : null,
        },
      });
    },
    [onChange]
  );
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
    borderRadius: '1.75rem !important',
};
  return (
    <div>
      <Select
        id="idCliente"
        name="idCliente"
        options={opciones}
        value={opciones.find((opcion) => opcion.value === value) || null} // Buscar el objeto correctamente
        onChange={handleChange}
        placeholder="Seleccione un cliente..."
        noOptionsMessage={() => "No hay clientes disponibles"}
        maxMenuHeight={185}
        className="custom-select rounded-5 py-2"
        classNamePrefix="select"
        styles={customSelectStyles}
      />
    </div>
  );
};

export default SelectClientes;
