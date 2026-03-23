import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Importante para la navegación SPA
import { Search } from "lucide-react"; // Icono coherente con el buscador
import TopBar from "../topBar/TopBar";
import CitizenModals from "./ModalsCitizen";
import { GetCitizens, DeleteCitizen } from "../../services/CitizenService";

const CitizenList = () => {
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({ show: false, mode: null, data: null });

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const data = await GetCitizens();
      setCitizens(data);
    } catch (error) {
      console.error("Error cargando ciudadanos:", error);
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

  const handleConfirmAction = async (dni) => {
    try {
      if (modalConfig.mode === "delete") {
        await DeleteCitizen(dni);
      }
      handleCloseModal();
      cargarDatos();
    } catch (error) {
      alert("Error en la operación: " + error.message);
    }
  };

  return (
    <div className="main-bg-clean">
      <TopBar />
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
      />
    </div>
  );
};

export default CitizenList;