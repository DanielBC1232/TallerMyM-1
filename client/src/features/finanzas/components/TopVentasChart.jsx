import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';

export const BASE_URL = import.meta.env.VITE_API_URL;

const TopVentasChart = () => {
    const [ventas, setVentas] = useState([]);

    useEffect(() => {
        const getDatos = async () => {
            try {
                const ventasRes = await axios.get(`${BASE_URL}/finanzas/obtener-top-ventas/`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}` // Se agrega el token JWT
                    }
                });
                setVentas(ventasRes.data);
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
                    Swal.fire("Error", "Hubo un problema de red o conexión.", "error");
                }
            }

        };
        getDatos();
    }, []);

    const categories = ventas.map(item => item.nombreProducto);
    const seriesData = ventas.map(item => item.cantidad);

    const options = {
        chart: {
            type: 'bar',
            height: 380
        },
        title: {
            text: 'Top 10 Productos/Servicios Más Vendidos',
            align: 'center'
        },
        xaxis: {
            categories: categories,
            labels: {
                rotate: -45,
                style: {
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            title: {
                text: 'Ventas'
            },
            labels: {
                formatter: function (val) {
                    return val.toFixed(0);
                }
            }
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val.toFixed(2);
                }
            }
        }
    };

    const series = [
        {
            name: 'Ventas',
            data: seriesData
        }
    ];

    return (
        <div className='bg-white rounded-4 p-3 shadow-sm'>
            <ReactApexChart
                options={options}
                series={series}
                type="bar"
                height={380}
            />
        </div>
    );
};

export default TopVentasChart;
