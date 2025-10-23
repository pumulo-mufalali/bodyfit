import { motion } from "framer-motion";
import type { User } from "@myfitness/shared";
import { useState } from "react";

interface UserProfileCardProps {
  profile: User;
  onUpdateName: (name: string) => void;
  isUpdating: boolean;
}

export function UserProfileCard({ profile, onUpdateName, isUpdating }: UserProfileCardProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onUpdateName(name.trim());
      setName("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full p-3">
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Age: {profile.age} years</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Fitness Goal</h3>
          <p className="mt-1 text-sm text-blue-600 dark:text-blue-300">{profile.fitnessGoal || "No goal set"}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Update Name
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder={profile.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isUpdating || !name.trim()}
            >
              {isUpdating ? "Saving..." : "Save"}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}