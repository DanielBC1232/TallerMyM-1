import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Grid, Row, Col } from "rsuite";
import Swal from "sweetalert2";
import { BrowserRouter as Router, useNavigate, Link } from "react-router-dom";
import { Image } from "rsuite";
import { IoMdReturnLeft } from "react-icons/io";
import "../styles/inv.css";
import { MdDelete } from "react-icons/md";
import { MdModeEdit } from "react-icons/md";
//URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const Detalles = () => {
  const navigate = useNavigate(); // Hook para navegar
  const { idProducto } = useParams();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/productos/${idProducto}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT al header
            }
          }
        );
        setProducto(data);
      } catch (error) {
        if (error.response) {
          // Manejo de errores HTTP
          if (error.response.status === 401) {
            Swal.fire({
              icon: "warning",
              title: "Advertencia",
              text: "Operacion no Autorizada",
              showConfirmButton: false,
            });
            navigate(0); // Redirige si no está autorizado
          }
          else if (error.response.status === 403) {
            Swal.fire({
              icon: "warning",
              title: "Autenticación",
              text: "Sesión expirada",
              showConfirmButton: false,
            });
            localStorage.clear();
            navigate("/login"); // Redirige si la sesión ha expirado
          } else {
            console.error("Error al obtener el producto:", error);
          }
        } else {
          // Manejo de errores desconocidos
          console.error("Error al obtener el producto:", error);
        }
      }
    };

    obtenerProducto(); // Llamar la función para obtener el producto
  }, [idProducto]);


  if (!producto) return <p>Cargando...</p>;

  const normalizarVehiculosCompatibles = (vehiculos) => {
    if (Array.isArray(vehiculos)) {
      //si es array (mas de un elemento)
      return vehiculos.replace(/[\[\]"]/g, "").replace(/,/g, ", "); //expresion regular para convertir a string
    } else {
      try {
        //si es string (un solo elemento)
        return vehiculos.replace(/[\[\]"]/g, "").replace(/,/g, ", "); //expresion regular para convertir a string
      } catch (error) {
        return []; // Si falla, un array vacío
      }
    }
    //Se usa expresion regular en lugar de parseos porque cuando el array tiene un solo elemento es string normal pero cuando
    //tiene mas de uno es un array, es decir que el tipo cambia dependiendo si es uno o mas elementos en el array, y esto da problemas al parsear.
  };

  //toma el valor del array y usa la funcion para pasar a string legible.
  const vehiculos = normalizarVehiculosCompatibles(
    producto.vehiculosCompatibles
  );

  //Eliminar
  const Eliminar = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Este producto o servicio será eliminado permanentemente!",
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn btn-danger rounded-5 me-3',
        cancelButton: 'btn btn-secondary rounded-5'
      },
      buttonsStyling: false,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `${BASE_URL}/productos/eliminar-producto/${idProducto}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT en el encabezado
              }
            }
          )
          .then(() => {
            // Redirigir a la página de inventario después de eliminar
            Swal.fire({
              icon: "success",
              title: "Producto eliminado",
              text: "El producto o servicio ha sido eliminado correctamente.",
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              navigate("/inventario");
            });
          })
          .catch((error) => {
            if (error.response) {
              // Manejo de errores HTTP
              if (error.response.status === 401) {
                Swal.fire({
                  icon: "warning",
                  title: "Advertencia",
                  text: "No estás autorizado para realizar esta acción",
                  showConfirmButton: false,
                });
                navigate(0); // Redirige si no está autorizado
              } else if (error.response.status === 403) {
                Swal.fire({
                  icon: "warning",
                  title: "Sesión expirada",
                  text: "Tu sesión ha expirado, por favor inicia sesión nuevamente",
                  showConfirmButton: false,
                });
                localStorage.clear();
                navigate("/login"); // Redirige al login si la sesión expiró
              } else {
                Swal.fire({
                  title: "Error",
                  text: "Error al eliminar producto o servicio",
                  icon: "error",
                  showCancelButton: false,
                  
                });
                console.error("Error al eliminar producto:", error);
              }
            } else {
              // Manejo de otros errores
              Swal.fire({
                title: "Error",
                text: "Error desconocido al eliminar el producto",
                icon: "error",
                showCancelButton: false,
              });
              console.error("Error al eliminar producto:", error);
            }
          });
      }
    });
  };

  //url get imagen
  const getImg = (img) => img ? `${BASE_URL}/img/${img}` : "/noResult.png";

  return (
    <div className="mx-auto p-3">
      <Grid fluid>
        <Row className="show-grid" gutter={24}>
          <Col xs={24} className="d-grid gap-5 bg-white shadow-sm p-5 rounded-3">
            <Row className="show-grid px-5" gutter={16}>
              {/* Columna de imagen */}
              <Col xs={6}>
                <div className="position-relative">
                  <Image
                    src={getImg(producto.img)}
                    fallbackSrc="https://placehold.co/300x200"
                    alt="nonexistent-image"
                    width={300}
                    className="position-absolute top-0 end-0 p-2"
                  />
                </div>
              </Col>

              {/* Primera columna de datos */}
              <Col xs={12} sm={6} className="">
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre:</label>
                  <input
                    type="text"
                    className="form-control rounded-5"
                    value={producto.nombre}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="marca" className="form-label">Marca:</label>
                  <input
                    type="text"
                    className="form-control rounded-5"
                    value={producto.marca}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="vehiculos" className="form-label">Vehículos compatibles:</label>
                  <input
                    type="text"
                    className="form-control rounded-5"
                    value={vehiculos}
                    readOnly
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="stockMinimo" className="form-label">Stock Mínimo:</label>
                  <input
                    type="number"
                    name="stockMinimo"
                    className="form-control rounded-5"
                    value={producto.stockMinimo ?? 0}
                    readOnly
                    placeholder="Sin asignar"
                  />
                </div>
              </Col>

              {/* Segunda columna de datos */}
              <Col xs={12} sm={6} className="">
                <div className="mb-3">
                  <label htmlFor="precio" className="form-label">Precio:</label>
                  <input
                    type="number"
                    className="form-control rounded-5"
                    value={producto.precio}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="fechaIngreso" className="form-label">Fecha de ingreso:</label>
                  <input
                    type="text"
                    className="form-control rounded-5"
                    value={new Date(producto.fechaIngreso).toLocaleDateString("es-CR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="ubicacion" className="form-label">Ubicación en almacén:</label>
                  <input
                    type="text"
                    className="form-control rounded-5"
                    value={producto.ubicacionAlmacen}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="stock" className="form-label">Stock:</label>
                  <input
                    type="number"
                    className="form-control rounded-5"
                    value={producto.stock}
                    readOnly
                  />
                </div>

              </Col>

              {/* Tercera columna de datos */}
              <Col xs={12} sm={6} className="">
                <div className="mb-3">
                  <label htmlFor="serviceProduct" className="form-label">Tipo:</label>
                  <input
                    type="text"
                    className="form-control rounded-5"
                    value={producto.tipo}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label">Descuento:</label>
                  <input
                    type="text"
                    name="porcentajeDescuento"
                    className="form-control rounded-5"
                    value={`${producto.porcentajeDescuento ?? 0}%`}
                    placeholder="Sin descuento"
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="proveedor" className="form-label">Proveedor:</label>
                  <input
                    type="text"
                    className="form-control rounded-5"
                    value={producto.proveedor}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="categoria" className="form-label">Categoría:</label>
                  <input
                    type="text"
                    className="form-control rounded-5"
                    value={producto.categoria}
                    readOnly
                  />
                </div>
              </Col>
            </Row>
            {/* Descripción y botones */}
            <Row className="px-5">
              <Col xs={6}></Col>
              <Col xs={18}>
                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label">Descripción:</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    className="form-control rounded-4"
                    value={producto.descripcion}
                    readOnly
                    rows={4}
                  />
                </div>
              </Col>
            </Row>

            <Row className="d-flex justify-content-end pe-5">
              <div className="d-flex justify-content-start col">
                <Link to="/inventario" className="btn btn-secondary rounded-5 d-flex align-items-center justify-content-center gap-1">
                  <IoMdReturnLeft size="20" /> Volver
                </Link>
              </div>
              <div className="">
                <button
                  onClick={Eliminar}
                  className="btn btn-danger text-white rounded-5 d-flex align-items-center justify-content-center gap-1"
                  style={{ maxWidth: "120px", height: "31px" }}>
                  <MdDelete size="20" /> Eliminar
                </button>
              </div>
              <div className="ms-3">
                <Link
                  to={`/inventario-editar/${idProducto}`}
                  className="btn btn-warning text-white rounded-5 d-flex align-items-center justify-content-center gap-1"
                  style={{ maxWidth: "120px", height: "31px" }}
                ><MdModeEdit size="20" /> Editar</Link>
              </div>
            </Row>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

export default Detalles;
