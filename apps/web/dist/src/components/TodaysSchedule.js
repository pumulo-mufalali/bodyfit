import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../providers/auth-provider';
import { getUserSchedule, updateUserSchedule } from '../lib/firebase-schedule-service';
import { Clock, Activity, Calendar } from 'lucide-react';
export default function TodaysSchedule({ onNav }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [editingDay, setEditingDay] = useState(null);
    // Fetch schedule from Firebase
    const { data: schedule, isLoading } = useQuery({
        queryKey: ['schedule', user?.uid],
        queryFn: () => getUserSchedule(user.uid),
        enabled: !!user?.uid,
    });
    // Update schedule mutation
    const updateScheduleMutation = useMutation({
        mutationFn: (scheduleData) => updateUserSchedule(user.uid, scheduleData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedule', user?.uid] });
        },
    });
    const handleSaveDay = (day, items) => {
        const dayKey = day.toLowerCase();
        updateScheduleMutation.mutate({ [dayKey]: items });
        setEditingDay(null);
    };
    // Get today's day name
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayKey = today.toLowerCase();
    const todaySchedule = schedule?.[todayKey] || [];
    if (isLoading) {
        return (_jsxs("div", { className: "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 h-full", children: [_jsx("div", { className: "text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6", children: "Today's Schedule" }), _jsx("div", { className: "flex items-center justify-center py-8", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }) })] }));
    }
    return (_jsxs("div", { className: "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 h-full", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { children: _jsx("div", { className: "text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "Today's Schedule" }) }), _jsxs("button", { onClick: (e) => {
                            e.preventDefault();
                            onNav?.('schedule');
                        }, className: "text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors flex items-center gap-1", children: [_jsx(Calendar, { className: "w-4 h-4" }), "View All"] })] }), _jsx("div", { className: "space-y-4", children: todaySchedule.length === 0 ? (_jsxs("div", { className: "text-center py-8", children: [_jsx("div", { className: "w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Calendar, { className: "w-8 h-8 text-gray-400" }) }), _jsx("p", { className: "text-gray-500 dark:text-gray-400 text-sm mb-4", children: "No activities scheduled for today" }), _jsx("button", { onClick: (e) => {
                                e.preventDefault();
                                onNav?.('schedule');
                            }, className: "px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5", children: "Create Schedule" })] })) : (Array.isArray(todaySchedule) && todaySchedule.map((item, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: index * 0.1 }, className: "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50 hover:shadow-lg transition-all duration-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "bg-blue-500/10 p-2 rounded-lg", children: _jsx(Clock, { className: "w-4 h-4 text-blue-600 dark:text-blue-400" }) }), _jsx("span", { className: "text-sm font-medium text-gray-600 dark:text-gray-300", children: item.time })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Activity, { className: "w-4 h-4 text-purple-600 dark:text-purple-400" }), _jsx("span", { className: "font-semibold text-sm text-gray-800 dark:text-white", children: item.activity })] })] }) }, index)))) }), todaySchedule.length > 0 && (_jsx("div", { className: "mt-6 pt-4 border-t border-gray-200 dark:border-gray-700" })), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-4 font-medium text-center", children: today })] }));
}
