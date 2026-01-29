import './TopBar.css'
import { useNavigate } from "react-router-dom";

import { getUserData, ROLES } from "../../services/authService.jsx";


const TopBar = () => {
  const navigate = useNavigate();
  const user = getUserData();

  console.log("Payload del Token:", user)

  const nombreCompleto = user ? `${user.given_name} ${user.family_name}` : "Invitado";
  const role = user?.role || "Sin Rol";

  const handleLogOut = () => {
    navigate("/login");
  };

  const handleGoToRegisterCitizen = () => {
    navigate("/citizens");
  };

  const handleGoToRegisterOperator = () => {
    navigate("/operators");
  };
  const handleGoToHome = () => {
    navigate("/CitizenSearch");
  };
  const handleGoToArea = () =>{
    navigate("/AreaDetails");
  };



  return (
    <nav className="navbar navbar-dark bg-dark" id="navbar">
      <div className="container d-flex justify-content-between align-items-center">

        <div className="d-flex align-items-center gap-4">
          <span className="navbar-brand mb-0 h1">MuniTrack</span>
          <button className="nav-btn" onClick={handleGoToHome}>
            Home
          </button>
          {(role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN) && (
            <button className="nav-btn" onClick={handleGoToRegisterCitizen}>
              Registrar Ciudadano
            </button>
          )}
          {role === ROLES.SUPER_ADMIN && (
            <button className="nav-btn" onClick={handleGoToRegisterOperator}>
              Registrar Operador
            </button>
          )}
          
          {(role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN) && (
            <button className="nav-btn" onClick={handleGoToArea}>Areas</button>
          )}
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="text-end me-2">
            <div className="fw-bold text-white">{nombreCompleto}</div>
            <div className="small text-white">{role}</div>
          </div>

          <i className="bi bi-person-circle fs-3 text-white"></i>
          <i
            className="bi bi-box-arrow-in-right fs-3 text-white"
            onClick={handleLogOut}
            style={{ cursor: "pointer" }}
          ></i>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
