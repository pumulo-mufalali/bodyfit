import { jsx as _jsx } from "react/jsx-runtime";
import DashboardLayout from './components/DashboardLayout';
import ProfilePage from './components/ProfilePage';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './lib/api';
import MyGoalsPage from './pages/MyGoalsPage';
import GifViewer from './pages/GifViewer';
export default function App() {
    const queryClient = useQueryClient();
    const [newWeight, setNewWeight] = useState("");
    const [selectedExercise, setSelectedExercise] = useState("");
    const [workoutDuration, setWorkoutDuration] = useState("");
    const [workoutNotes, setWorkoutNotes] = useState("");
    const { data: profile, isLoading: profileLoading } = useQuery({
        queryKey: ['user', 'profile'],
        queryFn: api.user.getProfile
    });
    const { data: weightHistory = [] } = useQuery({
        queryKey: ['weight', 'history'],
        queryFn: api.weight.getHistory
    });
    const { data: exercises = [] } = useQuery({
        queryKey: ['workouts', 'exercises'],
        queryFn: api.workouts.getExercises
    });
    const { data: workoutLogs = [] } = useQuery({
        queryKey: ['workouts', 'logs'],
        queryFn: api.workouts.getLogs
    });
    const updateProfileMutation = useMutation({
        mutationFn: (input) => api.user.updateProfile(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
        }
    });
    const addWeightMutation = useMutation({
        mutationFn: (weight) => api.weight.addEntry(weight),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['weight', 'history'] });
            setNewWeight("");
        }
    });
    const logWorkoutMutation = useMutation({
        mutationFn: (data) => api.workouts.logWorkout(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workouts', 'logs'] });
            setSelectedExercise("");
            setWorkoutDuration("");
            setWorkoutNotes("");
        }
    });
    const handleLogWorkout = () => {
        if (selectedExercise && workoutDuration) {
            const dateStr = new Date().toISOString().split('T')[0];
            const dur = parseInt(workoutDuration);
            const intensity = dur < 20 ? 'low' : dur <= 40 ? 'medium' : 'high';
            const caloriesBurned = Math.round(dur * 8); // simple estimate
            logWorkoutMutation.mutate({
                exerciseId: selectedExercise,
                durationMinutes: dur,
                intensity,
                caloriesBurned,
                date: dateStr,
                notes: workoutNotes || undefined
            });
        }
    };
    const [showProfilePage, setShowProfilePage] = useState(false);
    const [activePage, setActivePage] = useState('dashboard');
    const [selectedGifId, setSelectedGifId] = useState(null);
    return (_jsx("div", { children: activePage === 'profile' ? (_jsx(ProfilePage, { onClose: () => setActivePage('dashboard') })) : activePage === 'goals' ? (_jsx(MyGoalsPage, { onBack: () => setActivePage('dashboard') })) : activePage === 'gifs' ? (_jsx(GifViewer, { exerciseId: selectedGifId, onBack: () => setActivePage('dashboard') })) : (_jsx(DashboardLayout, { profile: profile, onNav: (p) => setActivePage(p), onOpenGif: (id) => { setSelectedGifId(id); setActivePage('gifs'); } })) }));
}
