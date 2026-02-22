import React, { useState, useEffect } from "react";
import "./AreaDetails.css"; 
import TopBar from "../topBar/TopBar";
import ModalsArea from "./ModalsArea"; 
import { GetAreas } from "../../services/AreaService";

const AreaList = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({ show: false, mode: null, data: null });

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const data = await GetAreas(); 
      setAreas(data); 
    } catch (error) {
      console.error("Error cargando áreas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos(); 
  }, []);

  const handleOpenModal = (mode, data = null) => {
    setModalConfig({ show: true, mode: mode, data: data });
  };

  const handleCloseModal = () => {
    setModalConfig({ show: false, mode: null, data: null });
  };

  const handleConfirmAction = () => {
    cargarDatos();
    handleCloseModal();
  };

  return (
    <div className="bg-fondo">
      <TopBar />
      <div className="container mt-4">
        <div className="card shadow rounded bg-white">
          <div className="card-body">
            <h3 className="card-title mb-4 fw-bold text-dark">Gestión de Áreas</h3>
            
            <div className="table-responsive">
              <table className="table table-striped table-bordered mb-0">
                <thead className="table-primary">
                  <tr>
                    <th style={{ width: "100px" }}>ID</th>
                    <th>Nombre de la Dependencia</th>
                    <th>Descripción / Función</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" className="text-center py-4">Cargando datos...</td></tr>
                  ) : areas.length > 0 ? (
                    areas.map((area) => (
                      <tr key={area.id}>
                        <td>{area.id}</td>
                        <td className="fw-bold">{area.name}</td>
                        <td>{area.description || "Sin descripción disponible"}</td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <button 
                              className="btn btn-outline-primary btn-sm" 
                              onClick={() => handleOpenModal("edit", area)}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button 
                              className="btn btn-outline-danger btn-sm" 
                              onClick={() => handleOpenModal("delete", area)}
                            >
                              <i className="bi bi-trash3-fill"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="text-center py-4">No se encontraron áreas registradas.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button 
            className="btn btn-primary btn-lg shadow" 
            id="button-register"
            onClick={() => handleOpenModal("create")}
          >
            <i className="bi bi-plus-circle me-2"></i> Registrar Nueva Área
          </button>
        </div>
      </div>

      <ModalsArea 
        show={modalConfig.show}
        mode={modalConfig.mode}
        areaData={modalConfig.data}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default AreaList;