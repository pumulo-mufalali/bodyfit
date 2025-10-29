import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MotivationCard } from '../MotivationCard';
export default function AccountDetailsSidebar({ currentUser }) {
    const calculateBMI = () => {
        if (!currentUser?.weightKg || !currentUser?.heightCm)
            return null;
        if (currentUser.weightKg <= 0 || currentUser.heightCm <= 0)
            return null;
        const heightInMeters = currentUser.heightCm / 100;
        return (currentUser.weightKg / (heightInMeters * heightInMeters)).toFixed(1);
    };
    const bmi = calculateBMI();
    const getHealthStatus = () => {
        if (!bmi)
            return null;
        const bmiValue = parseFloat(bmi);
        if (bmiValue < 18.5)
            return { status: 'Underweight', color: 'blue', bg: 'from-blue-50 to-cyan-100', text: 'text-blue-600', border: 'border-blue-200' };
        if (bmiValue < 25)
            return { status: 'Normal', color: 'green', bg: 'from-green-50 to-emerald-100', text: 'text-green-600', border: 'border-green-200' };
        if (bmiValue < 30)
            return { status: 'Overweight', color: 'yellow', bg: 'from-yellow-50 to-amber-100', text: 'text-yellow-600', border: 'border-yellow-200' };
        return { status: 'Obese', color: 'red', bg: 'from-red-50 to-orange-100', text: 'text-red-600', border: 'border-red-200' };
    };
    const healthStatus = getHealthStatus();
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 space-y-6", children: [_jsx("div", { className: "text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "Account Details" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50", children: [_jsx("div", { className: "text-sm text-blue-600 dark:text-blue-400 font-medium", children: "Member Since" }), _jsx("div", { className: "text-2xl font-bold text-blue-700 dark:text-blue-300 mt-2", children: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) })] }), _jsxs("div", { className: "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-xl border border-green-200/50 dark:border-green-700/50", children: [_jsx("div", { className: "text-sm text-green-600 dark:text-green-400 font-medium", children: "Last Active" }), _jsx("div", { className: "text-2xl font-bold text-green-700 dark:text-green-300 mt-2", children: "Today" })] }), !bmi || !healthStatus ? (_jsxs("div", { className: "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30 p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50", children: [_jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400 font-medium", children: "Health Status" }), _jsx("div", { className: "text-lg font-bold text-gray-700 dark:text-gray-300 mt-2", children: "Complete profile to see BMI" })] })) : (_jsxs("div", { className: `bg-gradient-to-r ${healthStatus.bg} dark:from-${healthStatus.color}-900/30 dark:to-${healthStatus.color}-800/30 p-4 rounded-xl border ${healthStatus.border} dark:border-${healthStatus.color}-700/50`, children: [_jsx("div", { className: `text-sm ${healthStatus.text} dark:text-${healthStatus.color}-400 font-medium`, children: "Health Status" }), _jsx("div", { className: `text-2xl font-bold ${healthStatus.text} dark:text-${healthStatus.color}-300 mt-2`, children: healthStatus.status }), _jsxs("div", { className: "text-xs text-gray-600 dark:text-gray-400 mt-2", children: ["BMI: ", bmi] })] }))] })] }), _jsx(MotivationCard, {})] }));
}
