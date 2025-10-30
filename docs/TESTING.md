# Testing Guide

This project includes comprehensive testing infrastructure with unit tests, component tests, E2E tests, and visual regression testing.

## Test Types

### 1. Unit & Component Tests (Vitest + React Testing Library)

Located in `apps/web/src/**/*.test.{ts,tsx}`

**Run tests:**
```bash
# Run all tests
pnpm --filter @myfitness/web test

# Run tests in watch mode
pnpm --filter @myfitness/web test

# Run tests with UI
pnpm --filter @myfitness/web test:ui

# Run with coverage report
pnpm --filter @myfitness/web test:coverage
```

**Coverage thresholds:**
- Lines: 60%
- Functions: 60%
- Branches: 60%
- Statements: 60%

**Test files:**
- `utils/*.test.ts` - Utility function tests (retry, circuit-breaker, error-handler, unit-conversion)
- `components/*.test.tsx` - Component tests (StatCard, ErrorBoundary, ProgressSummary)

### 2. End-to-End Tests (Playwright)

Located in `apps/web/e2e/**/*.spec.ts`

**Run E2E tests:**
```bash
# Run all E2E tests
pnpm --filter @myfitness/web test:e2e

# Run with UI mode
pnpm --filter @myfitness/web test:e2e:ui

# Run specific test file
pnpm --filter @myfitness/web test:e2e e2e/auth.spec.ts
```

**E2E test files:**
- `e2e/auth.spec.ts` - Authentication flow tests
- `e2e/navigation.spec.ts` - Navigation tests
- `e2e/workout-logging.spec.ts` - Workout logging flow tests

**Setup:**
```bash
# Install Playwright browsers (first time only)
npx playwright install
```

### 3. Visual Regression Testing (Storybook)

Located in `apps/web/src/**/*.stories.tsx`

**Run Storybook:**
```bash
# Start Storybook dev server
pnpm --filter @myfitness/web storybook

# Build static Storybook
pnpm --filter @myfitness/web build-storybook
```

**Storybook files:**
- `components/StatCard.stories.tsx` - StatCard component stories
- `components/ProgressSummary.stories.tsx` - ProgressSummary component stories

## Test Structure

### Unit Tests Example

```typescript
import { describe, it, expect } from 'vitest';
import { convertWeight } from '../lib/unit-conversion';

describe('convertWeight', () => {
  it('should convert kg to lbs', () => {
    const result = convertWeight(100, 'imperial');
    expect(result).toBeCloseTo(220.5, 1);
  });
});
```

### Component Tests Example

```typescript
import { render, screen } from '@testing-library/react';
import StatCard from './StatCard';

describe('StatCard', () => {
  it('should render title and main value', () => {
    render(<StatCard title="Test" main="42" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});
```

### E2E Tests Example

```typescript
import { test, expect } from '@playwright/test';

test('should display login form', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByPlaceholder(/email/i)).toBeVisible();
});
```

### Storybook Stories Example

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import StatCard from './StatCard';

const meta = {
  title: 'Components/StatCard',
  component: StatCard,
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Total Workouts',
    main: '42',
  },
};
```

## Coverage Reports

Coverage reports are generated in the `coverage/` directory after running:

```bash
pnpm --filter @myfitness/web test:coverage
```

**Coverage formats:**
- HTML: `coverage/index.html` (view in browser)
- LCOV: `coverage/lcov.info` (for CI/CD)
- JSON: `coverage/coverage-final.json`

## CI/CD Integration

Tests run automatically in CI pipeline (`.github/workflows/ci.yml`):

1. **Lint** - ESLint checks
2. **Typecheck** - TypeScript validation
3. **Test** - Unit and component tests with coverage
4. **E2E** (optional) - Playwright tests (add to CI as needed)

## Best Practices

1. **Test naming**: Use descriptive test names that explain what is being tested
2. **Test isolation**: Each test should be independent
3. **Mock external dependencies**: Mock Firebase, API calls, etc.
4. **Test user interactions**: Use `@testing-library/user-event` for user actions
5. **Accessibility**: Test for accessibility with proper selectors
6. **E2E happy paths**: Focus E2E tests on critical user flows

## Mocking

### Firebase Mocking

```typescript
import { vi } from 'vitest';

vi.mock('../lib/firebase', () => ({
  db: {},
  auth: {},
}));
```

### API Mocking

```typescript
import { vi } from 'vitest';

vi.mock('../lib/trpc', () => ({
  trpc: {
    user: {
      getProfile: {
        query: vi.fn().mockResolvedValue({ name: 'Test User' }),
      },
    },
  },
}));
```

## Troubleshooting

### Coverage not generating

Ensure `@vitest/coverage-v8` is installed:
```bash
pnpm add -D --filter @myfitness/web @vitest/coverage-v8
```

### Playwright browsers not found

Install browsers:
```bash
npx playwright install
```

### Storybook build fails

Check that all Storybook dependencies are compatible versions:
```bash
pnpm install --filter @myfitness/web
```

## Future Improvements

- [ ] Add more component stories to Storybook
- [ ] Expand E2E test coverage for all critical flows
- [ ] Add visual regression testing with Chromatic
- [ ] Increase unit test coverage to 80%+
- [ ] Add integration tests for Firebase services
- [ ] Add performance testing

