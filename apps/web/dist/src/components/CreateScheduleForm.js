import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export default function CreateScheduleForm({ onClose, onSave }) {
    const [schedule, setSchedule] = useState({
        monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: []
    });
    const handleAddItem = (day) => {
        const dayKey = day.toLowerCase();
        setSchedule(prev => ({ ...prev, [dayKey]: [...(prev[dayKey] || []), { time: '', activity: '' }] }));
    };
    const handleItemChange = (day, index, field, value) => {
        const dayKey = day.toLowerCase();
        const items = schedule[dayKey] || [];
        setSchedule(prev => ({
            ...prev,
            [dayKey]: items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
        }));
    };
    const handleRemoveItem = (day, index) => {
        const dayKey = day.toLowerCase();
        setSchedule(prev => ({
            ...prev,
            [dayKey]: (prev[dayKey] || []).filter((_, i) => i !== index),
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate all schedule items
        const errors = [];
        Object.entries(schedule).forEach(([day, items]) => {
            items.forEach((item, index) => {
                if (!item.time || item.time.trim().length === 0) {
                    errors.push(`${day.charAt(0).toUpperCase() + day.slice(1)}, Item ${index + 1}: Time is required`);
                }
                if (!item.activity || item.activity.trim().length === 0) {
                    errors.push(`${day.charAt(0).toUpperCase() + day.slice(1)}, Item ${index + 1}: Activity is required`);
                }
                if (item.activity && item.activity.trim().length > 200) {
                    errors.push(`${day.charAt(0).toUpperCase() + day.slice(1)}, Item ${index + 1}: Activity name must be less than 200 characters`);
                }
            });
        });
        if (errors.length > 0) {
            alert(`Please fix the following errors:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n... and ${errors.length - 5} more errors` : ''}`);
            return;
        }
        // Filter out invalid items before saving
        const validSchedule = {};
        Object.entries(schedule).forEach(([day, items]) => {
            validSchedule[day] = items.filter(item => item.time.trim().length > 0 && item.activity.trim().length > 0);
        });
        onSave(validSchedule);
        onClose();
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black/90 z-50 flex items-center justify-center", children: _jsxs("div", { className: "bg-card rounded-xl p-6 shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Create Weekly Schedule" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: days.map(day => (_jsxs("div", { className: "bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg", children: [_jsx("h3", { className: "font-bold text-lg mb-2", children: day }), (schedule[day.toLowerCase()] || []).map((item, index) => (_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx("input", { type: "text", placeholder: "Time", value: item.time, onChange: e => handleItemChange(day, index, 'time', e.target.value), className: "w-1/3 p-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700" }), _jsx("input", { type: "text", placeholder: "Activity", value: item.activity, onChange: e => handleItemChange(day, index, 'activity', e.target.value), className: "w-2/3 p-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700" }), _jsx("button", { type: "button", onClick: () => handleRemoveItem(day, index), className: "text-red-500", children: "\u2715" })] }, index))), _jsx("button", { type: "button", onClick: () => handleAddItem(day), className: "w-full text-sm py-1 px-2 rounded bg-blue-500/20 hover:bg-blue-500/30 transition-colors", children: "+ Add Item" })] }, day))) }), _jsxs("div", { className: "mt-6 flex justify-end space-x-4", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700", children: "Cancel" }), _jsx("button", { type: "submit", className: "px-4 py-2 rounded-md bg-blue-600 text-white", children: "Save Schedule" })] })] })] }) }));
}
