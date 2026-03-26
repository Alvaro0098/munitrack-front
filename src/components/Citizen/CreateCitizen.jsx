import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Importante para la navegación SPA
import { Toast, ToastContainer } from "react-bootstrap";
import { Search } from "lucide-react"; // Icono coherente con el buscador
import TopBar from "../topBar/TopBar";
import CitizenModals from "./ModalsCitizen";
import { GetCitizens, DeleteCitizen, CreateCitizen, UpdateCitizen } from "../../services/CitizenService";

const CitizenList = () => {
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({ show: false, mode: null, data: null });
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const data = await GetCitizens();
      setCitizens(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleOpenModal = (mode, data = null) => {
    setModalConfig({ show: true, mode, data });
  };

  const handleCloseModal = () => {
    setModalConfig({ show: false, mode: null, data: null });
  };

  const handleConfirmAction = async (formDataOrDni) => {
    try {
      if (modalConfig.mode === "delete") {
        await DeleteCitizen(formDataOrDni);
        setToastMessage("¡Ciudadano eliminado exitosamente!");
      } else if (modalConfig.mode === "create") {
        await CreateCitizen(formDataOrDni);
        setToastMessage("¡Ciudadano creado exitosamente!");
      } else if (modalConfig.mode === "edit") {
        await UpdateCitizen(modalConfig.data.dni, formDataOrDni);
        setToastMessage("¡Ciudadano actualizado exitosamente!");
      }
      
      setShowSuccessToast(true);
      await cargarDatos();
      handleCloseModal();
    } catch (error) {
      throw error;
    }
  };

  /**
   * Callback para errores no manejables en el formulario (DNI duplicado sí se maneja)
   * Se ejecuta si el backend retorna un error que no es DNI duplicado
   */
  const handleServerError = (error) => {
    alert("Error: " + (error?.message || "No se pudo completar la operación"));
  };

  return (
    <div className="main-bg-clean">
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
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Cargando lista de ciudadanos...</p>
          </div>
        ) : (
          <>
            {/* Cabecera con título y link de búsqueda avanzada */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="custom-card-title mb-0">Lista de Ciudadanos</h3>
              
              {/* LINK DE BÚSQUEDA AVANZADA */}
              <Link 
                to="/CitizenSearch" 
                className="nav-btn text-decoration-none d-flex align-items-center"
                style={{ color: 'var(--primary-blue)', fontSize: '0.9rem' }}
              >
                <Search size={16} className="me-1" />
                Búsqueda Avanzada por DNI
              </Link>
            </div>

            <div className="card shadow rounded bg-white">
              <div className="card-body p-0"> {/* P-0 para que la tabla llegue a los bordes si prefieres */}
                <div className="table-responsive">
                  <table className="table table-striped table-bordered mb-0">
                    <thead className="table-primary text-white">
                      <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>DNI</th>
                        <th>Email</th>
                        <th>Dirección</th>
                        <th>Celular</th>
                        <th className="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {citizens.map((c) => (
                        <tr key={c.id}>
                          <td>{c.name}</td>
                          <td>{c.lastName}</td>
                          <td>{c.dni}</td>
                          <td>{c.email}</td>
                          <td>{c.adress}</td>
                          <td>{c.phone}</td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2">
                              <button className="btn btn-outline-primary btn-sm" onClick={() => handleOpenModal("edit", c)}>
                                <i className="bi bi-pencil-square"></i>
                              </button>
                              <button className="btn btn-outline-danger btn-sm" onClick={() => handleOpenModal("delete", c)}>
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
              <button className="btn btn-action-teal" onClick={() => handleOpenModal("create")}>
                <i className="bi bi-person-plus-fill me-2"></i> Registrar Ciudadano
              </button>
            </div>
          </>
        )}
      </div>

      <CitizenModals 
        show={modalConfig.show} 
        mode={modalConfig.mode} 
        citizenData={modalConfig.data} 
        onClose={handleCloseModal} 
        onConfirm={handleConfirmAction}
        onError={handleServerError}
      />
    </div>
  );
};

export default CitizenList;