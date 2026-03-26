import React, { useState, useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
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
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const cargarDatos = async () => {
    try {
      const data = await GetOperators(); 
      setOperators(data); 
    } catch (error) {
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
        setToastMessage("¡Operador eliminado exitosamente!");
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
          setToastMessage("¡Operador creado exitosamente!");
        } else if (modalConfig.mode === "edit") {
          await UpdateOperator(modalConfig.data.dni, processedData);
          setToastMessage("¡Operador actualizado exitosamente!");
        }
      }
      
      setShowSuccessToast(true);
      await cargarDatos(); 
      handleCloseModal();
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorToast(true);
    }
  };

  /**
   * Callback para errores no manejables en el formulario (DNI duplicado sí se maneja)
   * Se ejecuta si el backend retorna un error que no es DNI duplicado
   */
  const handleServerError = (error) => {
    alert("Error: " + (error?.message || "No se pudo completar la operación"));
  };

  const handleOpenCreate = () => setModalConfig({ show: true, mode: "create", data: null });
  const handleOpenEdit = (operador) => setModalConfig({ show: true, mode: "edit", data: operador });
  const handleOpenDelete = (operador) => setModalConfig({ show: true, mode: "delete", data: operador });
  const handleCloseModal = () => setModalConfig({ show: false, mode: null, data: null });

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
        <Toast 
          onClose={() => setShowErrorToast(false)} 
          show={showErrorToast} 
          delay={5000} 
          autohide
          className="border-0 shadow"
        >
          <Toast.Header closeButton className="bg-danger text-white border-0">
            <i className="bi bi-exclamation-circle me-2"></i>
            <strong className="me-auto">Error</strong>
          </Toast.Header>
          <Toast.Body className="bg-light text-danger">
            {errorMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
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
        onError={handleServerError}
      />
    </div>
  );
};

export default OperatorList;