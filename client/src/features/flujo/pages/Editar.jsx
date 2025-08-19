import React, { useState, useEffect } from "react";
import { Grid, Row, Col } from "rsuite";
import "../styles/flu.module.css";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";

import SelectTrabajadores from "../components/SelectTrabajadores";
import SelectVehiculos from "../components/SelectVehiculos";
import { MdDelete } from "react-icons/md";
import { IoMdSave } from "react-icons/io";
import { IoIosReturnLeft } from "react-icons/io";

//URL BASE
export const BASE_URL = import.meta.env.VITE_API_URL;

const Editar = () => {
  const { idOrden } = useParams();
  const navigate = useNavigate(); // Hook para navegar
  const [formData, setFormData] = useState({
    idOrden: 0,
    tiempoEstimado: "",
    idTrabajador: null,
    idVehiculo: null,
    idCliente: null,
    descripcion: "",
    estadoAtrasado: 0,

  });
  const [fase, setFase] = useState({
    idOrden: 0,
    estadoOrden: 0
  });

  const errorNotification = (message) => {
    Swal.fire({
      text: message,
      icon: "error",
      showConfirmButton: false,
    });
  };
  // --- Verificaciones de campos ---
  const VerificarTiempoEstimado = () => {
    if (!formData.tiempoEstimado) {
      errorNotification("Campo de tiempo estimado vacío");
      return false;
    }
    return true;
  };
  const verificarTrabajador = () => {
    var pass = false;
    //Campo Marca
    if (!formData.idTrabajador) {
      pass = false;
      errorNotification("Debe asignar un mecanico encargado");
    } else if (formData.idTrabajador) {
      pass = true;
    }
    return pass;
  };
  const verificarDescripcion = () => {
    var pass = false;
    //Campo Marca
    if (formData.descripcion.trim().length < 5) {
      pass = false;
      errorNotification("Debe redactar una descripcion");
    } else if (formData.descripcion.trim().length > 5) {
      pass = true;
    }
    return pass;
  };

  // VERIFICACION GENERAL
  const verificacion = () => {
    var pass = false;
    //Verificar que todos los campos sean validos
    if (
      VerificarTiempoEstimado() &&
      verificarTrabajador() &&
      verificarDescripcion()
    ) {
      pass = true;
    } else {
      pass = false;
    }
    return pass;
  };

  // Función para convertir el formato de fecha de "dd-MM-yyyy" a "yyyy-MM-dd"
  const convertDateFormat = (dateString) => {
    if (!dateString) return '';
    // Separar por '/' o '-' usando una expresión regular
    const parts = dateString.split(/[-/]/);
    // Validar que tenga 3 partes (día, mes, año)
    if (parts.length !== 3) return '';
    const [day, month, year] = parts;
    // Validar que día, mes y año sean números
    if (isNaN(day) || isNaN(month) || isNaN(year)) return '';
    // Formatear como yyyy-MM-dd
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  useEffect(() => {
    const obtenerOrden = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/flujo/obtener-orden/${idOrden}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT en el encabezado
          }
        });
        setFormData((prev) => ({
          ...prev, // Mantener valores predefinidos
          idOrden: data.idOrden,
          tiempoEstimado: convertDateFormat(data.tiempoEstimado),
          idTrabajador: data.idTrabajador,
          idVehiculo: data.idVehiculo,
          idCliente: data.idCliente,
          descripcion: data.descripcion,
          estadoAtrasado: data.estadoAtrasado
        }));
        setFase((prev) => ({
          ...prev, // Mantener valores predefinidos
          idOrden: data.idOrden,
          estadoOrden: -1 // -1 porque el controller suma +1 (porque originalmente esta hecho por cambiar fase siguiente)
        }));
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
          }
          else {
            console.error("Error al obtener el orden:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un error al obtener el orden",
              showConfirmButton: false,
            });
          }
        } else {
          // Manejo de errores en caso de problemas de red u otros
          console.error("Error desconocido", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error desconocido, por favor intente nuevamente",
            showConfirmButton: false,
          });
        }
      }

    };
    obtenerOrden(); // llamar funcion
  }, [idOrden]);//cargar al tener id

  const actualizarOrden = async () => {
    try {
      if (verificacion()) {
        const result = await Swal.fire({
          text: `¿ Actualizar cambios realizados?`,
          icon: "warning",
          confirmButtonText: 'Confirmar',
          showConfirmButton: true,
          showCancelButton: true,
          customClass: {
            actions: 'my-actions',
            confirmButton: 'btn btn-warning rounded-5 text-white order-2',
            cancelButton: 'btn rounded-5 btn-outline-dark order-1',
          },
        });

        if (result.isConfirmed) {
          const resFase = await axios.put(`${BASE_URL}/flujo/actualizar-orden/`, formData, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('token')}` // Incluir JWT en el encabezado
            }
          });

          if (resFase.status === 200) {
            Swal.fire({
              title: 'Orden actualizada!',
              icon: 'success',
              showConfirmButton: false
            });
            navigate(`/flujo-detalles/${idOrden}`);
          }
        }
      }
    } catch (error) {
      if (error.response) {
        // Manejo de errores HTTP
        if (error.response.status === 401) {
          Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "Operación no autorizada",
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
        }
        else {
          console.error("Error al actualizar orden:", error);
          Swal.fire({
            title: 'Error al actualizar orden!',
            icon: 'error',
            showConfirmButton: false
          });
        }
      } else {
        // Manejo de errores en caso de problemas de red u otros
        console.error("Error desconocido", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error desconocido, por favor intente nuevamente",
          showConfirmButton: false,
        });
      }
    }


  };

  const cancelarOrden = async () => {
    try {
      const result = await Swal.fire({
        text: `¿¡ Seguro que desea cancelar la orden !?`,
        icon: "error",
        confirmButtonText: 'Confirmar',
        showConfirmButton: true,
        showCancelButton: true,
        customClass: {
          actions: 'my-actions',
          confirmButton: 'btn btn-danger rounded-5 text-white order-2',
          cancelButton: 'btn rounded-5 btn-outline-dark order-1',
        },
      });

      if (result.isConfirmed) {
        const resFase = await axios.put(`${BASE_URL}/flujo/actualizar-fase-orden/`, fase, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}` // Incluir JWT en el encabezado
          }
        });

        if (resFase.status === 200) {
          Swal.fire({
            title: 'Orden cancelada!',
            icon: 'success',
            showConfirmButton: false
          });
          navigate("/flujo");
        }
      }
    } catch (error) {
      if (error.response) {
        // Manejo de errores HTTP
        if (error.response.status === 401) {
          Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "Operación no autorizada",
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
        }
        else {
          console.error("Error al actualizar la orden:", error);
          Swal.fire({
            title: 'Error al cancelar orden!',
            icon: 'error',
            showConfirmButton: false
          });
        }
      } else {
        // Manejo de errores en caso de problemas de red u otros
        console.error("Error desconocido", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error desconocido, por favor intente nuevamente",
          showConfirmButton: false,
        });
      }
    }

  };

  return (
    <div className="rounded-5 shadow bg-darkest mx-auto" style={{ minHeight: "62vh", maxWidth: "90vh" }}>
      <div className="rounded-top-4 bg-header d-flex justify-content-center pt-3">
        <h2 className="text-success">Editar órden</h2>
      </div>
      <div className="d-flex flex-column justify-content-center px-5 mt-5">
        <Row>
          <Col xs={12} className="d-flex gap-3 flex-column">
            <span className="text-white">
              Seleccionar un mecánico
              <SelectTrabajadores
                value={formData.idTrabajador}
                onChange={(e) => setFormData(prev => ({ ...prev, idTrabajador: e.target.value }))} />
            </span>
            <span className="text-white">
              Vehiculo:
              <SelectVehiculos
                idCliente={formData.idCliente}
                value={formData.idVehiculo}
                onChange={(e) => setFormData(prev => ({ ...prev, idVehiculo: e.target.value }))} />
            </span>
          </Col>
          <Col xs={12}>
            <span className="text-white">
              Estimado de finalización:
              <input
                type="date"
                className="form-control rounded-5 py-2"
                style={{ maxWidth: "370px" }}
                name="tiempoEstimado"
                value={formData.tiempoEstimado}
                onChange={(e) => setFormData(prev => ({ ...prev, tiempoEstimado: e.target.value }))}
                // solo de hoy en adelante
                min={new Date().toISOString().split("T")[0]} // Formato YYYY-MM-DD
              />
            </span>
          </Col>
        </Row>
        <Row className="mt-3">
          <span className="text-white">
            Descripción:
            <textarea
              className="form-control rounded-4"
              rows={6}
              name="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))} />
          </span>
        </Row>
        <div className="row mt-5">
          <div className="d-flex col justify-content-start">
            <Link to={`/flujo-detalles/${idOrden}`}
              type="button"
              className="btn btn-dark text-white rounded-5 d-flex align-items-center justify-content-center gap-1">
              <IoIosReturnLeft size={20} />Volver
            </Link>
          </div>
          <div className="d-flex col justify-content-end">
            <button onClick={cancelarOrden}
              type="button"
              className="btn btn-danger text-white rounded-5 d-flex align-items-center justify-content-center gap-1">
              <MdDelete size={20} /> Eliminar
            </button>
            <button onClick={actualizarOrden}
              type="button"
              className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1 ms-3">
              <IoMdSave size={20} />Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editar;
