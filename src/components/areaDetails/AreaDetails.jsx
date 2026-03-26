import React, { useState, useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import TopBar from "../topBar/TopBar";
import { useAuth } from "../../hooks/useAuth";
import ModalsArea from "./ModalsArea"; 
import { GetAreas, DeleteArea, CreateArea, UpdateArea } from "../../services/AreaService";

const AreaList = () => {
  const [areas, setAreas] = useState([]);
  const { isSuperAdmin, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({ show: false, mode: null, data: null });
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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

  // REVISIÓN: Implementación asíncrona para soportar Delete por ID
  const handleConfirmAction = async (formData) => {
    try {
      if (modalConfig.mode === "delete") {
        await DeleteArea(modalConfig.data.id);
        setToastMessage("¡Área eliminada exitosamente!");
      } else if (modalConfig.mode === "create") {
        await CreateArea(formData);
        setToastMessage("¡Área creada exitosamente!");
      } else if (modalConfig.mode === "edit") {
        await UpdateArea(modalConfig.data.id, formData);
        setToastMessage("¡Área actualizada exitosamente!");
      }
      
      setShowSuccessToast(true);
      await cargarDatos();
      handleCloseModal();
    } catch (error) {
      alert("Error: " + error.message);
    }
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
      <div className="container mt-4">
        <div className="card shadow rounded bg-white">
          <div className="card-body">
            <h3 className="custom-card-title mb-4 fw-bold text-dark">Gestión de Áreas</h3>
            <div className="table-responsive">
              <table className="table table-striped table-bordered mb-0">
                <thead className="table-primary">
                  <tr>
                    <th style={{ width: "100px" }}>ID</th>
                    <th>Nombre de la Dependencia</th>
                    <th>Descripción / Función</th>
                    {(isSuperAdmin || isAdmin) && <th className="text-center">Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={(isSuperAdmin || isAdmin) ? 4 : 3} className="text-center py-4">
                        Cargando datos...
                      </td>
                    </tr>
                  ) : areas.length > 0 ? (
                    areas.map((area) => (
                      <tr key={area.id}>
                        <td>{area.id}</td>
                        <td className="fw-bold">{area.name}</td>
                        <td>{area.description || "Sin descripción disponible"}</td>
                        {(isSuperAdmin || isAdmin) && (
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2">
                              <button 
                                className="btn btn-outline-primary btn-sm" 
                                onClick={() => handleOpenModal("edit", area)}
                                title="Editar"
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                              <button 
                                className="btn btn-outline-danger btn-sm" 
                                onClick={() => handleOpenModal("delete", area)}
                                title="Eliminar"
                              >
                                <i className="bi bi-trash3-fill"></i>
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={(isSuperAdmin || isAdmin) ? 4 : 3} className="text-center py-4">
                        No se encontraron áreas registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {(isSuperAdmin || isAdmin) && (
          <div className="d-flex justify-content-end mt-4">
            <button 
              className="btn btn-action-blue btn-lg shadow" 
              onClick={() => handleOpenModal("create")}
            >
              <i className="bi bi-plus-circle me-2"></i> Registrar Nueva Área
            </button>
          </div>
        )}
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