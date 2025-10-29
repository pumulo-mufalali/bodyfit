import { mockExercises, mockWeightHistory, mockWorkoutLogs } from "./mock-data";

// HTTP API client
const API_BASE_URL = "https://api.myfitness.app";
export const api = {
    user: {
        getProfile: async () => {
            return mockUser;
        },
        updateProfile: async (input) => {
            mockUser = { ...mockUser, ...input };
            return mockUser;
        }
    },
    weight: {
        getHistory: async () => {
            return mockWeightHistory;
        },
        addEntry: async (weight) => {
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
        getLogs: async () => {
            return mockWorkoutLogs;
        },
        logWorkout: async (log) => {
            const newLog = {
                ...log,
                id: `w${mockWorkoutLogs.length + 1}`
            };
            mockWorkoutLogs.push(newLog);
            return newLog;
        }
    }
};
