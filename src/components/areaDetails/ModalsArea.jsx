import React, { useState, useEffect } from "react";

const ModalsArea = ({ show, mode, areaData, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({ titulo: "", desc: "" });

  useEffect(() => {
    if (show) {
      if (mode !== "create" && areaData) {
        // Mapeamos los datos del backend a tus variables titulo/desc
        setFormData({
          titulo: areaData.name || "",
          desc: areaData.description || ""
        });
      } else {
        setFormData({ titulo: "", desc: "" });
      }
    }
  }, [areaData, mode, show]);

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(formData);
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className={`modal-header ${mode === 'delete' ? 'bg-danger' : 'bg-primary'} text-white border-0`}>
              <h5 className="modal-title fw-bold">
                {mode === "create" && "Nueva Área Municipal"}
                {mode === "edit" && "Modificar Área"}
                {mode === "delete" && "Confirmar Eliminación"}
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>

            <div className="modal-body p-4 text-dark">
              {mode === "delete" ? (
                <div className="text-center">
                  <i className="bi bi-exclamation-triangle text-danger mb-3" style={{ fontSize: "3rem" }}></i>
                  <p className="fs-5">¿Estás seguro de eliminar esta área?</p>
                  <b className="text-dark d-block mb-1" style={{ fontSize: '1.2rem' }}>{formData.titulo}</b>
                  <small className="text-muted">ID de referencia: {areaData?.id}</small>
                  <p className="text-danger small mt-3 mt-2"><i className="bi bi-info-circle me-1"></i>Esta acción es irreversible.</p>
                </div>
              ) : (
                <form id="areaForm" onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Nombre de la Dependencia</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="Ej: Secretaría de Salud"
                      value={formData.titulo} 
                      onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Descripción / Función</label>
                    <textarea 
                      className="form-control" 
                      rows="4"
                      placeholder="Describa brevemente las tareas del área..."
                      value={formData.desc}
                      onChange={(e) => setFormData({...formData, desc: e.target.value})}
                      required
                    ></textarea>
                  </div>
                </form>
              )}
            </div>

            <div className="modal-footer border-0">
              <button className="btn btn-light px-4" onClick={onClose}>Cancelar</button>
              {mode === "delete" ? (
                <button 
                  className="btn btn-danger px-4 shadow-sm"
                  onClick={() => onConfirm(areaData.id)}
                >
                  Eliminar Definitivamente
                </button>
              ) : (
                <button 
                  type="submit"
                  form="areaForm"
                  className="btn btn-primary px-4 shadow-sm"
                >
                  Guardar Cambios
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalsArea;