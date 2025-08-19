import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaSave } from "react-icons/fa";

export const BASE_URL = import.meta.env.VITE_API_URL;

const EditarUsuario = () => {
  const { idUsuario } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    username: "",
    email: "",
    idRol: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/admin/obtenerUsuario/${idUsuario}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        setUsuario((prev) => ({
          ...prev,
          username: response.data.username,
          email: response.data.email,
          idRol: response.data.idRol,
        }));
      } catch (error) {
        console.error("Error al obtener el usuario:", error);

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
            Swal.fire("Error", "No se pudieron cargar los datos del usuario", "error");
          }
        } else {
          // Error si no se recibe respuesta (problemas de red, por ejemplo)
          Swal.fire("Error", "No se pudieron cargar los datos del usuario", "error");
        }
      }
    };

    obtenerUsuario();
  }, [idUsuario]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuario.username.trim() || !usuario.email.trim()) {
      Swal.fire("Campos vacíos", "El nombre de usuario y el correo son obligatorios", "warning");
      return;
    }

    const pass = usuario.password.trim();
    const confirm = usuario.confirmPassword.trim();


    if (pass.length < 8 && pass.length > 0) {
      Swal.fire("Advertencia", "La contraseña debe tener al menos 8 caracteres", "warning");
      return;
    }

    if ((pass || confirm) && pass !== confirm) {
      Swal.fire("Error", "Las contraseñas no coinciden", "warning");
      return;
    }

    const payload = {
      username: usuario.username,
      email: usuario.email,
      idRol: parseInt(usuario.idRol),
      password: usuario.password,
    };

    try {
      await axios.put(
        `${BASE_URL}/admin/editar/${idUsuario}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      Swal.fire({
        title: "Éxito",
        text: "Usuario actualizado correctamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      }).then(() => navigate("/administracion"));
    } catch (error) {
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
        } else if (error.response.status === 409) {
          Swal.fire("Error", "No puedes usar una contraseña antigua", "error");
        } else {
          Swal.fire("Error", "No se pudo actualizar el usuario", "error");
        }
      } else {
        // Error si no se recibe respuesta (problemas de red, por ejemplo)
        console.error("Error desconocido al actualizar el usuario:", error);
        Swal.fire("Error", "No se pudo actualizar el usuario", "error");
      }
    }

  };

  return (
    <div className="p-4 rounded-4 bg-darkest shadow-sm" style={{minHeight: "85vh"}}>
      <h2 className="text-center mb-4 text-success">Editar Usuario</h2>
      <hr className="text-success"/>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }} className="mx-auto mt-5">
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Nombre de usuario:</label>
          <input
            type="text"
            id="username"
            name="username"
            className=" form-control rounded-5 py-1"
            value={usuario.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo:</label>
          <input
            type="email"
            id="email"
            name="email"
            className=" form-control rounded-5"
            value={usuario.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="idRol" className="form-label">Rol:</label>
          <select className="form-select rounded-5" name="idRol" value={usuario.idRol}
            onChange={handleChange}>
            <option value="2">Usuario</option>
            <option value="1">Administrador</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Nueva contraseña (opcional):</label>
          <input
            type="password"
            name="password"
            className=" form-control rounded-5"
            value={usuario.password}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Confirmar nueva contraseña:</label>
          <input
            type="password"
            name="confirmPassword"
            className=" form-control rounded-5"
            value={usuario.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <div className="mt-5 px-2 row d-flex justify-content-center">
          <button type="submit" className="btn btn-success rounded-5 d-flex align-items-center justify-content-center gap-1"><FaSave size="20"/>Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
};

export default EditarUsuario;
