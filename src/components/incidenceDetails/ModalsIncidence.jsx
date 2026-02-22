import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { GetAreas } from "../../services/AreaService";



const ModalsIncidence = ({ show, mode, incidenceData, onClose, onConfirm }) => {
  const [areas, setAreas] = useState([]); // Estado para las áreas de la DB

  

  const [formData, setFormData] = useState({
    fecha: "",
    tipo: "0",
    estado: "0",
    operador: "0",
    area: "",
    observacion: ""
  });

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await GetAreas();
        setAreas(data);
      } catch (error) {
        console.error("Error al cargar áreas:", error);
      }
    };
    if (show) fetchAreas();
  }, [show]);

  useEffect(() => {
    if (mode === "edit" && incidenceData) {
      setFormData({
        fecha: incidenceData.date ? incidenceData.date.split('T')[0] : "",
        tipo: incidenceData.incidenceType?.toString() || "0",
        estado: incidenceData.state?.toString() || "0",
        area: incidenceData.areaId?.toString() || "",
        observacion: incidenceData.description || ""
      });
    } else {
      setFormData({ 
        fecha: new Date().toISOString().split('T')[0], 
        tipo: "0", 
        estado: "0", 
        area: "", 
        observacion: "" 
      });
    }
  }, [mode, incidenceData, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">
          {mode === "create" ? "Registrar Nueva Incidencia" : "Editar Incidencia"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form>
          <div className="row">
            <div className="col-md-4 mb-3">
              <Form.Label className="fw-semibold">Fecha</Form.Label>
              <Form.Control type="date" name="fecha" value={formData.fecha} onChange={handleChange} />
            </div>
            <div className="col-md-4 mb-3">
              <Form.Label className="fw-semibold">Tipo de Incidencia</Form.Label>
              <Form.Select name="tipo" value={formData.tipo} onChange={handleChange}>
                <option value="0">Chapas</option>
                <option value="1">Bolsón</option>
                <option value="2">Reclamo</option>
                <option value="3">Licencia</option>
                <option value="4">Trámite</option>
                <option value="5">Otros</option>
              </Form.Select>
            </div>
            <div className="col-md-4 mb-3">
              <Form.Label className="fw-semibold">Estado</Form.Label>
              <Form.Select name="estado" value={formData.estado} onChange={handleChange}>
                <option value="0">Iniciado</option>
                <option value="1">En progreso</option>
                <option value="2">Finalizado</option>
              </Form.Select>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mb-3">
              <Form.Label className="fw-semibold">Área Responsable</Form.Label>
              <Form.Select 
              name="area" 
              value={formData.area} 
              onChange={handleChange}
              disabled={mode === "edit"} // Recomendado: no cambiar el área una vez reportada
              className={!formData.area ? "text-muted" : ""}
              >
              <option value="">Seleccione un área...</option>
      {areas.map((a) => (
        <option key={a.id} value={a.id}>
          {a.name}
        </option>
      ))}
    </Form.Select>
    {!formData.area && mode === "create" && (
      <small className="text-muted ms-1">Debe asignar el área para registrar la incidencia.</small>
    )}
  </div>
          </div>
          <div className="mb-3">
            <Form.Label className="fw-semibold">Observación</Form.Label>
            <Form.Control 
              as="textarea" rows={3} name="observacion" 
              value={formData.observacion} onChange={handleChange} 
              placeholder="Detalles..."
            />
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="light" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={() => onConfirm(formData)}>
          {mode === "create" ? "Guardar" : "Actualizar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalsIncidence;