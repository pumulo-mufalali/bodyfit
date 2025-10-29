import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatsChart from './StatsChart';
export default function DetailedStatsModal({ onClose, labels, weightData, onUpdateWeight, currentWeight, isUpdating = false, isSuccess = false, units = 'metric' }) {
    const [newWeight, setNewWeight] = useState("");
    // Clear form when update is successful
    useEffect(() => {
        if (isSuccess) {
            setNewWeight("");
        }
    }, [isSuccess]);
    const handleWeightUpdate = async (e) => {
        e.preventDefault();
        if (!newWeight || newWeight.trim().length === 0) {
            alert('Please enter a weight value');
            return;
        }
        const weight = parseFloat(newWeight);
        if (isNaN(weight)) {
            alert('Please enter a valid number');
            return;
        }
        if (weight <= 0) {
            alert('Weight must be greater than 0');
            return;
        }
        if (weight > 1000) {
            alert('Weight must be less than 1000 kg');
            return;
        }
        if (!onUpdateWeight) {
            console.error('onUpdateWeight callback is not provided');
            return;
        }
        if (isUpdating) {
            return; // Prevent duplicate submissions
        }
        try {
            await onUpdateWeight(weight);
        }
        catch (error) {
            console.error("Failed to update weight:", error);
            const errorMessage = error?.message || 'Failed to update weight. Please try again.';
            alert(errorMessage);
        }
    };
    // Stop propagation to prevent closing the modal when clicking inside
    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black/95 z-50 flex items-center justify-center", onClick: onClose, children: _jsxs("div", { className: "bg-card rounded-xl p-6 shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto", onClick: handleModalContentClick, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Weight Progress" }), _jsx("button", { onClick: onClose, className: "px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors", children: "Close" })] }), _jsx("div", { className: "mt-4 text-sm text-gray-100 dark:text-gray-300 mb-4", children: "Track your weight progress over the last 3 months. Update your weight to see real-time changes in your chart." }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-1 space-y-4", children: onUpdateWeight && (_jsxs("div", { className: "p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800", children: [_jsx("h4", { className: "text-lg font-semibold text-green-800 dark:text-green-200 mb-3", children: "Update Weight" }), _jsxs("div", { className: "mb-2", children: [_jsx("span", { className: "text-sm text-green-700 dark:text-green-300", children: "Current Weight: " }), _jsxs("span", { className: "font-bold text-green-800 dark:text-green-200", children: [currentWeight || 'N/A', " kg"] })] }), _jsxs("form", { onSubmit: handleWeightUpdate, className: "space-y-3", children: [_jsx("div", { children: _jsx("input", { type: "number", step: "0.1", min: "0", className: "w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500", placeholder: "Enter new weight (kg)", value: newWeight, onChange: (e) => setNewWeight(e.target.value), disabled: isUpdating }) }), _jsx(motion.button, { type: "submit", disabled: isUpdating || !newWeight, whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, className: "w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed", children: isUpdating ? "Updating..." : isSuccess ? "✓ Updated!" : "Update Weight" })] })] })) }), _jsx("div", { className: "lg:col-span-2 h-[60vh]", children: _jsx(StatsChart, { labels: labels, weightData: weightData, units: units }) })] })] }) }));
}
