import { collection, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { Schedule, ScheduleItem } from "@myfitness/shared";

const schedulesCollection = "schedules";

export async function getUserSchedule(userId: string): Promise<Schedule | null> {
  const scheduleRef = doc(db, "users", userId, schedulesCollection, "weekly");
  const scheduleSnap = await getDoc(scheduleRef);
  
  if (!scheduleSnap.exists()) return null;
  
  return {
    id: scheduleSnap.id,
    ...scheduleSnap.data(),
  } as Schedule;
}

export async function createUserSchedule(userId: string, scheduleData: Omit<Schedule, "id">): Promise<Schedule> {
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
  } as Schedule;
}

export async function updateUserSchedule(userId: string, scheduleData: Partial<Omit<Schedule, "id" | "createdAt">>): Promise<void> {
  const scheduleRef = doc(db, "users", userId, schedulesCollection, "weekly");
  await setDoc(scheduleRef, { ...scheduleData, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function deleteUserSchedule(userId: string): Promise<void> {
  const scheduleRef = doc(db, "users", userId, schedulesCollection, "weekly");
  await deleteDoc(scheduleRef);
}

