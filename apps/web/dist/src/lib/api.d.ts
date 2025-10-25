import { UserSchema } from "@myfitness/shared";
import { z } from "zod";
import { WeightEntry, WorkoutLog } from "./mock-data";
type User = z.infer<typeof UserSchema>;
export declare const api: {
    user: {
        getProfile: () => Promise<User>;
        updateProfile: (input: Partial<User>) => Promise<User>;
    };
    weight: {
        getHistory: () => Promise<WeightEntry[]>;
        addEntry: (weight: number) => Promise<WeightEntry[]>;
    };
    workouts: {
        getExercises: () => Promise<{
            name: string;
            id: string;
            description: string;
            category: "cardio" | "strength" | "stretching" | "full_body";
            imageUrl: string;
        }[]>;
        getLogs: () => Promise<WorkoutLog[]>;
        logWorkout: (log: Omit<WorkoutLog, "id">) => Promise<WorkoutLog>;
    };
};
export {};
