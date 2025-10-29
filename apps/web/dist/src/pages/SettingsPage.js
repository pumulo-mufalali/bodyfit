import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../providers/auth-provider';
import { useSettings } from '../providers/settings-provider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserFromFirestore, updateUserProfile } from '../lib/firebase-user-service';
import { workoutService, weightService } from '../lib/firebase-data-service';
import { getUserGoals } from '../lib/firebase-goal-service';
import { getUserSchedule } from '../lib/firebase-schedule-service';
import { User as UserIcon, Shield, Bell, Palette, Download, Upload, Trash2, Eye, EyeOff, Save, AlertTriangle, Settings as SettingsIcon } from 'lucide-react';
const SettingsSection = ({ title, icon, children }) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center", children: icon }), _jsx("h2", { className: "text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: title })] }), children] }));
const SettingItem = ({ label, description, children, warning }) => (_jsx("div", { className: `p-4 rounded-xl border transition-all duration-200 ${warning
        ? 'border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/20'
        : 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20'}`, children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-gray-100", children: label }), description && (_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: description }))] }), _jsx("div", { className: "flex-shrink-0", children: children })] }) }));
export default function SettingsPage() {
    const { user, logout } = useAuth();
    const queryClient = useQueryClient();
    const settings = useSettings();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);
    // Fetch user profile
    const { data: profile } = useQuery({
        queryKey: ['user', 'profile', user?.uid],
        queryFn: () => getUserFromFirestore(user.uid),
        enabled: !!user?.uid,
    });
    const currentUser = profile || user;
    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: (updates) => updateUserProfile(user.uid, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'profile', user?.uid] });
            alert('Settings updated successfully!');
        },
    });
    // Export data function
    const exportData = async () => {
        if (!user?.uid)
            return;
        try {
            const [workoutLogs, weightHistory, goals, schedule] = await Promise.all([
                workoutService.getLogs(user.uid),
                weightService.getHistory(user.uid),
                getUserGoals(user.uid),
                getUserSchedule(user.uid),
            ]);
            const exportData = {
                profile: currentUser,
                workoutLogs,
                weightHistory,
                goals,
                schedule,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `myfitness-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert('Data exported successfully!');
        }
        catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export data. Please try again.');
        }
    };
    // Delete account function
    const deleteAccount = async () => {
        if (!user?.uid)
            return;
        try {
            // In a real app, this would call a backend API to delete the account
            alert('Account deletion is not implemented yet. Please contact support.');
            setShowDeleteConfirm(false);
        }
        catch (error) {
            console.error('Delete account failed:', error);
            alert('Failed to delete account. Please try again.');
        }
    };
    // Change password function
    const changePassword = async () => {
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters long!');
            return;
        }
        try {
            // In a real app, this would call Firebase Auth to change password
            alert('Password change is not implemented yet. Please use Firebase Auth directly.');
            setShowPasswordChange(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
        catch (error) {
            console.error('Password change failed:', error);
            alert('Failed to change password. Please try again.');
        }
    };
    return (_jsxs("div", { className: "min-h-screen gradient-modern-light dark:gradient-modern-dark", children: [_jsxs("div", { className: "max-w-4xl mx-auto py-8 px-6", children: [_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: "mb-8", children: _jsxs("div", { className: "flex items-center gap-4 mb-6", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center", children: _jsx(SettingsIcon, { className: "w-6 h-6 text-white" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent", children: "Settings" }), _jsx("p", { className: "text-lg text-gray-600 dark:text-gray-400 mt-2 font-medium", children: "Manage your account preferences and app settings" })] })] }) }), _jsxs("div", { className: "space-y-8", children: [_jsx(SettingsSection, { title: "Account", icon: _jsx(UserIcon, { className: "w-5 h-5 text-white" }), children: _jsxs("div", { className: "space-y-4", children: [_jsx(SettingItem, { label: "Email Address", description: "Your account email address", children: _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400 font-mono", children: currentUser?.email || 'Not set' }) }), _jsx(SettingItem, { label: "Display Name", description: "Your public display name", children: _jsx("input", { type: "text", value: currentUser?.name || '', onChange: (e) => updateProfileMutation.mutate({ name: e.target.value }), className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "Enter your name" }) }), _jsx(SettingItem, { label: "Change Password", description: "Update your account password", children: _jsx("button", { onClick: () => setShowPasswordChange(true), className: "px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200", children: "Change Password" }) }), _jsx(SettingItem, { label: "Account Deletion", description: "Permanently delete your account and all data", warning: true, children: _jsxs("button", { onClick: () => setShowDeleteConfirm(true), className: "px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2", children: [_jsx(Trash2, { className: "w-4 h-4" }), "Delete Account"] }) })] }) }), _jsx(SettingsSection, { title: "Privacy & Security", icon: _jsx(Shield, { className: "w-5 h-5 text-white" }), children: _jsxs("div", { className: "space-y-4", children: [_jsx(SettingItem, { label: "Profile Visibility", description: "Control who can see your profile information", children: _jsxs("select", { value: settings.privacy, onChange: (e) => settings.setPrivacy(e.target.value), className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500", children: [_jsx("option", { value: "private", children: "Private" }), _jsx("option", { value: "friends", children: "Friends Only" }), _jsx("option", { value: "public", children: "Public" })] }) }), _jsx(SettingItem, { label: "Data Sharing", description: "Allow anonymous usage data to improve the app", children: _jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: settings.dataSharing, onChange: (e) => settings.setDataSharing(e.target.checked), className: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Enable data sharing" })] }) }), _jsx(SettingItem, { label: "Activity Tracking", description: "Track your workout activities and progress", children: _jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: settings.activityTracking, onChange: (e) => settings.setActivityTracking(e.target.checked), className: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Enable activity tracking" })] }) })] }) }), _jsx(SettingsSection, { title: "Notifications", icon: _jsx(Bell, { className: "w-5 h-5 text-white" }), children: _jsxs("div", { className: "space-y-4", children: [_jsx(SettingItem, { label: "Workout Reminders", description: "Get notified about scheduled workouts", children: _jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: settings.notifications.workoutReminders, onChange: (e) => settings.setNotifications({ workoutReminders: e.target.checked }), className: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Enable reminders" })] }) }), _jsx(SettingItem, { label: "Goal Achievements", description: "Celebrate when you reach your fitness goals", children: _jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: settings.notifications.goalAchievements, onChange: (e) => settings.setNotifications({ goalAchievements: e.target.checked }), className: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Enable achievement notifications" })] }) }), _jsx(SettingItem, { label: "Weekly Progress", description: "Receive weekly progress summaries", children: _jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: settings.notifications.weeklyProgress, onChange: (e) => settings.setNotifications({ weeklyProgress: e.target.checked }), className: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Enable weekly summaries" })] }) })] }) }), _jsx(SettingsSection, { title: "App Preferences", icon: _jsx(Palette, { className: "w-5 h-5 text-white" }), children: _jsxs("div", { className: "space-y-4", children: [_jsx(SettingItem, { label: "Theme", description: "Choose your preferred color theme", children: _jsxs("select", { value: settings.theme, onChange: (e) => settings.setTheme(e.target.value), className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500", children: [_jsx("option", { value: "light", children: "Light" }), _jsx("option", { value: "dark", children: "Dark" }), _jsx("option", { value: "system", children: "System" })] }) }), _jsx(SettingItem, { label: "Units", description: "Choose your preferred measurement units", children: _jsxs("select", { value: settings.units, onChange: (e) => settings.setUnits(e.target.value), className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500", children: [_jsx("option", { value: "metric", children: "Metric (kg, cm)" }), _jsx("option", { value: "imperial", children: "Imperial (lbs, ft)" })] }) }), _jsx(SettingItem, { label: "Language", description: "Select your preferred language", children: _jsxs("select", { value: settings.language, onChange: (e) => settings.setLanguage(e.target.value), className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500", children: [_jsx("option", { value: "en", children: "English" }), _jsx("option", { value: "es", children: "Espa\u00F1ol" }), _jsx("option", { value: "fr", children: "Fran\u00E7ais" }), _jsx("option", { value: "de", children: "Deutsch" })] }) })] }) }), _jsx(SettingsSection, { title: "Data Management", icon: _jsx(Download, { className: "w-5 h-5 text-white" }), children: _jsxs("div", { className: "space-y-4", children: [_jsx(SettingItem, { label: "Export Data", description: "Download all your fitness data as a JSON file", children: _jsxs("button", { onClick: exportData, className: "px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2", children: [_jsx(Download, { className: "w-4 h-4" }), "Export Data"] }) }), _jsx(SettingItem, { label: "Import Data", description: "Import fitness data from a JSON file", children: _jsxs("button", { onClick: () => {
                                                    // In a real app, this would open a file picker
                                                    alert('Data import is not implemented yet.');
                                                }, className: "px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2", children: [_jsx(Upload, { className: "w-4 h-4" }), "Import Data"] }) }), _jsx(SettingItem, { label: "Clear All Data", description: "Remove all your workout logs, goals, and progress data", warning: true, children: _jsxs("button", { onClick: () => {
                                                    if (confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
                                                        alert('Data clearing is not implemented yet.');
                                                    }
                                                }, className: "px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2", children: [_jsx(Trash2, { className: "w-4 h-4" }), "Clear Data"] }) })] }) })] })] }), showPasswordChange && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: () => setShowPasswordChange(false) }), _jsxs(motion.div, { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.3 }, className: "relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-md border border-white/20 dark:border-gray-700/50", children: [_jsx("h3", { className: "text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100", children: "Change Password" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Current Password" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPasswords ? "text" : "password", value: currentPassword, onChange: (e) => setCurrentPassword(e.target.value), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10" }), _jsx("button", { type: "button", onClick: () => setShowPasswords(!showPasswords), className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600", children: showPasswords ? _jsx(EyeOff, { className: "w-4 h-4" }) : _jsx(Eye, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "New Password" }), _jsx("input", { type: showPasswords ? "text" : "password", value: newPassword, onChange: (e) => setNewPassword(e.target.value), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Confirm New Password" }), _jsx("input", { type: showPasswords ? "text" : "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" })] })] }), _jsxs("div", { className: "flex gap-3 mt-6", children: [_jsx("button", { onClick: () => setShowPasswordChange(false), className: "flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200", children: "Cancel" }), _jsxs("button", { onClick: changePassword, className: "flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2", children: [_jsx(Save, { className: "w-4 h-4" }), "Save Changes"] })] })] })] })), showDeleteConfirm && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: () => setShowDeleteConfirm(false) }), _jsxs(motion.div, { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.3 }, className: "relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-md border border-white/20 dark:border-gray-700/50", children: [_jsxs("div", { className: "flex items-center gap-4 mb-6", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center", children: _jsx(AlertTriangle, { className: "w-6 h-6 text-white" }) }), _jsx("h3", { className: "text-2xl font-bold text-red-600 dark:text-red-400", children: "Delete Account" })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Are you sure you want to delete your account? This action cannot be undone and will permanently remove:" }), _jsxs("ul", { className: "text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4", children: [_jsx("li", { children: "\u2022 All your workout logs and progress" }), _jsx("li", { children: "\u2022 Your goals and achievements" }), _jsx("li", { children: "\u2022 Your schedule and preferences" }), _jsx("li", { children: "\u2022 Your profile information" })] }), _jsx("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4", children: _jsx("p", { className: "text-sm text-red-700 dark:text-red-300 font-medium", children: "\u26A0\uFE0F This action is permanent and cannot be reversed." }) })] }), _jsxs("div", { className: "flex gap-3 mt-6", children: [_jsx("button", { onClick: () => setShowDeleteConfirm(false), className: "flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200", children: "Cancel" }), _jsxs("button", { onClick: deleteAccount, className: "flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2", children: [_jsx(Trash2, { className: "w-4 h-4" }), "Delete Account"] })] })] })] }))] }));
}
