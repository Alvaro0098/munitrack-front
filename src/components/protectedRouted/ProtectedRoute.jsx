import React from "react";
import { Navigate } from "react-router-dom";
import { getUserRole } from "../../services/authService.jsx"

 "lees" el valor y el warning desaparececonst ProtectedRoute = ({ children, allowedRoles }) => {
    // Aquí es donde
    const role = getUserRole(); 

    if (!role) return <Navigate to="/login" />;

    // Lógica de niveles: ¿El rol del usuario está en la lista de permitidos?
    if (!allowedRoles.includes(role)) {
        return <Navigate to="/usernotfound" />;
    }

    return children;
};
export default ProtectedRoute;
