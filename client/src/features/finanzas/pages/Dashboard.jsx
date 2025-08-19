import { useState, useEffect } from "react";
import { Stat, StatGroup, HStack } from "rsuite";
import axios from "axios";
import IngresosChart from "../components/IngresosChart";
import TopVentasChart from "../components/TopVentasChart";
import { useNavigate } from 'react-router-dom';

export const BASE_URL = import.meta.env.VITE_API_URL;

export const Dashboard = () => {
    const [finanzas, setFinanzas] = useState(null);
    const [gastos, setGastos] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getFinanzas = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}/finanzas/obtener-ganancia-mes/`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}` // Añadir el JWT al header
                        }
                    }
                );
                setFinanzas(response.data);
            } catch (error) {
                if (error.response) {
                    // Manejo de respuestas HTTP
                    if (error.response.status === 401) {
                        swal.fire("Advertencia", "Operacion no Autorizada", "warning");
                        navigate(0); // Redirigir a login si no está autorizado
                    }
                    else if (error.response.status === 403) {
                        swal.fire("Autenticación", "Sesión expirada", "warning");
                        localStorage.clear();
                        navigate("/login"); // Redirigir a login si la sesión ha expirado
                    } else {
                        console.error("Error al obtener ingresos:", error);
                    }
                } else {
                    console.error("Error desconocido al obtener ingresos:", error);
                }
            }
        };

        const getGastos = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}/finanzas/obtener-gasto-mes/`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}` // Añadir el JWT al header
                        }
                    }
                );
                setGastos(response.data);
            } catch (error) {
                if (error.response) {
                    // Manejo de respuestas HTTP
                    if (error.response.status === 401) {
                        swal.fire("Advertencia", "Operacion no Autorizada", "warning");
                        navigate(0); // Redirigir a login si no está autorizado
                    }
                    else if (error.response.status === 403) {
                        swal.fire("Autenticación", "Sesión expirada", "warning");
                        localStorage.clear();
                        navigate("/login"); // Redirigir a login si la sesión ha expirado
                    } else {
                        console.error("Error al obtener gastos:", error);
                    }
                } else {
                    console.error("Error desconocido al obtener gastos:", error);
                }
            }
        };

        getFinanzas();
        getGastos();
    }, []);

    return (
        <div>
            <div className="mx-5 mt-4 bg-darkest p-3 rounded-4 shadow-sm">
                <StatGroup>
                    {/* Ingresos */}
                    <Stat>
                        <Stat.Label className="text-secondary"><strong>Ingresos del mes anterior</strong></Stat.Label>
                        <HStack spacing={10}>
                            <Stat.Value className="text-white">₡ {finanzas?.totalMesAnterior?.toLocaleString() ?? "Cargando..."}</Stat.Value>
                        </HStack>
                    </Stat>

                    <Stat>
                        <Stat.Label className="text-secondary"><strong>Ingresos de este mes</strong></Stat.Label>
                        <HStack spacing={10}>
                            <Stat.Value className="text-white">₡ {finanzas?.totalMesActual?.toLocaleString() ?? "Cargando..."}</Stat.Value>
                            <Stat.Trend 
                                indicator={finanzas?.diferenciaPorcentaje > 0 ? "up" : "down"}
                            >
                                {finanzas?.diferenciaPorcentaje?.toFixed(2) ?? "0"}%
                            </Stat.Trend>
                        </HStack>
                    </Stat>

                    {/* Gastos */}
                    <Stat>
                        <Stat.Label className="text-secondary"><strong>Gastos del mes anterior</strong></Stat.Label>
                        <HStack spacing={10}>
                            <Stat.Value className="text-white">₡ {gastos?.totalMesAnterior?.toLocaleString() ?? "Cargando..."}</Stat.Value>
                        </HStack>
                    </Stat>

                    <Stat>
                        <Stat.Label className="text-secondary"><strong>Gastos de este mes</strong></Stat.Label>
                        <HStack spacing={10}>
                            <Stat.Value className="text-white">₡ {gastos?.totalMesActual?.toLocaleString() ?? "Cargando..."}</Stat.Value>
                            <Stat.Trend
                                indicator={gastos?.diferenciaPorcentual > 0 ? "up" : "down"}
                            >
                                {gastos?.diferenciaPorcentual?.toFixed(2) ?? "0"}%
                            </Stat.Trend>
                        </HStack>
                    </Stat>
                </StatGroup>
            </div>
            <div className="mx-5 mt-4">
                <IngresosChart />
            </div>
            <div className="mx-5 mt-4">
                <TopVentasChart />
            </div>
        </div>
    );
};

export default Dashboard;
