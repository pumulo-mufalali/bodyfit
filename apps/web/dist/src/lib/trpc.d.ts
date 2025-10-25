import { UserSchema } from "@myfitness/shared";
import { z } from "zod";
type User = z.infer<typeof UserSchema>;
export declare const api: {
    user: {
        getProfile: () => Promise<User>;
        updateProfile: (input: Partial<User>) => Promise<User>;
    };
};
export {};
