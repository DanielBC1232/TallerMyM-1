import "../styles/ven.css";
import { useState } from "react";
import { Col} from "rsuite";
import ListadoVentas from "../components/ListadoVentas";
import ListadoOrdenes from "../components/ListadoOrdenes";
import Notificaciones from "../../../components/Notificaciones";
import { MdSell } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

const Index = () => {
  const [vista, setVista] = useState("ListadoVentas");//estado para manejar listado

  return (
    <div className="bg-darkest rounded-4">
      <Notificaciones modulo={'VENTAS'} />

      <div className="row py-3">
        <Col xs={22}>
          <nav>
            <div className="d-flex gap-3 px-3">
              <button className="nav-btn text-white btn btn-outline-success rounded-4 d-flex align-items-center justify-content-center gap-1" onClick={() => setVista("ListadoVentas")}><MdSell size={20}/>Ver Listado de Ventas</button>
              <button className="nav-btn text-white btn btn-outline-success rounded-4 d-flex align-items-center justify-content-center gap-1" onClick={() => setVista("ListadoOrdenes")}><FaCheckCircle size={20}/>Ver Listado de Ordenes</button>
            </div>
          </nav>
        </Col>
        
        <Col xs={2}></Col>
        <Col xs={22}>
          <div className="nav-containe px-2">
            {vista === "ListadoVentas" ? <ListadoVentas /> : <ListadoOrdenes />}
          </div>
        </Col>
      </div>
    </div>
  );
};
export default Index;
