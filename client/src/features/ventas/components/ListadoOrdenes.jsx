import React, { useState, useEffect } from "react";
import { Table, Modal, Text } from 'rsuite';
import Swal from "sweetalert2";
const { Column, HeaderCell, Cell } = Table;
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { IoMdAdd } from "react-icons/io";


// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const ListadoOrdenes = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        idOrden: 0,
        detalles: ""
    });

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //GET ORDENES
    const [datos, setDatos] = useState([]);
    useEffect(() => {
        const getOrdenes = async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/flujo/obtener-ordenes/${4}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT
                    }
                });
                setDatos(data); // Asignar los datos recibidos
                //console.log(data);
            } catch (error) {
                if (error.response) {
                    // Manejo de respuestas HTTP de error
                    if (error.response.status === 401) {
                        Swal.fire({
                            icon: "warning",
                            title: "Advertencia",
                            text: "Operación no Autorizada",
                            showConfirmButton: false,
                        });
                        // Redirigir al login si el token es inválido o ha expirado
                        navigate("/login");
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
                        console.error("Error al obtener las órdenes:", error);
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Hubo un error al obtener las órdenes",
                            showConfirmButton: false,
                        });
                    }
                } else {
                    console.error("Error al obtener las órdenes:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Hubo un error desconocido, por favor intente nuevamente",
                        showConfirmButton: false,
                    });
                }
            }
        };

        getOrdenes(); // Llamar la función para obtener las órdenes
    }, []);

    const verificarDetalle = () => {
        if (!formData.detalles.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Debe escribir un detalle',
            });
            return false;
        }
        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    //funcion innecesaria, abrir modal desde btn tabla
    async function GenerarVenta(id) {
        await setFormData({
            ...formData,
            idOrden: id, // asignar el id de la orden seleccionada
        });
        handleOpen(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log(formData);

        if (verificarDetalle()) {
            axios.post(`${BASE_URL}/ventas/registrar-venta/`, formData, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT en la cabecera
                }
            }).then((res) => {
                Swal.fire({
                    icon: "success",
                    title: "Venta generada correctamente",
                    showConfirmButton: false,
                    timer: 1000,
                }).then(() => {
                    handleOpen(false);
                    handleClose(true);
                });
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status === 401) {
                        Swal.fire({
                            icon: "warning",
                            title: "Advertencia",
                            text: "Operación no Autorizada",
                            showConfirmButton: false,
                        });
                        // Redirigir al login si el token es inválido o ha expirado
                        navigate("/login");
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
                        Swal.fire({
                            icon: "error",
                            title: "Error al generar venta",
                            text: error.response.data ? error.response.data.message : error.message,
                            showConfirmButton: false,
                            timer: 1000,
                        });
                    }
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error al generar venta",
                        text: "Hubo un error desconocido, por favor intente nuevamente.",
                        showConfirmButton: false,
                        timer: 1000,
                    });
                }
            });
        }
    };
    return (
        <>
            <div className="p-3 bg-darkest mt-3" style={{ minHeight: "90vh" }}>
                {datos.length > 0 ? (
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="text-center" style={{ width: "250px" }}>Codigo de Orden</th>
                                <th className="text-center" style={{ width: "250px" }}>Fecha de ingreso</th>
                                <th className="text-center" style={{ width: "200px" }}>Cliente</th>
                                <th className="text-center" style={{ width: "500px" }}>Accion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datos.map((rowData) => (
                                <tr key={rowData.idOrden}>
                                    <td className="text-center">{rowData.codigoOrden}</td>
                                    <td className="text-center">{rowData.fechaIngreso}</td>
                                    <td className="text-center">{rowData.nombreCliente}</td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            <button
                                                className="text-white btn btn-success rounded-4 d-flex align-items-center justify-content-center gap-1"
                                                onClick={() => GenerarVenta(rowData.idOrden)}
                                            >
                                                <IoMdAdd size={20} />
                                                Generar Venta
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-white text-center mt-5">Sin resultados</div>
                )}
            </div>


            <Modal open={open} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header className="px-3 pt-3">
                        <Modal.Title className="text-center">
                            <Text size="xxl" className="text-success">
                                Generar venta
                            </Text>
                        </Modal.Title>
                        <hr className="text-success" />
                    </Modal.Header>
                    <Modal.Body className="px-3">
                        <div>
                            <span>Detalles:</span>
                            <textarea
                                name="detalles"
                                className="form-control rounded-4"
                                rows={4}
                                placeholder=""
                                onChange={handleChange}
                                value={formData.detalles}
                            ></textarea>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="p-3 mb-3">
                        <button type="submit" className="text-white btn btn-success rounded-4 d-flex align-items-center justify-content-center gap-1">
                            <IoMdAdd size={20} />Generar
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );

}
export default ListadoOrdenes;
