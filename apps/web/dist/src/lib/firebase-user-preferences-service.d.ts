export interface UserPreferences {
    lastActivePage?: string;
    lastSelectedGifId?: string;
    lastVisitedAt?: string;
    preferredView?: 'dashboard' | 'workouts' | 'goals' | 'schedule';
}
/**
 * Get user preferences from Firestore
 */
export declare function getUserPreferences(userId: string): Promise<UserPreferences | null>;
/**
 * Save user preferences to Firestore
 */
export declare function saveUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<void>;
/**
 * Track user activity/event
 */
export interface UserActivity {
    type: 'page_view' | 'workout_completed' | 'goal_created' | 'weight_logged' | 'schedule_updated' | 'settings_changed';
    page?: string;
    metadata?: Record<string, any>;
    timestamp: string;
}
export declare function logUserActivity(userId: string, activity: Omit<UserActivity, 'timestamp'>): Promise<void>;
