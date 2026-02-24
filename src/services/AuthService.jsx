const API_URL = "https://munitrack-a3gcd3gqctffeeb0.eastus-01.azurewebsites.net/api/Authentication";

export const ROLES = {
    SUPER_ADMIN: 2, 
    ADMIN: 1,       
    USER: 0         
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
        const decoded = getUserData(); 
        
        if (decoded) {
            // 3. Guardamos un objeto 'user' con datos que SI existen en el token
            localStorage.setItem("user", JSON.stringify({ 
                nombre: decoded.given_name || "Usuario", 
                apellido: decoded.family_name || "",
                legajo: nLegajo, // Este viene del parámetro de la función
                rol: Number(decoded.role)
            }));
        }
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
        return payload 
    } catch (e) {
        console.error("Error decodificando el token", e);
        console.error("ERROR: El token existe pero no se pudo decodificar. ¿Es un JWT válido?", e);
        return null;
    }
};