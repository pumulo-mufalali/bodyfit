import { collection, doc, getDocs, addDoc, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Exercise } from '@myfitness/shared';
import { withResilience } from '../utils/resilient-client';

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
}

export interface WorkoutLog {
  id: string;
  date: string;
  exerciseId: string;
  durationMinutes: number;
  intensity: 'low' | 'medium' | 'high';
  caloriesBurned: number;
  notes?: string;
}

// Weight service
export const weightService = {
  async getHistory(userId: string): Promise<WeightEntry[]> {
    return withResilience(async () => {
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
        } as WeightEntry;
      });
    }, {
      serviceName: 'firestore-weight',
      retry: {
        maxAttempts: 3,
        shouldRetry: (error) => {
          // Don't retry permission errors
          if (error?.code === 'permission-denied') {
            return false;
          }
          return true;
        }
      },
      circuitBreaker: {
        failureThreshold: 5,
        resetTimeoutMs: 30000
      }
    }).catch((error: any) => {
      console.error('Error getting weight history:', error);
      if (error.code === 'permission-denied') {
        throw new Error('Permission denied. Please check your authentication.');
      }
      throw new Error('Failed to fetch weight history. Please try again.');
    });
  },
  async addEntry(userId: string, weight: number) {
    return withResilience(async () => {
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
      
      // Log activity (non-blocking)
      try {
        const { logUserActivity } = await import('./firebase-user-preferences-service');
        await logUserActivity(userId, {
          type: 'weight_logged',
          metadata: { weight: Math.round(weight * 10) / 10, date: dateStr },
        });
      } catch (logError) {
        console.error('Error logging weight activity:', logError);
        // Don't throw - activity logging failure shouldn't break the main operation
      }
      
      return this.getHistory(userId);
    }, {
      serviceName: 'firestore-weight',
      retry: {
        maxAttempts: 3,
        shouldRetry: (error) => {
          // Don't retry validation errors or permission errors
          if (error?.code === 'permission-denied' || error?.message?.includes('must be')) {
            return false;
          }
          return true;
        }
      },
      circuitBreaker: {
        failureThreshold: 5,
        resetTimeoutMs: 30000
      }
    }).catch((error: any) => {
      console.error('Error adding weight entry:', error);
      if (error.code === 'permission-denied') {
        throw new Error('Permission denied. Please check your authentication.');
      }
      if (error.message) {
        throw error;
      }
      throw new Error('Failed to save weight entry. Please try again.');
    });
  }
};

// Workouts service
export const workoutService = {
  async getLogs(userId: string): Promise<WorkoutLog[]> {
    return withResilience(async () => {
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
        } as WorkoutLog;
      });
    }, {
      serviceName: 'firestore-workouts',
      retry: {
        maxAttempts: 3,
        shouldRetry: (error) => {
          if (error?.code === 'permission-denied') {
            return false;
          }
          return true;
        }
      },
      circuitBreaker: {
        failureThreshold: 5,
        resetTimeoutMs: 30000
      }
    }).catch((error: any) => {
      console.error('Error getting workout logs:', error);
      if (error.code === 'permission-denied') {
        throw new Error('Permission denied. Please check your authentication.');
      }
      throw new Error('Failed to fetch workout logs. Please try again.');
    });
  },
  async logWorkout(userId: string, data: Omit<WorkoutLog, 'id'>) {
    return withResilience(async () => {
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
    }, {
      serviceName: 'firestore-workouts',
      retry: {
        maxAttempts: 3,
        shouldRetry: (error) => {
          // Don't retry validation errors or permission errors
          if (error?.code === 'permission-denied' || error?.message?.includes('must be') || error?.message?.includes('required')) {
            return false;
          }
          return true;
        }
      },
      circuitBreaker: {
        failureThreshold: 5,
        resetTimeoutMs: 30000
      }
    }).catch((error: any) => {
      console.error('Error logging workout:', error);
      if (error.code === 'permission-denied') {
        throw new Error('Permission denied. Please check your authentication.');
      }
      if (error.message) {
        throw error;
      }
      throw new Error('Failed to save workout. Please try again.');
    });
  }
};

// Exercise service
export const exerciseService = {
  async getExercises(): Promise<Exercise[]> {
    return withResilience(async () => {
      const exercisesRef = collection(db, 'exercises');
      const snapshot = await getDocs(exercisesRef);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
          description: data.description || '',
          category: data.category || 'cardio',
          imageUrl: data.imageUrl || ''
        } as Exercise;
      });
    }, {
      serviceName: 'firestore-exercises',
      retry: {
        maxAttempts: 3,
        shouldRetry: (error) => {
          if (error?.code === 'permission-denied') {
            return false;
          }
          return true;
        }
      },
      circuitBreaker: {
        failureThreshold: 5,
        resetTimeoutMs: 30000
      }
    }).catch((error: any) => {
      console.error('Error getting exercises:', error);
      if (error.code === 'permission-denied') {
        throw new Error('Permission denied. Please check your authentication.');
      }
      throw new Error('Failed to fetch exercises. Please try again.');
    });
  },
  
  async getExerciseById(exerciseId: string): Promise<Exercise | undefined> {
    return withResilience(async () => {
      const exercises = await this.getExercises();
      return exercises.find(ex => ex.id === exerciseId);
    }, {
      serviceName: 'firestore-exercises',
      retry: {
        maxAttempts: 2
      }
    }).catch((error: any) => {
      console.error('Error getting exercise by ID:', error);
      throw error;
    });
  }
};
