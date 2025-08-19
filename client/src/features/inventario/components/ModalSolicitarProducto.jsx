 import { useState } from "react";
import { Modal, Button } from "rsuite";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaSave } from "react-icons/fa";

export const BASE_URL = import.meta.env.VITE_API_URL;

const ModalSolicitarProducto = () => {
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [cuerpo, setCuerpo] = useState("");
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const validarCampos = () => {
    if (!titulo.trim() || !cuerpo.trim()) {
      Swal.fire({
        icon: "error",
        text: "Todos los campos son obligatorios",
        showConfirmButton: false,
        timer: 1500,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;

    const usuario = localStorage.getItem('username');

    try {
      await axios.post(
        `${BASE_URL}/inventario/agregar-solicitud`,
        {
          titulo,
          cuerpo,
          usuario,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT en el header
          }
        }
      );

      Swal.fire({
        icon: "success",
        title: "Solicitud enviada correctamente",
        showConfirmButton: false,
        timer: 1500,
      });

      setTitulo("");
      setCuerpo("");
      setOpen(false);
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
        } else {
          console.error("Error al enviar la solicitud", error);
          Swal.fire({
            icon: "error",
            title: "Error al enviar la solicitud",
            text: error.message,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } else {
        console.error("Error desconocido", error);
      }
    }

  };

  return (
    <>
      <Button
        style={{ minWidth: "80px", maxWidth: "350px" }}
        className="btn btn-success rounded-5 text-white d-flex align-items-center justify-content-center gap-1"
        onClick={handleOpen}>
        Solicitar Producto</Button>

      <Modal open={open} onClose={handleClose}>
        <Modal.Header className="p-3">
          <Modal.Title className="text-success text-center">Solicitar Productos</Modal.Title>
          <hr className="text-success" />
        </Modal.Header>
        <Modal.Body className="px-3">
          <span>Título de solicitud:</span>
          <input
            placeholder="Se solicita...."
            id="titulo"
            name="titulo"
            type="text"
            className="form-control rounded-5"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required />
          <br />
          <span>Solicitud:</span>
          <textarea
            placeholder="Detalles de solicitud"
            id="cuerpo"
            name="cuerpo"
            className="form-control rounded-4"
            rows={6}
            value={cuerpo}
            onChange={(e) => setCuerpo(e.target.value)}
            required
          ></textarea>
        </Modal.Body>
        <Modal.Footer className="p-3 row">
          <Button onClick={handleSubmit} className="btn btn-success rounded-5 d-flex align-items-center justify-content-center gap-1" type="button">
            <FaSave size="20"/> Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalSolicitarProducto;
