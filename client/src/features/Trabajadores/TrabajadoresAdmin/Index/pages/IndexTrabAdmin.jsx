import React, { useState } from "react";
import ListaTrabajadores from "../components/ListaTrabajadores"
import { Link, useNavigate } from "react-router-dom";
import { HiDocumentAdd } from "react-icons/hi";
import { LuListTodo } from "react-icons/lu";
import { FaPlane } from "react-icons/fa";
import ModalAgregarTrabajador from "../components/ModalAgregarTrabajador";

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
    setTrigger((prev) => !prev);
  };

  return (
    <div className="bg-darkest p-4 rounded-4" style={{minHeight: "88vh"}}>

      <div className="mb-3 d-flex gap-4">
        <ModalAgregarTrabajador />
        <Link to="/index-amonestaciones" className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1">
          <HiDocumentAdd size={24} />
          Generar Amonestación
        </Link>

        <Link to="/Ausencias-Index" className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1">
          <LuListTodo size={25} />
          Registrar Ausencias
        </Link>

        <Link to="/Vacaciones-Index" className="btn btn-success text-white rounded-5 d-flex align-items-center justify-content-center gap-1">
          <FaPlane size={20} />
          Vacaciones
        </Link>
      </div>

      {/*--Lista Trabajadores Activos--*/}
      <div className="">
        <ListaTrabajadores />
      </div>

    </div>
  );
};

export default IndexTrabajadores;
