import type { Exercise, WorkoutLog } from "../lib/mock-data";
interface RecentWorkoutsProps {
    workouts: WorkoutLog[];
    exercises: Exercise[];
}
export declare function RecentWorkouts({ workouts, exercises }: RecentWorkoutsProps): import("react/jsx-runtime").JSX.Element;
export {};
