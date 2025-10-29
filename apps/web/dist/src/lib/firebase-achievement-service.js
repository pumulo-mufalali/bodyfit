import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from './firebase';
// Define all achievement types
export const ACHIEVEMENT_DEFINITIONS = [
    {
        id: 'first_workout',
        title: 'First Workout',
        description: 'Completed your first workout session.',
        icon: 'Trophy',
        criteria: { type: 'count', value: 1 },
    },
    {
        id: '30_minute_warrior',
        title: '30 Minute Warrior',
        description: 'Completed a workout session of 30 minutes or more.',
        icon: 'Star',
        criteria: { type: 'duration', value: 30 },
    },
    {
        id: '60_minute_master',
        title: '60 Minute Master',
        description: 'Completed a workout session of 60 minutes or more.',
        icon: 'Zap',
        criteria: { type: 'duration', value: 60 },
    },
    {
        id: 'workout_five',
        title: 'Five Workouts',
        description: 'Completed 5 workout sessions.',
        icon: 'Award',
        criteria: { type: 'count', value: 5 },
    },
    {
        id: 'workout_ten',
        title: 'Ten Workouts',
        description: 'Completed 10 workout sessions.',
        icon: 'Star',
        criteria: { type: 'count', value: 10 },
    },
    {
        id: 'workout_twenty',
        title: 'Twenty Workouts',
        description: 'Completed 20 workout sessions.',
        icon: 'Trophy',
        criteria: { type: 'count', value: 20 },
    },
    {
        id: 'total_300_minutes',
        title: '300 Minutes Total',
        description: 'Accumulated 300 total minutes of workouts.',
        icon: 'Flame',
        criteria: { type: 'total_duration', value: 300 },
    },
    {
        id: 'total_600_minutes',
        title: '600 Minutes Total',
        description: 'Accumulated 600 total minutes of workouts.',
        icon: 'Target',
        criteria: { type: 'total_duration', value: 600 },
    },
];
// Check if achievement criteria is met based on workout logs
function checkAchievementCriteria(achievement, workoutLogs) {
    const { criteria } = achievement;
    switch (criteria.type) {
        case 'count': {
            const count = workoutLogs.length;
            const achieved = count >= criteria.value;
            const progress = Math.min(100, Math.round((count / criteria.value) * 100));
            // For count achievements, the date is when they completed the Nth workout
            // Sort by date ascending to find the workout that achieved the milestone
            const sortedLogs = [...workoutLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            const achievedDate = achieved && sortedLogs.length >= criteria.value
                ? sortedLogs[criteria.value - 1].date // The workout that achieved the milestone
                : null;
            return { achieved, progress, achievedDate };
        }
        case 'duration': {
            // Check if any single workout meets the duration requirement
            // Sort by date descending to get the earliest workout that achieved it
            const sortedLogs = [...workoutLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            const matchingWorkout = sortedLogs.find(log => log.durationMinutes >= criteria.value);
            const achieved = !!matchingWorkout;
            const maxDuration = workoutLogs.length > 0
                ? Math.max(...workoutLogs.map(log => log.durationMinutes))
                : 0;
            const progress = Math.min(100, Math.round((maxDuration / criteria.value) * 100));
            return {
                achieved,
                progress,
                achievedDate: matchingWorkout?.date || null,
            };
        }
        case 'total_duration': {
            // Sort workouts by date to find when milestone was reached
            const sortedLogs = [...workoutLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            let cumulativeMinutes = 0;
            let milestoneDate = null;
            for (const log of sortedLogs) {
                cumulativeMinutes += log.durationMinutes;
                if (cumulativeMinutes >= criteria.value && !milestoneDate) {
                    milestoneDate = log.date;
                }
            }
            const totalMinutes = workoutLogs.reduce((sum, log) => sum + log.durationMinutes, 0);
            const achieved = totalMinutes >= criteria.value;
            const progress = Math.min(100, Math.round((totalMinutes / criteria.value) * 100));
            return { achieved, progress, achievedDate: milestoneDate };
        }
        case 'streak': {
            // Not implemented yet, return default
            return { achieved: false, progress: 0, achievedDate: null };
        }
        default:
            return { achieved: false, progress: 0, achievedDate: null };
    }
}
// Get user achievements from Firebase
export async function getUserAchievements(userId, workoutLogs) {
    const achievementsRef = collection(db, 'users', userId, 'achievements');
    const snapshot = await getDocs(achievementsRef);
    const storedAchievements = new Map(snapshot.docs.map(doc => [doc.id, { id: doc.id, ...doc.data() }]));
    // Calculate achievements based on workout logs
    const calculatedAchievements = ACHIEVEMENT_DEFINITIONS.map(def => {
        const stored = storedAchievements.get(def.id);
        const check = checkAchievementCriteria(def, workoutLogs);
        // Use stored achievement if it exists and is achieved, otherwise calculate from workouts
        const achieved = stored?.achieved || check.achieved;
        const achievedDate = stored?.achievedDate || check.achievedDate;
        const progress = check.progress;
        return {
            id: def.id,
            title: def.title,
            description: def.description,
            icon: def.icon,
            criteria: def.criteria,
            achieved,
            achievedDate: achieved ? (achievedDate || new Date().toISOString().split('T')[0]) : null,
            progress,
        };
    });
    // Update Firebase with new achievement statuses
    for (const achievement of calculatedAchievements) {
        const achievementRef = doc(db, 'users', userId, 'achievements', achievement.id);
        await setDoc(achievementRef, {
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            criteria: achievement.criteria,
            achieved: achievement.achieved,
            achievedDate: achievement.achievedDate,
            progress: achievement.progress,
        }, { merge: true });
    }
    return calculatedAchievements;
}
