import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SelectMarca from "../../inventario/components/SelectMarca";
import SelectCategoria from "../../inventario/components/SelectCategoria";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";

//URL BASE
export const BASE_URL = import.meta.env.VITE_API_URL;

const SelectProductos = ({ idVenta }) => {
    const [productos, setProductos] = useState({});
    const [loading, setLoading] = useState(true);
    const [existePago, setExistePago] = useState(false);

    useEffect(() => {
        const verificarPago = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/ventas/existe-pago/${idVenta}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
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
                        navigate("/login");
                    } else if (error.response.status === 403) {
                        Swal.fire({
                            icon: "warning",
                            title: "Autenticación",
                            text: "Sesión expirada",
                            showConfirmButton: false,
                        });
                        localStorage.clear();
                        navigate("/login");
                    } else {
                        console.error("Error al verificar pago:", error);
                    }
                } else {
                    console.error("Error de conexión", error);
                }
                setExistePago(false);
            }
        };
        verificarPago();
    }, [idVenta]);

    const [formData, setFormData] = useState({
        nombre: "",
        marca: "",
        categoria: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleBuscar = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(`${BASE_URL}/productos/`, formData, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            setProductos(data);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    Swal.fire({
                        icon: "warning",
                        title: "Advertencia",
                        text: "Operación no Autorizada",
                        showConfirmButton: false,
                    });
                    navigate("/login");
                } else if (error.response.status === 403) {
                    Swal.fire({
                        icon: "warning",
                        title: "Autenticación",
                        text: "Sesión expirada",
                        showConfirmButton: false,
                    });
                    localStorage.clear();
                    navigate("/login");
                } else {
                    console.error("Error al obtener datos:", error);
                }
            } else {
                console.error("Error de conexión", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const AgregarProducto = async (e, idProducto) => {
        e.preventDefault();

        if (existePago === false) {
            const dataToPost = {
                idVenta: parseInt(idVenta),
                idProducto: parseInt(idProducto),
                cantidad: 1
            };

            axios.post(`${BASE_URL}/ventas/agregar-producto/`, dataToPost, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).then((res) => {
                Swal.fire({
                    icon: "success",
                    title: "Producto agregado correctamente",
                    showConfirmButton: false,
                    timer: 800,
                }).then(() => {
                    window.location.reload();
                });
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status === 401) {
                        Swal.fire({
                            icon: "warning",
                            title: "Advertencia",
                            text: "Operacion no Autorizada",
                            showConfirmButton: false,
                        });
                    } else if (error.response.status === 403) {
                        Swal.fire({
                            icon: "warning",
                            title: "Sesión expirada",
                            text: "Su sesión ha expirado, por favor inicie sesión nuevamente",
                            showConfirmButton: false,
                        });
                        localStorage.clear();
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error al agregar producto",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    }
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error desconocido",
                        text: "Hubo un error al agregar el producto, por favor intente nuevamente",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            });

        } else if (existePago === true) {
            Swal.fire({
                icon: "warning",
                title: "No se puede agregar un producto o servicio",
                text: "Ya ha sido efectuado un pago",
                showConfirmButton: false,
                timer: 2500,
            });
        }
    };

    return (
        <div className="bg-darkest">
            <div className="px-4">
                <div className="row">
                    <div className="ms-0 mb-3 row">
                        <span>Producto:</span>
                        <input
                            name="nombre"
                            className="form-control rounded-5 py-2"
                            placeholder="Buscar por nombre"
                            value={formData.nombre}
                            onChange={handleChange} />
                    </div>
                    <div className="col-6">
                        <div>
                            <span>Marca:</span>
                            <SelectMarca
                                name="marca"
                                value={formData.marca}
                                onChange={handleChange} />
                        </div>
                    </div>
                    <div className="col-6">
                        <div>
                            <span>Categoria:</span>
                            <SelectCategoria
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleChange} />
                        </div>
                    </div>
                    <div className="mt-3 px-4">
                        <button className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1" onClick={handleBuscar}>
                            <FaSearch size={15} />Buscar
                        </button>
                    </div>
                </div>
            </div>
            <div className="p-4 px-2">
                {loading ? (
                    <div></div>
                ) : (
                    <div className="scroll-container">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Marca</th>
                                    <th>Precio</th>
                                    <th>Agregar Producto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map(producto => (
                                    <tr key={producto.idProducto}>
                                        <td>{producto.nombre}</td>
                                        <td>{producto.marca}</td>
                                        <td>₡ {producto.precio}</td>
                                        <td>
                                            <div className="d-flex justify-content-center">
                                                <button
                                                    className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1"
                                                    onClick={(e) => AgregarProducto(e, producto.idProducto)}
                                                >
                                                    <FaPlus size={15} />Agregar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectProductos;
