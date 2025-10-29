import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, X, CheckCircle, AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getFirebaseAuthErrorMessage } from '../utils/error-handler';
export default function LoginForm({ onSuccess, onSwitchToSignUp, isLoading: externalLoading = false }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    // Password reset state
    const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [isSendingReset, setIsSendingReset] = useState(false);
    const [resetError, setResetError] = useState('');
    const [resetSuccess, setResetSuccess] = useState(false);
    const validateForm = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Email is required';
        }
        else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        }
        else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const getErrorMessage = (errorCode) => {
        switch (errorCode) {
            case 'auth/user-not-found':
                return 'No account found with this email address';
            case 'auth/wrong-password':
                return 'Incorrect password';
            case 'auth/invalid-email':
                return 'Invalid email address';
            case 'auth/user-disabled':
                return 'This account has been disabled';
            case 'auth/too-many-requests':
                return 'Too many failed attempts. Please try again later';
            case 'auth/network-request-failed':
                return 'Network error. Please check your connection';
            default:
                return 'Invalid credentials. Please try again';
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
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Create user object for the parent component
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || email.split('@')[0],
                emailVerified: user.emailVerified
            };
            // Call success callback if provided
            if (onSuccess) {
                onSuccess(userData);
            }
        }
        catch (error) {
            console.error('Login error:', error);
            setErrors({
                general: getErrorMessage(error.code)
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleInputChange = (field) => (e) => {
        if (field === 'email') {
            setEmail(e.target.value);
        }
        else {
            setPassword(e.target.value);
        }
        // Clear errors when user starts typing
        if (errors[field] || errors.general) {
            setErrors(prev => ({ ...prev, [field]: undefined, general: undefined }));
        }
    };
    // Handle password reset
    const handleForgotPassword = () => {
        setShowPasswordResetModal(true);
        setResetEmail(email || ''); // Pre-fill with current email if available
        setResetError('');
        setResetSuccess(false);
    };
    const validateResetEmail = (emailValue) => {
        if (!emailValue || emailValue.trim().length === 0) {
            return { valid: false, error: 'Email is required' };
        }
        if (!/\S+@\S+\.\S+/.test(emailValue)) {
            return { valid: false, error: 'Please enter a valid email address' };
        }
        return { valid: true };
    };
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        // Validate email
        const validation = validateResetEmail(resetEmail);
        if (!validation.valid) {
            setResetError(validation.error || 'Invalid email');
            return;
        }
        setIsSendingReset(true);
        setResetError('');
        setResetSuccess(false);
        try {
            const trimmedEmail = resetEmail.trim();
            // Additional validation
            if (!trimmedEmail || trimmedEmail.length === 0) {
                throw new Error('Email cannot be empty');
            }
            // Check if auth is properly initialized
            if (!auth) {
                throw new Error('Authentication service not available. Please refresh the page.');
            }
            console.log('Sending password reset email to:', trimmedEmail);
            await sendPasswordResetEmail(auth, trimmedEmail);
            console.log('Password reset email sent successfully');
            setResetSuccess(true);
            // Clear email after successful reset for security
            setTimeout(() => {
                setResetEmail('');
            }, 5000);
        }
        catch (error) {
            console.error('Password reset error:', error);
            console.error('Error details:', {
                code: error.code,
                message: error.message,
                name: error.name
            });
            // Handle specific Firebase errors
            if (error.code) {
                const errorMessage = getFirebaseAuthErrorMessage(error.code);
                setResetError(errorMessage);
            }
            else if (error.message) {
                setResetError(error.message);
            }
            else {
                setResetError('Failed to send reset email. Please try again or contact support.');
            }
            setResetSuccess(false);
        }
        finally {
            setIsSendingReset(false);
        }
    };
    const closePasswordResetModal = () => {
        setShowPasswordResetModal(false);
        setResetEmail('');
        setResetError('');
        setResetSuccess(false);
    };
    const isFormLoading = isLoading || externalLoading;
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "w-full max-w-lg mx-auto", children: [_jsxs("div", { className: "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-gray-200/50 dark:border-gray-700/50", children: [_jsxs("div", { className: "text-center mb-10", children: [_jsx("h1", { className: "text-4xl font-black text-gray-900 dark:text-white mb-3", children: "Welcome Back" }), _jsx("p", { className: "text-lg text-gray-600 dark:text-gray-400 font-medium", children: "Sign in to continue your fitness journey" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-8", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3", children: "Email Address" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(Mail, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { id: "email", type: "email", value: email, onChange: handleInputChange('email'), className: `block w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 font-medium ${errors.email
                                                    ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-600'
                                                    : 'border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-500'}`, placeholder: "Enter your email" })] }), errors.email && (_jsx("p", { className: "mt-2 text-sm text-red-600 dark:text-red-400 font-medium", children: errors.email }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { id: "password", type: showPassword ? 'text' : 'password', value: password, onChange: handleInputChange('password'), className: `block w-full pl-12 pr-14 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 font-medium ${errors.password
                                                    ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-600'
                                                    : 'border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-500'}`, placeholder: "Enter your password" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-2xl transition-colors duration-200", children: showPassword ? (_jsx(EyeOff, { className: "h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" })) : (_jsx(Eye, { className: "h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" })) })] }), errors.password && (_jsx("p", { className: "mt-2 text-sm text-red-600 dark:text-red-400 font-medium", children: errors.password }))] }), errors.general && (_jsx("div", { className: "bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-4", children: _jsx("p", { className: "text-sm text-red-600 dark:text-red-400 font-medium", children: errors.general }) })), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("input", { id: "remember-me", name: "remember-me", type: "checkbox", className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" }), _jsx("label", { htmlFor: "remember-me", className: "ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300", children: "Remember me" })] }), _jsx("button", { type: "button", onClick: handleForgotPassword, className: "text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200", children: "Forgot password?" })] }), _jsx(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, type: "submit", disabled: isFormLoading, className: "w-full flex justify-center py-4 px-6 border border-transparent rounded-2xl shadow-xl text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300", children: isFormLoading ? (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" }), "Signing in..."] })) : ('Sign In') })] }), _jsx("div", { className: "mt-8 text-center", children: _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400 font-medium", children: ["Don't have an account?", ' ', _jsx("button", { onClick: onSwitchToSignUp, className: "font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200", children: "Sign up here" })] }) })] }), _jsx(AnimatePresence, { children: showPasswordResetModal && (_jsxs(_Fragment, { children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: closePasswordResetModal, className: "fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50" }), _jsx(motion.div, { initial: { opacity: 0, scale: 0.9, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.9, y: 20 }, className: "fixed inset-0 z-50 flex items-center justify-center p-4", onClick: (e) => e.stopPropagation(), children: _jsxs("div", { className: "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 w-full max-w-md p-8 relative", children: [_jsx("button", { onClick: closePasswordResetModal, className: "absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200", "aria-label": "Close modal", children: _jsx(X, { className: "h-5 w-5 text-gray-500 dark:text-gray-400" }) }), resetSuccess ? (_jsxs("div", { className: "text-center py-4", children: [_jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { type: "spring", stiffness: 200 }, className: "w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6", children: _jsx(CheckCircle, { className: "w-12 h-12 text-green-600 dark:text-green-400" }) }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-3", children: "Check Your Email" }), _jsxs("p", { className: "text-gray-600 dark:text-gray-400 mb-6", children: ["We've sent a password reset link to ", _jsx("span", { className: "font-semibold text-gray-900 dark:text-white", children: resetEmail })] }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-500 mb-6", children: "Please check your inbox and click on the link to reset your password. If you don't see it, check your spam folder." }), _jsx("button", { onClick: closePasswordResetModal, className: "w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl", children: "Got it" })] })) : (
                                    /* Reset Form */
                                    _jsxs(_Fragment, { children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Lock, { className: "w-8 h-8 text-blue-600 dark:text-blue-400" }) }), _jsx("h2", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: "Reset Password" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Enter your email address and we'll send you a link to reset your password." })] }), _jsxs("form", { onSubmit: handlePasswordReset, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "reset-email", className: "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3", children: "Email Address" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(Mail, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { id: "reset-email", type: "email", value: resetEmail, onChange: (e) => {
                                                                            setResetEmail(e.target.value);
                                                                            setResetError('');
                                                                        }, className: `block w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 font-medium ${resetError
                                                                            ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-600'
                                                                            : 'border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-500'}`, placeholder: "Enter your email", disabled: isSendingReset })] })] }), resetError && (_jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: "flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" }), _jsx("p", { className: "text-sm text-red-800 dark:text-red-200 font-medium", children: resetError })] })), _jsx(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, type: "submit", disabled: isSendingReset, className: "w-full flex justify-center py-4 px-6 border border-transparent rounded-2xl shadow-xl text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300", children: isSendingReset ? (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" }), "Sending..."] })) : ('Send Reset Link') }), _jsx("button", { type: "button", onClick: closePasswordResetModal, className: "w-full py-3 px-6 border-2 border-gray-300 dark:border-gray-600 rounded-2xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200", disabled: isSendingReset, children: "Cancel" })] })] }))] }) })] })) })] }));
}
