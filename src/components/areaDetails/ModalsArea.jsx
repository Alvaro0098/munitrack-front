import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useForm } from "../../hooks/useForm";

const ModalsArea = ({ show, mode, areaData, onClose, onConfirm }) => {
  const [initialFormState, setInitialFormState] = useState(null);
  
  const validateArea = (values) => {
    const errors = {};
    
    if (!values.titulo || values.titulo.trim().length === 0) {
      errors.titulo = "El nombre es obligatorio.";
    } else if (values.titulo.trim().length < 3) {
      errors.titulo = "El nombre debe tener al menos 3 caracteres.";
    } else if (values.titulo.trim().length > 100) {
      errors.titulo = "El nombre no puede superar 100 caracteres.";
    }
    
    if (!values.desc || values.desc.trim().length === 0) {
      errors.desc = "La descripción es obligatoria.";
    } else if (values.desc.trim().length < 10) {
      errors.desc = "La descripción debe tener al menos 10 caracteres.";
    } else if (values.desc.trim().length > 1000) {
      errors.desc = "La descripción no puede superar 1000 caracteres.";
    }
    
    return errors;
  };

  const { formData, setFormData, errors, handleChange, handleSubmit, clearErrors } = useForm({
    titulo: "",
    desc: ""
  }, validateArea);

  useEffect(() => {
    if (show && mode !== "delete") {
      clearErrors();
      if (mode === "edit" && areaData) {
        const initialData = {
          titulo: areaData.name || "",
          desc: areaData.description || ""
        };
        setFormData(initialData);
        setInitialFormState(initialData);
      } else {
        const initialData = { titulo: "", desc: "" };
        setFormData(initialData);
        setInitialFormState(initialData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, mode, areaData, setFormData]);

  const hasLocalChanges = () => {
    if (mode !== "edit" || !initialFormState) return true;
    return JSON.stringify(formData) !== JSON.stringify(initialFormState);
  };

  const handleConfirmArea = async (formDataValues) => {
    // En modo edit, validar que haya cambios reales
    if (mode === "edit" && !hasLocalChanges()) {
      console.log("No hay cambios en el área");
      onClose();
      return;
    }
    await onConfirm(formDataValues);
  };

  const renderFormModal = () => (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">
          {mode === "create" ? "Nueva Área Municipal" : "Modificar Área"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form noValidate>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Nombre de la Dependencia</Form.Label>
            <Form.Control 
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ej: Secretaría de Salud"
              isInvalid={!!errors.titulo}
            />
            <Form.Control.Feedback type="invalid">{errors.titulo}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Descripción / Función</Form.Label>
            <Form.Control 
              as="textarea"
              rows={4}
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              placeholder="Describa brevemente las tareas del área..."
              isInvalid={!!errors.desc}
            />
            <Form.Control.Feedback type="invalid">{errors.desc}</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="light" onClick={onClose}>Cancelar</Button>
        <Button 
          variant="primary" 
          onClick={() => handleSubmit(handleConfirmArea)}
        >
          {mode === "create" ? "Guardar" : "Actualizar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const renderDeleteModal = () => (
    <Modal show={show} onHide={onClose} centered size="sm">
      <Modal.Body className="text-center p-4">
        <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: "3rem" }}></i>
        <h5 className="mt-3 fw-bold">¿Eliminar Área?</h5>
        <p className="text-muted">
          Se borrará: <br />
          <b className="text-dark">{areaData?.name || "Sin nombre"}</b>
          <br />
          <small className="text-secondary">(ID: {areaData?.id})</small>
        </p>
        <p className="text-danger small"><i className="bi bi-info-circle me-1"></i>Esta acción es irreversible.</p>
        <div className="d-flex justify-content-center gap-2 mt-4">
          <Button variant="light" onClick={onClose}>No</Button>
          <Button variant="danger" onClick={() => onConfirm(areaData?.id)}>
            Sí, eliminar
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );

  return mode === "delete" ? renderDeleteModal() : renderFormModal();
};

export default ModalsArea;