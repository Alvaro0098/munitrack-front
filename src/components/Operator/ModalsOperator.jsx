import React, { useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useForm } from "../../hooks/useForm";



const OperatorModals = ({ show, mode, operatorData, onClose, onConfirm }) => {
  

  const validateOperator = (values) => {
    const errors = {};
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    // (Máximo 8 números) 
    if (!values.DNI) {
      errors.DNI = "El DNI es obligatorio.";
    } else if (values.DNI.toString().length > 8) {
      errors.DNI = "El DNI no puede superar los 8 dígitos.";
    }

    // (Mínimo 4 números) 
    if (!values.NLegajo) {
      errors.NLegajo = "El N° de Legajo es obligatorio.";
    } else if (values.NLegajo.toString().length < 4) {
      errors.NLegajo = "El legajo debe tener al menos 4 números.";
    }

    // (Min 8 caracteres, Mayús, Minús y Número) 
    if (mode === "create" && !passwordRegex.test(values.Password)) {
      errors.Password = "Mínimo 8 caracteres, incluyendo una mayúscula, una minúscula y un número.";
    }

    // (Máximo 8 números) 
    if (values.Phone && values.Phone.length > 8) {
      errors.Phone = "El celular no puede tener más de 8 dígitos.";
    }

    // mayuscula, minuscula, numero, minimo 8 caracteres
    if (!values.Email) {
      errors.Email = "El correo es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(values.Email)) {
      errors.Email = "El formato de email es inválido.";
    }

    if (!values.Name) errors.Name = "El nombre es obligatorio.";
    if (!values.LastName) errors.LastName = "El apellido es obligatorio.";

    return errors;
  };

  const { formData, setFormData, errors, handleChange, handleSubmit } = useForm({
    DNI: "",
    Name: "",
    LastName: "",
    NLegajo: "",
    Password: "",
    Phone: "",
    Email: "",
    position: "0", 
  },  validateOperator);

  useEffect(() => {
    if (show) {
      if (mode === "edit" && operatorData) {
        // Mapeamos los datos del backend a los nombres de nuestro formulario
        setFormData({
          DNI: operatorData.dni || "",
          Name: operatorData.name || "",
          LastName: operatorData.lastName || "",
          NLegajo: operatorData.nLegajo || "",
          Password: "", 
          Phone: operatorData.phone || "",
          Email: operatorData.email || "",
          position: operatorData.position.toString() || "0"
        });
      } else {
        
        setFormData({
       DNI: "", Name: "", LastName: "", NLegajo: "", 
        Password: "", Phone: "", Email: "", position: "0"
      });
      }
    }
  }, [show, mode, operatorData, setFormData]);

  return (
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
              <Form.Control 
                type="number" name="DNI" value={formData.DNI} 
                onChange={handleChange} isInvalid={!!errors.DNI}
              />
              <Form.Control.Feedback type="invalid">{errors.DNI}</Form.Control.Feedback>
            </div>
            <div className="col-md-6 mb-3">
              <Form.Label className="fw-semibold">N° Legajo</Form.Label>
              <Form.Control 
                type="number" name="NLegajo" value={formData.NLegajo} 
                onChange={handleChange} isInvalid={!!errors.NLegajo}
              />
              <Form.Control.Feedback type="invalid">{errors.NLegajo}</Form.Control.Feedback>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label className="fw-semibold">Nombre</Form.Label>
              <Form.Control 
                name="Name" value={formData.Name} 
                onChange={handleChange} isInvalid={!!errors.Name}
              />
              <Form.Control.Feedback type="invalid">{errors.Name}</Form.Control.Feedback>
            </div>
            <div className="col-md-6 mb-3">
              <Form.Label className="fw-semibold">Apellido</Form.Label>
              <Form.Control 
                name="LastName" value={formData.LastName} 
                onChange={handleChange} isInvalid={!!errors.LastName}
              />
              <Form.Control.Feedback type="invalid">{errors.LastName}</Form.Control.Feedback>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <Form.Label className="fw-semibold">Cargo / Rol</Form.Label>
            <Form.Select 
              name="position" 
              value={formData.position} 
              onChange={handleChange}
            >
              <option value="0">Operador Básico</option>
              <option value="1">Admin</option>
              <option value="2">SysAdmin</option>
            </Form.Select>
          </div>

          {mode === "create" && (
            <div className="mb-3">
              <Form.Label className="fw-semibold">Contraseña</Form.Label>
              <Form.Control 
                type="password" name="Password" value={formData.Password} 
                onChange={handleChange} isInvalid={!!errors.Password} autoComplete="new-password"
              />
              <Form.Control.Feedback type="invalid">{errors.Password}</Form.Control.Feedback>
            </div>
          )}

       

          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label className="fw-semibold">Email</Form.Label>
              <Form.Control 
                type="email" name="Email" value={formData.Email} 
                onChange={handleChange} isInvalid={!!errors.Email}
              />
              <Form.Control.Feedback type="invalid">{errors.Email}</Form.Control.Feedback>
            </div>
            <div className="col-md-6 mb-3">
              <Form.Label className="fw-semibold">Celular</Form.Label>
              <Form.Control 
                name="Phone" value={formData.Phone} 
                onChange={handleChange} isInvalid={!!errors.Phone}
              />
              <Form.Control.Feedback type="invalid">{errors.Phone}</Form.Control.Feedback>
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="light" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={() => handleSubmit(onConfirm)}>
          {mode === "create" ? "Guardar" : "Actualizar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OperatorModals;