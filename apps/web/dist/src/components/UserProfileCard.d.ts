import type { User } from "@myfitness/shared";
interface UserProfileCardProps {
    profile: User;
    onUpdateName: (name: string) => void;
    isUpdating: boolean;
}
export declare function UserProfileCard({ profile, onUpdateName, isUpdating }: UserProfileCardProps): import("react/jsx-runtime").JSX.Element;
export {};
