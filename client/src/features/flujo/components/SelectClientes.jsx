import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { Link, useNavigate } from 'react-router-dom';


// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const SelectClientes = ({ value, onChange }) => {
    const [opciones, setOpciones] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/clientes/obtener-clientes`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}` // Si es necesario incluir un token
                    }
                });

                const opcionesFormateadas = data.map(cliente => ({
                    value: cliente.idCliente,
                    label: `${cliente.nombre} ${cliente.apellido}`,
                }));

                setOpciones(opcionesFormateadas);
            } catch (error) {
                if (error.response) {
                    // Manejo de errores HTTP
                    if (error.response.status === 401) {
                        Swal.fire({
                            icon: "warning",
                            title: "Advertencia",
                            text: "No tienes autorización para acceder a estos datos.",
                            showConfirmButton: false,
                        });
                        navigate("/login"); // Redirige a login si no está autorizado
                    }
                    else if (error.response.status === 403) {
                        Swal.fire({
                            icon: "warning",
                            title: "Sesión expirada",
                            text: "Tu sesión ha expirado. Por favor inicia sesión nuevamente.",
                            showConfirmButton: false,
                        });
                        localStorage.clear(); // Limpiar almacenamiento local
                        navigate("/login"); // Redirige al login
                    }
                    else {
                        // Error general al obtener los clientes
                        console.error("Error al obtener los clientes:", error);
                        Swal.fire({
                            title: 'Error al obtener los clientes!',
                            icon: 'error',
                            showConfirmButton: false
                        });
                    }
                } else {
                    // Error por problemas de red u otros
                    console.error("Error desconocido:", error);
                    Swal.fire({
                        title: 'Error de conexión',
                        icon: 'error',
                        text: 'No se pudo obtener la lista de clientes. Intenta nuevamente más tarde.',
                        showConfirmButton: false
                    });
                }
            }

        };

        fetchClientes();
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
                    name: "clienteSeleccionado",
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
        borderRadius: '1.75rem !important',
    };
    return (
        <Select
            id="clienteSeleccionado"
            name="clienteSeleccionado"
            options={opciones}
            value={selectedOption}
            onChange={handleChange}
            placeholder="Seleccione..."
            noOptionsMessage={() => "No hay clientes disponibles"}
            maxMenuHeight={140}
            className="custom-select rounded-5 py-2"
            classNamePrefix="select"
            styles={customSelectStyles}
        />
    );
};

export default SelectClientes;