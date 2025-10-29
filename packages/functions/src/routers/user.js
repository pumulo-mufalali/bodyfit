import { router, publicProcedure } from '../trpc';
import { UserSchema } from '@myfitness/shared';
export const userRouter = router({
    /**
     * Get user profile
     * Requires authentication
     */
    getProfile: publicProcedure
        .query(async ({ ctx }) => {
        if (!ctx.userId) {
            throw new Error('Unauthorized: User must be authenticated');
        }
        const userDoc = await ctx.db.collection('users').doc(ctx.userId).get();
        if (!userDoc.exists) {
            throw new Error('User profile not found');
        }
        return userDoc.data();
    }),
    /**
     * Update user profile
     * Requires authentication
     */
    updateProfile: publicProcedure
        .input(UserSchema.partial())
        .mutation(async ({ ctx, input }) => {
        if (!ctx.userId) {
            throw new Error('Unauthorized: User must be authenticated');
        }
        const userRef = ctx.db.collection('users').doc(ctx.userId);
        // Validate that uid matches authenticated user
        if (input.uid && input.uid !== ctx.userId) {
            throw new Error('Cannot update another user\'s profile');
        }
        // Merge update with existing data
        const updateData = {
            ...input,
            uid: ctx.userId, // Ensure uid matches authenticated user
        };
        await userRef.set(updateData, { merge: true });
        // Return updated profile
        const updatedDoc = await userRef.get();
        return updatedDoc.data();
    }),
    /**
     * Create user profile (for new signups)
     * Requires authentication
     */
    createProfile: publicProcedure
        .input(UserSchema)
        .mutation(async ({ ctx, input }) => {
        if (!ctx.userId) {
            throw new Error('Unauthorized: User must be authenticated');
        }
        // Ensure uid matches authenticated user
        if (input.uid !== ctx.userId) {
            throw new Error('User ID mismatch');
        }
        const userRef = ctx.db.collection('users').doc(ctx.userId);
        const existingDoc = await userRef.get();
        if (existingDoc.exists) {
            throw new Error('User profile already exists');
        }
        await userRef.set(input);
        return input;
    }),
});
