import { jsx as _jsx } from "react/jsx-runtime";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getWeightUnit } from '../lib/unit-conversion';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
export default function StatsChart({ labels, datasets, weightData, units = 'metric' }) {
    const weightUnit = getWeightUnit(units);
    const data = {
        labels: weightData ? weightData.map(d => d.week) : labels,
        datasets: weightData ? [
            {
                label: `Weight (${weightUnit})`,
                data: weightData.map(d => d.weight),
                borderColor: 'rgba(34, 197, 94, 1)',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgba(34, 197, 94, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
            },
        ] : (datasets ?? [
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
        ]),
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: weightData ? '#22c55e' : undefined,
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#22c55e',
                borderWidth: 1,
                callbacks: weightData ? {
                    label: function (context) {
                        return `Weight: ${context.parsed.y} ${weightUnit}`;
                    }
                } : undefined
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { maxTicksLimit: 12 },
                title: {
                    display: weightData ? true : false,
                    text: weightData ? 'Week of 3 Months' : undefined,
                    color: '#666',
                    font: { size: 12 }
                }
            },
            y: {
                grid: { color: 'rgba(0,0,0,0.05)' },
                title: {
                    display: weightData ? true : false,
                    text: weightData ? `Weight (${weightUnit})` : undefined,
                    color: '#666',
                    font: { size: 12 }
                },
                ticks: weightData ? {
                    callback: function (value) {
                        return value + ` ${weightUnit}`;
                    },
                    stepSize: 5,
                    min: 20,
                    max: undefined
                } : undefined,
                min: weightData ? 20 : undefined
            },
        },
    };
    return (_jsx("div", { className: "bg-card rounded-xl p-4 shadow-sm aspect-[4/3]", children: _jsx("div", { className: "h-full", children: _jsx(Line, { data: data, options: options }) }) }));
}
