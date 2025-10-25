import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { useState } from "react";
export function RecentWorkouts({ workouts, exercises }) {
    const [searchTerm, setSearchTerm] = useState("");
    const filteredWorkouts = workouts.filter(workout => {
        const exercise = exercises.find(e => e.id === workout.exerciseId);
        const searchLower = searchTerm.toLowerCase();
        return (exercise?.name.toLowerCase().includes(searchLower) ||
            workout.notes?.toLowerCase().includes(searchLower) ||
            workout.date.includes(searchLower));
    });
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.3 }, className: "bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-4", children: "Recent Workouts" }), _jsxs("div", { className: "relative mb-4", children: [_jsx("input", { type: "text", className: "block w-full pl-10 pr-3 py-2 rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm", placeholder: "Search workouts...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) }), _jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx("svg", { className: "h-5 w-5 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }) })] }), _jsx("div", { className: "space-y-4", children: filteredWorkouts.slice().reverse().map(workout => {
                    const exercise = exercises.find(e => e.id === workout.exerciseId);
                    return (_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3 }, className: "flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors", children: [_jsx("div", { className: `mt-1 flex-shrink-0 w-2 h-2 rounded-full ${exercise?.category === 'cardio' ? 'bg-red-400' :
                                    exercise?.category === 'strength' ? 'bg-blue-400' :
                                        exercise?.category === 'stretching' ? 'bg-yellow-400' :
                                            'bg-purple-400'}` }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: exercise?.name }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: workout.date })] }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-300", children: [workout.durationMinutes, " minutes"] }), workout.notes && (_jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: workout.notes }))] })] }, workout.id));
                }) })] }));
}
