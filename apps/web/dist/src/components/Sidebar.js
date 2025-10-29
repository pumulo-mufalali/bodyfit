import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ThemeToggle } from './theme-toggle';
import { useAuth } from '../providers/auth-provider';
import { useSettings } from '../providers/settings-provider';
import { formatWeight, formatHeight } from '../lib/unit-conversion';
import { workoutService } from '../lib/firebase-data-service';
import { exerciseCategories } from '../lib/exercise-categories';
import { LogOut, Home, Target, User as UserIcon, Calendar, Trophy, Settings, Activity, Clock, Flame } from 'lucide-react';
const NavItem = ({ children, active, onClick, icon }) => (_jsx(motion.li, { whileHover: { x: 4 }, transition: { duration: 0.2 }, children: _jsxs("button", { className: `w-full text-left px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium flex items-center space-x-3 group ${active
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:shadow-md hover:text-blue-600 dark:hover:text-blue-400'}`, onClick: (e) => {
            e.preventDefault();
            // Set a flag to indicate sidebar navigation - always scroll to top
            sessionStorage.setItem('sidebar_nav', 'true');
            if (onClick)
                onClick();
        }, children: [_jsx("div", { className: `transition-colors duration-200 ${active ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`, children: icon }), _jsx("span", { children: children })] }) }));
