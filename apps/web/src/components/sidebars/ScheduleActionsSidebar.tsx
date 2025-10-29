import React from 'react';
import type { Schedule } from '@myfitness/shared';

interface ScheduleActionsSidebarProps {
  schedule: Schedule | null;
  onCreateSchedule: () => void;
  onEditSchedule: () => void;
  onDeleteSchedule: () => void;
  isDeleting: boolean;
}

export default function ScheduleActionsSidebar({
  schedule,
  onCreateSchedule,
  onEditSchedule,
  onDeleteSchedule,
  isDeleting
}: ScheduleActionsSidebarProps) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 space-y-6">
      <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Schedule Actions
      </div>
      <div className="space-y-4">
        <button 
          onClick={onCreateSchedule} 
          className="w-full rounded-xl px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Create Schedule
        </button>
        <button 
          onClick={onEditSchedule}
          className="w-full rounded-xl px-4 py-3 bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 border border-gray-200 dark:border-gray-600"
        >
          Edit Schedule
        </button>
        <button 
          onClick={onDeleteSchedule}
          disabled={!schedule || isDeleting}
          className="w-full rounded-xl px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-medium transition-all duration-200 border border-red-200 dark:border-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? 'Deleting...' : 'Delete Schedule'}
        </button>
      </div>
    </div>
  );
}
