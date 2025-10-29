import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTheme } from "../providers/theme-provider";
export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const nextTheme = theme === "dark" ? "light" : "dark"; // Simplified to just light/dark toggle
    const label = `Switch to ${nextTheme} theme`;
    return (_jsxs("button", { "aria-label": label, title: label, className: "w-full flex items-center justify-between px-3 py-2 rounded-md transition hover:bg-gray-100 dark:hover:bg-gray-800", onClick: () => setTheme(nextTheme), children: [_jsxs("span", { className: "flex items-center gap-2", children: [theme === 'dark' ? (_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" }) })) : (_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" }) })), "Switch theme"] }), _jsx("span", { className: "text-xs text-muted-foreground capitalize", children: theme })] }));
}
