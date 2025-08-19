import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Modal, Button } from "rsuite";
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";

export const BASE_URL = import.meta.env.VITE_API_URL;

const ModalAgregarUsuario = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [formValue, setFormValue] = useState({
        username: "",
        email: "",
        cedula: "",
        password: "",
        password2: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValue((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => { //SUBBMIT FORM

        e.preventDefault();
        const { username, email, cedula, password, password2 } = formValue;
        if (!username || !email || !cedula ||!password || !password2) {
            Swal.fire({
                icon: "warning",
                title: "Advertencia",
                text: "Todos los campos son obligatorios",
                showConfirmButton: false,
            });
            return;
        }
        if (password.length < 8) {
            Swal.fire("Advertencia", "La contraseña debe tener al menos 8 caracteres", "warning");
            return;
        }
        if (password !== password2) {
            Swal.fire({
                icon: "warning",
                title: "Advertencia",
                text: "Las contraseñas no coinciden",
                showConfirmButton: false,
            });
            return;
        }
        const payload = { username, email, cedula, password };
        try {
            const response = await axios.post(// PETICION POST
                `${BASE_URL}/admin/registrar-usuario`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.status === 200 || response.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Éxito",
                    text: "Usuario registrado exitosamente",
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                }).then(() => {
                    setFormValue({
                        username: "",
                        email: "",
                        cedula: "",
                        password: "",
                        password2: "",
                    });
                    setOpen(false);
                });
                navigate(0);//recargar
            }
        } catch (error) {
            if (error.response.status === 401) {
                Swal.fire({
                    icon: "warning",
                    title: "Advertencia",
                    text: "Operacion no Autorizada",
                    showConfirmButton: false,
                });
                navigate(0); //No autenticado
            }
            else if (error.response.status === 403) {
                Swal.fire({
                    icon: "warning",
                    title: "Autenticación",
                    text: "Sesión expirada",
                    showConfirmButton: false,
                });
                localStorage.clear();
                navigate("/login"); //No autenticado
            }
            else if (error.response && error.response.status === 409) {
                const reason = error.response.data?.reason;

                let mensaje = "Conflicto";
                if (reason === "email_exists") {
                    mensaje = "El correo ya existe";
                } else if (reason === "cedula_exists") {
                    mensaje = "La cédula ya existe";
                }
                Swal.fire({
                    icon: "warning",
                    title: "Advertencia",
                    text: mensaje,
                    showConfirmButton: false,
                });
            } else {
                console.error("Error al registrar el usuario", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Hubo un error al registrar el usuario",
                    showConfirmButton: false,
                });
            }
        }
    };
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <>
            <Button style={{ minWidth: "80px", maxWidth: "350px" }} className="btn btn-success rounded-5 text-white d-flex align-items-center justify-content-center gap-1"
                onClick={handleOpen}><IoMdAdd size={20} /> Registrar Usuario</Button>
            <Modal open={open} onClose={handleClose} size="sm">
                <Modal.Header>
                    <Modal.Title className="text-success text-center mt-2">Registrar Usuario</Modal.Title>
                    <hr className="text-success p-0" />
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="px-3">
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">
                                    Nombre de usuario:
                                </label>
                                <input
                                    style={{ height: "35px" }}
                                    type="text"
                                    className="form-control rounded-5"
                                    name="username"
                                    value={formValue.username}
                                    onChange={handleChange}
                                    required/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    Correo:
                                </label>
                                <input
                                    type="email"
                                    className="form-control rounded-5"
                                    name="email"
                                    value={formValue.email}
                                    onChange={handleChange}
                                    required/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    Cedula:
                                </label>
                                <input
                                    type="text"
                                    className="form-control rounded-5"
                                    name="cedula"
                                    value={formValue.cedula}
                                    onChange={handleChange}
                                    required/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">
                                    Contraseña:
                                </label>
                                <input
                                    type="password"
                                    className="form-control rounded-5"
                                    name="password"
                                    value={formValue.password}
                                    onChange={handleChange}
                                    required/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password2" className="form-label">
                                    Confirmar Contraseña:
                                </label>
                                <input type="password"
                                    className="form-control rounded-5"
                                    name="password2"
                                    value={formValue.password2}
                                    onChange={handleChange}
                                    required />
                            </div>
                            <div className="d-flex justify-content-start mt-4">
                                <button className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1" type="submit">
                                    <IoMdAdd size={20} /> Registrar</button>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ModalAgregarUsuario;
