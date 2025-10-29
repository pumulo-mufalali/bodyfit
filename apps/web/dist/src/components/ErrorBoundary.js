import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });
        // Log to error tracking service if available
        try {
            // You can add error logging service here (e.g., Sentry, LogRocket)
            // logErrorToService(error, errorInfo);
        }
        catch (logError) {
            console.error('Failed to log error:', logError);
        }
    }
    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 max-w-md w-full", children: [_jsx("div", { className: "flex items-center justify-center mb-6", children: _jsx("div", { className: "bg-red-100 dark:bg-red-900/20 p-4 rounded-full", children: _jsx(AlertTriangle, { className: "w-12 h-12 text-red-600 dark:text-red-400" }) }) }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white text-center mb-4", children: "Something went wrong" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 text-center mb-6", children: "We're sorry, but something unexpected happened. Please try refreshing the page." }), this.state.error && process.env.NODE_ENV === 'development' && (_jsx("div", { className: "bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6 overflow-auto max-h-40", children: _jsx("p", { className: "text-xs font-mono text-red-600 dark:text-red-400 break-all", children: this.state.error.toString() }) })), _jsxs("div", { className: "flex gap-4", children: [_jsxs("button", { onClick: this.handleReset, className: "flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2", children: [_jsx(RefreshCw, { className: "w-4 h-4" }), "Try Again"] }), _jsx("button", { onClick: () => window.location.reload(), className: "flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-xl transition-all duration-200", children: "Reload Page" })] })] }) }));
        }
        return this.props.children;
    }
}
