import { useState, useRef } from "react";
import SelectCategoria from "../components/SelectCategoria";
import SelectMarca from "../components/SelectMarca";
import SelectProveedor from "../components/SelectProveedor";
import SelectVehiculos from "../components/SelectVehiculos";
import { Grid, Row, Col } from "rsuite";
import "../styles/inv.css";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { IoMdReturnLeft } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";
import SubirImagen from "../components/SubirImagen";
//URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const Agregar = () => {
  const navigate = useNavigate(); // Hook para navegar
  const uploadRef = useRef(); // Referencia al componente SubirImagen
  const [preview, setPreview] = useState(null);// Hook para navegar
  const [formData, setFormData] = useState({
    nombre: "",
    marca: "",
    descripcion: "",
    precio: parseFloat(0.00) || '',
    stock: parseInt(0) || '',
    fechaIngreso: "",
    ubicacionAlmacen: "",
    proveedor: "",
    categoria: "",
    vehiculosCompatibles: [],
    img: "",
    tipo: "",
    stockMinimo: parseInt(0) || ''
  });

  const errorNotification = (message) => {
    Swal.fire({
      text: message,
      icon: "error",
      showConfirmButton: false,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "precio" || name === "stock"
          ? Number(value)
          : name === "vehiculosCompatibles"
            ? JSON.stringify(value)
            : value,
    });
  };

  // --- Verificaciones de campos ---
  const verificarNombre = () => {
    var pass = false;
    //Campo Nombre
    if (!formData.nombre.trim()) {
      nombre.classList.remove("is-valid");
      nombre.classList.add("is-invalid");
      pass = false;
      errorNotification("Campo de nombre vacío");
    } else if (formData.nombre.trim()) {
      nombre.classList.remove("is-invalid");
      nombre.classList.add("is-valid");
      pass = true;
    }

    return pass;
  };

  const verificarMarca = () => {
    var pass = false;
    //Campo Marca
    if (!formData.marca.trim()) {
      marca.classList.remove("is-valid");
      marca.classList.add("is-invalid");
      pass = false;
      errorNotification("Seleccione una marca");
    } else if (formData.marca.trim()) {
      marca.classList.remove("is-invalid");
      marca.classList.add("is-valid");
      pass = true;
    }
    return pass;
  };

  const verificarPrecio = () => {
    var pass = false;
    //Campo Precio
    if (!formData.precio) {
      precio.classList.remove("is-valid");
      precio.classList.add("is-invalid");
      pass = false;
      errorNotification("Digite el precio");
    } else if (formData.precio) {
      precio.classList.remove("is-invalid");
      precio.classList.add("is-valid");
      pass = true;
    }
    return pass;
  };

  const verificarFechaIngreso = () => {
    var pass = false;
    //Campo Fecha Ingreso
    if (!formData.fechaIngreso.trim()) {
      fechaIngreso.classList.remove("is-valid");
      fechaIngreso.classList.add("is-invalid");
      pass = false;
      errorNotification("Digite la fecha de ingreso");
    } else if (formData.marca.trim()) {
      fechaIngreso.classList.remove("is-invalid");
      fechaIngreso.classList.add("is-valid");
      pass = true;
    }
    return pass;
  };

  const verificarVehiculosCompatibles = () => {
    var pass = false;
    //Campo Fecha Vehiculos compatibles
    if (formData.vehiculosCompatibles.length == 0) {
      pass = false;
      errorNotification("Seleccione al menos un vehiculo compatible");
    } else if (formData.vehiculosCompatibles.length > 0) {
      pass = true;
    }
    return pass;
  };

  const verificarUbicacion = () => {
    var pass = false;
    //Campo Ubicacion en almacen
    if (!formData.ubicacionAlmacen.trim()) {
      ubicacionAlmacen.classList.remove("is-valid");
      ubicacionAlmacen.classList.add("is-invalid");
      pass = false;
      errorNotification("Escriba la ubicación en almacén");
    } else if (formData.ubicacionAlmacen.trim()) {
      ubicacionAlmacen.classList.remove("is-invalid");
      ubicacionAlmacen.classList.add("is-valid");
      pass = true;
    }
    return pass;
  };

  const verificarCategoria = () => {
    var pass = false;
    //Campo Categoria
    if (!formData.categoria.trim()) {
      categoria.classList.remove("is-valid");
      categoria.classList.add("is-invalid");
      pass = false;
      errorNotification("Seleccione una categoria");
    } else if (formData.categoria.trim()) {
      categoria.classList.remove("is-invalid");
      categoria.classList.add("is-valid");
      pass = true;
    }

    return pass;
  };

  const verificarStock = () => {
    var pass = false;
    //Campo Stock
    if (!formData.stock) {
      stock.classList.remove("is-valid");
      stock.classList.add("is-invalid");
      pass = false;
      errorNotification("Digite el stock");
    } else if (formData.stock) {
      stock.classList.remove("is-invalid");
      stock.classList.add("is-valid");
      pass = true;
    }

    return pass;
  };

  const verificarProveedor = () => {
    var pass = false;
    //Campo Proveedor
    if (!formData.proveedor.trim()) {
      proveedor.classList.remove("is-valid");
      proveedor.classList.add("is-invalid");
      pass = false;
      errorNotification("Seleccione el proveedor");
    } else if (formData.proveedor.trim()) {
      proveedor.classList.remove("is-invalid");
      proveedor.classList.add("is-valid");
      pass = true;
    }
    return pass;
  };

  const verificarDescripcion = () => {
    var pass = false;
    //Campo Descripcion
    if (!formData.descripcion.trim()) {
      descripcion.classList.remove("is-valid");
      descripcion.classList.add("is-invalid");
      pass = false;
      errorNotification("Campo de descripcion vacío");
    } else if (formData.descripcion.trim()) {
      descripcion.classList.remove("is-invalid");
      descripcion.classList.add("is-valid");
      pass = true;
    }
    return pass;
  };

  const verificarTipo = () => {
    var pass = false;
    //Campo Descripcion
    if (!formData.tipo.trim()) {
      tipo.classList.remove("is-valid");
      tipo.classList.add("is-invalid");
      pass = false;
      errorNotification("Debe seleccionar el tipo");
    } else if (formData.tipo.trim()) {
      tipo.classList.remove("is-invalid");
      tipo.classList.add("is-valid");
      pass = true;
    }
    return pass;
  };

  // VERIFICACION GENERAL
  const verificacion = () => {
    var pass = false;
    //Verificar que todos los campos sean validos
    if (
      verificarNombre() &&
      verificarPrecio() &&
      verificarMarca() &&
      verificarFechaIngreso() &&
      verificarVehiculosCompatibles() &&
      verificarUbicacion() &&
      verificarCategoria() &&
      verificarStock() &&
      verificarProveedor() &&
      verificarDescripcion() &&
      verificarTipo()
    ) {
      pass = true;
    } else {
      pass = false;
    }
    return pass;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!verificacion()) return;

    let updatedFormData = { ...formData };

    //Subir la imagen si hay una nueva seleccionada
    if (uploadRef.current) {
      const fileName = await uploadRef.current.uploadAll();
      if (fileName) {
        updatedFormData.img = fileName; // Actualiza el nombre de la imagen en los datos
      } else if (preview === null && formData.img) {
        // Si el usuario borró la imagen y no subió una nueva
        updatedFormData.img = ""; // O un valor que indique que no hay imagen
      }
    }
    try {
      axios.post(
        `${BASE_URL}/productos/agregar-producto/`, updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT al header
          }
        }
      ).then((res) => {
        Swal.fire({
          icon: "success",
          title: "¡Producto agregado!",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          navigate("/inventario");
        });
      }).catch((error) => {
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
            Swal.fire({
              icon: "error",
              title: "Error al agregar un producto / servicio",
              text: error.response.data || error.message,
              showConfirmButton: false,
              timer: 1000,
            });
          }
        } else {
          // Manejo de errores desconocidos
          Swal.fire({
            icon: "error",
            title: "Error desconocido",
            text: error.message,
            showConfirmButton: false,
            timer: 1000,
          });
        }
      });
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      Swal.fire({
        icon: "error",
        title: "Error al subir la imagen",
        text: error.message,
        showConfirmButton: false,
        timer: 1000,
      });
    };
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-auto p-5">
        <Grid fluid>
          <Row className="show-grid" gutter={24}>
            <Col xs={24} className="d-grid gap-5 bg-white shadow-sm p-5 rounded-3">
              <Row className="show-grid px-3" gutter={16}>

                <Col xs={6}>
                  <div className="position-relative">
                    <SubirImagen
                      ref={uploadRef}
                      preview={preview}
                      setPreview={setPreview}
                      className="position-absolute top-0 end-0 p-2"
                    />
                  </div>
                </Col>

                <Col xs={12} sm={6} className="">
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">
                      Nombre:
                    </label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      className="form-control rounded-5"
                      value={formData.nombre}
                      onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="marca" className="form-label">
                      Marca:
                    </label>
                    <SelectMarca
                      value={formData.marca}
                      onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="vehiculos" className="form-label">
                      Vehículos compatibles:
                    </label>
                    <SelectVehiculos
                      value={formData.vehiculosCompatibles}
                      onChange={handleChange} />
                  </div>
                </Col>
                <Col xs={12} sm={6} className="">
                  <div className="mb-3">
                    <label htmlFor="precio" className="form-label">
                      Precio:
                    </label>
                    <input
                      placeholder="CRC"
                      id="precio"
                      name="precio"
                      type="number"
                      min={0}
                      step={0.01}
                      className="form-control rounded-5"
                      value={formData.precio || ''}
                      onChange={(e) => handleChange(e, 'precio')} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="categoria" className="form-label">
                      Categoría:
                    </label>
                    <SelectCategoria
                      value={formData.categoria}
                      onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="ubicacion" className="form-label">
                      Ubicación en almacén:
                    </label>
                    <input
                      id="ubicacionAlmacen"
                      name="ubicacionAlmacen"
                      type="text"
                      className="form-control rounded-5"
                      value={formData.ubicacion}
                      onChange={handleChange} />
                  </div>
                </Col>
                <Col xs={12} sm={6} className="">
                  <div className="mb-3">
                    <label htmlFor="fechaIngreso" className="form-label">
                      Fecha de ingreso:
                    </label>
                    <input
                      id="fechaIngreso"
                      name="fechaIngreso"
                      type="date"
                      className="form-control rounded-5 py-2"
                      value={formData.fechaIngreso}
                      onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="stock" className="form-label mb-3">
                      Stock:
                    </label>
                    <input
                      id="stock"
                      name="stock"
                      type="number"
                      placeholder="  #"
                      min={0}
                      className="form-control rounded-5"
                      value={formData.stock || ''}
                      onChange={(e) => handleChange(e, 'stock')} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="proveedor" className="form-label">Proveedor:</label>
                    <SelectProveedor value={formData.proveedor} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="tipo" className="form-label">
                      Tipo:
                    </label>
                    <select
                      id="tipo"
                      name="tipo"
                      className="form-select rounded-5"
                      value={formData.tipo}
                      onChange={handleChange}>
                      <option value="">Seleccione...</option>
                      <option selected value="producto">Producto</option>
                      <option value="servicio">Servicio</option>
                    </select>
                  </div>
                </Col>
              </Row>
              <Row className="px-5">
                <Col xs={6}></Col>
                <Col xs={18}>
                  <div className="row">
                    <div className="mb-3">
                      <label htmlFor="descripcion" className="form-label">
                        Descripción:
                      </label>
                      <textarea
                        id="descripcion"
                        rows="4"
                        name="descripcion"
                        className="form-control rounded-4"
                        value={formData.descripcion}
                        onChange={handleChange} />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="d-flex justify-content-end pe-5">
                <div className="">
                  <Link to="/inventario" className="btn btn-secondary rounded-5">
                    <IoMdReturnLeft size="20" /> Volver
                  </Link>
                </div>
                <div className="ms-3">
                  <button type="submit" className="btn btn-primary rounded-5" style={{ maxWidth: "120px" }}>
                    <IoMdAdd size="20" /> Agregar
                  </button>
                </div>
              </Row>
            </Col>
          </Row>
        </Grid>
      </div>
    </form >

  );
};

export default Agregar;
