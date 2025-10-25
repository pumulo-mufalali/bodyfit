import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import Sidebar from './Sidebar';
import HeaderBar from './HeaderBar';
import StatCard from './StatCard';
import StatsChart from './StatsChart';
import MotivationBanner from './MotivationBanner';
import ProgressModal from './ProgressModal';
import { mockWorkoutLogs } from '../lib/mock-data';
// Helper to get last N days data
const getLastNDaysData = (days) => {
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        // Mock some consistent but random-looking data based on the date
        const value = Math.round(20 + Math.sin(date.getDate() / 3) * 5);
        result.push({ date: date.toISOString().split('T')[0], value });
    }
    return result;
};
export default function DashboardLayout({ profile, onNav, onOpenGif, }) {
    const labels = Array.from({ length: 12 }).map((_, i) => `W${i + 1}`);
    const [modalStat, setModalStat] = React.useState(null);
    return (_jsx("div", { className: "min-h-screen bg-slate-50 dark:bg-neutral-900 text-black dark:text-white", children: _jsxs("div", { className: "container mx-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-6", children: [_jsx("div", { className: "lg:col-span-3", children: _jsx(Sidebar, { profile: profile, onNav: onNav }) }), _jsxs("div", { className: "lg:col-span-9 space-y-6", children: [_jsx("div", { className: "bg-card rounded-xl p-4 shadow-sm", children: _jsx(HeaderBar, { title: "TRACK FITNESS", weekLine: "Day 2, Week 6 \u2014 7th June, 2018" }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [_jsx("div", { className: "lg:col-span-2", children: _jsxs("div", { className: "bg-card rounded-xl p-4 shadow-sm", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Goal" }), _jsx("div", { className: "text-2xl font-bold", children: "Build Muscles" })] }) }), _jsxs("div", { className: "mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsx(StatCard, { title: "Exercises", main: `${mockWorkoutLogs.length} Exercises`, sub: `${mockWorkoutLogs.reduce((acc, log) => acc + log.durationMinutes, 0)} mins`, progress: { value: mockWorkoutLogs.length, total: 10 }, gradientClass: "from-cyan-400 to-blue-500", onOpen: () => setModalStat({
                                                            title: 'Exercises',
                                                            progress: { value: mockWorkoutLogs.length, total: 10 },
                                                            data: mockWorkoutLogs,
                                                            isExercise: true
                                                        }) }), _jsx(StatCard, { title: "Meals", main: "6 Meals", sub: "1604 cal", progress: { value: 4, total: 6 }, gradientClass: "from-orange-400 to-pink-500", onOpen: () => setModalStat({
                                                            title: 'Meals',
                                                            progress: { value: 4, total: 6 },
                                                            data: Array.from({ length: 7 }, (_, i) => ({
                                                                date: (new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
                                                                value: Math.round(Math.random() * 500 + 1200)
                                                            }))
                                                        }) }), _jsx(StatCard, { title: "Sleep", main: "8 hours", sub: "Good quality", progress: { value: 8, total: 8 }, gradientClass: "from-green-400 to-teal-400", onOpen: () => setModalStat({
                                                            title: 'Sleep',
                                                            progress: { value: 8, total: 8 },
                                                            data: Array.from({ length: 7 }, (_, i) => ({
                                                                date: (new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
                                                                value: Math.round(Math.random() * 2 + 6)
                                                            }))
                                                        }) })] })] }) }), _jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "bg-card rounded-xl p-4 shadow-sm h-full", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Quick Actions" }), _jsxs("div", { className: "mt-4 space-y-3", children: [_jsx("button", { className: "w-full rounded-md px-3 py-2 bg-white/80 dark:bg-gray-800", children: "Log workout" }), _jsx("button", { className: "w-full rounded-md px-3 py-2 bg-white/80 dark:bg-gray-800", children: "Add meal" })] })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsxs("div", { className: "bg-card rounded-xl p-4 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: "text-sm font-medium", children: "Statistics \u2014 Last Month" }), _jsx("a", { className: "text-sm text-blue-600", children: "Detailed View" })] }), _jsx(StatsChart, { labels: labels }), _jsxs("div", { className: "mt-3 flex space-x-2", children: [_jsx("span", { className: "px-3 py-1 rounded-full bg-blue-100 text-blue-700", children: "Exercise" }), _jsx("span", { className: "px-3 py-1 rounded-full bg-red-100 text-red-700", children: "Meals" }), _jsx("span", { className: "px-3 py-1 rounded-full bg-green-100 text-green-700", children: "Sleep" })] })] }) }), _jsxs("div", { className: "lg:col-span-1 space-y-4", children: [_jsx(MotivationBanner, {}), _jsx("div", { className: "bg-card rounded-xl p-4 shadow-sm", children: "Other widgets" })] })] }), modalStat && (_jsx(ProgressModal, { open: Boolean(modalStat), title: modalStat.title, progress: modalStat.progress, data: modalStat.data, isExercise: modalStat.isExercise, onClose: () => setModalStat(null), onOpenGif: (id) => { setModalStat(null); onOpenGif?.(id); } }))] })] }) }));
}
