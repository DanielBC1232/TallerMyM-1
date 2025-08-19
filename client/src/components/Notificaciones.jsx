import React, { useEffect, useState } from "react";
import { Drawer, Stack, Message } from "rsuite";
import { IoIosNotifications } from "react-icons/io";
import { MdDeleteSweep } from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import { CiCircleQuestion } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";

//URL BASE
export const BASE_URL = import.meta.env.VITE_API_URL;

const Notificaciones = ({ modulo }) => {
    const [notificaciones, setNotificaciones] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const obtenerNotificaciones = async () => {
            try {
                const { data } = await axios.post(
                    `${BASE_URL}/notificaciones/obtener-notificaciones/`,
                    { modulo },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );

                const listaDatos = data.map((noti) => ({
                    idNotificacion: noti.idNotificacion,
                    titulo: noti.titulo,
                    cuerpo: noti.cuerpo,
                    fecha: noti.fecha.split('T')[0],
                    tipo: noti.tipo,
                }));
                setNotificaciones(listaDatos);
            } catch (error) {
                console.error("Error al obtener notificaciones:", error);

                if (error.response) {
                    // Manejo de errores HTTP específicos
                    if (error.response.status === 401) {
                        Swal.fire({
                            icon: "warning",
                            title: "Advertencia",
                            text: "Operación no autorizada",
                            showConfirmButton: false,
                        });
                        navigate("/login"); // Redirige al login si no está autorizado
                    } else if (error.response.status === 403) {
                        Swal.fire({
                            icon: "warning",
                            title: "Autenticación",
                            text: "Sesión expirada",
                            showConfirmButton: false,
                        });
                        localStorage.clear();
                        navigate("/login"); // Redirige al login si la sesión ha expirado
                    } else {
                        Swal.fire("Error", "Hubo un problema al obtener las notificaciones", "error");
                    }
                } else {
                    // Error si no se recibe respuesta (problemas de red, por ejemplo)
                    Swal.fire("Error", "Hubo un problema al obtener las notificaciones", "error");
                }
            }
        };

        obtenerNotificaciones();
    }, [modulo]);

    const [open, setOpen] = React.useState(false);

    const Eliminar = async (idNotificacion) => {
        const result = await Swal.fire({
            title: "¿Descartar Notificación?",
            text: "¡Esta notificación desaparecerá de la lista!",
            icon: "warning",
            showCancelButton: true,
            customClass: {
                confirmButton: 'btn btn-danger rounded-5 me-3',
                cancelButton: 'btn btn-secondary rounded-5'
            },
            buttonsStyling: false,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Eliminar",
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${BASE_URL}/notificaciones/eliminar-notificacion/${idNotificacion}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                window.location.reload(); // Recargar la página después de eliminar
            } catch (error) {
                console.error("Error al eliminar notificación:", error);

                if (error.response) {
                    // Manejo de errores HTTP específicos
                    if (error.response.status === 401) {
                        Swal.fire({
                            icon: "warning",
                            title: "Advertencia",
                            text: "Operación no autorizada",
                            showConfirmButton: false,
                        });
                        navigate("/login"); // Redirige al login si no está autorizado
                    } else if (error.response.status === 403) {
                        Swal.fire({
                            icon: "warning",
                            title: "Autenticación",
                            text: "Sesión expirada",
                            showConfirmButton: false,
                        });
                        localStorage.clear();
                        navigate("/login"); // Redirige al login si la sesión ha expirado
                    } else {
                        Swal.fire({
                            title: "Error",
                            text: "No se pudo eliminar la notificación",
                            icon: "error",
                            showCancelButton: false,
                        });
                    }
                } else {
                    // Error si no se recibe respuesta (problemas de red, por ejemplo)
                    Swal.fire({
                        title: "Error",
                        text: "Hubo un problema al eliminar la notificación",
                        icon: "error",
                        showCancelButton: false,
                    });
                }
            }
        }
    };

    return (
        <>
            <div className="floating-button-wrapper">
                <button onClick={() => setOpen(true)} className="floating-button position-relative">
                    <IoIosNotifications size={28} />
                    {notificaciones.length > 0 && (
                        <span className="notification-badge">{notificaciones.length}</span>
                    )}
                </button>
            </div>

            <Drawer open={open} onClose={() => setOpen(false)}>
                <Drawer.Header className="px-5 bg-dark-green border-0">
                    <Drawer.Title className="text-white">
                        Notificaciones ({notificaciones.length})
                    </Drawer.Title>
                </Drawer.Header>
                <Drawer.Body className="p-4 bg-darkest">
                    <Stack spacing={15} direction="column" alignItems="flex-start" className="row ms-1 me-1">
                        {notificaciones.length > 0 ? (
                            notificaciones.map((noti) => (
                                <div key={noti.idNotificacion} className="rounded-4 row notification w-100 mb-2 shadow article">
                                    <div className="bg-dark-green py-2 rounded-top-4 d-flex justify-content-between">
                                        <div>
                                            <CiCircleQuestion size={30} className="text-warning me-2" />
                                            <strong className="text-white">{noti.titulo}</strong>
                                        </div>
                                        <div>
                                            <button className="btn rounded-5 text-white muted" onClick={() => Eliminar(noti.idNotificacion)}>X</button>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column gap-1 px-3 py-3">
                                        <div>{noti.cuerpo}</div>
                                        <div className="text-muted" style={{ fontSize: "0.8rem" }}><CiCalendarDate size={15} /> {noti.fecha}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <Message type="info">
                                <strong>Sin Notificaciones</strong> No tienes nuevas notificaciones en este momento.
                            </Message>
                        )}
                    </Stack>
                </Drawer.Body>
            </Drawer>
        </>
    )
}
export default Notificaciones;