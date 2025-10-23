import { UserSchema } from "@myfitness/shared";
import { z } from "zod";
import { mockExercises, mockWeightHistory, mockWorkoutLogs, WeightEntry, WorkoutLog } from "./mock-data";

type User = z.infer<typeof UserSchema>;

// Simple in-memory mock DB
let mockUser: User = {
  uid: "demo",
  name: "Demo",
  age: 25,
  weightKg: 70,
  theme: "system",
  fitnessGoal: "Build strength and improve endurance"
};

// HTTP API client
const API_BASE_URL = "https://api.myfitness.app";

export const api = {
  user: {
    getProfile: async (): Promise<User> => {
      return mockUser;
    },
    
    updateProfile: async (input: Partial<User>): Promise<User> => {
      mockUser = { ...mockUser, ...input };
      return mockUser;
    }
  },

  weight: {
    getHistory: async (): Promise<WeightEntry[]> => {
      return mockWeightHistory;
    },

    addEntry: async (weight: number): Promise<WeightEntry[]> => {
      const newEntry = {
        date: new Date().toISOString().split('T')[0],
        weight
      };
      mockWeightHistory.push(newEntry);
      return mockWeightHistory;
    }
  },

  workouts: {
    getExercises: async () => {
      return mockExercises;
    },

    getLogs: async (): Promise<WorkoutLog[]> => {
      return mockWorkoutLogs;
    },

    logWorkout: async (log: Omit<WorkoutLog, 'id'>): Promise<WorkoutLog> => {
      const newLog = {
        ...log,
        id: `w${mockWorkoutLogs.length + 1}`
      };
      mockWorkoutLogs.push(newLog);
      return newLog;
    }
  }
};


