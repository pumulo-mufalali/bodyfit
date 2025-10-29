import { z } from "zod";
export declare const ThemeEnum: z.ZodEnum<["light", "dark", "system"]>;
export declare const UnitsEnum: z.ZodEnum<["metric", "imperial"]>;
export declare const LanguageEnum: z.ZodEnum<["en", "es", "fr", "de"]>;
export declare const PrivacyEnum: z.ZodEnum<["private", "friends", "public"]>;
export declare const UserSchema: z.ZodObject<{
    uid: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    age: z.ZodNumber;
    weightKg: z.ZodNumber;
    heightCm: z.ZodOptional<z.ZodNumber>;
    fitnessGoal: z.ZodOptional<z.ZodString>;
    theme: z.ZodDefault<z.ZodEnum<["light", "dark", "system"]>>;
    units: z.ZodDefault<z.ZodEnum<["metric", "imperial"]>>;
    language: z.ZodDefault<z.ZodEnum<["en", "es", "fr", "de"]>>;
    privacy: z.ZodDefault<z.ZodEnum<["private", "friends", "public"]>>;
    notifications: z.ZodDefault<z.ZodObject<{
        workoutReminders: z.ZodDefault<z.ZodBoolean>;
        goalAchievements: z.ZodDefault<z.ZodBoolean>;
        weeklyProgress: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        workoutReminders: boolean;
        goalAchievements: boolean;
        weeklyProgress: boolean;
    }, {
        workoutReminders?: boolean | undefined;
        goalAchievements?: boolean | undefined;
        weeklyProgress?: boolean | undefined;
    }>>;
    dataSharing: z.ZodDefault<z.ZodBoolean>;
    activityTracking: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    uid: string;
    name: string;
    email: string;
    age: number;
    weightKg: number;
    theme: "light" | "dark" | "system";
    units: "metric" | "imperial";
    language: "en" | "es" | "fr" | "de";
    privacy: "private" | "friends" | "public";
    notifications: {
        workoutReminders: boolean;
        goalAchievements: boolean;
        weeklyProgress: boolean;
    };
    dataSharing: boolean;
    activityTracking: boolean;
    heightCm?: number | undefined;
    fitnessGoal?: string | undefined;
}, {
    uid: string;
    name: string;
    email: string;
    age: number;
    weightKg: number;
    heightCm?: number | undefined;
    fitnessGoal?: string | undefined;
    theme?: "light" | "dark" | "system" | undefined;
    units?: "metric" | "imperial" | undefined;
    language?: "en" | "es" | "fr" | "de" | undefined;
    privacy?: "private" | "friends" | "public" | undefined;
    notifications?: {
        workoutReminders?: boolean | undefined;
        goalAchievements?: boolean | undefined;
        weeklyProgress?: boolean | undefined;
    } | undefined;
    dataSharing?: boolean | undefined;
    activityTracking?: boolean | undefined;
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
export declare const GoalSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    target: z.ZodNumber;
    current: z.ZodNumber;
    unit: z.ZodString;
    category: z.ZodEnum<["weight"]>;
    deadline: z.ZodString;
    createdAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    category: "weight";
    title: string;
    target: number;
    current: number;
    unit: string;
    deadline: string;
    createdAt?: string | undefined;
}, {
    id: string;
    category: "weight";
    title: string;
    target: number;
    current: number;
    unit: string;
    deadline: string;
    createdAt?: string | undefined;
}>;
export declare const ScheduleItemSchema: z.ZodObject<{
    time: z.ZodString;
    activity: z.ZodString;
}, "strip", z.ZodTypeAny, {
    time: string;
    activity: string;
}, {
    time: string;
    activity: string;
}>;
export declare const ScheduleSchema: z.ZodObject<{
    id: z.ZodString;
    monday: z.ZodDefault<z.ZodArray<z.ZodObject<{
        time: z.ZodString;
        activity: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        time: string;
        activity: string;
    }, {
        time: string;
        activity: string;
    }>, "many">>;
    tuesday: z.ZodDefault<z.ZodArray<z.ZodObject<{
        time: z.ZodString;
        activity: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        time: string;
        activity: string;
    }, {
        time: string;
        activity: string;
    }>, "many">>;
    wednesday: z.ZodDefault<z.ZodArray<z.ZodObject<{
        time: z.ZodString;
        activity: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        time: string;
        activity: string;
    }, {
        time: string;
        activity: string;
    }>, "many">>;
    thursday: z.ZodDefault<z.ZodArray<z.ZodObject<{
        time: z.ZodString;
        activity: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        time: string;
        activity: string;
    }, {
        time: string;
        activity: string;
    }>, "many">>;
    friday: z.ZodDefault<z.ZodArray<z.ZodObject<{
        time: z.ZodString;
        activity: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        time: string;
        activity: string;
    }, {
        time: string;
        activity: string;
    }>, "many">>;
    saturday: z.ZodDefault<z.ZodArray<z.ZodObject<{
        time: z.ZodString;
        activity: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        time: string;
        activity: string;
    }, {
        time: string;
        activity: string;
    }>, "many">>;
    sunday: z.ZodDefault<z.ZodArray<z.ZodObject<{
        time: z.ZodString;
        activity: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        time: string;
        activity: string;
    }, {
        time: string;
        activity: string;
    }>, "many">>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    monday: {
        time: string;
        activity: string;
    }[];
    tuesday: {
        time: string;
        activity: string;
    }[];
    wednesday: {
        time: string;
        activity: string;
    }[];
    thursday: {
        time: string;
        activity: string;
    }[];
    friday: {
        time: string;
        activity: string;
    }[];
    saturday: {
        time: string;
        activity: string;
    }[];
    sunday: {
        time: string;
        activity: string;
    }[];
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
}, {
    id: string;
    createdAt?: string | undefined;
    monday?: {
        time: string;
        activity: string;
    }[] | undefined;
    tuesday?: {
        time: string;
        activity: string;
    }[] | undefined;
    wednesday?: {
        time: string;
        activity: string;
    }[] | undefined;
    thursday?: {
        time: string;
        activity: string;
    }[] | undefined;
    friday?: {
        time: string;
        activity: string;
    }[] | undefined;
    saturday?: {
        time: string;
        activity: string;
    }[] | undefined;
    sunday?: {
        time: string;
        activity: string;
    }[] | undefined;
    updatedAt?: string | undefined;
}>;
export type User = z.infer<typeof UserSchema>;
export type Exercise = z.infer<typeof ExerciseSchema>;
export type LogEntryInput = z.infer<typeof LogEntryInputSchema>;
export type Goal = z.infer<typeof GoalSchema>;
export type ScheduleItem = z.infer<typeof ScheduleItemSchema>;
export type Schedule = z.infer<typeof ScheduleSchema>;
//# sourceMappingURL=schemas.d.ts.map