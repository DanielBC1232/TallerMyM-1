import { Card, Text, Row, Col } from "rsuite";
import { Link } from "react-router-dom";
import { IoMdTime } from "react-icons/io";
import { IoDocumentText } from "react-icons/io5";
import { FaCar } from "react-icons/fa";
import { FiTool } from "react-icons/fi";
import { CiCalendarDate } from "react-icons/ci";
import { IoPersonSharp } from "react-icons/io5";

const Orden = ({ datos }) => {
    //console.log(datos);
    return (
        datos.map((orden) => (
            <Link key={orden.idOrden} to={`/flujo-detalles/${orden.idOrden}`}>
                <Card size="sm" className="card bg-darkest-secondary shadow-sm p-0 rounded-4" style={{
                        width: '100%',
                        minHeight: '200px',
                        maxWidth: '95%',
                        margin: '0 auto',
                        marginBottom: '10px',
                        boxSizing: 'border-box',
                        minWidth: '300px'}}>
                    <Row className="card-header p-0 mb-1 pb-2" style={{ backgroundColor: "#2e4c5a" }}>
                        <Col xs={12}>
                            <Card.Header className=" ms-3 text-white">
                                <Text size="lg" className="text-start mb-1 text-success d-flex align-items-center" weight="semibold" style={{ color: "#FFF" }}><IoDocumentText className="me-2"/> Orden:</Text>
                                <Text size="md" className="text-start" weight="medium" style={{ color: "#FFF" }}>{orden.codigoOrden}</Text>
                            </Card.Header>
                        </Col>
                        <Col xs={12}>
                            <Card.Header className="text-white">
                                <Text size="lg" className="text-start text-success mb-1 d-flex align-items-center" weight="semibold" style={{ color: "#FFF" }}><IoMdTime className="me-2"/> Restante:</Text>
                                <Text size="md" className="text-start" weight="medium" style={{ color: "#FFF" }}>
                                    {orden.TiempoRestante}
                                </Text>
                            </Card.Header>
                        </Col>
                    </Row>
                    <Card.Body style={{ minHeight: "140px" }}>
                        <Row className="ms-2 p-2">
                            <Col xs={12}>
                                <div className="d-grid text-start mb-2">
                                    <Text size="lg" className="text-start text-white d-flex align-items-center" weight="medium"><FaCar className="me-2"/> Vehiculo:</Text>
                                    <Text muted size="md">{orden.marcaVehiculo + " " + orden.modeloVehiculo + " " + orden.annoVehiculo}</Text>
                                </div>
                                <div className="d-grid text-start">
                                    <Text size="md" className="text-start text-white d-flex align-items-center" weight="medium"><CiCalendarDate size={20} className="me-2"/> Fecha de Ingreso:</Text>
                                    <Text muted size="md">{orden.fechaIngreso}</Text>
                                </div>
                            </Col>
                            <Col xs={12}>
                                <div className="d-grid text-start mb-2">
                                    <Text size="lg" className="text-start text-white d-flex align-items-center" weight="medium"><FiTool className="me-2"/> Encargado:</Text>
                                    <Text muted size="md">{orden.nombreMecanico}</Text>
                                </div>
                                <div className="d-grid text-start ">
                                    <Text size="lg" className="text-start text-white d-flex align-items-center" weight="medium"><IoPersonSharp className="me-2"/> Cliente:</Text>
                                    <Text muted size="md">{orden.nombreCliente}</Text>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Link>
        ))
    );
};
export default Orden;
