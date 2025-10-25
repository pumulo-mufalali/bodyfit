import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
export function StatCard({ title, main, sub, progress, gradientClass = 'from-cyan-400 to-blue-500', icon, onOpen }) {
    const progressPct = progress ? Math.round((progress.value / Math.max(1, progress.total)) * 100) : 0;
    const radius = 32;
    const stroke = 6;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const offset = progress ? circumference * (1 - progress.value / Math.max(1, progress.total)) : circumference;
    return (_jsx(motion.div, { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45 }, className: "rounded-2xl p-4 shadow-md text-black dark:text-white", style: { background: undefined }, children: _jsxs("div", { className: `p-4 rounded-2xl bg-gradient-to-br ${gradientClass} text-white`, children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-sm font-medium", children: title }), _jsx("div", { className: "text-2xl font-bold", children: main }), sub && _jsx("div", { className: "text-sm opacity-90", children: sub })] }), _jsx("div", { className: "ml-4", children: icon })] }), progress && (_jsxs("div", { className: "mt-4 flex items-center", children: [_jsxs("button", { onClick: onOpen, "aria-label": `Open ${title} details`, className: "relative w-20 h-20 p-0 m-0 bg-transparent border-0", children: [_jsxs("svg", { className: "w-20 h-20", viewBox: `0 0 ${radius * 2} ${radius * 2}`, children: [_jsx("circle", { cx: radius, cy: radius, r: normalizedRadius, stroke: "rgba(255,255,255,0.25)", strokeWidth: stroke, fill: "none" }), _jsx(motion.circle, { cx: radius, cy: radius, r: normalizedRadius, stroke: "white", strokeWidth: stroke, strokeLinecap: "round", fill: "none", strokeDasharray: circumference, strokeDashoffset: circumference, animate: { strokeDashoffset: offset }, transition: { duration: 0.8, ease: 'easeOut' } })] }), _jsxs("div", { className: "absolute inset-0 flex items-center justify-center text-sm font-semibold pointer-events-none", children: [progress.value, "/", progress.total] })] }), _jsx("div", { className: "ml-4 text-sm opacity-90", children: sub })] }))] }) }));
}
export default StatCard;
