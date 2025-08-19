import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ModalAgregarCliente from "../components/ModalAgregarCliente";
import { BsPersonFillGear } from "react-icons/bs";
import { MdDelete } from "react-icons/md";

export const BASE_URL = import.meta.env.VITE_API_URL;

const IndexClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroCedula, setFiltroCedula] = useState("");
  const navigate = useNavigate();

  const obtenerClientes = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/clientes/obtener-clientes`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Añadir JWT en el header
          },
        }
      );
      setClientes(data);
      setError("");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "Operación no Autorizada",
            showConfirmButton: false,
          });
          window.location.reload(); // Recarga la página si no está autorizado
        } else if (error.response.status === 403) {
          Swal.fire({
            icon: "warning",
            title: "Autenticación",
            text: "Sesión expirada",
            showConfirmButton: false,
          });
          localStorage.clear();
          window.location.href = "/login"; // Redirige al login si la sesión ha expirado
        } else {
          console.error("Error al obtener clientes:", error);
          setError("Error al obtener clientes");
        }
      } else {
        // En caso de no recibir respuesta (error de red, etc.)
        console.error("Error de conexión:", error);
        setError("Error al obtener clientes");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  // Filtrar clientes por cédula
  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.cedula.includes(filtroCedula)
  );

  // Navegar a la pantalla de edición; se asume que al terminar la edición, la vista redirige a "/clientes/obtenerclientes"
  const handleEditar = (cedula) => {
    navigate(`/cliente-editar/${cedula}`);
  };

  // Confirmación de eliminación; al completar se navega a "/clientes/obtenerclientes"
  const handleEliminar = async (cedula) => {
    const confirmResult = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn btn-danger rounded-5 me-3',
        cancelButton: 'btn btn-secondary rounded-5'
      },
      buttonsStyling: false,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    });
    if (confirmResult.isConfirmed) {
      try {
        // Realizar la eliminación con JWT en el header
        await axios.delete(`${BASE_URL}/clientes/eliminar/${cedula}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Añadir JWT en los headers
          }
        });

        Swal.fire({
          icon: "success",
          title: "Cliente eliminado exitosamente",
          showConfirmButton: false,
          timer: 1500,
        });

        // Actualizar la lista de clientes
        obtenerClientes();
        navigate("/clientes");
      } catch (error) {
        console.error("Error al eliminar cliente:", error);

        // Manejo de errores según el código de respuesta
        if (error.response) {
          if (error.response.status === 401) {
            Swal.fire({
              icon: "warning",
              title: "Operación no autorizada",
              text: "No tienes permisos para realizar esta operación.",
              showConfirmButton: false,

            });
            window.location.reload(); // Recargar si la autorización es inválida
          } else if (error.response.status === 403) {
            Swal.fire({
              icon: "warning",
              title: "Sesión expirada",
              text: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
              showConfirmButton: false,

            });
            localStorage.clear();
            window.location.href = "/login"; // Redirigir al login si la sesión ha expirado
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo eliminar el cliente.",
              showConfirmButton: false,

            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error desconocido",
            text: "Hubo un error desconocido al eliminar el cliente.",
            showConfirmButton: false,

          });
        }
      }

    }
  };

  if (loading) return <p>Cargando clientes...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="rounded-4 bg-darkest" style={{ minHeight: "88vh" }}>
      <div className="p-4 d-flex justify-content-between align-items-center mb-3">
        <input type="text" name="cedula" placeholder="Numero de cédula" value={filtroCedula}
          onChange={(e) => setFiltroCedula(e.target.value)}
          className="form-control rounded-5 me-2 py-1" />
        <ModalAgregarCliente />
      </div>
      <div className="px-2">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Cédula</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map((cliente) => (
                <tr key={cliente.idCliente}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.apellido}</td>
                  <td>{cliente.cedula}</td>
                  <td>{cliente.correo}</td>
                  <td>{cliente.telefono}</td>
                  <td >
                    <div className="d-flex gap-2">
                      <button onClick={() => handleEliminar(cliente.cedula)}
                        className="btn btn-danger text-white rounded-5 d-flex align-items-center justify-content-center gap-1">
                        <MdDelete size={20} />
                      </button>
                      <button onClick={() => handleEditar(cliente.cedula)}
                        className="btn btn-outline-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1">
                        <BsPersonFillGear size={20} />Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  Sin resultados...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div >
  );
};

export default IndexClientes;
