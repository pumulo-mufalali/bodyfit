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
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">My Goals</h1>
        <button 
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" 
          onClick={handleAddGoal}
        >
          + Add Goal
        </button>
      </div>
      <div className="space-y-6">
        {mockGoals.map(goal => {
          const progress = Math.min(100, Math.round((goal.current / goal.target) * 100));
          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          return (
            <div key={goal.id} className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 space-y-4 hover:shadow-2xl transition-all duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${categoryColors[goal.category].bg} ${categoryColors[goal.category].text}`}>
                    {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
                  </span>
                  <h2 className="font-bold text-xl mt-2 text-gray-900 dark:text-white">{goal.title}</h2>
                </div>
                <button 
                  className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300 transition-all duration-200" 
                  title="Edit Goal" 
                  onClick={() => handleEditGoal(goal)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{goal.current}{goal.unit}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">of {goal.target}{goal.unit}</div>
                <div className="ml-auto text-lg font-semibold text-blue-600 dark:text-blue-400">{progress}%</div>
              </div>
              <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {daysLeft > 0 ? `${daysLeft} days remaining` : 'Deadline passed'}
              </div>
            </div>
          );
        })}
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-md border border-white/20 dark:border-gray-700/50">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {editGoal ? 'Edit Goal' : 'Add Goal'}
            </h2>
            {/* Simple form placeholder */}
            <form className="space-y-4">
              <input className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" placeholder="Goal Title" defaultValue={editGoal?.title ?? ''} />
              <input className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" placeholder="Target" type="number" defaultValue={editGoal?.target ?? ''} />
              <input className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" placeholder="Current" type="number" defaultValue={editGoal?.current ?? ''} />
              <input className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" placeholder="Unit" defaultValue={editGoal?.unit ?? ''} />
              <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" defaultValue={editGoal?.category ?? 'weight'}>
                <option value="weight">Weight</option>
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
                <option value="nutrition">Nutrition</option>
              </select>
              <input className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" placeholder="Deadline" type="date" defaultValue={editGoal?.deadline ?? ''} />
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
