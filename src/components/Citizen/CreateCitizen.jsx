import React, { useState, useEffect } from "react"; // Agregado useEffect
import "./CitizenStyles.css";
import TopBar from "../topBar/TopBar";
import CitizenModals from "./ModalsCitizen";
import {GetCitizens} from "../../services/CitizenService"

const CitizenList = () => {

  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({ show: false, mode: null, data: null });

const cargarDatos = async () => {
    setLoading(true); // Iniciamos carga
    try {
      const data = await GetCitizens(); 
      setCitizens(data); 
    } catch (error) {
      console.error("Error cargando ciudadanos:", error);
    } finally {
      setLoading(false); // 1. IMPORTANTE: Apagamos el spinner siempre
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

  const handleConfirmAction = (data) => {
    // Lógica ABM local (lista para ser reemplazada por fetch POST/PUT/DELETE)
    if (modalConfig.mode === "create") {
      setCiudadanos([...ciudadanos, { ...data, id: Date.now() }]);
    } else if (modalConfig.mode === "edit") {
      setCiudadanos(ciudadanos.map(c => c.id === data.id ? data : c));
    } else if (modalConfig.mode === "delete") {
      setCiudadanos(ciudadanos.filter(c => c.id !== data));
    }
    handleCloseModal();
    cargarDatos();
  };

  return (
    <>
      <TopBar />
      <div className="container mt-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Cargando lista de ciudadanos...</p>
          </div>
        ) : (
          <>
            <div className="card shadow rounded bg-white">
              <div className="card-body">
                <h3 className="card-title mb-3">Lista de Ciudadanos</h3>
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
              <button className="btn btn-success" id="styleButton" onClick={() => handleOpenModal("create")}>
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
      />
    </>
  );
};

export default CitizenList;