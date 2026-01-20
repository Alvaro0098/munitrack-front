import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const CitizenModals = ({ show, mode, citizenData, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    mail: "",
    direccion: "",
    celular: ""
  });

  useEffect(() => {
    if (mode === "edit" && citizenData) {
      setFormData(citizenData);
    } else {
      setFormData({ nombre: "", apellido: "", dni: "", mail: "", direccion: "", celular: "" });
    }
  }, [mode, citizenData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const renderFormModal = () => (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">
          {mode === "create" ? "Registrar Nuevo Ciudadano" : "Editar Datos del Ciudadano"}
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
              <Form.Label>Celular</Form.Label>
              <Form.Control name="celular" value={formData.celular} onChange={handleChange} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="mail" value={formData.mail} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control name="direccion" value={formData.direccion} onChange={handleChange} />
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={() => onConfirm(formData)}>
          {mode === "create" ? "Guardar" : "Actualizar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const renderDeleteModal = () => (
    <Modal show={show} onHide={onClose} centered size="sm">
      <Modal.Body className="text-center p-4">
        <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: "3rem" }}></i>
        <h5 className="mt-3 fw-bold">¿Eliminar Ciudadano?</h5>
        <p className="text-muted">Se borrará a <b>{citizenData?.nombre}</b>.</p>
        <div className="d-flex justify-content-center gap-2 mt-4">
          <Button variant="light" onClick={onClose}>No</Button>
          <Button variant="danger" onClick={() => onConfirm(citizenData.id)}>Sí, eliminar</Button>
        </div>
      </Modal.Body>
    </Modal>
  );

  return mode === "delete" ? renderDeleteModal() : renderFormModal();
};

export default CitizenModals;