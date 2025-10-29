import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { User } from "@myfitness/shared";

const usersCollection = "users";

export async function getUserFromFirestore(uid: string): Promise<User | null> {
  const docRef = doc(db, usersCollection, uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return docSnap.data() as User;
}

export async function saveUserToFirestore(user: User) {
  try {
    if (!user || !user.uid || typeof user.uid !== 'string' || user.uid.trim().length === 0) {
      throw new Error('Invalid user data: user ID is required');
    }

    if (!user.email || typeof user.email !== 'string' || !user.email.includes('@')) {
      throw new Error('Invalid user data: valid email is required');
    }

    if (!user.name || typeof user.name !== 'string' || user.name.trim().length < 2) {
      throw new Error('Invalid user data: name must be at least 2 characters');
    }

    const docRef = doc(db, usersCollection, user.uid);
    await setDoc(docRef, user, { merge: true });
  } catch (error: any) {
    console.error('Error saving user to Firestore:', error);
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check your authentication.');
    }
    throw error;
  }
}

export async function updateUserProfile(uid: string, updates: Partial<User>) {
  try {
    if (!uid || typeof uid !== 'string' || uid.trim().length === 0) {
      throw new Error('Invalid user ID provided');
    }

    if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
      throw new Error('No update data provided');
    }

    // Validate email if provided
    if (updates.email !== undefined) {
      if (!updates.email || typeof updates.email !== 'string' || !updates.email.includes('@')) {
        throw new Error('Invalid email format');
      }
    }

    // Validate name if provided
    if (updates.name !== undefined) {
      if (!updates.name || typeof updates.name !== 'string' || updates.name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }
    }

    // Validate age if provided
    if (updates.age !== undefined) {
      if (typeof updates.age !== 'number' || updates.age < 0 || updates.age > 150) {
        throw new Error('Age must be a valid number between 0 and 150');
      }
    }

    // Validate weight if provided
    if (updates.weightKg !== undefined) {
      if (typeof updates.weightKg !== 'number' || updates.weightKg < 0 || updates.weightKg > 1000) {
        throw new Error('Weight must be a valid number between 0 and 1000 kg');
      }
    }

    // Validate height if provided
    if (updates.heightCm !== undefined) {
      if (typeof updates.heightCm !== 'number' || updates.heightCm < 0 || updates.heightCm > 300) {
        throw new Error('Height must be a valid number between 0 and 300 cm');
      }
    }

    const docRef = doc(db, usersCollection, uid);
    const updatesWithUid = { ...updates, uid };
    await setDoc(docRef, updatesWithUid, { merge: true });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check your authentication.');
    }
    if (error.code === 'unavailable') {
      throw new Error('Service temporarily unavailable. Please try again later.');
    }
    throw error;
  }
}

export async function createInitialUserProfile(uid: string, email: string, displayName?: string): Promise<User> {
  const initialUser: User = {
    uid,
    name: displayName || email.split('@')[0] || 'User',
    email,
    age: 0, // User needs to set this
    weightKg: 0, // User needs to set this
    heightCm: 0, // User needs to set this
    fitnessGoal: "", // User needs to set this
    theme: "system",
    units: "metric",
    language: "en",
    privacy: "private",
    notifications: {
      workoutReminders: true,
      goalAchievements: true,
      weeklyProgress: false,
    },
    dataSharing: true,
    activityTracking: true,
  };
  
  await saveUserToFirestore(initialUser);
  return initialUser;
}