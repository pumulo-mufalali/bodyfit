import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend, ArcElement, } from 'chart.js';
import { mockExercises } from '../lib/mock-data';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend, ArcElement);
const getLastNDays = (n) => {
    const result = [];
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        result.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return result;
};
const categoryColors = {
    cardio: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
    strength: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
    stretching: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
    full_body: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
};
const intensityColors = {
    low: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-300',
        ring: 'ring-green-500/20'
    },
    medium: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-300',
        ring: 'ring-yellow-500/20'
    },
    high: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-300',
        ring: 'ring-red-500/20'
    },
};
export default function ProgressModal({ open, title, progress, data, isExercise, onClose, onOpenGif, }) {
    if (!open)
        return null;
    const pct = progress ? Math.round((progress.value / Math.max(1, progress.total)) * 100) : 0;
    const labels = getLastNDays(7);
    // Process exercise data
    const exerciseData = React.useMemo(() => {
        if (!isExercise || !data)
            return null;
        const logs = data.map(log => ({
            ...log,
            exercise: mockExercises.find(ex => ex.id === log.exerciseId)
        }));
        const byCategory = logs.reduce((acc, log) => {
            const category = log.exercise?.category || 'other';
            acc[category] = (acc[category] || 0) + (log.durationMinutes ?? 0);
            return acc;
        }, {});
        return {
            logs,
            categories: byCategory
        };
    }, [data, isExercise]);
    // selected exercise id for showing a main GIF / focus
    const [selectedExerciseId, setSelectedExerciseId] = React.useState(null);
    React.useEffect(() => {
        if (exerciseData && exerciseData.logs.length > 0) {
            // default to the most recent exercise's exercise id
            setSelectedExerciseId(exerciseData.logs[0].exercise?.id ?? null);
        }
        else {
            setSelectedExerciseId(null);
        }
    }, [exerciseData]);
    const chartData = {
        labels,
        datasets: [
            {
                label: title,
                data: isExercise
                    ? labels.map(label => {
                        const dayLogs = data.filter((log) => (log.date ?? '').includes(label.split(' ')[1] ?? '')) || [];
                        return dayLogs.reduce((sum, log) => sum + (log.durationMinutes ?? 0), 0);
                    })
                    : data?.slice(-7).map(d => d.value) ?? labels.map(() => Math.round(Math.random() * 50 + 50)),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.3,
                fill: true,
            },
        ],
    };
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 750,
            easing: 'easeInOutQuart'
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgb(17 24 39 / 0.8)',
                titleColor: 'rgb(243 244 246)',
                bodyColor: 'rgb(243 244 246)',
                borderColor: 'rgb(75 85 99)',
                borderWidth: 1,
            },
        },
        scales: {
            y: {
                beginAtZero: false,
                grid: {
                    color: 'rgba(107, 114, 128, 0.1)',
                },
                ticks: {
                    color: '#666',
                    font: { size: 11 },
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#666',
                    font: { size: 11 },
                },
            },
        },
    };
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/40", onClick: onClose }), _jsxs(motion.div, { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.25 }, className: "relative z-10 w-full max-w-lg bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-black dark:text-white", children: title }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Detailed progress" })] }), _jsx("button", { onClick: onClose, className: "text-muted-foreground hover:text-black dark:hover:text-white", children: "\u2715" })] }), isExercise && exerciseData && ((() => {
                        const logs = exerciseData.logs ?? [];
                        return (_jsxs("div", { className: "mt-6 grid grid-cols-1 gap-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Exercises" }), _jsxs("div", { className: "text-2xl font-bold", children: [logs.length, " Workouts"] })] }), _jsx("div", { className: "w-28 h-28 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 flex items-center justify-center", children: selectedExerciseId ? (_jsx("img", { src: logs.find(l => l.exercise?.id === selectedExerciseId)?.exercise?.imageUrl, alt: "exercise gif", className: "w-full h-full object-cover" })) : (_jsx("div", { className: "text-sm text-muted-foreground", children: "No image" })) })] }), _jsx("div", { className: "grid grid-cols-3 gap-3", children: logs.map((log) => (_jsx("button", { onClick: () => {
                                            const exId = log.exercise?.id ?? null;
                                            if (exId && onOpenGif) {
                                                onOpenGif(exId);
                                            }
                                            else {
                                                setSelectedExerciseId(log.exercise?.id ?? null);
                                            }
                                        }, className: `rounded-lg overflow-hidden border ${selectedExerciseId === log.exercise?.id ? 'ring-2 ring-blue-400' : 'border-transparent'}`, title: `${log.exercise?.name} • ${log.durationMinutes} mins`, children: _jsx("img", { src: log.exercise?.imageUrl, alt: log.exercise?.name, className: "w-full h-20 object-cover" }) }, log.id))) })] }));
                    })()), _jsxs("div", { className: "mt-6 grid grid-cols-1 gap-6", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "w-28 h-28 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold", children: [pct, "%"] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Progress" }), _jsxs("div", { className: "text-xl font-semibold", children: [progress?.value ?? 0, "/", progress?.total ?? 0] }), _jsx("div", { className: "text-sm text-muted-foreground mt-1", children: progress?.total && progress?.value
                                                    ? `${progress.total - progress.value} remaining`
                                                    : 'No target set' })] })] }), isExercise && exerciseData && (_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "font-medium", children: "Exercise Categories" }), _jsx("div", { className: "space-y-2", children: Object.entries(exerciseData.categories).map(([category, duration]) => (_jsxs("div", { className: `flex items-center justify-between p-2 rounded-lg ${categoryColors[category]?.bg || 'bg-gray-100'}`, children: [_jsx("span", { className: `capitalize ${categoryColors[category]?.text || 'text-gray-700'}`, children: category }), _jsxs("span", { className: "font-medium", children: [duration, "min"] })] }, category))) })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "font-medium", children: "Exercise Distribution" }), _jsx("div", { className: "h-48", children: _jsx(Doughnut, { data: {
                                                        labels: Object.keys(exerciseData.categories).map(c => c.charAt(0).toUpperCase() + c.slice(1)),
                                                        datasets: [{
                                                                data: Object.values(exerciseData.categories),
                                                                backgroundColor: ['#3B82F6', '#EF4444', '#10B981', '#8B5CF6'],
                                                                borderWidth: 0,
                                                            }],
                                                    }, options: {
                                                        plugins: {
                                                            legend: {
                                                                position: 'bottom',
                                                                labels: { boxWidth: 10, padding: 10 },
                                                            },
                                                        },
                                                    } }) })] })] })), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h4", { className: "font-medium", children: "Progress History" }), _jsxs("select", { className: "text-sm bg-transparent border-gray-200 dark:border-gray-700 rounded-md", children: [_jsx("option", { children: "Last 7 days" }), _jsx("option", { children: "Last 30 days" }), _jsx("option", { children: "Last 3 months" })] })] }), _jsx("div", { className: "h-64", children: _jsx(Line, { data: chartData, options: chartOptions }) })] }), isExercise && exerciseData ? (() => {
                                const logs = exerciseData.logs ?? [];
                                const totalCalories = logs.reduce((sum, log) => sum + (log.caloriesBurned ?? 0), 0);
                                const avgDuration = logs.length ? Math.round(logs.reduce((sum, log) => sum + (log.durationMinutes ?? 0), 0) / logs.length) : 0;
                                return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg text-center", children: [_jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Total Calories" }), _jsx("div", { className: "text-2xl font-bold", children: totalCalories }), _jsx("div", { className: "text-sm text-muted-foreground", children: "kcal burned" })] }), _jsxs("div", { className: "bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg text-center", children: [_jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Avg. Duration" }), _jsx("div", { className: "text-2xl font-bold", children: avgDuration }), _jsx("div", { className: "text-sm text-muted-foreground", children: "mins/session" })] }), _jsxs("div", { className: "bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg text-center", children: [_jsx("div", { className: "text-sm text-muted-foreground mb-1", children: "Intensity Split" }), _jsx("div", { className: "flex justify-center items-center gap-1 mt-2", children: ['low', 'medium', 'high'].map(level => {
                                                                const count = logs.filter((log) => (log.intensity === level)).length;
                                                                return (_jsx("div", { className: `h-8 w-3 rounded-full ${intensityColors[level].bg} ${count > 0 ? 'opacity-100' : 'opacity-30'}`, style: { height: `${logs.length ? (count / logs.length) * 32 : 0}px` } }, level));
                                                            }) })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "font-medium", children: "Recent Workouts" }), _jsx("div", { className: "space-y-3", children: logs.slice(0, 3).map((log) => (_jsx("div", { className: "bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "font-medium", children: log.exercise?.name || 'Unknown Exercise' }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `text-xs px-2 py-0.5 rounded-full ${intensityColors[log.intensity].bg} ${intensityColors[log.intensity].text}`, children: log.intensity?.charAt(0).toUpperCase() + (log.intensity?.slice(1) ?? '') }), _jsx("span", { className: "text-sm text-muted-foreground", children: new Date(log.date ?? '').toLocaleDateString() })] })] }), _jsxs("div", { className: "text-right space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2 justify-end", children: [_jsxs("span", { className: "font-medium", children: [log.durationMinutes, " mins"] }), _jsx("span", { className: "text-sm text-muted-foreground", children: "\u2022" }), _jsxs("span", { className: "font-medium", children: [log.caloriesBurned, " kcal"] })] }), log.notes && (_jsx("div", { className: "text-sm text-muted-foreground italic", children: log.notes }))] })] }) }, log.id))) })] })] }));
                            })() : (_jsxs("div", { className: "grid grid-cols-3 gap-4 text-center", children: [_jsxs("div", { className: "bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Average" }), _jsx("div", { className: "font-semibold mt-1", children: data
                                                    ? Math.round(data.reduce((acc, curr) => acc + curr.value, 0) / data.length)
                                                    : '-' })] }), _jsxs("div", { className: "bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Best" }), _jsx("div", { className: "font-semibold mt-1", children: data
                                                    ? Math.max(...data.map((d) => d.value))
                                                    : '-' })] }), _jsxs("div", { className: "bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Recent" }), _jsx("div", { className: "font-semibold mt-1", children: data
                                                    ? data[data.length - 1].value
                                                    : '-' })] })] }))] })] })] }));
}
