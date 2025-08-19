import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const ListaAmonestaciones = ({ formData, trigger }) => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nombreTrabajador, setNombreTrabajador] = useState(""); // Cambié a string vacío

  //Funcion buscar nombre Trabajador
  useEffect(() => {
    if (formData && formData.idTrabajador) {
      axios
        .get(`${BASE_URL}/trabajadores/obtener-trabajadores`) // Corregí la URL
        .then((res) => {
          setNombreTrabajador(res.data.nombreCompleto);
        })
        .catch((error) => {
          console.error("Error al obtener trabajador", error);
        });
    }
  }, [formData?.idTrabajador]); // Optimización de dependencias

  useEffect(() => {
    const getAmonestaciones = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${BASE_URL}/trabajadores/obtenerAmonestaciones`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDatos(data);
      } catch (error) {
        if (error.response) {
          const { status } = error.response;

          if (status === 401) {
            Swal.fire("Advertencia", "Operación no autorizada", "warning");
            window.location.reload();
          } else if (status === 403) {
            Swal.fire("Autenticación", "Sesión expirada", "warning");
            localStorage.clear();
            window.location.href = "/login";
          } else {
            console.error("Error al obtener amonestaciones:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudieron cargar las amonestaciones",
              showConfirmButton: false,
            });
          }
        } else {
          console.error("Error de red:", error);
          Swal.fire("Error", "Problema de conexión con el servidor", "error");
        }
      } finally {
        setLoading(false);
      }
    };

    getAmonestaciones();
  }, [formData, trigger]);


  const formatFecha = (fechaString) => {
    if (!fechaString) return "-";
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString("es-ES");
  };

  const deleteAmonestacion = (idAmonestacion) => {
    Swal.fire({
      title: "¿Confirmar eliminación?",
      text: "¿Estás seguro de eliminar esta amonestación?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${BASE_URL}/trabajadores/Elim-Amonestacion/${idAmonestacion}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Eliminada",
              text: "La amonestación fue eliminada correctamente",
              showConfirmButton: false,
              timer: 1500,
            });
            setDatos(
              datos.filter(
                (amonestacion) => amonestacion.idAmonestacion !== idAmonestacion
              )
            );
          }
        } catch (error) {
          if (error.response) {
            const { status } = error.response;

            if (status === 401) {
              Swal.fire("Advertencia", "Operación no autorizada", "warning");
              window.location.reload();
            } else if (status === 403) {
              Swal.fire("Autenticación", "Sesión expirada", "warning");
              localStorage.clear();
              window.location.href = "/login";
            } else {
              console.error("Error al eliminar:", error);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo eliminar la amonestación",
                showConfirmButton: true,
              });
            }
          } else {
            console.error("Error de red:", error);
            Swal.fire("Error", "Problema de conexión con el servidor", "error");
          }
        }
      }
    });
  };
  if (loading) {
    return <div className="p-5 text-center">Cargando amonestaciones...</div>;
  }

  return (
    <div className="p-4 bg-darkest rounded-4" style={{minHeight: "88vh"}}>
      <h2 className="text-white">Historial de Amonestaciones</h2>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Trabajador</th>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Motivo</th>
            <th>Acción</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((amonestacion) => (
            <tr key={amonestacion.idAmonestacion}>
              <td>{amonestacion.idAmonestacion}</td>
              <td>{amonestacion.nombreTrabajador}</td>{" "}
              {/* Usando nombreTrabajador si amonestacion no lo tiene */}
              <td>{formatFecha(amonestacion.fechaAmonestacion)}</td>
              <td>{amonestacion.tipoAmonestacion}</td>
              <td>{amonestacion.motivo}</td>
              <td>{amonestacion.accionTomada || "-"}</td>
              <td>
                <div className="d-flex gap-2">
                  <button onClick={() =>
                    deleteAmonestacion(amonestacion.idAmonestacion)
                  } className="btn btn-danger text-white rounded-5 d-flex align-items-center justify-content-center gap-1">
                    <MdDelete size={20} />
                  </button>
                  <Link
                    to={`/amonestaciones-editar/${amonestacion.idAmonestacion}`}
                    className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1">
                    <MdEdit size={20} />Editar
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

export default ListaAmonestaciones;
