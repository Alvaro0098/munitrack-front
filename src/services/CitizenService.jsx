//const API_URL = "https://munitrack-a3gcd3gqctffeeb0.eastus-01.azurewebsites.net";
const API_URL = "http://localhost:5216";

export const CreateCitizen = async (citizenData) => { 

    const token = localStorage.getItem("token");

    const payload = {
        DNI: Number(citizenData.DNI),      // Asegúrate que los nombres coincidan con el Modal
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
            "Authorization": `Bearer ${token}` // <--- ESTO ES LO QUE TE FALTA EN NETWORK
        },
        body: JSON.stringify(payload), 
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}: No autorizado o datos inválidos`);
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