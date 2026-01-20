import "./CitizenStyles.css";
import { useNavigate } from "react-router-dom";

const CitizenIncidents = ({ ciudadano }) => {
  const navigate = useNavigate();

  const handleAddIncidenceClick = () => {
    navigate("/incidenceDetails");
  };

  const handleEdit = (id) => {
    console.log("Editar incidencia:", id);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta incidencia?")) {
      console.log("Eliminar incidencia:", id);
    }
  };

  return (
    <> {/* Fragmento para envolver todo */}
      
      <div className="container mt-4"> 
        <div className="card shadow rounded bg-white"> 
          <div className="card-body"> 
            <h3 className="card-title mb-3">Lista de Incidencias</h3> 
            <div className="table-responsive">
              <table className="table table-striped table-bordered mb-0">
                <thead className="table-primary">
                  <tr>
                    <th>Fecha de Ingreso</th>
                    <th>Tipo de Incidencia</th>
                    <th>Estado de Incidencia</th>
                    <th>Observación</th>
                    <th>Área</th>
                    <th>Operador a cargo</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ciudadano?.incidencias?.map((incidence) => (
                    <tr key={incidence.id}>
                      <td>{incidence.fechaIngreso}</td>
                      <td>{incidence.tipo}</td>
                      <td className="text-center">
                        <span
                          className={`badge rounded-pill ${
                            incidence.estado === "Started"
                              ? "bg-warning text-dark"
                              : incidence.estado === "InProgress"
                              ? "bg-primary"
                              : "bg-success"
                          }`}
                          style={{ padding: "8px 12px" }}
                        >
                          {incidence.estado === "Started"
                            ? "Empezado"
                            : incidence.estado === "InProgress"
                            ? "En proceso"
                            : "Finalizado"}
                        </span>
                      </td>
                      <td>{incidence.observacion}</td>
                      <td>{incidence.area}</td>
                      <td>{incidence.operador}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button 
                            className="btn btn-outline-primary btn-sm" 
                            title="Editar"
                            onClick={() => handleEdit(incidence.id)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          
                          <button 
                            className="btn btn-outline-danger btn-sm" 
                            title="Eliminar"
                            onClick={() => handleDelete(incidence.id)}
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
          <button className="btn btn-success" id="styleButton" onClick={handleAddIncidenceClick}>
            <i className="bi bi-plus-circle-fill me-2"></i> Agregar Incidencia
          </button>
        </div>
      </div>
    </>
  );
};

export default CitizenIncidents;