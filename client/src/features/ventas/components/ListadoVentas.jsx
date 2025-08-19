import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import { MdOutlineManageSearch } from "react-icons/md";
// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const ListadoVentas = () => {
    const navigate = useNavigate();
    const [filtroData, setFiltroData] = useState({
        nombreCliente: "",
        codigoOrden: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFiltroData({
            ...filtroData,
            [name]: value || ""
        });
    };

    //GET Ventas
    const [datos, setDatos] = useState([]);
    useEffect(() => {
        const getOrdenes = async () => {
            try {
                const { data } = await axios.post(`${BASE_URL}/ventas/obtener-ventas`, filtroData, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT en las cabeceras
                    }
                });
                setDatos(data);
                //console.log(data);
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        Swal.fire({
                            icon: "warning",
                            title: "Advertencia",
                            text: "Operación no Autorizada",
                            showConfirmButton: false,
                        });
                        navigate("/login"); // Redirigir al login si el token es inválido o no hay sesión activa
                    } else if (error.response.status === 403) {
                        Swal.fire({
                            icon: "warning",
                            title: "Autenticación",
                            text: "Sesión expirada",
                            showConfirmButton: false,
                        });
                        localStorage.clear();
                        navigate("/login"); // Redirigir al login si la sesión ha expirado
                    } else {
                        console.error("Error al obtener ordenes", error);
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Hubo un error al obtener las órdenes",
                            showConfirmButton: false,
                            timer: 1000,
                        });
                    }
                } else {
                    console.error("Error de conexión", error);
                    Swal.fire({
                        icon: "error",
                        title: "Error de conexión",
                        text: "No se pudo conectar al servidor",
                        showConfirmButton: false,
                        timer: 1000,
                    });
                }
            }
        };
        getOrdenes();
    }, [filtroData]);

    return (
        <>
            <div className="py-3 bg-darkest" style={{ minHeight: "85vh" }}>
                {/* Sección de filtros */}
                <div className="ps-3 d-flex gap-4 mb-2">
                    <span>

                        <input
                            placeholder=" Código de Orden"
                            className="form-control rounded-5"
                            name="codigoOrden"
                            type="text"
                            value={filtroData.codigoOrden}
                            onChange={handleChange} />
                    </span>
                    <span>
                        <input
                            placeholder=" Nombre del cliente"
                            className="form-control rounded-5"
                            name="nombreCliente"
                            type="text"
                            value={filtroData.nombreCliente}
                            onChange={handleChange}
                        />
                    </span>
                </div>
                {/* Tabla de ventas o mensaje "Sin resultados" */}
                {datos.length > 0 ? (
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="text-center">Código de Orden</th>
                                <th className="text-center">Cliente</th>
                                <th className="text-center">Fecha de venta</th>
                                <th className="text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datos.map((rowData) => {
                                const fecha = new Date(rowData.fechaVenta);
                                const fechaFormateada = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
                                    .toString()
                                    .padStart(2, "0")}-${fecha.getDate().toString().padStart(2, "0")}`;

                                return (
                                    <tr key={rowData.idVenta}>
                                        <td className="text-center">{rowData.codigoOrden}</td>
                                        <td className="text-center">{rowData.nombreCliente}</td>
                                        <td className="text-center">{fechaFormateada}</td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center">
                                                <Link
                                                    to={`/detalles/${rowData.idVenta}`}
                                                    style={{ width: "170px" }}
                                                    className="btn btn-success rounded-4 d-flex align-items-center justify-content-center gap-1"
                                                >
                                                    <MdOutlineManageSearch size={20} />
                                                    Gestionar Venta
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center text-white">Sin resultados</div>
                )}
            </div>
        </>
    );
}
export default ListadoVentas;
