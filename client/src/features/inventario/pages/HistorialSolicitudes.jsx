import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

//URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const HistorialSolicitudes = () => {
    const navigate = useNavigate();

    const [data, setData] = useState([]);

    // Obtener listado
    useEffect(() => {
        axios
            .get(`${BASE_URL}/inventario/historial-solicitudes`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT al header
                }
            }).then((response) => {
                setData(response.data);

            }).catch((error) => {
                if (error.response) {
                    // Manejo de errores HTTP
                    if (error.response.status === 401) {
                        Swal.fire({
                            icon: "warning",
                            title: "Advertencia",
                            text: "Operacion no Autorizada",
                            showConfirmButton: false,
                        });
                        navigate(0); // Redirige si no está autorizado
                    }
                    else if (error.response.status === 403) {
                        Swal.fire({
                            icon: "warning",
                            title: "Autenticación",
                            text: "Sesión expirada",
                            showConfirmButton: false,
                        });
                        localStorage.clear();
                        navigate("/login"); // Redirige si la sesión ha expirado
                    } else {
                        console.error("Error fetching solicitudes:", error);
                    }
                } else {
                    console.error("Error desconocido:", error);
                }
            });
    }, []);

    return (
        <>
            <div className="p-3 bg-darkest rounded-4" style={{ minHeight: "90vh" }}>
                <table className="table-hover">
                    <thead>
                        <tr className="">
                            <th>Titulo</th>
                            <th className="d-none d-xl-table-cell">Usuario</th>
                            <th className="d-none d-xl-table-cell">Fecha</th>
                            <th className="d-none d-md-table-cell">Estado</th>
                            <th className="d-none d-md-table-cell">Detalle</th>

                        </tr>
                    </thead>
                    <tbody>
                        {data && data.length > 0 ? (
                            data.map((rowData) => (
                                <tr key={rowData.idSolicitud}>
                                    <td>{rowData.titulo}</td>
                                    <td className="d-none d-md-table-cell">{rowData.usuario}</td>
                                    <td className="d-none d-xl-table-cell">
                                        <input
                                            type="date"
                                            style={{ maxWidth: "150px" }}
                                            className="form-control rounded-5"
                                            value={rowData.fecha ? rowData.fecha.split("T")[0] : ""}
                                            readOnly
                                        />
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            {rowData.aprobado === true ? "Aprobado"
                                            : rowData.aprobado === false ? "Rechazado"
                                            : "Pendiente"}
                                        </div>
                                    </td>
                                    <td className="d-none d-md-table-cell">
                                        {rowData.cuerpo}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">Sin resultados</td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>
        </>
    );
}

export default HistorialSolicitudes;
