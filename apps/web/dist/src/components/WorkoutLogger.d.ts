import type { Exercise } from "../lib/mock-data";
interface WorkoutLoggerProps {
    exercises: Exercise[];
    onLogWorkout: (exerciseId: string, duration: number, notes?: string) => void;
    isLogging: boolean;
}
export declare function WorkoutLogger({ exercises, onLogWorkout, isLogging }: WorkoutLoggerProps): import("react/jsx-runtime").JSX.Element;
export {};
