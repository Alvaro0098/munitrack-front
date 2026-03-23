import React, { useState, useEffect } from "react";
import TopBar from "../topBar/TopBar";
import { useAuth } from "../../hooks/useAuth";
import OperatorModals from "./ModalsOperator"; 
import { GetOperators, DeleteOperator, CreateOperator, UpdateOperator } from "../../services/OperatorService";

const OperatorList = () => {
  const [operators, setOperators] = useState([]);
  const { isSuperAdmin } = useAuth();
  const [modalConfig, setModalConfig] = useState({
    show: false,
    mode: null, 
    data: null  
  });

  const cargarDatos = async () => {
    try {
      const data = await GetOperators(); 
      setOperators(data); 
    } catch (error) {
      console.error("Error cargando operadores:", error);
    }
  };

  useEffect(() => {
    cargarDatos(); 
  }, []);

  const handleConfirmAction = async (formDataOrDni) => {
    try {
      if (modalConfig.mode === "delete") {
        // En modo delete, formDataOrDni es el DNI
        await DeleteOperator(formDataOrDni);
      } else {
        // Lógica de Create/Update original intacta
        const processedData = {
          ...formDataOrDni,
          dni: Number(formDataOrDni.DNI),
          nLegajo: Number(formDataOrDni.NLegajo),
          position: Number(formDataOrDni.position)
        };

        if (modalConfig.mode === "create") {
          await CreateOperator(processedData);
        } else if (modalConfig.mode === "edit") {
          await UpdateOperator(modalConfig.data.dni, processedData);
        }
      }
      
      await cargarDatos(); 
      handleCloseModal();
    } catch (error) { 
      alert(error.status === 403 
        ? "Acceso Denegado: Permisos insuficientes." 
        : "Error: " + error.message); 
    }
  };

  const handleOpenCreate = () => setModalConfig({ show: true, mode: "create", data: null });
  const handleOpenEdit = (operador) => setModalConfig({ show: true, mode: "edit", data: operador });
  const handleOpenDelete = (operador) => setModalConfig({ show: true, mode: "delete", data: operador });
  const handleCloseModal = () => setModalConfig({ show: false, mode: null, data: null });

  return (
    <div className="main-bg-overlay">
      <TopBar />
      <div className="container mt-4">
        <div className="card shadow rounded bg-white">
          <div className="card-body">
            <h3 className="custom-card-title mb-3">Lista de Operadores</h3>
            <div className="table-responsive">
              <table className="table table-striped table-bordered mb-0">
                <thead className="table-primary">
                  <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>DNI</th>
                    <th>N° de Legajo</th>
                    <th>Mail</th>
                    <th>Cargo</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {operators?.map((operador) => (
                    <tr key={operador.dni}> 
                      <td>{operador.name}</td>
                      <td>{operador.lastName}</td>
                      <td>{operador.dni}</td>
                      <td>{operador.nLegajo}</td>
                      <td>{operador.email}</td>
                      <td>
                        <span className="badge bg-info text-dark">
                          {operador.position === "SysAdmin" ? "SysAdmin" : 
                           operador.position === "Admin" ? "Admin" : "Básico"}
                        </span>
                      </td>
                      <td className="text-center">
                        {isSuperAdmin && (
                          <div className="d-flex justify-content-center gap-2">                          
                            <button 
                              className="btn btn-outline-primary btn-sm" 
                              onClick={() => handleOpenEdit(operador)}
                              title="Editar"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button 
                              className="btn btn-outline-danger btn-sm" 
                              onClick={() => handleOpenDelete(operador)}
                              title="Eliminar"
                            >
                              <i className="bi bi-trash3-fill"></i>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}   
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end mt-3 mb-3">
           {isSuperAdmin && (
            <button className="btn btn-action-teal btn-lg shadow" onClick={handleOpenCreate}>
              <i className="bi bi-person-plus-fill me-2"></i> Registrar Operador
            </button>
           )}
        </div>
      </div>

      <OperatorModals 
        show={modalConfig.show}
        mode={modalConfig.mode}
        operatorData={modalConfig.data}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction} 
      />
    </div>
  );
};

export default OperatorList;