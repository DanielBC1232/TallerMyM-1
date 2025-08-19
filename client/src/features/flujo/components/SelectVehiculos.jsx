import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from 'react-router-dom';

//URL BASE
export const BASE_URL = import.meta.env.VITE_API_URL;

const SelectVehiculos = ({ idCliente = null, value, onChange }) => {
  const [opciones, setOpciones] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/vehiculos/cliente-vehiculos/${idCliente}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}` // Incluir JWT en el encabezado
          }
        });

        const opcionesFormateadas = data.map(vehiculo => ({
          value: vehiculo.idVehiculo,
          label: `${vehiculo.marcaVehiculo} ${vehiculo.modeloVehiculo} ${vehiculo.annoVehiculo}`,
        }));

        setOpciones(opcionesFormateadas);
      } catch (error) {
        if (error.response) {
          // Manejo de errores HTTP
          if (error.response.status === 401) {
            navigate(0); // Redirige a la página de login si no está autorizado
          }
          else if (error.response.status === 403) {
            localStorage.clear();
            navigate("/login"); // Redirige a login si la sesión ha expirado
          }
        } else {
          // Manejo de errores en caso de problemas de red u otros
          console.error("Error desconocido", error);
        }
      }
    };

    fetchVehiculos();
  }, [idCliente]);

  useEffect(() => {
    if (value) {
      const selected = opciones.find(opcion => opcion.value === value) || null;
      setSelectedOption(selected);
    } else {
      setSelectedOption(null);
    }
  }, [value, opciones]);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    if (typeof onChange === "function") {
      onChange({
        target: {
          name: "vehiculoSeleccionado",
          value: selectedOption ? selectedOption.value : "",
        },
      });
    }
  };

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

  return (
    <Select
      id="vehiculoSeleccionado"
      options={opciones}
      value={selectedOption}
      onChange={handleChange}
      placeholder="Seleccionar Vehículo"
      noOptionsMessage={() => "No hay vehículos disponibles"}
      maxMenuHeight={140}
      styles={customSelectStyles}
    />
  );
};

export default SelectVehiculos;
