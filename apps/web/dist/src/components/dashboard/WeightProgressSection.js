import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import StatsChart from '../StatsChart';
import { getWeightUnit } from '../../lib/unit-conversion';
export default function WeightProgressSection({ labels, weightData, units, onUpdateWeight }) {
    return (_jsxs("div", { className: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: ["Weight progress for 3 months (", getWeightUnit(units), ")"] }), _jsx("button", { onClick: onUpdateWeight, className: "text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors", children: "Update weight \u2192" })] }), _jsx(StatsChart, { labels: labels, weightData: weightData, units: units })] }));
}
