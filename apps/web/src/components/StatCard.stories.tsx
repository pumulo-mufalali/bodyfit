import type { Meta, StoryObj } from '@storybook/react';
import StatCard from './StatCard';

const meta = {
  title: 'Components/StatCard',
  component: StatCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    main: { control: 'text' },
    sub: { control: 'text' },
    onOpen: { action: 'clicked' },
  },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Total Workouts',
    main: '42',
    sub: 'This week',
  },
};

export const WithProgress: Story = {
  args: {
    title: 'Weekly Goal',
    main: '75%',
    sub: '3 of 4 workouts',
    progress: { value: 3, total: 4 },
  },
};

export const WithIcon: Story = {
  args: {
    title: 'Active Days',
    main: '5',
    sub: 'This week',
    icon: <span>🏋️</span>,
  },
};

export const Clickable: Story = {
  args: {
    title: 'Weight Progress',
    main: '70.5 kg',
    sub: 'Lost 2.5 kg',
    onOpen: () => console.log('Card clicked'),
  },
};

export const FullProgress: Story = {
  args: {
    title: 'Goal Achievement',
    main: '100%',
    progress: { value: 10, total: 10 },
    gradientClass: 'from-green-400 to-emerald-500',
  },
};

