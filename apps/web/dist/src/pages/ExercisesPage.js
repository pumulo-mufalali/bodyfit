import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExerciseGifModal from '../components/exercises/ExerciseGifModal';
import { exerciseCategories } from '../lib/exercise-categories';
import { Search, X, AlertCircle } from 'lucide-react';
export default function ExercisesPage({ onBack }) {
    const [showGifModal, setShowGifModal] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchError, setSearchError] = useState({ message: '', type: null });
    const [hasSearched, setHasSearched] = useState(false);
    // Maximum search query length to prevent performance issues
    const MAX_SEARCH_LENGTH = 100;
    // Validate search input
    const validateSearchQuery = useCallback((query) => {
        if (!query || query.trim().length === 0) {
            return { valid: true }; // Empty query is valid (shows all exercises)
        }
        const trimmedQuery = query.trim();
        if (trimmedQuery.length > MAX_SEARCH_LENGTH) {
            return {
                valid: false,
                error: `Search query must be less than ${MAX_SEARCH_LENGTH} characters`
            };
        }
        // Check for invalid characters (basic sanitization)
        const invalidChars = /[<>{}[\]]/g;
        if (invalidChars.test(trimmedQuery)) {
            return {
                valid: false,
                error: 'Search query contains invalid characters'
            };
        }
        return { valid: true };
    }, []);
    // Handle search input change
    const handleSearchChange = useCallback((e) => {
        const value = e.target.value;
        // Clear previous errors
        setSearchError({ message: '', type: null });
        // Validate input
        const validation = validateSearchQuery(value);
        if (!validation.valid && validation.error) {
            setSearchError({
                message: validation.error,
                type: 'invalid_input'
            });
            return;
        }
        setSearchQuery(value);
        // Mark as searched if user has typed something
        if (value.trim().length > 0) {
            setHasSearched(true);
        }
        else {
            setHasSearched(false);
        }
    }, [validateSearchQuery]);
    // Clear search
    const clearSearch = useCallback(() => {
        setSearchQuery('');
        setSearchError({ message: '', type: null });
        setHasSearched(false);
    }, []);
    // Filter exercises based on search query
    const filteredCategories = useMemo(() => {
        try {
            // If no search query, return all categories
            if (!searchQuery || searchQuery.trim().length === 0) {
                return exerciseCategories;
            }
            const query = searchQuery.trim().toLowerCase();
            // Filter categories and exercises
            const filtered = exerciseCategories
                .map(category => {
                const matchingExercises = category.exercises.filter(exercise => {
                    try {
                        const exerciseName = exercise.name.toLowerCase();
                        const categoryName = category.category.toLowerCase();
                        // Search in exercise name and category name
                        return exerciseName.includes(query) || categoryName.includes(query);
                    }
                    catch (error) {
                        console.error('Error filtering exercise:', error);
                        return false;
                    }
                });
                // Only include category if it has matching exercises
                if (matchingExercises.length > 0) {
                    return {
                        ...category,
                        exercises: matchingExercises
                    };
                }
                return null;
            })
                .filter((category) => category !== null);
            // Check if any results found
            if (filtered.length === 0 && hasSearched) {
                setSearchError({
                    message: `No exercises found for "${searchQuery}"`,
                    type: 'no_results'
                });
            }
            else {
                setSearchError({ message: '', type: null });
            }
            return filtered;
        }
        catch (error) {
            console.error('Error filtering exercises:', error);
            setSearchError({
                message: 'An error occurred while searching. Please try again.',
                type: 'network_error'
            });
            return exerciseCategories; // Return all categories as fallback
        }
    }, [searchQuery, hasSearched]);
    // Calculate total filtered exercises count
    const totalFilteredExercises = useMemo(() => {
        return filteredCategories.reduce((total, category) => total + category.exercises.length, 0);
    }, [filteredCategories]);
    return (_jsxs("div", { className: "min-h-screen gradient-clean-light dark:gradient-clean-dark", children: [_jsxs("div", { className: "max-w-7xl mx-auto py-12 px-6", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: "mb-12", children: [_jsxs("div", { className: "flex items-center gap-6 mb-6", children: [onBack && (_jsx(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: onBack, className: "p-3 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50", children: _jsx("svg", { className: "w-6 h-6 text-gray-600 dark:text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 19l-7-7m0 0l7-7m-7 7h18" }) }) })), _jsxs("div", { className: "flex-1", children: [_jsx("h1", { className: "text-5xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent", children: "Exercise Library" }), _jsx("p", { className: "text-lg text-gray-600 dark:text-gray-400 mt-2 font-medium", children: "Click on any exercise to start exercising" })] })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: 0.2 }, className: "mb-8", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(Search, { className: "h-5 w-5 text-gray-400 dark:text-gray-500" }) }), _jsx("input", { type: "text", value: searchQuery, onChange: handleSearchChange, placeholder: "Search exercises by name or category...", maxLength: MAX_SEARCH_LENGTH, className: "w-full pl-12 pr-12 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-lg hover:shadow-xl" }), searchQuery && (_jsx("button", { onClick: clearSearch, className: "absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors", "aria-label": "Clear search", children: _jsx(X, { className: "h-5 w-5" }) }))] }), hasSearched && (_jsx(motion.p, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "text-sm text-gray-600 dark:text-gray-400 mt-2 ml-1", children: totalFilteredExercises > 0 ? (`Found ${totalFilteredExercises} exercise${totalFilteredExercises !== 1 ? 's' : ''}`) : ('No results found') })), _jsx(AnimatePresence, { children: searchError.message && (_jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "mt-3 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" }), _jsx("p", { className: "text-sm text-red-800 dark:text-red-200", children: searchError.message })] })) })] })] }), filteredCategories.length > 0 ? (_jsx("div", { className: "space-y-16", children: filteredCategories.map((category, categoryIndex) => (_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: categoryIndex * 0.1 }, children: [_jsxs("h2", { className: "text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 flex items-center gap-3", children: [_jsx("div", { className: "w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" }), category.category] }), _jsx("div", { className: "grid grid-cols-4 gap-8", children: category.exercises.map((exercise, exerciseIndex) => (_jsxs(motion.button, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.4, delay: (categoryIndex * 0.1) + (exerciseIndex * 0.05) }, whileHover: { scale: 1.02, y: -4 }, whileTap: { scale: 0.98 }, onClick: () => {
                                            try {
                                                setSelectedExercise(exercise);
                                                setShowGifModal(true);
                                            }
                                            catch (error) {
                                                console.error('Error opening exercise modal:', error);
                                                setSearchError({
                                                    message: 'Failed to open exercise. Please try again.',
                                                    type: 'network_error'
                                                });
                                            }
                                        }, className: "group relative overflow-hidden rounded-3xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-300 aspect-square shadow-lg hover:shadow-2xl", children: [_jsx("img", { src: exercise.imageUrl, alt: exercise.name, className: "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105", onError: (e) => {
                                                    console.error('Error loading exercise image:', exercise.imageUrl);
                                                    // Set a fallback or placeholder
                                                    const target = e.target;
                                                    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage%3C/text%3E%3C/svg%3E';
                                                    target.alt = `${exercise.name} (image unavailable)`;
                                                }, loading: "lazy" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" }), _jsx("div", { className: "absolute bottom-0 left-0 right-0 p-6", children: _jsx("span", { className: "text-white font-bold text-lg block group-hover:text-white transition-colors duration-300", children: exercise.name }) }), _jsx("div", { className: "absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: _jsx("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" }) }) })] }, exercise.id))) })] }, category.category))) })) : (
                    /* No Results State */
                    _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "text-center py-16", children: _jsxs("div", { className: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-12 border border-gray-200/50 dark:border-gray-700/50 shadow-lg", children: [_jsx("div", { className: "w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6", children: _jsx(Search, { className: "w-12 h-12 text-gray-400 dark:text-gray-500" }) }), _jsx("h3", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4", children: "No exercises found" }), _jsxs("p", { className: "text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto", children: ["We couldn't find any exercises matching \"", searchQuery, "\". Try searching with different keywords or browse all exercises."] }), _jsx("button", { onClick: clearSearch, className: "px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl", children: "Clear Search & Show All" })] }) }))] }), showGifModal && selectedExercise && (_jsx(ExerciseGifModal, { exercise: selectedExercise, onClose: () => {
                    setShowGifModal(false);
                    setSelectedExercise(null);
                } }))] }));
}
