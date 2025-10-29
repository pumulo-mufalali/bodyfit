import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
const schedulesCollection = "schedules";
export async function getUserSchedule(userId) {
    try {
        if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
            throw new Error('Invalid user ID provided');
        }
        const scheduleRef = doc(db, "users", userId, schedulesCollection, "weekly");
        const scheduleSnap = await getDoc(scheduleRef);
        if (!scheduleSnap.exists())
            return null;
        const data = scheduleSnap.data();
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid schedule data format');
        }
        return {
            id: scheduleSnap.id,
            monday: Array.isArray(data.monday) ? data.monday : [],
            tuesday: Array.isArray(data.tuesday) ? data.tuesday : [],
            wednesday: Array.isArray(data.wednesday) ? data.wednesday : [],
            thursday: Array.isArray(data.thursday) ? data.thursday : [],
            friday: Array.isArray(data.friday) ? data.friday : [],
            saturday: Array.isArray(data.saturday) ? data.saturday : [],
            sunday: Array.isArray(data.sunday) ? data.sunday : [],
            createdAt: data.createdAt || new Date().toISOString(),
        };
    }
    catch (error) {
        console.error('Error getting user schedule:', error);
        if (error.code === 'permission-denied') {
            throw new Error('Permission denied. Please check your authentication.');
        }
        throw new Error('Failed to fetch schedule. Please try again.');
    }
}
export async function createUserSchedule(userId, scheduleData) {
    try {
        if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
            throw new Error('Invalid user ID provided');
        }
        if (!scheduleData || typeof scheduleData !== 'object') {
            throw new Error('Invalid schedule data provided');
        }
        // Validate schedule items for each day
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        for (const day of days) {
            const daySchedule = scheduleData[day];
            if (daySchedule && !Array.isArray(daySchedule)) {
                throw new Error(`Invalid ${day} schedule: must be an array`);
            }
            if (Array.isArray(daySchedule)) {
                for (const item of daySchedule) {
                    if (!item || typeof item !== 'object') {
                        throw new Error(`Invalid schedule item in ${day}`);
                    }
                    if (!item.time || typeof item.time !== 'string' || item.time.trim().length === 0) {
                        throw new Error(`Schedule item in ${day} must have a time`);
                    }
                    if (!item.activity || typeof item.activity !== 'string' || item.activity.trim().length === 0) {
                        throw new Error(`Schedule item in ${day} must have an activity`);
                    }
                    if (item.activity.trim().length > 200) {
                        throw new Error(`Activity name in ${day} must be less than 200 characters`);
                    }
                }
            }
        }
        const scheduleRef = doc(db, "users", userId, schedulesCollection, "weekly");
        const newSchedule = {
            ...scheduleData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        await setDoc(scheduleRef, newSchedule);
        return {
            id: "weekly",
            ...newSchedule,
        };
    }
    catch (error) {
        console.error('Error creating user schedule:', error);
        if (error.code === 'permission-denied') {
            throw new Error('Permission denied. Please check your authentication.');
        }
        if (error.message) {
            throw error;
        }
        throw new Error('Failed to create schedule. Please try again.');
    }
}
export async function updateUserSchedule(userId, scheduleData) {
    try {
        if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
            throw new Error('Invalid user ID provided');
        }
        if (!scheduleData || typeof scheduleData !== 'object' || Object.keys(scheduleData).length === 0) {
            throw new Error('No schedule data provided for update');
        }
        // Validate schedule items for each day if provided
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        for (const day of days) {
            if (day in scheduleData) {
                const daySchedule = scheduleData[day];
                if (daySchedule && !Array.isArray(daySchedule)) {
                    throw new Error(`Invalid ${day} schedule: must be an array`);
                }
                if (Array.isArray(daySchedule)) {
                    for (const item of daySchedule) {
                        if (!item || typeof item !== 'object') {
                            throw new Error(`Invalid schedule item in ${day}`);
                        }
                        if (!item.time || typeof item.time !== 'string' || item.time.trim().length === 0) {
                            throw new Error(`Schedule item in ${day} must have a time`);
                        }
                        if (!item.activity || typeof item.activity !== 'string' || item.activity.trim().length === 0) {
                            throw new Error(`Schedule item in ${day} must have an activity`);
                        }
                        if (item.activity.trim().length > 200) {
                            throw new Error(`Activity name in ${day} must be less than 200 characters`);
                        }
                    }
                }
            }
        }
        const scheduleRef = doc(db, "users", userId, schedulesCollection, "weekly");
        await setDoc(scheduleRef, { ...scheduleData, updatedAt: new Date().toISOString() }, { merge: true });
        // Log activity
        try {
            const { logUserActivity } = await import('./firebase-user-preferences-service');
            await logUserActivity(userId, {
                type: 'schedule_updated',
                metadata: {
                    daysUpdated: Object.keys(scheduleData).length,
                    scheduleData: Object.keys(scheduleData),
                },
            });
        }
        catch (logError) {
            console.error('Error logging schedule activity:', logError);
            // Don't throw - activity logging failure shouldn't break the main operation
        }
    }
    catch (error) {
        console.error('Error updating user schedule:', error);
        if (error.code === 'permission-denied') {
            throw new Error('Permission denied. Please check your authentication.');
        }
        if (error.code === 'not-found') {
            throw new Error('Schedule not found.');
        }
        if (error.message) {
            throw error;
        }
        throw new Error('Failed to update schedule. Please try again.');
    }
}
export async function deleteUserSchedule(userId) {
    const scheduleRef = doc(db, "users", userId, schedulesCollection, "weekly");
    await deleteDoc(scheduleRef);
}
