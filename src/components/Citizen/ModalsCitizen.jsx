import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useForm } from "../../hooks/useForm";

const CitizenModals = ({ show, mode, citizenData, onClose, onConfirm, onError }) => {
  const [initialFormState, setInitialFormState] = useState(null);
  
  /**
   * Validar formulario
   */
  const validateCitizen = (values) => {
    const errors = {};
    const onlyNumbers = /^[0-9]+$/;

    if (!values.nombre || values.nombre.trim().length === 0) {
      errors.nombre = "El nombre es obligatorio.";
    }
    if (!values.apellido || values.apellido.trim().length === 0) {
      errors.apellido = "El apellido es obligatorio.";
    }
    if (!values.dni || values.dni.toString().length === 0) {
      errors.dni = "El DNI es obligatorio.";
    } else if (values.dni.toString().includes('-')) {
      errors.dni = "El DNI debe ser un número positivo (no se aceptan negativos).";
    } else if (!onlyNumbers.test(values.dni.toString())) {
      errors.dni = "El DNI solo puede contener números.";
    } else if (values.dni.toString().length > 10) {
      errors.dni = "El DNI no puede tener más de 10 dígitos.";
    }
    if (!values.mail || values.mail.trim().length === 0) {
      errors.mail = "El email es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(values.mail)) {
      errors.mail = "El formato de email es inválido.";
    }
    if (!values.direccion || values.direccion.trim().length === 0) {
      errors.direccion = "La dirección es obligatoria.";
    }
    if (!values.celular || values.celular.trim().length === 0) {
      errors.celular = "El celular es obligatorio.";
    } else if (values.celular.includes('-')) {
      errors.celular = "El celular debe ser un número positivo (no se aceptan negativos).";
    } else if (!onlyNumbers.test(values.celular.trim())) {
      errors.celular = "El celular solo puede contener números.";
    } else if (values.celular.trim().length > 10) {
      errors.celular = "El celular no puede tener más de 10 dígitos.";
    }

    return errors;
  };

  const { formData, setFormData, errors, handleChange, handleSubmit, setServerErrors, clearErrors } = useForm({
    nombre: "",
    apellido: "",
    dni: "",
    mail: "",
    direccion: "",
    celular: ""
  }, validateCitizen);

  /**
   * Manejo de errores del servidor
   * Si el backend devuelve "Ya existe un ciudadano con DNI", muestra el error en el campo DNI
   */
  const handleServerError = (error, setServerErrors) => {
    const errorMessage = error?.message || error?.response?.data?.message || '';
    
    console.log('Error del servidor capturado:', error);
    console.log('Mensaje de error:', errorMessage);
    
    // Detectar error de DNI duplicado del backend
    if (errorMessage.includes('Ya existe un ciudadano con DNI')) {
      // ✅ Setear el error en el campo DNI usando la función del hook
      setServerErrors({ dni: 'Este DNI ya está registrado. Por favor, ingresá uno nuevo.' });
      // NO relanzar el error - el modal permanece abierto
    } else if (onError) {
      // Para otros errores, delegar al callback genérico del padre
      onError(error);
    }
  };

  useEffect(() => {
    if (show && mode !== "delete") {
      clearErrors();
      if (mode === "edit" && citizenData) {
        const initialData = {
          nombre: citizenData.name || "",
          apellido: citizenData.lastName || "",
          dni: citizenData.dni?.toString() || "",
          mail: citizenData.email || "",
          direccion: citizenData.adress || "",
          celular: citizenData.phone || ""
        };
        setFormData(initialData);
        setInitialFormState(initialData);
      } else {
        const initialData = { nombre: "", apellido: "", dni: "", mail: "", direccion: "", celular: "" };
        setFormData(initialData);
        setInitialFormState(initialData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, mode, citizenData, setFormData]);

  const hasLocalChanges = () => {
    if (mode !== "edit" || !initialFormState) return true;
    return JSON.stringify(formData) !== JSON.stringify(initialFormState);
  };

  const sendCitizen = async (formDataValues) => {
    // En modo edit, validar que haya cambios reales
    if (mode === "edit" && !hasLocalChanges()) {
      // No hay cambios, cerrar modal sin hacer nada
      console.log("No hay cambios en el formulario");
      onClose();
      return;
    }
    
    const dataForBack = {
      Name: formDataValues.nombre,
      LastName: formDataValues.apellido,
      DNI: Number(formDataValues.dni),
      Email: formDataValues.mail,
      Adress: formDataValues.direccion,
      Phone: formDataValues.celular,
    };
    
    // Esperar a que el padre complete la operación para capturar errores
    await onConfirm(dataForBack);
  };

  const renderFormModal = () => (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">
          {mode === "create" ? "Registrar Nuevo Ciudadano" : "Editar Datos del Ciudadano"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form noValidate>
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleChange} 
                isInvalid={!!errors.nombre}
              />
              <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
            </div>
            <div className="col-md-6 mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control 
                name="apellido" 
                value={formData.apellido} 
                onChange={handleChange} 
                isInvalid={!!errors.apellido}
              />
              <Form.Control.Feedback type="invalid">{errors.apellido}</Form.Control.Feedback>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label>DNI</Form.Label>
              <Form.Control 
                name="dni" 
                value={formData.dni} 
                onChange={handleChange} 
                isInvalid={!!errors.dni}
              />
              <Form.Control.Feedback type="invalid">{errors.dni}</Form.Control.Feedback>
            </div>
            <div className="col-md-6 mb-3">
              <Form.Label>Celular</Form.Label>
              <Form.Control 
                name="celular" 
                value={formData.celular} 
                onChange={handleChange} 
                isInvalid={!!errors.celular}
              />
              <Form.Control.Feedback type="invalid">{errors.celular}</Form.Control.Feedback>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                name="mail" 
                value={formData.mail} 
                onChange={handleChange} 
                isInvalid={!!errors.mail}
              />
              <Form.Control.Feedback type="invalid">{errors.mail}</Form.Control.Feedback>
            </div>
            <div className="col-md-6 mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control 
                name="direccion" 
                value={formData.direccion} 
                onChange={handleChange} 
                isInvalid={!!errors.direccion}
              />
              <Form.Control.Feedback type="invalid">{errors.direccion}</Form.Control.Feedback>
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={() => handleSubmit(sendCitizen, handleServerError)}>
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
        <p className="text-muted">
          Se borrará a: <br />
          <b className="text-dark">
            {citizenData?.name} {citizenData?.lastName} 
          </b>
          <br />
          <small className="text-secondary">(dni: {citizenData?.dni})</small>
        </p>
        <div className="d-flex justify-content-center gap-2 mt-4">
          <Button variant="light" onClick={onClose}>No</Button>
          <Button 
            variant="danger" 
            onClick={async () => {
              try {
                await onConfirm(citizenData?.dni);
              } catch (error) {
                // El error se relanza desde handleConfirmAction
                // Se puede manejar aquí si es necesario
                console.error('Error al eliminar:', error);
                if (onError) {
                  onError(error);
                }
              }
            }}
          >
            Sí, eliminar
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );

  return mode === "delete" ? renderDeleteModal() : renderFormModal();
};

export default CitizenModals;