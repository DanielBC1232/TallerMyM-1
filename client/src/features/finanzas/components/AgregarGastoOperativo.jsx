import { useState } from "react";
import swal from "sweetalert2";
import SelectProveedor from "../../inventario/components/SelectProveedor";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Modal } from 'rsuite';
import { TbCashRegister } from "react-icons/tb";
// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const AgregarGastoOperativo = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        tipoGasto: "",
        detalle: "",
        monto: 0,
        proveedor: ""
    });

    // Función para abrir y cerrar modal
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Función genérica para actualizar cualquier campo
    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Para inputs HTML estándar
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        handleChange(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación mejorada: todos los campos son obligatorios
        if (!formData.tipoGasto) {
            swal.fire("Error", "Debe seleccionar un tipo de gasto", "error");
            return;
        }

        if (!formData.detalle || formData.detalle.trim() === "") {
            swal.fire("Error", "El detalle del gasto es obligatorio", "error");
            return;
        }

        if (!formData.monto || formData.monto <= 0) {
            swal.fire("Error", "Debe ingresar un monto válido mayor a cero", "error");
            return;
        }

        if (!formData.proveedor) {
            swal.fire("Error", "Debe seleccionar un proveedor o 'ninguno'", "error");
            return;
        }

        try {
            const response = await axios.post(
                `${BASE_URL}/finanzas/agregar-gasto-operativo/`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('token')}` // Añadido el token JWT al header
                    }
                }
            );

            if (response.status === 201) {
                swal.fire("Éxito", "Gasto operativo registrado correctamente", "success");
                // Reiniciar el formulario a su estado inicial
                setFormData({
                    tipoGasto: "",
                    detalle: "",
                    monto: 0,
                    proveedor: ""
                });
                navigate(0)
            }
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
                    console.error("Error al registrar el gasto:", error);
                    swal.fire("Error", "Hubo un problema al registrar el gasto operativo", "error");
                }
            } else {
                // Manejo de errores en caso de que no haya respuesta del servidor (por ejemplo, problemas de red)
                console.error("Error desconocido al registrar el gasto:", error);
                swal.fire("Error", "Hubo un problema desconocido, por favor intente nuevamente", "error");
            }
        }

    };

    return (
        <>
            <button
                style={{ minWidth: "80px", maxWidth: "350px" }}
                className="btn btn-success rounded-5 text-white d-flex align-items-center justify-content-center gap-1"
                onClick={handleOpen}><TbCashRegister size={20} />Registrar</button>

            <Modal open={open} onClose={handleClose}>
                <Modal.Header className="p-3">
                    <Modal.Title className="text-success text-center">Registrar Gasto Operativo</Modal.Title>
                    <hr className="text-success" />
                </Modal.Header>
                <Modal.Body className="px-3">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3" style={{ maxWidth: "400px" }}>
                            <label>Proveedor ("Ninguno" si no aplica):</label>
                            <SelectProveedor onChange={handleInputChange} value={formData.proveedor} />
                        </div>
                        
                        <div className="mb-3">
                            <label>Tipo de gasto:</label>
                            <select className="form-select rounded-5"
                                name="tipoGasto"
                                onChange={handleInputChange}
                                value={formData.tipoGasto}>
                                <option value="">Seleccione...</option>
                                <option value="Servicios Basicos">Servicios Básicos</option>
                                <option value="Adquisicion Inventario">Adquisición de Inventario</option>
                                <option value="Pago de Salario">Pago de Salario</option>
                                <option value="Mantenimiento">Mantenimiento</option>
                                <option value="Otros">Otros</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label>Detalle:</label>
                            <input className="form-control rounded-5"
                                type="text"
                                name="detalle"
                                onChange={handleInputChange}
                                value={formData.detalle}
                                placeholder="Ejemplo: Factura eléctrica, Factura de agua, ..." />
                        </div>

                        <div className="mb-3">
                            <label>Monto:</label>
                            <input className="form-control rounded-5"
                                type="number"
                                name="monto"
                                onChange={handleInputChange}
                                value={formData.monto}
                                min={0} />
                        </div>

                    </form>
                </Modal.Body>
                <Modal.Footer className="p-3 row">
                    <button
                        onClick={handleSubmit}
                        className="btn btn-success rounded-5 d-flex align-items-center justify-content-center gap-1"
                        type="button">
                        Registrar
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AgregarGastoOperativo;