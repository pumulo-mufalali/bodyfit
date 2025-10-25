import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { UserProfileCard } from './UserProfileCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
export function ProfilePage({ onClose }) {
    const queryClient = useQueryClient();
    const { data: profile, isLoading: profileLoading } = useQuery({
        queryKey: ['user', 'profile'],
        queryFn: api.user.getProfile
    });
    const updateProfileMutation = useMutation({
        mutationFn: (input) => api.user.updateProfile(input),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user', 'profile'] })
    });
    return (_jsxs("div", { className: "min-h-[70vh] p-4 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-800", children: [_jsx("div", { className: "flex items-center justify-between mb-4", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: onClose, className: "px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-sm", children: "\u2190 Back" }), _jsx("h1", { className: "text-xl font-semibold text-black dark:text-white", children: "Your Profile" })] }) }), profileLoading ? (_jsx("div", { children: "Loading profile\u2026" })) : profile ? (_jsx(UserProfileCard, { profile: profile, onUpdateName: name => updateProfileMutation.mutate({ name }), isUpdating: updateProfileMutation.isPending })) : (_jsx("div", { children: "No profile data available." }))] }));
}
export default ProfilePage;
