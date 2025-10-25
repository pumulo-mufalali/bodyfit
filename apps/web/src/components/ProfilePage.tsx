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
    <div className="min-h-[70vh] p-4 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-sm"
          >
            ← Back
          </button>
          <h1 className="text-xl font-semibold text-black dark:text-white">Your Profile</h1>
        </div>
      </div>

      {profileLoading ? (
        <div>Loading profile…</div>
      ) : profile ? (
        <UserProfileCard
          profile={profile}
          onUpdateName={name => updateProfileMutation.mutate({ name })}
          isUpdating={updateProfileMutation.isPending}
        />
      ) : (
        <div>No profile data available.</div>
      )}
    </div>
  );
}

export default ProfilePage;
