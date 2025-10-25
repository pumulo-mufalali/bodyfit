import { jsx as _jsx } from "react/jsx-runtime";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
export default function StatsChart({ labels, datasets }) {
    const data = {
        labels,
        datasets: datasets ?? [
            {
                label: 'Exercise',
                data: labels.map((_, i) => Math.round(Math.sin(i / 4) * 10 + 20)),
                borderColor: 'rgba(59,130,246,1)',
                backgroundColor: 'rgba(59,130,246,0.15)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Meals',
                data: labels.map((_, i) => Math.round(Math.cos(i / 6) * 8 + 14)),
                borderColor: 'rgba(239,68,68,1)',
                backgroundColor: 'rgba(239,68,68,0.12)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Sleep',
                data: labels.map((_, i) => Math.round(6 + Math.abs(Math.sin(i / 8)) * 2)),
                borderColor: 'rgba(16,185,129,1)',
                backgroundColor: 'rgba(16,185,129,0.12)',
                tension: 0.4,
                fill: true,
            },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' },
        },
        scales: {
            x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } },
            y: { grid: { color: 'rgba(0,0,0,0.05)' } },
        },
    };
    return (_jsx("div", { className: "bg-card rounded-xl p-4 shadow-sm aspect-[4/3]", children: _jsx("div", { className: "h-full", children: _jsx(Line, { data: data, options: options }) }) }));
}
