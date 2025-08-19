import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import Select from "react-select";

//URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

//constante de opciones
const SelectMarca = ({ value, onChange }) => {
  const navigate = useNavigate();

  const [opciones, setOpciones] = useState([]);

  useEffect(() => {
    const obtenerMarcas = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/marcas/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        // Formatear opciones para react-select
        const opcionesFormateadas = data.map((marca) => ({
          value: marca.nombreMarca,
          label: marca.nombreMarca,
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
            navigate(0);
          } else if (error.response.status === 403) {
            localStorage.clear();
            navigate("/login");
          } else {
            console.error("Error obteniendo las marcas:", error);
          }
        } else {
          console.error("Error desconocido", error);
        }
      }
    };

    obtenerMarcas();
  }, [navigate]);

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

  const handleChange = (selectedOption) => {
    onChange({
      target: {
        name: "marca", // Nombre del campo que se actualiza
        value: selectedOption ? selectedOption.value : '', // Extraer el valor
      },
    });
  };

  return (
    <div>
      <Select
        id="marca"
        name="marca"
        className="custom-select rounded-5 py-2"
        classNamePrefix="select"
        options={opciones}
        value={opciones.find(op => op.value === value)} // Mapear valor externo
        onChange={handleChange}
        placeholder="Seleccione..."
        noOptionsMessage={() => "No hay marcas disponibles"}
        styles={customSelectStyles}
      />
    </div>
  );
};

export default SelectMarca;
