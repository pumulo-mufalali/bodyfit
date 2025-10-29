import type { User } from "@myfitness/shared";
interface UserProfileCardProps {
    profile: User;
    onUpdateProfile: (updates: Partial<User>) => void;
    isUpdating: boolean;
}
export declare function UserProfileCard({ profile, onUpdateProfile, isUpdating, }: UserProfileCardProps): import("react/jsx-runtime").JSX.Element;
export {};
