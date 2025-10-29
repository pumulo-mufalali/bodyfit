import { ReactNode } from 'react';
interface SettingsContextType {
    theme: 'light' | 'dark' | 'system';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    units: 'metric' | 'imperial';
    setUnits: (units: 'metric' | 'imperial') => void;
    language: 'en' | 'es' | 'fr' | 'de';
    setLanguage: (language: 'en' | 'es' | 'fr' | 'de') => void;
    privacy: 'private' | 'friends' | 'public';
    setPrivacy: (privacy: 'private' | 'friends' | 'public') => void;
    notifications: {
        workoutReminders: boolean;
        goalAchievements: boolean;
        weeklyProgress: boolean;
    };
    setNotifications: (notifications: Partial<SettingsContextType['notifications']>) => void;
    dataSharing: boolean;
    setDataSharing: (enabled: boolean) => void;
    activityTracking: boolean;
    setActivityTracking: (enabled: boolean) => void;
    isUpdating: boolean;
}
export declare function SettingsProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useSettings(): SettingsContextType;
export {};
