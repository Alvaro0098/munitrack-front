const API_URL = "https://munitrack-a3gcd3gqctffeeb0.eastus-01.azurewebsites.net";
const OPERATOR_URL = API_URL;

export const CreateOperator = async (operatorData) => { 
    const token = localStorage.getItem("token");
    
    // 1. Traducción de cargos a los números que probaste en Swagger
    let positionId;
    switch (operatorData.Position) {
        case "Admin": positionId = 1; break;
        case "SysAdmin": positionId = 2; break;
        case "Basic": positionId = 0; break; // En Swagger usaste 0
        default: positionId = 0;
    }
    
    // 2. Creamos el objeto EXACTAMENTE como lo viste en Swagger
    // IMPORTANTE: Todo en minúsculas (dni, name, lastName, etc.)
    const payload = {
        dni: Number(operatorData.DNI),
        name: String(operatorData.Name),
        lastName: String(operatorData.LastName),
        nLegajo: Number(operatorData.NLegajo),
        password: String(operatorData.Password || "Password123!"), 
        phone: String(operatorData.Phone),
        email: String(operatorData.Email),
        position: positionId
    };

    console.log("DEBUG - Enviando igual que en Swagger:", payload);

    const response = await fetch(`${OPERATOR_URL}/api/Operator`, { 
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload), // Sin envoltorios, plano.
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
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
    
    // Mapeo de cargos idéntico al que ya tenés
    let positionId;
    switch (formData.cargo) {
        case "Admin": positionId = 1; break;
        case "SysAdmin": positionId = 2; break;
        case "Basic": positionId = 0; break; 
        default: positionId = 0;
    }
    
    const payload = {
        name: String(formData.nombre),
        lastName: String(formData.apellido),
        nLegajo: Number(formData.nroLegajo),
        password: String(formData.password || "Password123!"), 
        phone: String(formData.celular),
        email: String(formData.mail),
        position: positionId
    };

    const response = await fetch(`${OPERATOR_URL}/api/Operator/${dni}`, { 
        method: "PUT", // Verbo para actualizar
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al actualizar");
    }

    return await response.json(); 
};