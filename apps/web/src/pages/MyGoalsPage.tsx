import React, { useState } from 'react';

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  category: 'weight' | 'strength' | 'cardio' | 'nutrition';
  deadline: string;
}

const mockGoals: Goal[] = [
  {
    id: 'g1',
    title: 'Weight Loss',
    target: 70,
    current: 75,
    unit: 'kg',
    category: 'weight',
    deadline: '2025-12-31'
  },
  {
    id: 'g2',
    title: '5K Run Time',
    target: 25,
    current: 28,
    unit: 'min',
    category: 'cardio',
    deadline: '2025-11-30'
  },
  {
    id: 'g3',
    title: 'Push-ups',
    target: 50,
    current: 35,
    unit: 'reps',
    category: 'strength',
    deadline: '2025-11-15'
  }
];

const categoryColors = {
  weight: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
  strength: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
  cardio: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
  nutrition: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' }
};

export default function MyGoalsPage({ onBack }: { onBack?: () => void }) {
  const [showModal, setShowModal] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);

  const handleAddGoal = () => {
    setEditGoal(null);
    setShowModal(true);
  };
  const handleEditGoal = (goal: Goal) => {
    setEditGoal(goal);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setEditGoal(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Goals</h1>
        <button className="text-sm px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600" onClick={handleAddGoal}>
          + Add Goal
        </button>
      </div>
      <div className="space-y-6">
        {mockGoals.map(goal => {
          const progress = Math.min(100, Math.round((goal.current / goal.target) * 100));
          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          return (
            <div key={goal.id} className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[goal.category].bg} ${categoryColors[goal.category].text}`}>
                    {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
                  </span>
                  <h2 className="font-semibold text-lg mt-1">{goal.title}</h2>
                </div>
                <button className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-300" title="Edit Goal" onClick={() => handleEditGoal(goal)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-base font-medium">{goal.current}{goal.unit}</div>
                <div className="text-xs text-muted-foreground">of {goal.target}{goal.unit}</div>
              </div>
              <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {daysLeft} days remaining
              </div>
            </div>
          );
        })}
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={handleCloseModal} />
          <div className="relative z-10 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editGoal ? 'Edit Goal' : 'Add Goal'}</h2>
            {/* Simple form placeholder */}
            <form className="space-y-4">
              <input className="w-full px-3 py-2 rounded border" placeholder="Goal Title" defaultValue={editGoal?.title ?? ''} />
              <input className="w-full px-3 py-2 rounded border" placeholder="Target" type="number" defaultValue={editGoal?.target ?? ''} />
              <input className="w-full px-3 py-2 rounded border" placeholder="Current" type="number" defaultValue={editGoal?.current ?? ''} />
              <input className="w-full px-3 py-2 rounded border" placeholder="Unit" defaultValue={editGoal?.unit ?? ''} />
              <select className="w-full px-3 py-2 rounded border" defaultValue={editGoal?.category ?? 'weight'}>
                <option value="weight">Weight</option>
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
                <option value="nutrition">Nutrition</option>
              </select>
              <input className="w-full px-3 py-2 rounded border" placeholder="Deadline" type="date" defaultValue={editGoal?.deadline ?? ''} />
              <div className="flex justify-end gap-2">
                <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
