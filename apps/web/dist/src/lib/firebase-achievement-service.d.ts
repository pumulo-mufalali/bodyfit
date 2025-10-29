import type { WorkoutLog } from './mock-data';
export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    criteria: {
        type: 'duration' | 'count' | 'streak' | 'total_duration';
        value: number;
    };
    achieved: boolean;
    achievedDate: string | null;
    progress: number;
}
export interface AchievementDefinition {
    id: string;
    title: string;
    description: string;
    icon: 'Trophy' | 'Star' | 'Zap' | 'Award' | 'Flame' | 'Target';
    criteria: {
        type: 'duration' | 'count' | 'streak' | 'total_duration';
        value: number;
    };
}
export declare const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[];
export declare function getUserAchievements(userId: string, workoutLogs: WorkoutLog[]): Promise<Achievement[]>;
