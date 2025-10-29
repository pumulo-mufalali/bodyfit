import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../providers/auth-provider';
import EditDayScheduleForm from '../components/EditDayScheduleForm';
import { motion } from 'framer-motion';
import { Clock, Activity } from 'lucide-react';
import { getUserSchedule, updateUserSchedule } from '../lib/firebase-schedule-service';
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export default function SchedulePage() {
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
    const defaultSchedule = {
        id: 'weekly',
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
    };
    const currentSchedule = schedule || defaultSchedule;
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex items-center justify-between mb-8", children: _jsx("h1", { className: "text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "My Workout Schedule" }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: days.map((day, index) => {
                    const dayKey = day.toLowerCase();
                    const daySchedule = Array.isArray(currentSchedule[dayKey])
                        ? currentSchedule[dayKey]
                        : [];
                    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: index * 0.1 }, className: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 cursor-pointer hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300", onClick: () => setEditingDay(day), children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-white mb-2", children: day }), _jsx("div", { className: "w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto" })] }), _jsx("div", { className: "space-y-3 max-h-[400px] overflow-y-auto", children: daySchedule.length === 0 ? (_jsx("div", { className: "text-center py-4 text-gray-500 dark:text-gray-400 text-sm", children: "No activities scheduled" })) : (daySchedule.map((item, itemIndex) => (_jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3, delay: itemIndex * 0.1 }, className: "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 p-3 rounded-xl border border-gray-200/50 dark:border-gray-600/50 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200", children: _jsxs("div", { className: "flex flex-col gap-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "bg-blue-500/10 p-1.5 rounded-lg shrink-0", children: _jsx(Clock, { className: "w-3.5 h-3.5 text-blue-600 dark:text-blue-400" }) }), _jsx("span", { className: "text-xs font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap", children: item.time })] }), _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Activity, { className: "w-3.5 h-3.5 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" }), _jsx("span", { className: "font-semibold text-sm text-gray-800 dark:text-white break-words break-all line-clamp-2 leading-tight", children: item.activity })] })] }) }, itemIndex)))) }), _jsx("div", { className: "mt-4 text-center", children: _jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full", children: "Click to edit" }) })] }, day));
                }) }), editingDay && (_jsx(EditDayScheduleForm, { day: editingDay, initialItems: Array.isArray(currentSchedule[editingDay.toLowerCase()])
                    ? currentSchedule[editingDay.toLowerCase()]
                    : [], onClose: () => setEditingDay(null), onSave: (items) => handleSaveDay(editingDay, items) }))] }));
}
