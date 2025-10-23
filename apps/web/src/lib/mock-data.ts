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
  notes?: string;
}

// Mock weight history
export const mockWeightHistory: WeightEntry[] = [
  { date: '2025-10-16', weight: 71.2 },
  { date: '2025-10-17', weight: 71.0 },
  { date: '2025-10-18', weight: 70.8 },
  { date: '2025-10-19', weight: 70.5 },
  { date: '2025-10-20', weight: 70.3 },
  { date: '2025-10-21', weight: 70.2 },
  { date: '2025-10-22', weight: 70.0 },
];

// Mock exercises
export const mockExercises: Exercise[] = [
  {
    id: 'ex1',
    name: 'Running',
    description: 'Outdoor or treadmill running for cardiovascular fitness',
    category: 'cardio',
    imageUrl: 'https://example.com/running.jpg'
  },
  {
    id: 'ex2',
    name: 'Push-ups',
    description: 'Basic bodyweight exercise for upper body strength',
    category: 'strength',
    imageUrl: 'https://example.com/pushups.jpg'
  },
  {
    id: 'ex3',
    name: 'Yoga Flow',
    description: 'Dynamic stretching and flexibility routine',
    category: 'stretching',
    imageUrl: 'https://example.com/yoga.jpg'
  },
  {
    id: 'ex4',
    name: 'HIIT Workout',
    description: 'High-intensity interval training for full body conditioning',
    category: 'full_body',
    imageUrl: 'https://example.com/hiit.jpg'
  },
];

// Mock workout logs
export const mockWorkoutLogs: WorkoutLog[] = [
  {
    id: 'w1',
    date: '2025-10-22',
    exerciseId: 'ex1',
    durationMinutes: 30,
    notes: 'Morning run - felt great!'
  },
  {
    id: 'w2',
    date: '2025-10-21',
    exerciseId: 'ex2',
    durationMinutes: 20,
    notes: '3 sets of 15 reps'
  },
];