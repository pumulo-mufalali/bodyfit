import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { GoalSchema } from '@myfitness/shared';
const CreateGoalInput = GoalSchema.omit({ id: true });
const UpdateGoalInput = GoalSchema.partial().omit({ id: true, createdAt: true });
export const goalsRouter = router({
    /**
     * Get all goals for authenticated user
     */
    getAll: publicProcedure
        .query(async ({ ctx }) => {
        if (!ctx.userId) {
            throw new Error('Unauthorized: User must be authenticated');
        }
        const goalsSnapshot = await ctx.db
            .collection('users')
            .doc(ctx.userId)
            .collection('goals')
            .orderBy('createdAt', 'desc')
            .get();
        return goalsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }),
    /**
     * Get a specific goal by ID
     */
    getById: publicProcedure
        .input(z.object({ goalId: z.string() }))
        .query(async ({ ctx, input }) => {
        if (!ctx.userId) {
            throw new Error('Unauthorized: User must be authenticated');
        }
        const goalDoc = await ctx.db
            .collection('users')
            .doc(ctx.userId)
            .collection('goals')
            .doc(input.goalId)
            .get();
        if (!goalDoc.exists) {
            throw new Error('Goal not found');
        }
        return {
            id: goalDoc.id,
            ...goalDoc.data(),
        };
    }),
    /**
     * Create a new goal
     */
    create: publicProcedure
        .input(CreateGoalInput)
        .mutation(async ({ ctx, input }) => {
        if (!ctx.userId) {
            throw new Error('Unauthorized: User must be authenticated');
        }
        const goalData = {
            ...input,
            createdAt: new Date().toISOString(),
        };
        const goalRef = await ctx.db
            .collection('users')
            .doc(ctx.userId)
            .collection('goals')
            .add(goalData);
        return {
            id: goalRef.id,
            ...goalData,
        };
    }),
    /**
     * Update a goal
     */
    update: publicProcedure
        .input(z.object({
        goalId: z.string(),
        updates: UpdateGoalInput,
    }))
        .mutation(async ({ ctx, input }) => {
        if (!ctx.userId) {
            throw new Error('Unauthorized: User must be authenticated');
        }
        const goalRef = ctx.db
            .collection('users')
            .doc(ctx.userId)
            .collection('goals')
            .doc(input.goalId);
        const goalDoc = await goalRef.get();
        if (!goalDoc.exists) {
            throw new Error('Goal not found');
        }
        await goalRef.update(input.updates);
        const updatedDoc = await goalRef.get();
        return {
            id: updatedDoc.id,
            ...updatedDoc.data(),
        };
    }),
    /**
     * Delete a goal
     */
    delete: publicProcedure
        .input(z.object({ goalId: z.string() }))
        .mutation(async ({ ctx, input }) => {
        if (!ctx.userId) {
            throw new Error('Unauthorized: User must be authenticated');
        }
        const goalRef = ctx.db
            .collection('users')
            .doc(ctx.userId)
            .collection('goals')
            .doc(input.goalId);
        const goalDoc = await goalRef.get();
        if (!goalDoc.exists) {
            throw new Error('Goal not found');
        }
        await goalRef.delete();
        return { success: true };
    }),
});
