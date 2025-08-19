import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import { Text } from "rsuite";

//URL BASE
export const BASE_URL = import.meta.env.VITE_API_URL;

const ListaProductosVenta = ({ onUpdateMontoTotal }) => {
  const { idVenta } = useParams();
  const [reload, setReload] = useState(0);//listado
  const [productos, setProductos] = useState([]);//listado

  //Verificacion si existe un pago asociado a la venta
  const [existePago, setExistePago] = useState(false);
  useEffect(() => {
    const verificarPago = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/ventas/existe-pago/${idVenta}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT en las cabeceras
          }
        });
        setExistePago(response.data === true);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            Swal.fire({
              icon: "warning",
              title: "Advertencia",
              text: "Operación no Autorizada",
              showConfirmButton: false,
            });
            navigate("/login"); // Redirigir al login si el token es inválido o no hay sesión activa
          } else if (error.response.status === 403) {
            Swal.fire({
              icon: "warning",
              title: "Autenticación",
              text: "Sesión expirada",
              showConfirmButton: false,
            });
            localStorage.clear();
            navigate("/login"); // Redirigir al login si la sesión ha expirado
          } else {
            console.error("Error al verificar el pago", error);
            setExistePago(false); // En caso de error, asumimos que no hay pago
          }
        } else {
          console.error("Error de conexión", error);
          setExistePago(false); // En caso de error, asumimos que no hay pago
        }
      }
    };
    verificarPago();

  }, [idVenta]);

  //console.log(existePago);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/ventas/obtener-productos-venta/${parseInt(idVenta)}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT en los encabezados
          }
        });
        setProductos(data);

        // Calcular y enviar el subtotal al padre
        const nuevoSubtotal = data.reduce((acc, p) =>
          acc + p.montoFinalUnitario * p.cantidad, 0
        );
        onUpdateMontoTotal(nuevoSubtotal);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401 || 403) {
            localStorage.clear();
            navigate("/login"); // Redirigir al login si la sesión ha expirado
          } else {
            console.error("Error al obtener productos de venta", error);
          }
        } else {
          console.error("Error de conexión", error);
        }
      }
    };
    if (idVenta) {
      obtenerDatos();
    }
  }, [idVenta, reload]);

  // Calcular subtotal, IVA y total con IVA
  const subtotal = productos.reduce(
    (acc, producto) => acc + producto.montoFinalUnitario * producto.cantidad,
    0
  );
  const iva = subtotal * 0.13;
  const totalConIva = subtotal + iva;

  // Remover producto de la venta
  async function RemoverProductoVenta(id, idProductoParam, cantidadParam) {
    Swal.fire({
      title: "¿Seguro que desea remover este producto?",
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn btn-danger rounded-5 me-3',
        cancelButton: 'btn btn-secondary rounded-5'
      },
      buttonsStyling: false,
      confirmButtonText: "Remover",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const deleteData = {
            idProductoVenta: parseInt(id),
            idProducto: parseInt(idProductoParam),
            cantidad: parseInt(cantidadParam)
          };

          await axios.post(`${BASE_URL}/ventas/eliminar-producto-venta/`, deleteData, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT en los encabezados
            }
          });

          setReload(prev => prev + 1);

          Swal.fire({
            text: "Producto removido correctamente",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
            showConfirmButton: false,
          });

        } catch (error) {
          if (error.response) {
            if (error.response.status === 401) {
              Swal.fire({
                icon: "warning",
                title: "Advertencia",
                text: "Operación no Autorizada",
                showConfirmButton: false,
              });
              navigate("/login"); // Redirigir al login si el token es inválido o no hay sesión activa
            } else if (error.response.status === 403) {
              Swal.fire({
                icon: "warning",
                title: "Autenticación",
                text: "Sesión expirada",
                showConfirmButton: false,
              });
              localStorage.clear();
              navigate("/login"); // Redirigir al login si la sesión ha expirado
            } else {
              Swal.fire({
                text: "Error al remover producto",
                icon: "error",
                showConfirmButton: false
              });
              console.error("Error al eliminar el producto:", error);
            }
          } else {
            console.error("Error de conexión", error);
          }
        }
      }
    });
  }
  return (
    <div className="">
      <table className="table table-hover">
        <thead>
          <tr>
            <th className="text-center">Producto</th>
            <th className="text-center">Cantidad</th>
            <th className="text-center">Monto Unitario</th>
          </tr>
        </thead>
        <tbody>
          {productos.length > 0 ? (
            <>
              {productos.map((producto) => (
                <tr key={producto.idProducto}>
                  <td className="text-center"><Text size="lg" className="text-white">{producto.nombreProducto}</Text></td>
                  <td className="text-center"> <Text size="lg" className="text-white">x
                    {/* input para manipular la cantidad y modifica el state de cantidad */}
                    <input
                      type="number"
                      name="cantidad"
                      className="form-control form-control-sm rounded-3 ms-2"
                      style={{ width: "40px", display: "inline-block" }}
                      min="1"
                      max="99"
                      value={producto.tipo === "servicio" ? 1 : producto.cantidad}
                      disabled={producto.tipo === "servicio"}
                      onChange={async (e) => {
                        const nuevaCantidad = parseInt(e.target.value, 10);
                        // 1) Actualizo el state YA
                        const updated = productos.map((p) =>
                          p.idProductoVenta === producto.idProductoVenta
                            ? { ...p, cantidad: nuevaCantidad }
                            : p
                        );
                        setProductos(updated);
                        // recalc subtotal en pantalla
                        const subtotal = updated.reduce((sum, x) => sum + x.montoFinalUnitario * x.cantidad, 0);
                        onUpdateMontoTotal(subtotal);
                        if (producto.tipo === "producto" && nuevaCantidad >= 0) {
                          try {
                            const updateData = {
                              idProductoVenta: producto.idProductoVenta,
                              idProducto: producto.idProducto,
                              cantidad: nuevaCantidad || 0,
                              tipo: producto.tipo
                            };
                            const { data: filas } = await axios.post(
                              `${BASE_URL}/ventas/actualizar-producto-venta/`,
                              updateData,
                              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                            );
                            if (filas) {
                              // Sólo recarga si el update realmente afectó algo
                              setReload(prev => prev + 1);
                            }
                          } catch (error) {
                            console.error("Error al actualizar la cantidad del producto:", error);
                          }
                        }
                      }}
                    />

                  </Text></td>
                  <td className="text-center"><Text size="lg" className="text-white" weight="medium">₡ {producto.montoFinalUnitario}</Text></td>
                  <td className="text-center">
                    <div>
                      {!existePago && (
                        <button className="btn btn-sm text-white btn-danger rounded-5 d-flex align-items-center justify-content-center gap-1"
                          onClick={() =>
                            RemoverProductoVenta(
                              producto.idProductoVenta,
                              producto.idProducto,
                              producto.cantidad
                            )
                          }><MdDelete size={20} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}<tr><td className="p-1 bg-darkest border-0"></td></tr>
              {/* Fila Subtotal */}
              <tr>
                <td colSpan="2" className="text-center">
                  <Text size="lg" className="text-white" weight="semibold">Subtotal</Text>
                </td>
                <td className="text-center">
                  <Text size="lg" className="text-white" weight="medium">₡ {subtotal.toFixed(2)}</Text>
                </td>
                <td></td>
              </tr>
              {/* Fila IVA */}
              <tr>
                <td colSpan="2" className="text-center">
                  <Text size="lg" className="text-white" weight="semibold">IVA (13%)</Text>
                </td>
                <td className="text-center">
                  <Text size="lg" className="text-white" weight="medium">₡ {iva.toFixed(2)}</Text>
                </td>
                <td></td>
              </tr>
              {/* Fila Total con IVA */}
              <tr>
                <td colSpan="2" className="text-center">
                  <Text size="lg" className="text-white" weight="semibold">Total con IVA</Text>
                </td>
                <td className="text-center">
                  <Text size="lg" className="text-white" weight="semibold">₡ {totalConIva.toFixed(2)}</Text>
                </td>
                <td></td>
              </tr>
            </>
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No hay productos en esta venta
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )

}
export default ListaProductosVenta;