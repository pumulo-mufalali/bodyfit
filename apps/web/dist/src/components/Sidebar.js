import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const mockGoals = [
    {
        id: 'g1',
        title: 'Weight Loss',
        target: 70,
        current: 75,
        unit: 'kg',
        category: 'weight',
        deadline: '2025-12-31'
    },
    {
        id: 'g2',
        title: '5K Run Time',
        target: 25,
        current: 28,
        unit: 'min',
        category: 'cardio',
        deadline: '2025-11-30'
    },
    {
        id: 'g3',
        title: 'Push-ups',
        target: 50,
        current: 35,
        unit: 'reps',
        category: 'strength',
        deadline: '2025-11-15'
    }
];
const categoryColors = {
    weight: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
    strength: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
    cardio: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
    nutrition: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' }
};
const NavItem = ({ children, active, onClick }) => (_jsx("li", { children: _jsx("button", { className: `w-full text-left px-3 py-2 rounded-md transition ${active ? 'bg-blue-100 dark:bg-blue-900/30 font-semibold' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`, onClick: onClick, children: children }) }));
export function Sidebar({ profile, onNav }) {
    return (_jsx("aside", { className: "w-72 shrink-0 pr-4", children: _jsxs("div", { className: "sticky top-6 space-y-6", children: [_jsxs("div", { className: "bg-muted/80 dark:bg-muted/90 rounded-xl p-4 shadow-sm", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl font-semibold", children: profile?.name?.charAt(0) ?? 'U' }), _jsxs("div", { children: [_jsx("div", { className: "text-lg font-semibold text-black dark:text-white", children: profile?.name ?? 'User' }), _jsx("div", { className: "text-sm text-muted-foreground", children: profile?.age ? `${profile.age} years` : '—' })] })] }), _jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground", children: [_jsxs("div", { className: "bg-white/50 dark:bg-black/20 rounded-md p-2 text-center", children: [_jsx("div", { className: "text-xs", children: "Height" }), _jsx("div", { className: "font-medium", children: "185 cm" })] }), _jsxs("div", { className: "bg-white/50 dark:bg-black/20 rounded-md p-2 text-center", children: [_jsx("div", { className: "text-xs", children: "Weight" }), _jsxs("div", { className: "font-medium", children: [profile?.weightKg ?? '76', " kg"] })] })] })] }), _jsx("nav", { className: "bg-card rounded-xl p-4 shadow-sm", children: _jsxs("ul", { className: "space-y-1", children: [_jsx(NavItem, { onClick: () => onNav?.('dashboard'), children: "Home" }), _jsx(NavItem, { onClick: () => onNav?.('goals'), children: "My goals" }), _jsx(NavItem, { children: "Schedule" }), _jsx(NavItem, { children: "Achievements" }), _jsx(NavItem, { children: "Statistics" }), _jsx(NavItem, { children: "Settings" })] }) }), _jsxs("div", { className: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 shadow-sm text-sm", children: [_jsx("div", { className: "font-semibold", children: "CONGRATULATIONS!" }), _jsx("div", { className: "mt-2 text-muted-foreground", children: "You have unlocked the \"Expert\" level." })] })] }) }));
}
export default Sidebar;
