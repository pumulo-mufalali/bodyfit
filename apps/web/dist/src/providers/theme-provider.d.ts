type Theme = "light" | "dark" | "system";
type ThemeContextValue = {
    theme: Theme;
    setTheme: (t: Theme) => void;
};
export declare function ThemeProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
declare const useTheme: () => ThemeContextValue;
export { useTheme };
