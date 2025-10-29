export declare const userRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: import("../context").Context;
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    /**
     * Get user profile
     * Requires authentication
     */
    getProfile: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../context").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _ctx_out: import("../context").Context;
        _input_in: typeof import("@trpc/server").unsetMarker;
        _input_out: typeof import("@trpc/server").unsetMarker;
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
        _meta: object;
    }, {
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
    }>;
    /**
     * Update user profile
     * Requires authentication
     */
    updateProfile: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../context").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: import("../context").Context;
        _input_in: {
            name?: string | undefined;
            email?: string | undefined;
            theme?: "system" | "light" | "dark" | undefined;
            uid?: string | undefined;
            age?: number | undefined;
            weightKg?: number | undefined;
            units?: "metric" | "imperial" | undefined;
            language?: "fr" | "en" | "es" | "de" | undefined;
            privacy?: "private" | "friends" | "public" | undefined;
            notifications?: {
                workoutReminders?: boolean | undefined;
                goalAchievements?: boolean | undefined;
                weeklyProgress?: boolean | undefined;
            } | undefined;
            dataSharing?: boolean | undefined;
            activityTracking?: boolean | undefined;
            heightCm?: number | undefined;
            fitnessGoal?: string | undefined;
        };
        _input_out: {
            name?: string | undefined;
            email?: string | undefined;
            theme?: "system" | "light" | "dark" | undefined;
            uid?: string | undefined;
            age?: number | undefined;
            weightKg?: number | undefined;
            units?: "metric" | "imperial" | undefined;
            language?: "fr" | "en" | "es" | "de" | undefined;
            privacy?: "private" | "friends" | "public" | undefined;
            notifications?: {
                workoutReminders: boolean;
                goalAchievements: boolean;
                weeklyProgress: boolean;
            } | undefined;
            dataSharing?: boolean | undefined;
            activityTracking?: boolean | undefined;
            heightCm?: number | undefined;
            fitnessGoal?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
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
    }>;
    /**
     * Create user profile (for new signups)
     * Requires authentication
     */
    createProfile: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../context").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: import("../context").Context;
        _input_in: {
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
        };
        _input_out: {
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
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
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
    }>;
}>;
