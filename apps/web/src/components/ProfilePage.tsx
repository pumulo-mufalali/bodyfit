import { UserProfileCard } from './UserProfileCard';
import { ThemeToggle } from './theme-toggle';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserFromFirestore, updateUserProfile, createInitialUserProfile } from '../lib/firebase-user-service';
import type { User } from '@myfitness/shared';
import { useAuth } from '../providers/auth-provider';
import { useEffect } from 'react';

export function ProfilePage({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const { user, login } = useAuth();

  // Always fetch user profile from Firestore if user ID available
  const { data: profile, isLoading: profileLoading, error } = useQuery<User | null>({
    queryKey: ['user', 'profile', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      
      // Try to get existing profile
      const existingProfile = await getUserFromFirestore(user.uid);
      if (existingProfile) return existingProfile;
      
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
    mutationFn: async (updates: Partial<User>) => {
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
    theme: user.theme as "light" | "dark" | "system"
  } : null);

  return (
    <div className="min-h-[70vh] p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Your Profile</h1>
        </div>
      </div>

      {/* Show error if there's a problem */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
          <p className="text-red-600 dark:text-red-400">Error loading profile. Please try again.</p>
        </div>
      )}

      {/* Show loading only if we don't have any profile data */}
      {profileLoading && !currentProfile ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Setting up your profile...</p>
          </div>
        </div>
      ) : currentProfile ? (
        <>
          {/* Show helpful message for new users */}
          {(!currentProfile.age || currentProfile.age === 0 || !currentProfile.weightKg || currentProfile.weightKg === 0 || !currentProfile.heightCm || currentProfile.heightCm === 0) && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Complete Your Profile</h3>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                    Please fill in your age, weight, height, and fitness goals to get personalized insights and track your progress.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50">
            {/* Debug button */}
            <button 
              onClick={() => {
                console.log('Test button clicked');
                updateProfileMutation.mutate({ age: 25, weightKg: 70, heightCm: 175, fitnessGoal: "Test goal" });
              }}
              className="mb-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Test Save (Debug)
            </button>
            
            <UserProfileCard
              profile={currentProfile}
              onUpdateProfile={(updates) => updateProfileMutation.mutate(updates)}
              isUpdating={updateProfileMutation.isPending}
            />
          </div>
        </>
      ) : (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400">No profile data available.</p>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;