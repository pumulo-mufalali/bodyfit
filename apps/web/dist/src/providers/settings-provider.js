import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth-provider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserFromFirestore, updateUserProfile } from '../lib/firebase-user-service';
const SettingsContext = createContext(undefined);
export function SettingsProvider({ children }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    // Fetch user profile with settings
    const { data: profile } = useQuery({
        queryKey: ['user', 'profile', user?.uid],
        queryFn: () => getUserFromFirestore(user.uid),
        enabled: !!user?.uid,
    });
    const currentUser = profile || user;
    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: (updates) => updateUserProfile(user.uid, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'profile', user?.uid] });
        },
    });
    // Theme management with DOM updates
    const [theme, setThemeState] = useState(() => {
        if (typeof window === 'undefined')
            return 'light';
        const saved = localStorage.getItem("theme");
        return saved || currentUser?.theme || 'system';
    });
    const setTheme = (newTheme) => {
        setThemeState(newTheme);
        if (typeof window !== 'undefined') {
            localStorage.setItem("theme", newTheme);
        }
        // Update DOM
        const root = document.documentElement;
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const isDark = newTheme === "dark" || (newTheme === "system" && prefersDark);
        root.classList.toggle("dark", isDark);
        // Update user profile and log activity
        if (user?.uid) {
            updateProfileMutation.mutate({ theme: newTheme });
            logUserActivity(user.uid, {
                type: 'settings_changed',
                metadata: { setting: 'theme', value: newTheme },
            }).catch(err => console.error('Error logging theme activity:', err));
        }
    };
    // Units management
    const units = currentUser?.units || 'metric';
    const setUnits = (newUnits) => {
        if (user?.uid) {
            updateProfileMutation.mutate({ units: newUnits });
            // Log activity
            import('../lib/firebase-user-preferences-service').then(({ logUserActivity }) => {
                logUserActivity(user.uid, {
                    type: 'settings_changed',
                    metadata: { setting: 'units', value: newUnits },
                });
            });
        }
    };
    // Language management
    const language = currentUser?.language || 'en';
    const setLanguage = (newLanguage) => {
        if (user?.uid) {
            updateProfileMutation.mutate({ language: newLanguage });
            // Log activity
            import('../lib/firebase-user-preferences-service').then(({ logUserActivity }) => {
                logUserActivity(user.uid, {
                    type: 'settings_changed',
                    metadata: { setting: 'language', value: newLanguage },
                });
            });
        }
    };
    // Privacy management
    const privacy = currentUser?.privacy || 'private';
    const setPrivacy = (newPrivacy) => {
        if (user?.uid) {
            updateProfileMutation.mutate({ privacy: newPrivacy });
            // Log activity
            import('../lib/firebase-user-preferences-service').then(({ logUserActivity }) => {
                logUserActivity(user.uid, {
                    type: 'settings_changed',
                    metadata: { setting: 'privacy', value: newPrivacy },
                });
            });
        }
    };
    // Notifications management
    const notifications = currentUser?.notifications || {
        workoutReminders: true,
        goalAchievements: true,
        weeklyProgress: false,
    };
    const setNotifications = (newNotifications) => {
        if (user?.uid) {
            updateProfileMutation.mutate({
                notifications: { ...notifications, ...newNotifications }
            });
            // Log activity
            import('../lib/firebase-user-preferences-service').then(({ logUserActivity }) => {
                logUserActivity(user.uid, {
                    type: 'settings_changed',
                    metadata: { setting: 'notifications', value: newNotifications },
                });
            });
        }
    };
    // Data sharing management
    const dataSharing = currentUser?.dataSharing ?? true;
    const setDataSharing = (enabled) => {
        if (user?.uid) {
            updateProfileMutation.mutate({ dataSharing: enabled });
            // Log activity
            import('../lib/firebase-user-preferences-service').then(({ logUserActivity }) => {
                logUserActivity(user.uid, {
                    type: 'settings_changed',
                    metadata: { setting: 'dataSharing', value: enabled },
                });
            });
        }
    };
    // Activity tracking management
    const activityTracking = currentUser?.activityTracking ?? true;
    const setActivityTracking = (enabled) => {
        if (user?.uid) {
            updateProfileMutation.mutate({ activityTracking: enabled });
            // Log activity
            import('../lib/firebase-user-preferences-service').then(({ logUserActivity }) => {
                logUserActivity(user.uid, {
                    type: 'settings_changed',
                    metadata: { setting: 'activityTracking', value: enabled },
                });
            });
        }
    };
    // Apply theme on mount and when theme changes
    useEffect(() => {
        const root = document.documentElement;
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const isDark = theme === "dark" || (theme === "system" && prefersDark);
        root.classList.toggle("dark", isDark);
    }, [theme]);
    const value = {
        theme,
        setTheme,
        units,
        setUnits,
        language,
        setLanguage,
        privacy,
        setPrivacy,
        notifications,
        setNotifications,
        dataSharing,
        setDataSharing,
        activityTracking,
        setActivityTracking,
        isUpdating: updateProfileMutation.isPending,
    };
    return (_jsx(SettingsContext.Provider, { value: value, children: children }));
}
export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
