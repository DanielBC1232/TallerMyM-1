import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Schema } from "rsuite";
import Swal from "sweetalert2";
import "../styles/form.css";
import { IoIosSave } from "react-icons/io";

export const BASE_URL = import.meta.env.VITE_API_URL;
const { StringType } = Schema.Types;

const model = Schema.Model({
  nombre: StringType().isRequired("El nombre es obligatorio"),
  apellido: StringType().isRequired("El apellido es obligatorio"),
  cedula: StringType().isRequired("La cédula es obligatoria"),
  correo: StringType().isEmail("Correo inválido").isRequired("El correo es obligatorio"),
  telefono: StringType().isRequired("El teléfono es obligatorio")
});

const EditarCliente = () => {
  const { cedula } = useParams();
  const navigate = useNavigate();
  const formRef = useRef();

  const [formValue, setFormValue] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    correo: "",
    telefono: ""
  });

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const res = await fetch(`${BASE_URL}/clientes/${cedula}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Añadir JWT en los headers
          },
        });

        if (!res.ok) throw new Error("No se pudo obtener el cliente");

        const data = await res.json();
        setFormValue(data);
      } catch (err) {
        console.error(err);

        // Manejo de errores HTTP
        if (err.message.includes("401")) {
          Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "Operación no Autorizada",
            showConfirmButton: false,
          });
          window.location.reload(); // Recarga la página si no está autorizado
        } else if (err.message.includes("403")) {
          Swal.fire({
            icon: "warning",
            title: "Autenticación",
            text: "Sesión expirada",
            showConfirmButton: false,
          });
          localStorage.clear();
          window.location.href = "/login"; // Redirige al login si la sesión ha expirado
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo cargar la información del cliente",
            showConfirmButton: false,
          });
        }
      }
    };

    fetchCliente();
  }, [cedula]);

  const handleSubmit = async () => {
    if (!formRef.current.check()) {
      Swal.fire({
        icon: "warning",
        title: "Validación",
        text: "Por favor complete el formulario correctamente",
        showConfirmButton: false,

      });
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/clientes/editar/${cedula}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Añadir JWT en los headers
        },
        body: JSON.stringify(formValue)
      });

      if (!res.ok) {
        if (res.status === 409) {
          Swal.fire({
            icon: "warning",
            title: "Cédula duplicada",
            text: "Ya existe un cliente con esa cédula",
            showConfirmButton: false,

          });
        } else if (res.status === 401) {
          Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "Operación no autorizada",
            showConfirmButton: false
          });
          window.location.reload(); // Recarga la página si no está autorizado
        } else if (res.status === 403) {
          Swal.fire({
            icon: "warning",
            title: "Sesión expirada",
            text: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
            showConfirmButton: false
          });
          localStorage.clear();
          window.location.href = "/login"; // Redirige al login si la sesión ha expirado
        } else {
          throw new Error("Error al actualizar");
        }
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Cliente actualizado correctamente",
        showConfirmButton: false,
        timer: 1500
      });
      navigate("/clientes");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al actualizar el cliente",
        showConfirmButton: false,
      });
    }

  };

  return (
    <div className="form-container">
      <div className="d-flex justify-content-center flex-column p-0">
        <h2 className="text-success font-bold mb-4 py-0">Editar Cliente</h2>
        <hr className="text-success py-0 px-2" />
      </div>
      <Form className="p-3" ref={formRef} model={model} onChange={setFormValue}
        formValue={formValue} fluid>
        <Form.Group>
          <Form.ControlLabel>Nombre</Form.ControlLabel>
          <Form.Control className="rounded-5" name="nombre" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Apellido</Form.ControlLabel>
          <Form.Control className="rounded-5" name="apellido" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Cédula</Form.ControlLabel>
          <Form.Control className="rounded-5" name="cedula" readOnly disabled/>
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Correo</Form.ControlLabel>
          <Form.Control className="rounded-5" name="correo" type="email"  />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Teléfono</Form.ControlLabel>
          <Form.Control className="rounded-5" name="telefono" />
        </Form.Group>
        <Form.Group className="row px-2">
          <Button className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1" onClick={handleSubmit}>
            <IoIosSave size={20} />Guardar Cambios
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default EditarCliente;
