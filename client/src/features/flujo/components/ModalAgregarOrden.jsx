import { useState } from "react";
import { Modal, Button, Row } from "rsuite";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import SelectClientes from "../components/SelectClientes";
import SelectTrabajadores from "../components/SelectTrabajadores";
import SelectVehiculos from "../components/SelectVehiculos";
import { IoMdAdd } from "react-icons/io";
// URL BASE
export const BASE_URL = import.meta.env.VITE_API_URL;

const ModalAgregarOrden = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    tiempoEstimado: "",
    idTrabajador: "",
    idCliente: "",
    idVehiculo: "",
    descripcion: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validacion simplificada: se verifica que todos los campos obligatorios tengan valor
  const validarCampos = () => {
    const { tiempoEstimado, idTrabajador, idCliente, idVehiculo, descripcion } = formData;
    if (!tiempoEstimado || !idTrabajador || !idCliente || !idVehiculo || !descripcion.trim()) {
      Swal.fire({
        icon: "error",
        text: "Todos los campos son obligatorios.",
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
    try {
      const res = await axios.post(
        `${BASE_URL}/flujo/agregar-orden/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT aquí
          }
        }
      );

      if (res.status === 201) {
        await Swal.fire({
          icon: "success",
          title: "Orden agregada correctamente",
          showConfirmButton: false,
          timer: 1300,
        });
        setFormData({
          tiempoEstimado: "",
          idTrabajador: "",
          idCliente: "",
          idVehiculo: "",
          descripcion: ""
        });
        setOpen(false);
        navigate(0);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Ocurrió un problema al procesar la solicitud",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error al agregar la orden:", error);
      let message = "Error al agregar la orden";
      if (error.response) {
        const { status } = error.response;
        if (status === 401) {
          message = "Operación no autorizada, por favor inicie sesión";
        } else if (status === 403) {
          message = "Sesión expirada, por favor inicie sesión nuevamente";
        } else if (status === 400) {
          message = "Solicitud incorrecta, por favor verifique los datos ingresados";
        } else if (status === 404) {
          message = "No se encontró el recurso solicitado";
        } else if (status === 500) {
          message = "Error interno del servidor, por favor intente más tarde";
        }
      } else {
        message = "Error desconocido, por favor intente más tarde";
      }
      Swal.fire({
        icon: "error",
        title: message,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <Button className="btn me-3 btn-success mb-2 text-white rounded-5 d-flex align-items-center justify-content-center gap-1"
        onClick={handleOpen}><IoMdAdd size={20} />Agregar Orden</Button>

      <Modal open={open} onClose={handleClose} size="sm">
        <Modal.Header className="p-3">
          <Modal.Title className="text-success text-center">Agregar una nueva Orden</Modal.Title>
          <hr className="text-success px-3" />
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-center flex-column px-4">
              <Row>
                <div className="mb-3">
                  <label>Cliente:</label>
                  <SelectClientes
                    value={formData.idCliente}
                    onChange={(e) => setFormData(prev => ({ ...prev, idCliente: e.target.value }))}
                    className="form-select-sm"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Mecánico:</label>
                  <SelectTrabajadores
                    value={formData.idTrabajador}
                    onChange={(e) => setFormData(prev => ({ ...prev, idTrabajador: e.target.value }))}
                    className="form-select-sm"
                    required />
                </div>
                <div className="mb-3">
                  <label>Vehículo:</label>
                  <SelectVehiculos
                    idCliente={formData.idCliente}
                    value={formData.idVehiculo}
                    onChange={(e) => setFormData(prev => ({ ...prev, idVehiculo: e.target.value }))}
                    className="form-select rounded-5"
                    required />
                </div>
                <div className="mb-3">
                  <label>Tiempo estimado:</label>
                  <input
                    type="date"
                    name="tiempoEstimado"
                    value={formData.tiempoEstimado}
                    onChange={handleChange}
                    className="form-control rounded-5 py-2"
                    style={{ maxWidth: "550px" }}
                    required
                    // solo de hoy en adelante
                    min={new Date().toISOString().split("T")[0]} // Formato YYYY-MM-DD
                  />
                </div>
              </Row>
              <div className="mb-3">
                <label>Descripción:</label>
                <textarea
                  name="descripcion"
                  rows={4}
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="form-control rounded-4"
                  required />
              </div>
            </div>
            <div className="d-flex row justify-content-end px-4 mt-4">
              <Button className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1" type="submit">
                <IoMdAdd size={25} />Agregar
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

export default ModalAgregarOrden;
