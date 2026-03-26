import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useForm } from "../../hooks/useForm";

const OperatorModals = ({ show, mode, operatorData, onClose, onConfirm, onError }) => {
  const [initialFormState, setInitialFormState] = useState(null);
  
  const validateOperator = (values) => {
    const errors = {};
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const onlyNumbers = /^[0-9]+$/;
    if (!values.DNI) {
      errors.DNI = "El DNI es obligatorio.";
    } else if (values.DNI.toString().includes('-')) {
      errors.DNI = "El DNI debe ser un número positivo (no se aceptan negativos).";
    } else if (!onlyNumbers.test(values.DNI.toString())) {
      errors.DNI = "El DNI solo puede contener números.";
    } else if (values.DNI.toString().length > 8) {
      errors.DNI = "El DNI no puede superar los 8 dígitos.";
    }
    if (!values.NLegajo) {
      errors.NLegajo = "El N° de Legajo es obligatorio.";
    } else if (values.NLegajo.toString().includes('-')) {
      errors.NLegajo = "El N° de Legajo debe ser un número positivo (no se aceptan negativos).";
    } else if (!onlyNumbers.test(values.NLegajo.toString())) {
      errors.NLegajo = "El N° de Legajo solo puede contener números.";
    } else if (values.NLegajo.toString().length < 4) {
      errors.NLegajo = "El legajo debe tener al menos 4 números.";
    }
    if (mode === "create" && !passwordRegex.test(values.Password)) {
      errors.Password = "Mínimo 8 caracteres, incluyendo una mayúscula, una minúscula y un número.";
    }
    if (values.Phone) {
      if (values.Phone.toString().includes('-')) {
        errors.Phone = "El celular debe ser un número positivo (no se aceptan negativos).";
      } else if (!onlyNumbers.test(values.Phone.toString())) {
        errors.Phone = "El celular solo puede contener números.";
      } else if (values.Phone.length > 8) {
        errors.Phone = "El celular no puede tener más de 8 dígitos.";
      }
    }
    if (!values.Email) {
      errors.Email = "El correo es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(values.Email)) {
      errors.Email = "El formato de email es inválido.";
    }
    if (!values.Name) errors.Name = "El nombre es obligatorio.";
    if (!values.LastName) errors.LastName = "El apellido es obligatorio.";
    return errors;
  };

  const { formData, setFormData, errors, handleChange, handleSubmit, setServerErrors, clearErrors } = useForm({
    DNI: "", Name: "", LastName: "", NLegajo: "", Password: "", Phone: "", Email: "", position: "0", 
  }, validateOperator);

  /**
   * Manejo de errores del servidor
   * Si el backend devuelve "Ya existe un operador con DNI X", muestra el error en el campo DNI
   * @param {Error} error - Objeto de error del servidor
   * @param {function} setServerErrors - Función para setear errores en el formulario
   */
  const handleServerError = (error, setServerErrors) => {
    // Extraer el mensaje de error del objeto error
    const errorMessage = error?.message || error?.response?.data?.message || '';
    const msg = errorMessage.toLowerCase();
    
    // Detectar error de N° de Legajo (minúsculas para ser robusto)
    if (msg.includes('legajo')) {
      // ✅ Setear el error en el campo NLegajo usando la función del hook
      setServerErrors({ NLegajo: 'Este N° de Legajo ya está registrado. Por favor, ingresá uno nuevo.' });
      // NO relanzar el error - el modal permanece abierto
    } else if (msg.includes('dni')) {
      // ✅ Setear el error en el campo DNI usando la función del hook
      setServerErrors({ DNI: 'Este DNI ya está registrado. Por favor, ingresá uno nuevo.' });
      // NO relanzar el error - el modal permanece abierto
    } else if (onError) {
      // Para otros errores, delegar al callback genérico del padre
      onError(error);
    }
  };

  useEffect(() => {
    if (show && mode !== "delete") {
      clearErrors();
      if (mode === "edit" && operatorData) {
        const initialData = {
          DNI: operatorData.dni || "",
          Name: operatorData.name || "",
          LastName: operatorData.lastName || "",
          NLegajo: operatorData.nLegajo || "",
          Password: "", 
          Phone: operatorData.phone || "",
          Email: operatorData.email || "",
          position: operatorData.position?.toString() || "0"
        };
        setFormData(initialData);
        setInitialFormState(initialData);
      } else {
        const initialData = { DNI: "", Name: "", LastName: "", NLegajo: "", Password: "", Phone: "", Email: "", position: "0" };
        setFormData(initialData);
        setInitialFormState(initialData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, mode, operatorData, setFormData]);

  const hasLocalChanges = () => {
    if (mode !== "edit" || !initialFormState) return true;
    return JSON.stringify(formData) !== JSON.stringify(initialFormState);
  };

  const handleConfirmOperator = async (formDataValues) => {
    // En modo edit, validar que haya cambios reales
    if (mode === "edit" && !hasLocalChanges()) {
      console.log("No hay cambios en el operador");
      onClose();
      return;
    }
    await onConfirm(formDataValues);
  };

  const renderFormModal = () => (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">
          {mode === "create" ? "Registrar Operador" : "Editar Operador"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form noValidate>
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label className="fw-semibold">DNI</Form.Label>
              <Form.Control type="number" name="DNI" value={formData.DNI} onChange={handleChange} isInvalid={!!errors.DNI} />
              <Form.Control.Feedback type="invalid">{errors.DNI}</Form.Control.Feedback>
            </div>
            <div className="col-md-6 mb-3">
              <Form.Label className="fw-semibold">N° Legajo</Form.Label>
              <Form.Control type="number" name="NLegajo" value={formData.NLegajo} onChange={handleChange} isInvalid={!!errors.NLegajo} />
              <Form.Control.Feedback type="invalid">{errors.NLegajo}</Form.Control.Feedback>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label className="fw-semibold">Nombre</Form.Label>
              <Form.Control name="Name" value={formData.Name} onChange={handleChange} isInvalid={!!errors.Name} />
              <Form.Control.Feedback type="invalid">{errors.Name}</Form.Control.Feedback>
            </div>
            <div className="col-md-6 mb-3">
              <Form.Label className="fw-semibold">Apellido</Form.Label>
              <Form.Control name="LastName" value={formData.LastName} onChange={handleChange} isInvalid={!!errors.LastName} />
              <Form.Control.Feedback type="invalid">{errors.LastName}</Form.Control.Feedback>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Label className="fw-semibold">Cargo / Rol</Form.Label>
            <Form.Select name="position" value={formData.position} onChange={handleChange}>
              <option value="0">Operador Básico</option>
              <option value="1">Admin</option>
              <option value="2">SysAdmin</option>
            </Form.Select>
          </div>
          {mode === "create" && (
            <div className="mb-3">
              <Form.Label className="fw-semibold">Contraseña</Form.Label>
              <Form.Control type="password" name="Password" value={formData.Password} onChange={handleChange} isInvalid={!!errors.Password} autoComplete="new-password" />
              <Form.Control.Feedback type="invalid">{errors.Password}</Form.Control.Feedback>
            </div>
          )}
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label className="fw-semibold">Email</Form.Label>
              <Form.Control type="email" name="Email" value={formData.Email} onChange={handleChange} isInvalid={!!errors.Email} />
              <Form.Control.Feedback type="invalid">{errors.Email}</Form.Control.Feedback>
            </div>
            <div className="col-md-6 mb-3">
              <Form.Label className="fw-semibold">Celular</Form.Label>
              <Form.Control name="Phone" value={formData.Phone} onChange={handleChange} isInvalid={!!errors.Phone} />
              <Form.Control.Feedback type="invalid">{errors.Phone}</Form.Control.Feedback>
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="light" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={() => handleSubmit(handleConfirmOperator, handleServerError)}>
          {mode === "create" ? "Guardar" : "Actualizar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const renderDeleteModal = () => (
    <Modal show={show} onHide={onClose} centered size="sm">
      <Modal.Body className="text-center p-4">
        <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: "3rem" }}></i>
        <h5 className="mt-3 fw-bold">¿Eliminar Operador?</h5>
        <p className="text-muted">
          Se borrará a: <br />
          <b className="text-dark">{operatorData?.name} {operatorData?.lastName}</b> <br />
          <small className="text-secondary">(DNI: {operatorData?.dni})</small>
        </p>
        <div className="d-flex justify-content-center gap-2 mt-4">
          <Button variant="light" onClick={onClose}>No</Button>
          <Button variant="danger" onClick={() => onConfirm(operatorData?.dni)}>Sí, eliminar</Button>
        </div>
      </Modal.Body>
    </Modal>
  );

  return mode === "delete" ? renderDeleteModal() : renderFormModal();
};

export default OperatorModals;