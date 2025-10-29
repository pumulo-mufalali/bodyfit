import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../providers/auth-provider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { weightService } from '../lib/firebase-data-service';
import { getUserGoals } from '../lib/firebase-goal-service';
import { getUserSchedule, createUserSchedule, deleteUserSchedule } from '../lib/firebase-schedule-service';
import MyGoalsPage from '../pages/MyGoalsPage';
import ProfilePage from './ProfilePage';
import SchedulePage from '../pages/SchedulePage';
import CreateScheduleForm from './CreateScheduleForm';
import AchievementsPage from '../pages/AchievementsPage';
import DetailedStatsModal from './DetailedStatsModal';
import SettingsPage from '../pages/SettingsPage';
import WorkoutLogsPage from '../pages/WorkoutLogsPage';
import ProgressModal from './ProgressModal';
import { MotivationCard } from './MotivationCard';
import { useSettings } from '../providers/settings-provider';
import { convertWeightData } from '../lib/unit-conversion';
// Sidebar components
import GoalInsightsSidebar from './sidebars/GoalInsightsSidebar';
import ScheduleActionsSidebar from './sidebars/ScheduleActionsSidebar';
import AccountDetailsSidebar from './sidebars/AccountDetailsSidebar';
// Dashboard components
import DashboardPage from './dashboard/DashboardPage';
export default function DashboardLayout({ onNav, onOpenGif, centerPage, }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const settings = useSettings();
    const scrollPositionRef = useRef(0);
    const previousCenterPage = useRef(centerPage);
    // Handle scroll position on page navigation
    useEffect(() => {
        // Check if navigation came from sidebar - always scroll to top
        const isSidebarNav = sessionStorage.getItem('sidebar_nav') === 'true';
        if (previousCenterPage.current !== centerPage) {
            if (isSidebarNav) {
                // Sidebar navigation - always scroll to top and clear saved positions
                const scrollKey = `myfitness_scroll_${centerPage}`;
                sessionStorage.removeItem(scrollKey);
                sessionStorage.removeItem('sidebar_nav');
                requestAnimationFrame(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
            else {
                // Other navigation - restore saved position or scroll to top
                const scrollKey = `myfitness_scroll_${centerPage}`;
                const savedScroll = sessionStorage.getItem(scrollKey);
                if (savedScroll) {
                    const pos = parseInt(savedScroll, 10);
                    if (!isNaN(pos) && pos > 0) {
                        requestAnimationFrame(() => {
                            window.scrollTo({ top: pos, behavior: 'instant' });
                        });
                    }
                    else {
                        requestAnimationFrame(() => {
                            window.scrollTo({ top: 0, behavior: 'instant' });
                        });
                    }
                }
                else {
                    requestAnimationFrame(() => {
                        window.scrollTo({ top: 0, behavior: 'instant' });
                    });
                }
            }
        }
        // Save scroll position as user scrolls (only if not from sidebar nav)
        const scrollKey = `myfitness_scroll_${centerPage}`;
        const handleScroll = () => {
            // Don't save scroll position if we just navigated from sidebar
            if (sessionStorage.getItem('sidebar_nav') !== 'true') {
                sessionStorage.setItem(scrollKey, String(window.scrollY));
            }
        };
        // Small delay before enabling scroll saving to avoid capturing initial scroll
        const timeoutId = setTimeout(() => {
            window.addEventListener('scroll', handleScroll, { passive: true });
        }, 1000);
        previousCenterPage.current = centerPage;
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [centerPage]);
    // Fetch user profile from Firebase to ensure we have the latest data
    const { data: userProfile } = useQuery({
        queryKey: ['user', 'profile', user?.uid],
        queryFn: async () => {
            if (!user?.uid)
                return null;
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
        theme: user.theme,
        fitnessGoal: user.fitnessGoal,
        units: 'metric',
        language: 'en',
        privacy: 'private',
        notifications: {
            workoutReminders: true,
            goalAchievements: true,
            weeklyProgress: false,
        },
        dataSharing: true,
        activityTracking: true,
    } : null);
    // Get weight history from Firebase
    const { data: weightHistory = [] } = useQuery({
        queryKey: ['weight', 'history', user?.uid],
        queryFn: () => weightService.getHistory(user.uid),
        enabled: !!user?.uid
    });
    // Get goals from Firebase for Goal Insights
    const { data: goals = [] } = useQuery({
        queryKey: ['goals', user?.uid],
        queryFn: () => getUserGoals(user.uid),
        enabled: !!user?.uid,
    });
    // Generate weekly weight data for the last 3 months (12 weeks) based on real Firestore data
    const generateWeeklyWeightData = () => {
        const currentWeight = currentUser?.weightKg || 70;
        const weeks = [
            'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6',
            'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12'
        ];
        // If we have weight history from Firestore, use it to generate realistic weekly data
        if (weightHistory.length > 0) {
            // Sort by date (oldest first) to get chronological progression
            const sortedHistory = weightHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            // Get the date range for the last 12 weeks (3 months)
            const now = new Date();
            const twelveWeeksAgo = new Date(now.getTime() - (12 * 7 * 24 * 60 * 60 * 1000));
            // Filter entries from the last 12 weeks
            const recentEntries = sortedHistory.filter(entry => new Date(entry.date) >= twelveWeeksAgo);
            if (recentEntries.length > 0) {
                // Group entries by week
                const weeklyData = [];
                for (let weekIndex = 0; weekIndex < 12; weekIndex++) {
                    const weekStart = new Date(twelveWeeksAgo.getTime() + (weekIndex * 7 * 24 * 60 * 60 * 1000));
                    const weekEnd = new Date(weekStart.getTime() + (7 * 24 * 60 * 60 * 1000));
                    // Find entries in this week
                    const weekEntries = recentEntries.filter(entry => {
                        const entryDate = new Date(entry.date);
                        return entryDate >= weekStart && entryDate < weekEnd;
                    });
                    if (weekEntries.length > 0) {
                        // Use the latest weight in this week
                        const latestEntry = weekEntries[weekEntries.length - 1];
                        if (latestEntry) {
                            weeklyData.push({ week: weeks[weekIndex], weight: latestEntry.weight });
                        }
                        else {
                            weeklyData.push({ week: weeks[weekIndex], weight: currentWeight });
                        }
                    }
                    else {
                        // If no entries for this week, interpolate or use previous week's weight
                        if (weeklyData.length > 0) {
                            const lastWeight = weeklyData[weeklyData.length - 1]?.weight || currentWeight;
                            weeklyData.push({
                                week: weeks[weekIndex],
                                weight: lastWeight
                            });
                        }
                        else {
                            // First week with no data, use current weight
                            weeklyData.push({ week: weeks[weekIndex], weight: currentWeight });
                        }
                    }
                }
                return weeklyData;
            }
        }
        // If no weight history exists or no recent entries, start with current weight
        return weeks.map((week, index) => {
            if (index === 11) {
                // Week 12 shows current weight
                return { week, weight: currentWeight };
            }
            else {
                // Previous weeks show slight variations (±0.5kg) to simulate realistic progression
                const variation = (Math.random() - 0.5) * 1; // ±0.5 kg variation
                const weight = Math.round((currentWeight + variation) * 10) / 10;
                return { week, weight };
            }
        });
    };
    const weeklyWeightData = generateWeeklyWeightData();
    const convertedWeightData = convertWeightData(weeklyWeightData, settings.units);
    const labels = Array.from({ length: 12 }).map((_, i) => `W${i + 1}`);
    const [modalStat, setModalStat] = React.useState(null);
    const [showCreateScheduleForm, setShowCreateScheduleForm] = React.useState(false);
    const [showDetailedStats, setShowDetailedStats] = React.useState(false);
    const [showEditInfoDialog, setShowEditInfoDialog] = React.useState(false);
    const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = React.useState(false);
    // Get schedule from Firebase
    const { data: schedule } = useQuery({
        queryKey: ['schedule', user?.uid],
        queryFn: () => getUserSchedule(user.uid),
        enabled: !!user?.uid,
    });
    // Create schedule mutation
    const createScheduleMutation = useMutation({
        mutationFn: (scheduleData) => createUserSchedule(user.uid, scheduleData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedule', user?.uid] });
            setShowCreateScheduleForm(false);
        },
    });
    // Delete schedule mutation
    const deleteScheduleMutation = useMutation({
        mutationFn: () => deleteUserSchedule(user.uid),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedule', user?.uid] });
            alert('Schedule deleted successfully!');
        },
    });
    // Weight update mutation
    const weightUpdateMutation = useMutation({
        mutationFn: (weight) => weightService.addEntry(user.uid, weight),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['weight', 'history', user?.uid] });
            queryClient.invalidateQueries({ queryKey: ['user', 'profile', user?.uid] });
        },
    });
    return (_jsx(_Fragment, { children: _jsxs("div", { className: "min-h-screen gradient-elegant-light dark:gradient-elegant-dark", children: [_jsxs("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [_jsx("div", { className: "absolute -top-40 -right-40 w-96 h-96 bg-blue-200/10 dark:bg-blue-900/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-60 animate-pulse" }), _jsx("div", { className: "absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-200/10 dark:bg-indigo-900/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-60 animate-pulse", style: { animationDelay: '2s' } }), _jsx("div", { className: "absolute top-40 left-1/2 w-96 h-96 bg-emerald-200/10 dark:bg-emerald-900/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-60 animate-pulse", style: { animationDelay: '4s' } })] }), _jsxs("div", { className: "relative z-10 max-w-7xl mx-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8", children: [_jsx("div", { className: "lg:col-span-3", children: _jsx(Sidebar, { profile: currentUser, onNav: onNav }) }), _jsxs("div", { className: "lg:col-span-9 space-y-8", children: [centerPage === 'goals' ? (_jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx("div", { className: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50", children: _jsx(MyGoalsPage, {}) }) }), _jsx("div", { className: "lg:col-span-1", children: _jsx(GoalInsightsSidebar, { goals: goals }) })] }) })) : centerPage === 'profile' ? (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx("div", { className: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden", children: _jsx(ProfilePage, { onClose: () => onNav?.('dashboard') }) }) }), _jsx("div", { className: "lg:col-span-1", children: _jsx(AccountDetailsSidebar, { currentUser: currentUser }) })] })) : centerPage === 'schedule' ? (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx("div", { className: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50", children: _jsx(SchedulePage, {}) }) }), _jsxs("div", { className: "lg:col-span-1 space-y-6", children: [_jsx(ScheduleActionsSidebar, { schedule: schedule || null, onCreateSchedule: () => setShowCreateScheduleForm(true), onEditSchedule: () => setShowEditInfoDialog(true), onDeleteSchedule: () => setShowDeleteConfirmDialog(true), isDeleting: deleteScheduleMutation.isPending }), _jsx(MotivationCard, {})] })] })) : centerPage === 'achievements' ? (_jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx("div", { className: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50", children: _jsx(AchievementsPage, {}) }) }), _jsx("div", { className: "lg:col-span-1 space-y-6", children: _jsx(MotivationCard, {}) })] }) })) : centerPage === 'settings' ? (_jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx("div", { className: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50", children: _jsx(SettingsPage, {}) }) }), _jsx("div", { className: "lg:col-span-1 space-y-6", children: _jsx(MotivationCard, {}) })] }) })) : centerPage === 'workouts' || centerPage === 'workout-logs' ? (_jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx("div", { className: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50", children: _jsx(WorkoutLogsPage, {}) }) }), _jsx("div", { className: "lg:col-span-1 space-y-6", children: _jsx(MotivationCard, {}) })] }) })) : (_jsx(DashboardPage, { labels: labels, weightData: convertedWeightData, units: settings.units, onUpdateWeight: () => setShowDetailedStats(true), onNav: onNav, onOpenExercise: (exercise) => onOpenGif?.(exercise.id) })), modalStat && (_jsx(ProgressModal, { open: Boolean(modalStat), title: modalStat.title, progress: modalStat.progress, data: modalStat.data, isExercise: modalStat.isExercise, onClose: () => setModalStat(null), onOpenGif: (id) => { setModalStat(null); onOpenGif?.(id); } })), showCreateScheduleForm && (_jsx(CreateScheduleForm, { onClose: () => setShowCreateScheduleForm(false), onSave: (scheduleData) => {
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
                                    } })), showDetailedStats && (_jsx(DetailedStatsModal, { onClose: () => setShowDetailedStats(false), labels: labels, weightData: convertedWeightData, onUpdateWeight: (weight) => weightUpdateMutation.mutate(weight), currentWeight: currentUser?.weightKg, isUpdating: weightUpdateMutation.isPending, isSuccess: weightUpdateMutation.isSuccess, units: settings.units })), showEditInfoDialog && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: () => setShowEditInfoDialog(false) }), _jsxs("div", { className: "relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-md border border-white/20 dark:border-gray-700/50", children: [_jsxs("div", { className: "flex items-center space-x-4 mb-6", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center", children: _jsx("svg", { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) }), _jsx("h2", { className: "text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "Edit Schedule" })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 leading-relaxed", children: "To edit your schedule, simply click on any day card in your weekly schedule. You can add, modify, or remove activities for each day." }), _jsx("div", { className: "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700", children: _jsx("p", { className: "text-sm text-blue-700 dark:text-blue-300", children: "\uD83D\uDCA1 Tip: You can click on any day (Monday through Sunday) to open the edit form for that specific day." }) })] }), _jsx("div", { className: "mt-6 flex justify-end", children: _jsx("button", { onClick: () => setShowEditInfoDialog(false), className: "px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl", children: "Got it!" }) })] })] })), showDeleteConfirmDialog && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: () => setShowDeleteConfirmDialog(false) }), _jsxs("div", { className: "relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-md border border-white/20 dark:border-gray-700/50", children: [_jsxs("div", { className: "flex items-center space-x-4 mb-6", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center", children: _jsx("svg", { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) }), _jsx("h2", { className: "text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent", children: "Delete Schedule" })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 leading-relaxed", children: "Are you sure you want to delete your entire workout schedule? This action cannot be undone and will remove all your scheduled activities for all days of the week." }), _jsx("div", { className: "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-xl border border-red-200 dark:border-red-700", children: _jsx("p", { className: "text-sm text-red-700 dark:text-red-300", children: "\u26A0\uFE0F Warning: This will permanently delete all your scheduled workouts and activities." }) })] }), _jsxs("div", { className: "mt-6 flex space-x-3 justify-end", children: [_jsx("button", { onClick: () => setShowDeleteConfirmDialog(false), className: "px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200", children: "Cancel" }), _jsx("button", { onClick: () => {
                                                                deleteScheduleMutation.mutate();
                                                                setShowDeleteConfirmDialog(false);
                                                            }, disabled: deleteScheduleMutation.isPending, className: "px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed", children: deleteScheduleMutation.isPending ? 'Deleting...' : 'Delete Schedule' })] })] })] }))] })] })] }) }));
}
