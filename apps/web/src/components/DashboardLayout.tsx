import React from 'react';
import Sidebar from './Sidebar';
import HeaderBar from './HeaderBar';
import StatCard from './StatCard';
import StatsChart from './StatsChart';
import MotivationBanner from './MotivationBanner';
import ProgressModal from './ProgressModal';
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
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-900 text-black dark:text-white">
      <div className="container mx-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <Sidebar profile={profile} onNav={onNav} />
        </div>

        <div className="lg:col-span-9 space-y-6">
          {centerPage === 'goals' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <div className="bg-card rounded-xl p-4 shadow-sm">
                    <MyGoalsPage />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <div className="bg-card rounded-xl p-4 shadow-sm space-y-4">
                    <div className="text-lg font-semibold">Goal Insights</div>
                    <div className="space-y-2">
                      <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">Goals in progress</div>
                        <div className="text-2xl font-bold mt-1">3</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">Completed this month</div>
                        <div className="text-2xl font-bold mt-1">2</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">Average completion</div>
                        <div className="text-2xl font-bold mt-1">85%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : centerPage === 'profile' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ProfilePage onClose={() => onNav?.('dashboard')} />
              </div>
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-card rounded-xl p-4 shadow-sm space-y-4">
                  <div className="text-lg font-semibold">Account Details</div>
                  <div className="space-y-2">
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Member Since</div>
                      <div className="text-xl font-bold mt-1">June 2018</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Last Active</div>
                      <div className="text-xl font-bold mt-1">Today</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Subscription</div>
                      <div className="text-xl font-bold mt-1">Pro Member</div>
                    </div>
                  </div>
                </div>
                <MotivationBanner />
              </div>
            </div>
          ) : (
            <>
              <div className="bg-card rounded-xl p-4 shadow-sm">
                <HeaderBar title="TRACK FITNESS" weekLine="Day 2, Week 6 — 7th June, 2018" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <div className="bg-card rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">Goal</div>
                        <div className="text-2xl font-bold">Build Muscles</div>
                      </div>
                    </div>

                    <div 
                      ref={scrollRef}
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      className={`mt-4 flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x hide-scrollbar ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
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
                  <div className="bg-card rounded-xl p-4 shadow-sm h-full">
                    <div className="text-sm text-muted-foreground">Quick Actions</div>
                    <div className="mt-4 space-y-3">
                      <button className="w-full rounded-md px-3 py-2 bg-white/80 dark:bg-gray-800">Log workout</button>
                      <button className="w-full rounded-md px-3 py-2 bg-white/80 dark:bg-gray-800">Add meal</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-card rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-medium">Statistics — Last Month</div>
                      <a className="text-sm text-blue-600">Detailed View</a>
                    </div>

                    <StatsChart labels={labels} />

                    <div className="mt-3 flex space-x-2">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">Exercise</span>
                      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700">Meals</span>
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">Sleep</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1 space-y-4">
                  <MotivationBanner />
                  <div className="bg-card rounded-xl p-4 shadow-sm">Other widgets</div>
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
        </div>
      </div>
    </div>
  );
}
