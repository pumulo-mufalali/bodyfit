import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import type { Goal } from "@myfitness/shared";

const goalsCollection = "goals";

export async function getUserGoals(userId: string): Promise<Goal[]> {
  const goalsRef = collection(db, "users", userId, goalsCollection);
  const q = query(goalsRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Goal[];
}

export async function createGoal(userId: string, goalData: Omit<Goal, "id">): Promise<Goal> {
  const goalsRef = collection(db, "users", userId, goalsCollection);
  const newGoal = {
    ...goalData,
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(goalsRef, newGoal);
  
  return {
    id: docRef.id,
    ...newGoal,
  } as Goal;
}

export async function updateGoal(userId: string, goalId: string, updates: Partial<Omit<Goal, "id" | "createdAt">>): Promise<void> {
  const goalRef = doc(db, "users", userId, goalsCollection, goalId);
  await updateDoc(goalRef, updates);
}

export async function deleteGoal(userId: string, goalId: string): Promise<void> {
  const goalRef = doc(db, "users", userId, goalsCollection, goalId);
  await deleteDoc(goalRef);
}

