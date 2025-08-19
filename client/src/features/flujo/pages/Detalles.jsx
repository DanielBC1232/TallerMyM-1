import React, { useState, useEffect, useMemo } from "react";
import { Steps, Text, Divider } from "rsuite";
import "../styles/flu.module.css";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { IoIosReturnLeft } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { IoTime } from "react-icons/io5";
import { FaCar } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

//URL BASE
export const BASE_URL = import.meta.env.VITE_API_URL;

const styles = {
    width: '400px',
    display: 'inline-table',
    verticalAlign: 'top'
};
const Detalles = () => {
    const { idOrden } = useParams();
    const navigate = useNavigate(); // Hook para navegar
    const [orden, setOrden] = useState([]);
    const [allowNext, setAllowNext] = useState(true);
    const [fase, setFase] = useState({
        idOrden: idOrden,
        estadoOrden: 0
    });
    const [reload, setReload] = useState(0);

    useEffect(() => {
        const obtenerOrden = async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/flujo/obtener-orden/${idOrden}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}` // Incluir JWT en el encabezado
                    }
                });

                setOrden(data);
                setFase((prev) => ({ ...prev, estadoOrden: data.estadoOrden }));

                //console.log(data); // imprimir JSON en consola
            } catch (error) {
                if (error.response) {
                    // Manejo de errores HTTP
                    if (error.response.status === 401) {
                        Swal.fire({
                            icon: "warning",
                            title: "Advertencia",
                            text: "Operación no autorizada",
                            showConfirmButton: false,
                        });
                        navigate(0); // Redirige a la página de login si no está autorizado
                    }
                    else if (error.response.status === 403) {
                        Swal.fire({
                            icon: "warning",
                            title: "Autenticación",
                            text: "Sesión expirada",
                            showConfirmButton: false,
                        });
                        localStorage.clear();
                        navigate("/login"); // Redirige a login si la sesión ha expirado
                    }
                    else {
                        console.error("Error al obtener el orden:", error);
                        Swal.fire({
                            title: 'Error al obtener el orden!',
                            icon: 'error',
                            showConfirmButton: false
                        });
                    }
                } else {
                    // Manejo de errores en caso de problemas de red u otros
                    console.error("Error desconocido", error);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Hubo un error desconocido, por favor intente nuevamente",
                        showConfirmButton: false,
                    });
                }
            }

        };

        obtenerOrden(); // llamar funcion
    }, [idOrden, reload]);//cargar al tener id // al cambiar fase

    //useEffect para verificar si se puede avanzar a la siguiente fase
    useEffect(() => {

        //si el estado es del 1 al 4 (en progreso, finalizado o venta) se puede avanzar
        if (fase.estadoOrden <= 1 && fase.estadoOrden >= 3) {
            setAllowNext(true);

            //si el estado es 4 (venta) no se puede avanzar
        } else if (fase.estadoOrden === 4) {
            setAllowNext(false);
            return;
        }

    }, [fase.estadoOrden]);

    //numero de estado ==> texto de proximo estado
    const estadoTexto = useMemo(() => {
        const estados = {
            0: "Pendiente",
            1: "En progreso",
            2: "Finalizado",
            3: "Venta",
        };
        return estados[fase.estadoOrden]; // No hay "default"
    }, [fase.estadoOrden]);

    //metodo para avanzar a la siguiente fase
    const siguienteFase = async () => {

        //si el estado es 4 (el ultimo) desaparece el boton de siguiente fase
        if (allowNext === false) {
            return;
        }

        try {
            const result = await Swal.fire({
                text: `Avanzar orden a la fase "${estadoTexto}"?`,
                icon: "warning",
                confirmButtonText: 'Confirmar',
                showConfirmButton: true,
                showCancelButton: true,
                customClass: {
                    actions: 'my-actions',
                    confirmButton: 'btn btn-success text-white order-2 rounded-5',
                    cancelButton: 'btn btn-outline-dark order-1 rounded-5',
                },
            });

            if (result.isConfirmed) {

                const resFase = await axios.put(`${BASE_URL}/flujo/actualizar-fase-orden/`, fase, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}` // Incluir JWT en el encabezado
                    }
                });

                if (resFase.status === 200) {
                    Swal.fire({
                        title: 'Orden actualizada!',
                        icon: 'success',
                        showConfirmButton: false
                    });
                    setReload(reload + 1); // Recargar página para ver cambios
                }
            }
        } catch (error) {
            if (error.response) {
                // Manejo de errores HTTP
                if (error.response.status === 401) {
                    Swal.fire({
                        icon: "warning",
                        title: "Advertencia",
                        text: "Operación no autorizada",
                        showConfirmButton: false,
                    });
                    navigate(0); // Redirige a la página de login si no está autorizado
                }
                else if (error.response.status === 403) {
                    Swal.fire({
                        icon: "warning",
                        title: "Autenticación",
                        text: "Sesión expirada",
                        showConfirmButton: false,
                    });
                    localStorage.clear();
                    navigate("/login"); // Redirige a login si la sesión ha expirado
                }
                else {
                    console.error("Error al actualizar fase:", error);
                    Swal.fire({
                        title: 'Error al actualizar orden!',
                        icon: 'error',
                        showConfirmButton: false
                    });
                }
            } else {
                // Manejo de errores en caso de problemas de red u otros
                console.error("Error desconocido", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Hubo un error desconocido, por favor intente nuevamente",
                    showConfirmButton: false,
                });
            }
        }
    };

    return (
        <div className="container bg-white rounded-5 shadow mx-auto p-0" style={{ minHeight: "88vh", maxWidth: "120vh" }}>

            <div className="d-flex flex-column gap-4 p-0">
                <div className="rounded-top-4 bg-header">
                    <div className="mx-auto justify-content-center text-center py-3">
                        <h1 className="text-success">Código de orden:</h1>
                        <h3 className="text-white">{orden.codigoOrden}</h3>
                    </div>
                </div>

                <div className="row px-3 px-md-5 gap-4 justify-content-center flex-wrap mt-5">
                    <div className="col-12 col-md-3">
                        <Steps current={orden.estadoOrden - 1} vertical style={styles}>
                            <Steps.Item title="Pendiente" description=" " />
                            <Steps.Item title="En progreso" description=" " />
                            <Steps.Item title="Finalizado" description=" " />
                            <Steps.Item title="Venta" description=" " />
                        </Steps>
                    </div>

                    <div className="col-12 col-md-4 d-flex flex-column gap-3">
                        <span>
                            <Text size="xxl"><IoMdPerson className="mb-1" /> Cliente:</Text>
                            <Text size="xl" muted>{orden.nombreCliente}</Text>
                        </span>
                        <span>
                            <Text size="xxl"><IoMdPerson className="mb-1" /> Mecánico:</Text>
                            <Text size="xl" muted>{orden.nombreMecanico}</Text>
                        </span>
                        <span>
                            <Text size="xxl"><FaCar className="mb-1" /> Vehículo:</Text>
                            <Text size="xl" muted>{orden.vehiculo}</Text>
                        </span>
                        <span>
                            <Text size="xxl"><IoTime className="mb-1" /> Fecha de ingreso:</Text>
                            <Text size="xl" muted>{orden.fechaIngreso}</Text>
                        </span>
                    </div>

                    <div className="col-12 col-md-4 d-flex flex-column gap-3">
                        <span>
                            <Text size="xxl"><IoTime className="mb-1" /> Estimado de finalización:</Text>
                            <Text size="xl" muted>{orden.tiempoEstimado}</Text>
                        </span>
                        <span>
                            <Text size="xxl"><IoTime className="mb-1" /> Tiempo Restante:</Text>
                            <Text size="xl" style={orden.estadoAtrasado === true ? { color: "#F50025" } : { color: "#717273" }}>
                                {orden.TiempoRestante}
                            </Text>
                        </span>
                        <span>
                            <Text size="xxl">Descripción:</Text>
                            <Text size="xl" muted>{orden.descripcion}</Text>
                        </span>
                    </div>
                </div>

                <div className="row py-sm-4 px-md-5 mt-4 justify-content-between pt-5">
                    <div className="col-auto mb-2">
                        <Link to={`/flujo`} className="btn btn-dark text-white rounded-5 d-flex align-items-center justify-content-center gap-1 ms-3">
                            <IoIosReturnLeft size={25} />Volver
                        </Link>
                    </div>
                    <div className="col-auto mb-2">
                        {/* si allowNext es true, renderiza el boton siguiente fase */}

                        {allowNext && (
                            <button
                                className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1 ms-3"
                                onClick={siguienteFase}>
                                <FaArrowRight size={20} />Siguiente fase
                            </button>
                        )}
                    </div>
                    <div className="col-auto mb-2">
                        <Link
                            to={`/flujo-editar/${idOrden}`}
                            className="btn btn-warning text-white rounded-5 d-flex align-items-center justify-content-center gap-1 ms-3">
                            <MdEdit size={20} />Editar
                        </Link>
                    </div>
                </div>

            </div>
        </div>


    );
};

export default Detalles;
