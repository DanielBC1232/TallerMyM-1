import { useState, useEffect } from "react";
import ContenedorProductos from "../components/contenedorArticulo";
import SelectCategoria from "../components/SelectCategoria";
import SelectMarca from "../components/SelectMarca";
import RangoPrecio from "../components/RangoPrecio";
import ModalSolicitarProducto from "../components/ModalSolicitarProducto";
import {
  BrowserRouter as Router,
  Link,
  useNavigate
} from "react-router-dom";
import axios from "axios";
import { Text } from "rsuite";
import Notificaciones from "../../../components/Notificaciones";
import "../styles/inv.css";
//URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

const IndexInventario = () => {
  const [precios, setPrecios] = useState([]);
  //console.log(precios)
  const [formData, setFormData] = useState({
    nombre: "",
    marca: "",
    categoria: "",
    stock: 0,
    rangoPrecio: [precios.precioMin, precios.precioMax],
  });
  //console.log(formData)
  const navigate = useNavigate(); // Hook para navegar

  useEffect(() => {
    async function obtenerPrecios() {
      try {
        const response = await axios.get(
          `${BASE_URL}/productos/precios`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`, // Agregar el token JWT aquí
            },
          }
        );
        setPrecios(response.data);
        if (response.data) {
          // Actualiza formData solo después de obtener los precios
          setFormData((prevState) => ({
            ...prevState,
            rangoPrecio: [response.data.precioMin, response.data.precioMax],
          }));
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
            navigate(0); // Redirigir si no autorizado
          } else if (error.response.status === 403) {
            localStorage.clear();
            navigate("/login"); // Redirigir si sesión expirada
          }
        }
      }
    }

    obtenerPrecios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "precio" || name === "stock"
          ? Number(value)
          : name === "vehiculosCompatibles"
            ? value
            : value,
    });
  };
  return (
    <div className="grid-container px-3 py-3">
      <Notificaciones modulo={'INVENTARIO'} />

      <div className="p-4 rounded-4 shadow bg-darkset border border-success border-opacity-50">

        <div className="d-flex flex-wrap justify-content-between gap-3 mb-3 px-5">
          <div className="flex-grow-1" style={{ minWidth: "200px" }}>
            <span><Text size={16} className="text-white">Categoria:</Text></span>
            <SelectCategoria value={formData.categoria} onChange={handleChange} />
          </div>
          <div className="flex-grow-1" style={{ minWidth: "200px" }}>
            <span><Text size={16} className="text-white">Marca:</Text></span>
            <SelectMarca value={formData.marca} onChange={handleChange} />
          </div>
          <div className="flex-grow-1" style={{ minWidth: "200px" }}>
            <span><Text size={16} className="text-white">Stock:</Text></span>
            <select
              className="form-select rounded-5 py-2 mt-2"
              name="stock"
              value={formData.stock}
              onChange={handleChange}>
              <option value="">Cualquiera</option>
              <option value="10">Menos de 10</option>
              <option value="50">Menos de 50</option>
              <option value="100">Menos de 100</option>
              <option value="500">Menos de 500</option>
              <option value="1000">Menos de 1000</option>
            </select>
          </div>
          <div className="flex-grow-1" style={{ minWidth: "200px" }}>
            <span><Text size={16} className="text-white">Producto:</Text></span>
            <input
              name="nombre"
              className="form-control rounded-5 py-2 mt-2"
              placeholder="Buscar por nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>
          <div className="flex-grow-1" style={{ minWidth: "250px" }}>
            <RangoPrecio value={[formData.precioMin, formData.precioMax]} onChange={handleChange} />
          </div>
        </div>

        <hr className="text-success" />

        <div className="row px-2 px-md-5">
          <div className="col-12 col-md-6 mb-3 mb-md-0 d-flex justify-content-center justify-content-md-start">
            <Link to="/inventario-agregar"
              className="btn btn-success rounded-5 text-white d-flex align-items-center justify-content-center gap-1">
              Registrar producto
            </Link>
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-center justify-content-md-end">
            <ModalSolicitarProducto />
            <Link to="/historial-solicitudes"
              className="btn btn-success rounded-5 text-white d-flex align-items-center justify-content-center gap-1 ms-3">
              Historial Solicitudes
            </Link>
          </div>
        </div>
      </div>


      <div className="mt-4">
        <ContenedorProductos formData={formData} />
      </div>

    </div>
  );
};

export default IndexInventario;
