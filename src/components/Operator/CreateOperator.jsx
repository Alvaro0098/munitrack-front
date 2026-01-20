import React, { useState } from "react";
import "../citizenDetails/CitizenStyles.css"; 
import TopBar from "../topBar/TopBar";
import OperatorModals from "./ModalsOperator"; 

// 1. Definimos el objeto hardcodeado fuera del componente
const operadoresHardcoded = [
  {
    id: 1,
    nombre: "Carlos",
    apellido: "García",
    dni: "12.345.678",
    nroLegajo: "OP-4402",
    mail: "carlos.garcia@muni.gob.ar",
    celular: "3415889900",
    cargo: "Operador"
  }
];

// 2. Asignamos el valor por defecto en la entrada del componente
const OperatorList = ({ operadores = operadoresHardcoded }) => {
  const [modalConfig, setModalConfig] = useState({
    show: false,
    mode: null, 
    data: null  
  });

  const handleOpenCreate = () => {
    setModalConfig({ show: true, mode: "create", data: null });
  };

  const handleOpenEdit = (operador) => {
    setModalConfig({ show: true, mode: "edit", data: operador });
  };

  const handleOpenDelete = (operador) => {
    setModalConfig({ show: true, mode: "delete", data: operador });
  };

  const handleCloseModal = () => {
    setModalConfig({ show: false, mode: null, data: null });
  };

  const handleConfirmAction = (formDataOrId) => {
    if (modalConfig.mode === "create") {
      console.log("Insertando en DB:", formDataOrId);
    } else if (modalConfig.mode === "edit") {
      console.log("Actualizando en DB ID:", modalConfig.data.id, "con datos:", formDataOrId);
    } else if (modalConfig.mode === "delete") {
      console.log("Eliminando de DB ID:", formDataOrId);
    }
    handleCloseModal();
  };

  return (
    <>
      <TopBar />
      <div className="container mt-4">
        <div className="card shadow rounded bg-white">
          <div className="card-body">
            <h3 className="card-title mb-3">Lista de Operadores</h3>
            
            <div className="table-responsive">
              <table className="table table-striped table-bordered mb-0">
                <thead className="table-primary">
                  <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>DNI</th>
                    <th>N° de Legajo</th>
                    <th>Mail</th>
                    <th>Celular</th>
                    <th>Cargo</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Ahora 'operadores' siempre tendrá al menos el valor de Carlos */}
                  {operadores?.map((operador) => (
                    <tr key={operador.id}>
                      <td>{operador.nombre}</td>
                      <td>{operador.apellido}</td>
                      <td>{operador.dni}</td>
                      <td>{operador.nroLegajo}</td>
                      <td>{operador.mail}</td>
                      <td>{operador.celular}</td>
                      <td>
                        <span className="badge bg-info text-dark">
                          {operador.cargo}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button 
                            className="btn btn-outline-primary btn-sm" 
                            onClick={() => handleOpenEdit(operador)}
                            title="Editar Operador"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          
                          <button 
                            className="btn btn-outline-danger btn-sm" 
                            onClick={() => handleOpenDelete(operador)}
                            title="Eliminar Operador"
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

        <div className="d-flex justify-content-end mt-3 mb-3">
          <button 
            className="btn btn-success" 
            id="styleButton" 
            onClick={handleOpenCreate}
          >
            <i className="bi bi-person-plus-fill me-2"></i> Registrar Operador
          </button>
        </div>
      </div>

      <OperatorModals 
        show={modalConfig.show}
        mode={modalConfig.mode}
        operatorData={modalConfig.data}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction}
      />
    </>
  );
};

export default OperatorList;