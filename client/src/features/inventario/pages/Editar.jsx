import { useState, useEffect, useRef } from "react";
import SelectCategoria from "../components/SelectCategoria";
import SelectMarca from "../components/SelectMarca";
import SelectProveedor from "../components/SelectProveedor";
import SubirImagen from "../components/SubirImagen";
import SelectVehiculos from "../components/SelectVehiculos";
import { Grid, Row, Col } from "rsuite";
import "../styles/inv.css";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { IoMdReturnLeft } from "react-icons/io";
import { FaSave } from "react-icons/fa";
//URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const Editar = () => {
  const navigate = useNavigate(); // Hook para navegar
  const uploadRef = useRef(); // Referencia al componente SubirImagen
  const [preview, setPreview] = useState(null); // Estado para la URL de previsualización
  const { idProducto } = useParams();
  const [formData, setFormData] = useState({
    idProducto: parseInt(idProducto),
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
    porcentajeDescuento: parseInt(0),
    stockMinimo: parseInt(0) || ''
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/productos/${idProducto}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Agregar el token JWT en el header
          },
        });
        const fechaFormateada = res.data.fechaIngreso.split("T")[0]; // Formateo de fecha
        setFormData({ ...res.data, fechaIngreso: fechaFormateada }); // Carga los datos en el formulario
        // Si el producto ya tiene una imagen, se establece para la previsualización
        if (res.data.img) {
          setPreview(`${BASE_URL}/img/${res.data.img}`);
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error.message);
        if (error.response) {
          if (error.response.status === 401) {
            Swal.fire({
              icon: "warning",
              title: "Advertencia",
              text: "Operacion no Autorizada",
              showConfirmButton: false,
            });
            navigate(0); // Redirigir si no autorizado
          } else if (error.response.status === 403) {
            Swal.fire({
              icon: "warning",
              title: "Autenticación",
              text: "Sesión expirada",
              showConfirmButton: false,
            });
            localStorage.clear();
            navigate("/login"); // Redirigir si sesión expirada
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un error al obtener el producto",
              showConfirmButton: false,
            });
          }
        }
      }
    };

    cargarDatos();
  }, [idProducto]);


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

  //Verificaciones de campos
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

    // Solo intentar subir la imagen si el usuario ha seleccionado una NUEVA imagen
    // Es decir, si fileInfo en SubirImagen no es nulo Y es diferente de la imagen inicial
    if (uploadRef.current && uploadRef.current.hasNewFileSelected()) {
      const fileName = await uploadRef.current.uploadAll();
      if (fileName) {
        updatedFormData.img = fileName; // Se actualiza solo si hay un nuevo nombre de archivo
      } else {
        // Si la subida de una nueva imagen falló, podrías manejarlo aquí
        // Por ahora, simplemente no actualizamos updatedFormData.img
      }
    } else if (uploadRef.current && uploadRef.current.isImageCleared()) {
      // Esta condición es para si el usuario explícitamente borró la imagen
      updatedFormData.img = ""; // O un valor que indique que no hay imagen
    }
    // Si no se seleccionó una nueva imagen ni se borró la existente,
    // updatedFormData.img mantiene el valor original de formData.img

    axios.put(`${BASE_URL}/productos/actualizar-producto/`, updatedFormData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Producto editado correctamente",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          // Aquí podrías agregar alguna lógica si es necesario después del éxito
        });
      })
      .catch((error) => {
        console.error("Error al actualizar el producto:", error.message);
        if (error.response) {
          if (error.response.status === 401) {
            Swal.fire({
              icon: "warning",
              title: "Advertencia",
              text: "Operacion no Autorizada",
              showConfirmButton: false,
            });
            navigate(0); // Redirigir si no autorizado
          } else if (error.response.status === 403) {
            Swal.fire({
              icon: "warning",
              title: "Autenticación",
              text: "Sesión expirada",
              showConfirmButton: false,
            });
            localStorage.clear();
            navigate("/login"); // Redirigir si sesión expirada
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un error al editar el producto",
              showConfirmButton: false,
            });
          }
        }
      }).finally(() => {
        navigate(`/inventario-detalles/${idProducto}`); // Redirigir al detalle del producto después de la operación
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-auto p-3">
        <Grid fluid>
          <Row className="show-grid" gutter={24}>
            <Col xs={24} className="d-grid gap-5 bg-white shadow-sm p-5 rounded-3">
              {/* Contenedor principal */}
              <Row className="show-grid px-5" gutter={16}>
                {/* Columna de imagen */}
                <Col xs={6}>
                  <div className="position-relative">
                    <SubirImagen
                      ref={uploadRef}
                      preview={preview}
                      setPreview={setPreview}
                      currentImage={formData.img} // Pasa la imagen actual del producto
                      className="position-absolute top-0 end-0 p-2"
                    />
                  </div>
                </Col>

                {/* Primera columna de datos */}
                <Col xs={12} sm={6} className="">
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre:</label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      className="form-control rounded-5"
                      value={formData.nombre}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="marca" className="form-label">Marca:</label>
                    <SelectMarca
                      value={formData.marca}
                      onChange={handleChange}
                      className="rounded-5"
                    />
                  </div>
                  <div style={{ marginBottom: "11px" }}>
                    <label htmlFor="vehiculos" className="form-label">Vehículos compatibles:</label>
                    <SelectVehiculos
                      value={formData.vehiculosCompatibles}
                      onChange={handleChange}
                      className="rounded-5"
                    />
                  </div>
                  <div className="mt-2">
                    <label htmlFor="stockMinimo" className="form-label">Stock Mínimo:</label>
                    <input
                      type="number"
                      name="stockMinimo"
                      className="form-control rounded-5"
                      value={formData.stockMinimo ?? 0}
                      onChange={handleChange}
                    />
                  </div>
                </Col>

                {/* Segunda columna de datos */}
                <Col xs={12} sm={6} className="">
                  <div className="mb-3">
                    <label htmlFor="precio" className="form-label">Precio:</label>
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
                    <label htmlFor="fechaIngreso" className="form-label">Fecha de ingreso:</label>
                    <input
                      id="fechaIngreso"
                      name="fechaIngreso"
                      type="date"
                      className="form-control rounded-5 py-2"
                      value={formData.fechaIngreso}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="ubicacion" className="form-label">Ubicación en almacén:</label>
                    <input
                      id="ubicacionAlmacen"
                      name="ubicacionAlmacen"
                      type="text"
                      className="form-control rounded-5"
                      value={formData.ubicacionAlmacen}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="stock" className="form-label">Stock:</label>
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
                </Col>

                {/* Tercera columna de datos */}
                <Col xs={12} sm={6} className="">
                  <div className="mb-3">
                    <label htmlFor="tipo" className="form-label">Tipo:</label>
                    <select
                      id="tipo"
                      name="tipo"
                      className="form-select rounded-5"
                      value={formData.tipo}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione el tipo</option>
                      <option value="producto">Producto</option>
                      <option value="servicio">Servicio</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="porcentajeDescuento" className="form-label">Descuento:</label>
                    <input
                      type="number"
                      name="porcentajeDescuento"
                      className="form-control rounded-5"
                      value={formData.porcentajeDescuento}
                      onChange={handleChange}
                      placeholder="%"
                      max="90"
                      min="0"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="proveedor" className="form-label">Proveedor:</label>
                    <SelectProveedor
                      value={formData.proveedor}
                      onChange={handleChange}
                      className="rounded-5"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="categoria" className="form-label">Categoría:</label>
                    <SelectCategoria
                      value={formData.categoria}
                      onChange={handleChange}
                      className="rounded-5"
                    />
                  </div>
                </Col>
              </Row>

              {/* Fila de descripción y stock mínimo */}
              <Row className="px-5">
                <Col xs={6}></Col>
                <Col xs={18}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label htmlFor="descripcion" className="form-label">Descripción:</label>
                      <textarea
                        id="descripcion"
                        name="descripcion"
                        className="form-control rounded-4"
                        value={formData.descripcion}
                        onChange={handleChange}
                        rows={4}
                      />
                    </div>

                  </div>
                </Col>
              </Row>

              {/* Botones de acción */}
              <Row className="d-flex justify-content-end pe-5">
                <div className="d-flex justify-content-start col">
                  <Link to="/inventario" className="btn btn-secondary rounded-5">
                    <IoMdReturnLeft size="20" /> Volver
                  </Link>
                </div>
                <div className="ms-3">
                  <button
                    type="submit"
                    className="btn btn-primary rounded-5 d-flex align-items-center justify-content-center gap-1"
                    style={{ maxWidth: "120px", height: "31px" }}>
                    <FaSave size="20" /> Guardar </button>
                </div>
              </Row>
            </Col>
          </Row>
        </Grid>
      </div>
    </form>
  );
};

export default Editar;
