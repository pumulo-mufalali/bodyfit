import { Exercise } from '@myfitness/shared';
export interface WeightEntry {
    date: string;
    weight: number;
}
export interface WorkoutLog {
    id: string;
    date: string;
    exerciseId: string;
    durationMinutes: number;
    intensity: 'low' | 'medium' | 'high';
    caloriesBurned: number;
    notes?: string;
}
export declare const mockWeightHistory: WeightEntry[];
export declare const mockExercises: Exercise[];
export declare const mockWorkoutLogs: WorkoutLog[];
