import { Button, Text } from "rsuite";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export const BASE_URL = import.meta.env.VITE_API_URL;

const EditarCotizacion = () => {
  const { idCotizacion } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    montoTotal: 0,
    montoManoObra: 0,
    tiempoEstimado: "",
    detalles: "",
  });

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const respuesta = await axios.get(
          `${BASE_URL}/cotizacion/obtener-cotizacion/${idCotizacion}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`, // Agregar JWT al header
            }
          }
        );
        const data = respuesta.data;
        setFormData({
          montoTotal: data.montoTotal,
          montoManoObra: data.montoManoObra,
          tiempoEstimado: data.tiempoEstimado,
          detalles: data.detalles,
        });
      } catch (error) {
        if (error.response) {
          // Manejo de errores según el código de estado
          if (error.response.status === 401) {
            Swal.fire({
              text: "Operación no Autorizada",
              icon: "warning",
              showConfirmButton: false,
            });
          } else if (error.response.status === 403) {
            Swal.fire({
              text: "Sesión expirada. Inicie sesión nuevamente.",
              icon: "warning",
              showConfirmButton: false,
            });
            localStorage.clear();
            navigate("/login"); // Redirigir a login si la sesión ha expirado
          } else {
            Swal.fire({
              text: "Error al obtener la cotización",
              icon: "error",
              showConfirmButton: false,
            });
          }
        } else {
          // Manejo de errores de red
          Swal.fire({
            text: "Hubo un error al realizar la solicitud. Intente nuevamente.",
            icon: "error",
            showConfirmButton: false,
          });
        }
      }
    };
    obtenerDatos();
  }, [idCotizacion]);


  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const verificacion = () => {
    if (formData.montoTotal <= 0) {
      Swal.fire({ text: "Monto Total debe ser mayor a 0", icon: "error", showConfirmButton: false });
      return false;
    }
    if (formData.montoManoObra <= 0) {
      Swal.fire({ text: "Monto de Mano de Obra debe ser mayor a 0", icon: "error", showConfirmButton: false });
      return false;
    }
    if (!formData.tiempoEstimado.trim()) {
      Swal.fire({ text: "Tiempo Estimado es requerido", icon: "error", showConfirmButton: false });
      return false;
    }
    if (!formData.detalles.trim()) {
      Swal.fire({ text: "Detalles es requerido", icon: "error", showConfirmButton: false });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verificacion()) return;

    try {
      await axios.put(
        `${BASE_URL}/cotizacion/actualizar-cotizacion/`,
        {
          idCotizacion,
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Agregar JWT al header
          }
        }
      );
      Swal.fire({
        icon: "success",
        title: "Cotización actualizada correctamente",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/cotizacion");
    } catch (error) {
      if (error.response) {
        // Manejo de errores según el código de estado
        if (error.response.status === 401) {
          Swal.fire({
            text: "Operación no Autorizada",
            icon: "warning",
            showConfirmButton: false,
          });
        } else if (error.response.status === 403) {
          Swal.fire({
            text: "Sesión expirada. Inicie sesión nuevamente.",
            icon: "warning",
            showConfirmButton: false,
          });
          localStorage.clear();
          navigate("/login"); // Redirigir a login si la sesión ha expirado
        } else {
          Swal.fire({
            text: "Error al actualizar cotización",
            icon: "error",
            showConfirmButton: false,
          });
        }
      } else {
        // Manejo de errores de red
        Swal.fire({
          text: "Hubo un error al realizar la solicitud. Intente nuevamente.",
          icon: "error",
          showConfirmButton: false,
        });
      }
    }

  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="bg-darkest p-4 rounded-4" style={{ minHeight: "70vh", maxWidth: "600px" }}>
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-column justify-content-center row p-5 gap-4" >

            <span className="row">
              <Text size="md" className="text-white">Monto Total:</Text>
              <input
                type="number"
                name="montoTotal"
                value={formData.montoTotal}
                onChange={handleChange}
                className="form-control rounded-5"
                min="0" />
            </span>
            <span className="row">
              <Text size="md" className="text-white">Monto por mano de obra:</Text>
              <input
                type="number"
                name="montoManoObra"
                value={formData.montoManoObra}
                onChange={handleChange}
                className="form-control rounded-5"
                min="0" />
            </span>
            <span className="row">
              <Text size="md" className="text-white">Tiempo estimado:</Text>
              <input
                type="text"
                name="tiempoEstimado"
                value={formData.tiempoEstimado}
                onChange={handleChange}
                className="form-control rounded-5" />
            </span>
            <span className="row">
              <Text size="md" className="text-white">Detalles:</Text>
              <textarea
                name="detalles"
                value={formData.detalles}
                onChange={handleChange}
                className="form-control rounded-4"
                rows="4"
                style={{ minWidth: "250px" }}
              />
            </span>
          </div>
          <div className="d-flex justify-content-center mt-5 row px-5">
            <Button type="submit" className="btn btn-success rounded-5 text-white align-items-center justify-content-center gap-1">
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarCotizacion;
