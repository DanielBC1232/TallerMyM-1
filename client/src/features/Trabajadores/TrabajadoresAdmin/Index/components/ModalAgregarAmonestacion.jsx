import React, { useState } from "react";
import Swal from "sweetalert2";
import { Modal, Button, Grid, Row, Col } from "rsuite";
import axios from "axios";
import DatePicker from "rsuite/DatePicker";

// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const ModalAgregarAmonestacion = ({ trabajadores }) => {
  const [open, setOpen] = useState(false);
  const [formValue, setFormValue] = useState({
    idTrabajador: "",
    fechaAmonestacion: new Date(),
    tipoAmonestacion: "",
    motivo: "",
    accionTomada: ""
  });

  // Validación de campos vacíos
  const validateForm = () => {
    const { idTrabajador, tipoAmonestacion, motivo, accionTomada } = formValue;
    if (!idTrabajador || !tipoAmonestacion || !motivo || !accionTomada) {
      Swal.fire("Advertencia", "Todos los campos son obligatorios", "warning");
      return false;
    }
    return true;
  };

  // Manejar cambios de inputs
  const handleChange = (name, value) => {
    setFormValue({ ...formValue, [name]: value });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Formatear fecha a YYYY-MM-DD
      const formattedDate = formValue.fechaAmonestacion.toISOString().split('T')[0];
      const payload = {
        ...formValue,
        fechaAmonestacion: formattedDate
      };

      const response = await axios.post(`${BASE_URL}/amonestaciones/registrar`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      // Si la inserción es exitosa (HTTP 200 o 201)
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: "Éxito",
          text: "Amonestación registrada exitosamente",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Hubo un error al registrar la Amonestación", "error");
    }
  };

  // Abre el modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        style={{ minWidth: "80px", maxWidth: "350px" }}
        className="btn btn-secondary btn-sm text-white"
        onClick={handleOpen}
      >
        Registrar Amonestación
      </Button>

      <Modal open={open} onClose={handleClose} size="lg">
        <Modal.Header>
          <Modal.Title>Registrar Amonestación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <Grid fluid>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <div className="mb-3">
                    <label className="form-label">Trabajador:</label>
                    <select
                      name="idTrabajador"
                      value={formValue.idTrabajador}
                      onChange={(e) => handleChange("idTrabajador", e.target.value)}
                      className="form-control form-select-sm"
                      required
                    >
                      <option value="">Seleccione un trabajador</option>
                      {trabajadores.map((trabajador) => (
                        <option key={trabajador.idTrabajador} value={trabajador.idTrabajador}>
                          {trabajador.nombreCompleto} - {trabajador.cedula}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Fecha de Amonestación:</label>
                    <DatePicker
                      block
                      name="fechaAmonestacion"
                      value={formValue.fechaAmonestacion}
                      onChange={(date) => handleChange("fechaAmonestacion", date)}
                      className="form-control form-select-sm"
                      required
                    />
                  </div>
                </Col>

                <Col xs={24} md={12}>
                  <div className="mb-3">
                    <label className="form-label">Tipo de Amonestación:</label>
                    <select
                      name="tipoAmonestacion"
                      value={formValue.tipoAmonestacion}
                      onChange={(e) => handleChange("tipoAmonestacion", e.target.value)}
                      className="form-control form-select-sm"
                      required
                    >
                      <option value="">Seleccione un tipo</option>
                      <option value="Verbal">Verbal</option>
                      <option value="Escrita">Escrita</option>
                      <option value="Suspensión">Suspensión</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24}>
                  <div className="mb-3">
                    <label className="form-label">Motivo:</label>
                    <textarea
                      name="motivo"
                      value={formValue.motivo}
                      onChange={(e) => handleChange("motivo", e.target.value)}
                      className="form-control form-select-sm"
                      rows="3"
                      required
                    />
                  </div>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24}>
                  <div className="mb-3">
                    <label className="form-label">Acción Tomada:</label>
                    <textarea
                      name="accionTomada"
                      value={formValue.accionTomada}
                      onChange={(e) => handleChange("accionTomada", e.target.value)}
                      className="form-control form-select-sm"
                      rows="3"
                      required
                    />
                  </div>
                </Col>
              </Row>
            </Grid>

            <div className="d-flex justify-content-end mt-4">
              <Button appearance="success" type="submit">
                Registrar Amonestación
              </Button>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="default">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalAgregarAmonestacion;