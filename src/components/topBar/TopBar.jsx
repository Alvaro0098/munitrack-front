import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const TopBar = () => {
  const navigate = useNavigate();
  const { user, isOperatorBasic, isAdmin, isSuperAdmin } = useAuth(); // Extraemos los booleanos del contexto

  // Mapeo para mostrar el nombre del rol en la UI
  const getRoleName = () => {
    if (isSuperAdmin) return "SysAdmin";
    if (isAdmin) return "Administrador";
    if (isOperatorBasic) return "Básico";
    return "Operador";
  };

  const nombreCompleto = user?.name || "Invitado";
  const roleDisplay = user ? getRoleName() : "Sin Rol";

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; // Force reload para limpiar estados
  };

  return (
    <nav className="navbar navbar-dark custom-navbar shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">

        <div className="d-flex align-items-center gap-4">
          <span className="navbar-brand mb-0 h1">MuniTrack</span>
          
          <button className="nav-btn" onClick={() => navigate("/incidence")}>
            Incidencias
          </button>
          
          <button className="nav-btn" onClick={() => navigate("/citizens")}>
            Ciudadanos
          </button>
        
            <button className="nav-btn" onClick={() => navigate("/operators")}>
              Operador
            </button>
        
          
          <button className="nav-btn" onClick={() => navigate("/AreaDetails")}>
            Áreas
          </button>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="text-end me-2">
            <div className="fw-bold text-white">{nombreCompleto}</div>
            <div className="small text-white-50">{roleDisplay}</div>
          </div>

          <i className="bi bi-person-circle fs-3 text-white"></i>
          <i
            className="bi bi-box-arrow-right fs-3 text-white" 
            onClick={handleLogOut}
            style={{ cursor: "pointer" }}
            title="Cerrar Sesión"
          ></i>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;