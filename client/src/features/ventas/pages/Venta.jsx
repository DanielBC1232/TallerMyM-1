import "../styles/ven.css";
import { useState, useEffect } from "react";
import { Text, Row, Col, Modal } from "rsuite";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SelectProductos from "../components/SelectProductos";
import ListaProductosVenta from "../components/ListaProductosVenta";
import Swal from "sweetalert2";
import Pago from "../components/Pago";
import Devolucion from "../components/Devolucion";
import { IoMdAdd } from "react-icons/io";
import { MdPayment } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { TbCreditCardPay } from "react-icons/tb";
import { prefix } from "rsuite/esm/internals/utils";

export const BASE_URL = import.meta.env.VITE_API_URL;

const Venta = () => {
  const { idVenta } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [ventaConsumada, setVentaConsumada] = useState(false);
  const [monto, setMonto] = useState(null); // Pago
  const [formDataDevolucion, setFormDataDevolucion] = useState({
    idVenta: parseInt(idVenta),
    monto: monto, // Asignar el monto obtenido del pago
    motivo: ""
  });
  const [openDevolucion, setOpenDevolucion] = useState(false);

  // Estado general para la venta (detalles)
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/ventas/obtener-venta/${idVenta}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}` // Añadimos el JWT en el header
          }
        });
        setFormData(data);
        setVentaConsumada(data.ventaConsumada)

      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            Swal.fire({
              icon: "warning",
              title: "Advertencia",
              text: "Operacion no Autorizada",
              showConfirmButton: false,
            });
            navigate(0); // Redirige o recarga si no está autorizado
          } else if (error.response.status === 403) {
            Swal.fire({
              icon: "warning",
              title: "Sesión expirada",
              text: "Su sesión ha expirado, por favor inicie sesión nuevamente",
              showConfirmButton: false,
            });
            localStorage.clear();
            navigate("/login"); // Redirige al login si la sesión ha expirado
          } else {
            // Otros errores del servidor
            console.error("Error al obtener datos:", error);
          }
        } else {
          // Errores que no son respuestas del servidor
          console.error("Error al obtener datos:", error);
        }
      }

    };
    const obtenerMonto = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/finanzas/obtener-pago/${idVenta}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}` // Añadimos el JWT en el header
          }
        });
        setMonto(data.monto); // Asignamos el monto recibido
      } catch (error) {
        console.error("Error al obtener el monto:", error);
      }
    }
    if (idVenta) obtenerDatos()
    obtenerMonto(); // Llamamos a la función para obtener los datos y el monto si idVenta está definido
  }, [idVenta]);

  useEffect(() => {
    //actualizar el estado de formDataDevolucion con el monto obtenido
    setFormDataDevolucion((prev) => ({
      ...prev,
      monto: monto // Asignar el monto obtenido del pago
    }));

  }, [monto]); // Dependencia para actualizar cuando el monto cambie

  /* ============= PAGO ============= */
  const [formDataPago, setFormDataPago] = useState({
    idVenta: parseInt(idVenta),
    monto: 0,
    dineroVuelto: 0,
    metodoPago: "",
    subtotal: 0,
    iva: 0,
    total: 0
  });
  const [openPago, setOpenPago] = useState(false);

  const handleChangePago = (e) => {
    const { name, value } = e.target;

    setFormDataPago((prev) => {
      const newPago = {
        ...prev,
        [name]: isNaN(value) || value.trim() === "" ? value : parseInt(value, 10),
      };
      handleUpdateMontoTotal(newPago.subtotal);

      return newPago;
    });
  };

  const GenerarPago = (id) => {
    setFormDataPago((prev) => ({
      ...prev,
      idVenta: parseInt(id),
    }));
    setOpenPago(true);
  };

  const verificarMetodoPago = () => {
    if (!formDataPago.metodoPago.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Debe seleccionar un método de pago",
      });
      return false;
    }
    return true;
  };

  const verificarLista = () => {
    if (formDataPago.total == 0) {
      Swal.fire({
        icon: "warning",
        title: "Debe seleccionar al menos un producto",
      });
      return false;
    }
    return true;
  };

  const verificarPagoCompleto = () => {
    const { monto, total } = formDataPago;
    if (monto < total) {
      Swal.fire({ icon: "warning", title: "Monto insuficiente" });
      return false;
    }
    setFormDataPago(prev => ({
      ...prev,
      dineroVuelto: parseFloat((monto - total).toFixed(2))
    }));
    return true;
  };

  const handleSubmitPago = async (e) => {
    e.preventDefault();

    if (verificarLista() && verificarMetodoPago() && verificarPagoCompleto()) {
      try {
        const res = await axios.post(`${BASE_URL}/finanzas/registrar-pago/`, formDataPago, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}` // Añadido el JWT al header
          }
        });

        if (res.status === 200 || res.status === 201) {
          await Swal.fire({
            icon: "success",
            title: "Pago registrado correctamente",
            showConfirmButton: false,
            timer: 1000,
          });
          setOpenPago(false);
          navigate(0);
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
            navigate(0); // Redirige o recarga en caso de no estar autorizado
          } else if (error.response.status === 403) {
            Swal.fire({
              icon: "warning",
              title: "Sesión expirada",
              text: "Su sesión ha expirado. Inicie sesión nuevamente.",
              showConfirmButton: false,
            });
            localStorage.clear();
            navigate("/login"); // Redirige a login si la sesión expiró
          } else if (error.response.status === 409) {
            await Swal.fire({
              icon: "warning",
              title: "Pago ya registrado",
              text: "Esta venta ya tiene un pago asociado.",
              showConfirmButton: true,
            });
          } else {
            await Swal.fire({
              icon: "error",
              title: "Error al registrar pago",
              text: "Hubo un problema con el servidor. Inténtalo de nuevo.",
              showConfirmButton: false,
              timer: 1000,
            });
          }
        } else {
          // Manejo de errores si no hay respuesta del servidor
          await Swal.fire({
            icon: "error",
            title: "Error de conexión",
            text: "Hubo un problema al intentar conectar con el servidor. Intenta nuevamente.",
            showConfirmButton: false,
            timer: 1000,
          });
        }
      }

    }
  };
  /* ============= DEVOLUCIÓN ============= */


  const handleChangeDevolucion = (e) => {
    const { name, value } = e.target;
    setFormDataDevolucion((prev) => ({
      ...prev,
      [name]:
        isNaN(value) || value.trim() === ""
          ? value
          : parseInt(value, 10),
    }));
  };

  const GenerarDevolucion = (id) => {
    setFormDataDevolucion((prev) => ({
      ...prev,
      idVenta: parseInt(id),
    }));
    setOpenDevolucion(true);
  };

  const verificarMotivoDevolucion = () => {
    if (!formDataDevolucion.motivo.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Debe ingresar un motivo para la devolución",
      });
      return false;
    }
    return true;
  };

  const verificarDevolucionCompleta = () => {
    console.log(monto);
    console.log(formDataDevolucion.monto);

    if (formDataDevolucion.monto === formData.monto) {
      return false;
    }
    if (formDataDevolucion.monto === 0) {
      return false;
    }
    return true;
  };

  const verificarVentaConcretada = () => {
    if (formDataPago.total == 0) {
      Swal.fire({
        icon: "warning",
        title: "No se ah concretado el pago de la venta",
        text: "No se puede realizar una devolución sin un pago asociado.",
      });
      return false;
    }
    return true;
  };

  const handleSubmitDevolucion = async (e) => {
    e.preventDefault();
    if (verificarVentaConcretada() && verificarMotivoDevolucion() && verificarDevolucionCompleta()) {
      try {
        const res = await axios.post(`${BASE_URL}/finanzas/registrar-devolucion/`, formDataDevolucion, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}` // Añadido el JWT al header
          }
        });

        if (res.status === 200 || res.status === 201) {
          await Swal.fire({
            icon: "success",
            title: "Devolución registrada correctamente",
            showConfirmButton: false,
            timer: 1000,
          });
          setOpenDevolucion(false);
          navigate(0);
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
            navigate(0); // Redirige o recarga en caso de no estar autorizado
          } else if (error.response.status === 403) {
            Swal.fire({
              icon: "warning",
              title: "Sesión expirada",
              text: "Su sesión ha expirado. Inicie sesión nuevamente.",
              showConfirmButton: false,
            });
            localStorage.clear();
            navigate("/login"); // Redirige a login si la sesión expiró
          } else if (error.response.status === 409) {
            await Swal.fire({
              icon: "warning",
              title: "Devolución ya registrada",
              text: "Esta venta ya tiene una devolución asociada.",
              showConfirmButton: true,
            });
          } else {
            await Swal.fire({
              icon: "error",
              title: "Error al registrar devolución",
              text: "Hubo un problema con el servidor. Inténtalo de nuevo.",
              showConfirmButton: false,
              timer: 1000,
            });
          }
        } else {
          // Manejo de errores si no hay respuesta del servidor
          await Swal.fire({
            icon: "error",
            title: "Error de conexión",
            text: "Hubo un problema al intentar conectar con el servidor. Intenta nuevamente.",
            showConfirmButton: false,
            timer: 1000,
          });
        }
      }

    }
  };

  /* ============= CALLBACK PARA ACTUALIZAR MONTO TOTAL ============= */
  const handleUpdateMontoTotal = nuevosubtotal => {
    setFormDataPago(prev => {
      const iva = nuevosubtotal * 0.13;
      const total = nuevosubtotal + iva;
      const vuelto = prev.monto - total > 0
        ? parseFloat((prev.monto - total).toFixed(2))
        : 0;
      return {
        ...prev,
        subtotal: nuevosubtotal,
        iva,
        total,
        dineroVuelto: vuelto
      };
    });
  };
  //* =========== GENERAR FACTURA =========== *//
  const GenerarFactura = async () => {

    Swal.fire({
      title: '¿Descargar Factura?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Descargar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-success rounded-5 me-3',
        cancelButton: 'btn btn-secondary rounded-5'
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.isConfirmed) {

        try {
          // Combina los datos de venta y pago en un solo objeto
          const payload = { ...formData, ...formDataPago };

          const response = await axios.post(
            `${BASE_URL}/reportes/generar-factura/`,
            payload,
            {
              responseType: 'blob',
              headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`, // Agregar el JWT en el header
              },
            }
          );

          if (response.status === 200 || response.status === 201) {
            await Swal.fire({
              icon: "success",
              title: "Factura generada exitosamente",
              showConfirmButton: false,
              timer: 1000,
            });

            const blob = new Blob([response.data], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;

            // Intentar obtener el nombre del archivo desde el header
            const contentDisposition = response.headers['content-disposition'];
            let fileName = '';
            if (contentDisposition) {
              const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
              if (fileNameMatch && fileNameMatch.length === 2) {
                fileName = fileNameMatch[1];
              }
            }

            // Si no se recibió el nombre, se genera uno con la fecha actual
            if (!fileName) {
              const fechaActual = new Date().toISOString().split('T')[0];
              fileName = `Factura-${fechaActual}.xlsx`;
            }

            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
          }
        } catch (error) {
          if (error.response) {
            if (error.response.status === 401) {
              Swal.fire({
                icon: "warning",
                title: "Advertencia",
                text: "Operacion no Autorizada",
                showConfirmButton: false,
              });
              navigate(0); // Redirigir a login si no está autorizado
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
              console.error("Error al generar la factura:", error);
              Swal.fire({
                icon: "error",
                title: "Error al generar la factura",
                text: "No se pudo generar el archivo XLSX.",
              });
            }
          } else {
            // Manejo de errores si no hay respuesta del servidor (por ejemplo, error de red)
            console.error("Error desconocido al generar factura:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un problema desconocido, por favor intente nuevamente.",
              showConfirmButton: false,
            });
          }
        }
      };
    });
  }

  return (
    <div className="p-4 bg-darkest rounded-4">
      <Row>
        {/* COLUMNA DETALLES DE VENTA */}

        <div className="">
          <div className="bg-dark-green py-2 rounded-4">
            <Text size="xxl" className="text-white text-center">Detalles de Venta</Text>
          </div>
          <div className="p-4">
            <Row>
              {/* COLUMNA INFORMACIÓN */}
              <Col xs={8} className="d-grid gap-3">
                <span>
                  <Text size="xl" className="text-white">Código de orden:</Text>
                  <Text size="xl" muted>{formData.codigoOrden}</Text>
                </span>
                <span>
                  <Text size="xl" className="text-white">Cliente:</Text>
                  <Text size="xl" muted>{formData.nombreCliente}</Text>
                </span>
                <span>
                  <Text size="xxl" className="text-white">Fecha de ingreso:</Text>
                  <Text size="xl" muted>
                    {formData.fechaIngreso ? new Date(formData.fechaIngreso).toLocaleDateString("es-CR") : ""}
                  </Text>
                </span>

              </Col>
              <Col xs={8} className="d-grid gap-3">
                <span>
                  <Text size="xl" className="text-white">Detalles de venta:</Text>
                  <Text size="xl" muted>{formData.VentaDetalles}</Text>
                </span>

                <span>
                  <Text size="xxl" className="text-white">Vehículo:</Text>
                  <Text size="xl" muted>{formData.vehiculo}</Text>
                </span>
              </Col>
              <Col xs={8} className="d-grid gap-3">
                <span>
                  <Text size="xl" className="text-white">Fecha de venta:</Text>
                  <Text size="xl" muted>
                    {formData.fechaVenta ? new Date(formData.fechaVenta).toLocaleDateString("es-CR") : ""}
                  </Text>
                </span>
                <span>
                  <Text size="xl" className="text-white">Detalles de Orden:</Text>
                  <Text size="xl" muted>{formData.descripcionOrden}</Text>
                </span>
              </Col>
            </Row>
            <hr className="text-success" />
            <Row>
              <div className="d-flex justify-content-between px-4">
                {/* BTN ABRIR MODAL REGISTRAR PAGO */}
                <button
                  className={ventaConsumada ? "btn btn-outline-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1 disabled" : "btn btn-outline-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1"}
                  //</div>className="btn btn-outline-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1"
                  type="button" data-bs-toggle="offcanvas" data-bs-target="#productos"
                >
                  <IoMdAdd size={20} />Producto/Servicio
                </button>
                <button
                  className={ventaConsumada ? "btn btn-outline-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1 disabled" : "btn btn-outline-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1"}
                  onClick={() => GenerarPago(formData.idVenta)}>
                  <MdPayment size={20} />Registrar Pago
                </button>
                <button className="btn btn-outline-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1"
                  onClick={() => GenerarFactura()}>
                  <IoDocumentTextOutline size={20} />Generar Factura
                </button>
                {/* BTN ABRIR MODAL DE DEVOLUCIÓN */}
                <button className="btn btn-outline-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1"
                  onClick={() => GenerarDevolucion(formData.idVenta)}>
                  <TbCreditCardPay size={20} />Realizar reembolso</button>
              </div>
              <hr className="text-success" />
              {/* COlUMNA PAGO */}
              <Col xs={8}>
                <Pago />
              </Col>
              <Col xs={16}>
                {/* Lista de productos asociados a la venta */}
                <ListaProductosVenta onUpdateMontoTotal={handleUpdateMontoTotal} />
              </Col>
            </Row>
            <Row>
              {/* COMPONENTES QUE MUESTRAN DATOS DE PAGO Y DEVOLUCIÓN */}
              <hr className="text-success" />
              <Devolucion />
            </Row>
          </div>
        </div>

        <div className="offcanvas offcanvas-end px-0 bg-darkest" id="productos" style={{ width: "800px" }}>
          <div className="">
            <div className="d-flex justify-content-center bg-success py-2">
              <Text size="xl" className="text-white">Agregar productos</Text>
            </div>
            <div className="p-2 pt-3">
              {/* FILTRO PRODUCTOS */}
              <SelectProductos idVenta={idVenta} />
            </div>
          </div>
        </div>
      </Row>

      {/* MODAL PARA REGISTRAR PAGO */}
      <Modal open={openPago} onClose={() => setOpenPago(false)}>
        <form onSubmit={handleSubmitPago}>
          <Modal.Header className="px-3 pt-3">
            <Modal.Title className="text-center">
              <Text size="xxl" className="text-success">Registrar Pago</Text>
            </Modal.Title>
            <hr className="text-success" />
          </Modal.Header>
          <Modal.Body className="px-4 d-flex flex-column gap-4 row">
            <div className="row">
              <span>Subtotal:</span>
              <input
                type="number"
                value={formDataPago.subtotal.toFixed(2)}
                readOnly
                className="form-control rounded-5"
              />
            </div>
            <div className="row">
              <span>IVA (13%):</span>
              <input
                type="number"
                value={formDataPago.iva.toFixed(2)}
                readOnly
                className="form-control rounded-5"
              />
            </div>
            <div className="row">
              <span>Total:</span>
              <input type="number" value={formDataPago.total.toFixed(2)}
                readOnly
                className="form-control rounded-5" />
            </div>
            <div className="row">
              <span>Monto:</span>
              <input type="number" min="0" name="monto"
                className="form-control rounded-5"
                onChange={handleChangePago}
                value={formDataPago.monto} />
            </div>
            <div className="row">
              <span>Método de pago:</span>
              <select onChange={handleChangePago} value={formDataPago.metodoPago}
                className="form-select rounded-5 py-2"
                name="metodoPago">
                <option value="">Seleccionar...</option>
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer className="p-3 mb-3 row px-4">
            <button type="submit" className="btn text-white btn-success rounded-5 d-flex py-3 align-items-center justify-content-center gap-1">Generar</button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* MODAL PARA REGISTRAR DEVOLUCIÓN */}
      <Modal open={openDevolucion} onClose={() => setOpenDevolucion(false)}>
        <form onSubmit={handleSubmitDevolucion}>
          <Modal.Header className="px-3 pt-3">
            <Modal.Title className="text-center">
              <Text size="xxl" className="text-success">Registrar Devolución</Text>
            </Modal.Title>
            <hr className="text-success" />
          </Modal.Header>
          <Modal.Body className="px-4 d-flex flex-column gap-4">
            <div className="row">

              <span>Monto:</span>
              <input type="number" min="0" name="monto"
                className="form-control rounded-5"
                value={parseFloat(monto).toFixed(2)}
                readOnly
              />

            </div>
            <div className="row">
              <span>Motivo:</span>
              <textarea rows="3" name="motivo" className="form-control rounded-4"
                onChange={handleChangeDevolucion}
                value={formDataDevolucion.motivo} />
            </div>
          </Modal.Body>
          <Modal.Footer className="p-3 mb-3 row">
            <button className="btn text-white btn-success rounded-5 d-flex align-items-center justify-content-center gap-1" type="submit">Generar</button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default Venta;
