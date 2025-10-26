import React from 'react';
import { Trophy, Star, Zap, Award } from 'lucide-react';

const achievements = [
  { id: 1, icon: Trophy, title: 'First Workout', description: 'Completed your first workout session.', date: '2025-06-10', progress: 100 },
  { id: 2, icon: Star, title: 'Consistent Week', description: 'Worked out every day for a full week.', date: '2025-06-18', progress: 100 },
  { id: 3, icon: Zap, title: 'Cardio King', description: 'Ran 10km in a single session.', date: '2025-07-05', progress: 100 },
  { id: 4, icon: Award, title: 'Strength Milestone', description: 'Lifted a total of 1000kg in one workout.', date: '2025-08-01', progress: 100 },
  { id: 5, icon: Trophy, title: 'Monthly Goal', description: 'Achieved your primary goal for the month.', date: '2025-08-31', progress: 100 },
  { id: 6, icon: Star, title: 'Perfect Month', description: 'Followed your workout plan for a whole month.', date: '2025-09-30', progress: 100 },
  { id: 7, icon: Zap, title: 'Endurance Pro', description: 'Completed a 1-hour cardio session.', date: null, progress: 75 },
  { id: 8, icon: Award, title: 'Heavy Lifter', description: 'Bench press 100kg.', date: null, progress: 50 },
];

export default function AchievementsPage() {
  return (
    <React.Fragment>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {achievements.map(ach => (
            <div key={ach.id} className={`bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md flex items-center space-x-4 ${!ach.date ? 'opacity-60' : ''}`}>
              <div className={`p-3 rounded-full ${ach.date ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
                <ach.icon size={24} />
              </div>
              <div>
                <h2 className="font-bold text-lg">{ach.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{ach.description}</p>
                {ach.date ? (
                  <p className="text-xs text-gray-500 mt-1">Unlocked on {ach.date}</p>
                ) : (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${ach.progress}%` }}></div>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </React.Fragment>
  );
}
