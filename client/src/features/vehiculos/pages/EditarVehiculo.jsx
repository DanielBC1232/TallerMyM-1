import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SelectClientes from "../../clientes/components/SelectClientes";
import Swal from "sweetalert2";
import { IoMdSave } from "react-icons/io";

// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const EditarVehiculo = () => {
  const { idVehiculo } = useParams();
  const navigate = useNavigate();

  const [vehiculo, setVehiculo] = useState({
    placaVehiculo: "",
    modeloVehiculo: "",
    marcaVehiculo: "",
    annoVehiculo: "",
    tipoVehiculo: "",
    idCliente: "",
  });

  // Obtener los datos del vehiculo al cargar el componente
  useEffect(() => {
    const obtenerVehiculo = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/vehiculos/ObteneridVehiculo/${idVehiculo}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT en el header
          }
        });
        setVehiculo(response.data); // Establecer los datos del vehículo en el estado
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
            navigate(0); // Redirigir a la página de login si no está autorizado
          } else if (error.response.status === 403) {
            Swal.fire({
              icon: "warning",
              title: "Autenticación",
              text: "Sesión expirada",
              showConfirmButton: false,
            });
            localStorage.clear();
            navigate("/login"); // Redirigir a login si la sesión ha expirado
          } else {
            console.error("Error al obtener el Vehículo:", error);
            Swal.fire("Error", "Error al obtener los datos del Vehículo", "error");
          }
        } else {
          // Si no hay respuesta del servidor
          console.error(error);
          Swal.fire("Error", "Error al obtener los datos del Vehículo", "error");
        }
      }

    };
    obtenerVehiculo();
  }, [idVehiculo]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehiculo({ ...vehiculo, [name]: value });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_URL}/vehiculos/editar/${idVehiculo}`, vehiculo, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT en el header
        }
      });
      Swal.fire("Éxito", "Vehículo actualizado exitosamente", "success");
      navigate("/vehiculos"); // Redirigir a la lista de vehículos después de actualizar
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
          navigate(0); // Redirigir a la página de login si no está autorizado
        } else if (error.response.status === 403) {
          Swal.fire({
            icon: "warning",
            title: "Autenticación",
            text: "Sesión expirada",
            showConfirmButton: false,
          });
          localStorage.clear();
          navigate("/login"); // Redirigir a login si la sesión ha expirado
        } else {
          console.error("Error al actualizar el vehículo:", error);
          Swal.fire("Error", "Error al actualizar el vehículo", "error");
        }
      } else {
        // Si no hay respuesta del servidor
        console.error(error);
        Swal.fire("Error", "Error al actualizar el vehículo", "error");
      }
    }
  };

  return (
    <div className="form-container p-4 rounded-4">
      <div className="d-flex justify-content-center flex-column p-0">
        <h2 className="text-success font-bold mb-4 py-0">Editar Vehículo</h2>
        <hr className="text-success py-0 px-2" />
      </div>
      <form onSubmit={handleSubmit} >
        <div className="d-flex justify-content-center flex-column gap-3 p-3">
          <div>
            <label className="d-flex">Placa Vehículo:</label>
            <input
              type="text"
              name="placaVehiculo"
              value={vehiculo.placaVehiculo}
              onChange={handleChange}
              className="form-control rounded-5"
              required />
          </div>
          <div>
            <label className="d-flex">Modelo del Vehículo:</label>
            <input
              type="text"
              name="modeloVehiculo"
              value={vehiculo.modeloVehiculo}
              onChange={handleChange}
              className="form-control rounded-5"
              required />
          </div>
          <div>
            <label className="d-flex">Marca del Vehículo:</label>
            <input
              type="text"
              name="marcaVehiculo"
              value={vehiculo.marcaVehiculo}
              onChange={handleChange}
              className="form-control rounded-5"
              required />
          </div>
          <div>
            <label className="d-flex">Año del Vehículo:</label>
            <input
              type="text"
              name="annoVehiculo"
              value={vehiculo.annoVehiculo}
              onChange={handleChange}
              className="form-control rounded-5"
              required />
          </div>
          <div>
            <label className="d-flex">Tipo de Vehículo:</label>
            <input
              type="text"
              name="tipoVehiculo"
              value={vehiculo.tipoVehiculo}
              onChange={handleChange}
              className="form-control rounded-5"
              required />
          </div>
          <div>
            <label className="d-flex">Cliente:</label>
            <SelectClientes
              value={vehiculo.idCliente}
              onChange={handleChange}
              className="form-control rounded-5"/>
          </div>

          <button type="submit" className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1">
            <IoMdSave size={20} />Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarVehiculo;
