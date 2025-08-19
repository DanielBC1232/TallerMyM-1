import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { InputPicker } from 'rsuite';
import SpinnerIcon from '@rsuite/icons/Spinner';
import { Link, useNavigate } from 'react-router-dom';

// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const SelectTrabajadores = ({ value, onChange }) => {
    const [opciones, setOpciones] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrabajadores = async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/trabajadores/obtener-trabajadores`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}` // Incluir JWT en el encabezado
                    }
                });

                const opcionesFormateadas = data.map(trabajador => ({
                    value: trabajador.idTrabajador,
                    label: `${trabajador.nombreCompleto}`,
                }));

                setOpciones(opcionesFormateadas);
            } catch (error) {
                if (error.response) {
                    // Manejo de errores HTTP
                    if (error.response.status === 401) {
                        Swal.fire({
                            icon: "warning",
                            title: "Advertencia",
                            text: "Operación no autorizada",
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
                    }
                    else {
                        console.error("Error al obtener trabajadores:", error);
                        Swal.fire({
                            title: 'Error al obtener trabajadores!',
                            icon: 'error',
                            showConfirmButton: false
                        });
                    }
                } else {
                    // Manejo de errores en caso de problemas de red u otros
                    console.error("Error desconocido", error);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Hubo un error desconocido, por favor intente nuevamente",
                        showConfirmButton: false,
                    });
                }
            }

        };

        fetchTrabajadores();
    }, []);

    useEffect(() => {
        if (value) {
            const selected = opciones.find(opcion => opcion.value === value) || null;
            setSelectedOption(selected);
        }
    }, [value, opciones]);

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);

        if (typeof onChange === "function") {
            onChange({
                target: {
                    name: "trabajadorSeleccionado",
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
            id="trabajadorSeleccionado"
            options={opciones}
            value={selectedOption}
            onChange={handleChange}
            placeholder="Seleccionar Mecánico"
            noOptionsMessage={() => "No hay Trabajadores disponibles"}
            maxMenuHeight={140}
            styles={customSelectStyles}
        />
    );
};

export default SelectTrabajadores;