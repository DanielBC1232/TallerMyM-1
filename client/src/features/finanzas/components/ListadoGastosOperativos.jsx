import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

export const ListadoGastosOperativos = () => {
    const [gastosOperativos, setGastosOperativos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${BASE_URL}/finanzas/obtener-gastos-operativos/`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}` // Se agrega el token JWT
                    }
                });
                setGastosOperativos(data);

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
                        setError("No se pudieron cargar los gastos operativos");
                        Swal.fire("Error", "No se pudieron cargar los gastos operativos", "error");
                    }
                } else {
                    console.error("Error al obtener datos:", error);
                    setError("Error de red o conexión");
                    Swal.fire("Error", "Hubo un problema con la conexión o el servidor.", "error");
                }
            } finally {
                setLoading(false);
            }

        };
        obtenerDatos();
    }, []);

    if (loading) return <div>Cargando datos...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!gastosOperativos || gastosOperativos.length === 0) {
        return <div className="alert alert-info">No hay gastos operativos registrados.</div>;
    }

    return (
        <div className="" >
            <table className="table-hover align-middle" style={{Minheight: "85vh"}}>
                <thead className="table-light">
                    <tr>
                        <th>Tipo de Gasto</th>
                        <th>Monto</th>
                        <th>Detalle</th>
                        <th>Proveedor</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {gastosOperativos.map((gasto, index) => (
                        <tr key={gasto._id || index}>
                            <td>{gasto.tipoGasto}</td>
                            <td>₡ {gasto.monto?.toLocaleString('es-CR') || 0}</td>
                            <td>{gasto.detalle}</td>
                            <td>{gasto.proveedor?.nombre || gasto.proveedor || "N/A"}</td>
                            <td>{new Date(gasto.fecha).toLocaleDateString('es-CR')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListadoGastosOperativos;