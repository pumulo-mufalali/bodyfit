import React from 'react';
import Sidebar from './Sidebar';
import HeaderBar from './HeaderBar';
import StatCard from './StatCard';
import StatsChart from './StatsChart';
import { motion } from 'framer-motion';

// Add Google Fonts for beautiful text
const titleFontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Cormorant+Garamond:wght@600&family=Merriweather:wght@700&display=swap');
`;

import ProgressModal from './ProgressModal';
import { MotivationCard } from './MotivationCard';
import type { WorkoutLog } from '../lib/mock-data';
import { useAuth } from '../providers/auth-provider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workoutService } from '../lib/firebase-data-service';
import { getUserGoals } from '../lib/firebase-goal-service';
import { getUserSchedule, createUserSchedule, deleteUserSchedule } from '../lib/firebase-schedule-service';
import type { Goal, Schedule, ScheduleItem } from '@myfitness/shared';

// Exercise images with names
const exerciseCategories = [
  {
    category: 'Cardio',
    exercises: [
      { id: 'ex1', name: 'Overhead Reach', imageUrl: 'https://media.self.com/photos/61157d860fba8918ef07da15/master/w_1600%2Cc_limit/SE_SEN_07_032_Cardio_GIF-01%2520Squat%2520to%2520Overhead%2520Reach-min.gif' },
      { id: 'ex2', name: 'Jumping Jacks', imageUrl: 'https://media.self.com/photos/61157e25553830ba14166ef2/master/w_1600%2Cc_limit/SE_SEN_07_032_Cardio_GIF-02%2520Modified%2520Jumping%2520Jacks-min.gif' },
      { id: 'ex3', name: 'Ice Skaters', imageUrl: 'https://media.self.com/photos/611581f6c66629131d52d34f/master/w_1600%2Cc_limit/SE_SEN_07_032_Cardio_GIF-13%2520Ice%2520Skaters-min.gif' },
      { id: 'ex4', name: 'Toe Taps With Reach', imageUrl: 'https://media.self.com/photos/61157ed6e1b6f66010ac3706/master/w_1600%2Cc_limit/SE_SEN_07_032_Cardio_GIF-04%2520Toe%2520Taps%2520With%2520Reach-min.gif' },
    ]
  },
  {
    category: 'Arms',
    exercises: [
      { id: 'ex5', name: 'Tricep Box Dips', imageUrl: 'https://media.self.com/photos/5c4a2f33203e3933090ec27b/master/w_1600%2Cc_limit/tricep-box-dips-Amanda_093.gif' },
      { id: 'ex6', name: 'Elevated Push Ups', imageUrl: 'https://media.self.com/photos/5c4a2e2601584d32459c06ce/master/w_1600%2Cc_limit/elevated-push-up-Amanda_091.gif' },
      { id: 'ex7', name: 'Diamond Push Ups', imageUrl: 'https://media.self.com/photos/5c41fa45a9cd1e7eb7fd0f2b/master/w_1600%2Cc_limit/diamond-push-up-Amanda_079.gif' },
      { id: 'ex8', name: 'Plank With T Rotation', imageUrl: 'https://media.self.com/photos/5c4b2809a9cd1e7eb7fd0f4d/master/w_1600%2Cc_limit/plank-with-t-rotation-Amanda_041.gif' },
    ]
  },
  {
    category: 'Legs',
    exercises: [
      { id: 'ex9', name: 'Split Squats', imageUrl: 'https://barbend.com/wp-content/uploads/2023/04/split-squat-barbend-movement-gif-masters.gif' },
      { id: 'ex10', name: 'Smith Machine Calf Raises', imageUrl: 'https://barbend.com/wp-content/uploads/2024/04/smith-machine-calf-raise-barbend-movement-gif-masters-1.gif' },
      { id: 'ex11', name: 'Nordic Hamstring Curls', imageUrl: 'https://barbend.com/wp-content/uploads/2023/03/nordic-hamstring-curl-barbend-movement-gif-masters.gif' },
      { id: 'ex12', name: 'Goblet Squats', imageUrl: 'https://barbend.com/wp-content/uploads/2023/12/goblet-squat-barbend-movement-gif-masters.gif' },
    ]
  },
  {
    category: 'Abs',
    exercises: [
      { id: 'ex13', name: 'Crunches', imageUrl: 'https://i.imgur.com/UJAnRhJ.gif' },
      { id: 'ex14', name: 'Russian Twist', imageUrl: 'https://i.imgur.com/PG6vgpl.gif' },
      { id: 'ex15', name: 'Side Jack-Knife', imageUrl: 'https://i.imgur.com/HjyLvkX.gif' },
      { id: 'ex16', name: 'Jack-knife ', imageUrl: 'https://i.imgur.com/CBH7Ejv.gif' },
    ]
  },
  {
    category: 'Stretches',
    exercises: [
      { id: 'ex17', name: 'Yoga Flow', imageUrl: 'https://assets.vogue.com/photos/5891df45fb0604bf1f5c6056/master/w_1600,c_limit/karlie-stretch-1.gif' },
      { id: 'ex18', name: 'Hamstring Stretch', imageUrl: 'https://assets.vogue.com/photos/5891df4a9c1609bf7a72e2eb/master/w_1600,c_limit/karlie-stretch-4.gif' },
      { id: 'ex19', name: 'Shoulder Stretch', imageUrl: 'https://assets.vogue.com/photos/5891df4b12a7b1df212c840d/master/w_1600,c_limit/karlie-stretch-5.gif' },
      { id: 'ex20', name: 'Neck Stretch', imageUrl: 'https://assets.vogue.com/photos/5891df48fb0604bf1f5c6058/master/w_1600,c_limit/karlie-stretch-3.gif' },
    ]
  },
];

// Helper to get last N days data
const getLastNDaysData = (days: number) => {
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    // Mock some consistent but random-looking data based on the date
    const value = Math.round(20 + Math.sin(date.getDate() / 3) * 5);
    result.push({ date: date.toISOString().split('T')[0], value });
  }
  return result;
};

import MyGoalsPage from '../pages/MyGoalsPage';
import ProfilePage from './ProfilePage';
import SchedulePage from '../pages/SchedulePage';
import CreateScheduleForm from './CreateScheduleForm';
import AchievementsPage from '../pages/AchievementsPage';
import DetailedStatsModal from './DetailedStatsModal';

export default function DashboardLayout({
  onNav,
  onOpenGif,
  centerPage,
}: {
  onNav?: (page: string) => void;
  onOpenGif?: (exerciseId: string) => void;
  centerPage?: 'dashboard' | 'goals' | 'gifs' | string;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Fetch user profile from Firebase to ensure we have the latest data
  const { data: userProfile } = useQuery({
    queryKey: ['user', 'profile', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      const { getUserFromFirestore } = await import('../lib/firebase-user-service');
      return getUserFromFirestore(user.uid);
    },
    enabled: !!user?.uid,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false,
  });
  
  // Use Firebase profile if available, otherwise fall back to auth context
  const currentUser = userProfile || (user ? {
    uid: user.uid,
    name: user.name,
    email: user.email,
    age: user.age,
    weightKg: user.weightKg,
    heightCm: user.heightCm,
    theme: user.theme as "light" | "dark" | "system",
    fitnessGoal: user.fitnessGoal
  } : null);

  // Get workout logs from Firebase
  const { data: workoutLogs = [] } = useQuery<WorkoutLog[]>({
    queryKey: ['workouts', 'logs', user?.uid],
    queryFn: () => workoutService.getLogs(user!.uid),
    enabled: !!user?.uid
  });

  // Get goals from Firebase for Goal Insights
  const { data: goals = [] } = useQuery<Goal[]>({
    queryKey: ['goals', user?.uid],
    queryFn: () => getUserGoals(user!.uid),
    enabled: !!user?.uid,
  });

  // Calculate goal statistics
  const goalsInProgress = goals.filter(goal => {
    const progress = (goal.current / goal.target) * 100;
    return progress > 0 && progress < 100;
  }).length;

  const completedGoals = goals.filter(goal => {
    const progress = (goal.current / goal.target) * 100;
    return progress >= 100;
  }).length;

  const averageCompletion = goals.length > 0
    ? Math.round(goals.reduce((sum, goal) => sum + Math.min(100, (goal.current / goal.target) * 100), 0) / goals.length)
    : 0;

  const labels = Array.from({ length: 12 }).map((_, i) => `W${i + 1}`);
  const [modalStat, setModalStat] = React.useState<null | {
    title: string;
    progress?: { value: number; total: number };
    data?: { date: string; value: number }[] | WorkoutLog[];
    isExercise?: boolean;
  }>(null);

  // click-and-drag horizontal scrolling refs/state
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const isDraggingRef = React.useRef(false);
  const startXRef = React.useRef(0);
  const scrollLeftRef = React.useRef(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [showCreateScheduleForm, setShowCreateScheduleForm] = React.useState(false);
  const [showDetailedStats, setShowDetailedStats] = React.useState(false);
  const [showEditInfoDialog, setShowEditInfoDialog] = React.useState(false);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('Cardio');
  const [showGifModal, setShowGifModal] = React.useState(false);
  const [selectedExercise, setSelectedExercise] = React.useState<{id: string, name: string, imageUrl: string} | null>(null);
  const [timerMinutes, setTimerMinutes] = React.useState(1);
  const [timerSeconds, setTimerSeconds] = React.useState(0);
  const [isTimerRunning, setIsTimerRunning] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  
  // Get schedule from Firebase
  const { data: schedule } = useQuery<Schedule | null>({
    queryKey: ['schedule', user?.uid],
    queryFn: () => getUserSchedule(user!.uid),
    enabled: !!user?.uid,
  });

  // Create schedule mutation
  const createScheduleMutation = useMutation({
    mutationFn: (scheduleData: Omit<Schedule, 'id'>) => createUserSchedule(user!.uid, scheduleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule', user?.uid] });
      setShowCreateScheduleForm(false);
    },
  });

  // Delete schedule mutation
  const deleteScheduleMutation = useMutation({
    mutationFn: () => deleteUserSchedule(user!.uid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule', user?.uid] });
      alert('Schedule deleted successfully!');
    },
  });

  // Data for StatCards and DetailedStatsModal
  const totalExercises = workoutLogs.length;
  const totalExerciseMinutes = workoutLogs.reduce((acc, log) => acc + log.durationMinutes, 0);
  const totalMeals = 6; // From StatCard
  const totalCalories = 1604; // From StatCard
  const averageSleep = 8; // From StatCard

  // Timer logic
  React.useEffect(() => {
    if (isTimerRunning && (timerMinutes > 0 || timerSeconds > 0)) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else if (timerMinutes > 0) {
            setTimerMinutes((prev) => prev - 1);
            return 59;
          } else {
            setIsTimerRunning(false);
            return 0;
          }
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, timerMinutes, timerSeconds]);

  const handleStartTimer = () => {
    setIsTimerRunning(true);
  };

  const handleStopTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerMinutes(1);
    setTimerSeconds(0);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    // capture the pointer on the element so we continue to receive events
    try {
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    } catch {}
    startXRef.current = e.clientX;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || !isDraggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    el.scrollLeft = scrollLeftRef.current - dx;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    } catch {}
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: titleFontStyle }} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-green-200/20 dark:bg-green-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <Sidebar profile={currentUser} onNav={onNav} />
        </div>

        <div className="lg:col-span-9 space-y-6">
          {centerPage === 'goals' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
                    <MyGoalsPage />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 space-y-6">
                    <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Goal Insights</div>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Goals in progress</div>
                        <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-2">{goalsInProgress}</div>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-xl border border-green-200/50 dark:border-green-700/50">
                        <div className="text-sm text-green-600 dark:text-green-400 font-medium">Completed goals</div>
                        <div className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">{completedGoals}</div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                        <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">Average completion</div>
                        <div className="text-3xl font-bold text-purple-700 dark:text-purple-300 mt-2">{averageCompletion}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : centerPage === 'profile' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
                  <ProfilePage onClose={() => onNav?.('dashboard')} />
                </div>
              </div>
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 space-y-6">
                  <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Account Details</div>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                      <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Member Since</div>
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-2">
                        {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-xl border border-green-200/50 dark:border-green-700/50">
                      <div className="text-sm text-green-600 dark:text-green-400 font-medium">Last Active</div>
                      <div className="text-2xl font-bold text-green-700 dark:text-green-300 mt-2">Today</div>
                    </div>
                    {/* BMI Health Status Component */}
                    {(() => {
                      const calculateBMI = () => {
                        if (!currentUser?.weightKg || !currentUser?.heightCm) return null;
                        if (currentUser.weightKg <= 0 || currentUser.heightCm <= 0) return null;
                        const heightInMeters = currentUser.heightCm / 100;
                        return (currentUser.weightKg / (heightInMeters * heightInMeters)).toFixed(1);
                      };
                      
                      const bmi = calculateBMI();
                      const getHealthStatus = () => {
                        if (!bmi) return null;
                        const bmiValue = parseFloat(bmi);
                        if (bmiValue < 18.5) return { status: 'Underweight', color: 'blue', bg: 'from-blue-50 to-cyan-100', text: 'text-blue-600', border: 'border-blue-200' };
                        if (bmiValue < 25) return { status: 'Normal', color: 'green', bg: 'from-green-50 to-emerald-100', text: 'text-green-600', border: 'border-green-200' };
                        if (bmiValue < 30) return { status: 'Overweight', color: 'yellow', bg: 'from-yellow-50 to-amber-100', text: 'text-yellow-600', border: 'border-yellow-200' };
                        return { status: 'Obese', color: 'red', bg: 'from-red-50 to-orange-100', text: 'text-red-600', border: 'border-red-200' };
                      };
                      
                      const healthStatus = getHealthStatus();
                      
                      if (!bmi || !healthStatus) {
                        return (
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30 p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Health Status</div>
                            <div className="text-lg font-bold text-gray-700 dark:text-gray-300 mt-2">Complete profile to see BMI</div>
                          </div>
                        );
                      }
                      
                      return (
                        <div className={`bg-gradient-to-r ${healthStatus.bg} dark:from-${healthStatus.color}-900/30 dark:to-${healthStatus.color}-800/30 p-4 rounded-xl border ${healthStatus.border} dark:border-${healthStatus.color}-700/50`}>
                          <div className={`text-sm ${healthStatus.text} dark:text-${healthStatus.color}-400 font-medium`}>Health Status</div>
                          <div className={`text-2xl font-bold ${healthStatus.text} dark:text-${healthStatus.color}-300 mt-2`}>{healthStatus.status}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">BMI: {bmi}</div>
                    </div>
                      );
                    })()}
                  </div>
                </div>
                <MotivationCard />
              </div>
            </div>
          ) : centerPage === 'schedule' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
                  <SchedulePage />
                </div>
              </div>
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 space-y-6">
                  <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Schedule Actions</div>
                  <div className="space-y-4">
                    <button 
                      onClick={() => setShowCreateScheduleForm(true)} 
                      className="w-full rounded-xl px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Create Schedule
                    </button>
                    <button 
                      onClick={() => setShowEditInfoDialog(true)}
                      className="w-full rounded-xl px-4 py-3 bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 border border-gray-200 dark:border-gray-600"
                    >
                      Edit Schedule
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirmDialog(true)}
                      disabled={!schedule || deleteScheduleMutation.isPending}
                      className="w-full rounded-xl px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-medium transition-all duration-200 border border-red-200 dark:border-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleteScheduleMutation.isPending ? 'Deleting...' : 'Delete Schedule'}
                    </button>
                  </div>
                </div>
                <MotivationCard />
              </div>
            </div>
          ) : centerPage === 'achievements' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
                    <AchievementsPage />
                  </div>
                </div>
                <div className="lg:col-span-1 space-y-6">
                  <MotivationCard />
                </div>
              </div>
            </div>

          ) : (
            <>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
                <HeaderBar title="FITNESS TRACKER"  onNav={onNav} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
                    <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                      <div 
                        className="text-4xl font-semibold text-gray-900 dark:text-gray-100"
                        style={{
                          fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
                          letterSpacing: '0.01em',
                          lineHeight: '1.3'
                        }}
                      >
                        Browse Exercises
                      </div>
                      
                      {/* Category Dropdown */}
                      <select
                        id="category-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-5 py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md font-medium cursor-pointer"
                      >
                        {exerciseCategories.map((category) => (
                          <option 
                            key={category.category} 
                            value={category.category}
                            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          >
                            {category.category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      {/* Display Selected Category */}
                      <div className="grid grid-cols-2 gap-6">
                        {exerciseCategories
                          .find((cat) => cat.category === selectedCategory)
                          ?.exercises.map((exercise) => (
                            <motion.button
                              key={exercise.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedExercise(exercise);
                                setShowGifModal(true);
                              }}
                              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 aspect-square"
                            >
                              <img
                                src={exercise.imageUrl}
                                alt={exercise.name}
                                className="w-full h-full object-cover"
                              />
                              {/* Exercise Name Overlay */}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-4 py-3">
                                <span className="text-white font-semibold text-sm block">{exercise.name}</span>
                              </div>
                            </motion.button>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 h-full">
                    <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">Quick Actions</div>
                    <div className="space-y-4">
                      <button className="w-full rounded-xl px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        Log workout
                      </button>
                      <button className="w-full rounded-xl px-4 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        Add meal
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Statistics — Last Month</div>
                      <button 
                        onClick={() => setShowDetailedStats(true)} 
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                      >
                        Detailed View →
                      </button>
                    </div>

                    <StatsChart labels={labels} />
                  </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                  <MotivationCard />
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
                    <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">Additional Widgets</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">More features coming soon...</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {modalStat && (
            <ProgressModal
              open={Boolean(modalStat)}
              title={modalStat.title}
              progress={modalStat.progress}
              data={modalStat.data}
              isExercise={modalStat.isExercise}
              onClose={() => setModalStat(null)}
              onOpenGif={(id: string) => { setModalStat(null); onOpenGif?.(id); }}
            />
          )}

          {showCreateScheduleForm && (
            <CreateScheduleForm
              onClose={() => setShowCreateScheduleForm(false)}
              onSave={(scheduleData: Record<string, ScheduleItem[]>) => {
                const formattedSchedule = {
                  monday: scheduleData.monday || [],
                  tuesday: scheduleData.tuesday || [],
                  wednesday: scheduleData.wednesday || [],
                  thursday: scheduleData.thursday || [],
                  friday: scheduleData.friday || [],
                  saturday: scheduleData.saturday || [],
                  sunday: scheduleData.sunday || [],
                };
                createScheduleMutation.mutate(formattedSchedule);
              }}
            />
          )}

          {showDetailedStats && (
            <DetailedStatsModal
              onClose={() => setShowDetailedStats(false)}
              labels={labels}
              totalExercises={totalExercises}
              totalExerciseMinutes={totalExerciseMinutes}
              totalMeals={totalMeals}
              totalCalories={totalCalories}
              averageSleep={averageSleep}
            />
          )}

          {showEditInfoDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditInfoDialog(false)} />
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-md border border-white/20 dark:border-gray-700/50">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Edit Schedule
                  </h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    To edit your schedule, simply click on any day card in your weekly schedule. You can add, modify, or remove activities for each day.
                  </p>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      💡 Tip: You can click on any day (Monday through Sunday) to open the edit form for that specific day.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowEditInfoDialog(false)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Got it!
                  </button>
                </div>
              </div>
            </div>
          )}

          {showDeleteConfirmDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteConfirmDialog(false)} />
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-md border border-white/20 dark:border-gray-700/50">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                    Delete Schedule
                  </h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Are you sure you want to delete your entire workout schedule? This action cannot be undone and will remove all your scheduled activities for all days of the week.
                  </p>
                  <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-xl border border-red-200 dark:border-red-700">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      ⚠️ Warning: This will permanently delete all your scheduled workouts and activities.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex space-x-3 justify-end">
                  <button
                    onClick={() => setShowDeleteConfirmDialog(false)}
                    className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      deleteScheduleMutation.mutate();
                      setShowDeleteConfirmDialog(false);
                    }}
                    disabled={deleteScheduleMutation.isPending}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteScheduleMutation.isPending ? 'Deleting...' : 'Delete Schedule'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* GIF Modal with Timer */}
          {showGifModal && selectedExercise && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowGifModal(false)} />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/20 dark:border-gray-700/50 my-4"
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowGifModal(false)}
                  className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Exercise Name */}
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  {selectedExercise.name}
                </h2>

                {/* GIF Display */}
                <div className="bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden mb-4 max-h-[50vh] flex items-center justify-center">
                  <img
                    src={selectedExercise.imageUrl}
                    alt={selectedExercise.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Timer Section */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 text-center">
                    Exercise Timer
                  </h3>
                  
                  {/* Timer Display */}
                  <div className="text-center mb-4">
                    <div className="text-4xl font-mono font-bold text-blue-600 dark:text-blue-400">
                      {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Timer Controls */}
                  <div className="flex flex-wrap gap-3 justify-center">
                    {/* Time Setting */}
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-lg px-4 py-2">
                      <label className="text-sm text-gray-600 dark:text-gray-400">Minutes:</label>
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={timerMinutes}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          if (val >= 0 && val <= 99) {
                            setTimerMinutes(val);
                          }
                        }}
                        disabled={isTimerRunning}
                        className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      />
                    </div>

                    <div className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-lg px-4 py-2">
                      <label className="text-sm text-gray-600 dark:text-gray-400">Seconds:</label>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={timerSeconds}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          if (val >= 0 && val <= 59) {
                            setTimerSeconds(val);
                          }
                        }}
                        disabled={isTimerRunning}
                        className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex gap-3 justify-center mt-4">
                    {!isTimerRunning ? (
                      <button
                        onClick={handleStartTimer}
                        disabled={timerMinutes === 0 && timerSeconds === 0}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                        </svg>
                        Start
                      </button>
                    ) : (
                      <button
                        onClick={handleStopTimer}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-2 0v6a1 1 0 102 0V7z" clipRule="evenodd" />
                        </svg>
                        Pause
                      </button>
                    )}
                    
                    <button
                      onClick={handleResetTimer}
                      className="px-6 py-3 rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 border border-gray-300 dark:border-gray-600 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Reset
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}