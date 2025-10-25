import React from 'react';
import type { User } from '@myfitness/shared';

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


interface NavItemProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}
const NavItem = ({ children, active, onClick }: NavItemProps) => (
  <li>
    <button
      className={`w-full text-left px-3 py-2 rounded-md transition ${active ? 'bg-blue-100 dark:bg-blue-900/30 font-semibold' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
      onClick={onClick}
    >
      {children}
    </button>
  </li>
);



export function Sidebar({ profile, onNav }: { profile?: User | null; onNav?: (page: string) => void }) {
  return (
    <aside className="w-72 shrink-0 pr-4">
      <div className="sticky top-6 space-y-6">
        <div className="bg-muted/80 dark:bg-muted/90 rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl font-semibold">{profile?.name?.charAt(0) ?? 'U'}</div>
            <div>
              <div className="text-lg font-semibold text-black dark:text-white">{profile?.name ?? 'User'}</div>
              <div className="text-sm text-muted-foreground">{profile?.age ? `${profile.age} years` : '—'}</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="bg-white/50 dark:bg-black/20 rounded-md p-2 text-center">
              <div className="text-xs">Height</div>
              <div className="font-medium">185 cm</div>
            </div>
            <div className="bg-white/50 dark:bg-black/20 rounded-md p-2 text-center">
              <div className="text-xs">Weight</div>
              <div className="font-medium">{profile?.weightKg ?? '76'} kg</div>
            </div>
          </div>
        </div>

        <nav className="bg-card rounded-xl p-4 shadow-sm">
          <ul className="space-y-1">
            <NavItem onClick={() => onNav?.('dashboard')}>Home</NavItem>
            <NavItem onClick={() => onNav?.('goals')}>My goals</NavItem>
            <NavItem>Schedule</NavItem>
            <NavItem>Achievements</NavItem>
            <NavItem>Statistics</NavItem>
            <NavItem>Settings</NavItem>
          </ul>
        </nav>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 shadow-sm text-sm">
          <div className="font-semibold">CONGRATULATIONS!</div>
          <div className="mt-2 text-muted-foreground">You have unlocked the "Expert" level.</div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
