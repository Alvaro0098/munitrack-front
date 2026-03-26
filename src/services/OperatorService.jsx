const API_URL = "https://munitrack-a3gcd3gqctffeeb0.eastus-01.azurewebsites.net";
// const API_URL = "http://localhost:5216";
const OPERATOR_URL = API_URL;

export const CreateOperator = async (operatorData) => { 
    const token = localStorage.getItem("token");
    
    // Mapeo de numbers a enum names
    const positionMap = {
        "0": "OperatorBasic",
        "1": "Admin",
        "2": "SysAdmin"
    };
    
    const payload = {
        dni: Number(operatorData.DNI),
        name: String(operatorData.Name),
        lastName: String(operatorData.LastName),
        nLegajo: Number(operatorData.NLegajo),
        password: String(operatorData.Password || "Password123!"), 
        phone: String(operatorData.Phone),
        email: String(operatorData.Email),
        position: positionMap[String(operatorData.position)] || "OperatorBasic"
    };

    const response = await fetch(`${OPERATOR_URL}/api/Operator`, { 
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        // Clonar la respuesta antes de leerla para evitar "body stream already read"
        const responseClone = response.clone();
        
        let errorMessage;
        try {
            // Intentar parsear como JSON desde la respuesta original
            const jsonError = await response.json();
            errorMessage = jsonError.message || jsonError.detail || JSON.stringify(jsonError);
        } catch {
            // Si falla el parseo JSON, leer como texto desde el clone
            errorMessage = await responseClone.text();
        }
        
        throw new Error(errorMessage);
    }
    
    return await response.json(); 
};

export const GetOperators = async () => {
    
    const token = localStorage.getItem("token");

    const response = await fetch(`${OPERATOR_URL}/api/Operator`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }); 

  
    if (!response.ok) {
        throw new Error("Error al obtener los operadores");
    }


    return await response.json();
}; 

export const DeleteOperator = async (dni) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${OPERATOR_URL}/api/Operator/${dni}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al eliminar el operador");
    }

    // Retornamos la respuesta para confirmar que terminó
    return response; 
};

// Al final de OperatorService.js
export const UpdateOperator = async (dni, formData) => {
    const token = localStorage.getItem("token");
    
    // Mapeo de numbers a enum names
    const positionMap = {
        "0": "OperatorBasic",
        "1": "Admin",
        "2": "SysAdmin"
    };
    
    const payload = {
        name: String(formData.Name),
        lastName: String(formData.LastName),
        email: String(formData.Email),
        // Solo incluir password si se proporciona (no vacío)
        ...(formData.Password && formData.Password.trim().length > 0 && { password: String(formData.Password) }),
        // Phone es opcional
        ...(formData.Phone && formData.Phone.trim().length > 0 && { phone: String(formData.Phone) }),
        position: positionMap[String(formData.position)] || "OperatorBasic"
    };

    const response = await fetch(`${OPERATOR_URL}/api/Operator/${dni}`, { 
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        // Clonar la respuesta antes de leerla para evitar "body stream already read"
        const responseClone = response.clone();
        
        let errorMessage;
        try {
            // Intentar parsear como JSON desde la respuesta original
            const jsonError = await response.json();
            errorMessage = jsonError.message || jsonError.detail || JSON.stringify(jsonError);
        } catch {
            // Si falla el parseo JSON, leer como texto desde el clone
            errorMessage = await responseClone.text() || "Error al actualizar";
        }
        
        throw new Error(errorMessage);
    }
    
    return response.status === 204 ? { success: true } : await response.json(); 
};