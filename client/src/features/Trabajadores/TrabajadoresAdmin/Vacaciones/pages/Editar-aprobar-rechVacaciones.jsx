import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { FaSave } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

export const BASE_URL = import.meta.env.VITE_API_URL;

const EditarVacaciones = () => {
  const navigate = useNavigate();
  const { idVacaciones } = useParams();
  const [loading, setLoading] = useState(true);

  const [trabajadores, setTrabajadores] = useState([]);
  const [formData, setFormData] = useState({
    solicitud: "",
    fechaInicio: "",
    fechaFin: "",
    motivoRechazo: "",
    idTrabajador: ""
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        const authConfig = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        };

        const [resTrabajadores, resVacacion] = await Promise.all([
          axios.get(`${BASE_URL}/trabajadores/obtener-trabajadores`, authConfig),
          idVacaciones && axios.get(`${BASE_URL}/trabajadores/obtenerSolicitudVacacion/${idVacaciones}`, authConfig)
        ]);

        setTrabajadores(resTrabajadores.data);

        if (resVacacion?.data) {
          const vacacion = resVacacion.data;
          setFormData({
            solicitud: vacacion.solicitud || "",
            fechaInicio: vacacion.fechaInicio?.split("T")[0] || "",
            fechaFin: vacacion.fechaFin?.split("T")[0] || "",
            motivoRechazo: vacacion.motivoRechazo || "",
            idTrabajador: vacacion.idTrabajador?.toString() || ""
          });
        }

      } catch (error) {
        console.error("Error al cargar datos:", error);

        if (error.response) {
          const { status } = error.response;

          if (status === 401) {
            Swal.fire("Sesión expirada", "Por favor inicie sesión nuevamente", "warning");
            localStorage.removeItem("token");
            window.location.href = "/login";
            return;
          } else if (status === 403) {
            Swal.fire("Acceso denegado", "No tiene permisos para esta acción", "error");
            return;
          }
        }

        Swal.fire("Error", "No se pudieron cargar los datos", "error");
        navigate("/Vacaciones-Index");

      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [idVacaciones, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Preparar datos con formato correcto
      const datosActualizados = {
        ...formData,
        fechaInicio: new Date(formData.fechaInicio).toISOString(),
        fechaFin: new Date(formData.fechaFin).toISOString(),
        // Asegurar que idTrabajador sea número si es necesario
        idTrabajador: Number(formData.idTrabajador)
      };

      // Configuración de la petición con autenticación
      const response = await axios.put(
        `${BASE_URL}/trabajadores/Edit-Vacaciones/${idVacaciones}`,
        datosActualizados,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      // Mostrar confirmación y redirigir
      await Swal.fire({
        title: "¡Éxito!",
        text: "Solicitud de vacaciones actualizada correctamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });

      navigate("/Vacaciones-Index");

    } catch (error) {
      console.error("Error al actualizar vacaciones:", error);

      // Manejo específico de errores
      let errorMessage = "Error al actualizar la solicitud";

      if (error.response) {
        // Errores de autenticación
        if (error.response.status === 401) {
          Swal.fire("Sesión expirada", "Por favor inicie sesión nuevamente", "warning");
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        // Otros errores del servidor
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      await Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        showConfirmButton: false,
      });

    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async () => {
    try {
      setLoading(true); // Activar estado de carga

      // Petición con autenticación
      await axios.put(
        `${BASE_URL}/trabajadores/Aprob-Vacaciones/${idVacaciones}`,
        {}, // Cuerpo vacío ya que es una aprobación simple
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      // Feedback al usuario
      await Swal.fire({
        title: "¡Aprobada!",
        text: "La solicitud de vacaciones ha sido aprobada",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });

      // Redirección
      navigate("/Vacaciones-Index");

    } catch (error) {
      console.error("Error al aprobar vacaciones:", error);

      // Manejo específico de errores
      let errorMessage = "Error al aprobar la solicitud";

      if (error.response) {
        // Error de autenticación
        if (error.response.status === 401) {
          Swal.fire("Sesión expirada", "Por favor inicie sesión nuevamente", "warning");
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        // Usar mensaje del servidor si está disponible
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      await Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        showConfirmButton: false,

      });

    } finally {
      setLoading(false); // Desactivar estado de carga
    }
  };

  const handleRechazar = async () => {
    // Validación del motivo de rechazo
    if (!formData.motivoRechazo?.trim()) {
      await Swal.fire({
        title: "Motivo requerido",
        text: "Debe ingresar un motivo de rechazo válido",
        icon: "warning",
        showConfirmButton: false,

      });
      return;
    }

    try {
      setLoading(true); // Activar estado de carga

      // Preparar datos para el rechazo
      const datosRechazo = {
        motivoRechazo: formData.motivoRechazo.trim(),
        // Incluir otros campos necesarios según tu API
        idVacaciones: idVacaciones,
        idTrabajador: formData.idTrabajador
      };

      // Petición con autenticación
      const response = await axios.put(
        `${BASE_URL}/trabajadores/Rechazar-Vacaciones/${idVacaciones}`,
        datosRechazo,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      // Log para desarrollo (opcional)
      console.log("Respuesta del servidor:", response.data);

      // Feedback al usuario
      await Swal.fire({
        title: "¡Rechazada!",
        text: "La solicitud de vacaciones ha sido rechazada",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });

      // Redirección
      navigate("/Vacaciones-Index");

    } catch (error) {
      console.error("Error al rechazar vacaciones:", error);

      // Manejo específico de errores
      let errorMessage = "Error al rechazar la solicitud";

      if (error.response) {
        // Error de autenticación
        if (error.response.status === 401) {
          await Swal.fire("Sesión expirada", "Por favor inicie sesión nuevamente", "warning");
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        // Usar mensaje del servidor si está disponible
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      await Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        showConfirmButton: false,

      });

    } finally {
      setLoading(false); // Desactivar estado de carga
    }
  };

  return (
    <div className="container mt-5 rounded-4">
      <div className="card shadow">
        <div className="card-header bg-success text-white">
          <h2 className="mb-0 text-white">Editar Solicitud de Vacaciones</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>

            <div className="row px-4">

              <div className="col col-6">

                <div className="mb-3">
                  <label htmlFor="solicitud" className="form-label">Solicitud</label>
                  <input
                    type="text"
                    className="form-control rounded-5"
                    id="solicitud"
                    name="solicitud"
                    value={formData.solicitud}
                    onChange={handleChange} />
                </div>

                <div className="mb-3">
                  <label htmlFor="fechaInicio" className="form-label">Fecha de Inicio</label>
                  <input
                    readOnly
                    type="date"
                    className="form-control rounded-5"
                    id="fechaInicio"
                    name="fechaInicio"
                    min={new Date().toISOString().split("T")[0]} // Asegura que la fecha no sea anterior a hoy
                    value={formData.fechaInicio}
                    onChange={handleChange} />
                </div>

                <div className="mb-3">
                  <label htmlFor="fechaFin" className="form-label">Fecha de Fin</label>
                  <input
                    readOnly
                    type="date"
                    className="form-control rounded-5"
                    id="fechaFin"
                    name="fechaFin"
                    value={formData.fechaFin}
                    min={formData.fechaInicio || new Date().toISOString().split("T")[0]} // Asegura que la fecha de fin no sea anterior a la de inicio
                    max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0]} // Asegura que la fecha de fin no sea más de un año en el futuro
                    onChange={handleChange} />
                </div>
              </div>
              <div className="col col-6">
                <div className="mb-3">
                  <label htmlFor="motivoRechazo" className="form-label">Motivo de Rechazo (si aplica)</label>
                  <textarea
                    className="form-control rounded-4"
                    id="motivoRechazo"
                    name="motivoRechazo"
                    value={formData.motivoRechazo}
                    onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between mx-4 mt-5">
              <button type="button" className="btn btn-secondary text-white rounded-5 d-flex align-items-center justify-content-center gap-1" onClick={() => navigate("/Vacaciones-Index")}>
                Cancelar
              </button>
              <button type="button" className="btn btn-danger text-white rounded-5 d-flex align-items-center justify-content-center gap-1" onClick={handleRechazar}><RxCross2 size={20} />Rechazar</button>
              <button type="button" className="btn btn-primary text-white rounded-5 d-flex align-items-center justify-content-center gap-1" onClick={handleAprobar}><FaCheck size={20} />Aprobar</button>
              <button type="submit" className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1"><FaSave size={20} />Guardar Cambios</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarVacaciones;
