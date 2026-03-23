import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Toast, ToastContainer } from "react-bootstrap";
import TopBar from "../topBar/TopBar";
import { GetDeletedIncidences, RestoreIncidence } from "../../services/IncidenceService";

const TIPO_MAP = { 0: "Chapas", 1: "Bolsón", 2: "Reclamo", 3: "Licencia", 4: "Trámite", 5: "Otros" };
const ESTADO_MAP = { 
  0: { label: "Iniciado", color: "bg-secondary" }, 
  1: { label: "En progreso", color: "bg-primary" }, 
  2: { label: "Finalizado", color: "bg-success" } 
};

const DeletedIncidence = () => {
  const navigate = useNavigate();
  const [incidences, setIncidences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({ show: false, data: null });
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await GetDeletedIncidences();
      setIncidences(data);
    } catch (error) { 
      console.error("Error cargando incidencias eliminadas:", error); 
    }
    finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    loadData(); 
  }, []);

  const handleConfirmRestore = async (incidenceId) => {
    try {
      await RestoreIncidence(incidenceId);
      setToastMessage("¡Incidencia restaurada exitosamente!");
      setShowSuccessToast(true);
      await loadData();
      setModalConfig({ show: false, data: null });
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleOpenRestore = (inc) => {
    setModalConfig({ show: true, data: inc });
  };

  return (
    <div className="main-bg-overlay">
      <TopBar />
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          onClose={() => setShowSuccessToast(false)} 
          show={showSuccessToast} 
          delay={3000} 
          autohide
          className="border-0 shadow"
        >
          <Toast.Header closeButton className="bg-success text-white border-0">
            <i className="bi bi-check-circle me-2"></i>
            <strong className="me-auto">Éxito</strong>
          </Toast.Header>
          <Toast.Body className="bg-light">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <div className="container mt-4 pb-5">
        <div className="card shadow border-0 bg-white">
          <div className="card-body p-4 text-dark">
            <h3 className="custom-card-title mb-4">Incidencias Eliminadas</h3>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-primary text-white">
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Área</th>
                    <th>Descripción</th>
                    <th>Operador</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && incidences.length > 0 ? (
                    incidences.map((inc) => (
                      <tr key={inc.id}>
                        <td>{new Date(inc.date).toLocaleDateString()}</td>
                        <td>{TIPO_MAP[inc.incidenceType]}</td>
                        <td>
                          <span className={`badge ${ESTADO_MAP[inc.state]?.color}`}>
                            {ESTADO_MAP[inc.state]?.label}
                          </span>
                        </td>
                        <td>
                          <span className="fw-bold">
                            {inc.area?.name || `ID: ${inc.areaId}`} 
                          </span> 
                        </td>
                        <td className="text-muted small">{inc.description}</td>
                        <td>
                          {inc.operator 
                          ? `${inc.operator.name} ${inc.operator.lastName}` 
                          : `ID: ${inc.operatorId}`}
                        </td>
                        <td className="text-center">
                          <button 
                            className="btn btn-outline-success btn-sm"
                            title="Restaurar incidencia"
                            onClick={() => handleOpenRestore(inc)}
                          >
                            <i className="bi bi-arrow-counterclockwise"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">
                        {loading ? "Cargando..." : "No hay incidencias eliminadas"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end mt-3">
          <button 
            className="btn btn-outline-primary btn-lg shadow" 
            title="Volver a incidencias activas"
            onClick={() => navigate("/incidence")}
          >
            <i className="bi bi-arrow-left"></i> Volver
          </button>
        </div>
      </div>

      <Modal show={modalConfig.show} onHide={() => setModalConfig({ show: false, data: null })} centered size="sm">
        <Modal.Body className="text-center p-4">
          <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: "3rem" }}></i>
          <h5 className="mt-3 fw-bold">¿Restaurar Incidencia?</h5>
          <p className="text-muted">
            Se restaurará la incidencia con ID: <b className="text-dark">{modalConfig.data?.id}</b> <br />
            Operador responsable: <br />
            <b className="text-dark">
              {modalConfig.data?.operator 
                ? `${modalConfig.data.operator.name} ${modalConfig.data.operator.lastName}` 
                : `ID Operador: ${modalConfig.data?.operatorId}`}
            </b>
          </p>
          <div className="d-flex justify-content-center gap-2 mt-4">
            <Button variant="light" onClick={() => setModalConfig({ show: false, data: null })}>No</Button>
            <Button variant="success" onClick={() => handleConfirmRestore(modalConfig.data?.id)}>Sí, restaurar</Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DeletedIncidence;
