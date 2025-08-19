import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Select from "react-select";

//URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

//constante de opciones
const SelectProveedor = ({ value, onChange }) => {
  const navigate = useNavigate();
  const [opciones, setOpciones] = useState([]);

  useEffect(() => {
    const obtenerProveedores = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/proveedor`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        // Formatear opciones para react-select
        const opcionesFormateadas = data.map((proveedor) => ({
          value: proveedor.nombreProveedor,
          label: proveedor.nombreProveedor,
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
            Swal.fire({
              icon: "warning",
              title: "Autenticación",
              text: "Sesión expirada",
              showConfirmButton: false,
            });
            localStorage.clear();
            navigate("/login");
          } else {
            console.error("Error obteniendo los proveedores:", error);
          }
        } else {
          console.error("Error desconocido", error);
        }
      }
    };

    obtenerProveedores();
  }, [navigate]);

  const handleChange = (selectedOption) => {
    onChange({
      target: {
        name: "proveedor", // Nombre del campo que se actualiza
        value: selectedOption ? selectedOption.value : '', // Extraer el valor
      },
    });
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
    <div className="" >
      <Select
        id="proveedor"
        name="proveedor"
        className="custom-select rounded-5 py-2"
        classNamePrefix="select"
        options={opciones}
        value={opciones.find(op => op.value === value)} // Mapear valor externo
        onChange={handleChange}
        placeholder="Seleccione..."
        noOptionsMessage={() => "No hay proveedores disponibles"}
        styles={{
          ...customSelectStyles,
          menuPortal: base => ({
            ...base,
            zIndex: 9999
          })
        }}
      />
    </div >
  );
};

export default SelectProveedor;
