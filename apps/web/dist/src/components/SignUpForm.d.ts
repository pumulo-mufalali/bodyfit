interface SignUpFormProps {
    onSuccess?: (user: any) => void;
    onSwitchToLogin: () => void;
    isLoading?: boolean;
}
export default function SignUpForm({ onSuccess, onSwitchToLogin, isLoading: externalLoading }: SignUpFormProps): import("react/jsx-runtime").JSX.Element;
export {};
