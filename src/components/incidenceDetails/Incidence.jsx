import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toast, ToastContainer } from "react-bootstrap";
import TopBar from "../topBar/TopBar";
import ModalsIncidence from "./ModalsIncidence"; 
import { GetIncidences, CreateIncidence, UpdateIncidence, DeleteIncidence } from "../../services/IncidenceService";

const TIPO_MAP = { 0: "Chapas", 1: "Bolsón", 2: "Reclamo", 3: "Licencia", 4: "Trámite", 5: "Otros" };
const ESTADO_MAP = { 
  0: { label: "Iniciado", color: "bg-secondary" }, 
  1: { label: "En progreso", color: "bg-primary" }, 
  2: { label: "Finalizado", color: "bg-success" } 
};

const IncidenceList = () => {
  const navigate = useNavigate();
  const [incidences, setIncidences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({ show: false, mode: "", data: null });
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await GetIncidences();
      setIncidences(data);
    } catch (error) { }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  // REVISIÓN: Ahora handleConfirmAction maneja también el borrado por ID
  const handleConfirmAction = async (formDataOrId) => {
    try {
      if (modalConfig.mode === "create") {
        await CreateIncidence(formDataOrId);
        setToastMessage("¡Incidencia creada exitosamente!");
      } else if (modalConfig.mode === "edit") {
        await UpdateIncidence(modalConfig.data.id, formDataOrId);
        setToastMessage("¡Incidencia actualizada exitosamente!");
      } else if (modalConfig.mode === "delete") {
        await DeleteIncidence(formDataOrId); // Aquí recibe el ID directamente
        setToastMessage("¡Incidencia eliminada exitosamente!");
      }
      
      setShowSuccessToast(true);
      await loadData();
      setModalConfig({ show: false, mode: "", data: null });
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleOpenDelete = (inc) => {
    setModalConfig({ show: true, mode: "delete", data: inc });
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
            <h3 className="custom-card-title mb-4">Registro de Incidencias</h3>
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
                  {!loading && incidences.map((inc) => (
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
                        <div className="d-flex justify-content-center gap-2">
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => setModalConfig({ show: true, mode: "edit", data: inc })}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleOpenDelete(inc)}
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button 
            className="btn btn-outline-secondary btn-lg shadow" 
            title="Ver incidencias eliminadas"
            onClick={() => navigate("/incidence/deleted")}
          >
            <i className="bi bi-trash3"></i> Papelera
          </button>
          <button 
            className="btn btn-action-orange btn-lg shadow" 
            id="button-register"
            onClick={() => setModalConfig({ show: true, mode: "create", data: null })}
          >
            Registrar Incidencia
          </button>
        </div>
      </div>
      
      <ModalsIncidence 
        show={modalConfig.show} 
        mode={modalConfig.mode} 
        incidenceData={modalConfig.data} 
        onClose={() => setModalConfig({ show: false, mode: "", data: null })} 
        onConfirm={handleConfirmAction} 
      />
    </div>
  );
};

export default IncidenceList;