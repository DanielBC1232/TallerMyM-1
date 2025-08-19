import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

//URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const TablaSolicitudes = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  // Obtener listado
  useEffect(() => {
    axios
      .get(`${BASE_URL}/inventario/solicitud`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT al header
        }
      })
      .then((response) => {
        setData(response.data);

      })
      .catch((error) => {
        if (error.response) {
          // Manejo de errores HTTP
          if (error.response.status === 401) {
            Swal.fire({
              icon: "warning",
              title: "Advertencia",
              text: "Operacion no Autorizada",
              showConfirmButton: false,
            });
            navigate(0); // Redirige si no está autorizado
          }
          else if (error.response.status === 403) {
            Swal.fire({
              icon: "warning",
              title: "Autenticación",
              text: "Sesión expirada",
              showConfirmButton: false,
            });
            localStorage.clear();
            navigate("/login"); // Redirige si la sesión ha expirado
          } else {
            console.error("Error fetching solicitudes:", error);
          }
        } else {
          console.error("Error desconocido:", error);
        }
      });
  }, []);

  //al dar al boton aprovar o rechazar trae el id del elemento mas el bool de true o false del boton
  //donde envia un post para hace un update put donde se cambie su estado de aprobado.
  const handleDecision = async (idSolicitud, aprobado) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/inventario/procesar-solicitud`,
        { idSolicitud, aprobado },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT en el header
          }
        }
      );
      console.log(response);
      Swal.fire({
        icon: "success",
        title: "Solicitud procesada correctamente",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      if (error.response) {
        // Manejo de respuestas HTTP
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
          Swal.fire({
            icon: "error",
            title: "Error al procesar la solicitud",
            text: error.message,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } else {
        // Error desconocido
        console.error("Error desconocido", error);
      }
    } finally {
      window.location.reload(); // Recargar la página al finalizar
    }

  };
  return (
    <>
      <div className="p-3 bg-darkest rounded-4" style={{ minHeight: "90vh" }}>
        <table className="table-hover">
          <thead>
            <tr className="">
              <th>Titulo</th>
              <th className="d-none d-xl-table-cell">Usuario</th>
              <th className="d-none d-xl-table-cell">Fecha</th>
              <th className="d-none d-md-table-cell">Detalle</th>
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((rowData) => (
                <tr key={rowData.idSolicitud}>
                  <td>{rowData.titulo}</td>
                  <td className="d-none d-md-table-cell">{rowData.usuario}</td>
                  <td className="d-none d-xl-table-cell">
                    <input
                      type="date"
                      style={{ maxWidth: "150px" }}
                      className="form-control rounded-5"
                      value={rowData.fecha ? rowData.fecha.split("T")[0] : ""}
                      readOnly
                    />
                  </td>
                  <td className="d-none d-md-table-cell">
                    {rowData.cuerpo}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success rounded-5"
                        onClick={() => handleDecision(rowData.idSolicitud, true)}>
                        Aprobar
                      </button>
                      <button
                        className="btn btn-danger rounded-5"
                        onClick={() => handleDecision(rowData.idSolicitud, false)}>
                        Rechazar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">Sin resultados</td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </>
  );
}

export default TablaSolicitudes;
