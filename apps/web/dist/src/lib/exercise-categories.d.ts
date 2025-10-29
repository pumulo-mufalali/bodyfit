export interface Exercise {
    id: string;
    name: string;
    imageUrl: string;
}
export interface ExerciseCategory {
    category: string;
    exercises: Exercise[];
}
export declare const exerciseCategories: ExerciseCategory[];
