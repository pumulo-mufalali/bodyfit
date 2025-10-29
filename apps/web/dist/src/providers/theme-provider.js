import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
const ThemeContext = createContext(undefined);
export function ThemeProvider({ children }) {
    // Initialize theme before first render
    const [theme, setTheme] = useState(() => {
        if (typeof window === 'undefined')
            return 'light';
        const saved = localStorage.getItem("theme");
        const root = document.documentElement;
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const isDark = saved === "dark" || (saved === "system" && prefersDark);
        root.classList.toggle("dark", isDark);
        return saved || "light";
    });
    useEffect(() => {
        localStorage.setItem("theme", theme);
        const root = document.documentElement;
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const isDark = theme === "dark" || (theme === "system" && prefersDark);
        root.classList.toggle("dark", isDark);
    }, [theme]);
    const value = useMemo(() => ({ theme, setTheme }), [theme]);
    return _jsx(ThemeContext.Provider, { value: value, children: children });
}
const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx)
        throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
};
export { useTheme };
