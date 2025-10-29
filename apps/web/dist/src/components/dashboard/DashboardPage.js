import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import HeaderBar from '../HeaderBar';
import ExerciseBrowser from '../exercises/ExerciseBrowser';
import TodaysSchedule from '../TodaysSchedule';
import WeightProgressSection from './WeightProgressSection';
import { MotivationCard } from '../MotivationCard';
export default function DashboardPage({ labels, weightData, units, onUpdateWeight, onNav, onOpenExercise }) {
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50", children: _jsx(HeaderBar, { title: "FITNESS TRACKER", onNav: onNav }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx(ExerciseBrowser, { onOpenExercise: onOpenExercise }) }), _jsx("div", { className: "lg:col-span-1", children: _jsx(TodaysSchedule, { onNav: onNav }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx(WeightProgressSection, { labels: labels, weightData: weightData, units: units, onUpdateWeight: onUpdateWeight }) }), _jsx("div", { className: "lg:col-span-1 space-y-6", children: _jsx(MotivationCard, {}) })] })] }));
}
