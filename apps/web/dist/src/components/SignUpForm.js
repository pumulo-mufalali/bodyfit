import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
export default function SignUpForm({ onSuccess, onSwitchToLogin, isLoading: externalLoading = false }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.email) {
            newErrors.email = 'Email is required';
        }
        else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        }
        else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const getErrorMessage = (errorCode) => {
        switch (errorCode) {
            case 'auth/email-already-in-use':
                return 'An account with this email already exists';
            case 'auth/invalid-email':
                return 'Invalid email address';
            case 'auth/weak-password':
                return 'Password is too weak. Please choose a stronger password';
            case 'auth/operation-not-allowed':
                return 'Email/password accounts are not enabled';
            case 'auth/network-request-failed':
                return 'Network error. Please check your connection';
            default:
                return 'Failed to create account. Please try again';
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Clear previous errors
        setErrors({});
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;
            // Update the user's display name
            await updateProfile(user, {
                displayName: formData.name
            });
            // Create user object for the parent component
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: formData.name,
                emailVerified: user.emailVerified
            };
            // Call success callback if provided
            if (onSuccess) {
                onSuccess(userData);
            }
        }
        catch (error) {
            console.error('Signup error:', error);
            setErrors({
                general: getErrorMessage(error.code)
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleInputChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        // Clear error when user starts typing
        if (errors[field] || errors.general) {
            setErrors(prev => ({ ...prev, [field]: undefined, general: undefined }));
        }
    };
    const isFormLoading = isLoading || externalLoading;
    return (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "w-full max-w-lg mx-auto", children: _jsxs("div", { className: "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-gray-200/50 dark:border-gray-700/50", children: [_jsxs("div", { className: "text-center mb-10", children: [_jsx("h1", { className: "text-4xl font-black text-gray-900 dark:text-white mb-3", children: "Create Account" }), _jsx("p", { className: "text-lg text-gray-600 dark:text-gray-400 font-medium", children: "Start your fitness journey today" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-8", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "name", className: "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3", children: "Full Name" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(User, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { id: "name", type: "text", value: formData.name, onChange: handleInputChange('name'), className: `block w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 font-medium ${errors.name
                                                ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-600'
                                                : 'border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-500'}`, placeholder: "Enter your full name" })] }), errors.name && (_jsx("p", { className: "mt-2 text-sm text-red-600 dark:text-red-400 font-medium", children: errors.name }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3", children: "Email Address" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(Mail, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { id: "email", type: "email", value: formData.email, onChange: handleInputChange('email'), className: `block w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 font-medium ${errors.email
                                                ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-600'
                                                : 'border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-500'}`, placeholder: "Enter your email" })] }), errors.email && (_jsx("p", { className: "mt-2 text-sm text-red-600 dark:text-red-400 font-medium", children: errors.email }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { id: "password", type: showPassword ? 'text' : 'password', value: formData.password, onChange: handleInputChange('password'), className: `block w-full pl-12 pr-14 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 font-medium ${errors.password
                                                ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-600'
                                                : 'border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-500'}`, placeholder: "Create a password" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-2xl transition-colors duration-200", children: showPassword ? (_jsx(EyeOff, { className: "h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" })) : (_jsx(Eye, { className: "h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" })) })] }), errors.password && (_jsx("p", { className: "mt-2 text-sm text-red-600 dark:text-red-400 font-medium", children: errors.password }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3", children: "Confirm Password" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { id: "confirmPassword", type: showConfirmPassword ? 'text' : 'password', value: formData.confirmPassword, onChange: handleInputChange('confirmPassword'), className: `block w-full pl-12 pr-14 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 font-medium ${errors.confirmPassword
                                                ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-600'
                                                : 'border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-500'}`, placeholder: "Confirm your password" }), _jsx("button", { type: "button", onClick: () => setShowConfirmPassword(!showConfirmPassword), className: "absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-2xl transition-colors duration-200", children: showConfirmPassword ? (_jsx(EyeOff, { className: "h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" })) : (_jsx(Eye, { className: "h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" })) })] }), errors.confirmPassword && (_jsx("p", { className: "mt-2 text-sm text-red-600 dark:text-red-400 font-medium", children: errors.confirmPassword }))] }), errors.general && (_jsx("div", { className: "bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-4", children: _jsx("p", { className: "text-sm text-red-600 dark:text-red-400 font-medium", children: errors.general }) })), _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: "flex items-center h-5", children: _jsx("input", { id: "terms", name: "terms", type: "checkbox", required: true, className: "h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" }) }), _jsx("div", { className: "ml-3 text-sm", children: _jsxs("label", { htmlFor: "terms", className: "text-gray-700 dark:text-gray-300 font-medium", children: ["I agree to the", ' ', _jsx("button", { type: "button", className: "text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 font-semibold", children: "Terms and Conditions" }), ' ', "and", ' ', _jsx("button", { type: "button", className: "text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 font-semibold", children: "Privacy Policy" })] }) })] }), _jsx(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, type: "submit", disabled: isFormLoading, className: "w-full flex justify-center py-4 px-6 border border-transparent rounded-2xl shadow-xl text-lg font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300", children: isFormLoading ? (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" }), "Creating account..."] })) : ('Create Account') })] }), _jsx("div", { className: "mt-8 text-center", children: _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400 font-medium", children: ["Already have an account?", ' ', _jsx("button", { onClick: onSwitchToLogin, className: "font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-200", children: "Sign in here" })] }) })] }) }));
}
