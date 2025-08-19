import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

//URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const ListarVehiculos = () => {
  const navigate = useNavigate();
  const [vehiculos, setVehiculos] = useState([]); // Todos los vehículos
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(""); // Estado para manejar errores
  const [filtroPlaca, setFiltroPlaca] = useState(""); // Estado para el filtro de placa

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
        } else {
          console.error("Error al obtener vehículos:", error);
          setError("Error al obtener vehículos"); // Mostrar mensaje de error genérico
        }
      } else {
        // Manejo de errores si no hay respuesta del servidor
        console.error("Error desconocido", error);
        setError("Error al obtener vehículos"); // Mostrar mensaje de error genérico
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
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Vehículos</h1>

      {/* Campo de búsqueda por placa */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por placa (ej: abc123)"
          value={filtroPlaca}
          onChange={(e) => setFiltroPlaca(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Tabla de vehículos */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Placa</th>
            <th className="py-2 px-4 border">Modelo</th>
            <th className="py-2 px-4 border">Marca</th>
            <th className="py-2 px-4 border">Año</th>
            <th className="py-2 px-4 border">Tipo</th>
            <th className="py-2 px-4 border">ID Cliente</th>
          </tr>
        </thead>
        <tbody>
          {vehiculosFiltrados.map((vehiculo) => (
            <tr key={vehiculo.idVehiculo}>
              <td className="py-2 px-4 border">{vehiculo.placaVehiculo}</td>
              <td className="py-2 px-4 border">{vehiculo.modeloVehiculo}</td>
              <td className="py-2 px-4 border">{vehiculo.marcaVehiculo}</td>
              <td className="py-2 px-4 border">{vehiculo.annoVehiculo}</td>
              <td className="py-2 px-4 border">{vehiculo.tipoVehiculo}</td>
              <td className="py-2 px-4 border">{vehiculo.idCliente}</td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* Mensaje si no hay coincidencias */}
      {vehiculosFiltrados.length === 0 && filtroPlaca && (
        <p className="text-danger mt-4">No se encontraron vehículos con esa placa.</p>
      )}
    </div>
  );
};

export default ListarVehiculos;