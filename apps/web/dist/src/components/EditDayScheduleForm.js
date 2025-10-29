import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
export default function EditDayScheduleForm({ day, initialItems, onClose, onSave }) {
    const [items, setItems] = useState(initialItems);
    const handleAddItem = () => {
        setItems([...items, { time: '', activity: '' }]);
    };
    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        const item = newItems[index];
        if (item) {
            item[field] = value;
            setItems(newItems);
        }
    };
    const handleRemoveItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate all items before saving
        const errors = [];
        items.forEach((item, index) => {
            if (!item.time || item.time.trim().length === 0) {
                errors.push(`Item ${index + 1}: Time is required`);
            }
            if (!item.activity || item.activity.trim().length === 0) {
                errors.push(`Item ${index + 1}: Activity is required`);
            }
            if (item.activity && item.activity.trim().length > 200) {
                errors.push(`Item ${index + 1}: Activity name must be less than 200 characters`);
            }
        });
        if (errors.length > 0) {
            alert(`Please fix the following errors:\n${errors.join('\n')}`);
            return;
        }
        // Filter out any items with empty time or activity as a safety measure
        const validItems = items.filter(item => item.time.trim().length > 0 && item.activity.trim().length > 0);
        onSave(validItems);
        onClose();
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black/90 z-50 flex items-center justify-center", children: _jsxs("div", { className: "bg-card rounded-xl p-6 shadow-lg w-full max-w-md", children: [_jsxs("h2", { className: "text-2xl font-bold mb-4", children: ["Edit Schedule for ", day] }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx("div", { className: "space-y-3 max-h-[60vh] overflow-y-auto pr-2", children: items.map((item, index) => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "text", placeholder: "Time", value: item.time, onChange: e => handleItemChange(index, 'time', e.target.value), className: "w-1/3 p-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700" }), _jsx("input", { type: "text", placeholder: "Activity", value: item.activity, onChange: e => handleItemChange(index, 'activity', e.target.value), className: "w-2/3 p-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700" }), _jsx("button", { type: "button", onClick: () => handleRemoveItem(index), className: "text-red-500", children: "\u2715" })] }, index))) }), _jsx("button", { type: "button", onClick: handleAddItem, className: "w-full text-sm py-2 px-2 mt-4 rounded bg-blue-500/20 hover:bg-blue-500/30 transition-colors", children: "+ Add Item" }), _jsxs("div", { className: "mt-6 flex justify-end space-x-4", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700", children: "Cancel" }), _jsx("button", { type: "submit", className: "px-4 py-2 rounded-md bg-blue-600 text-white", children: "Save Changes" })] })] })] }) }));
}
