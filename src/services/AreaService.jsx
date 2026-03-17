//const API_URL = "https://munitrack-a3gcd3gqctffeeb0.eastus-01.azurewebsites.net";
const API_URL = "http://localhost:5216";

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