import { useState } from "react";
import { Modal, Button, Row, Col } from "rsuite";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SelectClientes from "../../clientes/components/SelectClientes";
import { FaPlus } from "react-icons/fa";

// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const ModalAgregarCotizacion = ({ onClose, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    montoTotal: "",
    montoManoObra: "",
    tiempoEstimado: "",
    detalles: "",
    idCliente: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { montoTotal, montoManoObra, tiempoEstimado, detalles, idCliente } = formData;

    if (!montoTotal || !montoManoObra || !tiempoEstimado.trim() || !detalles.trim() || !idCliente) {
      Swal.fire({
        icon: "error",
        text: "Todos los campos son obligatorios.",
        showConfirmButton: false,
      });
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/cotizacion/agregar-cotizacion/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Agregar JWT al header
          }
        }
      );
      Swal.fire({
        icon: "success",
        title: "Cotización generada correctamente",
        showConfirmButton: false,
        timer: 1500,
      });
      window.location.reload(); // Recargar la página
    } catch (err) {
      if (err.response) {
        // Manejo de errores según el código de estado
        if (err.response.status === 401) {
          Swal.fire({
            text: "Operación no Autorizada",
            icon: "warning",
            showConfirmButton: false,
          });
        } else if (err.response.status === 403) {
          Swal.fire({
            text: "Sesión expirada. Inicie sesión nuevamente.",
            icon: "warning",
            showConfirmButton: false,
          });
          localStorage.clear();
          navigate("/login"); // Redirigir a login si la sesión ha expirado
        } else {
          Swal.fire({
            icon: "error",
            text: "Hubo un error al generar la cotización.",
            showConfirmButton: false,
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          text: "Hubo un error en la conexión. Intente nuevamente.",
          showConfirmButton: false,
        });
      }
    }

  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button style={{ minWidth: "80px", maxWidth: "350px" }}
        className="text-white btn btn-success rounded-4 d-flex align-items-center justify-content-center gap-1"
        onClick={handleOpen}><FaPlus size={13} />Generar Cotización
      </Button>

      <Modal open={open} onClose={handleClose} size="lg">
        <Modal.Header>
          <Modal.Title className="text-center text-success">Generar Cotización</Modal.Title>
          <hr className="text-success" />
        </Modal.Header>
        <Modal.Body className="p-3">
          <form onSubmit={handleSubmit}>
            <Row>
              <Col xs={12}>
                <div className="mb-3">
                  <label>Monto Total:</label>
                  <input
                    name="montoTotal"
                    type="number"
                    min="0"
                    value={formData.montoTotal}
                    onChange={handleChange}
                    className="form-control rounded-5 py-2"
                    placeholder="CRC"
                    required />
                </div>
                <div className="mb-3">
                  <label>Monto Mano de Obra:</label>
                  <input
                    name="montoManoObra"
                    type="number"
                    min="0"
                    value={formData.montoManoObra}
                    onChange={handleChange}
                    className="form-control rounded-5 py-2"
                    placeholder="CRC"
                    required
                  />
                </div>
              </Col>

              <Col xs={12}>
                <div className="mb-3 row pe-3">
                  <label>Tiempo Estimado:</label>
                  <input
                    name="tiempoEstimado"
                    value={formData.tiempoEstimado}
                    onChange={handleChange}
                    className="form-control rounded-5 py-2"
                    placeholder="Ejemplo: Finalizado en 3 días"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Cliente:</label>
                  <SelectClientes
                    value={formData.idCliente}
                    onChange={handleChange}
                  />
                </div>
              </Col>
            </Row>

            <div className="mb-3">
              <label>Detalles:</label>
              <textarea
                name="detalles"
                rows={4}
                value={formData.detalles}
                onChange={handleChange}
                className="form-control rounded-4"
                placeholder="Información adicional..."
                required
              />
            </div>
            <div className="d-flex justify-content-center row mt-4">
              <Button className="btn btn-success rounded-4 d-flex align-items-center justify-content-center gap-1" type="submit">
              <FaPlus size={15}/>Generar
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

export default ModalAgregarCotizacion;
