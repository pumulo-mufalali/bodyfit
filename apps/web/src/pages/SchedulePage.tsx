import React, { useState } from 'react';
import EditDayScheduleForm from '../components/EditDayScheduleForm';
import { motion } from 'framer-motion';
import { Calendar, Clock, Activity } from 'lucide-react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const initialSchedule = {
  monday: [{ time: '10:00 AM', activity: 'Chest Day' }, { time: '6:00 PM', activity: 'Cardio' }],
  tuesday: [{ time: '11:00 AM', activity: 'Back Day' }],
  wednesday: [{ time: '8:00 AM', activity: 'Leg Day' }, { time: '7:00 PM', activity: 'Yoga' }],
  thursday: [{ time: '5:00 PM', activity: 'Shoulders' }],
  friday: [{ time: '9:00 AM', activity: 'Full Body Workout' }],
  saturday: [{ time: '11:00 AM', activity: 'Hiking' }],
  sunday: [{ time: 'All Day', activity: 'Rest' }],
};

interface ScheduleItem {
  time: string;
  activity: string;
}

export default function SchedulePage() {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [editingDay, setEditingDay] = useState<string | null>(null);

  const handleSaveDay = (day: string, items: ScheduleItem[]) => {
    setSchedule(prev => ({ ...prev, [day.toLowerCase()]: items }));
    setEditingDay(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">My Workout Schedule</h1>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {days.map((day, index) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 cursor-pointer hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            onClick={() => setEditingDay(day)}
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{day}</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto"></div>
            </div>
            
            <div className="space-y-3">
              {schedule[day.toLowerCase() as keyof typeof schedule].map((item, itemIndex) => (
                <motion.div
                  key={itemIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: itemIndex * 0.1 }}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 p-4 rounded-xl border border-gray-200/50 dark:border-gray-600/50 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-500/10 p-2 rounded-lg">
                        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="font-semibold text-sm text-gray-800 dark:text-white">{item.activity}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                Click to edit
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {editingDay && (
        <EditDayScheduleForm
          day={editingDay}
          initialItems={schedule[editingDay.toLowerCase() as keyof typeof schedule]}
          onClose={() => setEditingDay(null)}
          onSave={(items) => handleSaveDay(editingDay, items)}
        />
      )}
    </div>
  );
}
