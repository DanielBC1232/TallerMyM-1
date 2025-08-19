import { useState, useEffect } from "react";
import axios from "axios";
import { Image } from "rsuite";
import { Link, useNavigate } from 'react-router-dom';

//URL Base
export const BASE_URL = import.meta.env.VITE_API_URL;

//constante de Productos
const ContenedorProductos = ({ formData }) => {
  const navigate = useNavigate();
  const [listado, setLista] = useState([]);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 250)); // Delay para evitar consumo innecesario
        const { data } = await axios.post(
          `${BASE_URL}/productos`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT
            }
          }
        );

        setLista(data);
      } catch (error) {
        if (error.response) {
          // Manejo de respuestas HTTP
          if (error.response.status === 401) {
            Swal.fire({
              icon: "warning",
              title: "Advertencia",
              text: "Operacion no Autorizada",
              showConfirmButton: false,
            });
            navigate(0); // Redirige a la página de login si no está autorizado
          }
          else if (error.response.status === 403) {
            Swal.fire({
              icon: "warning",
              title: "Autenticación",
              text: "Sesión expirada",
              showConfirmButton: false,
            });
            localStorage.clear();
            navigate("/login"); // Redirige a login si la sesión ha expirado
          } else {
            console.error("Error obteniendo las categorías:", error);
          }
        } else {
          console.error("Error desconocido", error);
        }
      }

    };

    if (formData) {
      obtenerProductos();
    }
  }, [formData]);

  //url get imagen para las previsualizaciones
  const getImg = (img) => img ? `${BASE_URL}/img/${img}` : "/noResult.png";

  return (
    <div className="article-container mt-3">
      {listado.map((producto) => (
        <div key={producto.idProducto} className="article card border-0 rounded rounded-4 pb-2 overflow-hidden" style={{ width: "300px" }}>
          <Image
            src={getImg(producto.img)}
            fallbackSrc="/noResult.png"
            alt={producto.nombre}
            style={{ width: "100%", height: "250px", objectFit: "cover", aspectRatio: "1/1" }} />
          <div className="card-body p-3">
            <div className="text-center">
              <h5 className="fw-bolder text-secondary">{producto.nombre}</h5>
              <span className="d-block">
                <strong className="text-dark">Categoría:</strong> {producto.categoria}
              </span>
              <span className="d-block">
                <strong>Stock:</strong> {producto.stock}
              </span>
              <span className="d-block">
                <strong>Precio:</strong> ₡ {producto.precio}
              </span>
            </div>
          </div>
          <div className="card-footer pt-0 border-top-0 bg-transparent">
            <div className="text-center">
              <Link className="btn btn-outline-dark mt-auto" to={`/inventario-detalles/${producto.idProducto}`}>
                Ver Detalles
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

};

export default ContenedorProductos;
