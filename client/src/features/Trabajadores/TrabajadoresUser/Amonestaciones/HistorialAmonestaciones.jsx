import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const HistorialAmonestaciones = ({ formData, trigger }) => {
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(true);

    const cedula = localStorage.getItem("cedula");

    useEffect(() => {
        const getAmonestaciones = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(
                    `${BASE_URL}/trabajadores/historialAmonestaciones/${cedula}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setDatos(data);
            } catch (error) {
                if (error.response) {
                    const { status } = error.response;

                    if (status === 401) {
                        Swal.fire("Advertencia", "Operación no autorizada", "warning");
                        window.location.reload();
                    } else if (status === 403) {
                        Swal.fire("Autenticación", "Sesión expirada", "warning");
                        localStorage.clear();
                        window.location.href = "/login";
                    }
                } else {
                    console.error("Error de red:", error);
                    Swal.fire("Error", "Problema de conexión con el servidor", "error");
                }
            } finally {
                setLoading(false);
            }
        };

        getAmonestaciones();
    }, [formData, trigger]);


    const formatFecha = (fechaString) => {
        if (!fechaString) return "-";
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString("es-ES");
    };

    if (loading) {
        return <div className="p-5 text-center">Cargando amonestaciones...</div>;
    }

    return (
        <div className="p-4 bg-darkest rounded-4" style={{ minHeight: "88vh" }}>
            <h2 className="text-white">Historial de Amonestaciones</h2>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Trabajador</th>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Motivo</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {datos.length > 0 ? (
                        datos.map((amonestacion) => (
                            <tr key={amonestacion.idAmonestacion}>
                                <td>{amonestacion.nombreTrabajador}</td>
                                <td>{formatFecha(amonestacion.fechaAmonestacion)}</td>
                                <td>{amonestacion.tipoAmonestacion}</td>
                                <td>{amonestacion.motivo}</td>
                                <td>{amonestacion.accionTomada}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center text-muted">
                                Sin resultados
                            </td>
                        </tr>
                    )}
                </tbody>

            </table>
        </div>
    );
};

export default HistorialAmonestaciones;
