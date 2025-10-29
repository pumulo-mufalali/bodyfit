import type { WorkoutLog } from './mock-data';
export interface WeightEntry {
    id: string;
    date: string;
    weight: number;
}
export declare const weightService: {
    getHistory(userId: string): Promise<WeightEntry[]>;
    addEntry(userId: string, weight: number): Promise<WeightEntry[]>;
};
export declare const workoutService: {
    getLogs(userId: string): Promise<WorkoutLog[]>;
    logWorkout(userId: string, data: Omit<WorkoutLog, "id">): Promise<WorkoutLog[]>;
};
export declare const exerciseService: {
    getExercises(): Promise<never[]>;
};
