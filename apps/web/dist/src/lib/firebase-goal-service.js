import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
const goalsCollection = "goals";
export async function getUserGoals(userId) {
    try {
        if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
            throw new Error('Invalid user ID provided');
        }
        const goalsRef = collection(db, "users", userId, goalsCollection);
        const q = query(goalsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || '',
                target: typeof data.target === 'number' ? data.target : 0,
                current: typeof data.current === 'number' ? data.current : 0,
                unit: data.unit || '',
                category: data.category || 'weight',
                deadline: data.deadline || new Date().toISOString().split('T')[0],
                createdAt: data.createdAt || new Date().toISOString(),
            };
        });
    }
    catch (error) {
        console.error('Error getting user goals:', error);
        if (error.code === 'permission-denied') {
            throw new Error('Permission denied. Please check your authentication.');
        }
        throw new Error('Failed to fetch goals. Please try again.');
    }
}
export async function createGoal(userId, goalData) {
    try {
        if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
            throw new Error('Invalid user ID provided');
        }
        if (!goalData || typeof goalData !== 'object') {
            throw new Error('Invalid goal data provided');
        }
        if (!goalData.title || typeof goalData.title !== 'string' || goalData.title.trim().length === 0) {
            throw new Error('Goal title is required');
        }
        if (goalData.title.trim().length > 200) {
            throw new Error('Goal title must be less than 200 characters');
        }
        if (typeof goalData.target !== 'number' || isNaN(goalData.target) || goalData.target <= 0) {
            throw new Error('Goal target must be a positive number');
        }
        if (typeof goalData.current !== 'number' || isNaN(goalData.current) || goalData.current < 0) {
            throw new Error('Goal current value must be a non-negative number');
        }
        if (!goalData.unit || typeof goalData.unit !== 'string' || goalData.unit.trim().length === 0) {
            throw new Error('Goal unit is required');
        }
        if (!goalData.deadline || typeof goalData.deadline !== 'string' || goalData.deadline.trim().length === 0) {
            throw new Error('Goal deadline is required');
        }
        const goalsRef = collection(db, "users", userId, goalsCollection);
        const newGoal = {
            ...goalData,
            title: goalData.title.trim(),
            unit: goalData.unit.trim(),
            createdAt: new Date().toISOString(),
        };
        const docRef = await addDoc(goalsRef, newGoal);
        return {
            id: docRef.id,
            ...newGoal,
        };
    }
    catch (error) {
        console.error('Error creating goal:', error);
        if (error.code === 'permission-denied') {
            throw new Error('Permission denied. Please check your authentication.');
        }
        if (error.message) {
            throw error;
        }
        throw new Error('Failed to create goal. Please try again.');
    }
}
export async function updateGoal(userId, goalId, updates) {
    try {
        if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
            throw new Error('Invalid user ID provided');
        }
        if (!goalId || typeof goalId !== 'string' || goalId.trim().length === 0) {
            throw new Error('Invalid goal ID provided');
        }
        if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
            throw new Error('No update data provided');
        }
        // Validate title if provided
        if (updates.title !== undefined) {
            if (!updates.title || typeof updates.title !== 'string' || updates.title.trim().length === 0) {
                throw new Error('Goal title cannot be empty');
            }
            if (updates.title.trim().length > 200) {
                throw new Error('Goal title must be less than 200 characters');
            }
        }
        // Validate target if provided
        if (updates.target !== undefined) {
            if (typeof updates.target !== 'number' || isNaN(updates.target) || updates.target <= 0) {
                throw new Error('Goal target must be a positive number');
            }
        }
        // Validate current if provided
        if (updates.current !== undefined) {
            if (typeof updates.current !== 'number' || isNaN(updates.current) || updates.current < 0) {
                throw new Error('Goal current value must be a non-negative number');
            }
        }
        const goalRef = doc(db, "users", userId, goalsCollection, goalId);
        await updateDoc(goalRef, updates);
    }
    catch (error) {
        console.error('Error updating goal:', error);
        if (error.code === 'permission-denied') {
            throw new Error('Permission denied. Please check your authentication.');
        }
        if (error.code === 'not-found') {
            throw new Error('Goal not found.');
        }
        if (error.message) {
            throw error;
        }
        throw new Error('Failed to update goal. Please try again.');
    }
}
export async function deleteGoal(userId, goalId) {
    try {
        if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
            throw new Error('Invalid user ID provided');
        }
        if (!goalId || typeof goalId !== 'string' || goalId.trim().length === 0) {
            throw new Error('Invalid goal ID provided');
        }
        const goalRef = doc(db, "users", userId, goalsCollection, goalId);
        await deleteDoc(goalRef);
    }
    catch (error) {
        console.error('Error deleting goal:', error);
        if (error.code === 'permission-denied') {
            throw new Error('Permission denied. Please check your authentication.');
        }
        if (error.code === 'not-found') {
            throw new Error('Goal not found.');
        }
        throw new Error('Failed to delete goal. Please try again.');
    }
}
