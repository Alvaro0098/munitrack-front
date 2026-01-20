import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import "./CitizenProfile.css";

const CitizenProfile = ({ ciudadano }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: ciudadano?.nombre ?? "",
    apellido: ciudadano?.apellido ?? "",
    dni: ciudadano?.dni ?? "",
    correoElectronico: ciudadano?.correoElectronico ?? "",
    celular: ciudadano?.celular ?? "",
  });

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleSave = () => {
    console.log("Datos actualizados:", formData);
    handleClose();
    // llamar al backend para actualizar los datos
  };

  return (
    <>

      <div id="modal-fondo">
        <Modal
          show={showModal}
          onHide={handleClose}
          centered
          dialogClassName="custom-modal"
        >
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="fw-bold">Editar Datos del Ciudadano</Modal.Title>
          </Modal.Header>

          <Modal.Body className="modal-body-degrade">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>DNI</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.dni}
                  onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.correoElectronico}
                  onChange={(e) => setFormData({ ...formData, correoElectronico: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Celular</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.celular}
                  onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer className="border-0">
            <Button variant="secondary" onClick={handleClose} className="btn-gradient-secondary">
              Cancelar
            </Button>
            <Button id="butonModal" onClick={handleSave} className="btn-gradient-success">
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default CitizenProfile;