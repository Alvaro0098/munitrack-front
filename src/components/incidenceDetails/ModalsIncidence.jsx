import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const IncidenceModals = ({ show, mode, incidenceData, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    fecha: "",
    tipo: "",
    estado: "",
    area: "",
    operador: "",
    observacion: ""
  });

  useEffect(() => {
    if (mode === "edit" && incidenceData) {
      setFormData(incidenceData);
    } else {
      setFormData({ fecha: "", tipo: "", estado: "", area: "", operador: "", observacion: "" });
    }
  }, [mode, incidenceData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const renderFormModal = () => (
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
              <Form.Label>Fecha de Ingreso</Form.Label>
              <Form.Control type="date" name="fecha" value={formData.fecha} onChange={handleChange} />
            </div>
            <div className="col-md-4 mb-3">
              <Form.Label>Tipo de Incidencia</Form.Label>
              <Form.Select name="tipo" value={formData.tipo} onChange={handleChange}>
                <option value="">Seleccionar tipo</option>
                <option value="Chapas">Chapas</option>
                <option value="Bolsón">Bolsón</option>
                <option value="Reclamo">Reclamo</option>
                <option value="Licencia de Conducir">Licencia de Conducir</option>
                <option value="Trámite">Trámite</option>
                <option value="Otro">Otro</option>
              </Form.Select>
            </div>
            <div className="col-md-4 mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select name="estado" value={formData.estado} onChange={handleChange}>
                <option value="">Seleccionar estado</option>
                <option value="Iniciado">Iniciado</option>
                <option value="En progreso">En progreso</option>
                <option value="Finalizado">Finalizado</option>
              </Form.Select>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label>Área</Form.Label>
              <Form.Select name="area" value={formData.area} onChange={handleChange}>
                <option value="">Seleccionar área</option>
                <option value="Género">Género</option>
                <option value="Mesa de Trabajo">Mesa de Trabajo</option>
                <option value="Básica Centro">Básica Centro</option>
                <option value="Desarrollo">Desarrollo</option>
              </Form.Select>
            </div>
            <div className="col-md-6 mb-3">
              <Form.Label>Operador a Cargo</Form.Label>
              <Form.Select name="operador" value={formData.operador} onChange={handleChange}>
                <option value="">Seleccionar operador</option>
                <option value="Luciana">Luciana</option>
                <option value="Evelyn">Evelyn</option>
                <option value="Álvaro">Álvaro</option>
              </Form.Select>
            </div>
          </div>
          <div className="mb-3">
            <Form.Label>Observación</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              name="observacion" 
              value={formData.observacion} 
              onChange={handleChange} 
              placeholder="Detalles de la incidencia..."
            />
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={() => onConfirm(formData)}>
          {mode === "create" ? "Guardar Incidencia" : "Actualizar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const renderDeleteModal = () => (
    <Modal show={show} onHide={onClose} centered size="sm">
      <Modal.Body className="text-center p-4">
        <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: "3rem" }}></i>
        <h5 className="mt-3 fw-bold">¿Eliminar Incidencia?</h5>
        <p className="text-muted">Esta acción no se puede deshacer.</p>
        <div className="d-flex justify-content-center gap-2 mt-4">
          <Button variant="light" onClick={onClose}>No</Button>
          <Button variant="danger" onClick={() => onConfirm(incidenceData.id)}>Sí, eliminar</Button>
        </div>
      </Modal.Body>
    </Modal>
  );

  return mode === "delete" ? renderDeleteModal() : renderFormModal();
};

export default IncidenceModals;