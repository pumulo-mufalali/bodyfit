import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { Trophy, Star, Zap, Award, Flame, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../providers/auth-provider';
import { workoutService } from '../lib/firebase-data-service';
import { getUserAchievements } from '../lib/firebase-achievement-service';
// Icon mapping
const iconMap = {
    Trophy,
    Star,
    Zap,
    Award,
    Flame,
    Target,
};
export default function AchievementsPage() {
    const { user } = useAuth();
    // Fetch workout logs
    const { data: workoutLogs = [] } = useQuery({
        queryKey: ['workouts', 'logs', user?.uid],
        queryFn: () => workoutService.getLogs(user.uid),
        enabled: !!user?.uid,
    });
    // Fetch achievements - depends on workout logs
    const { data: achievements = [], isLoading } = useQuery({
        queryKey: ['achievements', user?.uid, workoutLogs.length],
        queryFn: () => getUserAchievements(user.uid, workoutLogs),
        enabled: !!user?.uid,
    });
    if (isLoading) {
        return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex items-center justify-between mb-8", children: _jsx("h1", { className: "text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent", children: "My Achievements" }) }), _jsx("div", { className: "flex items-center justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600" }) })] }));
    }
    const IconComponent = (iconName) => iconMap[iconName] || Trophy;
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex items-center justify-between mb-8", children: _jsx("h1", { className: "text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent", children: "My Achievements" }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6", children: achievements.map((ach, index) => {
                    const Icon = IconComponent(ach.icon);
                    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: index * 0.1 }, className: `bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ${!ach.achieved ? 'opacity-75' : ''}`, children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: `p-4 rounded-2xl shadow-lg ${ach.achieved
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                            : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'}`, children: _jsx(Icon, { size: 28 }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h2", { className: "font-bold text-xl text-gray-900 dark:text-white mb-2", children: ach.title }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-3", children: ach.description }), ach.achieved && ach.achievedDate ? (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full" }), _jsxs("p", { className: "text-xs text-green-600 dark:text-green-400 font-medium", children: ["Unlocked on ", new Date(ach.achievedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })] })] })) : (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Progress" }), _jsxs("span", { className: "text-xs font-medium text-gray-700 dark:text-gray-300", children: [ach.progress, "%"] })] }), _jsx("div", { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2", children: _jsx(motion.div, { className: "bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full", initial: { width: 0 }, animate: { width: `${ach.progress}%` }, transition: { duration: 1, delay: index * 0.1 } }) })] }))] })] }), ach.achieved && ach.achievedDate && (_jsx("div", { className: "mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50", children: _jsxs("div", { className: "flex items-center justify-center space-x-2", children: [_jsx(Trophy, { className: "w-4 h-4 text-yellow-500" }), _jsx("span", { className: "text-sm font-medium text-yellow-600 dark:text-yellow-400", children: "Achievement Unlocked!" })] }) }))] }, ach.id));
                }) }), _jsx("div", { className: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 text-center", children: [_jsxs("div", { className: "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200/50 dark:border-green-700/50", children: [_jsx("div", { className: "text-2xl font-bold text-green-600 dark:text-green-400 mb-1", children: achievements.filter(a => a.achieved).length }), _jsx("div", { className: "text-sm text-green-700 dark:text-green-300 font-medium", children: "Achievements Unlocked" })] }), _jsxs("div", { className: "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1", children: achievements.filter(a => !a.achieved).length }), _jsx("div", { className: "text-sm text-blue-700 dark:text-blue-300 font-medium", children: "In Progress" })] }), _jsxs("div", { className: "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-yellow-200/50 dark:border-yellow-700/50", children: [_jsxs("div", { className: "text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1", children: [achievements.length > 0
                                            ? Math.round((achievements.filter(a => a.achieved).length / achievements.length) * 100)
                                            : 0, "%"] }), _jsx("div", { className: "text-sm text-yellow-700 dark:text-yellow-300 font-medium", children: "Completion Rate" })] })] }) })] }));
}
