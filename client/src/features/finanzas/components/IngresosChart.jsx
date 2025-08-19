import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { Link, useNavigate } from 'react-router-dom';

export const BASE_URL = import.meta.env.VITE_API_URL;

const IngresosChart = () => {
    const [ingresos, setIngresos] = useState([]);
    const [gastos, setGastos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getDatos = async () => {
            try {
                const ingresosRes = await axios.get(`${BASE_URL}/finanzas/obtener-ganancias-mes/`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}` // Se agrega el token JWT
                    }
                });

                const gastosRes = await axios.get(`${BASE_URL}/finanzas/obtener-gastos-mes/`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}` // Se agrega el token JWT
                    }
                });

                setIngresos(ingresosRes.data);
                setGastos(gastosRes.data);

            } catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        Swal.fire({
                            icon: "warning",
                            title: "Advertencia",
                            text: "Operacion no Autorizada",
                            showConfirmButton: false,
                        });
                        navigate(0); // Redirigir si no autorizado
                    } else if (error.response.status === 403) {
                        Swal.fire({
                            icon: "warning",
                            title: "Autenticación",
                            text: "Sesión expirada",
                            showConfirmButton: false,
                        });
                        localStorage.clear();
                        navigate("/login"); // Redirigir si la sesión ha expirado
                    } else {
                        console.error("Error al obtener datos:", error);
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Hubo un error al obtener los datos.",
                            showConfirmButton: false,
                        });
                    }
                } else {
                    console.error("Error al obtener datos:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Error desconocido",
                        text: "Hubo un error de red o de conexión.",
                        showConfirmButton: false,

                    });
                }
            }

        };
        getDatos();
    }, []);

    // Función para agrupar datos por fecha (mismo nodo)
    const agruparPorFecha = (data, key) => {
        return data.reduce((acc, item) => {
            const fecha = new Date(item.fecha).getTime();
            if (!acc[fecha]) {
                acc[fecha] = { x: fecha, y: item[key] };
            } else {
                acc[fecha].y += item[key];
            }
            return acc;
        }, {});
    };

    const seriesIngresos = Object.values(agruparPorFecha(ingresos, "total"));
    const seriesGastos = Object.values(agruparPorFecha(gastos, "monto"));

    const options = {
        chart: {
            type: 'line',
            height: 350,
            zoom: {
                type: 'x',
                enabled: true,
                autoScaleYaxis: true
            },
            toolbar: {
                autoSelected: 'zoom'
            }
        },
        stroke: {
            curve: 'smooth'
        },
        markers: {
            size: 5
        },
        title: {
            text: 'Comparativo de Ingresos y Gastos',
            align: 'left'
        },
        xaxis: {
            type: 'datetime',
        },
        yaxis: {
            labels: {
                formatter: function (val) {
                    return val.toFixed(0);
                }
            },
            title: {
                text: 'Monto'
            }
        },
        tooltip: {
            x: {
                format: 'dd MMM yyyy'
            }
        }
    };

    return (
        <div className='bg-white rounded-4 p-3 shadow-sm'>
            <ReactApexChart
                options={options}
                series={[
                    { name: 'Ingresos', data: seriesIngresos },
                    { name: 'Gastos', data: seriesGastos }
                ]}
                type="line"
                height={350}
            />
        </div>
    );
};

export default IngresosChart;
