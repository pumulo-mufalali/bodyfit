import React from 'react';
import StatsChart from './StatsChart';

interface DetailedStatsModalProps {
  onClose: () => void;
  labels: string[];
  totalExercises: number;
  totalExerciseMinutes: number;
  totalMeals: number;
  totalCalories: number;
  averageSleep: number;
}

export default function DetailedStatsModal({
  onClose,
  labels,
  totalExercises,
  totalExerciseMinutes,
  totalMeals,
  totalCalories,
  averageSleep
}: DetailedStatsModalProps) {
  // Stop propagation to prevent closing the modal when clicking inside
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-card rounded-xl p-6 shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={handleModalContentClick}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Detailed Statistics</h2>
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Close</button>
        </div>
        <div className="mt-4 text-sm text-gray-100 dark:text-gray-300 mb-4">
          This is a detailed view of your statistics over the last month. You can analyze your progress more closely here.
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xl font-bold">Monthly Summary</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Exercises</div>
                <div className="text-2xl font-bold mt-1">{totalExercises}</div>
                <div className="text-sm text-muted-foreground">{totalExerciseMinutes} mins</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Meals</div>
                <div className="text-2xl font-bold mt-1">{totalMeals}</div>
                <div className="text-sm text-muted-foreground">{totalCalories} cal</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Average Sleep</div>
                <div className="text-2xl font-bold mt-1">{averageSleep} hours</div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 h-[60vh]">
            <StatsChart labels={labels} />
          </div>
        </div>
      </div>
    </div>
  );
}
