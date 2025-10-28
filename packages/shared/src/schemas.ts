import { z } from "zod";

export const ThemeEnum = z.enum(["light", "dark", "system"]);

export const UserSchema = z.object({
  uid: z.string(),
  name: z.string().min(2),
  email: z.string().email(), // required email
  age: z.number().min(13),
  weightKg: z.number().positive(),
  heightCm: z.number().positive().optional(),
  fitnessGoal: z.string().optional(),
  theme: ThemeEnum.default("system"),
});

export const ExerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(["cardio", "strength", "stretching", "full_body"]),
  imageUrl: z.string().url(),
});

export const LogEntryInputSchema = z.object({
  workoutId: z.string(),
  durationSeconds: z.number().positive(),
  notes: z.string().optional(),
  date: z.coerce.date().default(() => new Date()),
});

export const GoalSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  target: z.number().positive(),
  current: z.number().min(0),
  unit: z.string().min(1, "Unit is required"),
  category: z.enum(["weight"]),
  deadline: z.string(),
  createdAt: z.string().optional(),
});

export const ScheduleItemSchema = z.object({
  time: z.string(),
  activity: z.string(),
});

export const ScheduleSchema = z.object({
  id: z.string(),
  monday: z.array(ScheduleItemSchema).default([]),
  tuesday: z.array(ScheduleItemSchema).default([]),
  wednesday: z.array(ScheduleItemSchema).default([]),
  thursday: z.array(ScheduleItemSchema).default([]),
  friday: z.array(ScheduleItemSchema).default([]),
  saturday: z.array(ScheduleItemSchema).default([]),
  sunday: z.array(ScheduleItemSchema).default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;
export type Exercise = z.infer<typeof ExerciseSchema>;
export type LogEntryInput = z.infer<typeof LogEntryInputSchema>;
export type Goal = z.infer<typeof GoalSchema>;
export type ScheduleItem = z.infer<typeof ScheduleItemSchema>;
export type Schedule = z.infer<typeof ScheduleSchema>;


