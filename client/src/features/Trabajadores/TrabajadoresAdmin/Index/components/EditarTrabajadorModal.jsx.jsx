import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

// URL base
const BASE_URL = import.meta.env.VITE_API_URL;

const EditarTrabajadorModal = ({ show, onClose, trabajador, onSave }) => {
  const [formData, setFormData] = useState({ ...trabajador });
  const [trabajadoresExistentes, setTrabajadoresExistentes] = useState([]);
  const navigate = useNavigate();

  // Cargar trabajadores existentes para el select
  useEffect(() => {
    const fetchTrabajadores = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/trabajadores/obtener-trabajadores/`);
        setTrabajadoresExistentes(data);
      } catch (error) {
        console.error("Error al cargar trabajadores:", error);
      }
    };
    fetchTrabajadores();
  }, []);

  // Si cambia el trabajador que viene de props, actualiza el formulario
  useEffect(() => {
    setFormData({ ...trabajador });
  }, [trabajador]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, status } = await axios.put(
        `${BASE_URL}/trabajadores/actualizar-trabajador`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (status === 200) {
        Swal.fire({
          icon: "success",
          title: "Trabajador actualizado correctamente",
          timer: 1500,
          showConfirmButton: false,
        });
        onSave(data); // Actualiza lista en componente padre
        navigate(0); // Recarga la página para reflejar cambios
      } else {
        Swal.fire({
          icon: "error",
          title: "No se pudo actualizar el trabajador",
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
        } else if (status === 409) {
          Swal.fire("Advertencia", "La cédula ya está registrada", "warning");
        } else {
          console.error(error);
          Swal.fire("Error", "Hubo un error al actualizar el trabajador", "error");
        }
      } else {
        console.error(error);
        Swal.fire("Error", "Hubo un problema con la conexión", "error");
      }
    }
  };


  if (!show) return null;

  return (
    // Fondo oscuro
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content bg-white">
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">Editar Trabajador</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* Body del modal */}
          <form onSubmit={handleSubmit}>
            <div className="p-4 d-flex flex-column justify-content-center">

              {/* Select de trabajadores existentes con opción de escribir nuevo */}
              <div className="mb-3">
                <label className="form-label">Nombre Completo</label>
                <input
                  list="lista-trabajadores"
                  name="nombreCompleto"
                  value={formData.nombreCompleto || ""}
                  onChange={handleChange}
                  className="form-control rounded-5"
                  placeholder="Escriba o seleccione un nombre"/>
                <datalist id="lista-trabajadores">
                  {trabajadoresExistentes.map((t) => (<option key={t.idTrabajador} value={t.nombreCompleto} />))}
                </datalist>
              </div>

              <div className="mb-3">
                <label className="form-label">Cédula</label>
                <input
                  type="text"
                  name="cedula"
                  value={formData.cedula || ""}
                  onChange={handleChange}
                  className="form-control rounded-5"
                  readOnly disabled
                  />
              </div>

              <div className="mb-3">
                <label className="form-label">Salario</label>
                <input
                  type="number"
                  name="salario"
                  value={formData.salario || ""}
                  onChange={handleChange}
                  className="form-control rounded-5"/>
              </div>

              <div className="mb-3">
                <label className="form-label">Seguro Social</label>
                <input
                  type="text"
                  name="seguroSocial"
                  value={formData.seguroSocial || ""}
                  onChange={handleChange}
                  className="form-control rounded-5"/>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer d-flex justify-content-around">
              <button type="button" className="btn btn-secondary text-white rounded-5 d-flex align-items-center justify-content-center gap-1" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarTrabajadorModal;
