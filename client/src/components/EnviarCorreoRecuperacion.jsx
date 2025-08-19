import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { createCookie, createCookieSessionStorage, useNavigate } from 'react-router-dom';
import { Text } from "rsuite";

export const BASE_URL = import.meta.env.VITE_API_URL;

const VerificarCorreo = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');

    const handleEnviarCorreo = async () => {
        if (!email) {
            Swal.fire('Advertencia', 'Debe ingresar un correo electrónico', 'warning');
            return;
        }

        try {
            const response = await axios.put(`${BASE_URL}/admin/enviar-correo-token`, { email });
            //console.log(response);
            
            if (response.status === 200) {
                Swal.fire('Éxito', 'Se ha enviado un código de verificación al correo', 'success');
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo enviar el código de verificación', 'error');
        }
    };

    const handleVerificarToken = async () => {
        if (!token) {
            Swal.fire('Advertencia', 'Debe ingresar el código de verificacion', 'warning');
            return;
        }
        try {
            const response = await axios.post(`${BASE_URL}/admin/verificar-token`, { email, token });

            if (response.status === 200) {
                Swal.fire('Éxito', 'Código verificado correctamente', 'success');
                // guardar el email en cookie para usarlo en la siguiente página
                document.cookie = `${email}; path=/; max-age=3600`; // 1 hora
                //localStorage.setItem("emailRecuperacion", email);
                navigate("/cambiar-contrasena");
            }
        } catch (error) {
            Swal.fire('Error', 'Código inválido o expirado', 'error');
        }
    };
    
    return (
        <div className='login-page'>
            <div className="container d-flex align-items-center justify-content-center min-vh-100">
                <div className="row w-100">
                    <div className="col-12 col-md-6 col-lg-4 mx-auto">
                        <div className="card shadow-sm">
                            <div className='card-header bg-white mb-3'>
                                <Text size='xxl' weight="bold" className='text-center text-success'>Verificación</Text>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Correo electrónico:</label>
                                    <input
                                        type="email"
                                        className="form-control rounded-5"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value.trim())}
                                        placeholder="*****@gmail.com"
                                        required
                                    />
                                    <div className="d-flex justify-content-center mt-3">
                                        <button className="btn btn-success text-white rounded-5" onClick={handleEnviarCorreo}>
                                            Enviar correo
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="form-label">Código de verificación:</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-5"
                                        value={token}
                                        onChange={(e) => setToken(e.target.value.trim())}
                                        required
                                    />
                                    <div className="d-flex justify-content-center mt-3">
                                        <button className="btn btn-success text-white rounded-5" onClick={handleVerificarToken}>
                                            Verificar código
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerificarCorreo;
