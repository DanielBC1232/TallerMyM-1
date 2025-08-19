import { useState } from "react";
import ListaTrabajadores from "../components/ListaTrabajadores.jsx";
import { FaPlane } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export const BASE_URL = import.meta.env.VITE_API_URL;

const IndexTrabajadores = () => {
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes("salario") ? Number(value) : value,
    });
  };

  const [trigger, setTrigger] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setTrigger(prev => !prev);
  };

  return (

    <div className="p-4 rounded-4 bg-darkest" style={{ minHeight: "88vh" }}>

      <div className="d-flex justify-content-between row">
        <div className="col">
          <Link to="/AddSolicitudVacacion" className="btn btn-success text-white rounded-5 d-flex align-items-bottom justify-content-center gap-1" style={{ width: "200px" }}>
            <FaPlane size={20} />Solicitar Vacaciones</Link>
        </div>
        <div className="col">
          <h4 className="text-center text-success">Mi cuenta</h4>
        </div>
        <div className="col"></div>
        <div className="d-flex justify-content-center row px-5">
          <hr className="text-success mt-3" />
        </div>
      </div>
      <ListaTrabajadores />
    </div>

  );
};

export default IndexTrabajadores;
