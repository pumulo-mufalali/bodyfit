import { UserProfileCard } from './UserProfileCard';
import { ThemeToggle } from './theme-toggle';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { User } from '@myfitness/shared';

export function ProfilePage({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();

  const { data: profile, isLoading: profileLoading } = useQuery<User>({
    queryKey: ['user', 'profile'],
    queryFn: api.user.getProfile
  });

  const updateProfileMutation = useMutation({
    mutationFn: (input: Partial<User>) => api.user.updateProfile(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user', 'profile'] })
  });

  return (
    <div className="min-h-[70vh] p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Your Profile</h1>
        </div>
      </div>

      {profileLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
          </div>
        </div>
      ) : profile ? (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50">
          <UserProfileCard
            profile={profile}
            onUpdateName={name => updateProfileMutation.mutate({ name })}
            isUpdating={updateProfileMutation.isPending}
          />
        </div>
      ) : (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400">No profile data available.</p>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
