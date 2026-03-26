const API_URL = "https://munitrack-a3gcd3gqctffeeb0.eastus-01.azurewebsites.net/api/Authentication";
// const API_URL = "http://localhost:5216/api/Authentication";

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
            // Usamos el rol que ya procesó getUserData (0, 1 o 2)
            const userObj = { 
                name: decoded.given_name || "Usuario", 
                role: decoded.role 
            };

            // Mantenemos tu guardado actual intacto
            localStorage.setItem("user", JSON.stringify({ 
                nombre: userObj.name, 
                apellido: decoded.family_name || "",
                legajo: nLegajo,
                rol: userObj.role
            }));

            // DEVOLVEMOS EL OBJETO para que el componente actualice el Contexto
            return userObj; 
        }
    }
    
    return null; 
};

export const getUserData = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));

        const rawRole = payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        let positionId;
        switch (rawRole) {
            case "Admin": positionId = 1; break;
            case "SysAdmin": positionId = 2; break;
            case "Basic": positionId = 0; break; 
            default: 
                // Aquí el Number() asegura que si viene "0" sea 0
                positionId = !isNaN(rawRole) ? Number(rawRole) : 0;
        }
        
        return {
            ...payload,
            role: positionId
        };
    } catch (e) {
        return null;
    }
};