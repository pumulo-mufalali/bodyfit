import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { exerciseCategories } from '../../lib/exercise-categories';
import ExerciseGifModal from './ExerciseGifModal';
export default function ExerciseBrowser({ onOpenExercise }) {
    const [selectedCategory, setSelectedCategory] = useState('Cardio');
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [showGifModal, setShowGifModal] = useState(false);
    const handleExerciseClick = (exercise) => {
        setSelectedExercise(exercise);
        setShowGifModal(true);
        onOpenExercise?.(exercise);
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50", children: [_jsxs("div", { className: "flex items-center justify-between mb-8 gap-6 flex-wrap", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-2 h-10 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" }), _jsx("h2", { className: "text-4xl font-black text-gray-900 dark:text-gray-100", children: "Browse Exercises" })] }), _jsx("select", { id: "category-select", value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), className: "px-6 py-3 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold cursor-pointer", "aria-label": "Select exercise category", children: exerciseCategories.map((category) => (_jsx("option", { value: category.category, className: "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100", children: category.category }, category.category))) })] }), _jsx("div", { children: _jsx("div", { className: "grid grid-cols-2 gap-8", children: exerciseCategories
                                .find((cat) => cat.category === selectedCategory)
                                ?.exercises.map((exercise) => (_jsxs(motion.button, { whileHover: { scale: 1.02, y: -4 }, whileTap: { scale: 0.98 }, onClick: () => handleExerciseClick(exercise), className: "group relative overflow-hidden rounded-3xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-300 aspect-square shadow-lg hover:shadow-2xl", "aria-label": `View ${exercise.name} exercise`, children: [_jsx("img", { src: exercise.imageUrl, alt: exercise.name, className: "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105", loading: "lazy" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" }), _jsx("div", { className: "absolute bottom-0 left-0 right-0 p-6", children: _jsx("span", { className: "text-white font-bold text-lg block group-hover:text-white transition-colors duration-300", children: exercise.name }) }), _jsx("div", { className: "absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: _jsx("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" }) }) })] }, exercise.id))) }) })] }), showGifModal && selectedExercise && (_jsx(ExerciseGifModal, { exercise: selectedExercise, onClose: () => {
                    setShowGifModal(false);
                    setSelectedExercise(null);
                } }))] }));
}
