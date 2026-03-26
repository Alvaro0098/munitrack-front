import { useState } from "react";
import { Form, InputGroup, Button, Card, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { Search, ArrowLeft, User, Mail, Phone, MapPin, IdCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopBar from "../topBar/TopBar.jsx";
import { GetCitizenByDni } from "../../services/CitizenService"; 

const CitizenSearch = () => {
  const [dni, setDni] = useState("");
  const [citizen, setCitizen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Requisito: Validación de formularios y acompañamiento al usuario [cite: 25, 30]
  const handleDniChange = (e) => {
    const value = e.target.value;
    // Bloqueo físico: No permite escribir más de 8 caracteres
    if (value.length <= 8) {
      setDni(value);
      // Limpiar resultado anterior cuando el usuario modifica el input
      setCitizen(null);
      setError(null);
    }
  };

  const handleClear = () => {
    setDni("");
    setCitizen(null);
    setError(null);
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Validación de longitud mínima (Regla de negocio) - 7-8 dígitos
    if (dni.length < 7 || dni.length > 8) {
      setError("El DNI debe tener entre 7 y 8 dígitos.");
      return;
    }

    setLoading(true);
    setError(null);
    setCitizen(null);

    try {
      const data = await GetCitizenByDni(dni);
      if (data) {
        setCitizen(data);
      } else {
        setError(`No se encontró ningún ciudadano con el DNI: ${dni}`);
      }
    } catch (err) {
      setError("Error al conectar con el servidor. Verifique su conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-bg-clean"> {/* Reutiliza tu clase de fondo global */}
      <TopBar />
      <Container className="mt-4">
        
        {/* Navegación: Requisito de SPA [cite: 31] */}
        <Button 
          variant="link" 
          className="text-decoration-none p-0 mb-3 nav-btn" 
          style={{ color: 'var(--primary-blue)', fontSize: '0.9rem' }}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} className="me-2" />
          Volver a Ciudadanos
        </Button>

        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h3 className="custom-card-title mb-4 text-center">Buscador de Ciudadanos</h3>
                
                <Form onSubmit={handleSearch}>
                  <Form.Group>
                    <InputGroup hasValidation>
                      <Form.Control
                        placeholder="Ej: 46502865"
                        type="number"
                        value={dni}
                        onChange={handleDniChange}
                        maxLength="8"
                        // Evita caracteres científicos y símbolos
                        onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                        isInvalid={dni.length > 0 && (dni.length < 7 || dni.length > 8)}
                      />
                      <Button 
                        type="submit" 
                        className="btn-action-teal" // Clase de tu archivo de estilos principal
                        disabled={loading || dni.length < 7 || dni.length > 8}
                      >
                        {loading ? <Spinner size="sm" animation="border" /> : <Search size={18} />}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline-secondary"
                        onClick={handleClear}
                        disabled={loading || (dni === "" && !citizen && !error)}
                        title="Limpiar búsqueda"
                      >
                        <i className="bi bi-x-circle"></i>
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        El DNI debe tener entre 7 y 8 dígitos.
                      </Form.Control.Feedback>
                    </InputGroup>
                    
                    {/* Feedback visual de longitud  */}
                    <div className="d-flex justify-content-end mt-1">
                      <small className={dni.length >= 7 && dni.length <= 8 ? "text-success fw-bold" : "text-muted"}>
                        {dni.length} / 8 dígitos
                      </small>
                    </div>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>

            {/* Mensajes de error con feedback claro  */}
            {error && <Alert variant="danger" className="text-center shadow-sm">{error}</Alert>}

            {/* Resultado de la Búsqueda (Solo lectura) */}
            {citizen && (
              <Card className="shadow border-0 animate__animated animate__fadeIn">
                <Card.Header className="btn-action-teal text-white text-center py-3">
                   <h5 className="mb-0">Ciudadano Encontrado</h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center">
                      <IdCard className="me-3 text-muted" size={20} />
                      <div>
                        <small className="text-muted d-block">DNI / Documento</small>
                        <strong>{citizen.dni}</strong>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <User className="me-3 text-muted" size={20} />
                      <div>
                        <small className="text-muted d-block">Nombre Completo</small>
                        <strong>{citizen.name} {citizen.lastName}</strong>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <MapPin className="me-3 text-muted" size={20} />
                      <div>
                        <small className="text-muted d-block">Dirección</small>
                        <strong>{citizen.adress}</strong>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <Phone className="me-3 text-muted" size={20} />
                      <div>
                        <small className="text-muted d-block">Teléfono</small>
                        <strong>{citizen.phone}</strong>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <Mail className="me-3 text-muted" size={20} />
                      <div>
                        <small className="text-muted d-block">Email</small>
                        <strong>{citizen.email}</strong>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CitizenSearch;