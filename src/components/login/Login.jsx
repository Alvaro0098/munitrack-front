import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup } from "react-bootstrap";
import { loginService } from "../../services/AuthService.jsx";
import "./Login.css";

const Login = () => {
  const [nLegajo, setNLegajo] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null); // Para capturar el 401 del back
  
  const nLegajoRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    
    if (!nLegajo) {
      newErrors.nLegajo = "El N° de Legajo es obligatorio.";
    } else if (isNaN(nLegajo) || nLegajo <= 0) {
      newErrors.nLegajo = "Ingrese un número de legajo válido.";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // retorna true si el objeto newErrors es = 0
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError(null); 

    if (!validate()) return;

    try {
      const user = await loginService({ 
          nLegajo: nLegajo, 
          password: password 
      });

      console.log("Login exitoso");
      navigate("/incidence");

    } catch (error) {
      setApiError("Legajo o contraseña incorrectos. Por favor, verifique sus datos.");
    }
  };

  return (
    <div className="login template d-flex justify-content-center align-items-center vh-100 bg-violet" id="login-page">
      <div className="form_container p-5 rounded bg-white shadow">
        <h3 className="text-center">MuniTrack</h3>
        
        {/* Error del Backend (401) renderizado manualmente */}
        {apiError && (
          <div className="alert alert-danger text-center p-2 mt-2" style={{ fontSize: '0.9rem' }}>
            {apiError}
          </div>
        )}

        <Form onSubmit={handleSubmit} className="mt-3">
          <FormGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="N° de Legajo"
              value={nLegajo}
              onChange={(e) => setNLegajo(e.target.value)}
              ref={nLegajoRef}
              className={errors.nLegajo ? "border-danger" : ""} // Clase condicional manual
            />
            {/* Mensaje de error manual */}
            {errors.nLegajo && (
              <small className="text-danger ms-1">{errors.nLegajo}</small>
            )}
          </FormGroup>

          <FormGroup className="mb-3">
            <Form.Control
              type="password"
              placeholder="Ingresar Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              ref={passwordRef}
              className={errors.password ? "border-danger" : ""}
            />
            {/* Mensaje de error manual */}
            {errors.password && (
              <small className="text-danger ms-1">{errors.password}</small>
            )}
          </FormGroup>

          <div className="mb-3 d-flex align-items-center">
            <input type="checkbox" id="check" className="me-2" />
            <label htmlFor="check" className="custom-input-label mb-0">Recordarme</label>
          </div>

          <div className="d-grid">
            <button className="btn text-white" id="button-ingresar" type="submit">
              Ingresar
            </button>
          </div>
          
          <p className="text-end mt-2">
            <button type="button" className="ms-2 btn-link-style" id="link-style">
              Olvidé mi Contraseña
            </button>
          </p>
        </Form>
      </div>
    </div>
  );
}; 

export default Login;