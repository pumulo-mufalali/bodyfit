import type { WorkoutLog } from "../lib/mock-data";
interface ProgressSummaryProps {
    workouts: WorkoutLog[];
    weightChange: number;
}
export declare function ProgressSummary({ workouts, weightChange }: ProgressSummaryProps): import("react/jsx-runtime").JSX.Element;
export {};
