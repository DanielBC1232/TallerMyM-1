import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ModalAgregarUsuario from "../components/ModalAgregarUsuario";
import { Row, Col } from 'rsuite';
import { IoIosRadioButtonOff } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import { IoIosRadioButtonOn } from "react-icons/io";
export const BASE_URL = import.meta.env.VITE_API_URL;

const ListarUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [FiltroUsuario, setFiltroUsuario] = useState("");

  const navigate = useNavigate();

  const ObtenerUsuarios = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/obtenerUsuarios`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });

      setUsuarios(response.data);
      setError("");
    } catch (error) {
      if (error.response) {
        // Manejo de respuestas HTTP
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
          console.error("Error al obtener usuarios:", error);
          setError("Error al obtener usuarios");
        }
      } else {
        // Error si no se recibe una respuesta (problemas de red, por ejemplo)
        console.error("Error desconocido al obtener usuarios:", error);
        setError("Error desconocido al obtener usuarios");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ObtenerUsuarios();
  }, []);

  const UsuariosFiltrados = usuarios.filter((usuario) =>
    usuario.username.toLowerCase().includes(FiltroUsuario.toLowerCase())
  );

  const handleEditar = (idUsuario) => {
    navigate(`/usuario-editar/${idUsuario}`);
  };

  const handleCambiarEstado = async (idUsuario, estado) => {

    let accion = "";
    let textoConfirmacion = "";

    if (estado === 0) {
      accion = "activar";
      textoConfirmacion = "Esta acción activará al usuario."

    } else if (estado === 1) {
      accion = "desactivar";
      textoConfirmacion = "Esta acción desactivará al usuario."
    }

    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: textoConfirmacion,
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn btn-danger rounded-5 me-3',
        cancelButton: 'btn btn-secondary rounded-5',
      },
      buttonsStyling: false,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        await axios.put(`${BASE_URL}/admin/cambiar-estado-usuario`,
          {
            idUsuario,
            isLocked: estado,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        Swal.fire(
          `${accion.charAt(0).toUpperCase() + accion.slice(1)}`,
          `El estado ha sido actualizado correctamente`,
          "success",
        );
        ObtenerUsuarios(); // Refrescar usuarios
      } catch (error) {
        if (error.response) {
          // Manejo de respuestas HTTP
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
            console.error(`Error al cambiar estado del usuario:`, error);
            Swal.fire("Error", `No se pudo cambiar estado del usuario`, "error");
          }
        } else {
          // Error si no se recibe una respuesta (problemas de red, por ejemplo)
          console.error("Error desconocido al cambiar estado del usuario:", error);
          Swal.fire("Error", `No se pudo cambiar estado del usuario`, "error");
        }
      }
    }
  };
  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  return (
    <div className="bg-darkest rounded-4" style={{ minHeight: "87vh" }}>
      <div className="mb-4 pt-4 px-4">
        <Row className="d-flex align-items-center">
          <Col>
            <input type="text" placeholder="Buscar usuario"
              value={FiltroUsuario}
              onChange={(e) => setFiltroUsuario(e.target.value)}
              className="form-control p-2 rounded-5"
              style={{ width: "250px" }} />
          </Col>
          <Col>
            <ModalAgregarUsuario />
          </Col>
        </Row>
      </div>
      <div className="px-2">
        <table className="table table-hover table-fluid">
          <thead>
            <tr>
              <th className="py-2 px-4">Nombre Usuario</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Cedula</th>
              <th className="py-2 px-4">Estado</th>
              <th className="py-2 px-4">Último cambio de contraseña</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {UsuariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-muted py-3">
                  {FiltroUsuario
                    ? "No se encontraron usuarios con ese nombre."
                    : "No hay usuarios registrados."}
                </td>
              </tr>
            ) : (
              UsuariosFiltrados.map((usuario) => (
                <tr key={usuario.idUsuario}>
                  <td className="py-2 px-4">{usuario.username}</td>
                  <td className="py-2 px-4">{usuario.email}</td>
                  <td className="py-2 px-4">{usuario.cedula}</td>
                  <td className="py-2 px-4">{usuario.isLocked ? "Bloqueado" : "Activo"}</td>
                  <td className="py-2 px-4">{usuario.lastPasswordChange ? new Date(usuario.lastPasswordChange).toLocaleDateString() : 'Ninguno'}</td>
                  <td className="py-2 px-4">
                    <div className="d-flex">
                      <button
                        className="btn btn-outline-warning rounded-5 text-white d-flex align-items-center justify-content-center gap-1 me-2"
                        onClick={() => handleEditar(usuario.idUsuario)}>
                        <MdModeEdit size="20" /> Editar</button>
                      {usuario.isLocked ? (
                        <button
                          className="btn btn-success rounded-5 d-flex align-items-center justify-content-center gap-1"
                          onClick={() => handleCambiarEstado(usuario.idUsuario, 0)}>
                          <IoIosRadioButtonOn size={20} />Activar
                        </button>
                      ) : (
                        <button
                          className="btn btn-danger rounded-5 d-flex align-items-center justify-content-center gap-1"
                          onClick={() => handleCambiarEstado(usuario.idUsuario, 1)}>
                          <IoIosRadioButtonOff size={20} /> Desactivar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListarUsuarios;
