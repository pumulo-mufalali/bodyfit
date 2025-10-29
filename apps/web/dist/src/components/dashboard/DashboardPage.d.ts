import type { Exercise } from '../../lib/exercise-categories';
interface DashboardPageProps {
    labels: string[];
    weightData: {
        week: string;
        weight: number;
    }[];
    units: 'metric' | 'imperial';
    onUpdateWeight: () => void;
    onNav?: (page: string) => void;
    onOpenExercise?: (exercise: Exercise) => void;
}
export default function DashboardPage({ labels, weightData, units, onUpdateWeight, onNav, onOpenExercise }: DashboardPageProps): import("react/jsx-runtime").JSX.Element;
export {};
