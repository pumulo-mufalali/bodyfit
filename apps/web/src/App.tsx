import React from 'react';
import DashboardLayout from './components/DashboardLayout';
import { ThemeToggle } from './components/theme-toggle';
import ProfilePage from './components/ProfilePage';
import { useState } from 'react';
import { WeightChart } from './components/WeightChart';
import { WorkoutLogger } from './components/WorkoutLogger';
import { RecentWorkouts } from './components/RecentWorkouts';
import { ProgressSummary } from './components/ProgressSummary';
import { MotivationCard } from './components/MotivationCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from './lib/api';
import type { User, Exercise } from '@myfitness/shared';
import type { WeightEntry, WorkoutLog } from './lib/mock-data';
import MyGoalsPage from './pages/MyGoalsPage';
import GifViewer from './pages/GifViewer';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './providers/auth-provider';

function DashboardApp() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [newWeight, setNewWeight] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [workoutNotes, setWorkoutNotes] = useState("");

  const { data: profile, isLoading: profileLoading } = useQuery<User>({
    queryKey: ['user', 'profile'],
    queryFn: api.user.getProfile
  });

  const { data: weightHistory = [] } = useQuery<WeightEntry[]>({
    queryKey: ['weight', 'history'],
    queryFn: api.weight.getHistory
  });

  const { data: exercises = [] } = useQuery<Exercise[]>({
    queryKey: ['workouts', 'exercises'],
    queryFn: api.workouts.getExercises
  });

  const { data: workoutLogs = [] } = useQuery<WorkoutLog[]>({
    queryKey: ['workouts', 'logs'],
    queryFn: api.workouts.getLogs
  });

  const updateProfileMutation = useMutation({
    mutationFn: (input: Partial<User>) => api.user.updateProfile(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    }
  });

  const addWeightMutation = useMutation({
    mutationFn: (weight: number) => api.weight.addEntry(weight),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight', 'history'] });
      setNewWeight("");
    }
  });

  const logWorkoutMutation = useMutation({
    mutationFn: (data: Omit<WorkoutLog, 'id'>) => api.workouts.logWorkout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts', 'logs'] });
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

  const [showProfilePage, setShowProfilePage] = useState(false);
  const [activePage, setActivePage] = useState<'dashboard' | 'profile' | 'goals' | 'gifs' | 'achievements'>('dashboard');
  const [selectedGifId, setSelectedGifId] = useState<string | null>(null);

  return (
    <div>
      <DashboardLayout
        profile={profile}
        onNav={(p: string) => setActivePage(p as any)}
        onOpenGif={(id: string) => { setSelectedGifId(id); setActivePage('gifs'); }}
        centerPage={activePage}
      />

      {/* Render GifViewer as an overlay when requested */}
      {activePage === 'gifs' && (
        <GifViewer exerciseId={selectedGifId} onBack={() => setActivePage('dashboard')} />
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