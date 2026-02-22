const API_URL = "http://localhost:5216";

export const GetIncidences = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Incidence`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error("Error al obtener incidencias");
    return await response.json();
};

export const CreateIncidence = async (formData) => {
    const token = localStorage.getItem("token");

    // MAPEAMOS HACIA EL DTO DE C#
    const payload = {
        Date: new Date(formData.fecha).toISOString(),
        IncidenceType: parseInt(formData.tipo), 
        Description: formData.observacion, // 'observacion' del front -> 'Description' del back
        State: parseInt(formData.estado),
        OperatorId: parseInt(formData.operador),
        AreaId: parseInt(formData.area)
    };

    console.log(payload)

    const response = await fetch(`${API_URL}/api/Incidence`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al crear incidencia");
    }
    return await response.json();
};

export const UpdateIncidence = async (id, formData) => {
    const token = localStorage.getItem("token");
    const payload = {
        Description: formData.observacion, // 'observacion' del front -> 'Description' del DTO
        State: parseInt(formData.estado)    // 'estado' del front -> 'State' del DTO
    };

    const response = await fetch(`${API_URL}/api/Incidence/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("Error al actualizar");
    return await response.json();
};

export const DeleteIncidence = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Incidence/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Error al eliminar");
    return true; 
};