import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import { IoIosReturnLeft } from "react-icons/io";

export const BASE_URL = import.meta.env.VITE_API_URL;
const ListarGestVacaciones = () => {
  const [vacaciones, setVacaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroTrabajador, setfiltroTrabajador] = useState("");
  const navigate = useNavigate();

  const obtenervacaciones = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${BASE_URL}/trabajadores/obtenerSolicitudVacaciones`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setVacaciones(response.data);

    } catch (error) {
      console.error("Error al obtener vacaciones:", error);

      // Manejo específico de errores de autenticación
      if (error.response?.status === 401) {
        Swal.fire("Sesión expirada", "Por favor inicie sesión nuevamente", "warning");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      // Manejo de otros errores
      const errorMessage = error.response?.data?.message || "Error al obtener las solicitudes de vacaciones";
      setError(errorMessage);
      Swal.fire("Error", errorMessage, "error");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenervacaciones();
  }, []);

  const vacacionesFiltrados = vacaciones.filter(
    (vacacion) =>
      vacacion.idTrabajador &&
      String(vacacion.idTrabajador).includes(filtroTrabajador)
  );

  const handleAprobar = (idVacaciones) => {
    navigate(`/EditarVacaciones/${idVacaciones}`);
  };

  return (
    <div className="p-4 bg-darkest rounded-4" style={{ minHeight: "88vh" }}>
      <h4 className="text-center text-primary">Lista de vacaciones</h4>
      <hr className="text-primary mt-3" />
      <div className="mb-3">
        <Link to="/trabajadores-admin" className="btn btn-secondary text-white rounded-5 d-flex align-items-bottom justify-content-center gap-1" style={{ width: "100px" }}>
          <IoIosReturnLeft size={25} />Volver
        </Link>
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th className="py-2 px-4 ">Empleado</th>
            <th className="py-2 px-4 ">Solicitud</th>
            <th className="py-2 px-4 ">Fecha Inicio</th>
            <th className="py-2 px-4 ">Fecha Fin</th>
            <th className="py-2 px-4 ">Motivo de Rechazo</th>
            <th className="py-2 px-4 ">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vacacionesFiltrados.map((vacacion) => (
            <tr key={`${vacacion.idVacaciones}-${vacacion.idTrabajador}`}>

              <td className="py-2 px-4 ">{vacacion.nombreTrabajador}</td>
              <td className="py-2 px-4 ">{vacacion.solicitud}</td>
              <td className="py-2 px-4 ">
                {new Date(vacacion.fechaInicio).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 ">
                {new Date(vacacion.fechaFin).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 ">{vacacion.motivoRechazo}</td>
              <td className="py-2 px-4 ">
                <button onClick={() => handleAprobar(vacacion.idVacaciones)}
                  className="btn btn-primary text-white rounded-5 d-flex align-items-bottom justify-content-center gap-1">
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListarGestVacaciones;
