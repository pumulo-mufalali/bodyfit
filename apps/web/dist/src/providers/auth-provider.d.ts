import { ReactNode } from 'react';
interface User {
    uid: string;
    name: string;
    email: string;
    age: number;
    weightKg: number;
    heightCm?: number;
    theme: string;
    fitnessGoal: string;
}
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User) => void;
    logout: () => void;
}
interface AuthProviderProps {
    children: ReactNode;
}
export declare function AuthProvider({ children }: AuthProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useAuth(): AuthContextType;
export {};
