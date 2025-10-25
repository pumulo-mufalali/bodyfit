import { Exercise } from '@myfitness/shared';

export interface WeightEntry {
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

// Mock weight history
export const mockWeightHistory: WeightEntry[] = [
  {
    date: '2025-10-16',
    weight: 71.2,
  },
  {
    date: '2025-10-17',
    weight: 71.0,
  },
  {
    date: '2025-10-18',
    weight: 70.8,
  },
  {
    date: '2025-10-19',
    weight: 70.5,
  },
  {
    date: '2025-10-20',
    weight: 70.3,
  },
  {
    date: '2025-10-21',
    weight: 70.2,
  },
  {
    date: '2025-10-22',
    weight: 70.0,
  },
];

// Mock exercises
export const mockExercises: Exercise[] = [
  {
    id: 'ex1',
    name: 'Running',
    description: 'Outdoor or treadmill running for cardiovascular fitness',
    category: 'cardio',
    imageUrl: 'https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif',
  },

  {
    id: 'ex2',
    name: 'Push-ups',
    description: 'Basic bodyweight exercise for upper body strength',
    category: 'strength',
    imageUrl: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
  },

  {
    id: 'ex3',
    name: 'Yoga Flow',
    description: 'Dynamic stretching and flexibility routine',
    category: 'stretching',
    imageUrl: 'https://media.giphy.com/media/3o6ZtaO9BZHcOjmErm/giphy.gif',
  },

  {
    id: 'ex4',
    name: 'HIIT Workout',
    description: 'High-intensity interval training for full body conditioning',
    category: 'full_body',
    imageUrl: 'https://media.giphy.com/media/26xBwdIuRJiAiWithi/giphy.gif',
  },
];

// Mock workout logs
export const mockWorkoutLogs: WorkoutLog[] = [
  {
    id: 'w1',
    date: '2025-10-22',
    exerciseId: 'ex1',
    durationMinutes: 30,
    intensity: 'high',
    caloriesBurned: 320,
    notes: 'Morning run - felt great!',
  },

  {
    id: 'w2',
    date: '2025-10-21',
    exerciseId: 'ex2',
    durationMinutes: 20,
    intensity: 'medium',
    caloriesBurned: 180,
    notes: '3 sets of 15 reps',
  },

  {
    id: 'w3',
    date: '2025-10-20',
    exerciseId: 'ex3',
    durationMinutes: 45,
    intensity: 'low',
    caloriesBurned: 160,
    notes: 'Evening yoga session',
  },

  {
    id: 'w4',
    date: '2025-10-19',
    exerciseId: 'ex4',
    durationMinutes: 25,
    intensity: 'high',
    caloriesBurned: 280,
    notes: 'HIIT circuit training',
  },

  {
    id: 'w5',
    date: '2025-10-18',
    exerciseId: 'ex1',
    durationMinutes: 35,
    intensity: 'medium',
    caloriesBurned: 350,
    notes: 'Afternoon jog',
  },
];