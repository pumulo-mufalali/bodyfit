import { useTheme } from "../providers/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const label = `Theme: ${theme} → ${next}`;

  return (
    <button
      aria-label={label}
      title={label}
      className="px-3 py-1 rounded border hover:bg-neutral-100 dark:hover:bg-neutral-800"
      onClick={() => setTheme(next as any)}
    >
      {label}
    </button>
  );
}


