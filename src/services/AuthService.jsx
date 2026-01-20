const API_URL = "http://localhost:8080/api/auth";

// Login con destructuring: extraemos directamente username y password
export const loginService = async ({ username, password }) => { 
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), // Enviamos solo lo necesario
    });
    
    if (!response.ok) throw new Error("Credenciales inválidas");
    
    return await response.json();
};

