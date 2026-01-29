import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup } from "react-bootstrap";
import { loginService } from "../../services/authService.jsx";
import "./Login.css";

const Login = () => {
  const [nLegajo, setNLegajo] = useState();
  const [password, setPassword] = useState("");
  
  const nLegajoRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const handleChangeNlegajo = (event) => setNLegajo(event.target.value);
  const handleChangePassword = (event) => setPassword(event.target.value);

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert("Funcionalidad no implementada aún.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nLegajo) {
      alert("Debe ingresar su N° de Legajo.");
      nLegajoRef.current?.focus();
      return;
    }

    if (!password) {
      alert("Debe ingresar un password.");
      passwordRef.current?.focus();
      return;
    }

    try {
      // Llamamos al servicio que se conecta con el backend (Puerto 5216)
      const user = await loginService({ 
          nLegajo: nLegajo, 
          password: password 
      });

      // El backend devuelve el token con el claim "role"
      console.log("Login exitoso. Rol detectado:", user.role);
      
 
      navigate("/citizens");

    } catch (error) {
      alert("Error al iniciar sesión: " + error.message);
    }
  }; // AQUÍ SE CIERRA EL SUBMIT

  return (
    <div className="login template d-flex justify-content-center align-items-center vh-100 bg-violet" id="login-page">
      <div className="form_container p-5 rounded bg-white">
        <h3 className="text-center">MuniTrack</h3>
        <Form onSubmit={handleSubmit}>
          <FormGroup className="mb-2">
            <Form.Control
              type="text"
              placeholder="N° de Legajo"
              value={nLegajo}
              onChange={handleChangeNlegajo}
              ref={nLegajoRef}
            />
          </FormGroup>
          <FormGroup className="mb-2">
            <Form.Control
              type="password"
              placeholder="Ingresar Contraseña"
              value={password}
              onChange={handleChangePassword}
              ref={passwordRef}
            />
          </FormGroup>
          <div className="mb-2">
            <input type="checkbox" className="custom-control custom-checkbox" id="check" />
            <label htmlFor="check" className="custom-input-label ms-2">Recordarme</label>
          </div>
          <div className="d-grid">
            <button className="btn text-white" id="button-ingresar" type="submit">
              Ingresar
            </button>
          </div>
          <p className="text-end mt-2">
            <button type="button" className="ms-2" id="link-style" onClick={handleForgotPassword}>
              Olvidé mi Contraseña
            </button>
          </p>
        </Form>
      </div>
    </div>
  );
}; 

export default Login;