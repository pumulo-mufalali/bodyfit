interface LoginFormProps {
    onSuccess?: (user: any) => void;
    onSwitchToSignUp: () => void;
    isLoading?: boolean;
}
export default function LoginForm({ onSuccess, onSwitchToSignUp, isLoading: externalLoading }: LoginFormProps): import("react/jsx-runtime").JSX.Element;
export {};
