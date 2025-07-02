# Testing Documentation

## Overview

This project uses a comprehensive testing strategy covering unit tests, integration tests, and end-to-end tests.

## Testing Stack

- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing utilities  
- **MSW** - API mocking for integration tests
- **Playwright** - End-to-end testing framework
- **Husky** - Git hooks for quality gates
- **Lint-staged** - Run tests on staged files

## Test Commands

```bash
# Unit & Integration Tests
npm run test                # Run all tests in watch mode
npm run test:coverage       # Run tests with coverage report
npm run test:integration    # Run integration tests only

# End-to-End Tests  
npm run test:e2e           # Run all E2E tests
npm run test:e2e:ui        # Run E2E tests with UI
npm run test:e2e:mobile    # Run mobile-specific E2E tests
npm run test:e2e:cross-browser # Run cross-browser E2E tests

# Quality Gates
npm run lint               # Run ESLint
npm run lint:fix          # Fix ESLint issues
npm run type-check         # TypeScript type checking
npm run test:full          # Run complete test suite
```

## Coverage Thresholds

The project maintains minimum coverage thresholds:
- **Branches**: 70%
- **Functions**: 70% 
- **Lines**: 70%
- **Statements**: 70%

## Pre-commit Hooks

Git hooks automatically run:
1. ESLint with auto-fix
2. Prettier formatting
3. Related unit tests for changed files

## CI/CD Pipeline

The GitHub Actions workflow includes:

### Quality Gate
- TypeScript type checking
- ESLint validation

### Testing Gate  
- Unit tests with coverage
- Integration tests
- Coverage reporting to Codecov

### E2E Gate
- Core user journey tests
- Cross-browser testing (main branch only)

## Test Structure

```
src/
├── test/
│   ├── components/        # Component unit tests
│   ├── hooks/            # Hook tests  
│   ├── utils/            # Utility tests
│   ├── integration/      # Integration tests
│   ├── mocks/           # Mock setup
│   └── setup.ts         # Test configuration
├── e2e/                 # End-to-end tests
└── coverage/            # Coverage reports
```

## Writing Tests

### Unit Tests
```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Integration Tests
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import AuthFlow from './AuthFlow';

describe('Authentication Flow', () => {
  beforeEach(() => {
    // Setup mocks
  });

  it('should complete login flow', async () => {
    render(<AuthFlow />);
    // Test implementation
  });
});
```

### E2E Tests
```typescript
import { test, expect } from '@playwright/test';

test('user can create event', async ({ page }) => {
  await page.goto('/events/create');
  await page.fill('input[name="title"]', 'Test Event');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=Event created')).toBeVisible();
});
```

## Test Coverage

View coverage reports:
- Terminal: `npm run test:coverage`
- HTML: Open `coverage/index.html` 
- Online: Codecov dashboard (CI/CD)

## Best Practices

1. **Test User Behavior** - Focus on user interactions, not implementation
2. **Use Test IDs** - Add `data-testid` for complex selectors
3. **Mock External Dependencies** - Use MSW for API calls
4. **Keep Tests Isolated** - Each test should be independent
5. **Test Edge Cases** - Cover error states and boundary conditions
6. **Maintain Test Data** - Use factories for consistent test data

## Debugging Tests

```bash
# Run tests in debug mode
npm run test:ui

# Run specific test file
npm run test src/components/MyComponent.test.tsx

# Run E2E tests with browser UI
npm run test:e2e:ui
```