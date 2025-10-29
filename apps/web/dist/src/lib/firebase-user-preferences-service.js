import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
/**
 * Get user preferences from Firestore
 */
export async function getUserPreferences(userId) {
    try {
        const prefsRef = doc(db, 'users', userId, 'preferences', 'main');
        const prefsSnap = await getDoc(prefsRef);
        if (prefsSnap.exists()) {
            return prefsSnap.data();
        }
        return null;
    }
    catch (error) {
        console.error('Error getting user preferences:', error);
        return null;
    }
}
/**
 * Save user preferences to Firestore
 */
export async function saveUserPreferences(userId, preferences) {
    try {
        if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
            throw new Error('Invalid user ID provided');
        }
        // Filter out undefined values - Firestore doesn't allow undefined
        const cleanPreferences = {};
        Object.entries(preferences).forEach(([key, value]) => {
            // Only include defined values (not undefined or null for optional fields)
            // For optional string fields, we still want to save null if explicitly set
            if (value !== undefined) {
                cleanPreferences[key] = value;
            }
        });
        // Always update lastVisitedAt
        cleanPreferences.lastVisitedAt = new Date().toISOString();
        const prefsRef = doc(db, 'users', userId, 'preferences', 'main');
        await setDoc(prefsRef, cleanPreferences, { merge: true });
    }
    catch (error) {
        console.error('Error saving user preferences:', error);
        throw error;
    }
}
export async function logUserActivity(userId, activity) {
    try {
        // Store in a subcollection for activity tracking
        const activityRef = doc(db, 'users', userId, 'activity', `${Date.now()}_${activity.type}`);
        await setDoc(activityRef, {
            ...activity,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error('Error logging user activity:', error);
        // Don't throw - activity logging should not break the app
    }
}
