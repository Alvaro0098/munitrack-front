import React, { useState, useEffect } from "react"; // Agregado useEffect
import "./AreaDetails.css";
import { FaUsers, FaHandsHelping, FaHome, FaBook, FaGlobe, FaPlus, FaGavel, FaHeartbeat, FaLeaf } from "react-icons/fa";
import TopBar from "../topBar/TopBar.jsx";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AreaDetails = () => {
  // 1. Estados: Iniciamos con array vacío y loading en true
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState(""); 
  const [currentMesa, setCurrentMesa] = useState({ titulo: "", desc: "", color: "#3498db" });

  // 2. Simulación de llamada al Backend
  useEffect(() => {
    const fetchAreas = async () => {
      setLoading(true);
      try {
        // MOCK: Simulación de retraso de red
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const dataMock = [
          { id: 1, titulo: "Género", desc: "Espacio de articulación para promover la igualdad.", icono: <FaUsers />, color: "#e74c3c" },
          { id: 2, titulo: "Desarrollo Social", desc: "Mesa orientada a programas de asistencia.", icono: <FaHandsHelping />, color: "#27ae60" },
          { id: 3, titulo: "San Fernando", desc: "Aborda problemáticas barriales locales.", icono: <FaHome />, color: "#2980b9" },
          { id: 4, titulo: "Básica Centro", desc: "Actividades educativas zona céntrica.", icono: <FaBook />, color: "#8e44ad" },
          { id: 5, titulo: "Seguridad", desc: "Prevención y coordinación vecinal.", icono: <FaGavel />, color: "#2c3e50" },
          { id: 6, titulo: "Salud", desc: "Atención primaria y operativos sanitarios.", icono: <FaHeartbeat />, color: "#c0392b" },
          { id: 7, titulo: "Ambiente", desc: "Proyectos de reciclado y áreas verdes.", icono: <FaLeaf />, color: "#16a085" },
        ];

        setMesas(dataMock);
      } catch (error) {
        console.error("Error al cargar las áreas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  // 3. Handlers de Lógica (Se mantienen igual)
  const openModal = (tipo, mesa = { titulo: "", desc: "", color: "#3498db" }) => {
    setMode(tipo);
    setCurrentMesa(mesa);
    setShowModal(true);
  };

  const handleSave = () => {
    if (mode === "add") {
      const newArea = { ...currentMesa, id: Date.now(), icono: <FaGlobe /> };
      setMesas([...mesas, newArea]);
    } else if (mode === "edit") {
      setMesas(mesas.map(m => m.id === currentMesa.id ? currentMesa : m));
    } else if (mode === "delete") {
      setMesas(mesas.filter(m => m.id !== currentMesa.id));
    }
    setShowModal(false);
  };

  const settings = {
    dots: true,
    infinite: mesas.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [{ breakpoint: 1024, settings: { slidesToShow: 2 } }, { breakpoint: 768, settings: { slidesToShow: 1 } }],
  };

  return (
    <div className="area-details-page">
      <TopBar />
      
      <div id="fondo" className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4 px-3">
          <h2 className="text-white fw-bold">Gestión de Áreas</h2>
          {/* Solo mostramos el botón de agregar si ya terminó de cargar */}
          {!loading && (
            <button className="btn btn-success btn-lg shadow-sm" onClick={() => openModal("add")}>
              <FaPlus className="me-2" /> Nueva Área
            </button>
          )}
        </div>

        <div className="px-3">
          {loading ? (
            // Spinner centrado mientras carga
            <div className="text-center py-5 text-white">
              <div className="spinner-border text-light" role="status" style={{ width: '3rem', height: '3rem' }}></div>
              <p className="mt-3 fs-5">Cargando dependencias municipales...</p>
            </div>
          ) : (
            <Slider {...settings}>
              {mesas.map((mesa) => (
                <div key={mesa.id} className="p-2">
                  <div className="card h-100 shadow-sm border-0 area-card-custom">
                    <div className="card-header text-center py-4" style={{ backgroundColor: mesa.color + "20" }}>
                      <div className="icon-circle mx-auto" style={{ backgroundColor: mesa.color, color: "white" }}>
                        {mesa.icono}
                      </div>
                    </div>
                    <div className="card-body text-center">
                      <h5 className="fw-bold">{mesa.titulo}</h5>
                      <p className="text-muted small">{mesa.desc}</p>
                      <div className="d-flex justify-content-center gap-2 mt-3">
                        <button className="btn btn-outline-primary btn-sm" onClick={() => openModal("edit", mesa)}>
                           Editar
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => openModal("delete", mesa)}>
                           Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>

      {/* MODAL UNIFICADO */}
      {showModal && (
        <div className="modal-backdrop fade show"></div>
      )}
      <div className={`modal fade ${showModal ? "show d-block" : ""}`} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className={`modal-header ${mode === 'delete' ? 'bg-danger' : 'bg-primary'} text-white`}>
              <h5 className="modal-title">
                {mode === "add" && "Agregar Nueva Área"}
                {mode === "edit" && "Editar Área"}
                {mode === "delete" && "Confirmar Eliminación"}
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              {mode === "delete" ? (
                <p>¿Estás seguro que deseas eliminar el área <strong>{currentMesa.titulo}</strong>?</p>
              ) : (
                <form>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Nombre del Área</label>
                    <input 
                      type="text" className="form-control" 
                      value={currentMesa.titulo} 
                      onChange={(e) => setCurrentMesa({...currentMesa, titulo: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Descripción</label>
                    <textarea 
                      className="form-control" 
                      rows="3"
                      value={currentMesa.desc}
                      onChange={(e) => setCurrentMesa({...currentMesa, desc: e.target.value})}
                    ></textarea>
                  </div>
                </form>
              )}
            </div>
            <div className="modal-footer border-0">
              <button className="btn btn-light" onClick={() => setShowModal(false)}>Cancelar</button>
              <button 
                className={`btn ${mode === 'delete' ? 'btn-danger' : 'btn-primary'} px-4`} 
                onClick={handleSave}
              >
                {mode === "delete" ? "Eliminar" : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaDetails;