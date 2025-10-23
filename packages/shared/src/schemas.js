import { z } from "zod";
export const ThemeEnum = z.enum(["light", "dark", "system"]);
export const UserSchema = z.object({
    uid: z.string(),
    name: z.string().min(2),
    age: z.number().min(13),
    weightKg: z.number().positive(),
    fitnessGoal: z.string().optional(),
    theme: ThemeEnum.default("system")
});
export const ExerciseSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    category: z.enum(["cardio", "strength", "stretching", "full_body"]),
    imageUrl: z.string().url()
});
export const LogEntryInputSchema = z.object({
    workoutId: z.string(),
    durationSeconds: z.number().positive(),
    notes: z.string().optional(),
    date: z.coerce.date().default(() => new Date())
});
