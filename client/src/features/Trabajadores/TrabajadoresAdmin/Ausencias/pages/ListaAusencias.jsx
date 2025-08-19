import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { IoIosReturnLeft } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const ListaAusencias = ({ formData, trigger }) => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAusencias = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${BASE_URL}/trabajadores/obtener-ausencias`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDatos(data);
      } catch (error) {
        console.error("Error al obtener datos:", error);

        if (error.response) {
          const { status } = error.response;

          if (status === 401) {
            Swal.fire("Advertencia", "Operación no autorizada", "warning");
            window.location.reload();
            return;
          } else if (status === 403) {
            Swal.fire("Autenticación", "Sesión expirada", "warning");
            localStorage.clear();
            window.location.href = "/login";
            return;
          }
        }

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar las ausencias",
          showConfirmButton: false,
        });
      } finally {
        setLoading(false);
      }
    };

    getAusencias();
  }, [formData, trigger]);

  // Función para formatear fecha
  const formatFecha = (fechaString) => {
    if (!fechaString) return "-";
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString("es-ES");
  };

  // Función para mostrar estado de justificación
  const getEstadoJustificacion = (justificada) => {
    return justificada ? "Justificada" : "No justificada";
  };

  // Función para eliminar ausencia
  const deleteAusencia = (idAusencia) => {
    Swal.fire({
      title: "¿Confirmar eliminación?",
      text: "¿Estás seguro de eliminar esta ausencia?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: 'btn btn-danger rounded-5 me-3',
        cancelButton: 'btn btn-secondary rounded-5'
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        const response = await axios.delete(
          `${BASE_URL}/trabajadores/delete-ausencia/${idAusencia}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        if (response.status === 200) {
          await Swal.fire({
            icon: "success",
            title: "Eliminada",
            text: "La ausencia fue eliminada correctamente",
            showConfirmButton: false,
            timer: 1500
          });

          // Actualizar el estado eliminando el registro
          setDatos(datos.filter(ausencia => ausencia.idAusencia !== idAusencia));
        }
      } catch (error) {
        console.error("Error al eliminar:", error);

        if (error.response) {
          const { status } = error.response;

          if (status === 401) {
            Swal.fire("Advertencia", "Operación no autorizada", "warning");
            window.location.reload();
            return;
          } else if (status === 403) {
            Swal.fire("Autenticación", "Sesión expirada", "warning");
            localStorage.clear();
            window.location.href = "/login";
            return;
          }
        }

        await Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "No se pudo eliminar la ausencia",
          showConfirmButton: false
        });
      }
    });
  };

  if (loading) {
    return <div className="p-5 text-center">Cargando ausencias...</div>;
  }

  return (
    <div className="p-4 bg-darkest rounded-4 shadow-sm" style={{ minHeight: "88vh" }}>
      <h4 className="text-center text-success">Lista de ausencias</h4>
      <hr className="text-success" />
      <Link to={`/Ausencias-Index`} className="btn btn-secondary my-2 text-white rounded-5 d-flex align-items-center justify-content-center gap-1"
        style={{ width: "120px" }}><IoIosReturnLeft size={25} />Regresar
      </Link>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Trabajador</th>
            <th>Fecha Ausencia</th>
            <th>Estado</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((ausencia) => (
            <tr key={ausencia.idAusencia}>
              <td>{ausencia.nombreTrabajador}</td>
              <td>{formatFecha(ausencia.fechaAusencia)}</td>
              <td>
                <span className={`badge ${ausencia.justificada ? 'bg-success' : 'bg-warning'}`}>
                  {getEstadoJustificacion(ausencia.justificada)}
                </span>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <button onClick={() => deleteAusencia(ausencia.idAusencia)}
                    className="btn btn-danger text-white rounded-5 d-flex align-items-center justify-content-center gap-1"
                  ><MdDelete size={20} />
                  </button>
                  <Link
                    to={`/ausencias-editar/${ausencia.idAusencia}`}
                    className="btn btn-outline-warning text-white rounded-5 d-flex align-items-center justify-content-center gap-1"
                  ><MdEdit size={20} />Editar
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>

  );
};

export default ListaAusencias;