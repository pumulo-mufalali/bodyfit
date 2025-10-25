import type { User } from '@myfitness/shared';
export default function DashboardLayout({ profile, onNav, onOpenGif, }: {
    profile?: User | null;
    onNav?: (page: string) => void;
    onOpenGif?: (exerciseId: string) => void;
}): import("react/jsx-runtime").JSX.Element;
