import React, { useState } from 'react';
import { motion } from 'framer-motion';

const exerciseCategories = [
  {
    category: 'Cardio',
    exercises: [
      { id: 'ex1', name: 'Overhead Reach', imageUrl: 'https://media.self.com/photos/61157d860fba8918ef07da15/master/w_1600%2Cc_limit/SE_SEN_07_032_Cardio_GIF-01%2520Squat%2520to%2520Overhead%2520Reach-min.gif' },
      { id: 'ex2', name: 'Jumping Jacks', imageUrl: 'https://media.self.com/photos/61157e25553830ba14166ef2/master/w_1600%2Cc_limit/SE_SEN_07_032_Cardio_GIF-02%2520Modified%2520Jumping%2520Jacks-min.gif' },
      { id: 'ex3', name: 'Ice Skaters', imageUrl: 'https://media.self.com/photos/611581f6c66629131d52d34f/master/w_1600%2Cc_limit/SE_SEN_07_032_Cardio_GIF-13%2520Ice%2520Skaters-min.gif' },
      { id: 'ex4', name: 'Toe Taps With Reach', imageUrl: 'https://media.self.com/photos/61157ed6e1b6f66010ac3706/master/w_1600%2Cc_limit/SE_SEN_07_032_Cardio_GIF-04%2520Toe%2520Taps%2520With%2520Reach-min.gif' },
    ]
  },
  {
    category: 'Arms',
    exercises: [
      { id: 'ex5', name: 'Tricep Box Dips', imageUrl: 'https://media.self.com/photos/5c4a2f33203e3933090ec27b/master/w_1600%2Cc_limit/tricep-box-dips-Amanda_093.gif' },
      { id: 'ex6', name: 'Elevated Push Ups', imageUrl: 'https://media.self.com/photos/5c4a2e2601584d32459c06ce/master/w_1600%2Cc_limit/elevated-push-up-Amanda_091.gif' },
      { id: 'ex7', name: 'Diamond Push Ups', imageUrl: 'https://media.self.com/photos/5c41fa45a9cd1e7eb7fd0f2b/master/w_1600%2Cc_limit/diamond-push-up-Amanda_079.gif' },
      { id: 'ex8', name: 'Plank With T Rotation', imageUrl: 'https://media.self.com/photos/5c4b2809a9cd1e7eb7fd0f4d/master/w_1600%2Cc_limit/plank-with-t-rotation-Amanda_041.gif' },
    ]
  },
  {
    category: 'Legs',
    exercises: [
      { id: 'ex9', name: 'Split Squats', imageUrl: 'https://barbend.com/wp-content/uploads/2023/04/split-squat-barbend-movement-gif-masters.gif' },
      { id: 'ex10', name: 'Smith Machine Calf Raises', imageUrl: 'https://barbend.com/wp-content/uploads/2024/04/smith-machine-calf-raise-barbend-movement-gif-masters-1.gif' },
      { id: 'ex11', name: 'Nordic Hamstring Curls', imageUrl: 'https://barbend.com/wp-content/uploads/2023/03/nordic-hamstring-curl-barbend-movement-gif-masters.gif' },
      { id: 'ex12', name: 'Goblet Squats', imageUrl: 'https://barbend.com/wp-content/uploads/2023/12/goblet-squat-barbend-movement-gif-masters.gif' },
    ]
  },
  {
    category: 'Abs',
    exercises: [
      { id: 'ex13', name: 'Crunches', imageUrl: 'https://i.imgur.com/UJAnRhJ.gif' },
      { id: 'ex14', name: 'Russian Twist', imageUrl: 'https://i.imgur.com/PG6vgpl.gif' },
      { id: 'ex15', name: 'Side Jack-Knife', imageUrl: 'https://i.imgur.com/HjyLvkX.gif' },
      { id: 'ex16', name: 'Jack-knife ', imageUrl: 'https://i.imgur.com/CBH7Ejv.gif' },
    ]
  },
  {
    category: 'Stretches',
    exercises: [
      { id: 'ex17', name: 'Yoga Flow', imageUrl: 'https://assets.vogue.com/photos/5891df45fb0604bf1f5c6056/master/w_1600,c_limit/karlie-stretch-1.gif' },
      { id: 'ex18', name: 'Hamstring Stretch', imageUrl: 'https://assets.vogue.com/photos/5891df4a9c1609bf7a72e2eb/master/w_1600,c_limit/karlie-stretch-4.gif' },
      { id: 'ex19', name: 'Shoulder Stretch', imageUrl: 'https://assets.vogue.com/photos/5891df4b12a7b1df212c840d/master/w_1600,c_limit/karlie-stretch-5.gif' },
      { id: 'ex20', name: 'Neck Stretch', imageUrl: 'https://assets.vogue.com/photos/5891df48fb0604bf1f5c6058/master/w_1600,c_limit/karlie-stretch-3.gif' },
    ]
  },
];

