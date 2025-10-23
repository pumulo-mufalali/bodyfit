import { z } from "zod";
export declare const ThemeEnum: z.ZodEnum<["light", "dark", "system"]>;
export declare const UserSchema: z.ZodObject<{
    uid: z.ZodString;
    name: z.ZodString;
    age: z.ZodNumber;
    weightKg: z.ZodNumber;
    fitnessGoal: z.ZodOptional<z.ZodString>;
    theme: z.ZodDefault<z.ZodEnum<["light", "dark", "system"]>>;
}, "strip", z.ZodTypeAny, {
    uid: string;
    name: string;
    age: number;
    weightKg: number;
    theme: "light" | "dark" | "system";
    fitnessGoal?: string | undefined;
}, {
    uid: string;
    name: string;
    age: number;
    weightKg: number;
    fitnessGoal?: string | undefined;
    theme?: "light" | "dark" | "system" | undefined;
}>;
export declare const ExerciseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    category: z.ZodEnum<["cardio", "strength", "stretching", "full_body"]>;
    imageUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    description: string;
    category: "cardio" | "strength" | "stretching" | "full_body";
    imageUrl: string;
}, {
    name: string;
    id: string;
    description: string;
    category: "cardio" | "strength" | "stretching" | "full_body";
    imageUrl: string;
}>;
export declare const LogEntryInputSchema: z.ZodObject<{
    workoutId: z.ZodString;
    durationSeconds: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
    date: z.ZodDefault<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    date: Date;
    workoutId: string;
    durationSeconds: number;
    notes?: string | undefined;
}, {
    workoutId: string;
    durationSeconds: number;
    date?: Date | undefined;
    notes?: string | undefined;
}>;
export type User = z.infer<typeof UserSchema>;
export type Exercise = z.infer<typeof ExerciseSchema>;
export type LogEntryInput = z.infer<typeof LogEntryInputSchema>;
//# sourceMappingURL=schemas.d.ts.map