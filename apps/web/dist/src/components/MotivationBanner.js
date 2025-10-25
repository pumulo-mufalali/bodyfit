import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function MotivationBanner({ quote = 'Push yourself because no one else is going to do it for you.' }) {
    return (_jsxs("div", { className: "bg-gradient-to-r from-indigo-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 shadow-sm", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Motivation of the day" }), _jsx("div", { className: "mt-2 text-lg font-semibold text-black dark:text-white", children: quote })] }));
}