export default function ExercisesPage({ onBack }: { onBack?: () => void }) {
  const [showGifModal, setShowGifModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<{id: string; name: string; imageUrl: string} | null>(null);
  const [timerMinutes, setTimerMinutes] = useState(1);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (isTimerRunning && (timerMinutes > 0 || timerSeconds > 0)) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prevSeconds) => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          } else if (timerMinutes > 0) {
            setTimerMinutes((prevMinutes) => prevMinutes - 1);
            return 59;
          } else {
            setIsTimerRunning(false);
            return 0;
          }
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, timerMinutes, timerSeconds]);

  const handleStartTimer = () => setIsTimerRunning(true);
  const handleStopTimer = () => setIsTimerRunning(false);
  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerMinutes(1);
    setTimerSeconds(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            )}
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Exercise Library
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Click on any exercise to view the GIF and start a timer
          </p>
        </div>

        {/* Display all categories with 4 GIFs per row */}
        <div className="space-y-12">
          {exerciseCategories.map((category) => (
            <div key={category.category}>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                {category.category}
              </h2>
              <div className="grid grid-cols-4 gap-6">
                {category.exercises.map((exercise) => (
                  <motion.button
                    key={exercise.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedExercise(exercise);
                      setShowGifModal(true);
                    }}
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 aspect-square"
                  >
                    <img
                      src={exercise.imageUrl}
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-4 py-3">
                      <span className="text-white font-semibold text-sm block">{exercise.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GIF Modal with Timer */}
      {showGifModal && selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowGifModal(false)} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/20 dark:border-gray-700/50 my-4"
          >
            <button
              onClick={() => setShowGifModal(false)}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              {selectedExercise.name}
            </h2>

            <div className="bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden mb-4 max-h-[50vh] flex items-center justify-center">
              <img
                src={selectedExercise.imageUrl}
                alt={selectedExercise.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 text-center">
                Exercise Timer
              </h3>
              
              <div className="text-center mb-4">
                <div className="text-4xl font-mono font-bold text-blue-600 dark:text-blue-400">
                  {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <div className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-lg px-4 py-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Minutes:</label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={timerMinutes}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      if (val >= 0 && val <= 99) {
                        setTimerMinutes(val);
                      }
                    }}
                    disabled={isTimerRunning}
                    className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-lg px-4 py-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Seconds:</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={timerSeconds}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      if (val >= 0 && val <= 59) {
                        setTimerSeconds(val);
                      }
                    }}
                    disabled={isTimerRunning}
                    className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-center mt-4">
                {!isTimerRunning ? (
                  <button
                    onClick={handleStartTimer}
                    disabled={timerMinutes === 0 && timerSeconds === 0}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Start
                  </button>
                ) : (
                  <button
                    onClick={handleStopTimer}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-2 0v6a1 1 0 102 0V7z" clipRule="evenodd" />
                    </svg>
                    Pause
                  </button>
                )}
                
                <button
                  onClick={handleResetTimer}
                  className="px-6 py-3 rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 border border-gray-300 dark:border-gray-600 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Reset
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}