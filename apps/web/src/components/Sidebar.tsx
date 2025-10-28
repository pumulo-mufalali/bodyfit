import React from 'react';
import type { User } from '@myfitness/shared';
import { ThemeToggle } from './theme-toggle';
import { useAuth } from '../providers/auth-provider';
import { LogOut } from 'lucide-react';



interface NavItemProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}
const NavItem = ({ children, active, onClick }: NavItemProps) => (
  <li>
    <button
      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
        active 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  </li>
);



export function Sidebar({ profile, onNav }: { profile?: User | null; onNav?: (page: string) => void }) {
  const { logout } = useAuth();

  // Calculate BMI if height and weight are available
  const calculateBMI = () => {
    if (profile?.weightKg && profile?.weightKg > 0 && profile?.heightCm && profile?.heightCm > 0) {
      const heightInMeters = profile.heightCm / 100;
      const bmi = profile.weightKg / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-600 dark:text-blue-400" };
    if (bmi < 25) return { category: "Normal", color: "text-green-600 dark:text-green-400" };
    if (bmi < 30) return { category: "Overweight", color: "text-yellow-600 dark:text-yellow-400" };
    return { category: "Obese", color: "text-red-600 dark:text-red-400" };
  };

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(Number(bmi)) : null;

  return (
    <aside className="w-72 shrink-0 pr-4">
      <div className="sticky top-6 space-y-6">
        <button 
          onClick={() => onNav?.('profile')} 
          className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 relative group border border-white/20 dark:border-gray-700/50"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {profile?.name?.charAt(0) ?? 'U'}
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{profile?.name ?? 'User'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{profile?.age && profile.age > 0 ? `${profile.age} years old` : 'Age not set'}</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-3 text-center border border-blue-200/50 dark:border-blue-700/50">
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Height</div>
              <div className="font-bold text-blue-700 dark:text-blue-300">{profile?.heightCm && profile.heightCm > 0 ? `${profile.heightCm} cm` : 'Not set'}</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-3 text-center border border-green-200/50 dark:border-green-700/50">
              <div className="text-xs text-green-600 dark:text-green-400 font-medium">Weight</div>
              <div className="font-bold text-green-700 dark:text-green-300">{profile?.weightKg && profile.weightKg > 0 ? `${profile.weightKg} kg` : 'Not set'}</div>
            </div>
          </div>

          {/* BMI Display */}
          {bmi && bmiCategory && (
            <div className="mt-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-3 border border-purple-200/50 dark:border-purple-700/50">
              <div className="text-xs text-purple-600 dark:text-purple-400 font-medium text-center">BMI</div>
              <div className="flex items-center justify-between mt-1">
                <div className="font-bold text-purple-700 dark:text-purple-300">{bmi}</div>
                <div className={`text-xs font-medium ${bmiCategory.color}`}>{bmiCategory.category}</div>
              </div>
            </div>
          )}

          {/* Fitness Goal Display */}
          {profile?.fitnessGoal && (
            <div className="mt-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl p-3 border border-orange-200/50 dark:border-orange-700/50">
              <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">Fitness Goal</div>
              <div className="text-sm text-orange-700 dark:text-orange-300 mt-1 line-clamp-2">{profile.fitnessGoal}</div>
            </div>
          )}

          <div className="absolute inset-0 rounded-2xl border-2 border-blue-500/0 group-hover:border-blue-500/30 transition-all duration-300 pointer-events-none" />
        </button>

        <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
          <ul className="space-y-2">
            <NavItem onClick={() => onNav?.('dashboard')}>Home</NavItem>
            <NavItem onClick={() => onNav?.('goals')}>My Goals</NavItem>
            <NavItem onClick={() => onNav?.('profile')}>Profile Settings</NavItem>
            <NavItem onClick={() => onNav?.('schedule')}>Schedule</NavItem>
            <NavItem onClick={() => onNav?.('achievements')}>Achievements</NavItem>
            <NavItem>Statistics</NavItem>
            <NavItem>Settings</NavItem>
            <li className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <ThemeToggle />
            </li>
            <li className="pt-2">
              <button
                onClick={logout}
                className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center space-x-3 font-medium hover:shadow-md"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 shadow-xl border border-blue-200/50 dark:border-blue-700/50">
          <div className="text-center">
            <div className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CONGRATULATIONS!</div>
            <div className="mt-2 text-gray-600 dark:text-gray-400 text-sm">You have unlocked the "Expert" level.</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
