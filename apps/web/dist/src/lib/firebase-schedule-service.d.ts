import type { Schedule } from "@myfitness/shared";
export declare function getUserSchedule(userId: string): Promise<Schedule | null>;
export declare function createUserSchedule(userId: string, scheduleData: Omit<Schedule, "id">): Promise<Schedule>;
export declare function updateUserSchedule(userId: string, scheduleData: Partial<Omit<Schedule, "id" | "createdAt">>): Promise<void>;
export declare function deleteUserSchedule(userId: string): Promise<void>;
