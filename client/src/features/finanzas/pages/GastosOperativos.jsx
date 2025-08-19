import React from "react";
import "../styles/fin.css";
import AgregarGastoOperativo from "../components/AgregarGastoOperativo";
import ListadoGastosOperativos from "../components/ListadoGastosOperativos";
import { Col, Row } from "rsuite";

const GastosOperativos = () => {
    return (
        <div className="mt-3 rounded-4 p-3 bg-darkest shadow-sm" style={{height: "85vh",Maxheight: "85vh"}}>
            <Row className="p-2">
                <Col xs={5}>
                    <AgregarGastoOperativo />
                </Col>
                <Col xs={13}>
                    <h3 className="mb-4 text-center text-success">Listado de Gastos Operativos</h3>
                </Col>
            </Row>
            <ListadoGastosOperativos />
        </div>
    )
}
export default GastosOperativos;
