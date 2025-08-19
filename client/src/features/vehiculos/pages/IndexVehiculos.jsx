import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import ModalAgregarVehiculo from "../components/ModalAgregarVehiculo";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const IndexVehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]); // Todos los vehículos
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(""); // Estado para manejar errores
  const [filtroPlaca, setFiltroPlaca] = useState(""); // Estado para el filtro de placa
  const navigate = useNavigate(); // Usamos el hook para redirigir

  // Función para obtener todos los vehículos
  const ObtenerVehiculos = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/vehiculos/ObtenerVehiculos`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT en el header
        }
      });
      setVehiculos(response.data); // Guardar los vehículos en el estado
      setError(""); // Limpiar el mensaje de error
    } catch (error) {
      if (error.response) {
        // Manejo de errores específicos de la respuesta HTTP
        if (error.response.status === 401) {
          Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "Operacion no Autorizada",
            showConfirmButton: false,
          });
          navigate(0); // Redirigir a la página de login si no está autorizado
        } else if (error.response.status === 403) {
          Swal.fire({
            icon: "warning",
            title: "Autenticación",
            text: "Sesión expirada",
            showConfirmButton: false,
          });
          localStorage.clear();
          navigate("/login"); // Redirigir a login si la sesión ha expirado
        } else {
          console.error("Error al obtener los vehículos:", error);
          setError("Error al obtener vehículos"); // Mostrar mensaje de error
        }
      } else {
        // Si no hay respuesta del servidor
        console.error(error);
        setError("Error al obtener vehículos"); // Mostrar mensaje de error
      }
    } finally {
      setLoading(false); // Finalizar la carga
    }

  };

  // Obtener vehículos al cargar el componente
  useEffect(() => {
    ObtenerVehiculos();
  }, []);

  // Filtrar vehículos por placa
  const vehiculosFiltrados = vehiculos.filter((vehiculo) =>
    vehiculo.placaVehiculo.toLowerCase().includes(filtroPlaca.toLowerCase())
  );

  // Mostrar mensaje de carga
  if (loading) {
    return <p>Cargando vehículos...</p>;
  }

  // Mostrar mensaje de error
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Función para eliminar un vehículo
  const handleEliminar = (idVehiculo) => {
    Swal.fire({
      title: '¿Estás seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-danger rounded-5 me-3',
        cancelButton: 'btn btn-secondary rounded-5'
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${BASE_URL}/vehiculos/eliminar/${idVehiculo}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT en el header
            }
          });
          Swal.fire('¡Eliminado!', 'El vehículo ha sido eliminado.', 'success');
          ObtenerVehiculos(); // Recargar la lista después de eliminar
        } catch (error) {
          if (error.response) {
            // Manejo de errores específicos de la respuesta HTTP
            if (error.response.status === 401) {
              Swal.fire({
                icon: "warning",
                title: "Advertencia",
                text: "Operación no Autorizada",
                showConfirmButton: false,
              });
              navigate(0); // Redirigir a la página de login si no está autorizado
            } else if (error.response.status === 403) {
              Swal.fire({
                icon: "warning",
                title: "Autenticación",
                text: "Sesión expirada",
                showConfirmButton: false,
              });
              localStorage.clear();
              navigate("/login"); // Redirigir a login si la sesión ha expirado
            } else {
              Swal.fire('Error', 'Hubo un problema al eliminar el vehículo', 'error'); // Error genérico
            }
          } else {
            // Si no hay respuesta del servidor
            Swal.fire('Error', 'Hubo un problema al eliminar el vehículo', 'error'); // Error genérico
          }
        }
      }
    });
  };

  // Redirigir al formulario de edición
  const handleEditar = (idVehiculo) => {
    navigate(`/vehiculo-editar/${idVehiculo}`);
  };

  return (
    <div className="rounded-4 bg-darkest" style={{ minHeight: "88vh" }}>
      {/* Campo de búsqueda por placa */}
      <div className="px-4 py-3 rounded-top-4 bg-header">

        <div className="d-flex gap-3 align-items-center">
          <input type="text" placeholder="Buscar por placa (ej: abc123)"
            value={filtroPlaca}
            onChange={(e) => setFiltroPlaca(e.target.value)}
            className="form-control rounded-5" />
          <ModalAgregarVehiculo />
        </div>
      </div>

      <div className="p-2">
        {/* Tabla de vehículos */}
        <table className="table table-hover">
          <thead>
            <tr>
              <th className="py-2 px-4">Placa</th>
              <th className="py-2 px-4">Modelo</th>
              <th className="py-2 px-4 ">Marca</th>
              <th className="py-2 px-4 ">Año</th>
              <th className="py-2 px-4 ">Tipo</th>
              <th className="py-2 px-4 ">Dueño</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vehiculosFiltrados.map((vehiculo) => (
              <tr key={vehiculo.idVehiculo}>
                <td className="py-2 px-4 ">{vehiculo.placaVehiculo}</td>
                <td className="py-2 px-4 ">{vehiculo.modeloVehiculo}</td>
                <td className="py-2 px-4 ">{vehiculo.marcaVehiculo}</td>
                <td className="py-2 px-4 ">{vehiculo.annoVehiculo}</td>
                <td className="py-2 px-4 ">{vehiculo.tipoVehiculo}</td>
                <td className="py-2 px-4 ">{vehiculo.nombreCliente}</td>
                <td className="py-2 px-4 ">
                  <div className="d-flex gap-3">
                    <button
                      onClick={() => handleEliminar(vehiculo.idVehiculo)}
                      className="btn btn-danger text-white rounded-5 d-flex align-items-center justify-content-center gap-1">
                      <MdDelete size={20} />
                    </button>
                    <button
                      onClick={() => handleEditar(vehiculo.idVehiculo)}
                      className="btn btn-outline-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1">
                      <MdEdit size={20} />Editar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mensaje si no hay coincidencias */}
      {vehiculosFiltrados.length === 0 && filtroPlaca && (
        <p className="text-red-500 mt-4">No se encontraron vehículos.</p>
      )}
    </div>
  );
};

export default IndexVehiculos;
