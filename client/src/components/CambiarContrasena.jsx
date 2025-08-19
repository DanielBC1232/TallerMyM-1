import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from "axios";
import { Text } from "rsuite";

export const BASE_URL = import.meta.env.VITE_API_URL;

const CorreoRecuperacion = () => {
    const navigate = useNavigate();
    const [formValue, setFormValue] = useState({
        email: document.cookie, //obtener correo de cookie
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValue({
            ...formValue,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password, confirmPassword } = formValue;

        console.log(email);


        if (!email || !password || !confirmPassword) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor complete todos los campos',
            });
            return;
        }

        if (password.length < 8) {
            Swal.fire("Advertencia", "La contraseña debe tener al menos 8 caracteres", "warning");
            return;
        }

        if (password !== confirmPassword) {
            Swal.fire("Error", "Las contraseñas no coinciden", "warning");
            return;
        }

        try {
            const response = await axios.put(`${BASE_URL}/admin/actualizar-contrasena`, { email, password });
            //console.log(response);

            if (response.status === 200) {
                Swal.fire({
                    title: "Éxito",
                    text: "Contraseña actualizada correctamente",
                    icon: "success",
                    timer: 2000,
                    timerProgressBar: true,
                }).then(() => {
                    localStorage.removeItem("emailRecuperacion");
                    navigate('/login');
                });
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo cambiar la contraseña", "error");
        }
    };

    return (
        <div className='login-page'>
            <div className="container d-flex align-items-center justify-content-center min-vh-100">
                <div className="row w-100">
                    <div className="col-12 col-md-6 col-lg-4 mx-auto">
                        <div className="card shadow-sm">
                            <div className='card-header bg-white'>
                                <Text size='xxl' weight="bold" className='text-center text-success mb-3'>Cambiar contraseña</Text>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Nueva contraseña:</label>
                                        <input
                                            type="password"
                                            className="form-control rounded-5"
                                            id="password"
                                            name="password"
                                            value={formValue.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="confirmPassword" className="form-label">Confirmar nueva contraseña:</label>
                                        <input
                                            type="password"
                                            className="form-control rounded-5"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formValue.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="d-flex justify-content-center mt-5">
                                        <button className="btn btn-success text-white rounded-5" type="submit">
                                            Cambiar contraseña
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CorreoRecuperacion;
