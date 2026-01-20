import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const OperatorModals = ({ show, mode, operatorData, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    nroLegajo: "",
    mail: "",
    celular: "",
    cargo: ""
  });

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (mode === "edit" && operatorData) {
      setFormData(operatorData);
    } else {
      setFormData({ nombre: "", apellido: "", dni: "", nroLegajo: "", mail: "", celular: "", cargo: "" });
    }
  }, [mode, operatorData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 1. Render para Crear y Editar
  const renderFormModal = () => (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">
          {mode === "create" ? "Registrar Nuevo Operador" : "Editar Datos del Operador"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form>
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="nombre" value={formData.nombre} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control name="apellido" value={formData.apellido} onChange={handleChange} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label>DNI</Form.Label>
              <Form.Control name="dni" value={formData.dni} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <Form.Label>N° de Legajo</Form.Label>
              <Form.Control name="nroLegajo" value={formData.nroLegajo} onChange={handleChange} />
            </div>
          </div>
          <div className="row">
        <div className="col-md-6 mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="mail" value={formData.mail} onChange={handleChange} />
          </div>
          </div>
  
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label>Celular</Form.Label>
              <Form.Control name="celular" value={formData.celular} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <Form.Label>Cargo</Form.Label>
              <Form.Select name="cargo" value={formData.cargo} onChange={handleChange}>
                <option value="">Seleccione...</option>
                <option value="Operador">Operador</option>
                <option value="Supervisor">Supervisor</option>
              </Form.Select>
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={() => onConfirm(formData)} className="btn-gradient-success">
          {mode === "create" ? "Guardar Operador" : "Actualizar Cambios"}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  // 2. Render para Eliminar (Mini Modal)
  const renderDeleteModal = () => (
    <Modal show={show} onHide={onClose} centered size="sm">
      <Modal.Body className="text-center p-4">
        <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: "3rem" }}></i>
        <h5 className="mt-3 fw-bold">¿Estás seguro?</h5>
        <p className="text-muted">Esta acción eliminará permanentemente al operador <b>{operatorData?.nombre}</b>.</p>
        <div className="d-flex justify-content-center gap-2 mt-4">
          <Button variant="light" onClick={onClose}>Cancelar</Button>
          <Button variant="danger" onClick={() => onConfirm(operatorData.id)}>Eliminar</Button>
        </div>
      </Modal.Body>
    </Modal>
  );

  return mode === "delete" ? renderDeleteModal() : renderFormModal();
};

export default OperatorModals;