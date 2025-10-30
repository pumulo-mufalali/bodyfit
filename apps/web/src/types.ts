import type { User, Exercise } from '@myfitness/shared';
import type { WeightEntry, WorkoutLog } from './lib/firebase-data-service';

export interface ProfileProps {
  profile: User;
  onUpdateName: (name: string) => void;
  isUpdating: boolean;
}

export interface WeightChartProps {
  weightHistory: WeightEntry[];
  currentWeight: number;
  onAddWeight: (weight: string) => void;
  isAdding: boolean;
}

export interface WorkoutLoggerProps {
  exercises: Exercise[];
  selectedExercise: string;
  workoutDuration: string;
  workoutNotes: string;
  onExerciseChange: (exerciseId: string) => void;
  onDurationChange: (duration: string) => void;
  onNotesChange: (notes: string) => void;
  onLogWorkout: () => void;
  isLoading: boolean;
}

export interface RecentWorkoutsProps {
  workouts: WorkoutLog[];
  exercises: Exercise[];
}

export interface ProgressSummaryProps {
  workouts: WorkoutLog[];
  weightChange: number;
}