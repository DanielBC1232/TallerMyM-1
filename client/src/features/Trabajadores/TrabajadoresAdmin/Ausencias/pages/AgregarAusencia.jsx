import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaSave } from "react-icons/fa";
import { IoIosReturnLeft } from "react-icons/io";

// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const AgregarAusencia = () => {
  const navigate = useNavigate();
  const { idTrabajador } = useParams();
  const [nombreTrabajador, setNombreTrabajador] = useState("");

  const [formData, setFormData] = useState({
    idTrabajador: idTrabajador,
    fechaAusencia: "",
    justificada: false,
  });

  //Funcion buscar nombre Trabajador
  useEffect(() => {
    const obtenerTrabajador = async () => {
      if (formData.idTrabajador) {
        try {
          const { data } = await axios.get(
            `${BASE_URL}/trabajadores/obtener-trabajador/${formData.idTrabajador}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            }
          );

          setNombreTrabajador(data.nombreCompleto);

        } catch (error) {
          console.error("Error al obtener trabajador:", error);

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
              Swal.fire("Error", "No se pudo obtener la información del trabajador", "error");
            }
          } else {
            Swal.fire("Error", "Problema de conexión con el servidor", "error");
          }
        }
      }
    };

    obtenerTrabajador();
  }, [formData.idTrabajador]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const errorNotification = (message) => {
    Swal.fire({
      text: message,
      icon: "error",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const validarFormulario = () => {
    if (!formData.idTrabajador) {
      errorNotification("El ID del trabajador es requerido");
      return false;
    }
    if (!formData.fechaAusencia) {
      errorNotification("La fecha de ausencia es requerida");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Formulario Ausencias", formData);

    if (!validarFormulario()) return;

    try {
      const response = await axios.post(
        `${BASE_URL}/trabajadores/insert-ausencia`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      await Swal.fire({
        icon: "success",
        title: "Ausencia registrada correctamente",
        showConfirmButton: false,
        timer: 1500
      });

      navigate("/Ausencias-Index");

    } catch (error) {
      console.error("Error al registrar ausencia:", error);

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
        title: "Error al registrar ausencia",
        text: error.response?.data?.message || "Por favor intente nuevamente",
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="p-4 bg-darkest rounded-4 shadow-sm mx-auto mt-5" style={{width: "50vh"}}>
      <form onSubmit={handleSubmit}>
        <h4 className="text-center text-success">Registrar Ausencia</h4>
        <hr className="text-success" />
        <div className="px-4">
          <div className="mb-4">
            <label htmlFor="idTrabajador" className="form-label text-white">
              Empleado:
            </label>
            <input
              type="text"
              className="form-control rounded-5"
              value={nombreTrabajador}
              readOnly />
          </div>

          <div className="mb-4">
            <label htmlFor="fechaAusencia" className="form-label text-white">
              Fecha de Ausencia:
            </label>
            <input
              type="date"
              className="form-control rounded-5"
              id="fechaAusencia"
              name="fechaAusencia"
              value={formData.fechaAusencia}
              onChange={handleChange}
              required />
          </div>

          <div className="mb-4 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="justificada"
              name="justificada"
              checked={formData.justificada}
              onChange={handleChange}
            />
            <label className="form-check-label text-white" htmlFor="justificada">
              Justificada
            </label>
          </div>
        </div>
        <div className="d-flex gap-3 justify-content-between px-5">
          <a href="/Ausencias-Index"
            className="btn btn-secondary text-white rounded-5 d-flex align-items-center justify-content-center gap-1">
            <IoIosReturnLeft size={25} />Regresar
          </a>
          <button
            type="submit"
            className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1">
            <FaSave size={20} />Guadar
          </button>
        </div>
      </form>
    </div>
  );

};

export default AgregarAusencia;
