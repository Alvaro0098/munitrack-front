import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { CreateOperator } from "../../services/OperatorService";

// 1. AGREGAMOS 'mode' y 'operatorData' A LAS PROPS
const OperatorModals = ({ show, mode, operatorData, onClose, onConfirm }) => {
  const initialState = {
    nombre: "",
    apellido: "",
    dni: "",
    nroLegajo: "",
    mail: "",
    celular: "",
    cargo: "",
    password: ""
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  // 2. EFECTO PARA CARGAR DATOS SI ES EDICIÓN
  useEffect(() => {
    if (show) {
      if (mode === "edit" && operatorData) {
        // Mapeamos lo que viene de la DB (minúsculas) a tus nombres de estado
        setFormData({
          nombre: operatorData.name || "",
          apellido: operatorData.lastName || "",
          dni: operatorData.dni || "",
          nroLegajo: operatorData.nLegajo || "",
          mail: operatorData.email || "",
          celular: operatorData.phone || "",
          cargo: operatorData.position || "",
          password: "" // Contraseña vacía por seguridad en edición
        });
      } else {
        setFormData(initialState);
      }
      setErrors({});
    }
  }, [show, mode, operatorData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "Nombre requerido.";
    if (!formData.apellido.trim()) newErrors.apellido = "Apellido requerido.";
    if (!formData.dni) newErrors.dni = "DNI requerido.";
    else if (isNaN(formData.dni)) newErrors.dni = "Ingrese solo números.";
    if (!formData.nroLegajo) newErrors.nroLegajo = "Legajo requerido.";
    else if (isNaN(formData.nroLegajo)) newErrors.nroLegajo = "Ingrese solo números.";
    
    // Al editar, la contraseña puede ser opcional si no se quiere cambiar
    if (mode === "create") {
      if (!formData.password) newErrors.password = "Contraseña requerida.";
      else if (formData.password.length < 8) newErrors.password = "Mínimo 8 caracteres.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.mail) newErrors.mail = "Email requerido.";
    else if (!emailRegex.test(formData.mail)) newErrors.mail = "Email no válido.";

    if (!formData.cargo) newErrors.cargo = "Seleccione un cargo.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    // Simplemente pasamos el formData al padre, él decidirá si crear o editar
    onConfirm(formData); 
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">
          {/* 3. TÍTULO DINÁMICO SEGÚN EL MODO */}
          {mode === "edit" ? "Editar Operador" : "Registrar Nuevo Operador"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form onSubmit={handleSubmit} autoComplete="off">
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={errors.nombre ? "border-danger" : ""}
              />
              {errors.nombre && <small className="text-danger ms-1">{errors.nombre}</small>}
            </div>
            <div className="col-md-6 mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className={errors.apellido ? "border-danger" : ""}
              />
              {errors.apellido && <small className="text-danger ms-1">{errors.apellido}</small>}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label>DNI</Form.Label>
              <Form.Control
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                disabled={mode === "edit"} // Deshabilitado si es edición
                className={errors.dni ? "border-danger" : ""}
              />
              {errors.dni && <small className="text-danger ms-1">{errors.dni}</small>}
            </div>
            <div className="col-md-6 mb-3">
              <Form.Label>N° de Legajo</Form.Label>
              <Form.Control
                name="nroLegajo"
                value={formData.nroLegajo}
                onChange={handleChange}
                disabled={mode === "edit"} // <--- AHORA SÍ FUNCIONA PORQUE 'mode' EXISTE
                className={errors.nroLegajo ? "border-danger" : ""}
              />
              {errors.nroLegajo && <small className="text-danger ms-1">{errors.nroLegajo}</small>}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="mail"
                value={formData.mail}
                onChange={handleChange}
                className={errors.mail ? "border-danger" : ""}
              />
              {errors.mail && <small className="text-danger ms-1">{errors.mail}</small>}
            </div>
            <div className="col-md-6 mb-3">
              <Form.Label>Contraseña {mode === "edit" && "(Opcional)"}</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "border-danger" : ""}
                placeholder={mode === "edit" ? "Dejar vacío para no cambiar" : ""}
              />
              {errors.password && <small className="text-danger ms-1">{errors.password}</small>}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label>Cargo</Form.Label>
              <Form.Select
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                className={errors.cargo ? "border-danger" : ""}
              >
                <option value="">Seleccione...</option>
                <option value="SysAdmin">SysAdmin (SuperAdmin)</option>
                <option value="Admin">Admin</option>
                <option value="Basic">Basic (Operador)</option>
              </Form.Select>
              {errors.cargo && <small className="text-danger ms-1">{errors.cargo}</small>}
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit}>
          {/* BOTÓN DINÁMICO */}
          {mode === "edit" ? "Actualizar" : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OperatorModals;