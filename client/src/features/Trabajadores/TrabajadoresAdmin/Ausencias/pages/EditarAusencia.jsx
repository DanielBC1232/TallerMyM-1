import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { FaSave } from "react-icons/fa";
export const BASE_URL = import.meta.env.VITE_API_URL;

const EditarAusencia = () => {
  const navigate = useNavigate();
  const { idAusencia, idTrabajador } = useParams();
  const [loading, setLoading] = useState(true);

  const [trabajadores, setTrabajadores] = useState([]);//
  const [formData, setFormData] = useState({
    idTrabajador: idTrabajador || "",
    fechaAusencia: "",
    justificada: false
  });

  // Cargar datos iniciales
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

        const [resTrabajadores, resAusencia] = await Promise.all([
          axios.get(`${BASE_URL}/trabajadores/obtener-trabajadores`, authConfig),
          idAusencia && axios.get(`${BASE_URL}/trabajadores/obtener-ausencia/${idAusencia}`, authConfig)
        ]);

        setTrabajadores(resTrabajadores.data);

        if (resAusencia?.data) {
          const ausencia = resAusencia.data;
          setFormData({
            idTrabajador: ausencia.idTrabajador.toString(),
            fechaAusencia: ausencia.fechaAusencia.split("T")[0],
            justificada: ausencia.justificada
          });
        }

      } catch (error) {
        console.error("Error al cargar datos:", error);

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

        showAlert("Error al cargar datos iniciales", "error");
        navigate("/Lista-Ausencias");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [idAusencia, idTrabajador, navigate]);
  //Fin UseEffect

  // Función unificada para alertas
  const showAlert = (text, icon = "error", timer = 2000) => {
    Swal.fire({
      text,
      icon,
      timer,
      showConfirmButton: icon === "error"
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const validarFormulario = () => {
    if (!formData.fechaAusencia) {
      showAlert("Ingrese la fecha de ausencia", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      setLoading(true);

      const datosActualizados = {
        idTrabajador: parseInt(formData.idTrabajador, 10),
        fechaAusencia: new Date(formData.fechaAusencia).toISOString(),
        justificada: formData.justificada
      };

      const response = await axios.put(
        `${BASE_URL}/trabajadores/update-ausencia/${idAusencia}`,
        datosActualizados,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      showAlert("¡Ausencia actualizada correctamente!", "success");
      navigate("/Lista-Ausencias");

    } catch (error) {
      console.error("Error al actualizar ausencia:", error);

      if (error.response) {
        const { status } = error.response;

        if (status === 401) {
          showAlert("Operación no autorizada", "warning");
          window.location.reload();
          return;
        } else if (status === 403) {
          showAlert("Sesión expirada", "warning");
          localStorage.clear();
          window.location.href = "/login";
          return;
        }
      }

      const mensaje = error.response?.data?.message || "Error al actualizar la ausencia";
      showAlert(mensaje, "error");

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-darkest rounded-4 shadow mx-auto mt-5" style={{ maxWidth: "70vh" }}>
      <div className="">
        <h4 className="text-center text-success">Editar ausencia</h4>
        <hr className="text-success" />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row d-flex justify-content-center px-4">
          {/* Selector de trabajador */}
          <div className="col col-6">
            <label htmlFor="idTrabajador" className="form-label text-white">
              Empleado:
            </label>
            <select className="form-select rounded-5"
              id="idTrabajador"
              name="idTrabajador"
              value={formData.idTrabajador}
              onChange={handleChange}
              required
              disabled>
              <option value="">Seleccione trabajador</option>
              {trabajadores.map(t => (
                <option key={t.idTrabajador} value={t.idTrabajador}>
                  {t.nombreCompleto}
                </option>
              ))}
            </select>
          </div>

          <div className="col col-6">
            <label htmlFor="fechaAusencia" className="form-label text-white">
              Fecha de Ausencia:
            </label>
            <input
              type="date"
              className="form-control "
              id="fechaAusencia"
              name="fechaAusencia"
              value={formData.fechaAusencia}
              onChange={handleChange}
              required
              disabled={loading} />
          </div>

          <div className="d-flex gap-2 mt-4 px-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="justificada"
              name="justificada"
              checked={formData.justificada}
              onChange={handleChange}
              disabled={loading} />
            <label className="form-check-label text-white" htmlFor="justificada">
              Justificada
            </label>
          </div>

          {formData.justificada && (
            <div className="alert alert-info mt-4 px-4">
              <i className="bi bi-info-circle me-2"></i>
              Esta ausencia está marcada como justificada
            </div>
          )}
        </div>
        <div className="d-flex justify-content-between mt-4 px-4">
          <button type="button" className="btn btn-secondary text-white rounded-5 d-flex align-items-center justify-content-center gap-1"
            onClick={() => navigate("/Lista-Ausencias")}
            disabled={loading}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1"><FaSave size={20} />Guardar
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditarAusencia;