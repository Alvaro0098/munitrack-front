import React, { useState, useEffect } from "react"; // 1. Agregado useEffect
import "../citizenDetails/CitizenStyles.css"; 
import TopBar from "../topBar/TopBar";
import IncidenceModals from "./ModalsIncidence"; 

const Incidence = () => {
  // 2. Definimos los estados correctamente
  const [incidencias, setIncidencias] = useState([]); // Empezamos vacío hasta que cargue el "back"
  const [loading, setLoading] = useState(true); // 3. Estado de carga agregado
  const [modalConfig, setModalConfig] = useState({ show: false, mode: null, data: null });

  const handleOpenModal = (mode, data = null) => {
    setModalConfig({ show: true, mode, data });
  };

  const handleCloseModal = () => {
    setModalConfig({ show: false, mode: null, data: null });
  };

  const handleConfirmAction = (data) => {
    if (modalConfig.mode === "create") {
      setIncidencias([...incidencias, { ...data, id: Date.now() }]);
    } else if (modalConfig.mode === "edit") {
      setIncidencias(incidencias.map(i => i.id === data.id ? data : i));
    } else if (modalConfig.mode === "delete") {
      setIncidencias(incidencias.filter(i => i.id !== data));
    }
    handleCloseModal();
  };

  // 4. Tu lógica de useEffect (está perfecta, solo faltaba el import y el estado)
  useEffect(() => {
    const fetchIncidencias = async () => {
      setLoading(true);
      try {
        // MOCK: Simulamos espera de red
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const dataMock = [
          { id: 1, fecha: "2026-01-19", tipo: "Reclamo", estado: "En progreso", area: "Desarrollo", operador: "Luciana", observacion: "Mock backend data." },
          { id: 2, fecha: "2026-01-20", tipo: "Bolsón", estado: "Iniciado", area: "Mesa de Trabajo", operador: "Álvaro", observacion: "Mock backend data 2." }
        ];

        setIncidencias(dataMock);
      } catch (error) {
        console.error("Error al obtener incidencias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidencias();
  }, []);

  return (
    <>
      <TopBar />
      <div className="container mt-4">
        {/* 5. Agregamos feedback visual de carga */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Cargando incidencias...</p>
          </div>
        ) : (
          <div className="card shadow rounded bg-white">
            <div className="card-body">
              <h3 className="card-title mb-3">Historial de Incidencias</h3>
              <div className="table-responsive">
                <table className="table table-striped table-bordered mb-0">
                  <thead className="table-primary text-white">
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>Estado</th>
                      <th>Área</th>
                      <th>Operador</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidencias.map((i) => (
                      <tr key={i.id}>
                        <td>{i.fecha}</td>
                        <td>{i.tipo}</td>
                        <td>
                          <span className={`badge ${i.estado === 'Finalizado' ? 'bg-success' : 'bg-warning text-dark'}`}>
                            {i.estado}
                          </span>
                        </td>
                        <td>{i.area}</td>
                        <td>{i.operador}</td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <button className="btn btn-outline-primary btn-sm" onClick={() => handleOpenModal("edit", i)}>
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleOpenModal("delete", i)}>
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
        )}
        
        {!loading && (
          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-success" id="styleButton" onClick={() => handleOpenModal("create")}>
              <i className="bi bi-plus-circle-fill me-2"></i> Nueva Incidencia
            </button>
          </div>
        )}
      </div>

      <IncidenceModals 
        show={modalConfig.show} 
        mode={modalConfig.mode} 
        incidenceData={modalConfig.data} 
        onClose={handleCloseModal} 
        onConfirm={handleConfirmAction} 
      />
    </>
  );
};

export default Incidence;