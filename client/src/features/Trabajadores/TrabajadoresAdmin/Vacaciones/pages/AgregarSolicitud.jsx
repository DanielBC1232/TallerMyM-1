//Agregar solcitud de vacaciones
//import React from "react";
import { useState, useEffect } from "react";
import { Button, Form, Schema, SelectPicker, DatePicker } from "rsuite";

//Url
export const BASE_URL = import.meta.env.VITE_API_URL;

const { StringType, DateType } = Schema.Types;

const model = Schema.Model({
  FechaInicio: DateType().isRequired("La fecha de inicio es obligatoria"),
  FechaFin: DateType().isRequired("La fecha de fin es obligatoria"),
  idTrabajador: StringType().isRequired("El trabajador es obligatorio"),
});

const CreateSolicitud = () => {
  const [formValue, setFormValue] = useState({
    FechaInicio: null,
    FechaFin: null,
    idTrabajador: "",
  });

  const [trabajadores, setTrabajadores] = useState([]);//constantes

  //useEffect que trae del backend los trabajadores idtrabajador y nombrecompleto
  useEffect(() => {
    const fetchTrabajadores = async () => {
      try {
        const response = await fetch(`${BASE_URL}/trabajadores/obteneTrabajadoresMenu`);
        if (!response.ok) throw new Error("Error al cargar trabajadores");
        const data = await response.json();

        setTrabajadores(
          data.map((trabajador) => ({
            label: trabajador.nombreCompleto,
            value: trabajador.idTrabajador,
          }))
        );
      } catch (error) {
        console.error("Error:", error);
        alert("No se pudo cargar la lista de trabajadores");
      }
    };

    fetchTrabajadores();
  }, []);

  const handleSubmit = async () => {
    try {
      console.log("Datos enviados:", formValue);
  
      const response = await fetch(`${BASE_URL}/trabajadores/Solicitud-Vacaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fechaInicio: formValue.FechaInicio?.toISOString().split("T")[0], 
          fechaFin: formValue.FechaFin?.toISOString().split("T")[0], 
          idTrabajador: Number(formValue.idTrabajador),
        }),
      });
  
      if (!response.ok) throw new Error("Error al registrar la solicitud Front");
  
      alert("Solicitud registrada exitosamente");
      setFormValue({ FechaInicio: null, FechaFin: null, idTrabajador: "" });
    } catch (error) {
      console.error("Error en el envío:", error);
      alert("Hubo un error al registrar la solicitud Front");
    }
  };

  return (
    <div className="form-container">
      <Form model={model} onChange={setFormValue} formValue={formValue} fluid>
        <Form.Group>

          {/*Se implemento el datapicker para el minicalendario */}
          <Form.ControlLabel>Fecha de Inicio</Form.ControlLabel>
          <DatePicker
            name="FechaInicio"
            value={formValue.FechaInicio}
            onChange={(date) => setFormValue({ ...formValue, FechaInicio: date })}
            format="yyyy-MM-dd"
            oneTap
            block/>
        </Form.Group>

        <Form.Group>
          <Form.ControlLabel>Fecha Fin</Form.ControlLabel>
          <DatePicker
            name="FechaFin"
            value={formValue.FechaFin}
            onChange={(date) => setFormValue({ ...formValue, FechaFin: date })}
            format="yyyy-MM-dd"
            oneTap
            block/>
        </Form.Group>

        <Form.Group>
          <Form.ControlLabel>Seleccionar Trabajador</Form.ControlLabel>
          <SelectPicker
            data={trabajadores}
            name="idTrabajador"
            value={formValue.idTrabajador}
            onChange={(value) => setFormValue({ ...formValue, idTrabajador: value })}
            placeholder="Seleccione un trabajador"
            block/>
        </Form.Group>

        <Button appearance="primary" onClick={handleSubmit}>
          Registrar
        </Button>
      </Form>
    </div>
  );
};

export default CreateSolicitud;
