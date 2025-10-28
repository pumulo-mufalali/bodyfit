import React from 'react';
import { motion } from 'framer-motion';

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M15 17H9a3 3 0 006 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CogIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 113.28 16.9l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82L4.41 3.28A2 2 0 116.24 1.45l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V1a2 2 0 114 0v.09c0 .6.4 1.15 1 1.51h.97a1.65 1.65 0 001.82-.33l.06-.06A2 2 0 1120.72 4.1l-.06.06a1.65 1.65 0 00-.33 1.82V7a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09c-.6 0-1.15.4-1.51 1z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HeaderBar({ title, weekLine, onNav }: { title: string; weekLine?: string; onNav?: (page: string) => void }) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center space-x-6">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          {title}
        </motion.h1>
      </div>

      <div className="flex items-center gap-4">
        {weekLine && (
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl">
            {weekLine}
          </div>
        )}
        
        {onNav && (
          <button
            onClick={() => onNav('exercises')}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Exercise with Timer
          </button>
        )}
      </div>
    </div>
  );
}
