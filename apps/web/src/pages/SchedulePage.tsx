import React, { useState } from 'react';
import EditDayScheduleForm from '../components/EditDayScheduleForm';

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
    <div className="bg-card rounded-xl p-4 shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-center">My Workout Schedule</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {days.map(day => (
          <div 
            key={day} 
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setEditingDay(day)}
          >
            <h2 className="font-bold text-xl mb-4 text-center text-gray-800 dark:text-white">{day}</h2>
            <ul className="space-y-3">
              {schedule[day.toLowerCase() as keyof typeof schedule].map((item, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.time}</span>
                  <span className="font-semibold text-sm text-gray-800 dark:text-white">{item.activity}</span>
                </li>
              ))}
            </ul>
          </div>
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
