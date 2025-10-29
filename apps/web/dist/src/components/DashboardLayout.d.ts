export default function DashboardLayout({ onNav, onOpenGif, centerPage, }: {
    onNav?: (page: string) => void;
    onOpenGif?: (exerciseId: string) => void;
    centerPage?: 'dashboard' | 'goals' | 'gifs' | string;
}): import("react/jsx-runtime").JSX.Element;
