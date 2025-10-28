import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import GifViewer from "./pages/GifViewer";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import ExercisesPage from "./pages/ExercisesPage";
import { useAuth } from "./providers/auth-provider";
import { weightService, workoutService, exerciseService } from "./lib/firebase-data-service";
import type { User, Exercise } from "@myfitness/shared";
import type { WeightEntry, WorkoutLog } from "./lib/mock-data"; // Or move to shared, update as needed

function DashboardApp() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [newWeight, setNewWeight] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [workoutNotes, setWorkoutNotes] = useState("");

  // Use only Firebase services, no more mock api.
  const { data: weightHistory = [] } = useQuery<WeightEntry[]>({
    queryKey: ['weight', 'history', user?.uid],
    queryFn: () => user?.uid ? weightService.getHistory(user.uid) : Promise.resolve([]),
    enabled: !!user?.uid,
  });
  const { data: exercises = [] } = useQuery<Exercise[]>({
    queryKey: ['exercises'],
    queryFn: exerciseService.getExercises,
  });
  const { data: workoutLogs = [] } = useQuery<WorkoutLog[]>({
    queryKey: ['workouts', 'logs', user?.uid],
    queryFn: () => user?.uid ? workoutService.getLogs(user.uid) : Promise.resolve([]),
    enabled: !!user?.uid,
  });

  const addWeightMutation = useMutation({
    mutationFn: (weight: number) => user ? weightService.addEntry(user.uid, weight) : Promise.resolve([]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight', 'history', user?.uid] });
      setNewWeight("");
    }
  });

  const logWorkoutMutation = useMutation({
    mutationFn: (data: Omit<WorkoutLog, 'id'>) => user ? workoutService.logWorkout(user.uid, data) : Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts', 'logs', user?.uid] });
      setSelectedExercise("");
      setWorkoutDuration("");
      setWorkoutNotes("");
    }
  });

  const handleLogWorkout = () => {
    if (selectedExercise && workoutDuration) {
      const dateStr = new Date().toISOString().split('T')[0]!;
      const dur = parseInt(workoutDuration);
      const intensity: 'low' | 'medium' | 'high' = dur < 20 ? 'low' : dur <= 40 ? 'medium' : 'high';
      const caloriesBurned = Math.round(dur * 8); // simple estimate
      logWorkoutMutation.mutate({
        exerciseId: selectedExercise,
        durationMinutes: dur,
        intensity,
        caloriesBurned,
        date: dateStr,
        notes: workoutNotes || undefined
      } as any);
    }
  };

  const [activePage, setActivePage] = useState<'dashboard' | 'profile' | 'goals' | 'gifs' | 'achievements' | 'exercises'>('dashboard');
  const [selectedGifId, setSelectedGifId] = useState<string | null>(null);

  return (
    <div>
      {activePage === 'exercises' ? (
        <ExercisesPage onBack={() => setActivePage('dashboard')} />
      ) : (
        <>
          <DashboardLayout
            onNav={(p: string) => setActivePage(p as any)}
            onOpenGif={(id: string) => { setSelectedGifId(id); setActivePage('gifs'); }}
            centerPage={activePage}
          />
          {/* Gif Viewer and profile etc. to render here as needed by your nav logic, e.g. ProfilePage */}
          {activePage === 'gifs' && (
            <GifViewer exerciseId={selectedGifId} onBack={() => setActivePage('dashboard')} />
          )}
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ProtectedRoute>
      <DashboardApp />
    </ProtectedRoute>
  );
}