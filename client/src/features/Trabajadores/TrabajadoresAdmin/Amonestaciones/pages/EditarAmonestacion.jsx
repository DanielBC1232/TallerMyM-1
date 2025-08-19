import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Grid, Row, Col } from "rsuite";
import { IoIosReturnLeft } from "react-icons/io";
import { FaSave } from "react-icons/fa";

// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const EditarAmonestacion = () => {
  const navigate = useNavigate();
  const { idAmonestacion } = useParams();
  const [loading, setLoading] = useState(true);
  const [trabajadores, setTrabajadores] = useState([]);
  const [nombreTrabajadores, setNombreTrabajadores] = useState([]); //Nombre
  // Estado del formulario
  const [formData, setFormData] = useState({
    idTrabajador: "",
    fechaAmonestacion: "",
    tipoAmonestacion: "",
    motivo: "",
    accionTomada: "",
  });

  // Tipos de amonestación
  const tiposAmonestacion = ["Verbal", "Escrita", "Suspensión", "Despido"];



  //Funcion de buscar el inner
  // Funcion de buscar el inner
  useEffect(() => {
    axios
      .get(`${BASE_URL}/trabajadores/obtener-trabajadores`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setTrabajadores(res.data))
      .catch((error) => {
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
            console.error("Error cargando trabajadores", error);
            errorNotification("Error al cargar los trabajadores.");
          }
        } else {
          console.error("Error de red:", error);
          errorNotification("Problema de conexión con el servidor.");
        }
      });
  }, []);

  const errorNotification = (message) => {
    Swal.fire({
      text: message,
      icon: "error",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  //--

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        setLoading(true);

        if (idAmonestacion) {
          const resAmonestacion = await axios.get(
            `${BASE_URL}/trabajadores/obtenerAmonestacion/${idAmonestacion}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (resAmonestacion.data) {
            const amonestacion = resAmonestacion.data;
            setFormData({
              idTrabajador: amonestacion.idTrabajador.toString(),
              fechaAmonestacion: amonestacion.fechaAmonestacion.split("T")[0],
              tipoAmonestacion: amonestacion.tipoAmonestacion,
              motivo: amonestacion.motivo,
              accionTomada: amonestacion.accionTomada || "",
            });
          }
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
            console.error("Error al cargar datos:", error);
            mostrarError("Error al cargar los datos iniciales");
            navigate("/amonestaciones");
          }
        } else {
          console.error("Error de red:", error);
          mostrarError("Error de red al cargar datos");
          navigate("/amonestaciones");
        }
      } finally {
        setLoading(false);
      }
    };

    cargarDatosIniciales();
  }, [idAmonestacion, navigate]);

  // Mostrar error
  const mostrarError = (mensaje) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: mensaje,
    });
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validar formulario
  const validarFormulario = () => {
    if (!formData.idTrabajador) {
      mostrarError("Seleccione un trabajador");
      return false;
    }
    if (!formData.fechaAmonestacion) {
      mostrarError("Ingrese la fecha de amonestación");
      return false;
    }
    if (!formData.tipoAmonestacion) {
      mostrarError("Seleccione el tipo de amonestación");
      return false;
    }
    if (!formData.motivo.trim()) {
      mostrarError("Ingrese el motivo de la amonestación");
      return false;
    }
    return true;
  };

  // Enviar formulario-------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      setLoading(true);

      // Preparar datos para enviar
      const datosActualizados = {
        idTrabajador: parseInt(formData.idTrabajador, 10),
        fechaAmonestacion: new Date(formData.fechaAmonestacion).toISOString(),
        tipoAmonestacion: formData.tipoAmonestacion,
        motivo: formData.motivo,
        accionTomada: formData.accionTomada || null,
      };

      // Enviar actualización con headers para autorización
      const response = await axios.put(
        `${BASE_URL}/trabajadores/Edit-Amonestacion/${idAmonestacion}`,
        datosActualizados,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Añadir el token en el header
          },
        }
      );

      // Mostrar éxito
      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "La amonestación se actualizó correctamente",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate("/amonestaciones-lista");
      });
    } catch (error) {
      console.error("Error al actualizar:", error);

      let mensajeError = "Error al actualizar la amonestación";
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
          if (error.response.data?.error) {
            mensajeError = error.response.data.error;
          } else if (error.response.data?.message) {
            mensajeError = error.response.data.message;
          }
          Swal.fire({
            icon: "error",
            title: "Error",
            text: mensajeError,
            showConfirmButton: false,
          });
        }
      } else {
        // Manejo de errores de red (conexión, etc.)
        console.error("Error de red:", error);
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "Hubo un problema con la conexión al servidor",
          showConfirmButton: false,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Enviar formulario-------------

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-darkest rounded-4 p-4 mx-auto mt-5 shadow" style={{ height: "50vh", width: "80vh" }}>
      <h3 className="text-white text-center">Editar amonestación</h3>
      <hr className="text-success" />
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <Row className="d-flex gap-4">

            <Col xs={12} className="">

              {/*Select Inner*/}
              <div className="mb-3">
                <label htmlFor="idTrabajador" className="form-label text-white">
                  Empleado:
                </label>
                <select
                  className="form-control rounded-5"
                  id="idTrabajador"
                  name="idTrabajador"
                  value={formData.idTrabajador}
                  onChange={handleChange}
                  required>
                  <option value="">Seleccione un trabajador</option>
                  {trabajadores.map((trabajador) => (
                    <option
                      key={trabajador.idTrabajador}
                      value={trabajador.idTrabajador}>
                      {trabajador.nombreCompleto}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="fechaAmonestacion" className="form-label text-white">
                  Fecha de Amonestación *
                </label>
                <input
                  type="date"
                  className="form-control rounded-5"
                  id="fechaAmonestacion"
                  name="fechaAmonestacion"
                  value={formData.fechaAmonestacion}
                  onChange={handleChange}
                  required
                  disabled={loading} />
              </div>

              <div className="mb-3">
                <label htmlFor="tipoAmonestacion" className="form-label text-white">
                  Tipo de Amonestación:
                </label>
                <select
                  className="form-select rounded-5"
                  id="tipoAmonestacion"
                  name="tipoAmonestacion"
                  value={formData.tipoAmonestacion}
                  onChange={handleChange}
                  required
                  disabled={loading}>
                  <option value="">Seleccione un tipo</option>
                  {tiposAmonestacion.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
            </Col>

            <Col xs={24} md={12}>
              <div className="mb-3">
                <label htmlFor="motivo" className="form-label text-white">
                  Motivo:
                </label>
                <textarea
                  className="form-control rounded-4"
                  id="motivo"
                  name="motivo"
                  rows="3"
                  value={formData.motivo}
                  onChange={handleChange}
                  required
                  disabled={loading} />
              </div>

              <div className="mb-3">
                <label htmlFor="accionTomada" className="form-label text-white">
                  Acción a tomadar:
                </label>
                <textarea
                  className="form-control rounded-4"
                  id="accionTomada"
                  name="accionTomada"
                  rows="3"
                  value={formData.accionTomada}
                  onChange={handleChange}
                  disabled={loading} />
              </div>
            </Col>
          </Row>

          <div className="d-flex justify-content-between px-4 gap-2 mt-4">
            <button
              type="button"
              className="btn btn-secondary text-white rounded-5 d-flex align-items-center justify-content-center gap-1"
              onClick={() => navigate("/amonestaciones-lista")}
              disabled={loading}>
              Cancelar
            </button>

            <button type="submit" className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1"><FaSave size={20} />Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarAmonestacion;
