import React, { useState, useEffect } from "react";

const ModalsArea = ({ show, mode, areaData, onClose, onConfirm }) => {
  // Estado local para manejar los inputs del formulario
  const [formData, setFormData] = useState({ titulo: "", desc: "" });

  // Sincronización: Cada vez que el modal se abre o cambia el areaData
  useEffect(() => {
    if (mode !== "add" && areaData) {
      setFormData({
        titulo: areaData.titulo || "",
        desc: areaData.desc || ""
      });
    } else {
      setFormData({ titulo: "", desc: "" });
    }
  }, [areaData, mode, show]);

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Enviamos el formData al handleSave del componente padre
    onConfirm(formData);
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            {/* Header dinámico según el modo */}
            <div className={`modal-header ${mode === 'delete' ? 'bg-danger' : 'bg-primary'} text-white`}>
              <h5 className="modal-title">
                {mode === "add" && "Nueva Área Municipal"}
                {mode === "edit" && "Modificar Área"}
                {mode === "delete" && "¡Atención!"}
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>

            <div className="modal-body p-4">
              {mode === "delete" ? (
                <div className="text-center">
                  <p className="fs-5">¿Confirmas la eliminación del área?</p>
                  <p className="fw-bold text-danger" style={{ fontSize: '1.2rem' }}>{formData.titulo}</p>
                  <p className="text-muted small">Esta acción no se puede deshacer.</p>
                </div>
              ) : (
                <form id="areaForm" onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Nombre de la Dependencia</label>
                    <input 
                      type="text" 
                      className="form-control form-control-lg"
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
              <button 
                type="submit"
                form="areaForm"
                className={`btn ${mode === 'delete' ? 'btn-danger' : 'btn-primary'} px-4`}
                onClick={mode === 'delete' ? () => onConfirm(formData) : undefined}
              >
                {mode === "delete" ? "Eliminar Definitivamente" : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalsArea;