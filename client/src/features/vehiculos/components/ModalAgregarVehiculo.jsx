import React, { useState } from "react";
import Swal from "sweetalert2";
import SelectClientes from "../../clientes/components/SelectClientes";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Grid, Row, Col } from "rsuite";
import { FaCar } from "react-icons/fa";

// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const ModalAgregarVehiculo = () => {
  const [open, setOpen] = useState(false);
  const [formValue, setFormValue] = useState({
    placaVehiculo: "",
    modeloVehiculo: "",
    marcaVehiculo: "",
    annoVehiculo: "",
    tipoVehiculo: "",
    idCliente: "",
  });

  const navigate = useNavigate();

  // Validación de campos vacíos
  const validateForm = () => {
    const { placaVehiculo, modeloVehiculo, marcaVehiculo, annoVehiculo, tipoVehiculo, idCliente } = formValue;
    if (!placaVehiculo || !modeloVehiculo || !marcaVehiculo || !annoVehiculo || !tipoVehiculo || !idCliente) {
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

    if (!validateForm()) return;

    try {
      const response = await axios.post(`${BASE_URL}/vehiculos/registrar`, formValue, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT en el header
        }
      });

      // Si la inserción es exitosa (HTTP 200 o 201)
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: "Éxito",
          text: "Vehículo registrado exitosamente",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
        });
        window.location.reload(); // Recargar la página después del éxito
      }
    } catch (error) {
      if (error.response) {
        // Manejo de errores específicos de la respuesta HTTP
        if (error.response.status === 401) {
          Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "Operacion no Autorizada",
            showConfirmButton: false,
          });
          navigate(0); // Redirigir al login si no está autorizado
        } else if (error.response.status === 403) {
          Swal.fire({
            icon: "warning",
            title: "Autenticación",
            text: "Sesión expirada",
            showConfirmButton: false,
          });
          localStorage.clear();
          navigate("/login"); // Redirigir al login si la sesión ha expirado
        } else if (error.response.status === 409) {
          Swal.fire("Error", "La placa del vehículo ya está registrada", "warning");
        } else {
          console.error(error);
          Swal.fire("Error", "Hubo un error al registrar el Vehículo", "error");
        }
      } else {
        // Si no hay respuesta del servidor
        console.error(error);
        Swal.fire("Error", "Hubo un error al registrar el Vehículo", "error");
      }
    }

  };

  // Abre el modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1"
        onClick={handleOpen}>
        <FaCar size={20} />Registrar
      </Button>

      <Modal open={open} onClose={handleClose} size="lg">
        <Modal.Header className="p-3">
          <Modal.Title className="text-success text-center">Registrar Vehículo</Modal.Title>
          <hr className="text-success px-3" />

        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <Row className="px-4 py-2">
              <Col xs={12}>
                <div className="mb-3">
                  <label className="form-label">Placa Vehículo:</label>
                  <input
                    type="text"
                    name="placaVehiculo"
                    value={formValue.placaVehiculo}
                    onChange={handleChange}
                    className="form-control rounded-5"
                    required
                    placeholder="* * * * * *" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Modelo del Vehículo:</label>
                  <input
                    type="text"
                    name="modeloVehiculo"
                    value={formValue.modeloVehiculo}
                    onChange={handleChange}
                    className="form-control rounded-5"
                    required
                    placeholder="Ejemplo: Corolla, Sentra, ..." />
                </div>

                <div className="mb-3" style={{ maxWidth: "400px" }}>
                  <label className="form-label">Cliente:</label>
                  <SelectClientes
                    value={formValue.idCliente}
                    onChange={handleChange}
                    className="p-0" />
                </div>

              </Col>

              <Col xs={12}>
                <div className="mb-3">
                  <label className="form-label">Marca del Vehículo:</label>
                  <input
                    type="text"
                    name="marcaVehiculo"
                    value={formValue.marcaVehiculo}
                    onChange={handleChange}
                    className="form-control rounded-5"
                    required
                    placeholder="Ejemplo: BMW, Honda, Nissan,..." />
                </div>

                <div className="mb-3">
                  <label className="form-label">Año del Vehículo:</label>
                  <input
                    type="text"
                    name="annoVehiculo"
                    value={formValue.annoVehiculo}
                    onChange={handleChange}
                    className="form-control rounded-5"
                    required
                    placeholder="Ejemplo: 2020" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Tipo de Vehículo:</label>
                  <input
                    type="text"
                    name="tipoVehiculo"
                    value={formValue.tipoVehiculo}
                    onChange={handleChange}
                    className="form-control rounded-5"
                    required
                    placeholder="Ejemplo: Sendán, Suv,..." />
                </div>

              </Col>
            </Row>
            <div className="d-flex justify-content-center mt-4 row px-5 mt-5">
              <Button className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1" type="submit">
                <FaCar size={20} />Registrar Vehículo
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

export default ModalAgregarVehiculo;
