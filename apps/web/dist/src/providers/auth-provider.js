import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Check for existing auth state in localStorage
        const savedUser = localStorage.getItem('myfitness_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            }
            catch (error) {
                console.error('Failed to parse saved user:', error);
                localStorage.removeItem('myfitness_user');
            }
        }
        setIsLoading(false);
    }, []);
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('myfitness_user', JSON.stringify(userData));
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem('myfitness_user');
    };
    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout
    };
    return (_jsx(AuthContext.Provider, { value: value, children: children }));
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
