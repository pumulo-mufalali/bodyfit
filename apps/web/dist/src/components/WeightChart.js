import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import { useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from "chart.js";
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);
export function WeightChart({ weightHistory, currentWeight, onAddWeight, isAdding }) {
    const [newWeight, setNewWeight] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        const weight = parseFloat(newWeight);
        if (!isNaN(weight) && weight > 0) {
            onAddWeight(weight);
            setNewWeight("");
        }
    };
    const chartData = {
        labels: weightHistory.map(entry => entry.date),
        datasets: [{
                label: "Weight (kg)",
                data: weightHistory.map(entry => entry.weight),
                borderColor: "rgb(59, 130, 246)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                tension: 0.3,
                fill: true
            }]
    };
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 750,
            easing: 'easeInOutQuart'
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgb(17 24 39 / 0.8)',
                titleColor: 'rgb(243 244 246)',
                bodyColor: 'rgb(243 244 246)',
                borderColor: 'rgb(75 85 99)',
                borderWidth: 1,
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                grid: {
                    color: "rgba(107, 114, 128, 0.1)"
                },
                ticks: {
                    color: "#666",
                    font: {
                        size: 11
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: "#666",
                    font: {
                        size: 11
                    }
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.1 }, className: "bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6", children: [_jsx("div", { className: "flex items-center justify-between mb-6", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "bg-gradient-to-br from-green-400 to-emerald-600 rounded-full p-3", children: _jsx("svg", { className: "h-6 w-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" }) }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Weight Tracking" }), _jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["Current: ", currentWeight, " kg"] })] })] }) }), _jsx("div", { className: "h-64 mb-6", children: weightHistory.length > 0 ? (_jsx(Line, { data: chartData, options: chartOptions }, "weight-chart")) : (_jsx("div", { className: "flex items-center justify-center h-full text-gray-500 dark:text-gray-400", children: "No weight entries yet. Add your first entry below." })) }), _jsxs("form", { onSubmit: handleSubmit, className: "flex space-x-2", children: [_jsx("input", { type: "number", step: "0.1", className: "flex-1 rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-white sm:text-sm", placeholder: "Enter weight in kg", value: newWeight, onChange: (e) => setNewWeight(e.target.value) }), _jsx(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, type: "submit", className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50", disabled: isAdding || !newWeight, children: isAdding ? "Adding..." : "Add Entry" })] })] }));
}
