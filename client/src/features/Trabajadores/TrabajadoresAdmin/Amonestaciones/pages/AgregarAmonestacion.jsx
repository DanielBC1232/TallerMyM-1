import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {  Row, Col } from "rsuite";
import { IoIosReturnLeft } from "react-icons/io";
import { FaSave } from "react-icons/fa";

// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;
const AgregarAmonestacion = () => {
  const navigate = useNavigate();
  const { idTrabajador } = useParams(); // Obtener el ID del trabajador desde los parámetros de la URL
  //Nombre Trabajador
  const [nombreTrabajador, setNombreTrabajador] = useState("");
  //--
  const [formData, setFormData] = useState({
    idTrabajador: idTrabajador,
    fechaAmonestacion: "",
    tipoAmonestacion: "",
    motivo: "",
    accionTomada: "",
  });

  //Funcion buscar nombre Trabajador
  useEffect(() => {
    if (formData.idTrabajador) {
      axios
        .get(
          `${BASE_URL}/trabajadores/obtener-trabajador/${formData.idTrabajador}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setNombreTrabajador(res.data.nombreCompleto);
        })
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
            } else if (status === 404) {
              Swal.fire("Error", "Trabajador no encontrado", "error");
            } else {
              console.error("Error al obtener trabajador", error);
              Swal.fire("Error", "Hubo un error al obtener el trabajador", "error");
            }
          } else {
            console.error("Error de red:", error);
            Swal.fire("Error", "Problema de conexión con el servidor", "error");
          }
        });
    }
  }, [formData.idTrabajador]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validarFormulario()) {
      try {
        console.log(formData);
        const response = await axios.post(
          `${BASE_URL}/trabajadores/Insert-Amonestacion`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          Swal.fire({
            icon: "success",
            title: "Amonestación agregada correctamente",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            navigate("/index-amonestaciones");
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "No se pudo guardar la amonestación",
            showConfirmButton: false,
          });
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
          } else if (status === 400) {
            Swal.fire("Error", "Datos inválidos o incompletos", "error");
          } else {
            console.error("Error al guardar amonestación:", error);
            Swal.fire("Error", "Error al guardar amonestación", "error");
          }
        } else {
          console.error("Error de red:", error);
          Swal.fire("Error", "Problema de conexión con el servidor", "error");
        }
      }
    }
  };

  const validarFormulario = () => {
    if (!formData.idTrabajador) {
      errorNotification("El ID del trabajador es requerido");
      return false;
    }
    if (!formData.fechaAmonestacion) {
      errorNotification("La fecha de amonestación es requerida");
      return false;
    }
    if (!formData.tipoAmonestacion) {
      errorNotification("El tipo de amonestación es requerido");
      return false;
    }
    if (!formData.motivo.trim()) {
      errorNotification("El motivo es requerido");
      return false;
    }
    return true;
  };

  const tiposAmonestacion = ["Verbal", "Escrita", "Suspensión", "Despido"];

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-darkest rounded-4 p-4 mx-auto mt-5 shadow" style={{ minHeight: "50vh", width: "80vh" }}>
        <h3 className="text-white text-center">Nueva amonestación</h3>
        <hr className="text-success" />
        <Row className="d-flex gap-4">
          <Col xs={12} className="">
            {/*Select Inner*/}
            <div className="mb-3">
              <label htmlFor="idTrabajador" className="form-label text-white">
                Empleado:
              </label>
              <input
                type="text"
                className="form-control rounded-5"
                value={nombreTrabajador}
                readOnly />
            </div>

            <div className="mb-3">
              <label htmlFor="fechaAmonestacion" className="form-label text-white">
                Fecha de Amonestación:
              </label>
              <input
                type="date"
                className="form-control rounded-5"
                id="fechaAmonestacion"
                name="fechaAmonestacion"
                value={formData.fechaAmonestacion}
                onChange={handleChange}
                required />
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
                required>
                <option value="">Seleccione un tipo</option>
                {tiposAmonestacion.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
          </Col>

          <Col xs={12}>
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
                required />
            </div>

            <div className="mb-3">
              <label htmlFor="accionTomada" className="form-label text-white">
                Acción a tomar:
              </label>
              <textarea
                className="form-control rounded-4"
                id="accionTomada"
                name="accionTomada"
                rows="3"
                value={formData.accionTomada}
                onChange={handleChange} />
            </div>

          </Col>
        </Row>
            <div className="mt-5 d-flex justify-content-between px-4">
              <button
                type="button"
                className="btn btn-secondary text-white rounded-5 d-flex align-items-center justify-content-center gap-1"
                onClick={() => navigate("/index-amonestaciones")}>
                <IoIosReturnLeft size={20}/>Volver
              </button>
              <button type="submit" className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1">
              <FaSave size={20} />Guardar
              </button>
            </div>
      </div>
    </form>
  );
};

export default AgregarAmonestacion;
