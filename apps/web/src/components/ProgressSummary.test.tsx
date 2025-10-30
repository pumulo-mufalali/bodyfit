import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressSummary } from './ProgressSummary';
import type { WorkoutLog } from '../lib/firebase-data-service';

describe('ProgressSummary', () => {
  const mockWorkouts: WorkoutLog[] = [
    {
      id: '1',
      date: new Date().toISOString().split('T')[0], // Today
      exerciseId: 'ex1',
      durationMinutes: 30,
      intensity: 'medium',
      caloriesBurned: 200,
    },
    {
      id: '2',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
      exerciseId: 'ex2',
      durationMinutes: 45,
      intensity: 'high',
      caloriesBurned: 350,
    },
  ];

  it('should render workout summary', () => {
    render(<ProgressSummary workouts={mockWorkouts} weightChange={-2.5} />);

    expect(screen.getByText(/Weekly Workouts/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Duration/i)).toBeInTheDocument();
    expect(screen.getByText(/Weight Change/i)).toBeInTheDocument();
  });

  it('should calculate weekly workout count', () => {
    render(<ProgressSummary workouts={mockWorkouts} weightChange={0} />);

    expect(screen.getByText('2')).toBeInTheDocument(); // Should show 2 workouts
  });

  it('should display weight change correctly', () => {
    render(<ProgressSummary workouts={[]} weightChange={-2.5} />);

    expect(screen.getByText(/-2.5/i)).toBeInTheDocument();
  });

  it('should handle empty workouts array', () => {
    render(<ProgressSummary workouts={[]} weightChange={0} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });
});

