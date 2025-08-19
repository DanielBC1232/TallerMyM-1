import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from "axios";
import { Text } from "rsuite";

export const BASE_URL = import.meta.env.VITE_API_URL;

const Login = () => {
    const navigate = useNavigate();
    const [formValue, setFormValue] = useState({
        email: '',
        password: '',
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
        const { email, password } = formValue;
        if (!email || !password) {
            // Usamos SweetAlert2 para notificar
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor complete ambos campos',
            });
            return;
        }
        try {
            const response = await axios.post(`${BASE_URL}/admin/iniciar-sesion`, formValue);
            //console.log(formValue);

            if (response.status === 200) {
                // Login exitoso, redirige -- GENERAR SESION

                //Guardar datos de login a localStorage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('idUsuario', response.data.idUsuario);
                localStorage.setItem('username', response.data.username);
                localStorage.setItem('email', response.data.email);
                localStorage.setItem('cedula', response.data.cedula);
                localStorage.setItem('idRol', response.data.idRol);//1-admin,2-user

                //console.log(response.data);

                navigate('/flujo');
            }
        } catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.message || 'Error inesperado';

            if (status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Credenciales incorrectas',
                    text: message,
                    showConfirmButton: false
                });
            } else if (status === 423) {
                Swal.fire({
                    icon: 'error',
                    title: 'Cuenta bloqueada',
                    text: message,
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de inicio de sesión',
                    text: message,
                });
            }

            console.error('Error al intentar iniciar sesión:', error);
        }
    };

    return (
        <div className='login-page'>
            <div className="container d-flex align-items-center justify-content-center min-vh-100">
                <div className="row w-100">
                    <div className="col-12 col-md-6 col-lg-4 mx-auto">
                        <div className="card py-4 px-3 shadow-sm">
                            <div className='card-header bg-white'>
                                <h1 className='text-center text-success mb-3'><strong>Taller MyM</strong></h1>
                            </div>
                            <div className="card-body px-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Correo:
                                        </label>
                                        <input type="email" className="form-control rounded-5"
                                            name="email"
                                            value={formValue.email}
                                            onChange={handleChange}
                                            required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Contraseña:</label>
                                        <input type="password" className="form-control rounded-5"
                                            id="password"
                                            name="password"
                                            value={formValue.password}
                                            onChange={handleChange}
                                            required />
                                    </div>
                                    <div className="d-flex justify-content-center mt-5">
                                        <button className="btn btn-success text-white rounded-5" type="submit">
                                            Iniciar sesión
                                        </button>
                                    </div>

                                    <div className="d-flex justify-content-center mt-3">
                                        <Link to="/verificar-correo" className="text-decoration-none">
                                            <Text muted color="blue">¿Olvidaste tu contraseña?</Text>
                                        </Link>
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

export default Login;
