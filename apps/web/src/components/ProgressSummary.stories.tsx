import type { Meta, StoryObj } from '@storybook/react';
import { ProgressSummary } from './ProgressSummary';
import type { WorkoutLog } from '../lib/firebase-data-service';

const meta = {
  title: 'Components/ProgressSummary',
  component: ProgressSummary,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProgressSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockWorkouts: WorkoutLog[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0] || new Date().toISOString(),
    exerciseId: 'ex1',
    durationMinutes: 30,
    intensity: 'medium',
    caloriesBurned: 200,
  },
  {
    id: '2',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || new Date().toISOString(),
    exerciseId: 'ex2',
    durationMinutes: 45,
    intensity: 'high',
    caloriesBurned: 350,
  },
];

export const Default: Story = {
  args: {
    workouts: mockWorkouts,
    weightChange: -2.5,
  },
};

export const NoWorkouts: Story = {
  args: {
    workouts: [],
    weightChange: 0,
  },
};

export const WeightGain: Story = {
  args: {
    workouts: mockWorkouts,
    weightChange: 1.5,
  },
};

export const ManyWorkouts: Story = {
  args: {
    workouts: Array.from({ length: 7 }, (_, i) => ({
      id: `workout-${i}`,
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || new Date().toISOString(),
      exerciseId: `ex${i % 5}`,
      durationMinutes: 30 + i * 5,
      intensity: ['low', 'medium', 'high'][i % 3] as 'low' | 'medium' | 'high',
      caloriesBurned: 200 + i * 20,
    })),
    weightChange: -3.0,
  },
};

