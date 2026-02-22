import React, { useState, useEffect } from "react";
import TopBar from "../topBar/TopBar";
// IMPORTANTE: El nombre debe ser igual al archivo físico ModalsIncidence.jsx
import ModalsIncidence from "./ModalsIncidence"; 
import { GetIncidences, CreateIncidence, UpdateIncidence, DeleteIncidence } from "../../services/IncidenceService";

const TIPO_MAP = { 0: "Chapas", 1: "Bolsón", 2: "Reclamo", 3: "Licencia", 4: "Trámite", 5: "Otros" };
const ESTADO_MAP = { 
  0: { label: "Iniciado", color: "bg-secondary" }, 
  1: { label: "En progreso", color: "bg-primary" }, 
  2: { label: "Finalizado", color: "bg-success" } 
};

const IncidenceList = () => {
  const [incidences, setIncidences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({ show: false, mode: "", data: null });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await GetIncidences();
      setIncidences(data);
    } catch (error) { console.error("Error cargando:", error); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

const handleDirectDelete = async (id) => {
  if (!window.confirm(`¿Eliminar incidencia ID: ${id}?`)) return;
  try {
    await DeleteIncidence(id);
    await loadData();
  } catch (error) {
    alert(error.message);
  }
};

const handleConfirmAction = async (formData) => {
  try {
    if (modalConfig.mode === "create") {
      await CreateIncidence(formData);
    } else if (modalConfig.mode === "edit") {
      await UpdateIncidence(modalConfig.data.id, formData);
    }
    await loadData();
    setModalConfig({ show: false, mode: "", data: null });
  } catch (error) {
    alert("Error: " + error.message);
  }
};

  return (
    <div className="bg-fondo">
      <TopBar />
      <div className="container mt-4 pb-5">
        <div className="card shadow border-0 bg-white">
          <div className="card-body p-4 text-dark">
            <h3 className="fw-bold mb-4">Registro de Incidencias</h3>
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
                      <td><td className="fw-bold">
                      {inc.area?.name || `ID: ${inc.areaId}`} 
                      </td> 
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
                            onClick={() => handleDirectDelete(inc.id)}
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
        <div className="d-flex justify-content-end mt-3">
          <button 
            className="btn btn-primary btn-lg shadow" 
            id="button-register"
            onClick={() => setModalConfig({ show: true, mode: "create", data: null })}
          >
            Registrar Incidencia
          </button>
        </div>
      </div>
      
      {/* Usamos el nombre correcto del componente aquí abajo */}
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