//const API_URL = "https://munitrack-a3gcd3gqctffeeb0.eastus-01.azurewebsites.net";
const API_URL = "http://localhost:5216";

export const CreateCitizen = async (citizenData) => { 

    const token = localStorage.getItem("token");

    const payload = {
        DNI: Number(citizenData.DNI),
        Name: citizenData.Name,
        LastName: citizenData.LastName,
        Email: citizenData.Email,
        Adress: citizenData.Adress,
        Phone: citizenData.Phone
    };

    const response = await fetch(`${API_URL}/api/Citizen`, { 
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

export const GetCitizens = async () => {
    
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/api/Citizen`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }); 

  
    if (!response.ok) {
        throw new Error("Error al obtener los ciudadanos");
    }


    return await response.json();
}; 

export const DeleteCitizen = async (dni) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Citizen/${dni}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Error al eliminar el ciudadano");
    }
    return true; 
};

export const GetCitizenByDni = async (dni) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Citizen/${dni}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (response.status === 404) return null; // Ciudadano no encontrado
    if (!response.ok) throw new Error("Error en la búsqueda");
    
    return await response.json();
};

export const UpdateCitizen = async (dni, citizenData) => {
    const token = localStorage.getItem("token");

    const payload = {
        DNI: Number(citizenData.DNI),
        Name: citizenData.Name,
        LastName: citizenData.LastName,
        Email: citizenData.Email,
        Adress: citizenData.Adress,
        Phone: citizenData.Phone
    };

    const response = await fetch(`${API_URL}/api/Citizen/${dni}`, {
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
            errorMessage = await responseClone.text();
        }
        throw new Error(errorMessage);
    }

    return await response.json();
};