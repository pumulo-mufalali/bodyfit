import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../providers/auth-provider';
import { workoutService } from '../lib/firebase-data-service';
import { exerciseCategories } from '../lib/exercise-categories';
import { motion } from 'framer-motion';
import { Calendar, Clock, Flame, Activity, Filter } from 'lucide-react';
const intensityColors = {
    low: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800'
    },
    medium: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        text: 'text-yellow-600 dark:text-yellow-400',
        border: 'border-yellow-200 dark:border-yellow-800'
    },
    high: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        text: 'text-red-600 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800'
    }
};
export default function WorkoutLogsPage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [filterIntensity, setFilterIntensity] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    // Fetch workout logs
    const { data: workoutLogs = [], isLoading } = useQuery({
        queryKey: ['workouts', 'logs', user?.uid],
        queryFn: () => workoutService.getLogs(user.uid),
        enabled: !!user?.uid,
        staleTime: 0, // Always consider data stale to allow immediate refetch
        refetchOnMount: 'always', // Always refetch when component mounts
        refetchOnWindowFocus: true, // Refetch when window gains focus
    });
    // Set up a subscription to refetch when queries are invalidated
    useEffect(() => {
        if (user?.uid) {
            // Refetch immediately when component mounts to ensure fresh data
            queryClient.refetchQueries({ queryKey: ['workouts', 'logs', user.uid] });
        }
    }, [user?.uid, queryClient]);
    // Get exercise name from exerciseId
    const getExerciseName = (exerciseId) => {
        for (const category of exerciseCategories) {
            const exercise = category.exercises.find(ex => ex.id === exerciseId);
            if (exercise)
                return exercise.name;
        }
        return 'Unknown Exercise';
    };
    // Get exercise image from exerciseId
    const getExerciseImage = (exerciseId) => {
        for (const category of exerciseCategories) {
            const exercise = category.exercises.find(ex => ex.id === exerciseId);
            if (exercise)
                return exercise.imageUrl;
        }
        return null;
    };
    // Filter and sort workout logs
    const filteredLogs = useMemo(() => {
        let filtered = workoutLogs;
        // Filter by intensity
        if (filterIntensity !== 'all') {
            filtered = filtered.filter(log => log.intensity === filterIntensity);
        }
        // Filter by search term (exercise name)
        if (searchTerm) {
            filtered = filtered.filter(log => {
                const exerciseName = getExerciseName(log.exerciseId);
                return exerciseName.toLowerCase().includes(searchTerm.toLowerCase());
            });
        }
        // Sort by date (most recent first)
        return filtered.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA;
        });
    }, [workoutLogs, filterIntensity, searchTerm]);
    // Calculate statistics
    const stats = useMemo(() => {
        const totalWorkouts = workoutLogs.length;
        const totalMinutes = workoutLogs.reduce((sum, log) => sum + log.durationMinutes, 0);
        const totalCalories = workoutLogs.reduce((sum, log) => sum + log.caloriesBurned, 0);
        const avgIntensity = workoutLogs.length > 0
            ? workoutLogs.reduce((sum, log) => {
                const intensityValue = log.intensity === 'low' ? 1 : log.intensity === 'medium' ? 2 : 3;
                return sum + intensityValue;
            }, 0) / workoutLogs.length
            : 0;
        const intensityLabel = avgIntensity < 1.5 ? 'Low' : avgIntensity < 2.5 ? 'Medium' : 'High';
        return {
            totalWorkouts,
            totalMinutes: Math.round(totalMinutes),
            totalCalories,
            avgIntensity: intensityLabel
        };
    }, [workoutLogs]);
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "Workout Logs" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: "View all your completed workout sessions" })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Activity, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" }), _jsx("div", { className: "text-sm text-blue-600 dark:text-blue-400 font-medium", children: "Total Workouts" })] }), _jsx("div", { className: "text-3xl font-bold text-blue-700 dark:text-blue-300", children: stats.totalWorkouts })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-xl border border-purple-200/50 dark:border-purple-700/50", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Clock, { className: "w-5 h-5 text-purple-600 dark:text-purple-400" }), _jsx("div", { className: "text-sm text-purple-600 dark:text-purple-400 font-medium", children: "Total Minutes" })] }), _jsx("div", { className: "text-3xl font-bold text-purple-700 dark:text-purple-300", children: stats.totalMinutes })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-4 rounded-xl border border-orange-200/50 dark:border-orange-700/50", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Flame, { className: "w-5 h-5 text-orange-600 dark:text-orange-400" }), _jsx("div", { className: "text-sm text-orange-600 dark:text-orange-400 font-medium", children: "Total Calories" })] }), _jsx("div", { className: "text-3xl font-bold text-orange-700 dark:text-orange-300", children: stats.totalCalories })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-xl border border-green-200/50 dark:border-green-700/50", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Activity, { className: "w-5 h-5 text-green-600 dark:text-green-400" }), _jsx("div", { className: "text-sm text-green-600 dark:text-green-400 font-medium", children: "Avg Intensity" })] }), _jsx("div", { className: "text-3xl font-bold text-green-700 dark:text-green-300", children: stats.avgIntensity })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [_jsx("div", { className: "flex-1", children: _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", placeholder: "Search workouts by exercise name...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full px-4 py-2 pl-10 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-300" }), _jsx("svg", { className: "absolute left-3 top-2.5 w-5 h-5 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) })] }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Filter, { className: "w-5 h-5 text-gray-600 dark:text-gray-400" }), _jsxs("select", { value: filterIntensity, onChange: (e) => setFilterIntensity(e.target.value), className: "px-4 py-2 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-300", children: [_jsx("option", { value: "all", children: "All Intensities" }), _jsx("option", { value: "low", children: "Low Intensity" }), _jsx("option", { value: "medium", children: "Medium Intensity" }), _jsx("option", { value: "high", children: "High Intensity" })] })] })] }), _jsx("div", { className: "space-y-4", children: filteredLogs.length === 0 ? (_jsxs("div", { className: "text-center py-12 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700", children: [_jsx(Activity, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 text-lg font-medium", children: workoutLogs.length === 0 ? 'No workouts logged yet' : 'No workouts match your filters' }), _jsx("p", { className: "text-gray-500 dark:text-gray-500 text-sm mt-2", children: workoutLogs.length === 0 ? 'Complete a timer workout to see it here!' : 'Try adjusting your search or filter' })] })) : (filteredLogs.map((log, index) => {
                    const exerciseName = getExerciseName(log.exerciseId);
                    const exerciseImage = getExerciseImage(log.exerciseId);
                    const intensity = intensityColors[log.intensity];
                    const date = new Date(log.date);
                    const formattedDate = date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    });
                    return (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-200", children: _jsxs("div", { className: "flex items-start gap-4", children: [exerciseImage && (_jsx("div", { className: "flex-shrink-0", children: _jsx("img", { src: exerciseImage, alt: exerciseName, className: "w-20 h-20 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-700" }) })), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between gap-4 mb-2", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 dark:text-white mb-1", children: exerciseName }), _jsxs("div", { className: "flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "w-4 h-4" }), _jsx("span", { children: formattedDate })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "w-4 h-4" }), _jsxs("span", { children: [log.durationMinutes.toFixed(1), " mins"] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Flame, { className: "w-4 h-4" }), _jsxs("span", { children: [log.caloriesBurned, " kcal"] })] })] })] }), _jsx("div", { className: `px-3 py-1 rounded-full text-xs font-semibold ${intensity.bg} ${intensity.text} border ${intensity.border}`, children: log.intensity.charAt(0).toUpperCase() + log.intensity.slice(1) })] }), log.notes && (_jsx("div", { className: "mt-2 text-sm text-gray-600 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2", children: log.notes }))] })] }) }, log.id));
                })) })] }));
}
