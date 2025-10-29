import React from 'react';
import { motion } from 'framer-motion';

export default function HeaderBar({ title, weekLine, onNav }: { title: string; weekLine?: string; onNav?: (page: string) => void }) {
  return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-5xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent"
            >
              {title}
            </motion.h1>
          </div>

          <div className="flex items-center gap-6">
            {weekLine && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700"
              >
                {weekLine}
              </motion.div>
            )}
            
            {onNav && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.preventDefault();
                  onNav?.('exercises');
                }}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl border border-blue-500/20"
              >
                Exercise with Timer
              </motion.button>
            )}
          </div>
        </div>
      </div>
  );
}
