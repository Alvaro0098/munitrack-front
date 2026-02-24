import React, { useState, useEffect } from "react";
import TopBar from "../topBar/TopBar";
import OperatorModals from "./ModalsOperator"; 
// Importamos ROLES para no usar strings "hardcodeados" y evitar errores de dedo
import { ROLES } from "../../services/AuthService.jsx"; 
import { GetOperators, DeleteOperator, CreateOperator, UpdateOperator } from "../../services/OperatorService";

const OperatorList = () => {
  const [operators, setOperators] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user"));
  const currentRole = Number(userData?.rol); // Forzamos a que sea número
  
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

  const handleDirectDelete = async (dni) => {
    if (!dni) {
      alert("Error: El DNI es nulo o indefinido.");
      return;
    }
    if (!window.confirm(`¿Eliminar operador DNI: ${dni}?`)) return;

    try {
      const exito = await DeleteOperator(dni); 
      if (exito) {
        await cargarDatos(); 
      }
    } catch (error) {
      // Aquí capturamos el 403 si el usuario saltó el bloqueo visual
      alert(error.status === 403 ? "No tiene permisos para eliminar" : "Error al eliminar: " + error.message);
    }
  };

  const handleOpenCreate = () => setModalConfig({ show: true, mode: "create", data: null });
  const handleOpenEdit = (operador) => setModalConfig({ show: true, mode: "edit", data: operador });
  const handleCloseModal = () => setModalConfig({ show: false, mode: null, data: null });

  const handleConfirmAction = async (formData) => {
    try {
      if (modalConfig.mode === "create") {
        const createPayload = {
          DNI: formData.dni,
          Name: formData.nombre,
          LastName: formData.apellido,
          NLegajo: formData.nroLegajo,
          Password: formData.password,
          Phone: formData.celular,
          Email: formData.mail,
          Position: formData.cargo 
        };
        await CreateOperator(createPayload);
      } 
      else if (modalConfig.mode === "edit") {
        await UpdateOperator(modalConfig.data.dni, formData);
      }
      await cargarDatos(); 
      handleCloseModal();
    } catch (error) {
      alert(error.status === 403 ? "Acceso denegado por el servidor" : "Error: " + error.message); 
    }
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
                    <th>Cargo</th>
                    {/* Solo mostramos la columna 'Acciones' si es SysAdmin */}
                    {currentRole === ROLES.SUPER_ADMIN && <th className="text-center">Acciones</th>}
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
                        <span className="badge bg-info text-dark">{operador.position}</span>
                      </td>
                      
                      {/* FILTRO DE ACCIONES EN LA FILA */}
                      {currentRole === ROLES.SUPER_ADMIN && (
                        <td className="text-center">
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
                              onClick={() => handleDirectDelete(operador.dni)}
                              title="Eliminar"
                            >
                              <i className="bi bi-trash3-fill"></i>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}   
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FILTRO PARA EL BOTÓN DE REGISTRO */}
        {currentRole === ROLES.SUPER_ADMIN && (
          <div className="d-flex justify-content-end mt-3 mb-3">
            <button className="btn btn-success" id="styleButton" onClick={handleOpenCreate}>
              <i className="bi bi-person-plus-fill me-2"></i> Registrar Operador
            </button>
          </div>
        )}
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