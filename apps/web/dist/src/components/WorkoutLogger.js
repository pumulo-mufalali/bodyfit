import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { useState } from "react";
export function WorkoutLogger({ exercises, onLogWorkout, isLogging }) {
    const [selectedExercise, setSelectedExercise] = useState("");
    const [duration, setDuration] = useState("");
    const [notes, setNotes] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedExercise && duration) {
            const durationNum = parseInt(duration);
            if (!isNaN(durationNum) && durationNum > 0) {
                onLogWorkout(selectedExercise, durationNum, notes);
                setSelectedExercise("");
                setDuration("");
                setNotes("");
            }
        }
    };
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 }, className: "bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6", children: [_jsxs("div", { className: "flex items-center space-x-4 mb-6", children: [_jsx("div", { className: "bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full p-3", children: _jsx("svg", { className: "h-6 w-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" }) }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Log Workout" }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Track your exercises" })] })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Exercise" }), _jsxs("select", { className: "block w-full rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white sm:text-sm", value: selectedExercise, onChange: (e) => setSelectedExercise(e.target.value), children: [_jsx("option", { value: "", children: "Select an exercise" }), exercises.map(exercise => (_jsx("option", { value: exercise.id, children: exercise.name }, exercise.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Duration (minutes)" }), _jsx("input", { type: "number", className: "block w-full rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white sm:text-sm", value: duration, onChange: (e) => setDuration(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Notes" }), _jsx("textarea", { className: "block w-full rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white sm:text-sm", rows: 3, value: notes, onChange: (e) => setNotes(e.target.value) })] }), _jsx(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, type: "submit", className: "w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50", disabled: isLogging || !selectedExercise || !duration, children: isLogging ? "Logging..." : "Log Workout" })] })] }));
}
