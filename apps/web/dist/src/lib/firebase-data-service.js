import { collection, doc, getDocs, addDoc, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
// Weight service
export const weightService = {
    async getHistory(userId) {
        try {
            if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
                throw new Error('Invalid user ID provided');
            }
            const weightRef = collection(db, 'users', userId, 'weight');
            const q = query(weightRef, orderBy('date', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    date: data.date || new Date().toISOString().split('T')[0],
                    weight: typeof data.weight === 'number' ? data.weight : 0
                };
            });
        }
        catch (error) {
            console.error('Error getting weight history:', error);
            if (error.code === 'permission-denied') {
                throw new Error('Permission denied. Please check your authentication.');
            }
            throw new Error('Failed to fetch weight history. Please try again.');
        }
    },
    async addEntry(userId, weight) {
        try {
            if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
                throw new Error('Invalid user ID provided');
            }
            if (typeof weight !== 'number' || isNaN(weight)) {
                throw new Error('Weight must be a valid number');
            }
            if (weight <= 0 || weight > 1000) {
                throw new Error('Weight must be between 0.1 and 1000 kg');
            }
            const weightRef = collection(db, 'users', userId, 'weight');
            const dateStr = new Date().toISOString().split('T')[0];
            await addDoc(weightRef, {
                date: dateStr,
                weight: Math.round(weight * 10) / 10 // Round to 1 decimal place
            });
            // Also update the user's profile with the latest weight
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                weightKg: Math.round(weight * 10) / 10
            });
            // Log activity
            try {
                const { logUserActivity } = await import('./firebase-user-preferences-service');
                await logUserActivity(userId, {
                    type: 'weight_logged',
                    metadata: { weight: Math.round(weight * 10) / 10, date: dateStr },
                });
            }
            catch (logError) {
                console.error('Error logging weight activity:', logError);
                // Don't throw - activity logging failure shouldn't break the main operation
            }
            return this.getHistory(userId);
        }
        catch (error) {
            console.error('Error adding weight entry:', error);
            if (error.code === 'permission-denied') {
                throw new Error('Permission denied. Please check your authentication.');
            }
            if (error.message) {
                throw error;
            }
            throw new Error('Failed to save weight entry. Please try again.');
        }
    }
};
// Workouts service
export const workoutService = {
    async getLogs(userId) {
        try {
            if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
                throw new Error('Invalid user ID provided');
            }
            const logsRef = collection(db, 'users', userId, 'workouts');
            const q = query(logsRef, orderBy('date', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    date: data.date || new Date().toISOString().split('T')[0],
                    exerciseId: data.exerciseId || '',
                    durationMinutes: typeof data.durationMinutes === 'number' ? data.durationMinutes : 0,
                    intensity: data.intensity || 'medium',
                    caloriesBurned: typeof data.caloriesBurned === 'number' ? data.caloriesBurned : 0,
                    notes: data.notes || undefined
                };
            });
        }
        catch (error) {
            console.error('Error getting workout logs:', error);
            if (error.code === 'permission-denied') {
                throw new Error('Permission denied. Please check your authentication.');
            }
            throw new Error('Failed to fetch workout logs. Please try again.');
        }
    },
    async logWorkout(userId, data) {
        try {
            if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
                throw new Error('Invalid user ID provided');
            }
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid workout data provided');
            }
            if (!data.exerciseId || typeof data.exerciseId !== 'string' || data.exerciseId.trim().length === 0) {
                throw new Error('Exercise ID is required');
            }
            if (typeof data.durationMinutes !== 'number' || isNaN(data.durationMinutes) || data.durationMinutes < 0) {
                throw new Error('Duration must be a valid positive number');
            }
            if (typeof data.durationMinutes === 'number' && data.durationMinutes > 1440) {
                throw new Error('Duration cannot exceed 24 hours (1440 minutes)');
            }
            if (!['low', 'medium', 'high'].includes(data.intensity)) {
                throw new Error('Intensity must be low, medium, or high');
            }
            if (typeof data.caloriesBurned !== 'number' || isNaN(data.caloriesBurned) || data.caloriesBurned < 0) {
                throw new Error('Calories burned must be a valid positive number');
            }
            if (!data.date || typeof data.date !== 'string' || data.date.trim().length === 0) {
                throw new Error('Workout date is required');
            }
            const logsRef = collection(db, 'users', userId, 'workouts');
            await addDoc(logsRef, {
                ...data,
                durationMinutes: Math.round(data.durationMinutes * 10) / 10,
                caloriesBurned: Math.round(data.caloriesBurned)
            });
            return this.getLogs(userId);
        }
        catch (error) {
            console.error('Error logging workout:', error);
            if (error.code === 'permission-denied') {
                throw new Error('Permission denied. Please check your authentication.');
            }
            if (error.message) {
                throw error;
            }
            throw new Error('Failed to save workout. Please try again.');
        }
    }
};
// Exercise service
export const exerciseService = {
    async getExercises() {
        // You can implement a Firestore-based source if preferred later
        // For now, return an empty array or load from seed data as needed
        return [];
    }
};
