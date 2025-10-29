import { router } from '../trpc';
import { userRouter } from './user';
import { goalsRouter } from './goals';

export const appRouter = router({
  user: userRouter,
  goals: goalsRouter,
});

export type AppRouter = typeof appRouter;

