import type { Goal } from "@myfitness/shared";
export declare function getUserGoals(userId: string): Promise<Goal[]>;
export declare function createGoal(userId: string, goalData: Omit<Goal, "id">): Promise<Goal>;
export declare function updateGoal(userId: string, goalId: string, updates: Partial<Omit<Goal, "id" | "createdAt">>): Promise<void>;
export declare function deleteGoal(userId: string, goalId: string): Promise<void>;
