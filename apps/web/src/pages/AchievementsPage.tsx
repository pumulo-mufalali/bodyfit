import React from 'react';
import { Trophy, Star, Zap, Award } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">My Achievements</h1>
      </div>
      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {achievements.map((ach, index) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ${
              !ach.date ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-2xl shadow-lg ${
                ach.date 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                  : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
              }`}>
                <ach.icon size={28} />
              </div>
              
              <div className="flex-1">
                <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{ach.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{ach.description}</p>
                
                {ach.date ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                      Unlocked on {ach.date}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{ach.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${ach.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {ach.date && (
              <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-center space-x-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                    Achievement Unlocked!
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Stats Summary */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200/50 dark:border-green-700/50">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {achievements.filter(a => a.date).length}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300 font-medium">Achievements Unlocked</div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {achievements.filter(a => !a.date).length}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">In Progress</div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-yellow-200/50 dark:border-yellow-700/50">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
              {Math.round((achievements.filter(a => a.date).length / achievements.length) * 100)}%
            </div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">Completion Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
