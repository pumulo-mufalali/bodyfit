import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';
import { useAuth } from '../providers/auth-provider';
export default function AuthPage({ onAuthSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const handleAuthSuccess = (userData) => {
        // Convert Firebase user data to our app's user format
        const appUser = {
            uid: userData.uid,
            name: userData.displayName || userData.email?.split('@')[0] || 'User',
            email: userData.email,
            age: 0,
            weightKg: 0,
            heightCm: 0,
            theme: "system",
            fitnessGoal: "Not yet set"
        };
        login(appUser);
        onAuthSuccess(appUser);
    };
    return (_jsxs("div", { className: "min-h-screen gradient-elegant-light dark:gradient-elegant-dark flex items-center justify-center p-6", children: [_jsxs("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [_jsx("div", { className: "absolute -top-40 -right-40 w-96 h-96 bg-blue-200/10 dark:bg-blue-900/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-60 animate-pulse" }), _jsx("div", { className: "absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-200/10 dark:bg-indigo-900/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-60 animate-pulse", style: { animationDelay: '2s' } }), _jsx("div", { className: "absolute top-40 left-1/2 w-96 h-96 bg-emerald-200/10 dark:bg-emerald-900/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-60 animate-pulse", style: { animationDelay: '4s' } })] }), _jsxs("div", { className: "relative z-10 w-full max-w-lg", children: [_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: "text-center mb-12", children: [_jsx("div", { className: "flex items-center justify-center gap-4 mb-6", children: _jsx("h1", { className: "text-5xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent", children: "FITNESS TRACKER" }) }), _jsx("p", { className: "text-lg text-gray-600 dark:text-gray-400 font-medium", children: "Your personal fitness companion" })] }), _jsx(motion.div, { initial: { opacity: 0, x: isLogin ? -20 : 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3 }, children: isLogin ? (_jsx(LoginForm, { onSuccess: handleAuthSuccess, onSwitchToSignUp: () => setIsLogin(false), isLoading: isLoading })) : (_jsx(SignUpForm, { onSuccess: handleAuthSuccess, onSwitchToLogin: () => setIsLogin(true), isLoading: isLoading })) }, isLogin ? 'login' : 'signup'), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.3 }, className: "mt-12 text-center", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-6 font-medium", children: "Track your progress, log workouts, and achieve your fitness goals" }), _jsxs("div", { className: "flex justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-lg", children: "\uD83D\uDCCA" }), _jsx("span", { children: "Analytics" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-lg", children: "\uD83C\uDFCB\uFE0F" }), _jsx("span", { children: "Workouts" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-lg", children: "\uD83D\uDCC8" }), _jsx("span", { children: "Progress" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-lg", children: "\uD83C\uDFAF" }), _jsx("span", { children: "Goals" })] })] })] })] })] }));
}
