const API_URL = "https://munitrack-a3gcd3gqctffeeb0.eastus-01.azurewebsites.net";
// const API_URL = "http://localhost:5216";

export const CreateArea = async (areaData) => { 
    const token = localStorage.getItem("token");


    const payload = {
        Name: areaData.titulo,       
        Description: areaData.desc,  
    };

    const response = await fetch(`${API_URL}/api/Area`, { 
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload), 
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}`);
    }
    return await response.json(); 
};

export const GetAreas = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Area`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }); 

    if (!response.ok) throw new Error("Error al obtener las áreas");
    return await response.json();
};

export const DeleteArea = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Area/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        // Respuesta 409 Conflict = Área tiene incidencias vinculadas
        if (response.status === 409) {
            throw new Error(errorText || "No se puede eliminar esta área porque tiene incidencias vinculadas");
        }
        throw new Error(errorText || "No se pudo eliminar el área municipal.");
    }
    return true;
};

export const UpdateArea = async (id, areaData) => {
    const token = localStorage.getItem("token");
    const payload = {
        Name: areaData.titulo,
        Description: areaData.desc,
    };
    const response = await fetch(`${API_URL}/api/Area/${id}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Error al actualizar");
    return true;
};