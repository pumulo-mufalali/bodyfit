import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useAuth } from '../providers/auth-provider';
import AuthPage from '../pages/AuthPage';
export default function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading, login } = useAuth();
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Loading..." })] }) }));
    }
    if (!isAuthenticated) {
        return _jsx(AuthPage, { onAuthSuccess: login });
    }
    return _jsx(_Fragment, { children: children });
}
