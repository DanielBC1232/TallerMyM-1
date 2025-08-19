import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import EditarTrabajadorModal from "../components/EditarTrabajadorModal.jsx";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

// URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const ListaTrabajadores = ({ formData, trigger }) => {
  const [datos, setDatos] = useState([]);

  // Estado para controlar el modal y los datos del trabajador seleccionado
  const [showModal, setShowModal] = useState(false);
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState(null);

  // Obtener trabajadores al montar el componente o cuando se actualiza el trigger
  useEffect(() => {
    const getTrabajadores = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/trabajadores/obtener-trabajadores/`,
          //Seccion de validacion del token
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Añadir JWT en el header
            },
          }
        );
        setDatos(data);


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
    getTrabajadores();
  }, [formData, trigger]);


  //funcion obtener

  // Función para eliminar trabajador con confirmación
  async function deleteTrabajador(id) {
    const result = await Swal.fire({
      text: "¿Seguro que desea eliminar este trabajador?",
      icon: "error",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-danger text-white rounded-5",
        cancelButton: "btn btn-secondary text-white rounded-5",
      },
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`${BASE_URL}/trabajadores/eliminar-trabajador/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.status === 200) {
          await Swal.fire({
            icon: "success",
            title: "Trabajador eliminado correctamente",
            showConfirmButton: false,
            timer: 1500,
          });

          setDatos(datos.filter((t) => t.idTrabajador !== id));
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al eliminar trabajador",
            showConfirmButton: false,
            timer: 1000,
          });
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            Swal.fire("Advertencia", "Operación no Autorizada", "warning");
            window.location.reload();
          } else if (error.response.status === 403) {
            Swal.fire("Autenticación", "Sesión expirada", "warning");
            localStorage.clear();
            window.location.href = "/login";
          } else if (error.response.status === 409) {
            Swal.fire("Advertencia", "La cédula ya está registrada", "warning");
          } else {
            console.error(error);
            Swal.fire("Error", "Hubo un error al eliminar el trabajador", "error");
          }
        } else {
          console.error(error);
          Swal.fire("Error", "Hubo un problema con la conexión", "error");
        }
      }
    }
  }

  //Fin

  // Abrir modal de edición con datos del trabajador
  const handleOpenModal = (trabajador) => {
    setTrabajadorSeleccionado(trabajador);
    setShowModal(true);
  };

  return (
    <div className="">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Cédula</th>
            <th>Salario</th>
            <th>Seguro Social</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {datos.map((trabajador, index) => (
            <tr key={index}>
              <td>{trabajador.nombreCompleto}</td>
              <td>{trabajador.cedula}</td>
              <td>{"₡ " + trabajador.salario}</td>
              <td>{trabajador.seguroSocial}</td>
              <td>
                <div className="d-flex gap-3">
                  <button type="button"
                    onClick={() => deleteTrabajador(trabajador.idTrabajador)}
                    className="btn btn-danger text-white rounded-5 d-flex align-items-center justify-content-center gap-1">
                    <MdDelete size={20} />
                  </button>
                  <button className="btn btn-outline-warning text-white rounded-5 d-flex align-items-center justify-content-center gap-1"
                    onClick={() => handleOpenModal(trabajador)}>
                    <MdEdit size={20} /> Editar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edición (solo si hay un trabajador seleccionado) */}
      {showModal && trabajadorSeleccionado && (
        <EditarTrabajadorModal
          show={showModal}
          onClose={() => setShowModal(false)}
          trabajador={trabajadorSeleccionado}
          onSave={(actualizado) => {
            // Actualizar la lista local con el trabajador actualizado
            setDatos((prev) =>
              prev.map((t) =>
                t.idTrabajador === actualizado.idTrabajador ? actualizado : t
              )
            );
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ListaTrabajadores;
