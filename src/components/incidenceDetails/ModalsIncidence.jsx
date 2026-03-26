import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { GetAreas } from "../../services/AreaService";
import { useForm } from "../../hooks/useForm";  

const ModalsIncidence = ({ show, mode, incidenceData, onClose, onConfirm }) => {
  const [areas, setAreas] = useState([]);
  const [initialFormState, setInitialFormState] = useState(null);

  const validateIncidence = (values) => {
    const errors = {};
    
    // Fecha
    if (!values.fecha) {
      errors.fecha = "La fecha es obligatoria.";
    } else {
      const selectedDate = new Date(values.fecha);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        errors.fecha = "No se permite registrar incidencias en el futuro.";
      }
    }
    
    // Área
    if (!values.area || values.area === "" || values.area === "0") {
      errors.area = "El área responsable es obligatoria.";
    }
    
    // Observación con máximo
    if (!values.observacion || values.observacion.length < 10) {
      errors.observacion = "La observación debe tener al menos 10 caracteres.";
    } else if (values.observacion.length > 500) {
      errors.observacion = "La observación no puede superar 500 caracteres.";
    }
    
    return errors;
  };

  const { formData, setFormData, errors, handleChange, handleSubmit, clearErrors } = useForm({
    fecha: "",
    tipo: "0",
    estado: "0",
    operador: "0",
    area: "",
    observacion: ""
  }, validateIncidence);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await GetAreas();
        setAreas(data);
      } catch (error) {
        console.error("Error al cargar áreas:", error);
      }
    };
    if (show && mode !== "delete") fetchAreas();
  }, [show, mode]);

  useEffect(() => {
    if (show && mode !== "delete") {
      clearErrors();
      if (mode === "edit" && incidenceData) {
        const initialData = {
          fecha: incidenceData.date ? incidenceData.date.split('T')[0] : "",
          tipo: incidenceData.incidenceType?.toString() || "0",
          estado: incidenceData.state?.toString() || "0",
          area: incidenceData.areaId?.toString() || "",
          observacion: incidenceData.description || ""
        };
        setFormData(initialData);
        setInitialFormState(initialData);
      } else {
        const initialData = { 
          fecha: new Date().toISOString().split('T')[0], 
          tipo: "0", 
          estado: "0", 
          area: "", 
          observacion: "" 
        };
        setFormData(initialData);
        setInitialFormState(initialData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, incidenceData, show, setFormData]);

  const hasLocalChanges = () => {
    if (mode !== "edit" || !initialFormState) return true;
    return JSON.stringify(formData) !== JSON.stringify(initialFormState);
  };

  const handleConfirmIncidence = async (formDataValues) => {
    // En modo edit, validar que haya cambios reales
    if (mode === "edit" && !hasLocalChanges()) {
      console.log("No hay cambios en la incidencia");
      onClose();
      return;
    }
    await onConfirm(formDataValues);
  };

  const renderFormModal = () => (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">
          {mode === "create" ? "Registrar Nueva Incidencia" : "Editar Incidencia"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form noValidate>
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
                disabled={mode === "edit"}
                isInvalid={!!errors.area}
              >
                <option value="">Seleccione un área...</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.area}
              </Form.Control.Feedback>
            </div>
          </div>

          <div className="mb-3">
            <Form.Label className="fw-semibold">Observación</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              name="observacion" 
              value={formData.observacion} 
              onChange={handleChange} 
              placeholder="Detalles de la incidencia..."
              isInvalid={!!errors.observacion}
            />
            <Form.Control.Feedback type="invalid">
              {errors.observacion}
            </Form.Control.Feedback>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="light" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={() => handleSubmit(handleConfirmIncidence)}>
          {mode === "create" ? "Guardar" : "Actualizar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const renderDeleteModal = () => (
    <Modal show={show} onHide={onClose} centered size="sm">
      <Modal.Body className="text-center p-4">
        <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: "3rem" }}></i>
        <h5 className="mt-3 fw-bold">¿Eliminar Incidencia?</h5>
        <p className="text-muted">
          Se borrará la incidencia con ID: <b className="text-dark">{incidenceData?.id}</b> <br />
          Operador responsable: <br />
          <b className="text-dark">
            {incidenceData?.operator 
              ? `${incidenceData.operator.name} ${incidenceData.operator.lastName}` 
              : `ID Operador: ${incidenceData?.operatorId}`}
          </b>
        </p>
        <div className="d-flex justify-content-center gap-2 mt-4">
          <Button variant="light" onClick={onClose}>No</Button>
          <Button variant="danger" onClick={() => onConfirm(incidenceData?.id)}>Sí, eliminar</Button>
        </div>
      </Modal.Body>
    </Modal>
  );

  return mode === "delete" ? renderDeleteModal() : renderFormModal();
};

export default ModalsIncidence;