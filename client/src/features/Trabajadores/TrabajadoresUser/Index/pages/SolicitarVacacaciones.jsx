import { useState, useEffect} from "react";
import { Loader } from "rsuite";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL;

const CreateSolicitud = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loadingTrabajadores, setLoadingTrabajadores] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formValue, setFormValue] = useState({
    FechaInicio: "",
    FechaFin: "",
  });

  useEffect(() => {
    const fetchTrabajador = async () => {
      try {
        setLoadingTrabajadores(true);
        const cedula = localStorage.getItem("cedula");
        const token = localStorage.getItem("token");
        if (!cedula || !token) throw { response: { status: 401 } };

        const res = await axios.post(
          `${BASE_URL}/trabajadores/trabajador/cedula/`,
          { cedula },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(res.data);
        setFormValue(fv => ({
          ...fv,
          idTrabajador: res.data.idTrabajador,
        }));
      } catch (error) {
        const status = error.response?.status;
        if (status === 401) {
          await Swal.fire("Sesión expirada", "Por favor inicie sesión nuevamente", "warning");
          localStorage.removeItem("token");
          return void (window.location.href = "/login");
        }
        if (status === 403) {
          await Swal.fire("Acceso denegado", "No tiene permisos para ver los trabajadores", "error");
          return;
        }
        await Swal.fire("Error", "No se pudo cargar el trabajador", "error");
      } finally {
        setLoadingTrabajadores(false);
      }
    };

    fetchTrabajador();
  }, []);

  const formatDate = (s) => {
    // s: "YYYY-MM-DD"
    return s;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { FechaInicio, FechaFin } = formValue;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!FechaInicio || !FechaFin) {
      return void Swal.fire("Error", "Complete todas las fechas", "error");
    }
    const inicio = new Date(FechaInicio);
    const fin = new Date(FechaFin);

    if (inicio < today) {
      return void Swal.fire("Error", "No se pueden solicitar fechas pasadas", "error");
    }
    if (fin < inicio) {
      return void Swal.fire("Error", "La fecha fin no puede ser anterior a la inicio", "error");
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/trabajadores/Solicitud-Vacaciones`,
        {
          fechaInicio: formatDate(FechaInicio),
          fechaFin: formatDate(FechaFin),
          idTrabajador: data.idTrabajador,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 201) {
        throw new Error(`Error: ${response.status}`);
      }

      await Swal.fire({
        icon: "success",
        title: "¡Solicitud enviada!",
        text: "Tu solicitud de vacaciones ha sido registrada correctamente.",
        showConfirmButton: true,
      });
      navigate("/trabajadores-user");
    } catch (error) {
      const status = error.response?.status;
      let msg = "Hubo un error al registrar la solicitud.";
      if (status === 400 && error.response.data.error) {
        msg = error.response.data.error;
      } else if (status === 401) {
        await Swal.fire("Sesión expirada", "Por favor inicie sesión nuevamente", "warning");
        localStorage.removeItem("token");
        return void (window.location.href = "/login");
      } else if (status === 403) {
        msg = "No tiene permisos para realizar esta acción.";
      }
      await Swal.fire("Error", msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingTrabajadores) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Loader size="lg" content="Cargando trabajadores..." />
      </div>
    );
  }

  return (
    <div className="form-container">
      <h4 className="text-center text-success">Solicitar vacaciones</h4>
      <hr className="text-success" />

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="FechaInicio" className="form-label">
            Fecha de Inicio
          </label>
          <input
            type="date"
            id="FechaInicio"
            name="FechaInicio"
            className="form-control"
            value={formValue.FechaInicio}
            onChange={(e) => setFormValue({ ...formValue, FechaInicio: e.target.value })}
            min={new Date().toISOString().split("T")[0]}
          />
          <div className="form-text">No se permiten fechas pasadas</div>
        </div>

        <div className="mb-3">
          <label htmlFor="FechaFin" className="form-label">
            Fecha Fin
          </label>
          <input
            type="date"
            id="FechaFin"
            name="FechaFin"
            className="form-control"
            value={formValue.FechaFin}
            onChange={(e) => setFormValue({ ...formValue, FechaFin: e.target.value })}
            min={formValue.FechaInicio || new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Empleado</label>
          <input
            type="text"
            className="form-control rounded-3"
            readOnly
            value={data?.nombreCompleto || ""}
          />
        </div>

        <div className="d-flex justify-content-between gap-2">
          <button
            type="button"
            className="btn btn-secondary text-white rounded-5"
            onClick={() => navigate("/trabajadores-user")}
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-success text-white rounded-5"
            disabled={submitting || !formValue.FechaInicio || !formValue.FechaFin}
          >
            {submitting ? "Enviando..." : "Enviar Solicitud"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSolicitud;