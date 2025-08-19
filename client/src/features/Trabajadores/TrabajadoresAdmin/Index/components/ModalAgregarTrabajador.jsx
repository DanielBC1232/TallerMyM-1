import React, { useState } from "react";
import Swal from "sweetalert2";
import { Modal, Button, Grid, Row, Col } from "rsuite";
import axios from "axios";
import { IoPersonAdd } from "react-icons/io5";

// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const ModalAgregarTrabajador = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formValue, setFormValue] = useState({
    nombreCompleto: "",
    cedula: "",
    salario: "",
    seguroSocial: "",
  });

  // Validación de campos vacíos
  const validateForm = () => {
    const { nombreCompleto, cedula, salario, seguroSocial } = formValue;
    if (!nombreCompleto || !cedula || !salario || !seguroSocial) {
      Swal.fire("Advertencia", "Todos los campos son obligatorios", "warning");
      return false;
    }
    return true;
  };

  // Manejar cambios de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formValue);
    if (!validateForm()) return;
  
    try {
      setLoading(true); // Activar estado de carga
  
      const response = await axios.post(
        `${BASE_URL}/trabajadores/agregar-trabajador/`,
        formValue,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
  
      // Mostrar confirmación
      await Swal.fire({
        title: "¡Éxito!",
        text: "Trabajador registrado correctamente",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
  
      // Recargar la página o redirigir
      window.location.reload();
  
    } catch (error) {
      console.error("Error al registrar trabajador:", error);
      
      // Manejo específico de errores
      if (error.response) {
        switch (error.response.status) {
          case 401:
            Swal.fire("Sesión expirada", "Por favor inicie sesión nuevamente", "warning");
            localStorage.removeItem("token");
            window.location.href = "/login";
            return;
          case 403:
            Swal.fire("Acceso denegado", "No tiene permisos para esta acción", "error");
            return;
          case 409:
            Swal.fire("Advertencia", "La cédula ya está registrada", "warning");
            return;
            case 500:
            Swal.fire("Advertencia", "Error 500 servidor", "warning");
            case 501:
            Swal.fire("Advertencia", "Error 501 servidor", "warning");
            case 502:
            Swal.fire("Advertencia", "Error 502 servidor", "warning");
            return;
          default:
            Swal.fire(
              "Error", 
              error.response.data?.message || "Error al registrar el trabajador", 
              "error"
            );
        }
      } else {
        Swal.fire("Error", "Problema de conexión con el servidor", "error");
      }
    } finally {
      setLoading(false); // Desactivar estado de carga
    }
  };

  // Abre el modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <button
        className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1"
        onClick={handleOpen}>
        <IoPersonAdd size={20} />
        Registrar Trabajador
      </button>

      <Modal open={open} onClose={handleClose} size="lg">
        <Modal.Header>
          <Modal.Title className="ms-4 text-success">Registrar Trabajador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="p-3">
            <Row gutter={16} className="d-flex justify-content-center px-3">
              <Col xs={24} md={12} className="">
                <div className="mb-3">
                  <label className="form-label">Nombre Completo:</label>
                  <input
                    type="text"
                    name="nombreCompleto"
                    value={formValue.nombreCompleto}
                    onChange={handleChange}
                    className="form-control rounded-5"
                    required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Cédula:</label>
                  <input
                    type="text"
                    name="cedula"
                    value={formValue.cedula}
                    onChange={handleChange}
                    className="form-control rounded-5"
                    required />
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div className="mb-3">
                  <label className="form-label">Salario:</label>
                  <input
                    type="number"
                    name="salario"
                    value={formValue.salario}
                    onChange={handleChange}
                    className="form-control rounded-5"
                    step="0.01"
                    min="0"
                    required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Seguro Social:</label>
                  <input
                    type="text"
                    name="seguroSocial"
                    value={formValue.seguroSocial}
                    onChange={handleChange}
                    className="form-control rounded-5"
                    required />
                </div>
              </Col>
            </Row>
              <div className="d-flex justify-content-center row px-4 mt-5">
                <Button className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1" type="submit">
                  Registrar Trabajador
                </Button>
              </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalAgregarTrabajador;
