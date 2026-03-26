import { createContext, useState, useEffect, useMemo } from "react";
import { getUserData } from "../services/AuthService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const data = getUserData(); 
        if (data) {
            const rawRole = data.role ?? data["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            setUser({{
                role: rawRole, 
                name: data.given_name
            });
            
        }
        setLoading(false);
    }, []);

    const value = useMemo(() => ({
        user,
        setUser,
        isAuthenticated: !!user,
        isOperatorBasic: user?.role === 0,
        isAdmin: user?.role === 1,
        isSuperAdmin: user?.role === 2
    }), [user]);

    if (loading) return null; 

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};