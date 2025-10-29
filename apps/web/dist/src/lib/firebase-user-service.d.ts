import type { User } from "@myfitness/shared";
export declare function getUserFromFirestore(uid: string): Promise<User | null>;
export declare function saveUserToFirestore(user: User): Promise<void>;
export declare function updateUserProfile(uid: string, updates: Partial<User>): Promise<void>;
export declare function createInitialUserProfile(uid: string, email: string, displayName?: string): Promise<User>;
