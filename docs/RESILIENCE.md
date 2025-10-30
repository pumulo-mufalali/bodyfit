# Resilience and Error Handling Guide

This project implements retry logic with exponential backoff and circuit breaker patterns to handle transient failures gracefully.

## Features

### Retry Logic with Exponential Backoff

Automatic retries for transient failures with:
- Configurable max attempts (default: 3)
- Exponential backoff between retries
- Jitter to prevent thundering herd problem
- Smart error detection (only retries retryable errors)

### Circuit Breaker Pattern

Prevents cascading failures by:
- Opening circuit after failure threshold reached (default: 5 failures)
- Half-open state for recovery testing
- Automatic circuit closure after timeout (default: 30 seconds)
- Per-service circuit breakers for isolation

## Usage

### Firebase Services

All Firebase services (`weightService`, `workoutService`, `exerciseService`) automatically use resilience patterns:

```typescript
// Automatically retries with exponential backoff and circuit breaker protection
const weights = await weightService.getHistory(userId);
```

### Custom Implementation

Use `withResilience` for custom operations:

```typescript
import { withResilience } from '../utils/resilient-client';

const result = await withResilience(async () => {
  // Your async operation
  return await someFirestoreOperation();
}, {
  serviceName: 'my-service',
  retry: {
    maxAttempts: 3,
    initialDelayMs: 1000,
    maxDelayMs: 30000,
    shouldRetry: (error) => {
      // Custom retry logic
      return error.code !== 'permission-denied';
    }
  },
  circuitBreaker: {
    failureThreshold: 5,
    resetTimeoutMs: 30000
  }
});
```

### Direct Retry Usage

For operations that only need retry (no circuit breaker):

```typescript
import { withRetry } from '../utils/retry';

const result = await withRetry(async () => {
  return await someOperation();
}, {
  maxAttempts: 3,
  initialDelayMs: 1000
});
```

## Configuration

### Retry Options

- `maxAttempts`: Maximum retry attempts (default: 3)
- `initialDelayMs`: Initial delay before first retry (default: 1000ms)
- `maxDelayMs`: Maximum delay between retries (default: 30000ms)
- `backoffMultiplier`: Exponential multiplier (default: 2)
- `jitter`: Randomness factor 0-1 (default: 0.1)
- `shouldRetry`: Function to determine if error should be retried
- `onRetry`: Callback before each retry

### Circuit Breaker Options

- `failureThreshold`: Failures before opening circuit (default: 5)
- `resetTimeoutMs`: Time before attempting to close (default: 60000ms)
- `successThreshold`: Successes needed to close from half-open (default: 2)
- `onOpen`: Callback when circuit opens
- `onClose`: Callback when circuit closes
- `onHalfOpen`: Callback when circuit goes to half-open

## Retryable Errors

By default, the following errors are retried:
- Network errors (`network-request-failed`, `unavailable`)
- Timeout errors (`deadline-exceeded`)
- Server errors (5xx HTTP status codes)
- Rate limiting (429, `resource-exhausted`)

Non-retryable errors (not retried):
- Authentication errors (except network auth errors)
- Permission errors (`permission-denied`)
- Client errors (4xx except 429)
- Validation errors

## Monitoring

Check circuit breaker state:

```typescript
import { circuitBreakerManager } from '../utils/circuit-breaker';

// Get stats for all services
const stats = circuitBreakerManager.getAllStats();
console.log(stats); // { 'firestore-weight': { state: 'closed', failures: 0, ... } }

// Get stats for specific service
const breaker = circuitBreakerManager.getBreaker('firestore-weight');
const breakerStats = breaker.getStats();
```

## Best Practices

1. **Don't retry validation errors** - Fix the input instead
2. **Don't retry permission errors** - Fix authentication/authorization
3. **Use appropriate retry limits** - Too many retries can worsen problems
4. **Monitor circuit breaker state** - Track when circuits open/close
5. **Set reasonable timeouts** - Balance between user experience and recovery
6. **Use different circuit breakers per service** - Isolate failures

## Error Handling

Errors are caught and handled gracefully:

```typescript
try {
  await weightService.addEntry(userId, weight);
} catch (error) {
  if (error.name === 'CircuitBreakerOpenError') {
    // Circuit breaker is open - service unavailable
    showError('Service temporarily unavailable. Please try again later.');
  } else {
    // Other errors
    showError(error.message);
  }
}
```

## Testing

To test retry and circuit breaker behavior:

1. **Simulate network failures**: Disconnect network during operation
2. **Simulate service failures**: Mock Firestore errors
3. **Test circuit breaker**: Trigger multiple failures to open circuit
4. **Test recovery**: Verify circuit closes after timeout

## Performance Impact

- Retry logic adds minimal overhead (only on failures)
- Circuit breaker prevents wasted requests when service is down
- Exponential backoff prevents overwhelming failing services
- Jitter prevents synchronized retries from multiple clients

