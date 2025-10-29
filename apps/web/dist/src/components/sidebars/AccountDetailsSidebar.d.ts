interface User {
    weightKg?: number;
    heightCm?: number;
}
interface AccountDetailsSidebarProps {
    currentUser: User | null;
}
export default function AccountDetailsSidebar({ currentUser }: AccountDetailsSidebarProps): import("react/jsx-runtime").JSX.Element;
export {};
