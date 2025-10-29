export declare const goalsRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: import("../context").Context;
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    /**
     * Get all goals for authenticated user
     */
    getAll: import("@trpc/server").BuildProcedure<"query", {
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
        id: string;
        category: "weight";
        title: string;
        target: number;
        current: number;
        unit: string;
        deadline: string;
        createdAt?: string | undefined;
    }[]>;
    /**
     * Get a specific goal by ID
     */
    getById: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../context").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: import("../context").Context;
        _input_in: {
            goalId: string;
        };
        _input_out: {
            goalId: string;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
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
    /**
     * Create a new goal
     */
    create: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../context").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: import("../context").Context;
        _input_in: {
            title: string;
            current: number;
            target: number;
            unit: string;
            category: "weight";
            deadline: string;
            createdAt?: string | undefined;
        };
        _input_out: {
            title: string;
            current: number;
            target: number;
            unit: string;
            category: "weight";
            deadline: string;
            createdAt?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
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
    /**
     * Update a goal
     */
    update: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../context").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: import("../context").Context;
        _input_in: {
            goalId: string;
            updates: {
                title?: string | undefined;
                current?: number | undefined;
                target?: number | undefined;
                unit?: string | undefined;
                category?: "weight" | undefined;
                deadline?: string | undefined;
            };
        };
        _input_out: {
            goalId: string;
            updates: {
                title?: string | undefined;
                current?: number | undefined;
                target?: number | undefined;
                unit?: string | undefined;
                category?: "weight" | undefined;
                deadline?: string | undefined;
            };
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
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
    /**
     * Delete a goal
     */
    delete: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../context").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: import("../context").Context;
        _input_in: {
            goalId: string;
        };
        _input_out: {
            goalId: string;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
    }>;
}>;