export function Sidebar({ profile, onNav }) {
    const { logout, user } = useAuth();
    const settings = useSettings();
    // Fetch latest workout
    const { data: workoutLogs = [] } = useQuery({
        queryKey: ['workouts', 'logs', user?.uid],
        queryFn: () => workoutService.getLogs(user.uid),
        enabled: !!user?.uid,
        select: (data) => data.slice(0, 1), // Only get the latest one
    });
    const latestWorkout = workoutLogs[0] || null;
    // Get exercise name from exerciseId
    const getExerciseName = (exerciseId) => {
        for (const category of exerciseCategories) {
            const exercise = category.exercises.find(ex => ex.id === exerciseId);
            if (exercise)
                return exercise.name;
        }
        return 'Unknown Exercise';
    };
    // Calculate BMI if height and weight are available
    const calculateBMI = () => {
        if (profile?.weightKg && profile?.weightKg > 0 && profile?.heightCm && profile?.heightCm > 0) {
            const heightInMeters = profile.heightCm / 100;
            const bmi = profile.weightKg / (heightInMeters * heightInMeters);
            return bmi.toFixed(1);
        }
        return null;
    };
    const getBMICategory = (bmi) => {
        if (bmi < 18.5)
            return { category: "Underweight", color: "text-blue-600 dark:text-blue-400" };
        if (bmi < 25)
            return { category: "Normal", color: "text-green-600 dark:text-green-400" };
        if (bmi < 30)
            return { category: "Overweight", color: "text-yellow-600 dark:text-yellow-400" };
        return { category: "Obese", color: "text-red-600 dark:text-red-400" };
    };
    const bmi = calculateBMI();
    const bmiCategory = bmi ? getBMICategory(Number(bmi)) : null;
    return (_jsx("aside", { className: "w-80 shrink-0 pr-6", children: _jsxs("div", { className: "sticky top-8 space-y-6", children: [_jsxs(motion.button, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, onClick: () => onNav?.('profile'), className: "w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 relative group border border-gray-200/50 dark:border-gray-700/50", children: [_jsxs("div", { className: "flex items-center space-x-4 mb-6", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg", children: profile?.name?.charAt(0) ?? 'U' }), _jsxs("div", { children: [_jsx("div", { className: "text-xl font-bold text-gray-900 dark:text-white", children: profile?.name ?? 'User' }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400 font-medium", children: profile?.age && profile.age > 0 ? `${profile.age} years old` : 'Age not set' })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl p-4 text-center border border-blue-200/50 dark:border-blue-700/50", children: [_jsx("div", { className: "text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide", children: "Height" }), _jsx("div", { className: "font-bold text-blue-700 dark:text-blue-300 mt-1", children: profile?.heightCm && profile.heightCm > 0 ? formatHeight(profile.heightCm, settings.units) : 'Not set' })] }), _jsxs("div", { className: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl p-4 text-center border border-green-200/50 dark:border-green-700/50", children: [_jsx("div", { className: "text-xs text-green-600 dark:text-green-400 font-semibold uppercase tracking-wide", children: "Weight" }), _jsx("div", { className: "font-bold text-green-700 dark:text-green-300 mt-1", children: profile?.weightKg && profile.weightKg > 0 ? formatWeight(profile.weightKg, settings.units) : 'Not set' })] })] }), bmi && bmiCategory && (_jsxs("div", { className: "mt-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl p-4 border border-purple-200/50 dark:border-purple-700/50", children: [_jsx("div", { className: "text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wide text-center", children: "BMI" }), _jsxs("div", { className: "flex items-center justify-between mt-2", children: [_jsx("div", { className: "font-bold text-purple-700 dark:text-purple-300 text-lg", children: bmi }), _jsx("div", { className: `text-xs font-semibold ${bmiCategory.color}`, children: bmiCategory.category })] })] })), profile?.fitnessGoal && (_jsxs("div", { className: "mt-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-2xl p-4 border border-orange-200/50 dark:border-orange-700/50", children: [_jsx("div", { className: "text-xs text-orange-600 dark:text-orange-400 font-semibold uppercase tracking-wide", children: "Fitness Goal" }), _jsx("div", { className: "text-sm text-orange-700 dark:text-orange-300 mt-2 line-clamp-2", children: profile.fitnessGoal })] })), _jsx("div", { className: "absolute inset-0 rounded-3xl border-2 border-blue-500/0 group-hover:border-blue-500/20 transition-all duration-300 pointer-events-none" })] }), _jsx(motion.nav, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.1 }, className: "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50", children: _jsxs("ul", { className: "space-y-2", children: [_jsx(NavItem, { onClick: () => onNav?.('dashboard'), icon: _jsx(Home, { className: "w-5 h-5" }), children: "Home" }), _jsx(NavItem, { onClick: () => onNav?.('workouts'), icon: _jsx(Activity, { className: "w-5 h-5" }), children: "Workout Logs" }), _jsx(NavItem, { onClick: () => onNav?.('goals'), icon: _jsx(Target, { className: "w-5 h-5" }), children: "My Goals" }), _jsx(NavItem, { onClick: () => onNav?.('profile'), icon: _jsx(UserIcon, { className: "w-5 h-5" }), children: "Profile Settings" }), _jsx(NavItem, { onClick: () => onNav?.('schedule'), icon: _jsx(Calendar, { className: "w-5 h-5" }), children: "Schedule" }), _jsx(NavItem, { onClick: () => onNav?.('achievements'), icon: _jsx(Trophy, { className: "w-5 h-5" }), children: "Achievements" }), _jsx(NavItem, { onClick: () => onNav?.('settings'), icon: _jsx(Settings, { className: "w-5 h-5" }), children: "Settings" }), _jsx("li", { className: "mt-6 pt-4 border-t border-gray-200 dark:border-gray-700", children: _jsx(ThemeToggle, {}) }), _jsx("li", { className: "pt-2", children: _jsxs(motion.button, { whileHover: { x: 4 }, whileTap: { scale: 0.98 }, onClick: logout, className: "w-full text-left px-4 py-3.5 rounded-2xl transition-all duration-300 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center space-x-3 font-medium hover:shadow-md group", children: [_jsx(LogOut, { className: "w-5 h-5 transition-colors duration-200 group-hover:text-red-700 dark:group-hover:text-red-300" }), _jsx("span", { children: "Sign Out" })] }) })] }) }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 }, className: "bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 rounded-3xl p-6 shadow-xl border border-emerald-200/50 dark:border-emerald-700/50", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center", children: _jsx(Activity, { className: "w-5 h-5 text-white" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 dark:text-white", children: "Latest Workout" }), _jsx("p", { className: "text-xs text-gray-600 dark:text-gray-400", children: "Your most recent session" })] })] }), latestWorkout ? (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/30 dark:border-emerald-700/30", children: [_jsx("div", { className: "font-semibold text-gray-900 dark:text-white mb-2", children: getExerciseName(latestWorkout.exerciseId) }), _jsxs("div", { className: "flex items-center gap-4 text-sm", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-gray-600 dark:text-gray-400", children: [_jsx(Clock, { className: "w-4 h-4" }), _jsxs("span", { children: [latestWorkout.durationMinutes.toFixed(1), " min"] })] }), _jsxs("div", { className: "flex items-center gap-1.5 text-gray-600 dark:text-gray-400", children: [_jsx(Flame, { className: "w-4 h-4" }), _jsxs("span", { children: [latestWorkout.caloriesBurned, " kcal"] })] })] }), _jsx("div", { className: "mt-2 text-xs text-gray-500 dark:text-gray-500", children: new Date(latestWorkout.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            }) })] }), _jsx("button", { onClick: (e) => {
                                        e.preventDefault();
                                        // Set sidebar nav flag for consistent scroll-to-top behavior
                                        sessionStorage.setItem('sidebar_nav', 'true');
                                        onNav?.('workouts');
                                    }, className: "w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-sm", children: "View All Workouts" })] })) : (_jsxs("div", { className: "text-center py-4", children: [_jsx(Activity, { className: "w-12 h-12 text-gray-400 mx-auto mb-3" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-4", children: "No workouts yet" }), _jsx("button", { onClick: (e) => {
                                        e.preventDefault();
                                        onNav?.('dashboard');
                                    }, className: "px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-sm", children: "Start Your First Workout" })] }))] })] }) }));
}
export default Sidebar;
