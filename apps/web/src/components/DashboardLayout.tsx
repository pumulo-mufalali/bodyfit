import React from 'react';
import Sidebar from './Sidebar';
import HeaderBar from './HeaderBar';
import StatCard from './StatCard';
import StatsChart from './StatsChart';

import ProgressModal from './ProgressModal';
import { MotivationCard } from './MotivationCard';
import type { User } from '@myfitness/shared';
import { mockWorkoutLogs, mockWeightHistory } from '../lib/mock-data';
import type { WorkoutLog } from '../lib/mock-data';


// Helper to get last N days data
const getLastNDaysData = (days: number) => {
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    // Mock some consistent but random-looking data based on the date
    const value = Math.round(20 + Math.sin(date.getDate() / 3) * 5);
    result.push({ date: date.toISOString().split('T')[0], value });
  }
  return result;
};

import MyGoalsPage from '../pages/MyGoalsPage';
import ProfilePage from './ProfilePage';
import SchedulePage from '../pages/SchedulePage';
import CreateScheduleForm from './CreateScheduleForm';
import AchievementsPage from '../pages/AchievementsPage';
import DetailedStatsModal from './DetailedStatsModal';

export default function DashboardLayout({
  profile,
  onNav,
  onOpenGif,
  centerPage,
}: {
  profile?: User | null;
  onNav?: (page: string) => void;
  onOpenGif?: (exerciseId: string) => void;
  centerPage?: 'dashboard' | 'goals' | 'gifs' | string;
}) {
  const labels = Array.from({ length: 12 }).map((_, i) => `W${i + 1}`);
  const [modalStat, setModalStat] = React.useState<null | {
    title: string;
    progress?: { value: number; total: number };
    data?: { date: string; value: number }[] | WorkoutLog[];
    isExercise?: boolean;
  }>(null);

  // click-and-drag horizontal scrolling refs/state
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const isDraggingRef = React.useRef(false);
  const startXRef = React.useRef(0);
  const scrollLeftRef = React.useRef(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [showCreateScheduleForm, setShowCreateScheduleForm] = React.useState(false);
  const [showDetailedStats, setShowDetailedStats] = React.useState(false);

  // Data for StatCards and DetailedStatsModal
  const totalExercises = mockWorkoutLogs.length;
  const totalExerciseMinutes = mockWorkoutLogs.reduce((acc, log) => acc + log.durationMinutes, 0);
  const totalMeals = 6; // From StatCard
  const totalCalories = 1604; // From StatCard
  const averageSleep = 8; // From StatCard

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    // capture the pointer on the element so we continue to receive events
    try {
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    } catch {}
    startXRef.current = e.clientX;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || !isDraggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    el.scrollLeft = scrollLeftRef.current - dx;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    } catch {}
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-green-200/20 dark:bg-green-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <Sidebar profile={profile} onNav={onNav} />
        </div>

        <div className="lg:col-span-9 space-y-6">
          {centerPage === 'goals' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
                    <MyGoalsPage />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 space-y-6">
                    <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Goal Insights</div>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Goals in progress</div>
                        <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-2">3</div>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-xl border border-green-200/50 dark:border-green-700/50">
                        <div className="text-sm text-green-600 dark:text-green-400 font-medium">Completed this month</div>
                        <div className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">2</div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                        <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">Average completion</div>
                        <div className="text-3xl font-bold text-purple-700 dark:text-purple-300 mt-2">85%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : centerPage === 'profile' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
                  <ProfilePage onClose={() => onNav?.('dashboard')} />
                </div>
              </div>
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 space-y-6">
                  <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Account Details</div>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                      <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Member Since</div>
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-2">June 2018</div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-xl border border-green-200/50 dark:border-green-700/50">
                      <div className="text-sm text-green-600 dark:text-green-400 font-medium">Last Active</div>
                      <div className="text-2xl font-bold text-green-700 dark:text-green-300 mt-2">Today</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                      <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">Subscription</div>
                      <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-2">Pro Member</div>
                    </div>
                  </div>
                </div>
                <MotivationCard />
              </div>
            </div>
          ) : centerPage === 'schedule' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
                  <SchedulePage />
                </div>
              </div>
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 space-y-6">
                  <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Schedule Actions</div>
                  <div className="space-y-4">
                    <button 
                      onClick={() => setShowCreateScheduleForm(true)} 
                      className="w-full rounded-xl px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Create Schedule
                    </button>
                    <button className="w-full rounded-xl px-4 py-3 bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 border border-gray-200 dark:border-gray-600">
                      Edit Schedule
                    </button>
                    <button className="w-full rounded-xl px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-medium transition-all duration-200 border border-red-200 dark:border-red-800">
                      Delete Schedule
                    </button>
                  </div>
                </div>
                <MotivationCard />
              </div>
            </div>
          ) : centerPage === 'achievements' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">My Achievements</h1>
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
                    <AchievementsPage />
                  </div>
                </div>
                <div className="lg:col-span-1 space-y-6">
                  <MotivationCard />
                </div>
              </div>
            </div>

          ) : (
            <>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
                <HeaderBar title="TRACK FITNESS" weekLine="Day 2, Week 6 — 7th June, 2018" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Current Goal</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Build Muscles</div>
                      </div>
                    </div>

                    <div 
                      ref={scrollRef}
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      className={`mt-6 flex overflow-x-auto gap-6 pb-4 -mx-6 px-6 snap-x hide-scrollbar ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    >
                      <StatCard 
                        title="Exercises" 
                        main={`${mockWorkoutLogs.length} Exercises`}
                        sub={`${mockWorkoutLogs.reduce((acc, log) => acc + log.durationMinutes, 0)} mins`}
                        progress={{ value: mockWorkoutLogs.length, total: 10 }}
                        gradientClass="from-cyan-400 to-blue-500"
                        onOpen={() => setModalStat({
                          title: 'Exercises',
                          progress: { value: mockWorkoutLogs.length, total: 10 },
                          data: mockWorkoutLogs,
                          isExercise: true
                        })}
                      />
                      <StatCard 
                        title="Meals" 
                        main="6 Meals" 
                        sub="1604 cal" 
                        progress={{ value: 4, total: 6 }}
                        gradientClass="from-orange-400 to-pink-500"
                        onOpen={() => setModalStat({
                          title: 'Meals',
                          progress: { value: 4, total: 6 },
                          data: Array.from({ length: 7 }, (_, i) => ({
                            date: (new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]) as string,
                            value: Math.round(Math.random() * 500 + 1200)
                          }))
                        })}
                      />
                      <StatCard 
                        title="Sleep" 
                        main="8 hours"
                        sub="Good quality"
                        progress={{ value: 8, total: 8 }}
                        gradientClass="from-green-400 to-teal-400"
                        onOpen={() => setModalStat({
                          title: 'Sleep',
                          progress: { value: 8, total: 8 },
                          data: Array.from({ length: 7 }, (_, i) => ({
                            date: (new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]) as string,
                            value: Math.round(Math.random() * 2 + 6)
                          }))
                        })}
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 h-full">
                    <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">Quick Actions</div>
                    <div className="space-y-4">
                      <button className="w-full rounded-xl px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        Log workout
                      </button>
                      <button className="w-full rounded-xl px-4 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        Add meal
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Statistics — Last Month</div>
                      <button 
                        onClick={() => setShowDetailedStats(true)} 
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                      >
                        Detailed View →
                      </button>
                    </div>

                    <StatsChart labels={labels} />

                    <div className="mt-6 flex space-x-3">
                      <span className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm">Exercise</span>
                      <span className="px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-medium text-sm">Meals</span>
                      <span className="px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium text-sm">Sleep</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                  <MotivationCard />
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
                    <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">Additional Widgets</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">More features coming soon...</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {modalStat && (
            <ProgressModal
              open={Boolean(modalStat)}
              title={modalStat.title}
              progress={modalStat.progress}
              data={modalStat.data}
              isExercise={modalStat.isExercise}
              onClose={() => setModalStat(null)}
              onOpenGif={(id: string) => { setModalStat(null); onOpenGif?.(id); }}
            />
          )}

          {showCreateScheduleForm && (
            <CreateScheduleForm
              onClose={() => setShowCreateScheduleForm(false)}
              onSave={(schedule) => {
                console.log('Saved schedule:', schedule);
                // Here you would typically handle the saved data, e.g., send it to an API
              }}
            />
          )}

          {showDetailedStats && (
            <DetailedStatsModal
              onClose={() => setShowDetailedStats(false)}
              labels={labels}
              totalExercises={totalExercises}
              totalExerciseMinutes={totalExerciseMinutes}
              totalMeals={totalMeals}
              totalCalories={totalCalories}
              averageSleep={averageSleep}
            />
          )}
        </div>
      </div>
    </div>
  );
}
