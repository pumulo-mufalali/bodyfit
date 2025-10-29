import type { Exercise } from '../../lib/exercise-categories';
interface ExerciseGifModalProps {
    exercise: Exercise;
    onClose: () => void;
}
export default function ExerciseGifModal({ exercise, onClose }: ExerciseGifModalProps): import("react/jsx-runtime").JSX.Element;
export {};
