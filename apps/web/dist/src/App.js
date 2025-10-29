import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from "./providers/auth-provider";
import GifViewer from "./pages/GifViewer";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import ExercisesPage from "./pages/ExercisesPage";
import { getUserPreferences, saveUserPreferences, logUserActivity } from "./lib/firebase-user-preferences-service";
function DashboardApp() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    // Load preferences from Firestore
    const { data: preferences } = useQuery({
        queryKey: ['userPreferences', user?.uid],
        queryFn: () => getUserPreferences(user.uid),
        enabled: !!user?.uid,
    });
    // Load saved page from Firestore preferences, fallback to localStorage for initial load
    const [activePage, setActivePage] = useState(() => {
        if (preferences?.lastActivePage && ['dashboard', 'profile', 'goals', 'gifs', 'achievements', 'exercises', 'workouts', 'schedule', 'settings'].includes(preferences.lastActivePage)) {
            return preferences.lastActivePage;
        }
        // Fallback to localStorage during initial load
        const saved = localStorage.getItem('myfitness_active_page');
        if (saved && ['dashboard', 'profile', 'goals', 'gifs', 'achievements', 'exercises', 'workouts', 'schedule', 'settings'].includes(saved)) {
            return saved;
        }
        return 'dashboard';
    });
    // Update activePage when preferences load
    useEffect(() => {
        if (preferences?.lastActivePage && ['dashboard', 'profile', 'goals', 'gifs', 'achievements', 'exercises', 'workouts', 'schedule', 'settings'].includes(preferences.lastActivePage)) {
            setActivePage(preferences.lastActivePage);
        }
    }, [preferences?.lastActivePage]);
    const [selectedGifId, setSelectedGifId] = useState(() => {
        return preferences?.lastSelectedGifId || null;
    });
    // Save preferences mutation
    const savePreferencesMutation = useMutation({
        mutationFn: (prefs) => saveUserPreferences(user.uid, prefs),
    });
    // Save page to Firestore whenever it changes
    useEffect(() => {
        if (user?.uid && activePage) {
            // Keep localStorage as immediate backup
            localStorage.setItem('myfitness_active_page', activePage);
            // Save to Firestore
            savePreferencesMutation.mutate({ lastActivePage: activePage });
            // Log activity
            logUserActivity(user.uid, { type: 'page_view', page: activePage });
        }
    }, [activePage, user?.uid]);
    // Save selectedGifId to Firestore
    useEffect(() => {
        if (user?.uid && selectedGifId) {
            // Only save if selectedGifId has a value (not null or empty)
            savePreferencesMutation.mutate({ lastSelectedGifId: selectedGifId });
        }
        else if (user?.uid && selectedGifId === null) {
            // If explicitly set to null, we can remove it by not including it in preferences
            // But since we're using merge: true, we need to explicitly delete the field
            // For now, just don't save it if it's null
        }
    }, [selectedGifId, user?.uid]);
    // Handler for navigation - saves current page scroll position
    const handleNav = (page) => {
        // Save current scroll position for current page
        const currentPage = activePage;
        if (currentPage) {
            sessionStorage.setItem(`myfitness_scroll_${currentPage}`, String(window.scrollY));
        }
        setActivePage(page);
    };
    return (_jsx("div", { children: activePage === 'exercises' ? (_jsx(ExercisesPage, { onBack: () => handleNav('dashboard') })) : (_jsxs(_Fragment, { children: [_jsx(DashboardLayout, { onNav: handleNav, onOpenGif: (id) => {
                        setSelectedGifId(id);
                        handleNav('gifs');
                    }, centerPage: activePage }), activePage === 'gifs' && (_jsx(GifViewer, { exerciseId: selectedGifId, onBack: () => handleNav('dashboard') }))] })) }));
}
export default function App() {
    return (_jsx(ProtectedRoute, { children: _jsx(DashboardApp, {}) }));
}
