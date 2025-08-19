import { useState } from "react";
import Swal from "sweetalert2";
import { Modal, Button, Row, Col } from "rsuite";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { IoPersonAddSharp } from "react-icons/io5";

// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const ModalAgregarCliente = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [formValue, setFormValue] = useState({
    nombre: "",
    cedula: "",
    apellido: "",
    correo: "",
    telefono: "",
  });

  // Validación de campos vacíos
  const validateForm = () => {
    const { nombre, cedula, apellido, correo, telefono } = formValue;
    if (!nombre || !cedula || !apellido || !correo || !telefono) {
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
      const response = await axios.post(
        `${BASE_URL}/clientes/registrar`,
        formValue,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Añadir JWT en el header
          },
        }
      );

      // Si la inserción es exitosa (HTTP 200 o 201)
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: "Éxito",
          text: "Cliente registrado exitosamente",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        window.location.reload();
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "Operación no Autorizada",
            showConfirmButton: false,
          });
          window.location.reload(); // Recarga la página si no está autorizado
        } else if (error.response.status === 403) {
          Swal.fire({
            icon: "warning",
            title: "Autenticación",
            text: "Sesión expirada",
            showConfirmButton: false,
          });
          localStorage.clear();
          window.location.href = "/login"; // Redirige al login si la sesión ha expirado
        } else if (error.response.status === 409) {
          // Si el error es 409, es porque la cédula ya está registrada
          Swal.fire("Advertencia", "La cédula ya está registrada", "warning");
        } else {
          // En caso de otros errores
          console.error(error);
          Swal.fire("Error", "Hubo un error al registrar el Cliente", "error");
        }
      } else {
        // En caso de no recibir respuesta (error de red, etc.)
        console.error(error);
        Swal.fire("Error", "Hubo un problema con la conexión", "error");
      }
    }

  };

  // Abre el modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button style={{ minWidth: "80px", maxWidth: "350px" }}
        className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1"
        onClick={handleOpen}><IoPersonAddSharp size={20} />Registrar Cliente</Button>

      <Modal open={open} onClose={handleClose} size="lg">
        <Modal.Header className="p-3">
          <Modal.Title className="text-success text-center">Registrar Cliente</Modal.Title>
          <hr className="text-success px-3" />
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="p-4">
            <Row>
              <Col xs={24} md={12}>
                <div className="mb-3">
                  <label className="form-label">Nombre:</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formValue.nombre}
                    onChange={handleChange}
                    className="form-control rounded-5"
                    required/>
                </div>
                <div className="mb-3">
                  <label className="form-label">Cédula:</label>
                  <input
                    type="text"
                    name="cedula"
                    value={formValue.cedula}
                    onChange={handleChange}
                    className="form-control rounded-5"
                    required/>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div className="mb-3">
                  <label className="form-label">Apellido:</label>
                  <input
                    type="text"
                    name="apellido"
                    value={formValue.apellido}
                    onChange={handleChange}
                    className="form-control rounded-5"
                    required/>
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo:</label>
                  <input
                    type="email"
                    name="correo"
                    value={formValue.correo}
                    onChange={handleChange}
                    className="form-control rounded-5 py-2"
                    required/>
                </div>
              </Col>
            </Row>

            <Row>
              <Col xs={24} md={12}>
                <div className="mb-3">
                  <label className="form-label">Teléfono:</label>
                  <input
                    type="text"
                    name="telefono"
                    value={formValue.telefono}
                    onChange={handleChange}
                    className="form-control rounded-5"
                    required/>
                </div>
              </Col>
            </Row>
            <div className="d-flex justify-content-end mt-4 row px-2">
              <Button className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1" type="submit">
                <IoPersonAddSharp size={20} />Registrar Cliente
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

export default ModalAgregarCliente;
