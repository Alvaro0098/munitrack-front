const API_URL = "http://localhost:5216/api/Authentication";

// 1. Definimos los 3 roles de la consigna para usarlos en toda la app
export const ROLES = {
    SUPER_ADMIN: "SysAdmin",
    ADMIN: "Admin",
    USER: "OperatorBasic" // o "UsuarioComun", según tu back
};

export const loginService = async ({ nLegajo, password }) => { 
    const response = await fetch(`${API_URL}/authenticate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ NLegajo: Number(nLegajo), Password: password }),
    });
    
    if (!response.ok) throw new Error("Credenciales inválidas");

    const data = await response.text(); 
    
    if (data) {
        
        localStorage.setItem("token", data);
        localStorage.setItem("user", JSON.stringify({ 
            nombre: data.nombre, 
            legajo: nLegajo 
        }));
    }
    
    return data; 
};

export const getUserData = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        // Decodificamos el payload del JWT
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        console.log("DEBUG - Datos decodificados correctamente:", payload);
        return payload 
    } catch (e) {
        console.error("Error decodificando el token", e);
        console.error("ERROR: El token existe pero no se pudo decodificar. ¿Es un JWT válido?", e);
        return null;
    }
};