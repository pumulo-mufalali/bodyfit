import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from './StatCard';

describe('StatCard component', () => {
  it('should render title and main value', () => {
    const mockOnOpen = vi.fn();
    render(
      <StatCard
        title="Total Workouts"
        main="42"
        icon={<span>🏋️</span>}
        onOpen={mockOnOpen}
      />
    );

    expect(screen.getByText('Total Workouts')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should call onOpen when clicked', async () => {
    const mockOnOpen = vi.fn();
    const { container } = render(
      <StatCard
        title="Test Card"
        main="10"
        onOpen={mockOnOpen}
      />
    );

    const card = container.querySelector('button');
    expect(card).toBeInTheDocument();
    
    if (card) {
      card.click();
      expect(mockOnOpen).toHaveBeenCalledTimes(1);
    }
  });

  it('should render without onOpen handler', () => {
    render(
      <StatCard title="Test" main="5" />
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render progress information', () => {
    render(
      <StatCard
        title="Progress"
        main="50"
        progress={{ value: 50, total: 100 }}
      />
    );

    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });
});

