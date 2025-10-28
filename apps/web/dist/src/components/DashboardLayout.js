import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import Sidebar from './Sidebar';
import HeaderBar from './HeaderBar';
import StatCard from './StatCard';
import StatsChart from './StatsChart';
import MotivationBanner from './MotivationBanner';
import ProgressModal from './ProgressModal';
import { mockWorkoutLogs } from '../lib/mock-data';
// Helper to get last N days data
const getLastNDaysData = (days) => {
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