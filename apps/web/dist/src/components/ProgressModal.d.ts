import type { WorkoutLog } from '../lib/mock-data';
export default function ProgressModal({ open, title, progress, data, isExercise, onClose, onOpenGif, }: {
    open: boolean;
    title: string;
    progress?: {
        value: number;
        total: number;
    } | null;
    data?: {
        date: string;
        value: number;
    }[] | WorkoutLog[];
    isExercise?: boolean;
    onClose: () => void;
    onOpenGif?: (exerciseId: string) => void;
}): import("react/jsx-runtime").JSX.Element | null;
