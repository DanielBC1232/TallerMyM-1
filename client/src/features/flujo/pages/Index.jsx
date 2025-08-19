import { Text } from "rsuite";
import "../styles/flu.module.css";
import ColPendiente from "../components/ColPendiente";
import ColProgreso from "../components/ColProgreso";
import ColListo from "../components/ColListo";
import Notificaciones from "../../../components/Notificaciones";
import ModalAgregarOrden from "../components/ModalAgregarOrden";
import { MdOutlinePendingActions } from "react-icons/md";
import { RiProgress3Line } from "react-icons/ri";
import { IoMdDoneAll } from "react-icons/io";

const IndexFlujo = () => {

  return (
    <div className="">
      {/* OPCIONES */}
      <Notificaciones modulo={'FLUJO'} />
      {/* FLUJO */}
      <div className="flujo-row">
        {/* Pendiente */}
        <div className="flujo-col">
          <div className="bg-dark-green rounded-4 py-2 mb-4 border border-green border-3" style={{ maxWidth: "520px", minWidth: "310px" }}>
            <div className="d-flex justify-content-between align-items-center ">
              {/* icono MdOutlinePendingActions y al lado texto de Pendiente */}
              <Text size="xxl" className="text-white ps-4 py-1 d-flex align-items-center">
                <MdOutlinePendingActions className="me-2" />
                Pendiente</Text>

              <ModalAgregarOrden />
            </div>
            <div className="p-3 scrollable-container bg-darkest" style={{ minHeight: "80vh", maxWidth: "650px", minWidth: "300px" }}>
              <ColPendiente />
            </div>
          </div>
        </div>

        {/* En progreso */}
        <div className="flujo-col">
          <div className="bg-dark-green rounded-4 py-2 mb-4 border border-green border-3" style={{ maxWidth: "520px", minWidth: "310px" }}>
            <Text size="xxl" className="text-white ps-4 py-1 d-flex align-items-center"><RiProgress3Line className="me-2" /> En progreso</Text>
            <div className="p-3 scrollable-container bg-darkest" style={{ minHeight: "80vh" }}>
              <ColProgreso />
            </div>
          </div>
        </div>

        {/* Listo */}
        <div className="flujo-col">
          <div className="bg-dark-green rounded-4 py-2 mb-4 border border-green border-3" style={{ maxWidth: "520px", minWidth: "310px" }}>
            <Text size="xxl" className="text-white ps-4 py-1 d-flex align-items-center"><IoMdDoneAll className="me-2" /> Listo</Text>
            <div className="p-3 scrollable-container bg-darkest" style={{ minHeight: "80vh" }}>
              <ColListo />
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default IndexFlujo;
