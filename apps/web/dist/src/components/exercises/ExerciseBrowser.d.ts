import { type Exercise } from '../../lib/exercise-categories';
interface ExerciseBrowserProps {
    onOpenExercise?: (exercise: Exercise) => void;
}
export default function ExerciseBrowser({ onOpenExercise }: ExerciseBrowserProps): import("react/jsx-runtime").JSX.Element;
export {};
