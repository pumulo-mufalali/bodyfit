import { collection, doc, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import type { WorkoutLog } from './mock-data';

// Weight service
export const weightService = {
  async getHistory(userId: string) {
    const weightRef = collection(db, 'users', userId, 'weight');
    const q = query(weightRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  async addEntry(userId: string, weight: number) {
    const weightRef = collection(db, 'users', userId, 'weight');
    await addDoc(weightRef, {
      date: new Date().toISOString().split('T')[0],
      weight
    });
    return this.getHistory(userId);
  }
};

// Workouts service
export const workoutService = {
  async getLogs(userId: string): Promise<WorkoutLog[]> {
    const logsRef = collection(db, 'users', userId, 'workouts');
    const q = query(logsRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkoutLog));
  },
  async logWorkout(userId: string, data: Omit<WorkoutLog, 'id'>) {
    const logsRef = collection(db, 'users', userId, 'workouts');
    await addDoc(logsRef, data);
    return this.getLogs(userId);
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
