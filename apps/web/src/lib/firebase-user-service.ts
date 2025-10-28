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
  const docRef = doc(db, usersCollection, user.uid);
  await setDoc(docRef, user, { merge: true });
}

export async function updateUserProfile(uid: string, updates: Partial<User>) {
  console.log('firebase-user-service - updateUserProfile called with:', { uid, updates });
  const docRef = doc(db, usersCollection, uid);
  console.log('firebase-user-service - Document reference created:', docRef.path);
  // Ensure uid is included in the updates
  const updatesWithUid = { ...updates, uid };
  // Use setDoc with merge: true so it creates the document if it doesn't exist
  await setDoc(docRef, updatesWithUid, { merge: true });
  console.log('firebase-user-service - setDoc completed successfully');
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
    theme: "system"
  };
  
  await saveUserToFirestore(initialUser);
  return initialUser;
}