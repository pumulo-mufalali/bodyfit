import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { UserProfileCard } from './UserProfileCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserFromFirestore, updateUserProfile, createInitialUserProfile } from '../lib/firebase-user-service';
import { useAuth } from '../providers/auth-provider';
export function ProfilePage({ onClose }) {
    const queryClient = useQueryClient();
    const { user, login } = useAuth();
    // Always fetch user profile from Firestore if user ID available
    const { data: profile, isLoading: profileLoading, error } = useQuery({
        queryKey: ['user', 'profile', user?.uid],
        queryFn: async () => {
            if (!user?.uid)
                return null;
            // Try to get existing profile
            const existingProfile = await getUserFromFirestore(user.uid);
            if (existingProfile)
                return existingProfile;
            // If no profile exists, create one
            const newProfile = await createInitialUserProfile(user.uid, user.email, user.name);
            return newProfile;
        },
        enabled: !!user?.uid,
        retry: 1, // Only retry once
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
        refetchOnWindowFocus: false, // Don't refetch on window focus
        refetchOnMount: true, // Refetch when component mounts
        refetchOnReconnect: true, // Refetch when reconnecting
    });
    // Update profile mutation (write to Firestore and sync context)
    const updateProfileMutation = useMutation({
        mutationFn: async (updates) => {
            console.log('ProfilePage - updateProfileMutation called with:', updates);
            if (!user?.uid) {
                console.log('ProfilePage - No user UID, returning');
                return;
            }
            console.log('ProfilePage - Calling updateUserProfile...');
            await updateUserProfile(user.uid, updates);
            console.log('ProfilePage - updateUserProfile completed');
        },
        onSuccess: async () => {
            console.log('ProfilePage - Mutation success, updating auth context...');
            if (user?.uid) {
                const updatedProfile = await getUserFromFirestore(user.uid);
                console.log('ProfilePage - Got updated profile:', updatedProfile);
                if (updatedProfile) {
                    console.log('ProfilePage - Updating auth context with:', updatedProfile);
                    login({ ...updatedProfile, fitnessGoal: updatedProfile.fitnessGoal ?? "" });
                }
                queryClient.invalidateQueries({ queryKey: ['user', 'profile', user.uid] });
            }
            // Show success message
            alert('Profile updated successfully!');
        },
        onError: (error) => {
            console.error('ProfilePage - Mutation error:', error);
        }
    });
    // Use user from auth context as fallback if profile is still loading
    const currentProfile = profile || (user ? {
        uid: user.uid,
        name: user.name,
        email: user.email,
        age: 0,
        weightKg: 0,
        heightCm: 0,
        fitnessGoal: "",
        theme: user.theme
    } : null);
    return (_jsxs("div", { className: "min-h-[70vh] p-6", children: [_jsx("div", { className: "flex items-center justify-between mb-8", children: _jsx("div", { className: "flex items-center space-x-4", children: _jsx("h1", { className: "text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "Your Profile" }) }) }), error && (_jsx("div", { className: "mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6", children: _jsx("p", { className: "text-red-600 dark:text-red-400", children: "Error loading profile. Please try again." }) })), profileLoading && !currentProfile ? (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Setting up your profile..." })] }) })) : currentProfile ? (_jsxs(_Fragment, { children: [(!currentProfile.age || currentProfile.age === 0 || !currentProfile.weightKg || currentProfile.weightKg === 0 || !currentProfile.heightCm || currentProfile.heightCm === 0) && (_jsx("div", { className: "mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-6", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center", children: _jsx("span", { className: "text-white text-sm font-bold", children: "!" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-blue-900 dark:text-blue-100", children: "Complete Your Profile" }), _jsx("p", { className: "text-blue-700 dark:text-blue-300 text-sm mt-1", children: "Please fill in your age, weight, height, and fitness goals to get personalized insights and track your progress." })] })] }) })), _jsx("div", { className: "bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50", children: _jsx(UserProfileCard, { profile: currentProfile, onUpdateProfile: (updates) => updateProfileMutation.mutate(updates), isUpdating: updateProfileMutation.isPending }) })] })) : (_jsx("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center", children: _jsx("p", { className: "text-red-600 dark:text-red-400", children: "No profile data available." }) }))] }));
}
export default ProfilePage;
